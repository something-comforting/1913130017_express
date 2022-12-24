const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shopController')

router.get('/', shopController.index)
router.get('/menu', shopController.menu)

module.exports = router
