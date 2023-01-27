const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')

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

    const err = validationResult(req)
    if (!err.isEmpty()) {
      const err = new Error('Input is incorrect')
      err.statusCode = 422
      err.validation = err.array()
      throw err
    }

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

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    // Validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error('Input is incorrect')
      error.statusCode = 422
      error.validation = errors.array()
      throw error
    }
    // Check user
    const isUserExist = await user.findOne({ email: email })
    if (!isUserExist) {
      const error = new Error("Login Error: Can't find this user")
      error.statusCode = 404
      throw error
    }
    // Check password
    const isValid = await isUserExist.checkPassword(password)
    if (!isValid) {
      const error = new Error('Login Error: Password is incorrect')
      error.statusCode = 401
      throw error
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: isUserExist._id,
        name: isUserExist.name,
        role: isUserExist.role
      },
      JWT_SECRET,
      { expiresIn: '5 days' }
    )
    const expired_in = jwt.decode(token)

    return res.status(200).json({
      access_token: token,
      expired_in: expired_in.exp,
      token_type: 'Bearer'
    })
  } catch (e) {
    next(e)
  }
}
