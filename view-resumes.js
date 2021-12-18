const express = require('express')
const app = express()
const port = 4000
const fs = require('fs')
app.use(express.static('public'))

app.listen(port, () => {
  fs.readdir('public', function(err, files) {
    if (err) {
        console.log("Error getting directory information.")
      } else {
        files.forEach(function(file) {
          console.log(`http://localhost:${port}/${file}`)
        })
      }
  })
})