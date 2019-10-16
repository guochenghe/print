//将base64转换为文件对象
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(",");
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  //转换成file对象
  return new File([u8arr], filename, { type: mime });
  //转换成成blob对象
  //return new Blob([u8arr],{type:mime});
}
// debugger;
// window.onload = function(){
//     var pages = document.getElementById("printIframeContent");
//     html2canvas(pages).then(function(canvas) {
//         //Canvas2Image.saveAsJPEG(canvas);
//         var dataUrl = Canvas2Image.convertToJPEG(canvas).src
//         var fileObj = dataURLtoFile(dataUrl,'pic');
//         console.log(fileObj)
//     }).catch(function(e){});

//     window.print()
// }