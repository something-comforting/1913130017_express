const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController')

router.get('/', staffController.index)
router.get('/:id', staffController.show)
router.post('/', staffController.insert)
router.put('/:id', staffController.update)
router.delete('/:id', staffController.destroy)

module.exports = router