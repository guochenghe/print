var styleStr = `
*{margin: 0;padding: 0;border:0;list-style: none;}

body{
    background: #ddd;
}
.printcontent{
    background: #fff;
}
.printcontent.column2 .pageContent{
    width: 50%;
}
.formatContent{
    display: none;
}
.pageContent{
    position: relative;
    background: #fff;
}
#preview-iframe{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 1000000;
}
#closeIframeBtn{
    position: fixed;
    width: 60px;
    height: 30px;
    z-index: 1000001;
    right: 20px;
    top: 20px;
    background: green;
    color: #fff;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
}
/* 打印需要的样式 开始 */
@page {
    size:"A3';
    margin: 0px ;
}
.printIframeContent{
    background: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    margin: 0 auto;
    position: relative;
}
.printIframeContent.column1 .pageContent{
    width: 100%;
}
.printIframeContent.column2 .pageContent{
    width: 50%;
}
.printIframeContent.column3 .pageContent{
    width: 33.33%;
}
.pageContent .pageLabel{
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    bottom: 15px;
    left: 50%;
    -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
    color: #999;
}
.pageContent .pageLabel .item{
    width: 85px;
    height: 22px;
    font-size: 12px;
    text-align: center;
    line-height: 22px;
}
.pageContent .pageLabel .size{
    position: relative;
    width: 0px;
    height: 0px;
    border-top: 11px solid #999;
    border-bottom: 11px solid #999;
    border-left: 42px solid #999;
    border-right: 42px solid #999;
}
.pageContent .pageLabel .size .itemContent{
    position: absolute;
    width:84px;
    height: 22px;
    left: -42px;
    top: -11px;
    color: #fff;
}
.pageContent .bindingLine{
    position: absolute;
    top:0;
    left: 0;
    height: 100%;
    width: 50px;
}
.pageContent .bindingLine img{
    position: absolute;
    width: 2px;
    height: 100%;
    right: 0;
    top: 50%;
    margin-top: -435px;
}
.pageContent .bindingLine .line{
    position: absolute;
    right:0;
    width: 12px;
    height: 100%;
}
.pageContent .bindingLine .line span{
    display: block;
    height: 340px;
    line-height: 340px;
    font-size: 12px;
    color: #999;
    -webkit-transform: rotate(-90deg);
    /* Firefox */
    -moz-transform: rotate(-90deg);
}
.pageContent .bindingLine .examineeInfo{
    position: absolute;
    width: 50px;
    top:50%;
    margin-top: -370px;
    left:0;
}
.pageContent .bindingLine .examineeInfo .item{
    height: 270px;
    padding:100px 0 ;
    font-style: normal;
}
.pageContent .bindingLine .examineeInfo .item em{
    display: block;
    width: 14px;
    margin-left: 20px;
    font-size: 14px;
    font-style: normal;
}
.pageContent .bindingLine .examineeInfo .item span{
    display: block;
    position: relative;
    width:20px;
    height: 200px;
    margin-left: 20px;
}
.dtk-content{
    padding: 50px  60px ;
}
.dtk-content .dtkName{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    height:60px;
    margin-bottom: 10px;

}
.dtk-content .dtkName textarea{
    display: block;
    width: 100%;
    height: 60px;
    text-align: center;
    resize: none;
    outline: none;
    font-size: 16px;
    border:1px solid #333
}
.dtk-content .examineeInfo{
    padding: 10px;
}
.dtk-content .examineeInfo .item{
    float:left;
    width: 290px;
    padding: 0 15px;
    font-style: normal;
}
.dtk-content .examineeInfo .item em{
    float:left;
    width: 40px;
    font-style: normal;
}
.dtk-content .examineeInfo .item span{
    position: relative;
    float: left;
    width: 250px;
    height: 20px;
}
.dtk-content .examInfo{
    height: 50px;
}
.dtk-content .examInfo span{
    float: left;
    width: 165px;
    line-height: 50px;
    text-align: center;
}

.dtk-content .noticeInfo{
    position: relative;
}
.dtk-content .noticeInfo .item{
    height: 100px;
}
.dtk-content .noticeInfo .title{
    position: relative;
    width: 36px;
}
.dtk-content .noticeInfo .title strong{
    display: block;
    width: 35px;
    line-height: 20px;
    text-align: right;
    font-size: 12px;
}
.dtk-content .noticeInfo .noticeDetail{
    width: 335px;
}
.dtk-content .noticeInfo .noticeDetail textarea{
    display: block;
    width: 335px;
    height: 100px;
    outline: none;
    resize: none;
    text-align: left;
    font-size:12px;
}
.dtk-content .noticeInfo .ewm{
    position: relative;
    width:140px;
    text-align: center;
    line-height: 100px;
}
.dtk-content .noticeInfo .ewm img{
    margin-top: 18px;
    width: 65px;
    height: 65px;
}
.dtk-content .noticeInfo .warning{
    width:150px;
    font-size:12px;
    line-height: 25px;
}
.dtk-content .noticeInfo .warning .mark span{
    position: relative;
    display: inline-block;
    width: 15px;
    height:10px;
}

.dtk-content .examNumber{
    padding: 10px 0;
}
.dtk-content .examNumber .ticketNumber{
    float: left;
    height: 220px;
}
.dtk-content .examNumber .numberCol{
    position: relative;
    width: 20px;
    font-size: 12px;
    text-align: center;
}
.dtk-content .examNumber .numberCol:last-child{
    border:0;
}
.dtk-content .examNumber .numberCol span{
    position: relative;
    display:block;
    width: 20px;
    height: 20px;
}
.dtk-content .examNumber .numberCol span i{
    display: block;
    position: relative;
    margin: 0 auto;
    top: 5px;
    width: 15px;
    height: 10px;
    font-style: normal;
    line-height: 10px;
    text-align: center;
    font-size:12px;
}
.dtk-content .examNumber .barCode{
    float: left;
    width: 135px;
    height: 200px;
    border:1px dashed #333;
}

.dtk-content h3{
    font-size: 14px ;
    color: #333;
    line-height: 30px ;
}
.dtk-content .module{
    position: relative;
    padding:10px;
    font-size: 12px ;
}
.dtk-content .short-answer .module{
    padding: 40px 10px 10px;
}
.dtk-content .short-answer .module.pdt10{
    padding-top: 10px;
}
.dtk-content .short-answer .module .selTopic{
    height: 15px;
    display: inline-block;
}
.dtk-content .short-answer .module .selTopic span{
    width: 40px;
    height: 15px;
    padding: 0 10px;
    line-height: 15px;
    text-align: center;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
}
.dtk-content .module .scortColumn{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
.dtk-content .module .scortColumn.col-16 span{
    width: 41px;
}
.dtk-content .module .scortColumn.col-29 span{
    width: 47px;
}
.dtk-content .module .scortColumn.col-49 span{
    width: 41px;
}
.dtk-content .module .scortColumn span{
    float: left;
    position: relative;
    height: 30px;
    text-align: center;
    line-height: 30px;
}
.dtk-content .module .scortColumn span:last-child{
    border-right:0;
}
.fl{float: left;}
.fr{float: right;}
.clearfix:after{
    content:'';
    display: block;
    clear: both;
}
.moduleBorder{
    position: absolute;
    background: #000;
    
}
.moduleBorder.top{
    width: 100%;
    height: 1px;
    left: 0;
    top:0;
}
.moduleBorder.right{
    width: 1px;
    height: 100%;
    right: 0;
    top:0;
}
.moduleBorder.bottom{
    width: 100%;
    height: 1px;
    left: 0;
    bottom:0;
}
.moduleBorder.left{
    width: 1px;
    height: 100%;
    left: 0;
    top:0;
}
.singleContent{
    width: 600px;
    position: relative;
}
.singleContent .module{
    border: none;
}
.single-option{
    float:left;
    width: 25%;
    max-height: 100px;
}

.single-option li em,
.single-option li span{
    float:left;
    width: 15px ;
    height: 12px ;
    text-align: center;
    line-height: 12px ;
    margin-right: 10px ;
    margin-bottom: 5px;
    font-style: normal;
}

.short-answer textarea{
    width: 100%;
    resize: vertical;
    outline: none;
}

/* 解答题 */
.short-answer .toolbar{
    position: absolute;
    width: 100%;
    top: -30px ;
    left: 0;
    z-index: 100000;
    border:1px  solid #999;
    background: #fff;
    display: none;
}
.short-answer .module:hover .toolbar{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}
.subjectCol{
    width: 100%;
}
.subjectCol.col-2 .subjectItem{
    float: left;
}
.subjectCol.col-1 .subjectItem{
    width: 100%;
}
.subjectCol.col-2 .subjectItem{
    width: 315px;
}
.subjectCol.col-3 .subjectItem{
    width: 205px;
}
.subjectCol .subjectItem{
    height: 40px ;
    line-height: 40px;
    padding-right: 10px;
    overflow: hidden;
}
.subjectCol .subjectItem span{
    float: left;
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 25px;
}
.subjectCol .subjectItem em{
    position: relative;
    float: left;
    height: 30px;
    width: calc(100% - 65px);
}
.subjectCol .subjectItem strong{
    float: left;
    position: relative;
    height: 30px;
    width: 30px;
}
.subjectCol .subjectItem strong i{
    width: 30px;
    height: 30px;
    border-right: 1px solid #333;
    font-style: normal;
    text-align: center;
    line-height: 30px;
}
.subjectCol .subjectItem strong i:last-child{
    border:0;
}
.short-answer .dragBtn{
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px ;
    height: 20px ;
    background:#fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjhCMzVFRDY3MTVGMTFFNDlGQkNENTdFRDZGRDREMzkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjhCMzVFRDc3MTVGMTFFNDlGQkNENTdFRDZGRDREMzkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2OEIzNUVENDcxNUYxMUU0OUZCQ0Q1N0VENkZENEQzOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2OEIzNUVENTcxNUYxMUU0OUZCQ0Q1N0VENkZENEQzOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjfkuQIAAADkSURBVHjaYpw5cyYDHuANpbfiUsCCRzMHCwvLHBDjz58/ikDqBzZFTLh0MzMzVwI1SoAwiI1LHS4DFP///18F40DZikQbwMbGNvPfv39w74HYQLEZRBuQkJDwLS0tDc4HsUFi2NQyEoiF/zB1pIYB0YAFyRZiXEJ9FzACowin6bNmzYIHIk4DBjwQaWbARrSQB7E3EG1ASEgIFzADIWcssBjRBggJCaUZGBj8gfFBbKBYOtEGAKPvvq6ubjsvLy8DCIPYIDGSChRg7muzsLBIg7FJjgWgjT8UFRWTQRjExqUOIMAALUlNWEZIWRwAAAAASUVORK5CYII=") no-repeat center;
    cursor: pointer;
}
.module:hover .settingBtn{
    display: block;
}
.module .settingBtn{
    display: none;
    position: absolute;
    top: 0;
    right: -30px;
    width: 30px ;
    height: 30px ;
    background:#999 url("data:image/png;base64,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") no-repeat center;
    background-size: 75%;
    cursor: pointer;
}
.short-answer .delBtn{
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    right: -20px;
    background: #f2f2f2;
    border:1px solid #ddd;
    cursor: pointer;
}
.short-answer .delBtn:after,
.short-answer .delBtn:before{
    content: "";
    position: absolute;
    width: 15px;
    height: 1px;
    background: #666;
    top: 50%;
    left: 50%;
    -webkit-transform:translate(-50%,-50%) rotate(-45deg);
            transform:translate(-50%,-50%) rotate(-45deg);
    -webkit-transform-origin: center;
            transform-origin: center;
}
.short-answer .delBtn:before{
    -webkit-transform:translate(-50%,-50%) rotate(45deg);
            transform:translate(-50%,-50%) rotate(45deg);
    -webkit-transform-origin: center;
            transform-origin: center;
}


.fl{float: left;}
.fr{float: right;}
.clearfix:after{
    content: "";
    display: block;
    clear: both;
}
.scan-dot{
    position: absolute;
    height: 20px;
    top: 20px;
    left: 60px;
    width: calc(100% - 120px);
}
.scan-dot.bot{
    top: auto;
    bottom: 20px ;
}
.scan-dot span{
    position: absolute;
    width: 40px ;
    height: 20px;
    left:0;
    top:0;
    background: #000;
}
.scan-dot span.center1{
    right: auto;
    left: 600px;
}
.scan-dot span.center2{
    left: auto;
    right: 600px;
}
.scan-dot span.right{
    left: auto;
    right:0;
}
/* 打印需要的样式 结束 */


/* 不要放到打印css里面 */
.hgc_print{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
}
.hgc_print .contentWrap{
    padding:20px;
    overflow: auto;
    background: #666;
}
.hgc_print .opratorArea{
    width: 250px;
    background: #fff;
}
.hgc_print .opratorArea .selOptions{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding-left: 10px;
    -webkit-box-flex: 1;
        -ms-flex: 1;
            flex: 1;
    -webkit-box-pack: start;
        -ms-flex-pack: start;
            justify-content: flex-start;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    line-height: 50px;
}
.hgc_print .opratorArea .selOptions span{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-right: 10px;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
}
.hgc_print .opratorArea .selOptions span input{
    margin-right:5px;
}
.hgc_print .opratorArea .layout .layoutList{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
        justify-content: space-around;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
}
.hgc_print .opratorArea .layoutList .layoutItem{
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    cursor: pointer;
}
.hgc_print .opratorArea .layoutItem span{
    width: 44px;
    height: 44px;
    border:1px solid #333;
    padding: 5px;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}
.hgc_print .opratorArea .layoutItem i{
    -webkit-box-flex:1;
        -ms-flex:1;
            flex:1;
    margin:0 2px;
    background: #999;
}
.hgc_print .opratorArea .layoutItem em{
    font-style: normal;
    font-size:12px;
}
.hgc_print .opratorArea .layoutItem .icon_current{
    display: none;
    position: absolute;
    width: 15px;
    height: 15px;
    top:50%;
    left:50%;
    -webkit-transform: translate(-50%,-95%);
            transform: translate(-50%,-95%);
    border-radius: 50%;
    border:1px solid green;
}
.hgc_print .opratorArea .layoutItem .icon_current:after,
.hgc_print .opratorArea .layoutItem .icon_current:before{
    content:"";
    position: absolute;
    width: 7px;
    height: 5px;
    border-bottom:1px solid green;
    border-left:1px solid green;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%) rotate(-45deg);
            transform: translate(-50%,-50%) rotate(-45deg);
}
.hgc_print .opratorArea .layoutItem.current span{
    border-color: green;
}
.hgc_print .opratorArea .layoutItem.current .icon_current{
    display: block;
}
.hgc_print .opratorArea h3{
    height: 30px;
    line-height: 30px;
    text-indent: 1em;
    text-align: left;
    font-size: 14px;
    color: #333;
    background: #d7d7d7;
}
.hgc_print .opratorArea .subjectList li{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
        justify-content: space-around;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    line-height: 40px;
    border-bottom:1px dashed #ddd;
    font-size:12px;
}
.hgc_print .opratorArea .subjectList li:last-child{
    border: none;
}
.hgc_print .opratorBtns{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    top: 20px;
    left: 20px;
}
.hgc_print .opratorBtns .previewBtn{
    width: 100px;
    height: 30px;
    margin:0 10px;
    text-align: center;
    line-height: 30px;
    background:green;
    color: #fff;
    cursor: pointer;
}

.hgc_modalBox{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: fixed;
    width: 100%;
    height:100%;
    background: rgba(0, 0, 00, .3);
    top: 0;
    left:0;
    z-index: 10000000;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
}
.hgc_modalBox .hgc_modal{
    width: 315px;
    padding-bottom: 10px;
    background: #fff;
}
.hgc_modal h2{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 30px;
    padding:0 10px;
    -webkit-box-pack: justify;
        -ms-flex-pack: justify;
            justify-content: space-between;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    background:#15ae68;
    color: #fff;
    font-size: 14px;
    
}
.hgc_modal h2 .close{
    width: 30px;
    height: 30px;
    position: relative;
    font-size: 20px;
    font-style: normal;
    text-align: center;
    cursor: pointer;
}
.hgc_modal h2 em{
    font-style: normal;
}

.hgc_modal .modalBtns{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
}
.hgc_modal .modalBtns span{
    width: 65px;
    height:25px;
    margin:0 10px;
    background: #15ae68;
    color: #fff;
    text-align: center;
    line-height: 25px;
    cursor: pointer;
}
.hgc_modal .modalBtns .cancel{
    background: #999;
    color: 3333;
}
.hgc_modal .modalContent{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    padding: 20px;
    -ms-flex-wrap: wrap;
        flex-wrap: wrap;
}
.hgc_modal .formItem{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    padding: 5px 0;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
}
.hgc_modal .formItem em{
    width: 75px;
    font-size: 14px;
    font-style: normal;
}
.hgc_modal .formItem input,
.hgc_modal .formItem select{
    height: 25px;
    border:1px solid #333;
    -webkit-box-flex:1;
        -ms-flex:1;
            flex:1;
    outline: none;
};` 
var PRINT_TPL = {
    examInfoTpl:'<span>时间：{wpTimes}分钟</span>\
    <span>满分：{fullScore}分</span>\
    <span>命卷人：{wpAuthor}</span>\
    <span>审核人：{wpAuthor}</span>',
    //用于打印pdf的html
    htmlSkeleton:'<!DOCTYPE html>\
    <html lang="en">\
    <head>\
        <meta charset="UTF-8">\
        <meta name="viewport" content="width=device-width, initial-scale=1.0">\
        <meta http-equiv="X-UA-Compatible" content="ie=edge">\
        <title>Document</title>\
        <style>'+styleStr+'</style>\
    </head>\
    <body>',
    //准考证区域
    examNumberItemTpl:'<li class="numberCol fl">\
    <span>\
        <b class="right moduleBorder"></b>\
        <b class="top moduleBorder"></b>\
        {firstColBorder}\
        <b class="bottom moduleBorder"></b>\
    </span>\
    <span>\
        <i>[0]</i>\
        <b class="right moduleBorder"></b>\
        {firstColBorder}\
    </span>\
    <span>\
        <i>[1]</i>\
        <b class="right moduleBorder"></b>\
        {firstColBorder}\
    </span>\
    <span>\
        <i>[2]</i>\
        <b class="right moduleBorder"></b>\
        {firstColBorder}\
    </span>\
    <span>\
        <i>[3]</i>\
        <b class="right moduleBorder"></b>\
        {firstColBorder}\
    </span>\
    <span>\
        <i>[4]</i>\
        <b class="right moduleBorder"></b>\
        {firstColBorder}\
    </span>\
    <span>\
        <i>[5]</i>\
        <b class="right moduleBorder"></b>\
        {firstColBorder}\
    </span>\
    <span>\
        <i>[6]</i>\
        <b class="right moduleBorder"></b>\
        {firstColBorder}\
    </span>\
    <span>\
        <i>[7]</i>\
        <b class="right moduleBorder"></b>\
        {firstColBorder}\
    </span>\
    <span>\
        <i>[8]</i>\
        <b class="right moduleBorder"></b>\
        {firstColBorder}\
    </span>\
    <span>\
        <i>[9]</i>\
        <b class="right moduleBorder"></b>\
        <b class="bottom moduleBorder"></b>\
        {firstColBorder}\
    </span>\
</li>',
    //选题题模块
    singleSelectTpl:'<div class="single-select answerModule clearfix" data-type="singleSelect">\
        <h3>选择题</h3>\
        <div class="singleContent clearfix"><i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>{singleSelectContent}</div>\
    </div>',
    singleSelectOptionTpl:'<li class="clearfix" title-number="{questionNum}" data-answer="{answer}">\
        <em>{_index}</em>\
        {singleContent}\
    </li>',
    //填空题模块
    fillInBlankTpl:'<div class="completion-topic answerModule" data-type="fillInBlank">\
        <h3>填空题</h3>\
        <div class="module">\
        <i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>\
            <div class="settingBtn" data-type="fillInBlank"></div>\
            <div class="subjectCol col-1 clearfix" id="fillInBlank">\
                {fillInBlankContent}\
            </div>\
        </div>\
    </div>',
    fillInBlankItemTpl:'<div class="subjectItem clearfix" title-number="{questionNum}">\
        <span>{questionNum}、</span>\
        <em><b class="bottom moduleBorder"></b></em>\
        <strong>\
        <b class="top moduleBorder"></b><b class="right moduleBorder"></b><b class="bottom moduleBorder"></b><b class="left moduleBorder"></b>\
            <i></i>\
        </strong>\
    </div>',
    moduleBorderTpl:'<i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>',
    //解答题模块
    shortAnswerTpl:'<div class="short-answer answerModule" data-type="answer" id="shortAnswerModule">\
        <h3>解答题</h3>\
        {shortAnswerContent}\
    </div>',
    shortAnswerItemTpl:'<div class="module" data-cutId="{questionNum}" data-editorIndex="{questionNum}" title-number="{questionNum}">\
    <i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>\
    <div class="dragBtn"></div>\
    <div class="settingBtn" data-type="shortANswer"></div>\
    <div class="scortColumn clearfix col-16">\
        {scoreColumnHtml}\
    </div>\
    <div id="toolbar{questionNum}" class="toolbar"></div>\
    <div id="editorContent{questionNum}" class="editorContent">\
        <div>{questionNum}、</div>\
    </div>\
</div>',
    //选做题模块
    chooseAnswerTpl:'<div class="short-answer answerModule" data-type="chooseAnswer" id="chooseAnswerModule">\
        <h3>选做题</h3>\
        {chooseAnswerContent}\
    </div>',
    chooseAnswerItemTpl:'<div class="module" data-cutId="{questionNum}" data-editorIndex="{questionNum}" title-number="{titleNumber}">\
    <i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>\
    <div class="dragBtn"></div>\
    <div class="settingBtn" data-type="shortANswer"></div>\
    <div class="scortColumn clearfix col-16">\
        {scoreColumnHtml}\
    </div>\
    <div id="toolbar{questionNum}" class="toolbar"></div>\
    <div id="editorContent{questionNum}" class="editorContent">\
        <div class="selTopic">{selOptionHtml}</div>\
        <div>{questionNum}、</div>\
    </div>\
</div>',
    printPageStyle:
      '<style id="pageSizeStyle">\
			.printcontent{width:{pageWidth}px;}\
			.pageContent{height:{pageHeight}px;}\
		</style>',
    pageModuleTpl:
      '<div class="pageContent" style="page-break-after:always;">\
                    <div class="dtk-content">{subjectModule}</div>\
                    <div class="pageLabel">\
                      <div class="number item">第{currentPage}页 共<b class="totalPage">{totalPage}</b>页</div>\
                      <div class="size item">\
                        <div class="itemContent">\
                          第{currentPaper}纸张页面<b class="currentPaperPage">{currentPaperPage}</b>\
                      </div>\
                      </div>\
                  </div>\
                </div>',
    //大题
    answerModuleTpl:
      '<div class="short-answer answerModule" data-type="{moduleType}">\
                            {editModule}\
                        </div>',
    moduleTitleTpl: '<h3>{title}</h3>',
    moduleTpl:'<div class="module" title-number="{titleNumber}" data-cutId="{moduleIndex}" data-editorIndex="{moduleIndex}"><i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>\
    {moduleHtml}</div>',
    //小题
    overModuleTpl:
      '<div class="module pdt10" isSurplus title-number="{titleNumber}" data-linkparm="{linkparm}" data-cutId="{cutId}" data-editorIndex="{overIndex}"><div class="dragBtn"></div><div class="delBtn"></div><i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>\
        <div id="toolbar{overIndex}" class="toolbar"></div>\
        <div id="editorContent{overIndex}" class="editorContent" style="height:{editorContentHeight}px;">\
        </div></div>',
    scanDotPaper1:'<div class="scan-dot">\
              <span data-option="bl" class=""></span>\
              <span data-option="bl" class="center1"></span>\
              <span data-option="br" class="right"></span>\
          </div>\
          <div class="scan-dot bot">\
              <span data-option="bl" class="left"></span>\
              <span data-option="br" class="right"></span>\
          </div>',
    scanDotPaper2:'<div class="scan-dot">\
              <span data-option="bl" class=""></span>\
              <span data-option="bl" class="center2"></span>\
              <span data-option="br" class="right"></span>\
          </div>\
          <div class="scan-dot bot">\
              <span data-option="bl" class="left"></span>\
              <span data-option="br" class="right"></span>\
          </div>',
    //打印的模版
    printIframeContentTpl:
      '{linkSrc}<div class="printIframeContent column{columns} {bindingLine}" style="width:{widthMm}mm;" id="printIframeContent">{printHtml}</div>{scriptSrc}',
    //填空题设置选项
    fillInBlankOptionTpl:
      '<div class="formItem">\
				<em>每行列数：</em>\
				<select id="fillInBlankColumn">\
					<option value="1">1</option>\
					<option value="2">2</option>\
					<option value="3">3</option>\
				</select>\
			</div>\
			<div class="formItem">\
				<em>分值格式：</em>\
				<select id="scoreStyle">\
					<option value="">自定义分值</option>\
					<option value="2/3/5">2/3/5</option>\
					<option value="2/3/4/6">2/3/4/6</option>\
					<option value="2/4">2/4</option>\
				</select>\
			</div>',
    //解答题设置选项
    shortAnswerOptionTpl:
      '<div class="formItem">\
			<em>分值上限：</em>\
			<select id="scoreLimit">\
				<option value="16">16分</option>\
				<option value="29">29分</option>\
				<option value="49">49分</option>\
			</select>\
		</div>'
  }