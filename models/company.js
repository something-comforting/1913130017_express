const mongoose = require('mongoose')
const Schema = mongoose.Schema

const companySchema = new Schema(
  {
    name: String,
    address: {
      province: String
    }
  },
  { collection: 'setting' }
)

const company = mongoose.model('companies', companySchema)

module.exports = company
