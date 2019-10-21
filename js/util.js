String.prototype.substitute = function(data) {
    if (data && typeof(data) == 'object') {
        return this.replace(/\{([^{}]+)\}/g, function(match, key) {
            var value = data[key];
            return (value !== undefined) ? '' + value: '';
        });
    } else {
        return this.toString();
    }
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
     if(r!=null)return  unescape(r[2]); return null;

}


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

function UnitConversion() {
    /**
     * 获取DPI
     * @returns {Array}
    */
    this.conversion_getDPI =function () {
        var arrDPI = new Array;
        if (window.screen.deviceXDPI) {
            arrDPI[0] = window.screen.deviceXDPI;
            arrDPI[1] = window.screen.deviceYDPI;
        } else {
            var tmpNode = document.createElement("DIV");
            tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            document.body.appendChild(tmpNode);
            arrDPI[0] = parseInt(tmpNode.offsetWidth);
            arrDPI[1] = parseInt(tmpNode.offsetHeight);
            tmpNode.parentNode.removeChild(tmpNode);
        }
        return arrDPI;
    };
    /**
     * px转换为mm
     * @param value
     * @returns {number}
     */
    this.pxConversionMm = function (value) {
        
        var inch = value/this.conversion_getDPI()[0];
        var c_value = inch * 25.4;
        return c_value;
    };
    /**
     * mm转换为px
     * @param value
     * @returns {number}
    */
    this.mmConversionPx = function (value) {
        /**
         * in 英尺单位 1in = 25.4 mm
         */
        var inch = value/25.4;
        var c_value = inch*this.conversion_getDPI()[0];
        return c_value;
    }
}