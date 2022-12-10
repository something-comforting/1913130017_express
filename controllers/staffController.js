const Staff = require('../models/staff')

exports.index = async (req, res) => {
  const staff = await Staff.find().sort({ _id: '1' })
  res.send({ data: staff })
}

exports.show = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
    if (!staff) throw new Error('staff not found')
    res.send({ data: staff })
  } catch (err) {
    res.status(404).json({ message: 'error : ' + err.message })
  }
}

exports.insert = async (req, res) => {
  try {
    const { name, salary } = req.body
    const staff = new Staff({ name, salary })
    await staff.save()
    res.status(201).json({ message: 'staff added successfully' })
  } catch (err) {
    res.status(404).json({ message: 'error : ' + err.message })
  }
}

exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { name, salary } = req.body
    const staff = await Staff.updateOne({ _id: id }, { name, salary })
    if (staff.matchedCount === 0) throw new Error('staff not found')
    res.status(200).json({ message: 'staff updated successfully' })
  } catch (err) {
    res.status(404).json({ message: 'error : ' + err.message })
  }
}

exports.destroy = async (req, res) => {
  try {
    const { id } = req.params
    const staff = await Staff.deleteOne({ _id: id })
    if (staff.deletedCount === 0) throw new Error('staff not found')
    res.status(200).json({ message: 'staff deleted successfully' })
  } catch (err) {
    res.status(404).json({ message: 'error : ' + err.message })
  }
}
