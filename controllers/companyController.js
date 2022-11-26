const company = {
  data: [
    {
      id: 1,
      name: 'Microsoft (Thailand)',
      address: {
        province: 'Bangkok',
        postcode: '10330'
      }
    },
    {
      id: 2,
      name: 'LINE MAN Wongnai',
      address: {
        province: 'Bangkok',
        postcode: '10110'
      }
    },
    {
      id: 3,
      name: 'Accenture Thailand',
      address: {
        province: 'Bangkok',
        postcode: '10110'
      }
    }
  ]
}

exports.index = (req, res) => {
  res.send(company)
}
