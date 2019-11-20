var PRINT_TPL = {
  examInfoTpl:
    '<span>时间：{wpTimes}分钟</span>\
    <span>满分：{fullScore}分</span>\
    <span>命卷人：{wpAuthor}</span>\
    <span>审核人：{wpAuthor}</span>',
  //用于打印pdf的html
  htmlSkeleton:
    '<!DOCTYPE html>\
    <html lang="en">\
    <head>\
        <meta charset="UTF-8">\
        <meta name="viewport" content="width=device-width, initial-scale=1.0">\
        <meta http-equiv="X-UA-Compatible" content="ie=edge">\
        <title>Document</title>\
        <style>' +
    styleStr +
    '</style>\
    </head>\
    <body>',
  //准考证区域
  examNumberItemTpl:
    '<li class="numberCol fl">\
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
  singleSelectTpl:
    '<div class="single-select answerModule clearfix" data-type="singleSelect">\
        <h3>单选题</h3>\
        <div class="singleContent clearfix"><i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>{singleSelectContent}</div>\
    </div>',
  moreSelectTpl:
    '<div class="single-select answerModule clearfix" data-type="moreSelect">\
        <h3>多选题</h3>\
        <div class="singleContent clearfix"><i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>{singleSelectContent}</div>\
    </div>',
  singleSelectOptionTpl:
    '<li class="clearfix" title-number="{questionNum}" data-answer="{answer}">\
        <em>{questionNum}</em>\
        {singleContent}\
    </li>',
  //填空题模块
  fillInBlankTpl:
    '<div class="completion-topic answerModule" data-type="fillInBlank">\
        <h3>填空题</h3>\
        <div class="module">\
        <i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>\
            <div class="settingBtn" data-type="fillInBlank"></div>\
            <div class="subjectCol col-1 clearfix" id="fillInBlank">\
                {fillInBlankContent}\
            </div>\
        </div>\
    </div>',
  fillInBlankItemTpl:
    '<div class="subjectItem clearfix" title-number="{questionNum}">\
        <span>{questionNum}、</span>\
        <em><b class="bottom moduleBorder"></b></em>\
        <strong>\
            <i><b class="top moduleBorder"></b><b class="right moduleBorder"></b><b class="bottom moduleBorder"></b><b class="left moduleBorder"></b></i>\
        </strong>\
    </div>',
  moduleBorderTpl:
    '<i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>',
  //解答题模块
  shortAnswerTpl:
    '<div class="short-answer answerModule" data-type="answer" id="shortAnswerModule">\
        <h3>解答题</h3>\
        {shortAnswerContent}\
    </div>',
  shortAnswerItemTpl:
    '<div class="module" data-cutId="{questionNum}" data-editorIndex="{questionNum}" title-number="{questionNum}">\
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
  chooseAnswerTpl:
    '<div class="short-answer answerModule" data-type="chooseAnswer" id="chooseAnswerModule">\
        <h3>选做题</h3>\
        {chooseAnswerContent}\
    </div>',
  chooseAnswerItemTpl:
    '<div class="module" data-cutId="{questionNum}" data-editorIndex="{questionNum}" title-number="{titleNumber}">\
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
                          第{currentPaper}张纸<b class="currentPaperPage">{currentPaperPage}</b>\
                      </div>\
                      </div>\
                  </div>\
                </div>',
  //大题
  answerModuleTpl:
    '<div class="short-answer answerModule" data-type="{moduleType}">\
                            {editModule}\
                        </div>',
  fillInBlankContentTpl:
    '<div class="module"> <i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>\
  <div class="subjectCol col-{columns} clearfix">{addFillInBlankHtml}</div>\
</div>',
  answerModulForFillInBlankTpl:
    '<div class="completion-topic answerModule" data-type="{moduleType}">\
                            {editModule}\
                        </div>',
  moduleTitleTpl: '<h3>{title}</h3>',
  moduleTpl:
    '<div class="module" title-number="{titleNumber}" data-cutId="{moduleIndex}" data-editorIndex="{moduleIndex}"><i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>\
    {moduleHtml}</div>',
  //小题
  overModuleTpl:
    '<div class="module pdt10" isSurplus title-number="{titleNumber}" data-linkparm="{linkparm}" data-cutId="{cutId}" data-editorIndex="{overIndex}"><div class="dragBtn"></div><div class="delBtn"></div><i class="top moduleBorder"></i><i class="right moduleBorder"></i><i class="bottom moduleBorder"></i><i class="left moduleBorder"></i>\
        <div id="toolbar{overIndex}" class="toolbar"></div>\
        <div id="editorContent{overIndex}" class="editorContent" style="height:{editorContentHeight}px;">\
        </div></div>',
  scanDotPaper1:
    '<div class="scan-dot">\
              <span data-option="bl" class=""></span>\
              <span data-option="bl" class="center1"></span>\
              <span data-option="br" class="right"></span>\
          </div>\
          <div class="scan-dot bot">\
              <span data-option="bl" class="left"></span>\
              <span data-option="br" class="right"></span>\
          </div>',
  scanDotPaper2:
    '<div class="scan-dot">\
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
