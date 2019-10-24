

let fs = require('fs')
let content = fs.readFileSync('./css/print_index.css');
let replaceContent = content.toString().replace(/([+-]?(0|([1-9]\d*))(\.\d+)?)px/g,function(match,item){
    return ((parseFloat(item)/96)*25.4).toFixed(2)+'mm'
})
fs.writeFileSync('./css/print.css',replaceContent);

let printTplContent = fs.readFileSync('./js/printTplItem.js');
let newPrintTplContent = `var styleStr = \`${content.toString().replace('\'','"')};\` ${printTplContent.toString()}`;

fs.writeFileSync('./js/printTpl.js',newPrintTplContent)
