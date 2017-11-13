/* NODE */
const fs = require('fs')
const data = []

for (let day = 1; day <= 7; day++) {
  for (let hour = 1; hour <= 24; hour++) {
    const value = (Math.random() * 100).toFixed()
    data.push({ day, hour, value })
  }
}

fs.writeFileSync('data.json', JSON.stringify(data))