const fs = require('fs')
const path = require('path')
const uuidv4 = require('uuid')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const { validationResult } = require('express-validator')

const Staff = require('../models/staff')
const config = require('../config')

exports.index = async (req, res) => {
  const staff = await Staff.find().sort({ _id: '1' })
  const staffWithPhotoDomain = staff.map((staff) => {
    return {
      id: staff._id,
      name: staff.name,
      salary: staff.salary,
      photo: `${config.DOMAIN}images/${staff.photo}`
    }
  })
  res.send({ data: staffWithPhotoDomain })
}

exports.show = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id)
    if (!staff) {
      const error = new Error('Staff not found')
      error.statusCode = 404
      throw error
    }

    res.send({ data: staff })
  } catch (err) {
    next(err)
  }
}

exports.insert = async (req, res) => {
  try {
    const { name, salary, photo } = req.body
    // Validation
    const err = validationResult(req)
    if (!err.isEmpty()) {
      const err = new Error('Input is incorrect')
      err.statusCode = 422
      err.validation = err.array()
      throw err
    }
    const photoName = photo ? await saveImageToDisk(photo) : undefined
    let staffinsert = Staff({
      name: name,
      salary: salary,
      photo: photoName
    })
    const result = await staffinsert.save()
    return res.status(200).json({ message: `Insert Successful: ${result != null}` })
  } catch (e) {
    next(e)
  }
}

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, salary, photo } = req.body
    const staff = await Staff.updateOne(
      { _id: id },
      { name, salary, photo: photo && (await saveImageToDisk(photo)) }
    )
    if (staff.matchedCount === 0) {
      const error = new Error('Staff not found')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ message: 'staff updated successfully' })
  } catch (err) {
    next(err)
  }
}

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params
    const staff = await Staff.deleteOne({ _id: id })
    if (staff.deletedCount === 0) {
      const error = new Error('Staff not found')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ message: 'staff deleted successfully' })
  } catch (err) {
    next(err)
  }
}

const saveImageToDisk = async (baseImage) => {
  //find project path
  const projectPath = path.resolve('./')
  //create path to save image
  const uploadPath = `${projectPath}/public/images/`
  //find file extension
  const ext = baseImage.substring(baseImage.indexOf('/') + 1, baseImage.indexOf(';base64'))
  //create file name w/ file extension by generate uuid
  let filename = ''
  if (ext === 'svg+xml') {
    filename = `${uuidv4.v4()}.svg`
  } else {
    filename = `${uuidv4.v4()}.${ext}`
  }
  //extract base64 data
  let image = decodeBase64Image(baseImage)
  //write new file with new filename at path
  await writeFileAsync(uploadPath + filename, image.data, 'base64')
  //return new filename
  return filename
}

const decodeBase64Image = (base64Str) => {
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
  let image = {}
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string')
  }
  image.type = matches[1]
  image.data = matches[2]
  return image
}
