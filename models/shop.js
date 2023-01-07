const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shopSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: 'nopic.png' },
    location: {
      lat: { type: Number },
      lgn: { type: Number }
    }
    // createdAt: { type: Date, default: Date.now }
    // updatedAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, collection: 'shops', timestamps: true }
)

shopSchema.virtual('menus', {
  ref: 'Menus',
  localField: '_id',
  foreignField: 'shop'
})

const shop = mongoose.model('Shops', shopSchema)
module.exports = shop
