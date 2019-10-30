/**
 * 纸张规格配置
 */

var sizeConfig = {
  A3: {
    width: 420,
    height: 297
  },
  A4: {
    width: 210,
    height: 297
  }
}

var hgc_modal = {
  tpl:
    '<div class="hgc_modalBox">\
			<div class="hgc_modal">\
				<h2><em>{title}</em><i class="close">X</i></h2>\
				<div class="modalContent">{content}</div>\
				<div class="modalBtns">\
					<span class="sure">确定</span>\
					<span class="cancel">取消</span>\
				</div>\
			</div>\
		</div>',
  init: function(data) {
    this.title = data.title || '消息提示'
    this.conetnt = data.content || '提示消息'
    this.sureCb = data.sureCb || function() {}
    this.cancelCb = data.cancelCb || function() {}

    this.render()
    this.initDom()
    this.bindEvent()
  },
  initDom: function() {
    this.$modalBox = $('.hgc_modalBox')
  },
  render: function(content) {
    var self = this
    $('body').append(
      self.tpl.substitute({ content: self.conetnt, title: self.title })
    )
  },
  bindEvent: function() {
    var self = this
    self.$modalBox.find('.modalBtns .sure').click(function() {
      self.sureCb()
      self.$modalBox.remove()
    })
    self.$modalBox.find('.modalBtns .cancel').click(function() {
      self.cancelCb()
      self.$modalBox.remove()
    })
    self.$modalBox.find('h2 .close').click(function() {
      self.$modalBox.remove()
    })
  }
}

/**
 * 定位点的设置
 * top定位点都是基于当前page来定位的
 * left
 */
/**
 * 打印功能主体
 *
 *
 */
var env = 'online'
var loginStatus = ''
var domain = ''
var printCssPath = '/css/online/print.css'
if (env === 'local') {
  ///username/xll/time/1570759444/sig/1e5e7d0a297cfd97d6998d3a297af9b3/sessionid/session_b5699c775f3d770ab28b4bba1e58e5b1
  loginStatus =
    '/username/danie/time/1572240626/sig/3a92b8e359d7a2fd8f9435232cf9b000/sessionid/session_2511d73f107b708049c4550af8ae7c1d'
  domain = 'http://zsyas2.testing.xueping.com'
  //打印样式文件 这里的css 路径帮忙改下
  printCssPath = '../css/print.css'
}

var Print = {
  apis: {
    //获取答题卡信息
    getTopicsDetailAPi: '/print/getPaperWithTopicsDetails',
    //保存答题卡信息
    saveTopicsDetailsApi: '/print/saveCardOnline',
    //保存为pdf
    htmlToPdfApi: '/print/htmlToPdf'
  },
  init: function(config) {
    this.modal = hgc_modal
    this.config = config.A4
    //分栏
    this.columns = 1
    //页面页码计算
    //当前分页
    this.currentPage = 1
    //总分页
    this.totalPage = 1
    //当前纸张-包括正反两面 ceil(totalPage/(column*2))
    this.currentPaper = 0
    //当前纸张正面1正面2 反面1 反面2
    this.currentPaperPage = 0
    //装订线
    this.hasBindingLine = true
    //初始化页面数据
    //核心功能模块盒模型设计
    this.modulePaddingSide = 20
    this.modulePaddingTop = 41
    this.modulePaddingBottom = 11
    this.modulePadding = this.modulePaddingTop + this.modulePaddingBottom
    this.pagePadding = 50
    this.layoutPadding = 20
    //用于页面 mm 和 px 之间单位转换
    //96dpi 打印出来300dpi纸张上面的的比例
    this.dpiRadio = 1
    this.unitConversion = new UnitConversion()
    this.pageHeight = this.unitConversion.mmConversionPx(this.config.height)
    this.pageWidth = this.unitConversion.mmConversionPx(this.config.width)

    //富文本编辑 ==>> 全局富文本编辑构造函数
    this.EDITOR = window.wangEditor

    //全局groupId
    this.examGroupId = exam_group_id
    //初始化页面渲染
    this.initPage()
    //初始化打印面积
    this.initPrintContentArea()
  },
  tpls: PRINT_TPL,
  // 初始化打印区域宽高 mm 转 px
  initPrintContentArea: function() {
    var self = this
    var headEL = $('head')
    self.pageHeight = self.unitConversion.mmConversionPx(self.config.height)
    self.pageWidth = self.unitConversion.mmConversionPx(self.config.width)

    if ($('#pageSizeStyle').length) $('#pageSizeStyle').remove()
    var initPrintPageStyle = self.tpls.printPageStyle.substitute({
      pageWidth: self.pageWidth / self.columns,
      pageHeight: self.pageHeight
    })
    headEL.append(initPrintPageStyle)
  },
  //render page
  initPage: function() {
    var self = this
    $('#hgc_print').height($(window).height())

    self.getTopicDetails()
  },
  getTopicDetails: function() {
    var self = this
    //如果之前保存过，则需要记忆之前的答题卡排版
    $.post(
      domain + self.apis.getTopicsDetailAPi + loginStatus,
      { examGroupId: self.examGroupId },
      function(res) {
        res = JSON.parse(res)
        if (res.success) {
          self.renderPage(res)
          if (res.position) {
            self.memoryLayout(JSON.parse(res.position))
          }
        } else {
          self.modal.init({
            content: '获取试卷题目信息失败'
          })
        }
      }
    )
  },
  /*--------------------------------------------------------------------------------------------------------------------
  初始页面布局功能开始
  -----------------------------------------------------------------------------------------------------------------------*/
  renderPage: function(renderJSON) {
    var self = this
    self.renderExamBaseInfo(renderJSON.object)

    self.renderSubjectInfo(renderJSON.object.questions)

    self.initDom()

    self.bindEvent()

    self.initEvent()
  },
  //渲染答题卡基本信息 准考证号、名称、考试时间等
  renderExamBaseInfo: function(examInfo) {
    var self = this
    //答题卡题目类型
    $('#dtkName textarea').val(examInfo.paperName)
    var examInfoHtml = self.tpls.examInfoTpl.substitute(examInfo)
    $('#examInfo').html(examInfoHtml)
    //准考证号信息
    self.renderExamNumberInfo(examInfo)
  },
  //准考证号信息
  renderExamNumberInfo: function(examInfo) {
    var self = this
    //准考证号类型 1学校准考证 0系统准考证
    self.school_card_status = examInfo.school_card_status
    //准考证号长度
    var school_card_length = examInfo.school_card_length

    //公共边框 -- 右边框
    var examNumberHtml = ''
    for (var colIndex = 0; colIndex < school_card_length; colIndex++) {
      var firstColBorder = ''
      //第一列 左边框
      //第一行 上边框 下边框
      //最后一行 下边框
      if (!colIndex) {
        firstColBorder = '<b class="left moduleBorder"></b>'
      }

      examNumberHtml += self.tpls.examNumberItemTpl.substitute({
        firstColBorder: firstColBorder
      })
    }

    $('#hgc_examNumber .ticketNumber').html(examNumberHtml)
  },
  renderSubjectDataFormat: function(questions) {
    var self = this
    //题型
    /**
     * "questionTypeId": 1,
        "fullScore": 5,
        "optionCount": 4,
        "questionNum": "1",
        "answer": "D"
     */
    //类型 1 单选 5 填空 7 解答 17 选做
    // 先做题型分类
    var questFieldMap = {
      1: 'singleSelect',
      5: 'fillInBlank',
      7: 'shortAnswer',
      17: 'chooseAnswer'
    }
    var questionClassify = questions.reduce(
      function(questionMap, item) {
        var questionMapItem = questionMap[questFieldMap[item.questionTypeId]]
        if (questionMapItem) {
          questionMapItem.push(item)
        } else {
          questionMap[questFieldMap[item.questionTypeId]] = [item]
        }
        return questionMap
      },
      {
        singleSelect: [],
        fillInBlank: [],
        shortAnswer: [],
        chooseAnswer: []
      }
    )

    return questionClassify
  },
  //渲染答题卡题目题型信息
  renderSubjectInfo: function(questions) {
    var self = this
    //格式化题型题号信息
    var questionClassify = self.renderSubjectDataFormat(questions)
    console.log(questionClassify)
    //渲染右侧操作栏 题目列表信息
    self.renderSubjectListInfo(questionClassify)

    //保存题目定位点的时候 获取 题目数量 分数 等信息
    self.getSaveSubjectInfo(questionClassify)
    var dtkContentEl = $('.dtk-content')
    for (var subjectType in questionClassify) {
      if (!questionClassify[subjectType].length) continue
      self[subjectType + 'Render'](questionClassify[subjectType], dtkContentEl)
    }
  },
  renderSubjectListInfo: function(questionClassify) {
    var self = this
    var nameMap = {
      singleSelect: '单选题',
      fillInBlank: '填空题',
      shortAnswer: '解答题',
      chooseAnswer: '选做题'
    }
    var listItemTpl =
      '<li><span>{name}</span><span>{quantityStart}~{quantityEnd}</span></li>'
    var listHtml = ''
    for (var name in questionClassify) {
      if (!questionClassify[name][0]) continue
      var quantityStart = +questionClassify[name][0].questionNum
      var quantityEnd = quantityStart + questionClassify[name].length - 1
      listHtml += listItemTpl.substitute({
        name: nameMap[name],
        quantityStart: quantityStart,
        quantityEnd: quantityEnd
      })
    }

    $('#subjectList').html(listHtml)
  },
  singleSelectRender: function(datas, appendEl) {
    var self = this
    var singleSelectTpl = self.tpls.singleSelectOptionTpl
    var singleSelectHtml = ''
    var singleColHtml = ''
    datas.forEach(function(singleItem, index) {
      var singleContent = ''
      for (var i = 0; i < singleItem.optionCount; i++) {
        var option = String.fromCharCode(65 + i)
        singleContent += '<span data-option="{option}">[{option}]</span>'.substitute(
          { option: option }
        )
      }
      singleColHtml += singleSelectTpl.substitute({
        _index: ++index,
        singleContent: singleContent,
        questionNum: singleItem.questionNum,
        answer: singleItem.answer
      })

      if (!(index % 5)) {
        singleSelectHtml +=
          '<ul class="single-option module clearfix" id="singleOptionModule">' +
          singleColHtml +
          '</ul>'
        singleColHtml = ''
      }
    })

    singleSelectHtml +=
      '<ul class="single-option module clearfix" id="singleOptionModule">' +
      singleColHtml +
      '</ul>'

    var SingleSelectModuleHtml = self.tpls.singleSelectTpl.substitute({
      singleSelectContent: singleSelectHtml
    })
    appendEl.append(SingleSelectModuleHtml)
  },
  fillInBlankRender: function(datas, appendEl) {
    var self = this
    self.fillInBlankDatas = datas;
    var fillInBlankTpl = self.tpls.fillInBlankItemTpl
    var fillInBlankHtml = ''
    datas.forEach(function(fillInBlankItem) {
      fillInBlankHtml += fillInBlankTpl.substitute(fillInBlankItem)
    })

    var fillInBlankModuleHtml = self.tpls.fillInBlankTpl.substitute({
      fillInBlankContent: fillInBlankHtml
    })
    appendEl.append(fillInBlankModuleHtml)
  },
  shortAnswerRender: function(datas, appendEl) {
    var self = this
    var shortAnswerTpl = self.tpls.shortAnswerItemTpl
    var shortAnswerHtml = ''
    datas.forEach(function(shortAnswerItem) {
      var scoreColumnHtml = '<i class="bottom moduleBorder"></i>'
      for (var i = 1; i <= 16; i++) {
        var borderHtml = '<i class="right moduleBorder"></i>'
        if (i >= 16) {
          borderHtml = ''
        }
        scoreColumnHtml += '<span>' + borderHtml + i + '</span>'
      }
      shortAnswerItem.scoreColumnHtml = scoreColumnHtml
      shortAnswerHtml += shortAnswerTpl.substitute(shortAnswerItem)
    })

    var shortAnswerModuleHtml = self.tpls.shortAnswerTpl.substitute({
      shortAnswerContent: shortAnswerHtml
    })
    appendEl.append(shortAnswerModuleHtml)
    //初始化解答题富文本插件
    datas.forEach(function(item) {
      self.createShortAnswer(item.questionNum)
    })
  },
  chooseAnswerRender: function(datas, appendEl) {
    var self = this
    var chooseAnswerTpl = self.tpls.chooseAnswerItemTpl
    var startChooseNumber = 0
    var titleNumber = ''
    var selOptionHtml = ''
    datas.forEach(function(item, index) {
      if (!startChooseNumber) startChooseNumber = item.questionNum
      titleNumber += item.questionNum + ','
      selOptionHtml += '<span data-titleNumber="{titleNumber}" data-option="[{char}]">[{char}]</span>'.substitute(
        {
          char: String.fromCharCode(65 + index),
          titleNumber: item.questionNum
        }
      )
    })
    var scoreColumnHtml = '<i class="bottom moduleBorder"></i>'
    for (var i = 1; i <= 16; i++) {
      var borderHtml = '<i class="right moduleBorder"></i>'
      if (i >= 16) {
        borderHtml = ''
      }
      scoreColumnHtml += '<span>' + borderHtml + i + '</span>'
    }

    chooseAnswerHtml = chooseAnswerTpl.substitute({
      questionNum: startChooseNumber,
      //4,5,6,
      titleNumber: titleNumber.substring(0, titleNumber.length - 1),
      selOptionHtml: selOptionHtml,
      scoreColumnHtml: scoreColumnHtml
    })

    var chooseAnswerModuleHtml = self.tpls.chooseAnswerTpl.substitute({
      chooseAnswerContent: chooseAnswerHtml
    })
    appendEl.append(chooseAnswerModuleHtml)

    self.createShortAnswer(startChooseNumber)
  },
  /*--------------------------------------------------------------------------------------------------------------------
  初始页面布局功能结束
  -----------------------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------------------------------------------------------
  记忆布局功能开始
  ------------------------------------------------------------------------------------------------------------------------------------*/
  memoryLayout: function(res) {
    var self = this
    var formatData = self.memoryDataFormat(res)
    var fillInBlankData = formatData.fillInBlankData
    var shortAnswerData = formatData.shortAnswerData
    self.memoryFillInBlank(fillInBlankData)
    self.memoryShortAnswer(shortAnswerData)
    console.log('memory data', res)
  },
  //把每一题的数据整合到一起
  memoryDataFormat: function(res) {
    var self = this
    //选择题不能做任何设置
    //填空题可以设置每行列数、分值格式等
    var fillInBlankData = []
    //过滤处所有解答题的定位信息===>>>只有解答题可以自定义跨高
    var shortAnswerData = []
    var linkQuestionData = {}
    res.pages.forEach(function(pageData) {
      for (
        var i = 0, questionItem;
        (questionItem = pageData.questions[i++]);

      ) {
        var questionType = questionItem.type
        //填空题
        switch (questionType) {
          case 3:
            fillInBlankData.push(questionItem)
            break
          //解答题
          case 1:
          //选做题
          case 2:
            var isShortAnswer = questionType === 1
            var linkParm = isShortAnswer
              ? questionItem.cut.linkparm
              : questionItem.selectqts[0].cut.linkparm
            //如果存在补充模块 ， 则先合并
            if (linkParm) {
              if (linkParm === 1) {
                linkQuestionData = questionItem
              } else {
                if (isShortAnswer) {
                  linkQuestionData.cut.height += questionItem.cut.height
                } else {
                  linkQuestionData.selectqts[0].cut.height +=
                    questionItem.selectqts[0].cut.height
                }
              }
            } else {
              if (JSON.stringify(linkQuestionData) !== '{}') {
                shortAnswerData.push(linkQuestionData)
                linkQuestionData = {}
              }
              shortAnswerData.push(questionItem)
            }
            break
        }
      }
    })

    return {
      shortAnswerData: shortAnswerData,
      fillInBlankData: fillInBlankData
    }
  },
  memoryFillInBlank: function(fillInBlankData) {
    var self = this
    var questionItem = fillInBlankData[0]
    //当前答题卡只有一大填空题大题的情况下
    var $this = $('#fillInBlank').siblings('.settingBtn')
    var column = questionItem.column
    var scoreStyle = questionItem.scoreStyle
    self.fillInBlankStyleChange($this, column, scoreStyle)
  },
  memoryShortAnswer: function(shortAnswerData) {
    var self = this
    //1 分值上限修改=>>打分区域
    //self.shortAnswerStyleChange();
    //2 解答题区域高度修改

    //shortAnswerData 所有解答题的区域信息

    for (var i = 0, questionItem; (questionItem = shortAnswerData[i++]); ) {
      var moduleHeight = questionItem.cut
        ? questionItem.cut.height
        : questionItem.selectqts[0].cut.height
      console.log(moduleHeight)
      var scoreLimitKey = questionItem.scoreLimit
      $('#printcontent .pageContent').each(function(pageIndex, pageItem) {
        var $pageItem = $(pageItem)
        var pageModules = $pageItem.find('.short-answer .module')
        var isOverPage = false
        pageModules.each(function(index, moduleItem) {
          var $moduleItem = $(moduleItem)
          if ($moduleItem.attr('title-number') === questionItem.id) {
            self.curDtkModelEl = $moduleItem
            var $this = $moduleItem.children('.settingBtn')
            self.shortAnswerStyleChange($this, scoreLimitKey)
            //设置大题区域高度
            $moduleItem
              .children('.editorContent')
              .height(moduleHeight - self.modulePadding)
            curPageEl = $pageItem
            //如果当前有page分栏页有超出 则直接调到下一个分页
            isOverPage = self.getOverModule(curPageEl)
            self.changePrintArea(curPageEl)
            if (isOverPage) return false
          }
        })
        if (isOverPage) {
          isOverPage = false
          return false
        }
      })
    }
  },
  /*--------------------------------------------------------------------------------------------------------------------------------
  记忆布局功能结束
  ------------------------------------------------------------------------------------------------------------------------------------*/
  initDom: function() {
    var self = this
    self.$layoutItem = $('#hgc_print .layoutItem')
  },
  initEvent: function() {
    var self = this
    var paperA3Option = $('.selOptions input[name="paper"]').eq(0)
    var paperHasBindingOption = $('.selOptions input[name="hasBinding"]').eq(1)
    var examStyleOption = $('.selOptions input[name="studentCode"]').eq(0) //当前默认是 A3 两栏 有装订线 有条形码 有准考证号
    paperA3Option.prop('checked', true).change()
    paperHasBindingOption.prop('checked', true).change()
    examStyleOption.prop('checked', true).change()
  },
  bindEvent: function() {
    var self = this
    //控制答题卡区域缩放事件
    ;(function() {
      var distance = 0
      var startPageY = 0
      var isCanMove = false
      //改变之前的初始高度
      var startHeight = 0
      //只要改变高度的模块
      var changeEl = null
      //当前操作的分页
      var curPageEl = $('#printcontent .pageContent').eq(0)
      var curPageOffsetTop = 0
      //当前缩放分页下面的按钮
      var curDtkModelEl = null
      var curDtkModelOffsetTop = 0
      self.curDtkModelEl = curDtkModelEl = curPageEl.find('.module').eq(0)
      self.changePrintArea(curPageEl)

      $('#printcontent').on('mousedown', '.short-answer .dragBtn', function(e) {
        var inscreaseTop = $('#contentWrap').scrollTop()
        curPageEl = $(this).closest('.pageContent')
        curPageOffsetTop = curPageEl.offset().top + inscreaseTop
        self.curDtkModelEl = curDtkModelEl = $(this).closest('.module')
        curDtkModelOffsetTop = curDtkModelEl.offset().top + inscreaseTop
        changeEl = $(this).siblings('.editorContent')
        startHeight = changeEl.height()
        startPageY = e.pageY
        isCanMove = true

        //判断是否超过了一页
        /**
         * 1当前模块已经缩放超过了当前页
         *  a>该区域后面的内容板块自动清空
         *  b>该区域不可再移动,自动新建一页,然后在下一页新建一个富文本默认是上一页超出的区域
         * 2后面的模块超过了当前缩放页面
         *  a>直接把后面的题放到新排版页面
         */
        document.onmouseup = function(e) {
          self.changePrintArea(curPageEl)

          isCanMove = false
          curPageEl = null
          document.onmouseup = null
        }
      })
      /**
       * 超过当前纸张的情况下 当鼠标松开的时候
       * 1先把当前纸张放满
       * 2剩余高度重新新到下个版本新建一个富文本高度一样没有内容
       * 3单词拖动鼠标控制解答题区域缩放只能拖动到当前页面最底部
       */
      document.onmousemove = function(e) {
        if (!isCanMove) return
        //当前可以拖动的极限距离
        // var curCanDragMaxDistance = (curPageEl.index()+1)*(self.pageHeight - 50);
        //判断当前模块是否到底部,如果当前缩放的模块，拉到当前模块底部，直接鼠标弹起
        if (
          curDtkModelOffsetTop +
            curDtkModelEl.height() +
            self.modulePadding -
            2 >=
          curPageOffsetTop + self.pageHeight - self.pagePadding
        ) {
          document.onmouseup(e)
          return
        }
        distance = e.pageY - startPageY
        changeEl.height(startHeight + distance)
      }
    })()
    //删除一个分页超出的部分
    $('#printcontent').on('click', '.delBtn', function(e) {
      var $this = $(this)
      self.delPageOverPart($this)
    })
    //预览
    $('#previewBtn').click(function() {
      self.previewPrintDiv('printcontent')
    })
    //保存
    $('#saveBtn').click(function() {
      self.savePrintPosition('printcontent')
    })
    //下载pdf
    $('#downLoadBtn').click(function() {
      var $this = $(this)
      self.downLoadPdf($this)
    })
    //答题卡布局
    self.$layoutItem.click(function() {
      var column = +$(this).attr('data-column')
      $(this)
        .addClass('current')
        .siblings()
        .removeClass('current')
      self.columns = column
      self.initPrintContentArea()
    })
    $('.selOptions input').change(function() {
      var $this = $(this)
      var type = $this.attr('data-type')
      switch (type) {
        //修改纸张规格
        case 'paper':
          self.changePaperSize($this)
          break
        case 'binding':
          self.ifBindingLine($this)
          break
        case 'style':
          self.selExamNumberStyle($this)
          break
      }
    })

    //单模块设置
    $('#printcontent').on('click', '.settingBtn', function() {
      var $this = $(this)
      var type = $this.attr('data-type')
      if (type === 'fillInBlank') {
        self.fillInBlankSet($this)
      } else {
        self.shortAnswerSet($this)
      }
    })
  },
  //填空题设置
  fillInBlankSet: function($this) {
    var self = this

    self.modal.init({
      title: '填空题设置',
      content: self.tpls.fillInBlankOptionTpl,
      sureCb: function() {
        //每行列数
        var column = $('#fillInBlankColumn').val()
        //分值格式
        var scoreStyle = $('#scoreStyle').val()
        //修改填空题样式
        self.fillInBlankStyleChange($this, column, scoreStyle)
      }
    })
  },
  /**
   *
   * @param {column} 没行列数
   * @param {scoreStyle} 分值格式
   * @param {$this} 当前要修改的填空题区域里面的标示符
   */
  fillInBlankReRender:function(){
    var self = this;
    var fillInBlankTpl = self.tpls.fillInBlankItemTpl
    var fillInBlankHtml = ''
    self.fillInBlankDatas.forEach(function(fillInBlankItem) {
      fillInBlankHtml += fillInBlankTpl.substitute(fillInBlankItem)
    })

    if($('.completion-topic').length > 1){
      $('.completion-topic').eq(1).remove();
    }
    $('#fillInBlank').html(fillInBlankHtml)
  },
  fillInBlankStyleChange: function($this, column, scoreStyle) {
    var self = this
    self.fillInBlankReRender();
    function rendScore(score) {
      return (
        '<i><b class="top moduleBorder"></b><b class="right moduleBorder"></b><b class="bottom moduleBorder"></b><b class="left moduleBorder"></b>' +
        score +
        '</i>'
      )
    }
    var curPageEl = $this.closest('.pageContent')
    var fillInBlankCol = $this.siblings('.subjectCol')
    var scorePartEl = fillInBlankCol.find('.subjectItem strong')
    var fillInBlankLine = scorePartEl.siblings('em')
    //设置的数据同步到标签上，供后取值
    fillInBlankCol.attr({
      'data-column': column,
      'data-scoreStyle': scoreStyle
    })

    var scoreHtml = ''
    scoreStyle.split('/').forEach(function(score) {
      scoreHtml += rendScore(score)
    })
    fillInBlankLine.attr('class', 'cell-' + scoreStyle.split('/').length)
    scorePartEl.html(scoreHtml)
    fillInBlankCol[0].classList = 'subjectCol clearfix col-' + column
    //如果填空题由原来的一行变成多行，就有可能影响所有的布局样式，重新布局整个答题卡
    self.changePrintArea(curPageEl)
  },
  //解答题设置
  shortAnswerSet: function($this) {
    var self = this
    self.modal.init({
      title: '解答题设置',
      content: self.tpls.shortAnswerOptionTpl,
      sureCb: function() {
        var scoreLimitKey = $('#scoreLimit').val()

        self.shortAnswerStyleChange($this, scoreLimitKey)
      }
    })
  },
  /**
   *
   * @param {当前要修改的解答题区域内的标示符} $this
   * @param {分值上限} scoreLimitKey
   */
  shortAnswerStyleChange: function($this, scoreLimitKey) {
    var self = this
    function rendScore(score, length, index) {
      var borderHtml = '<i class="right moduleBorder"></i>'
      if (index + 1 >= length) {
        borderHtml = ''
      }
      return '<span>' + borderHtml + score + '</span>'
    }
    var bit = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    //各个分值对应的分值 布局格式
    var scoreLimitMap = {
      '16': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      '29': {
        tenPlace: [1, 2],
        bit: bit
      },
      '49': {
        tenPlace: [1, 2, 3, 4],
        bit: bit
      }
    }
    var scorePartEl = $this.siblings('.scortColumn')
    var colClass = 'col-' + scoreLimitKey
    var scoreLimit = scoreLimitMap[scoreLimitKey]
    var scoreModuleHtml = '<i class="bottom moduleBorder"></i>'
    var scoreLimitArr = []
    if (scoreLimitKey === '16') {
      scoreLimitArr = scoreLimit
    } else {
      scoreLimitArr.push('十位')
      scoreLimitArr = scoreLimitArr.concat(scoreLimit.tenPlace)
      scoreLimitArr.push('个位')
      scoreLimitArr = scoreLimitArr.concat(scoreLimit.bit)
    }
    scoreLimitArr.forEach(function(score, index) {
      scoreModuleHtml += rendScore(score, scoreLimitArr.length, index)
    })
    //解答题分值上限配置
    scorePartEl
      .html(scoreModuleHtml)
      .attr('class', 'scortColumn clearfix ' + colClass)
      .parent('.module')
      .attr('scoreLimit', scoreLimitKey)
  },
  //修改纸张尺寸
  changePaperSize: function($this) {
    var self = this
    var paper = $this.attr('data-value')
    //2,3
    var columnMap = {
      A3: '1',
      A4: '1,2'
    }
    var showColumns = columnMap[paper].split(',')

    self.config = sizeConfig[paper]
    self.initPrintContentArea()

    self.$layoutItem.hide()
    showColumns.forEach(function(index) {
      self.$layoutItem.eq(index - 1).show()
    })
    self.$layoutItem.eq(showColumns[0] - 1).trigger('click')
  },
  //是否有装订线
  ifBindingLine: function($this) {
    var self = this
    self.hasBindingLine = $this.attr('data-value') === 'yes'
    var isUseClass = self.hasBindingLine ? 'addClass' : 'removeClass'
    var isHideBinding = self.hasBindingLine ? 'show' : 'hide'
    var isHideExamineeInfo = !self.hasBindingLine ? 'show' : 'hide'
    $('#printcontent')
      [isUseClass]('hasBindingLine')
      .find('.bindingLine')
      [isHideBinding]()
    $('#examineeInfoForLayout')[isHideExamineeInfo]()
    var curPageEl = $('#printcontent .pageContent').eq(0)
    //隐藏考生的姓名 班级信息也会影响布局
    self.changePrintArea(curPageEl)
  },
  //选择考号版式
  selExamNumberStyle: function($this) {
    var self = this
    var value = $this.attr('data-value')
    var $ticketNumber = $('#hgc_examNumber .ticketNumber')
    var $barCode = $('#hgc_examNumber .barCode')
    var isBarCode = value === 'barCode'
    $ticketNumber[isBarCode ? 'show' : 'hide']()
    $barCode[!isBarCode ? 'show' : 'hide']()
  },
  //删除一个分页超出的部分
  delPageOverPart: function($delBtn) {
    var self = this
    var answerModel = $delBtn.closest('.short-answer')
    var delModel = $delBtn.closest('.module')
    var delPage = delModel.closest('.pageContent')
    var prevPageLastModule = delPage.prev().find('.module:last()')
    var prevPageLastEditor = prevPageLastModule.children('.editorContent')
    if (
      !delModel.siblings('.module').length &&
      !answerModel.siblings('.short-answer').length
    ) {
      delPage.remove()
    }
    prevPageLastEditor.height(
      prevPageLastEditor.height() - self.modulePaddingBottom
    )
    prevPageLastModule.append('<div class="dragBtn"></div>')
    delModel.remove()
    //判断上一个模块是否是第一个链接模块
    if (prevPageLastModule.attr('data-linkparm') === '1') {
      prevPageLastModule.removeAttr('data-linkparm')
    }
    if (!answerModel.children('.module').length) answerModel.remove()
  },
  /**
   * 获取超出当前page的模块 作答大题区域模块 作答小题区域模块
   * @return {answerModule,subjectModule}
   */
  getOverModule: function(curPageEl) {
    var self = this
    var overPart = false
    //当前第几页，用做后面计算的高度距离的倍数
    var times = curPageEl.index() + 1
    //判断超出当前页面的条件
    var overHeight =
      self.pageHeight * times + self.layoutPadding - self.pagePadding
    //判断当前区域是否超出
    function isOver(el) {
      var moduleTop =
        $(el).outerHeight() + $(el).offset().top + $('#contentWrap').scrollTop()
      return moduleTop >= overHeight
    }
    /**
     * 1 判断当前页面里面的答题区域内容是否超过了当前页面所能承受的内容的高度
     *  a 如果超出了，从当前移动的那个模块开始向后判断，取出所有超出的模块
     *     I 在下一页的排版中，如果下一页存在直接插入最前面，如果不存在，直接新建一页==>>然后循环【1】操作
     *  b 如果没有超出直接退出
     */

    //需要判断当前page里面所有模块是否有超出
    //当前答题卡区域
    var curDtkPartEl = curPageEl.children('.dtk-content')
    if (curDtkPartEl.height() + self.pagePadding * 2 >= self.pageHeight) {
      var shortAnswerEl = curDtkPartEl.children('.answerModule')
      for (var i = 0, ilen = shortAnswerEl.length; i < ilen; i++) {
        var shortAnswerItem = shortAnswerEl.eq(i)
        //找到第一个超过当前页面的元素，把这个以及以后的模块提取出来在下一个版面进行重新排版
        //得到第一个大题的index  第一个大题下面小题的index
        if (isOver(shortAnswerItem)) {
          var moduleEl = $(shortAnswerItem).children('.module')
          for (var m = 0, mlen = moduleEl.length; m < mlen; m++) {
            var moduleItem = moduleEl.eq(m)
            if (isOver(moduleItem)) {
              overPart = {
                curPage: curPageEl,
                //当前超出的answerModule
                answerModule: shortAnswerItem,
                //当前超出的module
                subjectModule: moduleItem
              }
              return overPart
            }
          }
        }
      }
    }
    return overPart
  },
  //根据缩放的要求拓宽需要打印的区域
  /**
   *
   * @param {*} curPageEl
   * 1拓宽打印区域
   * 2减小打印区域
   */
  changePrintArea: function(curPageEl) {
    var self = this
    //找出超出的区域
    var overPart = self.getOverModule(curPageEl)
    console.log(overPart)
    if (overPart) {
      //填空
      if (overPart.answerModule.hasClass('completion-topic')) {
        self.addPrintForFillInBlank(curPageEl, overPart)
      } else {
        self.addPrintArea(curPageEl, overPart)
      }
    } else {
      self.reducePrintArea(curPageEl)
    }
  },
  getOverHeight: function(el) {
    var self = this
    var curPageEl = $(el).closest('.pageContent')
    //当前第几页，用做后面计算的高度距离的倍数
    var times = curPageEl.index() + 1
    var overHeight =
      self.pageHeight * times + self.layoutPadding - self.pagePadding
    var moduleTop =
      $(el).outerHeight() + $(el).offset().top + $('#contentWrap').scrollTop()
    return moduleTop - overHeight
  },
  //填空题超出
  addPrintForFillInBlank: function(curPageEl, overPart) {
    var self = this
    var curPageIndex = curPageEl.index()
    var times = curPageIndex + 1
    var part = overPart.subjectModule
    var subjectHtml = ''
    //合并的简答题区域
    var overAnswerHtml = ''
    //判断是否是当前鼠标操作答题区域的坐标
    var curOperation = part[0] === self.curDtkModelEl[0]
    //通过缩放确定每个页面需要移除的元素
    var removeElements = []
    //需要重置富文本编辑功能区域的id
    var resetEditorIds = []

    var nextPageEl = curPageEl.next()
    //首先判断是要删除下一个分页的补充模块如果下一个分页存在的话
    if (nextPageEl.length) {
      var nextPageFirstModule = nextPageEl.find('.module').eq(0)
      if (typeof nextPageFirstModule.attr('isSurplus') === 'string') {
        nextPageFirstModule.children('.delBtn').trigger('click')
      }
    }

    subjectHtml += self.addNewModuleForFillInBlank(part)

    //超出模块
    //判断超出简答题区域
    var overAnswerModule = overPart.answerModule
    while (overAnswerModule.length) {
      var editModuleHtml = ''
      var isCurOverAnswer = overAnswerModule === overPart.answerModule
      //如果是当前超出模块，则直接用上面的多余的moduleHtml来填充
      //否则，直接用answerModule的内容来填充
      if (isCurOverAnswer) {
        editModuleHtml = subjectHtml
      } else {
        editModuleHtml = overAnswerModule.html()
        //2 判断是否有需要重置的富文本
        var editorEls = overAnswerModule.find('.editorContent')
        editorEls.length &&
          editorEls.each(function() {
            resetEditorIds.push({
              editorId: $(this).attr('id'),
              toolbarId: $(this)
                .prev()
                .attr('id')
            })
          })

        removeElements.push(overAnswerModule)
      }
      overAnswerHtml += self.tpls[
        isCurOverAnswer ? 'answerModulForFillInBlankTpl' : 'answerModuleTpl'
      ].substitute({
        editModule: editModuleHtml,
        moduleType: overAnswerModule.attr('data-type')
      })

      overAnswerModule = overAnswerModule.next()
    }

    /**
     * 【优化】
     * 模块删除关系需要优化
     */
    removeElements.forEach(function(element) {
      $(element).remove()
    })
    //是否存在下一个分页
    if (nextPageEl.length) {
      nextPageEl.children('.dtk-content').prepend(overAnswerHtml)
    } else {
      self.addPage(overAnswerHtml)

      nextPageEl = $('#printcontent').children('.pageContent:last()')
    }
    //重置富文本
    self.resetAddNewModuleEditor(resetEditorIds)
    //递归轮询判断
    self.changePrintArea(nextPageEl)
  },
  addPrintArea: function(curPageEl, overPart) {
    var self = this
    var curPageIndex = curPageEl.index()
    var times = curPageIndex + 1
    var part = overPart.subjectModule
    var subjectHtml = ''
    //合并的简答题区域
    var overAnswerHtml = ''
    //判断是否是当前鼠标操作答题区域的坐标
    var curOperation = part[0] === self.curDtkModelEl[0]
    //通过缩放确定每个页面需要移除的元素
    var removeElements = []
    //需要重置富文本编辑功能区域的id
    var resetEditorIds = []

    var nextPageEl = curPageEl.next()
    //首先判断是要删除下一个分页的补充模块如果下一个分页存在的话
    if (nextPageEl.length) {
      var nextPageFirstModule = nextPageEl.find('.module').eq(0)
      if (typeof nextPageFirstModule.attr('isSurplus') === 'string') {
        nextPageFirstModule.children('.delBtn').trigger('click')
      }
    }

    while (part.length) {
      /**
       * 如果是当前缩放的模块超出，直接在下一模块新建当前模块的子模块，
       * 如果不是，则直接拷贝超出模块所有内容到下一页
       */
      //当前缩放的模块没有超出规定区域 则超出的所有模块全局复制

      //overPart.subjectModule 第一个超出当前分页的模块 || !curOperation
      if (part !== overPart.subjectModule || !curOperation) {
        var modulePrev = part.prev()
        var hasTitle = modulePrev.length && modulePrev[0].tagName === 'H3'
        //1 新增新模块
        subjectHtml += self.addNewModule(part)
        //2 判断是否有需要重置的富文本
        var editorEl = part.children('.editorContent')
        if (editorEl.length) {
          resetEditorIds.push({
            editorId: editorEl.attr('id'),
            toolbarId: editorEl.prev().attr('id')
          })
        }
        //3 移除老模块
        removeElements.push(part)
        hasTitle && removeElements.push(modulePrev)
      } else {
        //1 拓展新模块
        subjectHtml += self.expandModule(part)
        //2 移除老模块
        removeElements.push(part.children('.dragBtn'))
      }

      part = part.next()
    }

    //超出模块
    //判断超出简答题区域
    var overAnswerModule = overPart.answerModule
    while (overAnswerModule.length) {
      var editModuleHtml = ''
      //如果是当前超出模块，则直接用上面的多余的moduleHtml来填充
      //否则，直接用answerModule的内容来填充
      if (overAnswerModule === overPart.answerModule) {
        editModuleHtml = subjectHtml
      } else {
        editModuleHtml = overAnswerModule.html()
        //2 判断是否有需要重置的富文本
        var editorEls = overAnswerModule.find('.editorContent')
        editorEls.length &&
          editorEls.each(function() {
            resetEditorIds.push({
              editorId: $(this).attr('id'),
              toolbarId: $(this)
                .prev()
                .attr('id')
            })
          })

        removeElements.push(overAnswerModule)
      }

      overAnswerHtml += self.tpls.answerModuleTpl.substitute({
        editModule: editModuleHtml,
        moduleType: overAnswerModule.attr('data-type')
      })

      overAnswerModule = overAnswerModule.next()
    }

    /**
     * 是否需要重置上一个页面的高度
     * 当前缩放的模块超出，直接当前模块在当前分页高度设置到限制内最大
     *
     */
    if (curOperation) {
      //重置上一页第一个超出模块的高度 = pageHeight - subject.offset().top - subjectModullePadding的模块高度
      //上一个页面其他剩余模块的所占的高度
      var preOtherModuleHeight =
        overPart.subjectModule.offset().top +
        $('#contentWrap').scrollTop() +
        self.pagePadding +
        self.modulePadding
      //上一个页面第一个超出模块所能占用的高度
      var preFirstOverModuleHeight =
        self.pageHeight * times - preOtherModuleHeight

      overPart.subjectModule
        .children('.editorContent')
        .height(preFirstOverModuleHeight)
    }
    /**
     * 【优化】
     * 模块删除关系需要优化
     */
    removeElements.forEach(function(element) {
      $(element).remove()
    })
    if (!overPart.answerModule.children('.module').length)
      overPart.answerModule.remove()
    //是否存在下一个分页
    if (nextPageEl.length) {
      nextPageEl.children('.dtk-content').prepend(overAnswerHtml)
    } else {
      self.addPage(overAnswerHtml)

      nextPageEl = $('#printcontent').children('.pageContent:last()')
    }

    curOperation && self.createShortAnswer(self.editorIndex)
    //重置富文本
    self.resetAddNewModuleEditor(resetEditorIds)
    //递归轮询判断
    self.changePrintArea(nextPageEl)
  },
  //新建分栏
  /**
   *
   * @param {上一栏超出的模块html} overAnswerHtml
   */
  addPage: function(overAnswerHtml) {
    var self = this
    //新建的分页
    self.totalPage++
    self.currentPage++
    self.currentPaper = Math.ceil(self.totalPage / self.columns)
    self.currentPaperPage = self.totalPage % 4 ? self.totalPage % 4 : 0
    //新建page
    var newPage = self.tpls.pageModuleTpl.substitute({
      subjectModule: overAnswerHtml,
      currentPage: self.currentPage,
      totalPage: self.totalPage,
      currentPaper: self.currentPaper,
      currentPaperPage: self.currentPaperPage
    })
    $('#printcontent').append(newPage)

    $('.pageLabel').each(function() {
      $(this)
        .find('.totalPage')
        .html(self.totalPage)
    })
  },
  resetAddNewModuleEditor: function(resetEditorIds) {
    var self = this
    /**
     * editorId
     * toolbarId
     */
    resetEditorIds.forEach(function(resetEditorId) {
      var editorIndex = resetEditorId.editorId.match(/\d+/g)[0]
      $('#' + resetEditorId.toolbarId).html('')
      var editor = new self.EDITOR(
        '#' + resetEditorId.toolbarId,
        '#' + resetEditorId.editorId
      )
      // 关闭粘贴样式的过滤
      editor.customConfig.pasteFilterStyle = false
      editor.customConfig.uploadImgShowBase64 = true
      editor.create()
      editor.txt.html(self.editorArea['editor' + editorIndex].txt.html())
      self.editorArea['editor' + editorIndex] = editor
    })
  },
  //新模块 part
  addNewModule: function(part) {
    var self = this
    var moduleIndex = part.attr('data-editorIndex')
    var titleNumber = part.attr('title-number')
    var moduleTitle = ''
    var modulePrev = part.prev()
    var hasTitle = modulePrev.length && modulePrev[0].tagName === 'H3'
    if (hasTitle) {
      moduleTitle = self.tpls.moduleTitleTpl.substitute({
        title: modulePrev.html()
      })
    }
    return (
      moduleTitle +
      self.tpls.moduleTpl.substitute({
        moduleIndex: moduleIndex,
        moduleHtml: part.html(),
        titleNumber: titleNumber
      })
    )
  },
  //针对填空题
  addNewModuleForFillInBlank: function(part) {
    var self = this
    //一行几栏
    var columns = part.children('.subjectCol').attr('data-column')
      ? +part.children('.subjectCol').attr('data-column')
      : 1
    //当前超出的模块height
    var overHeight = self.getOverHeight(part)
    //需要复制几个填空题
    var copyFillInBlankItems = Math.ceil(overHeight / 40) * columns
    var addFillInBlankHtmls = []
    var subjectItems = [].slice.call(part.find('.subjectItem')).reverse()
    subjectItems.forEach(function(subjectItem, index) {
      if (index + 1 > copyFillInBlankItems) return
      subjectItem = $(subjectItem)
      var titleNumber = subjectItem.attr('title-number')
      var subjectItemContent = subjectItem.html()
      addFillInBlankHtmls.push('<div class="subjectItem clearfix" title-number="' +
        titleNumber +
        '">' +
        subjectItemContent +
        '</div>')
      subjectItem.remove()
    })

    return self.tpls.fillInBlankContentTpl.substitute({
      addFillInBlankHtml: addFillInBlankHtmls.reverse().join(''),
      columns: columns
    })
    /**
     * 1 需要确定一行几栏，判断需要复制几个填空题
     * 2 需要确定超出高度，至少高度为一个填空题高度 不足的自动补上
     */
  },
  //上一个模块的拓展模块
  expandModule: function(part) {
    var self = this
    var titleNumber = part.attr('title-number')
    //当前超出的模块height
    var overHeight = self.getOverHeight(part)

    overHeight = overHeight < 10 ? 50 : overHeight
    //如果该模块超出区域 这需要通过linkparam 去 排列超出的顺序
    ++self.editorIndex
    var linkparm = 1
    var cutId = self.editorIndex
    //如果该模块是首次超出 则直接从1开始计数，否则从当前位置开始计数
    if (!part.attr('data-linkparm')) {
      part.attr({
        'data-cutId': self.editorIndex,
        'data-linkparm': linkparm
      })
      linkparm++
    } else {
      linkparm = +part.attr('data-linkparm')
      cutId = +part.attr('data-cutId')
      linkparm++
    }

    return self.tpls.overModuleTpl.substitute({
      overIndex: self.editorIndex,
      cutId: cutId,
      linkparm: linkparm,
      titleNumber: titleNumber,
      editorContentHeight: overHeight
    })
  },
  reducePrintArea: function(curPageEl) {
    var self = this
    var nextPage = curPageEl.next()
    if (!nextPage.length) return
    /**
     * 首先通过判断当前页面的剩余空间是否够下一个页面的第一个模块使用
     * 1 如果下一页第一个是第一页的模块补充模块 直接合并
     * 2 如果下一页第一个不是补充模块，如果上一页的空间大于当前这一页
     *  a. 如果是一个大题 直接把标题带着第一个模块一起拿上去
     *  b. 如果是一个小题 直接把当前小题拿上去，归并到上一个页面的大题下面
     */
    var isContiune = true
    nextPage.find('.answerModule').each(function(index, answerEl) {
      if (!isContiune) return false
      $(answerEl)
        .children('.module')
        .each(function(idx, moduleEl) {
          var curPageContent = curPageEl.children('.dtk-content')
          var firstAnswer = $(answerEl)
          var firstModule = $(moduleEl)
          //当前分页剩余空间
          var surplusHeight =
            curPageEl.height() -
            (curPageContent.height() + self.pagePadding * 2)
          //如果存在剩余空间
          if (surplusHeight >= 0) {
            //如果是补充模块
            if (typeof firstModule.attr('issurplus') === 'string') {
              firstModule.find('.delBtn').trigger('click')
              return
            }
            //模块对比
            var firstModuleHeight = firstModule.height() + self.modulePadding
            if (surplusHeight > firstModuleHeight) {
              //判断是否是一个大题的开始
              var modulePrev = firstModule.prev()
              var hasTitle = modulePrev.length && modulePrev[0].tagName === 'H3'
              var moduleIndex = firstModule.attr('data-editorIndex')
              var titleNumber = firstModule.attr('title-number')
              var moduleType = firstAnswer.attr('data-type')
              var cloneHtml = ''
              //如果没有标题 则认为是 上一页最后一大题的一个小题
              var moduleHtml = self.tpls.moduleTpl.substitute({
                moduleIndex: moduleIndex,
                titleNumber: titleNumber,
                moduleHtml: firstModule.html()
              })
              if (hasTitle) {
                //如果包含title 必须满足上一页面剩余的高度大于 当前页面第一个模块的高度加上模块对应title的高度
                if (surplusHeight <= firstModuleHeight + modulePrev.height())
                  return
                var editModuleHtml =
                  self.tpls.moduleTitleTpl.substitute({
                    title: modulePrev.html()
                  }) + moduleHtml

                cloneHtml = self.tpls.answerModuleTpl.substitute({
                  editModule: editModuleHtml,
                  moduleType: moduleType
                })

                curPageEl.children('.dtk-content').append(cloneHtml)
                modulePrev.remove()
              } else {
                cloneHtml = moduleHtml
                curPageEl.find('.short-answer:last()').append(cloneHtml)
              }
              firstModule.remove()
              if (!firstAnswer.children('.module').length) firstAnswer.remove()
              if (!nextPage.find('.short-answer').length) {
                nextPage.remove()
                //新建的分页
                self.totalPage--
                $('.pageLabel').each(function() {
                  $(this)
                    .find('.totalPage')
                    .html(self.totalPage)
                })
              }
            } else {
              isContiune = false
              return false
            }
          }
        })
    })

    self.reducePrintArea(nextPage)
  },
  //可编辑区域
  editorArea: {},
  editorIndex: 0,
  //创建作答区域模块
  createShortAnswer: function(editorIndex) {
    var self = this
    //this.createShortAnswer("#toolbar2", "#editorContent2", 2);
    var editor = new self.EDITOR(
      '#toolbar' + editorIndex,
      '#editorContent' + editorIndex
    )
    // 关闭粘贴样式的过滤
    editor.customConfig.pasteFilterStyle = false
    editor.customConfig.uploadImgShowBase64 = true
    // 或者 var editor = new E( document.getElementById('editor') )
    editor.create()
    self.editorIndex = editorIndex
    self.editorArea['editor' + editorIndex] = editor
  },
  //新页面预览
  previewPrintDiv: function(printPart) {
    var self = this
    var priviewHtml = self.formatPrintHtml(printPart)
    var iframe = document.createElement('iframe')
    iframe.setAttribute('id', 'preview-iframe')
    document.body.appendChild(iframe)
    var doc = iframe.contentWindow.document
    doc.write(
      '<link rel="stylesheet" type="text/css" href="' + printCssPath + '">'
    )
    doc.write(priviewHtml)
    $('body').append('<div id="closeIframeBtn">关闭</div>')
    $('#closeIframeBtn').click(function() {
      $('#preview-iframe').remove()
      $(this).remove()
    })
  },
  //保存题目坐标信息
  //保存的时候传点坐标和原图
  /**
   * 
    timu:{"KeGuanTi":5,"TianKongTi":10,"ZhuGuanTi":1,"XuanZuoTi":0}
    sheet_answer:{"1":"A","2":"A","3":"A","4":"A","5":"A"}
    sheet_score:{"1":"2","2":"2","3":"2","4":"2","5":"2","6":"2","7":"3","8":"4","9":"5","10":"6","11":"6","12":"7","13":"8","14":"9","15":"10","16":"20"}
    title:22
    exam_id:17464269385543527633
    position
    imgFiles:[fileobj,fileobj]
   */
  //保存题目定位点的时候 获取 题目数量 分数 等信息
  getSaveSubjectInfo: function(questionClassify) {
    var self = this
    var title = $('#dtkName textarea').val()
    //数量
    var timu = {
      KeGuanTi: questionClassify.singleSelect.length,
      TianKongTi: questionClassify.fillInBlank.length,
      ZhuGuanTi: questionClassify.shortAnswer.length,
      XuanZuoTi: questionClassify.chooseAnswer.length
    }
    //选择题答案
    var sheet_answer = {}
    questionClassify.singleSelect.forEach(function(item) {
      sheet_answer[item.questionNum] = item.answer
    })
    //每题对应分数
    var sheet_score = {}
    for (var subjectType in questionClassify) {
      questionClassify[subjectType].forEach(function(subjectItem) {
        sheet_score[subjectItem.questionNum] = '' + subjectItem.fullScore
      })
    }

    self.savePrintInfo = {
      title: title,
      timu: timu,
      sheet_answer: sheet_answer,
      sheet_score: sheet_score
    }
  },
  savePrintPosition: function(printPart) {
    var self = this
    var position = self.getPositions()
    var printHtml = self.formatPrintHtml(printPart)
    var iframe = document.createElement('iframe')
    iframe.setAttribute('id', 'print-iframe')
    document.body.appendChild(iframe)
    var doc = iframe.contentWindow.document
    doc.write(
      '<link rel="stylesheet" type="text/css" href="' + printCssPath + '">'
    )
    doc.write(printHtml)
    doc.close()
    iframe.contentWindow.focus()
    iframe.contentWindow.onload = function() {
      var pages = doc.getElementsByClassName('printIframeContent')
      //生成的pdf所需要的html
      var pdfHtml = self.tpls.htmlSkeleton + printHtml + '</body></html>'
      /**
       * domain+'/print/htmlToPdf'+loginStatus
       * 'http://192.168.1.105:108/index.php/print/htmlToPdf'
       * widthm:'550mm',
       * heightm:'396mm'
       */
      $.post(
        domain + self.apis.htmlToPdfApi + loginStatus,
        {
          pdfHtml: pdfHtml.replace(/\'/g, '"'),
          examGroupId: self.examGroupId,
          widthm: '420mm',
          heightm: '297mm'
        },
        function(res) {
          console.log(JSON.parse(res).message)
        }
      )

      var html2canvasPromise = []
      //html2canvas 返回的是一个promise
      ;[].slice.call(pages).forEach(function(pageItem) {
        html2canvasPromise.push(html2canvas(pageItem))
      })
      Promise.all(html2canvasPromise).then(function(res) {
        var imgFiles = []
        res.forEach(function(canvas, index) {
          var img = Canvas2Image.convertToJPEG(canvas)
          var dataUrl = img.src
          imgFiles.push(dataURLtoFile(dataUrl, 'pic' + index + '.jpeg'))
        })
        self.savePrintInfo.pdfHtml = pdfHtml
        self.savePrintInfo.position = position
        self.savePrintInfo.examGroupId = self.examGroupId
        var formData = new FormData()
        for (var field in self.savePrintInfo) {
          if (~'examGroupId|title|pdfHtml'.indexOf(field)) {
            formData.append(field, self.savePrintInfo[field])
          } else {
            formData.append(field, JSON.stringify(self.savePrintInfo[field]))
          }
        }

        imgFiles.forEach(function(img, index) {
          formData.append('imgFiles' + index, img)
        })

        $.ajax({
          url: domain + self.apis.saveTopicsDetailsApi + loginStatus,
          method: 'POST',
          processData: false,
          contentType: false,
          dataType: 'json',
          data: formData,
          success: function(data) {
            if (data.success === 1) {
              self.modal.init({
                content: '保存成功'
              })
            } else {
              self.modal.init({
                content: '保存失败'
              })
            }
          }
        })
        document.body.removeChild(iframe)
      })
    }
  },
  //下载pdf功能
  downLoadPdf: function($this) {
    var self = this
    window.location.href =
      domain +
      '/print/downPdf' +
      loginStatus +
      '?examGroupId=' +
      self.examGroupId
  },
  /**
   * 处理需要打印的html
   * 返回处理之后直接可以打印的html
   */
  formatPrintHtml: function(elId) {
    //format-需要打印的iframe里面的内容
    //origin-原网页的内容
    var self = this
    var $formatContent = $('#formatContent').html($('#' + elId).html())
    var $formatPageContent = $formatContent.children('.pageContent')
    var $formatDtkTitle = $formatPageContent.eq(0).find('.dtkName')
    var $formatShortAnswer = $formatContent.find('.short-answer')
    var $originShortAnswer = $('#' + elId + ' .short-answer')
    var $originDtkTitle = $('#' + elId + ' .pageContent')
      .eq(0)
      .find('.dtkName')
    //设置每个分页的高度
    $formatPageContent.height(self.config.height + 'mm')
    $formatPageContent.find('.pageLabel .size').remove()
    //设置答题卡title
    $formatDtkTitle.html($originDtkTitle.children('textarea').val())
    $originShortAnswer.each(function(index, el) {
      $(el)
        .children('.module')
        .each(function(idx, elm) {
          var $formatModuleItem = $formatShortAnswer
            .eq(index)
            .children('.module')
            .eq(idx)
          var $scortColumn = $(elm).children('.scortColumn')
          var editorIndex = $(elm).attr('data-editorIndex')
          if (!editorIndex) return
          //富文本编辑内容
          var textareaContent = self.editorArea[
            'editor' + editorIndex
          ].txt.html()
          //打分区域
          var scortArea = $scortColumn.html()
          var classList = $scortColumn.attr('class')
          var scortAreaContent =
            '<div class="' +
            classList +
            '">' +
            (scortArea ? scortArea : '') +
            '</div>'
          //height content
          var modulePrintHeight = self.unitConversion.pxConversionMm(
            $(elm).height()
          )
          $formatModuleItem
            .height(modulePrintHeight + 'mm')
            .html(
              scortAreaContent + self.tpls.moduleBorderTpl + textareaContent
            )
        })
    })
    var linkSrc = ''
    var scriptSrc = ''

    //用几张纸
    var paperLength = Math.ceil($formatPageContent.length / self.columns)
    var printHtmlForPaperHtml = ''
    for (var j = 0; j < paperLength; j++) {
      var printHtml = ''
      for (var k = 0; k < 2; k++) {
        var pageItem = $formatPageContent.eq(j * 2 + k)
        var pageContentStyle = pageItem.attr('style')
          ? pageItem.attr('style')
          : ''
        printHtml +=
          '<div class="pageContent" style="' +
          pageContentStyle +
          '">' +
          (pageItem.length ? pageItem.html() : '') +
          '</div>'
      }
      var scanDotHtml = self.tpls['scanDotPaper' + (j + 1)]
      printHtmlForPaperHtml += self.tpls.printIframeContentTpl.substitute({
        bindingLine: self.hasBindingLine && !j ? 'hasBindingLine' : '',
        columns: self.columns,
        widthMm: self.config.width,
        printHtml: printHtml + scanDotHtml,
        linkSrc: linkSrc,
        scriptSrc: scriptSrc
      })
    }
    return printHtmlForPaperHtml
  },
  //获取定位的基准点
  getPositionOriginPoint: function() {
    var self = this
    //每个分页的定位基准点都是当前分页的左上角
    self.printAreaLeft = $('#printcontent').offset().left
    self.printAreaTop =
      $('#printcontent').offset().top + $('#contentWrap').scrollTop()
  },
  //获取扫描点信息
  getScanPointInfo: function(currentPaper) {
    var self = this
    self.dotWidth = 40
    self.dotHeight = 20
    //获取页面的扫描点
    /**
     * 1.产品定义的区域
     * 2.客观题区域
     * 3.图片考号区域
     * 4.选做题区域
     */
    var location = [
      //上左
      {
        x: 60 * self.dpiRadio,
        y: 20 * self.dpiRadio,
        width: self.dotWidth * self.dpiRadio,
        height: self.dotHeight * self.dpiRadio,
        type: 1
      },
      //上右
      {
        x: (self.pageWidth - 60 - self.dotWidth) * self.dpiRadio,
        y: 20 * self.dpiRadio,
        width: self.dotWidth * self.dpiRadio,
        height: self.dotHeight * self.dpiRadio,
        type: 1
      },
      //下右
      {
        x: (self.pageWidth - 60 - self.dotWidth) * self.dpiRadio,
        y: (self.pageHeight - 20 - self.dotHeight) * self.dpiRadio,
        width: self.dotWidth * self.dpiRadio,
        height: self.dotHeight * self.dpiRadio,
        type: 1
      },
      //下左
      {
        x: 60 * self.dpiRadio,
        y: (self.pageHeight - 20 - self.dotHeight) * self.dpiRadio,
        width: self.dotWidth * self.dpiRadio,
        height: self.dotHeight * self.dpiRadio,
        type: 1
      }
    ]

    if (currentPaper === 1) {
      //上靠左边
      location.splice(1, 0, {
        x: 60 * self.dpiRadio,
        y: 600 * self.dpiRadio,
        width: self.dotWidth * self.dpiRadio,
        height: self.dotHeight * self.dpiRadio,
        type: 1
      })
    } else {
      //上靠右边
      location.splice(1, 0, {
        x: 60 * self.dpiRadio,
        y: (self.pageWidth - 600 - self.dotWidth) * self.dpiRadio,
        width: self.dotWidth * self.dpiRadio,
        height: self.dotHeight * self.dpiRadio,
        type: 1
      })
    }
    return location
  },
  getPicReferencePointInfo: function() {
    var self = this
    var location = []
    //准考证号
    var examNumberEl = $('#hgc_examNumber .ticketNumber')
    var examFirstNumberEl = examNumberEl
      .children('.numberCol')
      .eq(0)
      .children('span')
      .eq(1)
    var examFirstSpaceEl = examNumberEl
      .children('.numberCol')
      .eq(0)
      .children('span')
      .eq(0)
    var examPoint = self.getItemPosition(examFirstNumberEl)
    var examNumber = {
      x: examPoint.x,
      y: examPoint.y,
      width: self.getElementWidth(examNumberEl),
      height:
        self.getElementHeight(examNumberEl) -
        self.getElementHeight(examFirstSpaceEl),
      type: 3
    }

    location.push(examNumber)

    //客观题
    var firstSingleSelectEl = $('.single-option li')
      .eq(0)
      .children('em')
    var lastSingleSelectEl = $('.single-option li:last()').children(
      'span:last()'
    )
    var singleSelectLastPoint = self.getItemPosition(lastSingleSelectEl)
    var singleSelectFirstPoint = self.getItemPosition(firstSingleSelectEl)
    var singleSelect = {
      x: singleSelectFirstPoint.x,
      y: singleSelectFirstPoint.y,
      width:
        singleSelectLastPoint.x -
        singleSelectFirstPoint.x +
        self.getElementWidth(lastSingleSelectEl),
      height:
        singleSelectLastPoint.y -
        singleSelectFirstPoint.y +
        self.getElementHeight(lastSingleSelectEl),
      type: 2
    }
    location.push(singleSelect)

    //选做题
    if ($('.selTopic').length) {
      var selTopicPoint = self.getItemPosition($('.selTopic'))
      var chooseAnswer = {
        x: selTopicPoint.x,
        y: selTopicPoint.y,
        width: self.getElementWidth($('.selTopic')),
        height: self.getElementHeight($('.selTopic')),
        type: 4
      }
      location.push(chooseAnswer)
    }

    return location
  },
  getElementWidth: function(el, type) {
    var self = this
    var width = $(el).width()
    if (type === 'answer') {
      width += self.modulePaddingSide
    }
    return width * self.dpiRadio
  },
  getElementHeight: function(el, type) {
    var self = this
    var height = $(el).height()
    if (type === 'answer') {
      height += self.modulePadding
    }
    return height * self.dpiRadio
  },
  getPositions: function() {
    var self = this
    var printPositionInfo = {
      totalPage: Math.ceil(self.totalPage / self.columns),
      //准考证类型
      school_card_status: self.school_card_status,
      pages: []
    }
    //每张纸的一面
    var paperPosition = {}

    //获取所有选项的坐标
    var answerTypeMap = {
      //0单选 4多选
      singleSelect: 0,
      //填空
      fillInBlank: 3,
      //解答
      answer: 1,
      //选做
      chooseAnswer: 2
    }

    //每次获取每张纸的每一页定位信息，先确定 x轴，y轴的定位基准点
    self.getPositionOriginPoint()
    //首先获取每个纸张一页的扫描点信息
    //self.getScanPointInfo();

    $('#printcontent .pageContent').each(function(pageIndex, pageItem) {
      var $pageItem = $(pageItem)
      //判断纸张的第一面还是第二面 or 正面还是反面
      var paperNo = Math.ceil((pageIndex + 1) / self.columns)
      //如果当前分页所在纸张的面之前已经定义过基础信息直接略过定义
      if (!paperPosition[paperNo]) {
        var location = self.getScanPointInfo(paperNo)
        var spacialSubjectLocation = self.getPicReferencePointInfo()
        location = location.concat(spacialSubjectLocation)
        if (paperNo === 1) {
          var studentcode = self.getExamNumberPosition()
        }
        paperPosition[paperNo] = {
          pageNo: paperNo,
          //四个定位点信息
          location: location,
          //选择条形码还是准考证号码
          studentcode: studentcode,
          //打印区域宽高
          imge: {
            width: self.pageWidth * self.dpiRadio, //self.config.width,
            height: self.pageHeight * self.dpiRadio //self.config.height
          },
          //题目坐标信息
          questions: []
        }
      }

      $pageItem.find('.answerModule').each(function(k, moduleItem) {
        var type = $(moduleItem).attr('data-type')
        var moduleInfo = { type: answerTypeMap[type] }
        var positionInfos = []
        switch (type) {
          case 'singleSelect':
            positionInfos = self.getSingleSelectPositions(
              moduleItem,
              moduleInfo
            )
            break
          case 'answer':
            positionInfos = self.getAswerPositions(moduleItem, moduleInfo)
            break
          case 'chooseAnswer':
            positionInfos = self.getChooseAswerPositions(moduleItem, moduleInfo)
            break
          case 'fillInBlank':
            positionInfos = self.getFillInBlankPOsitions(moduleItem, moduleInfo)
            break
        }
        paperPosition[paperNo].questions = paperPosition[
          paperNo
        ].questions.concat(positionInfos)
      })
    })

    for (var paperKey in paperPosition) {
      printPositionInfo.pages.push(paperPosition[paperKey])
    }

    console.log(JSON.stringify(printPositionInfo, null, 4))
    return printPositionInfo
  },
  //准考证和条形码区域
  getExamNumberPosition: function() {
    var self = this
    //判断显示的是准考证号还是条形码
    var isExamNumber = $('.selOptions input[name="studentCode"]')
      .eq(0)
      .prop('checked')
    var studentcodePosition = {}
    //准考证号
    if (isExamNumber) {
      var numberWidth = false
      var numberHeight = false
      studentcodePosition = {
        type: 2,
        object: []
      }
      $('#hgc_print .ticketNumber')
        .children('.numberCol')
        .each(function(k, numberColItem) {
          var group = []
          $(numberColItem)
            .find('i')
            .each(function(m, numberItem) {
              var numberPosition = self.getItemPosition(numberItem)
              numberWidth = numberWidth || self.getElementWidth(numberItem)
              numberHeight = numberHeight || self.getElementHeight(numberItem)
              group.push({
                x: numberPosition.x,
                y: numberPosition.y,
                width: numberWidth,
                height: numberHeight,
                optName: m
              })
            })
          studentcodePosition.object.push({
            group: group
          })
        })
    } else {
      var examMarkEl = $('#hgc_examNumber .barCode')
      var barCodePosition = self.getItemPosition(examMarkEl)
      studentcodePosition = {
        type: 1,
        object: {
          x: barCodePosition.x,
          y: barCodePosition.y,
          width: self.getElementWidth(examMarkEl),
          height: self.getElementHeight(examMarkEl)
        }
      }
    }

    return studentcodePosition
  },
  //单选题坐标获取
  getSingleSelectPositions: function(moduleItem, moduleInfo) {
    var self = this
    var optionInfos = []
    $(moduleItem)
      .find('li')
      .each(function(i, optionItems) {
        var optionInfo = {
          type: moduleInfo.type,
          answer: $(optionItems).attr('data-answer'),
          score: {
            full: 5
          },
          id: $(optionItems).attr('title-number'),
          opt: []
        }
        $(optionItems)
          .children('span')
          .each(function(k, option) {
            var optionPosition = self.getItemPosition(option)
            var width = self.getElementWidth(option) //self.unitConversion.pxConversionMm($(option).width());
            var height = self.getElementHeight(option) //self.unitConversion.pxConversionMm($(option).height());
            var optName = $(option).attr('data-option')
            optionInfo.opt.push({
              x: optionPosition.x,
              y: optionPosition.y,
              width: width,
              height: height,
              optName: optName
            })
          })
        optionInfos.push(optionInfo)
      })
    return optionInfos
  },
  //填空题
  getFillInBlankPOsitions: function(moduleItem, moduleInfo) {
    var self = this
    var optionInfos = []
    $(moduleItem)
      .find('.subjectItem')
      .each(function(i, optionItems) {
        var $subjectCol = $(optionItems).parent('.subjectCol')
        var optionInfo = {
          type: moduleInfo.type,
          score: {
            full: 5
          },
          column: $subjectCol.attr('data-column') || 1,
          scoreStyle: $subjectCol.attr('data-scoreStyle') || '',
          id: $(optionItems).attr('title-number'),
          cut: {}
        }
        var optionPosition = self.getItemPosition(optionItems)
        var width = self.getElementWidth(optionItems) //self.unitConversion.pxConversionMm($(option).width());
        var height = self.getElementHeight(optionItems) //self.unitConversion.pxConversionMm($(option).height());
        var optName = $(optionItems).attr('data-option')
        optionInfo.cut = {
          x: optionPosition.x,
          y: optionPosition.y,
          width: width,
          height: height,
          optName: optName
        }
        optionInfos.push(optionInfo)
      })
    return optionInfos
  },
  //解答题坐标获取
  getAswerPositions: function(moduleItem, moduleInfo) {
    var self = this
    var answerInfos = []
    $(moduleItem)
      .find('.module')
      .each(function(m, moduleEl) {
        var modulePositon = self.getItemPosition(moduleEl, 'answer')
        //self.unitConversion.pxConversionMm($(moduleEl).width() + 20);
        var width = self.getElementWidth(moduleEl, 'answer')
        //self.unitConversion.pxConversionMm($(moduleEl).height() + 20);
        var height = self.getElementHeight(moduleEl, 'answer')
        var titleNumber = $(moduleEl).attr('title-number')
        var scoreLimit = $(moduleEl).attr('scorelimit') || '16'

        //判断当前区域是否有超出的链接模块
        var linkParm = +$(moduleEl).attr('data-linkparm') || 0
        var cutId = $(moduleEl).attr('data-cutId')
        var answerInfo = {
          type: moduleInfo.type,
          id: titleNumber,
          scoreLimit: scoreLimit,
          cut: {
            x: modulePositon.x,
            y: modulePositon.y,
            width: width,
            height: height,
            cutid: cutId,
            linkparm: linkParm
          }
        }
        answerInfos.push(answerInfo)
      })

    return answerInfos
  },
  //选做题坐标获取
  getChooseAswerPositions: function(moduleItem, moduleInfo) {
    var self = this
    var chooseAnswerInfos = []
    $(moduleItem)
      .find('.module')
      .each(function(n, moduleEl) {
        var modulePositon = self.getItemPosition(moduleEl, 'chooseAnswer')
        var width = self.getElementWidth(moduleEl, 'answer') // self.unitConversion.pxConversionMm($(moduleEl).width() + 20);
        var height = self.getElementHeight(moduleEl, 'answer') //self.unitConversion.pxConversionMm($(moduleEl).height() + 20);
        var titleNumber = $(moduleEl).attr('title-number')
        var scoreLimit = $(moduleEl).attr('scorelimit') || '16'
        //是否是上一题的补充区域
        //判断当前区域是否有超出的链接模块
        var linkParm = +$(moduleEl).attr('data-linkparm') || 0
        var cutId = $(moduleEl).attr('data-cutId')

        var chooseAnswerInfo = {
          type: moduleInfo.type,
          id: titleNumber,
          scoreLimit: scoreLimit,
          select: 1,
          total: titleNumber.split(',').length,
          selectqts: [
            {
              cut: {
                x: modulePositon.x,
                y: modulePositon.y,
                width: width,
                height: height,
                cutid: cutId,
                linkparm: linkParm
              },
              opt: []
            }
          ]
        }

        $(moduleEl)
          .find('.selTopic span')
          .each(function(l, selItem) {
            var optName = $(selItem).attr('data-titleNumber')
            var selItemPosition = self.getItemPosition(selItem, 'selTopic')
            var width = self.getElementWidth(selItem) //self.unitConversion.pxConversionMm($(selItem).width());
            var height = self.getElementHeight(selItem) //self.unitConversion.pxConversionMm($(selItem).height());
            chooseAnswerInfo.selectqts[0].opt.push({
              optName: optName,
              width: width,
              height: height,
              x: selItemPosition.x,
              y: selItemPosition.y
            })
          })
        chooseAnswerInfos.push(chooseAnswerInfo)
      })

    return chooseAnswerInfos
  },
  /**
   *
   * @param {想要定位的元素} el
   * @param {打印区域靠左距离} printAreaLeft
   * @param {打印区域靠右距离} printAreaTop
   * @param {是不是富文本解答题} isModule
   * 如果是分栏 偶数页面的X轴定位点都要 加一个固定分页的宽
   */
  getItemPosition: function(el, moduleType) {
    var self = this
    var curPageIndex =
      $(el)
        .closest('.pageContent')
        .index() + 1
    var positionY =
      $(el).offset().top + $('#contentWrap').scrollTop() - self.printAreaTop
    var positionX = $(el).offset().left - self.printAreaLeft
    var columnLeft = 0
    // //考虑特殊模块的的截取区域 简答题需要
    // if (moduleType === "answer" || moduleType === "chooseAnswer") {
    //   answerTop = 30;
    // }
    //考虑分栏的定位点
    if (self.columns > 1 && !(curPageIndex % 2)) {
      columnLeft = self.pageWidth / self.columns
    }
    if (curPageIndex > 1) {
      positionY -= (curPageIndex - 1) * self.pageHeight
    }
    return {
      x: (positionX + columnLeft - 59) * self.dpiRadio,
      //self.unitConversion.pxConversionMm(positionX + answerLeft + columnLeft).toFixed(3),
      y: (positionY - 20) * self.dpiRadio
      //self.unitConversion.pxConversionMm(positionY + answerTop).toFixed(3)
    }
  }
}

$(function() {
  Print.init(sizeConfig)
})
