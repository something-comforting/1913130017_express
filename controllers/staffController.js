const Staff = require('../models/staff')

exports.index = async (req, res) => {
  const staff = await Staff.find()
  res.send({ data: staff })
}

exports.insert = async (req, res) => {
  // add data to database
  const { name, salary } = req.body
  const staff = new Staff({ name, salary })
  await staff.save()
  res.status(201).json({ message: 'staff added successfully' })
}
