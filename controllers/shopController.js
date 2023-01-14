const fs = require('fs')
const path = require('path')
const uuidv4 = require('uuid')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)

const Shop = require('../models/shop')
const Menu = require('../models/menu')
const config = require('../config')

exports.index = async (req, res) => {
  const shop = await Shop.find().select('name photo location').sort({ _id: -1 })
  const shopWithPhotoDomain = shop.map((shop) => {
    return {
      id: shop._id,
      name: shop.name,
      photo: `${config.DOMAIN}images/${shop.photo}`,
      location: shop.location
    }
  })
  res.send({
    data: shopWithPhotoDomain
  })
}

exports.menu = async (req, res) => {
  const menu = await Menu.find().populate('shop')
  res.send({
    data: menu
  })
}

exports.show = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('menus')
    if (!shop) {
      const error = new Error('Shop not found')
      error.statusCode = 404
      throw error
    }
    res.send({ data: shop })
  } catch (err) {
    next(err)
  }
}

exports.insert = async (req, res, next) => {
  try {
    const { name, photo, location } = req.body
    let shop = new Shop({ name, location, photo: photo && (await saveImageToDisk(photo)) })
    await shop.save()
    res.status(201).json({ message: 'shop added successfully' })
  } catch (err) {
    next(err)
  }
}

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params
    const shop = await Shop.deleteOne({ _id: id })
    if (shop.deletedCount === 0) {
      const error = new Error('Shop not found')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ message: 'shop deleted successfully' })
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
