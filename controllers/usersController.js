const bio = {
  fullname: 'Thitiwat Teeramessiriyos',
  nickname: 'Unn',
  hobby: ['Sleep', 'Play games'],
  gitusername: 'something-comforting'
}

exports.index = (req, res, next) => {
  res.status(200).json({ fullname: 'Thitiwat Teeramessiriyos' })
}

exports.bio = (req, res) => {
  res.json(bio)
}