const mongoose = require('mongoose')
const Schema = mongoose.Schema

const staffSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    salary: {
      type: Number
    },
    created: {
      type: Date,
      default: Date.now
    }
  },
  { collection: 'staffs' }
)
const staff = mongoose.model('Staffs', staffSchema)
module.exports = staff
