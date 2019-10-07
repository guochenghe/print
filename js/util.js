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