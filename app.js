const express = require('express')
const path = require('path');
const app = express()
const port = 3090

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
})

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})