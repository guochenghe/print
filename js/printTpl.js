var PRINT_TPL = {
    examInfoTpl:'<span>时间：{wpTimes}分钟</span>\
    <span>满分：{fullScore}分</span>\
    <span>命卷人：{wpAuthor}</span>\
    <span>审核人：{wpAuthor}</span>',
    //选题题模块
    singleSelectTpl:'<div class="single-select answerModule" data-type="singleSelect">\
        <h3>选择题</h3>\
        <ul class="single-option module" id="singleOptionModule">\
        {singleSelectContent}\
        </ul>\
    </div>',
    singleSelectOptionTpl:'<li title-number="{questionNum}" data-answer="{answer}">\
        <em>{_index}</em>\
        {singleContent}\
    </li>',
    //填空题模块
    fillInBlankTpl:'<div class="completion-topic answerModule" data-type="fillInBlank">\
        <h3>填空题</h3>\
        <div class="module">\
            <div class="settingBtn" data-type="fillInBlank"></div>\
            <div class="subjectCol col-1" id="fillInBlank">\
                {fillInBlankContent}\
            </div>\
        </div>\
    </div>',
    fillInBlankItemTpl:'<div class="subjectItem" title-number="{questionNum}">\
    <span>{questionNum}、</span>\
    <em></em>\
    <strong>\
        <i></i>\
    </strong>\
</div>',
    //解答题模块
    shortAnswerTpl:'<div class="short-answer answerModule" data-type="answer" id="shortAnswerModule">\
        <h3>解答题</h3>\
        {shortAnswerContent}\
    </div>',
    shortAnswerItemTpl:'<div class="module" data-cutId="{questionNum}" data-editorIndex="{questionNum}" title-number="{questionNum}">\
    <div class="dragBtn"></div>\
    <div class="settingBtn" data-type="shortANswer"></div>\
    <div class="scortColumn">\
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
    <div class="dragBtn"></div>\
    <div class="settingBtn" data-type="shortANswer"></div>\
    <div class="scortColumn">\
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
    moduleTpl:'<div class="module" title-number="{titleNumber}" data-cutId="{moduleIndex}" data-editorIndex="{moduleIndex}">{moduleHtml}</div>',
    //小题
    overModuleTpl:
      '<div class="module pdt10" isSurplus title-number="{titleNumber}" data-linkparm="{linkparm}" data-cutId="{cutId}" data-editorIndex="{overIndex}"><div class="dragBtn"></div><div class="delBtn"></div>\
        <div id="toolbar{overIndex}" class="toolbar"></div>\
        <div id="editorContent{overIndex}" class="editorContent">\
        </div></div>',
    scanDotPaper1:'<div class="scan-dot">\
              <span data-option="bl" class=""></span>\
              <span data-option="br" class="right"></span>\
          </div>\
          <div class="scan-dot bot">\
              <span data-option="bl" class="left"></span>\
          </div>',
    scanDotPaper2:'<div class="scan-dot">\
              <span data-option="bl" class=""></span>\
              <span data-option="br" class="right"></span>\
          </div>\
          <div class="scan-dot bot">\
              <span data-option="bl" class="right"></span>\
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