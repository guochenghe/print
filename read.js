let fs = require('fs')
let content = fs.readFileSync('./css/print_index.css')
let replaceContent = content
  .toString()
  .replace(/([+-]?(0|([1-9]\d*))(\.\d+)?)px/g, function(match, item) {
    return ((parseFloat(item) / 96) * 25.4).toFixed(2) + 'mm'
  })
  .match(/\/\*printstyle:start\*\/([\s|\S]*)\/\*printstyle:end\*\//g)[0]

fs.writeFileSync('./css/print.css', replaceContent)

let printTplContent = fs.readFileSync('./js/printTplItem.js')
let newPrintTplContent = `var styleStr = \`${replaceContent
  .replace("'", '"')
  .replace(/(\n(.*)[^\s])/g, function(matchs, item) {
    var item1 = item.replace(/\n/g, '')
    return item1.replace(/\s*(.*)\s*/, function(c, d) {
      return d
    })
  })};\`\n ${printTplContent.toString()}`

fs.writeFileSync('./js/printTpl.js', newPrintTplContent)
