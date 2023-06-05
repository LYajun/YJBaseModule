// 判断是否符合替换类型
function ReplaceTypeFunc(WordsStr, KlgStr) {
    var ReDataArr = {
        Header: "",
        Footer: ""
    };
    if (WordsStr.indexOf(KlgStr + " ") == 0) {
        // 单词类型:头部
        ReDataArr = { Header: "", Footer: " " };
    }
    else if (WordsStr.indexOf(KlgStr + "<") == 0) {
        // 标签类型:头部
        ReDataArr = { Header: "", Footer: "<" };
    }
    else if (WordsStr.indexOf(" " + KlgStr) == (WordsStr.length - KlgStr.length - 1)) {
        // 单词类型:尾部
        ReDataArr = { Header: " ", Footer: "" };
    }
    else if (WordsStr.indexOf(">" + KlgStr) == (WordsStr.length - KlgStr.length - 1)) {
        // 标签类型:尾部
        ReDataArr = { Header: ">", Footer: "" };
    }
    else {
        // 混合类型
        var HeaderArr = [" ", ">", "("];  // 头部可能出现的字符
        var FooterArr = [" ", "<", ")", ",", "."];  // 尾部可能出现的字符
        for (var i = 0; i < HeaderArr.length; i++) {
            for (var j = 0; j < FooterArr.length; j++) {
                if (WordsStr.indexOf(HeaderArr[i] + KlgStr + FooterArr[j]) > -1) {
                    return { Header: HeaderArr[i], Footer: FooterArr[j] };
                }
            }
        }
    }
    return ReDataArr;
}
// 替换
function AddDealKnTextFunc(WordsStr, KlgArr, KlgCodeArr) {
    for (var i = 0; i < KlgArr.length; i++) {
        var ReDataArr = ReplaceTypeFunc(WordsStr, KlgArr[i]);
        if (ReDataArr.Header != "" || ReDataArr.Footer != "") {
            WordsStr = WordsStr.replace(ReDataArr.Header + KlgArr[i] + ReDataArr.Footer, ReDataArr.Header + "<a class='TextMark' title='点击可查看知识点课件' word='" + KlgArr[i] + "' code='" + KlgCodeArr[i] + "'>" + KlgArr[i] + "</a>" + ReDataArr.Footer);
        }
    }
    return WordsStr;
}
// 知识点划线处理(使用代码方式，使用节点方式用MarkKlgFunc))
// htmls接口获取到的HTML代码，Knowledge知识点，code知识点编码
function MarkKnowledge(htmls, Knowledge, code) {
    var WordReg = "";
    var reg = /[>]([^<>]*)[<]/gi;
    htmls = htmls.replace(reg, function (match, group) {
        var matchVal = group;
        if (matchVal.replace(/\s*/gi, "").length != 0) {
            for (var n = 0; n < Knowledge.length; n++) {
                if (Knowledge[n] != "--") {
                    Knowledge[n] = Knowledge[n].replace("(", "").replace(")", "");
                    WordReg = "(\"|'|\\s|^[a-zA-Z][^>]|^){1}(" + Knowledge[n] + ")(d|ed|s|es|er|ers|ing)?(,|\\.|\\?|'|\"|\\s|;|$){1}";
                    var RegWord = new RegExp(WordReg, 'i');
                    matchVal = matchVal.replace(RegWord, " $1#￥@<" + n + ">$2#￥@$3$4 ");
                    if (matchVal != group) {
                        group = matchVal;
                        Knowledge[n] = "--";
                    }
                }
            }
            //去掉未能标志的知识点标志
            matchVal = matchVal.replace(/#￥@<(\d+)>(('?\w+\s*-?)+)#￥@(d|ed|s|es|er|ers|ing)?/gi, "<a class='TextMark' title='点击可查看知识点课件' word='$2' code='$1'>$2$4</a>")
            matchVal = matchVal.replace(/#￥@/g, "");

            return ">" + matchVal + "<";
        }
        else {
            return match;
        }
    });
    //加上单词编码
    reg = /<a[^>]*class='TextMark'[^>]*code='(\d+)'>/gi;
    htmls = htmls.replace(reg, function (match, group) {
        return match.replace(group, code[group]);;
    });

    return htmls;
}
// 处理包含和被包含的关系
function DealContrainFunc(klgStr, klgcodeStr) {
    var klgArr = klgStr.split("|");
    var klgcodeArr = klgcodeStr.split("|");
    var IndexArr = [];
    for (var i = 0; i < klgArr.length; i++) {
        for (var j = 0; j < klgArr.length; j++) {
            if (i != j && klgArr[i].indexOf(klgArr[j]) > -1 && IndexArr.indexOf(j) == -1) {
                IndexArr.push(j);
            }
            else if (i != j && klgArr[j].indexOf(klgArr[i]) > -1 && IndexArr.indexOf(i) == -1) {
                IndexArr.push(i);
            }
        }
    }
    IndexArr.sort().reverse();
    for (var i = 0; i < IndexArr.length; i++) {
        klgArr.splice(IndexArr[i], 1);
        klgcodeArr.splice(IndexArr[i], 1);
    }
    var ReData = {
        klgStr: klgArr.join("|"),
        klgcodeStr: klgcodeArr.join("|")
    };
    return ReData;
}
// 获取全大写特殊字符
function GetDealKnTextFunc(KlgStr) {
    if (KlgStr == null || KlgStr == "") {
        return null;
    }
    var ReArr = [];  // 获取全为大写的字符
    var KlgArr = KlgStr.split("|");
    var RegesRules = RegExp(/[a-z]+/);
    for (var i = 0; i < KlgArr.length; i++) {
        // 判断是否全大写
        if (!RegesRules.test(KlgArr[i].toString())) {
            ReArr.push(i);
        }
    }
    return ReArr;
}
// 计算存在padding的表格
function GetPadVal(THandel) {
    // 判断是否存在border
    var BorderVal=0;
    var BorderStr = $(THandel).css("border-right-width");
    if (BorderStr != null && BorderStr != "") {
        BorderVal = parseFloat(BorderStr.replace("px").replace("PX"));
    }
    BorderStr = $(THandel).css("border-right-width");
    if (BorderStr != null && BorderStr != "") {
        BorderVal += parseFloat(BorderStr.replace("px").replace("PX"));
    }
    // 判断是否存在padding
    var PaddingVal = $(THandel).css("padding");
    if (PaddingVal == null || PaddingVal == "") {
        PaddingVal = parseFloat($(THandel).css("padding-left")) + parseFloat($(THandel).css("padding-right"));
        if (PaddingVal == null || PaddingVal == "") {
            return BorderVal;
        }
        return BorderVal+PaddingVal;
    }
    var PadValArr = PaddingVal.split(" ");
    if (PadValArr.length > 2) {
        return BorderVal + parseFloat(PadValArr[1]) + parseFloat(PadValArr[3]);
    }
    else if (PadValArr.length > 1) {
        return BorderVal + parseFloat(PadValArr[1]) * 2;
    }
    else {
        return BorderVal + parseFloat(PadValArr[0]) * 2;
    }
}
// 处理表格内的图片宽度
var DealImageWFunc = function (Item, WidthVal) {
    var pattWStr = new RegExp(/width\s?:\s?[0-9]+%;/ig);
    var pattWStr2 = new RegExp(/width\s?=\s?["|'|0-9]+%/ig);
    $.each($(Item).find("img"), function (index, iItem) {
        var HtmlStr = $(iItem).prop("outerHTML");
        var matchesWArr = HtmlStr.match(pattWStr);
        if (matchesWArr != null && matchesWArr.length > 0) {
            if (matchesWArr[0].indexOf("%") > -1) {
                var TWidthVal = parseFloat(matchesWArr[0].replace(/\s/g, "").replace("width:", ""));
                $(this).css("width", (WidthVal * TWidthVal / 100) + "px");
            }
        }
        var matchesWArr = HtmlStr.match(pattWStr2);
        if (matchesWArr != null && matchesWArr.length > 0) {
            if (matchesWArr[0].indexOf("%") > -1) {
                var TWidthVal = parseFloat(matchesWArr[0].replace(/\s/g, "").replace("\"", "").replace("width=", ""));
                $(this).css("width", (WidthVal * TWidthVal / 100) + "px");
            }
        }
    });
};
// 获取最大字符长度的字符串(起决定宽度的字符串/将字符去除HTML标签)
var removeHtmlFunc = function (htmlStr, TdWidthVal) {
    var ReArr = {
        TextStr: "",
        WidthVal: 0,
        ImgFlag: false,
    };
    // 清除非长度标签
    var pattStr = new RegExp(/<(img){1}.*?>/ig);
    var matchesArr = htmlStr.match(pattStr);
    if (matchesArr != null && (matchesArr != undefined && matchesArr.length > 0)) {
        for (var i = 0; i < matchesArr.length; i++) {
            var TempWidthVal = 0;
            var pattWStr = new RegExp(/width\s?:\s?[0-9|p|x|%]+;/ig);
            var matchesWArr = matchesArr[i].match(pattWStr);
            if (matchesWArr != null && matchesWArr.length > 0) {
                if (matchesWArr[0].indexOf("%") > -1) {
                    var TWidthVal = parseFloat(matchesWArr[0].replace(/\s/g, "").replace("width:", ""));
                    TempWidthVal += TdWidthVal * TWidthVal;
                }
                else {
                    TempWidthVal += parseFloat(matchesWArr[0].replace(/\s/g, "").replace("width:", "").replace("px", ""));
                }
            }
            pattWStr = new RegExp(/width\s?=\s?["|'|0-9|p|x|%]+/ig);
            matchesWArr = matchesArr[i].match(pattWStr);
            if (matchesWArr != null && matchesWArr.length > 0) {
                if (matchesWArr[0].indexOf("%") > -1) {
                    var TWidthVal = parseFloat(matchesWArr[0].replace(/\s/g, "").replace("width=", ""));
                    TempWidthVal += TdWidthVal * TWidthVal;
                } else {
                    TempWidthVal += parseFloat(matchesWArr[0].replace(/\s/g, "").replace("width=", "").replace("px", ""));
                }
            }
            ReArr.WidthVal = TempWidthVal > ReArr.WidthVal ? TempWidthVal : ReArr.WidthVal;
            if (ReArr.WidthVal != 0) {
                ReArr.ImgFlag = true;
            }
            htmlStr = htmlStr.replace(matchesArr[i], "");
        }
    }
    // 其他处理
    pattStr = new RegExp(/(<(p){1}.*?>).*?(<\/\2>)/ig);
    matchesArr = htmlStr.match(pattStr);
    if (matchesArr != undefined && matchesArr.length > 0) {
        // 清除匹配的P标签
        for (var i = 0; i < matchesArr.length; i++) {
            // 去除多标签
            pattStr = new RegExp(/(<([a-z|A-Z]+){1}.*?>).*?(<\/\2>)/i);
            var NewhtmlStr = matchesArr[i];
            while (pattStr.test(NewhtmlStr)) {
                var tTmatchesArr = NewhtmlStr.match(pattStr);
                if (tTmatchesArr.length > 0) {
                    // 存在P标签
                    NewhtmlStr = NewhtmlStr.replace(tTmatchesArr[1], "").replace(tTmatchesArr[3], "");
                }
            }
            // 去除单标签
            pattStr = new RegExp(/(<([a-z|A-Z]+){1}\\s*\/\\s*>)/i);
            while (pattStr.test(NewhtmlStr)) {
                var tTmatchesArr = NewhtmlStr.match(pattStr);
                if (tTmatchesArr.length > 0) {
                    // 存在P标签
                    NewhtmlStr = NewhtmlStr.replace(tTmatchesArr[1], "");
                }
            }
            if (i == 0 || (htmlStr.length < NewhtmlStr.length)) {
                htmlStr = NewhtmlStr;
            }
        }
    }
    else {
        pattStr = new RegExp(/(<([a-z|A-Z]+){1}.*?>).*?(<\/\2>)/i);  // 去除多标签
        while (pattStr.test(htmlStr)) {
            var tTmatchesArr = htmlStr.match(pattStr);
            if (tTmatchesArr.length > 0) {
                // 存在P标签
                htmlStr = htmlStr.replace(tTmatchesArr[1], "").replace(tTmatchesArr[3], "");
            }
        }
        // 去除单标签
        pattStr = new RegExp(/(<([a-z|A-Z]+){1}\\s*\/\\s*>)/i);
        while (pattStr.test(htmlStr)) {
            var tTmatchesArr = htmlStr.match(pattStr);
            if (tTmatchesArr.length > 0) {
                // 存在P标签
                htmlStr = htmlStr.replace(tTmatchesArr[1], "");
            }
        }
    }
    // 去除多空格
    while (htmlStr.match(/\s\s/g)) {
        htmlStr = htmlStr.replace(/\s\s/g, " ");
    }
    while (htmlStr.indexOf("&nbsp;&nbsp;")>-1) {
        htmlStr = htmlStr.replace("&nbsp;&nbsp;", "&nbsp;");
    }

    ReArr.TextStr = htmlStr;
    return ReArr;
};
// 动态获取表格最小宽度设置(最小宽度165px)
var GetMinTableVal = function (TSWidth) {
    if (TSWidth > 320) {
        return 165 + (TSWidth - 320) * 0.09;
    }
    else {
        return 165;
    }
};
// 表格处理
function AdjustTableFunc(sWidthVal) {
    if ($("table").length == 0) {
        return;
    }
    // 添加宽度处理
    var TempMinWidth = GetMinTableVal(sWidthVal);
    $(document.body).append('<span id="pContrainId"></span>');
    $.each($("table"), function (index, item) {
        // 处理表格总宽度
        var ArrMaxLen = [];
        var FJArrMaxLen = [];
        var TableWidth = 0;
        var TotalMaxLen = 0;
        var RuleFlag = true;
        var HasIndex = 0;
        var MaxTrGetPadVal=0;
        var MaxTdGetPadVal=0;
        RSArrs = [];
        $.each($(item).find("tr"), function (trIndex, trItem) {
            var TrGetPadVal=GetPadVal($(trItem));
            if(MaxTrGetPadVal<TrGetPadVal)
            {
                MaxTrGetPadVal=TrGetPadVal;
            }
            $.each($(trItem).find("td"), function (tdIndex, tdItem) {
                var TdGetPadVal=GetPadVal($(tdItem));
                if(MaxTdGetPadVal<TdGetPadVal)
                {
                    MaxTdGetPadVal=TdGetPadVal;
                }
                var RowSpanNum = parseInt($(tdItem).attr("rowspan"));
                var ColSpanNum = parseInt($(tdItem).attr("colspan"));
                RowSpanNum = (RowSpanNum == 0 || isNaN(RowSpanNum)) ? 1 : RowSpanNum;
                ColSpanNum = (ColSpanNum == 0 || isNaN(ColSpanNum)) ? 1 : ColSpanNum;
                if (ColSpanNum > 1) {
                    RuleFlag = false;
                }
                if (RowSpanNum > 1) {
                    var RSArr = {
                        RSIndex: HasIndex,
                        RSNumber: RowSpanNum,
                        RSXIndex: tdIndex,
                        RSYIndex: trIndex
                    };
                    HasIndex += 1;
                    RSArrs.push(RSArr);
                }
                var WidthVal = $(tdItem).css("width").replace("px", "");
                var RemoveHtmlArr = removeHtmlFunc($(tdItem).html(), WidthVal);
                // 附加处理图片宽度
                DealImageWFunc(trItem, WidthVal);
                $("#pContrainId").text(RemoveHtmlArr.TextStr);
                var tdWidthVal = $("#pContrainId").width() + parseFloat(RemoveHtmlArr.WidthVal);  // 获取文字宽度
                tdWidthVal += GetPadVal($(tdItem)) + 10;
                if (!RemoveHtmlArr.ImgFlag && (tdWidthVal > sWidthVal)) {
                    tdWidthVal = sWidthVal;
                }
                // 判断是否需要设置最小宽度
                if (tdWidthVal < TempMinWidth&&false) {
                    // 因DataStr5去掉最小宽度处理
                    tdWidthVal = TempMinWidth;
                }
                if (tdWidthVal < 70+GetPadVal($(tdItem))) {
                    tdWidthVal = 70+GetPadVal($(tdItem));
                }
                if (ArrMaxLen.length < tdIndex + 1) {
                    ArrMaxLen.push(0);
                }
                if (RSArrs.length > 0) {
                    for (var i = 0; i < RSArrs.length; i++) {
                        if (RSArrs[i].RSNumber > 1 && RSArrs[i].RSYIndex == trIndex) {
                            if (ArrMaxLen[tdIndex] < tdWidthVal && ColSpanNum == 1) {
                                TotalMaxLen += tdWidthVal - ArrMaxLen[tdIndex];
                                ArrMaxLen[tdIndex] = tdWidthVal;
                            }
                        }
                    }
                }
                else {
                    if (ArrMaxLen[tdIndex] < tdWidthVal && ColSpanNum == 1) {
                        TotalMaxLen += tdWidthVal - ArrMaxLen[tdIndex];
                        ArrMaxLen[tdIndex] = tdWidthVal;
                    }
                    else if (ColSpanNum > 1) {
                        var AddFlag = true;
                        for (var i = 0; i < FJArrMaxLen.length; i++) {
                            if (FJArrMaxLen[i].tdIndex == tdIndex) {
                                if (FJArrMaxLen[i].WidthVal < tdWidthVal) {
                                    FJArrMaxLen[i].WidthVal = tdWidthVal;
                                    AddFlag = false;
                                }
                            }
                        }
                        if (AddFlag) {
                            FJArrMaxLen.push({ trIndex: trIndex, tdIndex: tdIndex, WidthVal: tdWidthVal });
                        }
                    }
                }
            });
            for (var i = 0; i < RSArrs.length; i++) {
                if (RSArrs[i].RSNumber > 1) {
                    RSArrs[i].RSNumber -= 1;
                }
                else {
                    RSArrs.splice(i);
                }
            }
        });
        for (var i = 0; i < FJArrMaxLen.length; i++) {
            for (var j = 0; j < ArrMaxLen.length; j++) {
                if (ArrMaxLen[j] == 0 && FJArrMaxLen[i].tdIndex == j) {
                    ArrMaxLen[j] = FJArrMaxLen[i].WidthVal;
                }
            }
        }
        // 判断表格是否只有一行
        if ($(item).find("tr").length == 1 && $(item).find("td").length == 1) {
            var nSWidthVal=sWidthVal - GetPadVal(item)-MaxTrGetPadVal-MaxTdGetPadVal;
            $(item).find("tr").eq(0).find("td").eq(0).css("width", (nSWidthVal-10) + "px");  // ios需要减10
            $(item).css("width", nSWidthVal + "px");
        }
        else {
            if (TotalMaxLen < sWidthVal) {
                var AddPx = (sWidthVal - TotalMaxLen) / ArrMaxLen.length;
                AddPx = AddPx > 2 ? AddPx - 2 : AddPx;
                for (var i = 0; i < ArrMaxLen.length; i++) {
                    ArrMaxLen[i] += AddPx;
                }
            }
            var OneFlag = false;
            for (var i = 0; i < ArrMaxLen.length; i++) {
                if (ArrMaxLen[i] != undefined && ($(item).find("td").length > 1 || $(item).find("tr").length > 1) && RuleFlag) {
                    if (i < ArrMaxLen.length - 1) {
                        $(item).find("tr").find("td").eq(i).css("width", ArrMaxLen[i] + "px");
                        TableWidth += ArrMaxLen[i];
                    }
                    else {
                        $(item).find("tr").find("td").eq(i).css("width", ArrMaxLen[i] + "px");  // 不做减10处理,免得出现作答超过td
                        //$(item).find("tr").find("td").eq(i).css("width", (ArrMaxLen[i] - 10) + "px");
                        TableWidth += (ArrMaxLen[i] - 10);
                    }
                }
                else if (ArrMaxLen[i] != undefined && $(item).find("tr").length == 1 && $(item).find("td").length == 1) {
                    OneFlag = true;
                    if (ArrMaxLen.length - 1 == i) {
                        TableWidth += ArrMaxLen[i] - 10;
                    }
                    else {
                        TableWidth += ArrMaxLen[i];
                    }
                }
            }
            if (ArrMaxLen != undefined && ($(item).find("td").length > 1 || $(item).find("tr").length > 1) && !RuleFlag) {
                var TWAFlag = true;
                $.each($(item).find("tr"), function (trIndex, trItem) {
                    if ($(trItem).find("td").length == ArrMaxLen.length) {
                        $.each($(trItem).find("td"), function (tdIndex, tdItem) {
                            if (TWAFlag) {
                                TableWidth += ArrMaxLen[tdIndex];
                            }
                            $(tdItem).css("width", ArrMaxLen[tdIndex] + "px");
                        });
                        TWAFlag = false;
                    }
                });
            }
            if (OneFlag) {
                $(item).find("tr").eq(0).find("td").eq(0).css("width", TableWidth + "px");
            }
            $(item).css("width", TableWidth + "px");
        }
        // 替换HTML
        var ChildhtmlStr = $(item).prop("outerHTML");
        var htmlStr = "<div class='TableContainer TContain_" + index + "'></div>";
        $(item).after(htmlStr);
        $(item).remove();
        var JqStr = ".TContain_" + index;
        $(JqStr).append(ChildhtmlStr);
    });
    // 滚动条处理
    var BodyWidth = isNaN(parseFloat(sWidthVal)) ? 0 : parseFloat(sWidthVal);  // 界面宽度
    $.each($("table"), function (index, item) {
        var TableWidth = isNaN(parseFloat($(item).width())) ? 0 : parseFloat($(item).width());  // 表格宽度
        // 替换HTML
        var JqStr = ".TContain_" + index;
        $(JqStr).css("width", BodyWidth + "px");
        if (TableWidth > BodyWidth) {
            // 额外显示滚动条
            var ShtmlStr = "<div class='PSBar' style='width: " + BodyWidth + "px;'></div>";
            $(JqStr).after(ShtmlStr);
            var HiddenRate = BodyWidth / TableWidth;  // 滚动条比率
            var HiddenWidth = BodyWidth - (TableWidth - BodyWidth) * HiddenRate;  // 现滚动条大小
            var CShtmlStr = "<div class='CSBar' style='width: " + HiddenWidth + "px;'></div>";
            $(JqStr).next().append(CShtmlStr);
        }
        else {
            $(JqStr).css("margin-bottom", "15px");
        }
    });
    $.each($(".container-table"), function (index, item) {
        $(item).css("width", BodyWidth + "px");
    });
    // 滚动条事件
    $(".TableContainer").on("touchstart", function () {
        pressTableFlag = true;
    }).on("touchmove", function () {
        var TableWidth = isNaN(parseFloat($(this).find("table").width())) ? 0 : parseFloat($(this).find("table").width());  // 表格宽度
        var HiddenRate = BodyWidth / TableWidth;  // 滚动条比率
        var SLeftWdith = isNaN(parseFloat($(this)[0].scrollLeft)) ? 0 : parseFloat($(this)[0].scrollLeft);
        SLeftWdith *= HiddenRate;
        var NextClsName = $(this).next().attr("class");
        if (NextClsName == "PSBar") {
            $(this).next().find(".CSBar").css("left", SLeftWdith + "px");
        }
    });
    window.addEventListener("scroll", function (event) {
        var ClsName = event.target.className;
        if (ClsName == undefined) {
            return;
        }
        ClsName = ClsName.replace("TableContainer ", ".");
        var TableWidth = isNaN(parseFloat($(ClsName).find("table").width())) ? 0 : parseFloat($(ClsName).find("table").width());  // 表格宽度
        var HiddenRate = BodyWidth / TableWidth;  // 滚动条比率
        var SLeftWdith = isNaN(parseFloat($(ClsName)[0].scrollLeft)) ? 0 : parseFloat($(ClsName)[0].scrollLeft);
        SLeftWdith *= HiddenRate;
        var NextClsName = $(ClsName).next().attr("class");
        if (NextClsName == "PSBar") {
            $(ClsName).next().find(".CSBar").css("left", SLeftWdith + "px");
        }
    }, true);
    $("#pContrainId").remove();
}
// ios样式渲染不通处理
function AddCssDealFunc(TextIndent){
    if(TextIndent)
    {
        $("p.tq-p").css("text-indent","2em");  // 题库样式
    }
    $(".AnswerIndex").css("text-indent","0em").css("margin-left","5px");
    $("table p.tq-p").css("text-indent","0em");  // 题库样式
    $("table td").css("text-indent","0em");  // 题库样式
    $("table p.tq-p u").css("text-decoration-line","none");  // 题库样式
    $("table p.tq-p u").css("text-decoration","none");  // 题库样式
    $(".passageLabel").css("text-align","center");  // 题库样式
    $(".passageLabelABC").css("text-align","center");  // 题库样式
}
// 删除"____" 替换为"__(1)__"
function DealUnderlineContentF(DataStr,StartIndex,SpaceStatus){
    if(SpaceStatus==0)
    {
        return DataStr;
    }
    while (DataStr!=null&&DataStr.indexOf("___") != -1) {
        var UnderLineArr = DataStr.match(/\_{3,}/g);
        if (UnderLineArr != null&&UnderLineArr[0].length>=3) {
            if(SpaceStatus==2)
            {
                DataStr = DataStr.replace(UnderLineArr[0], "<span>"+StartIndex+".</span><span class='AnswerIndex' data-anserindex='"+StartIndex+"' data-lastindex='0'><span class='AIItem'>&nbsp;&nbsp;</span></span>");
            }
            else
            {
                DataStr = DataStr.replace(UnderLineArr[0], "<span class='AnswerIndex' data-anserindex='"+StartIndex+"' data-lastindex='0'><span class='AIItem'>&nbsp;&nbsp;</span></span>");
            }
            StartIndex++;
        }
    }
    // 最后一个index
    var JQStr = ".AnswerIndex[data-anserindex='"+(StartIndex-1)+"']";
    $(JQStr).attr('data-lastindex','1');
    return DataStr;
}

// #region移动端回调
// 点击答题点移动端回调。下标DataAnserIndex
function AnserIndexBackCall(DataAnserIndex){
    // 
}
// 知识点回调,回调编码DataCode
function TextMarkBackCall(DataCode){
    alert(DataCode);
}
// 点击“析”字回调
function ClickJXBackCall(DataAnserIndex){
    //
}
//#endregion

//#region移动端回填处理
// 答题点移动端回填。下标DataAnserIndex，用户作答StuAnswer，标准答案QuesAnswer,作答状态AnswerStatus(0表示未完成,1表示已完成无解析,2表示完成有解析),TrueStatus是否正确(0表示错误，1表示正确)
function AnserIndexBackWrite(DataAnserIndex,StuAnswer,QuesAnswer,AnswerStatus,TrueStatus){
    var TNullINdex=1;
    var WidthAddVal=0;
    if(AnswerStatus==0&&(StuAnswer==undefined||StuAnswer==null||StuAnswer==""))
    {
        StuAnswer="&nbsp;&nbsp;";
        TNullINdex=0;
    }
    else if(AnswerStatus!=0&&(StuAnswer==undefined||StuAnswer==null||StuAnswer==""))
    {
        if (QuesAnswer=="") {
            StuAnswer='<span style="color:#FF4D4D;">未填写</span>';
        }
        else{
            WidthAddVal=55-(5+QuesAnswer.length)*SaveFontSizeVal;
            StuAnswer='<span style="color:#FF4D4D;">未填写</span><span style="color:#00C063;">('+QuesAnswer+')</span>';
        }
    }
    else if(AnswerStatus!=0){
        WidthAddVal=55-(StuAnswer.length+QuesAnswer.length)*SaveFontSizeVal;
        if(TrueStatus==1&&QuesAnswer!="")
        {
            StuAnswer='<span style="color:#00C063;">'+StuAnswer+'</span><span style="color:#00C063;">('+QuesAnswer+')</span>';
        }
        else if(TrueStatus==1&&QuesAnswer==""){
            StuAnswer='<span style="color:#00C063;">'+StuAnswer+'</span>';
        }
        else if(QuesAnswer!=""){
            StuAnswer='<span style="color:#FF4D4D;">'+StuAnswer+'</span><span style="color:#00C063;">('+QuesAnswer+')</span>';
        }
        else{
            StuAnswer='<span style="color:#FF4D4D;">'+StuAnswer+'</span>';
        }
    }
    else{
        WidthAddVal=55-StuAnswer.length*SaveFontSizeVal;
    }
    var JQStr = ".AnswerIndex[data-anserindex='"+DataAnserIndex+"']";
    if($(JQStr).length>0){
        // ios无法控制颜色调整特殊处理
        if(TNullINdex==1){
            if(WidthAddVal>0)
            {
                WidthAddVal=WidthAddVal/2;
                StuAnswer='<div class="FullSpace" style="display: inline-block;width: '+WidthAddVal+'px;">&nbsp;&nbsp;</div>'+StuAnswer+'<div class="FullSpace" style="display: inline-block;width: '+WidthAddVal+'px;">&nbsp;&nbsp;</div>';
            }
            else{
                StuAnswer='<div class="FullSpace" style="display: none;width: '+WidthAddVal+'px;">&nbsp;&nbsp;</div>'+StuAnswer+'<div class="FullSpace" style="display: none;width: '+WidthAddVal+'px;">&nbsp;&nbsp;</div>';
            }
            $(JQStr).html(StuAnswer).css("color","#0099ff").css("font-size","14px").css("text-align","center").css("display","inline").css("border-bottom","1px solid #000").css("border-radius","3px 3px 0px 0px").append('<div class="NextU" style="display: inline-block;width: 1px;height: 1px;">&nbsp;</div>');  // 添加后缀
            var NextClsName = $(JQStr).next().attr("class");
            NextClsName=(NextClsName==undefined||NextClsName==null||NextClsName=="")?"":NextClsName;
            if(AnswerStatus==2&&NextClsName!="JXCls"){
                $(JQStr).after('<span class="JXCls" style="color:#FF9901;font-size:14px;" onclick="ClickJXBackCall('+DataAnserIndex+')">【析】</span>');  // 添加后缀 
            }
        }
        else
        {
            // 回填结构
            var HtmlStr="<span class='AIItem' style='display: inline-block;text-align: center;color: #0099ff;padding: 0px 5px;font-size: 14px;line-height: 18px;min-width: 55px;border-bottom: 1px solid #000;border-radius: 3px 3px 0px 0px;'>&nbsp;&nbsp;</span>";
            $(JQStr).css("border-bottom","none").html(HtmlStr);
        }
    }
    $(".AnswerIndex").css("font-size",SaveFontSizeVal+"px");
}
// 设置字体大小，FontSize=16表示16px
var SaveFontSizeVal = 16;
function SetFontSizeFunc(FontSize){
    SaveFontSizeVal=FontSize;
    $(".AIItem").css("font-size",FontSize+"px");
    $(".AIItem").css("height",(FontSize+2)+"px");
    $(".AIItem").css("line-height",(FontSize+2)+"px");
}
// 答题点离屏幕顶部高度，Status=1为获取后句尾距离
function GetTopVal(IDName,DataAnserIndex,Status=0){
    var JQStr = ".AnswerIndex[data-anserindex='"+DataAnserIndex+"']";
    if(Status==0||$(JQStr).find(".NextU").length<=0)
    {
        var PointVal= $(JQStr).offset().top-$("#TopDIV").offset().top;
        return parseFloat(PointVal);
    }
    else{
        var PointVal= $(JQStr).find(".NextU").offset().top-$("#TopDIV").offset().top;
        return parseFloat(PointVal);
    }
}
// 位置滚动处理。滚动的位置DataAnserIndex(注:篇章中译英特殊处理，DataAnserIndex表示滚动第DataAnserIndex个答题点)
// TopicType文章类型(0表示非篇章中译英和非定向翻译(滚动到答题点),1表示篇章中译英,2表示定向翻译)
function AdjustPositionFunc(IDName,DataAnserIndex,TopicType=0){
    var JQStr = ".AnswerIndex[data-anserindex='"+DataAnserIndex+"']";
    if(TopicType==0){
        if($(".AnswerIndex").length==0||$(JQStr).length==0){
            // 避免无空格时调用
            return;
        }
        var LastFlag=$(JQStr).attr('data-lastindex')==1?true:false;
        // 颜色渲染
        $(".AnswerIndex").css("background-color","inherit");
        $(JQStr).css("background-color","#ccebff");  // 选中答案
    }
    else if(TopicType==1){
        // 篇章中译英
        JQStr = ".HightLine[data-hlindex='"+DataAnserIndex+"']";
        $(".HightLine").css("color","#333333");
        $(JQStr).css("color","#0099ff");
    }
    else{
        // 定向翻译
        JQStr = "u[data-dxindex='"+DataAnserIndex+"']";
        $("u").css("color","#333333");
        $(JQStr).css("color","#0099ff");
    }
    // 滚动条处理
    var AnswerIndexVal=$(JQStr).offset().top;   // 获取元素位置的距离1
    //var ScrollTopVal=$("#PageFrame")[0].scrollTop  // 获取滚动条顶部位置2
    JQStr ="#"+IDName;
    var ScrollHeightVal=$(document.body)[0].scrollHeight;  // 获取滚动条整体高度3
    //var ClientWidthVal=document.body.clientWidth  // 获取网页可视高度4
    var BodyHeightVal=$(document.body).height();  // 总的页面高度(包含滚动条)5
    //var SHeight = ScrollHeightVal*ClientWidthVal/BodyHeightVal;  // 获取滚动条高度值
    if(AnswerIndexVal>BodyHeightVal){
        AnswerIndexVal=BodyHeightVal;  // 显示滚动条的位置对应显示区域不能够超过最后一页，这样才能正比于滚动条
    }
    var STopVal = AnswerIndexVal*ScrollHeightVal/BodyHeightVal;
    if(!LastFlag){
        STopVal -=50;  // 非第一个不要置顶
    }
    else if(AnswerIndexVal>20)
    {
        STopVal -=20;  // 第一个非顶留空
    }
    // 设置滚动条高度
    $(document).scrollTop(STopVal);
}
//#endregion
// 移动端启动函数。存放节点IDName,屏幕宽度ScreenWidth,klgcode知识点编码，klg知识点
// SpaceStatus挖空处理状态(0表示默认不做处理，1表示挖空，2表示挖空加序号),StatrtIndex起始序号,TextIndent是否需要缩进(true表示缩进)
// 用处：处理/习题试题(现在已经由公共试题模块处理)
function StartRunningFunc(IDName,ScreenWidth,StartIndex, klgcode,klg,SpaceStatus,TextIndent=false){
    var JQStr ="#"+IDName;
    var DataStr = $(JQStr).append('<div id="TopDIV" style="position: fixed;top: 0px;left: 0px;width: 10px;height: 1px;"></div>').html();
    DataStr = DealUnderlineContentF(DataStr,StartIndex,SpaceStatus);  // 内容处理
    // 判断是否传递知识点划线
    if(klgcode!=null&&klgcode!=""&&klg!=null&&klg!=""){
        // 附加匹配处理
        var ReKlgArr = [];
        var ReKlgCodeArr = [];
        var ReKlgIndexArr = GetDealKnTextFunc(klg);
        if (ReKlgIndexArr != null && ReKlgIndexArr.length > 0) {
            for (var i = 0; i < ReKlgIndexArr.length; i++) {
                ReKlgArr.push(klg.split("|")[ReKlgIndexArr[i]]);
                ReKlgCodeArr.push(klgcode.split("|")[ReKlgIndexArr[i]]);
            }
        }
        for (var i = 0; i < ReKlgArr.length; i++) {
            klg = klg.replace(ReKlgArr[i], "").replace("||", "").replace(/^\|/, "").replace(/\|$/, "");
            klgcode = klgcode.replace(ReKlgCodeArr[i], "").replace("||", "").replace(/^\|/, "").replace(/\|$/, "");
        }
        // 判断是否存在包含和被包含关系
        var ReData = DealContrainFunc(klg, klgcode);
        klg = ReData["klgStr"];
        klgcode = ReData["klgcodeStr"];
        DataStr = MarkKnowledge("<p>" + DataStr + "</p>", klg.split("|"), klgcode.split("|"));
        DataStr = AddDealKnTextFunc(DataStr, ReKlgArr, ReKlgCodeArr);
    }
    $(JQStr).prop("outerHTML", DataStr).css("text-align","justify").css("line-height","20px").css("font-size","18px").css("text-align","justify");  // 内容绑定
    AddCssDealFunc(TextIndent);
    AdjustTableFunc(ScreenWidth);  // 添加表格处理
    // 绑定函数处理
    $(".AnswerIndex").click(function(){
        var DataAnserIndex=$(this).attr("data-anserindex");
        $(".AnswerIndex").css("background-color","inherit");
        $(this).css("background-color","#ccebff");  // 选中答案
        AnserIndexBackCall(DataAnserIndex);
    });
    // 绑定回调重要知识点
    $(".TextMark").click(function(){
        var CodeStr= $(this).attr("code");
        TextMarkBackCall(CodeStr);
    });
    // 处理显示定向翻译
    if($("u").length>0){
        $.each($("u"),function(index,item) {
            if($(item).prev().length>0&&$(item).prev()[0].nodeName.toUpperCase()=="SPAN")
            {
                $(item).attr("data-dxindex",StartIndex);
                var SpanHtml=$(item).prev().html();
                var SpanText=$(item).prev().text();
                SpanHtml=SpanHtml.replace(SpanText,StartIndex+".");
                $(item).prev().prop("outerHTML", SpanHtml);  // 内容绑定
                //$(item).prepend('<div class="PrevU" style="display: inline-block;width: 1px;height: 1px;">&nbsp;</div>');  // 添加前缀
                //$(item).append('<div class="NextU" style="display: inline-block;width: 1px;height: 1px;">&nbsp;</div>');  // 添加后缀
                StartIndex++;
            }
        });
    }
    // SetFontSizeFunc(25); ios具体写入调整数值
}

// 知识点划线处理(使用节点方式，返回HTML代码方式用MarkKnowledge)
// 存放节点IDName,klgcode知识点编码，klg知识点
// 用处：微课学习相关主题推荐的重要知识点下划线处理
function MarkKlgFunc(IDName,klgcode,klg){
    var JQStr ="#"+IDName;
    var DataStr = $(JQStr).append('<div id="TopDIV" style="position: fixed;top: 0px;left: 0px;width: 10px;height: 1px;"></div>').html();
    var ReKlgArr = [];
    var ReKlgCodeArr = [];
    var ReKlgIndexArr = GetDealKnTextFunc(klg);
    if (ReKlgIndexArr != null && ReKlgIndexArr.length > 0) {
        for (var i = 0; i < ReKlgIndexArr.length; i++) {
            ReKlgArr.push(klg.split("|")[ReKlgIndexArr[i]]);
            ReKlgCodeArr.push(klgcode.split("|")[ReKlgIndexArr[i]]);
        }
    }
    for (var i = 0; i < ReKlgArr.length; i++) {
        klg = klg.replace(ReKlgArr[i], "").replace("||", "").replace(/^\|/, "").replace(/\|$/, "");
        klgcode = klgcode.replace(ReKlgCodeArr[i], "").replace("||", "").replace(/^\|/, "").replace(/\|$/, "");
    }
    // 判断是否存在包含和被包含关系
    var ReData = DealContrainFunc(klg, klgcode);
    klg = ReData["klgStr"];
    klgcode = ReData["klgcodeStr"];
    DataStr = MarkKnowledge("<p>" + DataStr + "</p>", klg.split("|"), klgcode.split("|"));
    DataStr = AddDealKnTextFunc(DataStr, ReKlgArr, ReKlgCodeArr);
    $(JQStr).prop("outerHTML", DataStr);  // 内容绑定
    // 绑定回调重要知识点
    $(".TextMark").click(function(){
        var CodeStr= $(this).attr("code");
        TextMarkBackCall(CodeStr);
    });
}
