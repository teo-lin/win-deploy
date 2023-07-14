const fs = require('fs')
const util = require('util')
const path = require('path')

const filePath = path.join(process.cwd(), './interface/mods.json')
const readFileAsync = util.promisify(fs.readFile)
readFileAsync(filePath, 'utf8')
    .then(jsonFile => JSON.parse(jsonFile))
    .then(jsonData => console.log(typeof jsonData))
    .catch(error => console.error(error))