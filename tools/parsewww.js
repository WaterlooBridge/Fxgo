const xlsx = require('node-xlsx')
const fs = require('fs')
const path = require('path')

const sheets = xlsx.parse('./i18n.xlsx')
const langs = ['zh-cn', 'en-us']
const idPrefix = 's'

const targetIndex = 0
const hIndex = 6
let jsonData = {}

const initJsonData = () => {
  langs.forEach(lang => {
    jsonData[lang] = {}
  })
}

const loop = (index, cb) => {
  sheets[index].data.forEach(item => {
    let id = item[0]
    if (id) {
      id = id.toString().replace(/.*[^\d](\d*)$/, '$1')
      cb && cb(id, item)
    }
  })
}

const proccess = () => {
  loop(targetIndex, (id, item) => {
    langs.forEach((lang, index) => {
      let ct = item[index + 1]
      if (ct) {
        jsonData[lang][idPrefix + id] = ct.trim().replace(new RegExp('\\r\\n', 'g'), '<br/>')
      }
    })
  })
}

const handleHref = () => {
  loop(hIndex, (id, item) => {
    langs.forEach((lang, index) => {
      let ct = item[index + 1]
      if (ct) {
        jsonData[lang][`${idPrefix + id}a`] = ct.trim().replace('\r\n', '')
      }
    })
  })
}

const write = () => {
  fs.writeFileSync(path.join(__dirname, '../script/lang.js'), `var langMessages = ${JSON.stringify(jsonData, null, 2)}`)
}

const start = () => {
  initJsonData()
  proccess()
  // handleHref()
  write()
}

start()
