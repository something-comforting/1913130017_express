const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, default: 100 },
    shop: { type: Schema.Types.ObjectId, ref: 'Shops' }
  },
  { collection: 'menus', timestamps: true }
)

const menu = mongoose.model('Menus', menuSchema)
module.exports = menu
