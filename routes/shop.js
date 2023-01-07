const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shopController')

router.get('/', shopController.index)
router.get('/menu', shopController.menu)
router.get('/:id', shopController.show)
router.post('/', shopController.insert)
router.delete('/:id', shopController.destroy)
module.exports = router
