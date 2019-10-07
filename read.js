

let fs = require('fs')
let content = fs.readFileSync('./css/index.css')
let replaceContent = content.toString().replace(/([+-]?(0|([1-9]\d*))(\.\d+)?)px/g,function(match,item){
    console.log(match,item)
    return ((parseFloat(item)/96)*25.4).toFixed(2)+'mm'
})

console.log(replaceContent);
fs.writeFileSync('./css/print.css',replaceContent)