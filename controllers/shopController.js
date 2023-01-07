const Shop = require('../models/shop')
const Menu = require('../models/menu')
const config = require('../config')
exports.index = async (req , res) => {
  const shop = await Shop.find()
    .select('name photo location')
    .sort({ _id: -1 });
  const shopWithPhotoDomain = shop.map((shop) => {
    return {
      id: shop._id,
      name: shop.name,
      photo: `${config.DOMAIN}images/${shop.photo}`,
      location: shop.location,
    }
  });
  res.send({
    data: shopWithPhotoDomain,
  });
}

exports.menu = async (req , res) => {
  const menu = await Menu.find()
    .populate('shop')
  res.send({
    data: menu,
  });
}

exports.show = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('menus')
    if (!shop) throw new Error('shop not found')
    res.send({ data: shop })
  } catch (err) {
    res.status(404).json({ message: 'error : ' + err.message })
  }
}