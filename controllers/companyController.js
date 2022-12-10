const Company = require('../models/company')

exports.index = async (req, res) => {
  const company = await Company.findOne()
  res.send(company)
}
