const Company = require('../models/company')

exports.index = async (req, res) => {
  const company = await Company.find().sort({ _id: '1' })
  res.send({ data: company })
}

exports.show = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id)
    if (!company) {
      const error = new Error('Company not found')
      error.statusCode = 404
      throw error
    }
    res.send({ data: company })
  } catch (err) {
    next(err)
  }
}

exports.insert = async (req, res, next) => {
  try {
    const { name, address } = req.body
    const company = new Company({ name, address })
    await company.save()
    res.status(201).json({ message: 'Company added successfully' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, address } = req.body
    const company = await Company.updateOne({ _id: id }, { name, address })
    if (company.matchedCount === 0) {
      const error = new Error('Company not found')
      error.statusCode = 404
      throw error
    } 
    res.status(200).json({ message: 'Company updated successfully' })
  } catch (err) {
    next(err)
  }
}

exports.destroy = async (req, res) => {
  try {
    const { id } = req.params
    const company = await Company.deleteOne({ _id: id })
    if (company.deletedCount === 0) {
      const error = new Error('Company not found')
      error.statusCode = 404
      throw error
    } 
    res.status(200).json({ message: 'Company deleted successfully' })
  } catch (err) {
    res.status(404).json({ message: 'error : ' + err.message })
  }
}
