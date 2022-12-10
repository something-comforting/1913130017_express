const express = require('express')
const router = express.Router()
const companyController = require('../controllers/companyController')

router.get('/', companyController.index)
router.get('/:id', companyController.show)
router.post('/', companyController.insert)
router.put('/:id', companyController.update)
router.delete('/:id', companyController.destroy)

module.exports = router
