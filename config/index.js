require('dotenv').config()
module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT,
  DOMAIN: process.env.DOMAIN,
  JWT_SECRET: process.env.JWT_SECRET
}
