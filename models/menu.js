const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, default: 100 },
    shop: { type: Schema.Types.ObjectId, ref: 'Shops' }
  },
  { toJSON: { virtuals: true }, collection: 'menus', timestamps: true }
)

const menu = mongoose.model('Menus', menuSchema)

menuSchema.virtual('price_vat').get(function() {
  return this.price * 1.07
})
module.exports = menu
