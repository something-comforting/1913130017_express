module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.json({
    status_code: statusCode,
    message: err.message
  })
}
