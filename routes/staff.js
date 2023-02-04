const express = require('express')
const router = express.Router()
const staffController = require('../controllers/staffController')
const { body } = require('express-validator')
const passportJWT = require('../middleware/passportJWT')

router.get('/', [passportJWT.isLogin], staffController.index)

router.get('/:id', staffController.show)
router.post(
  '/',
  [
    body('name').not().isEmpty().withMessage('Name cannot be empty.'),
    body('salary')
      .not()
      .isEmpty()
      .withMessage('Salary cannot be empty.')
      .isNumeric()
      .withMessage('Salary must be a number')
  ],
  staffController.insert
)
router.put('/:id', staffController.update)
router.delete('/:id', staffController.destroy)

module.exports = router
