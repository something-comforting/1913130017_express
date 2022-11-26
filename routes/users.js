const express = require('express')
const router = express.Router()

const bio = {
  fullname: 'Thitiwat Teeramessiriyos',
  nickname: 'Unn',
  hobby: ['Sleep', 'Play games'],
  gitusername: 'something-comforting'
}

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.status(200).json({ fullname: 'Thitiwat Teeramessiriyos' })
})

router.get('/bio', (req, res) => {
  res.json(bio)
})

module.exports = router
