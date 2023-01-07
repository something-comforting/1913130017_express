const fs = require('fs')
const path = require('path')
const uuidv4 = require('uuid')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)

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

exports.show = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
    if (!staff) throw new Error('staff not found')
    res.send({ data: staff })
  } catch (err) {
    res.status(404).json({ message: 'error : ' + err.message })
  }
}

exports.insert = async (req, res) => {
  try {
    const { name, salary, photo } = req.body
    const staff = new Staff({ name, salary, photo: photo && (await saveImageToDisk(photo)) })
    await staff.save()
    res.status(201).json({ message: 'staff added successfully' })
  } catch (err) {
    res.status(404).json({ message: 'error : ' + err.message })
  }
}

exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { name, salary, photo } = req.body
    const staff = await Staff.updateOne(
      { _id: id },
      { name, salary, photo: photo && (await saveImageToDisk(photo)) }
    )
    if (staff.matchedCount === 0) throw new Error('staff not found')
    res.status(200).json({ message: 'staff updated successfully' })
  } catch (err) {
    res.status(404).json({ message: 'error : ' + err.message })
  }
}

exports.destroy = async (req, res) => {
  try {
    const { id } = req.params
    const staff = await Staff.deleteOne({ _id: id })
    if (staff.deletedCount === 0) throw new Error('staff not found')
    res.status(200).json({ message: 'staff deleted successfully' })
  } catch (err) {
    res.status(404).json({ message: 'error : ' + err.message })
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
