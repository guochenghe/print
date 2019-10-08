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
};

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
    this.title = data.title || "消息提示";
    this.conetnt = data.content || "提示消息";
    this.sureCb = data.sureCb || function() {};
    this.cancelCb = data.cancelCb || function() {};

    this.render();
    this.initDom();
    this.bindEvent();
  },
  initDom: function() {
    this.$modalBox = $(".hgc_modalBox");
  },
  render: function(content) {
    var self = this;
    $("body").append(
      self.tpl.substitute({ content: self.conetnt, title: self.title })
    );
  },
  bindEvent: function() {
    var self = this;
    self.$modalBox.find(".modalBtns .sure").click(function() {
      self.sureCb();
      self.$modalBox.remove();
    });
    self.$modalBox.find(".modalBtns .cancel").click(function() {
      self.cancelCb();
      self.$modalBox.remove();
    });
    self.$modalBox.find("h2 .close").click(function() {
      self.$modalBox.remove();
    });
  }
};
/**
 * 定位点的设置
 * top定位点都是基于当前page来定位的
 * left
 *
 */
/**
 * 打印功能主体
 */
var Print = {
  init: function(config) {
    this.modal = hgc_modal;
    this.config = config.A4;
    //分栏
    this.columns = 1;

    //页面页码计算
    //当前分页
    this.currentPage = 1;
    //总分页
    this.totalPage = 1;
    //当前纸张-包括正反两面 ceil(totalPage/(column*2))
    this.currentPaper = 0;
    //当前纸张正面1正面2 反面1 反面2
    this.currentPaperPage = 0;
    //装订线
    this.hasBindingLine = true;
    //初始化页面数据
    //核心功能模块盒模型设计
    this.modulePaddingTop = 51;
    this.modulePaddingBottom = 11;
    this.modulePadding = this.modulePaddingTop + this.modulePaddingBottom;
    this.pagePadding = 50;
    //用于页面 mm 和 px 之间单位转换
    this.unitConversion = new UnitConversion();
    this.pageHeight = this.unitConversion.mmConversionPx(this.config.height);
    this.pageWidth = this.unitConversion.mmConversionPx(this.config.width);
    //富文本编辑 ==>> 全局富文本编辑构造函数
    this.EDITOR = window.wangEditor;
    //初始化页面渲染
    this.initPage();
    //初始化打印面积
    this.initPrintContentArea();

    this.initDom();

    this.bindEvent();

    this.initEvent();
  },
  tpls: {
    printPageStyle:
      '<style id="pageSizeStyle">\
			.printcontent{width:{pageWidth}px;}\
			.pageContent{height:{pageHeight}px;}\
		</style>',
    pageModuleTpl:
      '<div class="pageContent" style="page-break-after:always;">\
                    <div class="scan-dot">\
                        <span data-option="tl" class="fl tl"></span>\
                        <span data-option="tr" class="fr tr"></span>\
                    </div>\
                    <div class="dtk-content">{subjectModule}</div>\
                    <div class="scan-dot bot">\
                        <span data-option="bl" class="fl bl"></span>\
                        <span data-option="br" class="fr br"></span>\
                    </div>\
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
      '<div class="short-answer answerModule">\
                            {editModule}\
                        </div>',
    moduleTitleTpl: "<h3>{title}</h3>",
    moduleTpl:
      '<div class="module" data-editorIndex="{moduleIndex}">{moduleHtml}</div>',
    //小题
    overModuleTpl:
      '<div class="module pdt10" isSurplus data-editorIndex="{overIndex}"><div class="dragBtn"></div><div class="delBtn"></div>\
        <div id="toolbar{overIndex}" class="toolbar"></div>\
        <div id="editorContent{overIndex}" class="editorContent">\
        </div></div>',
    //打印的模版
    printIframeContentTpl:
      '<div class="printIframeContent column{columns} {bindingLine}" style="width:{widthMm}mm;">{printHtml}</div>',
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
  },
  // 初始化打印区域宽高 mm 转 px
  initPrintContentArea: function() {
    var self = this;
    var headEL = $("head");
    self.pageHeight = self.unitConversion.mmConversionPx(self.config.height);
    self.pageWidth = self.unitConversion.mmConversionPx(self.config.width);

    if ($("#pageSizeStyle").length) $("#pageSizeStyle").remove();
    var initPrintPageStyle = self.tpls.printPageStyle.substitute({
      pageWidth: self.pageWidth / self.columns,
      pageHeight: self.pageHeight
    });
    headEL.append(initPrintPageStyle);
  },
  //render page
  initPage: function() {
    $("#hgc_print").height($(window).height());
    //新建简答题
    this.createShortAnswer(2);
    this.createShortAnswer(3);
    this.createShortAnswer(4);
    this.createShortAnswer(5);
  },
  initDom: function() {
    var self = this;
    self.$layoutItem = $("#hgc_print .layoutItem");
  },
  initEvent:function(){
    var self = this;
    //当前默认是 A3 两栏 有装订线 有条形码 有准考证号
    $('.selOptions input[name="paper"]').eq(0).prop('checked',true);
    $('.selOptions input[name="hasBinding"]').eq(0).prop('checked',true);
    $('.selOptions input:gt(3)').prop('checked',true);

  },
  bindEvent: function() {
    var self = this;
    //控制答题卡区域缩放事件
    (function() {
      var distance = 0;
      var startPageY = 0;
      var isCanMove = false;
      //改变之前的初始高度
      var startHeight = 0;
      //只要改变高度的模块
      var changeEl = null;
      //当前操作的分页
      var curPageEl = $("#printcontent .pageContent").eq(0);
      var curPageOffsetTop = 0;
      //当前缩放分页下面的按钮
      var curDtkModelEl = null;
      var curDtkModelOffsetTop = 0;
      self.curDtkModelEl = curDtkModelEl = curPageEl.find(".module").eq(0);

      self.changePrintArea(curPageEl);

      $("#printcontent").on("mousedown", ".short-answer .dragBtn", function(e) {
        var inscreaseTop = $("#contentWrap").scrollTop();
        curPageEl = $(this).closest(".pageContent");
        curPageOffsetTop = curPageEl.offset().top + inscreaseTop;
        self.curDtkModelEl = curDtkModelEl = $(this).closest(".module");
        curDtkModelOffsetTop = curDtkModelEl.offset().top + inscreaseTop;
        changeEl = $(this).siblings(".editorContent");
        startHeight = changeEl.height();
        startPageY = e.pageY;
        isCanMove = true;

        //判断是否超过了一页
        /**
         * 1当前模块已经缩放超过了当前页
         *  a>该区域后面的内容板块自动清空
         *  b>该区域不可再移动,自动新建一页,然后在下一页新建一个富文本默认是上一页超出的区域
         * 2后面的模块超过了当前缩放页面
         *  a>直接把后面的题放到新排版页面
         */
        document.onmouseup = function(e) {
          self.changePrintArea(curPageEl);
          isCanMove = false;
          curPageEl = null;
          document.onmouseup = null;
        };
      });
      /**
       * 超过当前纸张的情况下 当鼠标松开的时候
       * 1先把当前纸张放满
       * 2剩余高度重新新到下个版本新建一个富文本高度一样没有内容
       * 3单词拖动鼠标控制解答题区域缩放只能拖动到当前页面最底部
       */
      document.onmousemove = function(e) {
        if (!isCanMove) return;
        //当前可以拖动的极限距离
        // var curCanDragMaxDistance = (curPageEl.index()+1)*(self.pageHeight - 50);
        //判断当前模块是否到底部,如果当前缩放的模块，拉到当前模块底部，直接鼠标弹起
        if (
          curDtkModelOffsetTop + curDtkModelEl.height() + self.modulePadding >=
          curPageOffsetTop + self.pageHeight - self.pagePadding
        ) {
          document.onmouseup(e);
          return;
        }
        distance = e.pageY - startPageY;
        changeEl.height(startHeight + distance);
      };
    })();
    //删除一个分页超出的部分
    $("#printcontent").on("click", ".delBtn", function(e) {
      var $this = $(this);
      self.delPageOverPart($this);
    });

    $("#previewBtn").click(function() {
      self.previewPrintDiv("printcontent");
    });
    $("#printBtn").click(function() {
      self.printdiv("printcontent");
    });
    //答题卡布局
    self.$layoutItem.click(function() {
      var column = +$(this).attr("data-column");
      $(this)
        .addClass("current")
        .siblings()
        .removeClass("current");
      self.columns = column;
      self.initPrintContentArea();
    });
    $(".selOptions input").change(function() {
      var $this = $(this);
      var type = $this.attr("data-type");
      switch (type) {
        //修改纸张规格
        case "paper":
          self.changePaperSize($this);
          break;
        case "binding":
          self.ifBindingLine($this);
          break;
        case "style":
          self.selExamNumberStyle($this);
          break;
      }
    });

    //单模块设置
    $("#printcontent").on("click", ".settingBtn", function() {
      var $this = $(this);
      var type = $this.attr("data-type");
      if (type === "fillInBlank") {
        self.fillInBlankSet($this);
      } else {
        self.shortAnswerSet($this);
      }
    });
  },
  //填空题设置
  fillInBlankSet: function($this) {
    var self = this;
    var curPageEl = $this.closest(".pageContent");
    var fillInBlankCol = $this.siblings(".subjectCol");
    var scorePartEl = fillInBlankCol.find(".subjectItem strong");

    function rendScore(score) {
      return "<i>" + score + "</i>";
    }
    self.modal.init({
      title: "填空题设置",
      content: self.tpls.fillInBlankOptionTpl,
      sureCb: function() {
        var column = $("#fillInBlankColumn").val();
        var scoreStyle = $("#scoreStyle")
          .val()
          .split("/");
        var scoreHtml = "";
        scoreStyle.forEach(function(score) {
          scoreHtml += rendScore(score);
        });
        scorePartEl.html(scoreHtml);
        fillInBlankCol[0].classList = "subjectCol col-" + column;
        //如果填空题由原来的一行变成多行，就有可能影响所有的布局样式，重新布局整个答题卡
        self.changePrintArea(curPageEl);
      }
    });
  },
  //解答题设置
  shortAnswerSet: function($this) {
    var self = this;
    var scorePartEl = $this.siblings(".scortColumn");
    function rendScore(score) {
      return "<span>" + score + "</span>";
    }
    self.modal.init({
      title: "解答题设置",
      content: self.tpls.shortAnswerOptionTpl,
      sureCb: function() {
        var bit = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        //各个分值对应的分值 布局格式
        var scoreLimitMap = {
          "16": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          "29": {
            tenPlace: [1, 2],
            bit: bit
          },
          "49": {
            tenPlace: [1, 2, 3, 4],
            bit: bit
          }
        };
        var scoreLimitKey = $("#scoreLimit").val();
        var scoreLimit = scoreLimitMap[scoreLimitKey];
        var scoreModuleHtml = "";
        var scoreLimitArr = [];
        if (scoreLimitKey === "16") {
          scoreLimitArr = scoreLimit;
        } else {
          scoreLimitArr.push("十位");
          scoreLimitArr = scoreLimitArr.concat(scoreLimit.tenPlace);
          scoreLimitArr.push("个位");
          scoreLimitArr = scoreLimitArr.concat(scoreLimit.bit);
        }
        scoreLimitArr.forEach(function(score) {
          scoreModuleHtml += rendScore(score);
        });
        scorePartEl.html(scoreModuleHtml);
      }
    });
  },
  //修改纸张尺寸
  changePaperSize: function($this) {
    var self = this;
    var paper = $this.attr("data-value");
    var columnMap = {
      A3: "2,3",
      A4: "1,2"
    };
    var showColumns = columnMap[paper].split(",");

    self.config = sizeConfig[paper];
    self.initPrintContentArea();

    self.$layoutItem.hide();
    showColumns.forEach(function(index) {
      self.$layoutItem.eq(index - 1).show();
    });
    self.$layoutItem.eq(showColumns[0] - 1).trigger("click");
  },
  //是否有装订线
  ifBindingLine: function($this) {
    var self = this;
    self.hasBindingLine = $this.attr("data-value") === "yes";
    var isUseClass = self.hasBindingLine ? "addClass" : "removeClass";
    var isHideBinding = self.hasBindingLine ? "show" : "hide";
    $("#printcontent")
      [isUseClass]("hasBindingLine")
      .find(".bindingLine")
      [isHideBinding]();
  },
  //选择考号版式
  selExamNumberStyle: function($this) {
    var self = this;
    var value = $this.attr("data-value");
    var $ticketNumber = $("#hgc_examNumber .ticketNumber");
    var $barCode = $("#hgc_examNumber .barCode");
    var isSel = $this.prop("checked");
    if (value === "examNumber") {
      $ticketNumber[isSel ? "show" : "hide"]();
    } else {
      $barCode[isSel ? "show" : "hide"]();
    }
  },
  //删除一个分页超出的部分
  delPageOverPart: function($delBtn) {
    var self = this;
    var answerModel = $delBtn.closest(".short-answer");
    var delModel = $delBtn.closest(".module");
    var delPage = delModel.closest(".pageContent");
    var prevPageLastModule = delPage.prev().find(".module:last()");
    var prevPageLastEditor = prevPageLastModule.children(".editorContent");
    if (
      !delModel.siblings(".module").length &&
      !answerModel.siblings(".short-answer").length
    ) {
      delPage.remove();
    }
    prevPageLastEditor.height(
      prevPageLastEditor.height() - self.modulePaddingBottom
    );
    prevPageLastModule.append('<div class="dragBtn"></div>');
    delModel.remove();
    if (!answerModel.children(".module").length) answerModel.remove();
  },
  /**
   * 获取超出当前page的模块 作答大题区域模块 作答小题区域模块
   * @return {answerModule,subjectModule}
   */
  getOverModule: function(curPageEl) {
    var self = this;
    var overPart = false;
    //当前第几页，用做后面计算的高度距离的倍数
    var times = curPageEl.index() + 1;
    //判断超出当前页面的条件
    var overHeight = (self.pageHeight - self.pagePadding * 2) * times;
    //判断当前区域是否超出
    function isOver(el) {
      return (
        $(el).height() + $(el).offset().top + $("#contentWrap").scrollTop() >=
        overHeight
      );
    }
    /**
     * 1 判断当前页面里面的答题区域内容是否超过了当前页面所能承受的内容的高度
     *  a 如果超出了，从当前移动的那个模块开始向后判断，取出所有超出的模块
     *     I 在下一页的排版中，如果下一页存在直接插入最前面，如果不存在，直接新建一页==>>然后循环【1】操作
     *  b 如果没有超出直接退出
     */

    //需要判断当前page里面所有模块是否有超出
    //当前答题卡区域
    var curDtkPartEl = curPageEl.children(".dtk-content");
    if (curDtkPartEl.height() + self.pagePadding * 2 >= self.pageHeight) {
      var shortAnswerEl = curDtkPartEl.children(".answerModule");
      for (var i = 0, ilen = shortAnswerEl.length; i < ilen; i++) {
        var shortAnswerItem = shortAnswerEl.eq(i);
        //找到第一个超过当前页面的元素，把这个以及以后的模块提取出来在下一个版面进行重新排版
        //得到第一个大题的index  第一个大题下面小题的index
        if (isOver(shortAnswerItem)) {
          var moduleEl = $(shortAnswerItem).children(".module");
          for (var m = 0, mlen = moduleEl.length; m < mlen; m++) {
            var moduleItem = moduleEl.eq(m);
            if (isOver(moduleItem)) {
              overPart = {
                curPage: curPageEl,
                answerModule: shortAnswerItem,
                subjectModule: moduleItem
              };
              break;
            }
          }
        }
      }
    }
    return overPart;
  },
  //根据缩放的要求拓宽需要打印的区域
  /**
   *
   * @param {*} curPageEl
   * 1拓宽打印区域
   * 2减小打印区域
   */
  changePrintArea: function(curPageEl) {
    var self = this;
    //找出超出的区域
    var overPart = self.getOverModule(curPageEl);
    if (overPart) {
      self.addPrintArea(curPageEl, overPart);
    } else {
      self.reducePrintArea(curPageEl);
    }
  },
  addPrintArea: function(curPageEl, overPart) {
    var self = this;
    var curPageIndex = curPageEl.index();
    var times = curPageIndex + 1;
    var part = overPart.subjectModule;
    var subjectHtml = "";
    //合并的简答题区域
    var overAnswerHtml = "";
    //新建page
    var newPage = "";
    //判断是否是当前模块超出
    var isCurModule = part[0] === self.curDtkModelEl[0];
    //通过缩放确定每个页面需要移除的元素
    var removeElements = [];

    var nextPageEl = curPageEl.next();
    //首先判断是要删除下一个分页的补充模块如果下一个分页存在的话
    if(nextPageEl.length){
      var nextPageFirstModule = nextPageEl.find(".module").eq(0);
      if (typeof nextPageFirstModule.attr("isSurplus") === "string") {
        nextPageFirstModule.children(".delBtn").trigger("click");
      }
    }

    while (part.length) {
      /**
       * 如果是当前缩放的模块超出，直接在下一模块新建当前模块的子模块，
       * 如果不是，则直接拷贝超出模块所有内容到下一页
       */
      //part !== overPart.subjectModule ||
      //当前缩放的模块没有超出规定区域 则超出的所有模块全局复制
      if (part !== overPart.subjectModule || !isCurModule) {
        var moduleIndex = part.attr("data-editorIndex");
        var moduleTitle = "";
        var modulePrev = part.prev();
        var hasTitle = modulePrev.length && modulePrev[0].tagName === "H3";
        if (hasTitle) {
          moduleTitle = self.tpls.moduleTitleTpl.substitute({
            title: modulePrev.html()
          });
        }
        subjectHtml +=
          moduleTitle +
          self.tpls.moduleTpl.substitute({
            moduleIndex: moduleIndex,
            moduleHtml: part.html()
          });
        removeElements.push(part);
        //part.remove();
        hasTitle && removeElements.push(modulePrev);
      } else {
        subjectHtml += self.tpls.overModuleTpl.substitute({
          overIndex: ++self.editorIndex
        });

        removeElements.push(part.children(".dragBtn"));
      }
      part = part.next();
    }

    //超出模块
    overAnswerHtml = self.tpls.answerModuleTpl.substitute({
      editModule: subjectHtml
    });

    //判断超出简答题区域
    var overAnswerModule = overPart.answerModule.next();
    while (overAnswerModule.length) {
      overAnswerHtml += self.tpls.answerModuleTpl.substitute({
        editModule: overAnswerModule.html()
      });
      if (overAnswerModule !== overPart.answerModule) {
        removeElements.push(overAnswerModule);
        //overAnswerModule.remove();
      }
      overAnswerModule = overAnswerModule.next();
    }

    /**
     * 是否需要重置上一个页面的高度
     * 当前缩放的模块超出，直接当前模块在当前分页高度设置到限制内最大
     *
     */
    if (isCurModule) {
      //重置上一页第一个超出模块的高度 = pageHeight - subject.offset().top - subjectModullePadding的模块高度
      //self.unitConversion.pxConversionMm(preFirstOverModuleHeight)+'mm'//转mm高度
      var preFirstOverModuleHeight =
        self.pageHeight * times -
        overPart.subjectModule.offset().top -
        $("#contentWrap").scrollTop() -
        self.pagePadding -
        self.modulePadding;
      overPart.subjectModule
        .children(".editorContent")
        .height(preFirstOverModuleHeight);
    }

    removeElements.forEach(function(element) {
      $(element).remove();
    });
    //是否存在下一个分页
    if (nextPageEl.length) {
      nextPageEl.children(".dtk-content").prepend(overAnswerHtml);
    } else {
      //新建的分页
      self.totalPage++;
      self.currentPage++;
      self.currentPaper = Math.ceil(self.totalPage/(self.columns*2));
      self.currentPaperPage = self.totalPage%4?self.totalPage%4:0;

      newPage = self.tpls.pageModuleTpl.substitute({
        subjectModule: overAnswerHtml,
        currentPage:self.currentPage,
        totalPage:self.totalPage,
        currentPaper:self.currentPaper,
        currentPaperPage:self.currentPaperPage,
      });
      $("#printcontent").append(newPage);
      nextPageEl = $("#printcontent").children(".pageContent:last()");
    }

    isCurModule && self.createShortAnswer(self.editorIndex);
    //递归轮询判断
    self.changePrintArea(nextPageEl);
  },
  reducePrintArea: function(curPageEl) {
    var self = this;
    var nextPage = curPageEl.next();
    if (!nextPage.length) return;
    /**
     * 首先通过判断当前页面的剩余空间是否够下一个页面的第一个模块使用
     * 1 如果下一页第一个是第一页的模块补充模块 直接合并
     * 2 如果下一页第一个不是补充模块，如果上一页的空间大于当前这一页
     *  a. 如果是一个大题 直接把标题带着第一个模块一起拿上去
     *  b. 如果是一个小题 直接把当前小题拿上去，归并到上一个页面的大题下面
     */
    var isContiune = true;
    nextPage.find(".answerModule").each(function(index, answerEl) {
      if (!isContiune) return false;
      $(answerEl)
        .children(".module")
        .each(function(idx, moduleEl) {
          var curPageContent = curPageEl.children(".dtk-content");
          var firstAnswer = $(answerEl);
          var firstModule = $(moduleEl);
          //当前分页剩余空间
          var surplusHeight =
            curPageEl.height() -
            (curPageContent.height() + self.pagePadding * 2);
          //如果存在剩余空间
          if (surplusHeight >= 0) {
            //如果是补充模块
            if (typeof firstModule.attr("issurplus") === "string") {
              firstModule.find(".delBtn").trigger("click");
              return;
            }
            //模块对比
            var firstModuleHeight = firstModule.height() + self.modulePadding;
            if (surplusHeight > firstModuleHeight) {
              //判断是否是一个大题的开始
              var modulePrev = firstModule.prev();
              var hasTitle =
                modulePrev.length && modulePrev[0].tagName === "H3";
              var moduleIndex = firstModule.attr("data-editorIndex");
              var cloneHtml = "";
              //如果没有标题 则认为是 上一页最后一大题的一个小题
              var moduleHtml = self.tpls.moduleTpl.substitute({
                moduleIndex: moduleIndex,
                moduleHtml: firstModule.html()
              });
              if (hasTitle) {
                //如果包含title 必须满足上一页面剩余的高度大于 当前页面第一个模块的高度加上模块对应title的高度
                if (surplusHeight <= firstModuleHeight + modulePrev.height())
                  return;
                var editModuleHtml =
                  self.tpls.moduleTitleTpl.substitute({
                    title: modulePrev.html()
                  }) + moduleHtml;

                cloneHtml = self.tpls.answerModuleTpl.substitute({
                  editModule: editModuleHtml
                });

                curPageEl.children(".dtk-content").append(cloneHtml);
                modulePrev.remove();
              } else {
                cloneHtml = moduleHtml;
                curPageEl.find(".short-answer:last()").append(cloneHtml);
              }
              firstModule.remove();
              if (!firstAnswer.children(".module").length) firstAnswer.remove();
              if (!nextPage.find(".short-answer").length) nextPage.remove();
            } else {
              isContiune = false;
              return false;
            }
          }
        });
    });

    self.reducePrintArea(nextPage);
  },
  //可编辑区域
  editorArea: {},
  editorIndex: 0,
  //创建作答区域模块
  createShortAnswer: function(editorIndex) {
    var self = this;

    //this.createShortAnswer("#toolbar2", "#editorContent2", 2);
    var editor = new self.EDITOR(
      "#toolbar" + editorIndex,
      "#editorContent" + editorIndex
    );
    // 或者 var editor = new E( document.getElementById('editor') )
    editor.create();
    self.editorIndex = editorIndex;
    self.editorArea["editor" + editorIndex] = editor;
  },
  //新页面预览
  previewPrintDiv: function(printPart) {
    var self = this;
    var priviewHtml = self.formatPrintHtml(printPart);
    localStorage.setItem("previewHtml", priviewHtml);
    window.open("./preview.html");
  },
  printdiv: function(printPart) {
    var self = this;
    var printHtml = self.formatPrintHtml(printPart);
    var doc = null;
    iframe = document.createElement("iframe");
    iframe.setAttribute("id", "print-iframe");
    document.body.appendChild(iframe);
    doc = iframe.contentWindow.document;
    doc.write('<link rel="stylesheet" type="text/css" href="./css/print.css">');
    doc.write(printHtml);
    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.onload = function() {
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    };

    self.getPositions();
  },
  /**
   * 处理需要打印的html
   * 返回处理之后直接可以打印的html
   */
  formatPrintHtml: function(elId) {
    //format-需要打印的iframe里面的内容
    //origin-原网页的内容
    var self = this;
    var $formatContent = $("#formatContent").html($("#" + elId).html());
    var $formatPageContent = $formatContent.children(".pageContent");
    var $formatDtkTitle = $formatPageContent.eq(0).find('.dtkName');
    var $formatShortAnswer = $formatContent.find(".short-answer");
    var $originShortAnswer = $("#" + elId + " .short-answer");
    var $originDtkTitle = $('#'+elId+' .pageContent').eq(0).find('.dtkName');
    //设置每个分页的高度
    $formatPageContent.height(self.config.height + "mm");
    //设置答题卡title
    $formatDtkTitle.html($originDtkTitle.children('textarea').val());
    $originShortAnswer.each(function(index, el) {
      $(el)
        .children(".module")
        .each(function(idx, elm) {
          var $formatModuleItem = $formatShortAnswer
            .eq(index)
            .children(".module")
            .eq(idx);
          var $scortColumn = $(elm).children(".scortColumn");
          var editorIndex = $(elm).attr("data-editorIndex");
          if (!editorIndex) return;
          //富文本编辑内容
          var textareaContent = self.editorArea[
            "editor" + editorIndex
          ].txt.html();
          //打分区域
          var scortArea = $scortColumn.html();
          var scortAreaContent =
            '<div class="scortColumn">' +
            (scortArea ? scortArea : "") +
            "</div>";
          //height content
          var modulePrintHeight = self.unitConversion.pxConversionMm(
            $(elm).height()
          );
          $formatModuleItem
            .height(modulePrintHeight + "mm")
            .html(scortAreaContent + textareaContent);
        });
    });
    return self.tpls.printIframeContentTpl.substitute({
      bindingLine: self.hasBindingLine ? "hasBindingLine" : "",
      columns: self.columns,
      widthMm: self.config.width,
      printHtml: $("#formatContent").html()
    });
  },
  getPositions: function() {
    var self = this;
    var positions = {
      //四个定位点信息
      location: [],
      //打印区域宽高
      imge: {
        width: self.config.width * 1000,
        height: self.config.height * 1000
      },
      //题目坐标信息
      object: []
    };

    self.printAreaLeft = 0;
    self.printAreaTop = 0;
    //获取页面的扫描点
    $("#printcontent .scan-dot span").each(function(index, el) {
      var dotPosition = self.getItemPosition(el);
      positions.location.push({
        x: dotPosition.x,
        y: dotPosition.y,
        width: self.unitConversion.pxConversionMm(20) * 1000,
        height: self.unitConversion.pxConversionMm(5) * 1000
      });
    });
    //获取所有选项的坐标
    var answerTypeMap = {
      //单选
      singleSelect: 0,
      //填空
      fillInBlank: 3,
      //解答
      answer: 1,
      //选做
      chooseAnswer: 2
    };
    //每个分页的定位基准点都是当前分页的左上角
    self.printAreaLeft = $("#printcontent").offset().left;
    self.printAreaTop = $("#printcontent").offset().top + $("#contentWrap").scrollTop();
    $("#printcontent .answerModule").each(function(index, moduleItem) {
      var type = $(moduleItem).attr("data-type");
      var moduleInfo = { type: answerTypeMap[type] };
      var positionInfos = [];
      switch (type) {
        case "singleSelect":
          positionInfos = self.getSingleSelectPositions(moduleItem, moduleInfo);
          break;
        case "answer":
          positionInfos = self.getAswerPositions(moduleItem, moduleInfo);
          break;
        case "chooseAnswer":
          positionInfos = self.getChooseAswerPositions(moduleItem, moduleInfo);
          break;
      }
      positions.object = positions.object.concat(positionInfos);
    });
    console.log(JSON.stringify(positions, null, 4));
  },
  //单选题坐标获取
  getSingleSelectPositions: function(moduleItem, moduleInfo) {
    var self = this;
    var optionInfos = [];
    $(moduleItem)
      .find("li")
      .each(function(i, optionItems) {
        var optionInfo = {
          type: moduleInfo.type,
          id: $(optionItems).attr("title-number"),
          opt: []
        };
        $(optionItems)
          .children("span")
          .each(function(k, option) {
            var optionPosition = self.getItemPosition(option);
            var width = self.unitConversion.pxConversionMm($(option).width());
            var height = self.unitConversion.pxConversionMm($(option).height());
            var optName = $(option).attr("data-option");
            optionInfo.opt.push({
              x: optionPosition.x,
              y: optionPosition.y,
              width: width * 1000,
              height: height * 1000,
              optName: optName
            });
          });
        optionInfos.push(optionInfo);
      });
    return optionInfos;
  },
  //解答题坐标获取
  getAswerPositions: function(moduleItem, moduleInfo) {
    var self = this;
    var answerInfos = [];
    $(moduleItem)
      .find(".module")
      .each(function(m, moduleEl) {
        var modulePositon = self.getItemPosition(moduleEl, "answer");
        var width = self.unitConversion.pxConversionMm(
          $(moduleEl).width() + 20
        );
        var height = self.unitConversion.pxConversionMm(
          $(moduleEl).height() + 20
        );
        var titleNumber = $(moduleEl).attr("title-number");
        var answerInfo = {
          type: moduleInfo.type,
          id: titleNumber,
          cut: {
            x: modulePositon.x,
            y: modulePositon.y,
            width: width * 1000,
            height: height * 1000
          }
        }
        answerInfos.push(answerInfo);
      });

    return answerInfos;
  },
  //选做题坐标获取
  getChooseAswerPositions: function(moduleItem, moduleInfo) {
    var self = this;
    var chooseAnswerInfos = [];
    $(moduleItem)
      .find(".module")
      .each(function(n, moduleEl) {
        var modulePositon = self.getItemPosition(moduleEl, "chooseAnswer");
        var width = self.unitConversion.pxConversionMm(
          $(moduleEl).width() + 20
        );
        var height = self.unitConversion.pxConversionMm(
          $(moduleEl).height() + 20
        );
        var titleNumber = $(moduleEl).attr("title-number");
        var chooseAnswerInfo = {
          type: moduleInfo.type,
          id: titleNumber,
          cut: {
            x: modulePositon.x,
            y: modulePositon.y,
            width: width * 1000,
            height: height * 1000
          },
          opt: []
        };

        $(moduleItem)
          .find(".selTopic span")
          .each(function(l, selItem) {
            var optName = $(selItem).attr("data-option");
            var selItemPosition = self.getItemPosition(selItem, "selTopic");
            var width = self.unitConversion.pxConversionMm($(selItem).width());
            var height = self.unitConversion.pxConversionMm(
              $(selItem).height()
            );
            chooseAnswerInfo.opt.push({
              optName: optName,
              width: width * 1000,
              height: height * 1000,
              x: selItemPosition.x,
              y: selItemPosition.y
            });
          });
        chooseAnswerInfos.push(chooseAnswerInfo);
      });

    return chooseAnswerInfos;
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
    var self = this;
    var curPageIndex = $(el).closest(".pageContent").index();
    var positionY = $(el).offset().top + $("#contentWrap").scrollTop() - self.printAreaTop;
    var positonX = $(el).offset().left - self.printAreaLeft;
    var answerTop = 0;
    var answerLeft = 0;
    var columnLeft = 0;
    //考虑特殊模块的的截取区域 简答题需要
    if (moduleType === "answer" || moduleType === "chooseAnswer") {
      answerTop = 30;
    } else if (moduleType === "selTopic") {
      answerLeft = 10;
      
    }
    //考虑分栏的定位点
    if (self.columns > 1 && !curPageIndex % 2) {
      columnLeft = self.pageWidth;
    }
    if(self.columns === 1){
      positionY -= curPageIndex*self.pageHeight;
    }

    return {
      x:
        self.unitConversion
          .pxConversionMm(positonX + answerLeft + columnLeft)
          .toFixed(3) * 1000,
      y:
        self.unitConversion.pxConversionMm(positionY + answerTop).toFixed(3) *
        1000
    };
  }
};

$(function() {
  Print.init(sizeConfig);
});
