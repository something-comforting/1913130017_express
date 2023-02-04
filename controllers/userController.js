const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')

const User = require('../models/user')

const bio = {
  fullname: 'Thitiwat Teeramessiriyos',
  nickname: 'Unn',
  hobby: ['Sleep', 'Play games'],
  gitusername: 'something-comforting'
}

exports.index = (req, res) => {
  res.status(200).json({ fullname: 'Thitiwat Teeramessiriyos' })
}

exports.bio = (req, res) => {
  res.json(bio)
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const err = new Error('Input is incorrect')
      err.statusCode = 422
      err.validation = errors.array()
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
    user.role = req.role || 'member'
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
      const err = new Error('Input is incorrect')
      err.statusCode = 422
      err.validation = errors.array()
      throw err
    }
    // Check user
    const isUserExist = await User.findOne({ email: email })
    if (!isUserExist) {
      const err = new Error("Login Error: Can't find this user")
      err.statusCode = 404
      throw err
    }
    // Check password
    const isValid = await isUserExist.checkPassword(password)
    if (!isValid) {
      const err = new Error('Login Error: Password is incorrect')
      err.statusCode = 401
      throw err
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

exports.profile = async (req, res) => {
  const { role, name, email } = req.user
  res.status(200).json({
    name,
    email,
    role
  })
}
