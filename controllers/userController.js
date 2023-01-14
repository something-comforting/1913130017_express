const { model } = require('mongoose')
const User = require('../models/User')

const bio = {
  fullname: 'Thitiwat Teeramessiriyos',
  nickname: 'Unn',
  hobby: ['Sleep', 'Play games'],
  gitusername: 'something-comforting'
}

exports.index = (req, res, next) => {
  res.status(200).json({ fullname: 'Thitiwat Teeramessiriyos' })
}

exports.bio = (req, res) => {
  res.json(bio)
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const existEmail = await User.findOne({ email })
    if (existEmail) {
      const error = new Error('Email already exists')
      error.statusCode = 400
      throw error
    }
    
    let user = new User()
    user.name = name
    user.email = email
    user.password = await user.encryptPassword(password)

    await user.save()

    res.status(200).json({
      message: 'User added successfully'
    })
  } catch (err) {
    next(err)
  }
}
