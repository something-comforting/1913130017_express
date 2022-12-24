const Shop = require('../models/shop')
const Menu = require('../models/menu')

exports.index = async (req , res) => {
  const shop = await Shop.find()
    .select('name photo location')
    .sort({ _id: -1 });
  const shopWithPhotoDomain = shop.map((shop) => {
    return {
      id: shop._id,
      name: shop.name,
      photo: `http://localhost:3000/images/${shop.photo}`,
      location: shop.location,
    }
  });
  res.send({
    data: shopWithPhotoDomain,
  });
}

exports.menu = async (req , res) => {
  const shop = await Menu.find()
    .select('name price')
    .populate('shop', 'name')
    .sort({ _id: -1 });
  res.send({
    data: shop,
  });
}
