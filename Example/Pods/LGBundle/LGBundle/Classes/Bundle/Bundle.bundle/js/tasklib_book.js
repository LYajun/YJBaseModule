//播放音频图片地址
var PicInfo1 = {
    answerPointImgUrl: "file:///android_asset/js/update-answer.png",
    yaoshiShowImgUrl: "file:///android_asset/js/yaoshi-show.png",
    yaoshiHideImgUrl: "file:///android_asset/js/yaoshi-hide.png",
    recordPlayImgUrl: "file:///android_asset/js/play.png",
    recordPauseImgUrl: "file:///android_asset/js/pause.png",
    audioPlayImgUrl: "file:///android_asset/js/dynaiselaba.gif",
    audioPauseImgUrl: "file:///android_asset/js/dynaiselaba.png"
}

//本地调用用的资源
var PicInfo = {
    answerPointImgUrl: "../Images/update-answer.png",
    yaoshiShowImgUrl: "../Images/yaoshi-show.png",
    yaoshiHideImgUrl: "../Images/yaoshi-hide.png",
    KouYuTagImgUrl: "../Images/KY.png",
    recordPlayImgUrl: "../Images/play.png",
    recordPauseImgUrl: "../Images/pause.png",
    audioPlayImgUrl: "../Images/dynaiselaba.gif",
    audioPauseImgUrl: "../Images/dynaiselaba.png"
}
var TestFlag = true;  // 调试功能开关
// 高亮
var styleWPSContrl = {
    wordFlag: true,
    phraseFlag: true,
    sentenceFlag: true
}

// 处理多选
var dealCheckBox = function () {
    $.each($(".checkbox").find("input"), function (index, element) {
        var inputId = $(element).attr("id");
        var answerText = $(element).attr("answer-text");
        var dataStatus = (answerText == undefined || answerText == "") ? 0 : 1;
        var htmlStr = "<div class='cBoxCls cBoxCls_" + inputId + "' data-status='" + dataStatus + "' onclick='clickCheckBox(" + inputId + ")'></div>";
        $(element).attr("hidden", "hidden").after(htmlStr);
    });
};
// 多选点击
var ControlFlag = true;  // 多选框是否可选
var clickCheckBox = function (inputId) {
    if (!ControlFlag) {
        return;
    }
    var BoxJqStr = ".cBoxCls_" + inputId;
    if ($(BoxJqStr).attr("data-status") == "1") {
        $(BoxJqStr).attr("data-status", "0");
    }
    else {
        $(BoxJqStr).attr("data-status", "1");
    }
    $("#" + inputId).click();
}
// 检测安卓和ios
var cTTypeFunc = function () {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        return 1;
    }
    else {
        return 2;
    }
}();
// #region 表格处理Start
var pressTableFlag = false;
var GetPadVal = function (THandel) {
    var PaddingVal = $(THandel).css("padding");
    if (PaddingVal == null || PaddingVal == "") {
        return 0;
    }
    var PadValArr = PaddingVal.split(" ");
    if (PadValArr.length > 2) {
        return parseFloat(PadValArr[1]) + parseFloat(PadValArr[3]);
    }
    else if (PadValArr.length > 1) {
        return parseFloat(PadValArr[1]) * 2;
    }
    else {
        return parseFloat(PadValArr[0]) * 2;
    }
};
// 获取最大字符长度的字符串(起决定宽度的字符串/将字符去除HTML标签)(使用)
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
            if (matchesArr[i].indexOf("nextpic") == -1) {
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
    // 旧处理
    //pattStr = new RegExp(/(<(p){1}.*?>).*?(<\/\2>)/ig);
    //matchesArr = htmlStr.match(pattStr);
    //if (matchesArr != undefined && matchesArr.length > 0) {
    //    // 清除匹配的P标签
    //    for (var i = 0; i < matchesArr.length; i++) {
    //        htmlStr = htmlStr.replace(matchesArr[i], "");
    //    }
    //}
    // // 判断是否存在p标签
    //if (matchesArr != null || (matchesArr != undefined && matchesArr.length > 0)) {
    //    if (htmlStr != null && htmlStr != "") {
    //        // p标签混排
    //        htmlStr = "<p>" + htmlStr + "</p>";
    //        matchesArr.push(htmlStr);
    //        htmlStr = null;
    //    }
    //    pattStr = new RegExp(/(<(p|b|span|u){1}.*?>).*?(<\/\2>)/i);
    //    for (var i = 0; i < matchesArr.length; i++) {
    //        var NewhtmlStr = matchesArr[i];
    //        while (pattStr.test(NewhtmlStr)) {
    //            var TmatchesArr = NewhtmlStr.match(pattStr);
    //            if (TmatchesArr.length > 0) {
    //                // 存在P标签
    //                NewhtmlStr = NewhtmlStr.replace(TmatchesArr[1], "").replace(TmatchesArr[3], "");
    //            }
    //        }
    //        if (i == 0 || (htmlStr.length < NewhtmlStr.length)) {
    //            htmlStr = NewhtmlStr;
    //        }
    //    }
    //}
    //else {
    //    pattStr = new RegExp(/(<(b|span|u){1}.*?>).*?(<\/\2>)/i);
    //    if (pattStr.test(htmlStr)) {
    //        while (pattStr.test(htmlStr)) {
    //            var matchesArr = htmlStr.match(pattStr);
    //            if (matchesArr.length > 0) {
    //                htmlStr = htmlStr.replace(matchesArr[1], "").replace(matchesArr[3], "");
    //            }
    //        }
    //    }
    //}
    ReArr.TextStr = htmlStr;
    return ReArr;
};
// 获取最大字符长度的字符串(起决定宽度的字符串/将字符去除HTML标签)(替换，不用)
var dealTdTextFunc = function (htmlStr) {
    var ReStr = "";
    var ReNumber = 0;
    var pattStr = new RegExp(/<P.*?<\/P>/i);
    if (pattStr.test(htmlStr)) {
        while (pattStr.test(htmlStr)) {
            var matchesArr = htmlStr.match(pattStr);
            $("#pContrainId").html(matchesArr[0]);
            htmlStr = htmlStr.replace(matchesArr[0], "");
            if (ReNumber <= $("#pContrainId").text().length) {
                ReNumber = $("#pContrainId").text().length;
                ReStr = $("#pContrainId").text();
            }
        }
    }
    else {
        $("#pContrainId").html(htmlStr);
        ReStr = $("#pContrainId").text();
    }
    return ReStr;
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
// 处理表格内的图片宽度
var DealImageWFunc = function (Item, WidthVal) {
    var pattWStr = new RegExp(/width\s?:\s?[0-9]+%;/ig);
    var pattWStr2 = new RegExp(/width\s?=\s?["|'|0-9]+%/ig);
    $.each($(Item).find("img").not(".nextpic"), function (index, iItem) {
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
var AdjustTableFunc = function (sWidthVal, isAStatus) {
    if ($("table").length == 0) {
        return;
    }
    // 添加宽度处理
    var ScreenWidth = $(document.body).width();
    ScreenWidth = ScreenWidth > sWidthVal ? ScreenWidth : sWidthVal;
    var TempMinWidth = GetMinTableVal(ScreenWidth);
    //$(document.body).css("width", "999999px");
    $(document.body).append('<span id="pContrainId"></span>');
    $("table").find(".yaoshi").addClass("nextpic");
    $.each($("table"), function (index, item) {
        // 处理表格总宽度
        var ArrMaxLen = [];
        var TableWidth = 0;
        var TotalMaxLen = 0;
        var RuleFlag = true;
        var HasIndex = 0;
        RSArrs = [];
        var NewAStatus = (isAStatus == "undefined" || isAStatus == undefined || isAStatus == null) ? 0 : parseInt(isAStatus);
        if (NewAStatus == 1) {
            // 判断是否存在答题点
            NewAStatus = $(item).find(".yaoshi").length > 0 ? 1 : 0;
        }
        $.each($(item).find("tr"), function (trIndex, trItem) {
            $.each($(trItem).find("td"), function (tdIndex, tdItem) {
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
                tdWidthVal += GetPadVal(tdItem);
                if (!RemoveHtmlArr.ImgFlag && (tdWidthVal > ScreenWidth)) {
                    tdWidthVal = ScreenWidth;
                }
                // 判断是否需要设置最小宽度
                if (tdWidthVal < TempMinWidth && NewAStatus == 1) {
                    tdWidthVal = TempMinWidth;
                }
                if (tdWidthVal < 100 && NewAStatus == 1) {
                    tdWidthVal = 100;
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
        // 判断表格是否只有一行
        if ($(item).find("tr").length == 1 && $(item).find("td").length == 1) {
            $(item).find("tr").eq(0).find("td").eq(0).css("width", (ScreenWidth - 14 - GetPadVal(document.body)) + "px");
            $(item).css("width", (ScreenWidth - 4 - GetPadVal(document.body)) + "px");
        }
        else {
            if (TotalMaxLen < ScreenWidth) {
                var AddPx = (ScreenWidth - TotalMaxLen) / ArrMaxLen.length;
                AddPx = AddPx > 2 ? AddPx - 2 : AddPx;
                for (var i = 0; i < ArrMaxLen.length; i++) {
                    ArrMaxLen[i] += AddPx;
                }
            }
            var OneFlag = false;
            for (var i = 0; i < ArrMaxLen.length; i++) {
                if (ArrMaxLen[i] != undefined && ($(item).find("td").length > 1 || $(item).find("tr").length > 1) && RuleFlag) {
                    if (i < ArrMaxLen.length - 1) {
                        $(item).find("tr").eq(0).find("td").eq(i).css("width", ArrMaxLen[i] + "px");
                        TableWidth += ArrMaxLen[i];
                    }
                    else {
                        $(item).find("tr").eq(0).find("td").eq(i).css("width", (ArrMaxLen[i] - 10) + "px");
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
        var htmlStr = "<div class='TableContainer TContain_" + index + "' data-isaflag='" + NewAStatus + "'></div>";
        $(item).after(htmlStr);
        $(item).remove();
        var JqStr = ".TContain_" + index;
        $(JqStr).append(ChildhtmlStr);
    });
    $(document.body).css("width", ScreenWidth + "px");
    var BodyWidth = isNaN(parseFloat(ScreenWidth)) ? 0 : parseFloat(ScreenWidth);  // 界面宽度
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
        BodyWidth = isNaN(parseFloat($(document).width())) ? 0 : (parseFloat($(document).width() - GetPadVal(document.body)));  // 界面宽度
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
        BodyWidth = isNaN(parseFloat($(document).width())) ? 0 : (parseFloat($(document).width() - GetPadVal(document.body)));  // 界面宽度
        var HiddenRate = BodyWidth / TableWidth;  // 滚动条比率
        var SLeftWdith = isNaN(parseFloat($(ClsName)[0].scrollLeft)) ? 0 : parseFloat($(ClsName)[0].scrollLeft);
        SLeftWdith *= HiddenRate;
        var NextClsName = $(ClsName).next().attr("class");
        if (NextClsName == "PSBar") {
            $(ClsName).next().find(".CSBar").css("left", SLeftWdith + "px");
        }
    }, true);
    $("#pContrainId").remove();
};
// #endregion

//#region 听力音频处理
var LimitPreFlag = false;  // 限制点击过宽
var AddListenDiv = function (NodeHandle, NIndex, sWidthVal) {
    var UrlStr = $(NodeHandle).attr("alt");
    sWidthVal = sWidthVal > $(document.body).width() ? sWidthVal : $(document.body).width();
    var ListenDivWidth = (sWidthVal - GetPadVal(document.body));
    ListenDivWidth = (ListenDivWidth > 414 ? 414 : ListenDivWidth);
    if (UrlStr != null && UrlStr.indexOf("|") > -1) {
        var UrlArr = UrlStr.split("|");
        var UrlArrLen = UrlArr.length;
        var htmlStr = '<div class="ListenDiv" data-status="1" style="width:' + ListenDivWidth + 'px;"><div class="LDivTop">';
        var MaxLeftVal = (ListenDivWidth - 295) / 2;  // 自动调整宽度
        var selectIndex = 0;
        for (var i = 0; i < UrlArr.length; i++) {
            var SelectedN = (i == 0 ? 1 : 0);
            if (SelectedN) {
                selectIndex = i;
            }
            htmlStr += '<div class="LDivTItem LDivTItem_' + NIndex + ' LDivTItem_' + NIndex + '_' + i + '" data-selected="' + SelectedN + '" onclick="cLSourceFunc(' + NIndex + ',' + i + ')" data-auduourl="' + UrlArr[i] + '" style="margin-left:' + MaxLeftVal + 'px;">听力材料' + (i + 1) + '</div>';
        }
        htmlStr += '</div><div class="LDivFooter"><div class="LDFPlayS LDFPlayS_' + NIndex + '" data-playstatus="0" onclick="playMusicFunc(' + NIndex + ')"></div><div class="LDFPauseS LDFPauseS_' + NIndex + '" onclick="pauseMusicFunc(' + NIndex + ')"></div><div class="LDFProcS"><div class="LDFPWhite LDFPWhite_' + NIndex + '"></div><div class="LDFProcImg LDFProcImg_' + NIndex + '"></div></div><div class="LDFTimerS" data-mtype="' + cTTypeFunc + '" data-fsFlag="100"><span class="RunTime RunTime_' + NIndex + '">00:00</span><span>/</span><span class="RunAllTime RunAllTime_' + NIndex + '">00:00</span></div></div><div class="SImg SImg_' + NIndex + '" data-urlindex="' + selectIndex + '" data-urllen="' + UrlArrLen + '" data-mlval="' + MaxLeftVal + '"></div></div>';
    }
    else if (UrlStr != null) {
        var htmlStr = '<div class="ListenDiv" data-status="0" style="width:' + ListenDivWidth + 'px;"><div class="LDivTop" style="width:1px;height:0px;overflow:hidden;"><div class="LDivTItem LDivTItem_' + NIndex + ' LDivTItem_' + NIndex + '_0" data-selected="1" onclick="cLSourceFunc(' + NIndex + ',0)" data-selected="1"  data-auduourl="' + UrlStr + '"></div></div><div class="LDivFooter"><div class="LDFPlayS LDFPlayS_' + NIndex + '" data-playstatus="0" onclick="playMusicFunc(' + NIndex + ')"></div><div class="LDFPauseS LDFPauseS_' + NIndex + '" onclick="pauseMusicFunc(' + NIndex + ')"></div><div class="LDFProcS"><div class="LDFPWhite LDFPWhite_' + NIndex + '"></div><div class="LDFProcImg LDFProcImg_' + NIndex + '"></div></div><div class="LDFTimerS" data-mtype="' + cTTypeFunc + '" data-fsFlag="100"><span class="RunTime RunTime_' + NIndex + '">00:00</span><span>/</span><span class="RunAllTime RunAllTime_' + NIndex + '">00:00</span></div></div></div>';
    }
    $(NodeHandle).css("width", "1px").css("height", "1px").css("overflow", "hidden").after(htmlStr);
    // 添加滑块事件
    $(".LDFProcImg")[NIndex].addEventListener("touchstart", TouchStartFunc, false);
    $(".LDFProcImg")[NIndex].addEventListener("touchmove", TouchMoveFunc, false);
    $(".LDFProcImg")[NIndex].addEventListener("touchend", TouchEndFunc, false);
}
// 切换听力材料
var cLSourceFunc = function (iIndex, oIndex) {
    pauseMusicFunc(iIndex);
    var jQIStr = ".LDivTItem_" + iIndex;
    var jQIOStr = ".LDivTItem_" + iIndex + '_' + oIndex;
    $(jQIStr).attr("data-selected", 0);
    $(jQIOStr).attr("data-selected", 1);
    jQIStr = ".SImg_" + iIndex;
    //var dataUrlLen = $(jQIStr).attr("data-urllen");
    var LeftPx = 0;
    var MLValStr = $(jQIStr).attr("data-mlval");
    LeftPx = 50 + oIndex * (85 + parseInt(MLValStr));
    $(jQIStr).css("left", LeftPx + "px");
}
// 暂停播放处理
var playMusicFunc = function (iIndex) {
    if (LimitPreFlag) {
        return;
    }
    else {
        LimitPreFlag = true;
        window.setTimeout(function () {
            LimitPreFlag = false;
        }, 500);
    }
    $(".select-answer").removeClass("select-answer");
    var jQStr = ".LDFPlayS_" + iIndex;
    var playStatus = $(jQStr).attr("data-playstatus");  // 检测当前状态，0表示暂停
    var AudioUrl = $(jQStr).parent().prev(".LDivTop").find(".LDivTItem[data-selected='1']").attr("data-auduourl");
    var AStatus = 0;
    if (playStatus == "0") {
        StopAllCss();
        $(jQStr).attr("data-playstatus", 1);
        AStatus = 1;
    }
    else {
        $(jQStr).attr("data-playstatus", 0);
        AStatus = 2;
    }
    var info = {
        Id: iIndex,  // 第几个
        AudioUrl: AudioUrl,  // 音频
        AStatus: AStatus,  // 播放状态:0表示重置,1表示播放，2表示暂停
    }
    playVisiableAudioCallBack(1, JSON.stringify(info));
}
// 重置播放处理
var pauseMusicFunc = function (iIndex) {
    $(".select-answer").removeClass("select-answer");
    var jQStr = ".LDFPlayS_" + iIndex;
    $(jQStr).attr("data-playstatus", 0);
    var jQStr = ".LDFPWhite_" + iIndex;
    var TTimeNum = parseInt($(jQStr).attr("data-alltime"));
    var AudioUrl = $(jQStr).parent().prev(".LDivTop").find(".LDivTItem[data-selected='1']").attr("data-auduourl");
    var info = {
        Id: iIndex,  // 第几个
        AudioUrl: AudioUrl,  // 音频
        AStatus: 0,  // 播放状态:0表示重置,1表示播放，2表示暂停
    }
    playVisiableAudioCallBack(1, JSON.stringify(info));
}
// 设置滑块的位置
var playImageFunc = function (iIndex, leftVal, allTimes) {
    var jQStr = ".LDFProcImg_" + iIndex;
    var PWidthVal = $(jQStr).parent().css("width");
    // 兼容单位
    var PUint = "";
    if (PWidthVal.indexOf("px") > -1) {
        PUint = "px";
        PWidthVal = PWidthVal.replace(PUint, "");
    }
    else if (PWidthVal.indexOf("pt") > -1) {
        PUint = "pt";
        PWidthVal = PWidthVal.replace(PUint, "");
    }
    else if (PWidthVal.indexOf("em") > -1) {
        PUint = "em";
        PWidthVal = PWidthVal.replace(PUint, "");
    }
    if (allTimes <= 0) {
        $(jQStr).css("left", "-15px");  // 设置滑块滚动
        jQStr = ".LDFPWhite_" + iIndex;
        $(jQStr).css("width", "0px").attr("data-ctime", "0").attr("data-alltime", "0");  // 白色背景
        jQStr = ".RunTime_" + iIndex;
        $(jQStr).text(timeToStrFunc(0));  // 设置文字显示
        jQStr = ".RunAllTime_" + iIndex;
        $(jQStr).text(timeToStrFunc(0));  // 设置文字显示
    }
    else {
        var LeftPx = (leftVal * parseFloat(PWidthVal)) / allTimes;
        $(jQStr).css("left", (LeftPx - 15) + PUint);  // 设置滑块滚动
        jQStr = ".LDFPWhite_" + iIndex;
        $(jQStr).css("width", LeftPx + PUint).attr("data-ctime", leftVal).attr("data-alltime", allTimes);  // 白色背景
        jQStr = ".RunTime_" + iIndex;
        $(jQStr).text(timeToStrFunc((leftVal / 1000)));  // 设置文字显示
        jQStr = ".RunAllTime_" + iIndex;
        $(jQStr).text(timeToStrFunc((allTimes / 1000)));  // 设置文字显示
    }
};
// 时间转换
var timeToStrFunc = function (timerNumber) {
    timerNumber = Math.floor(timerNumber);
    var ReStr = "";
    var TempData = 0;
    if (isNaN(timerNumber) || timerNumber == "") {
        return "00:00";
    }
    if (timerNumber >= 3600) {
        TempData = Math.floor(timerNumber / 3600);
        timerNumber -= TempData * 3600;
        ReStr += (TempData < 10 ? ("0" + TempData) : TempData) + ":";
    }
    if (timerNumber >= 60) {
        var TempData = Math.floor(timerNumber / 60);
        timerNumber -= TempData * 60;
        ReStr += (TempData < 10 ? ("0" + TempData) : TempData) + ":";
    }
    else {
        ReStr += "00:";
    }
    if (timerNumber < 10) {
        ReStr += "0" + timerNumber;
    }
    else {
        ReStr += timerNumber;
    }
    return ReStr;
};
var TouchStartX = 0;
var TouchMoveX = 0;
var TouchIndex = -1;  // 位置标识
var TallTimeNum = 0;  // 总时间
var LeftTimeNum = 0;  // 总时间
var PWidthValNum = 0;  // 总宽度
// 滑块滑动控制(按下去)
function TouchStartFunc(event) {
    TouchStartX = event.touches[0].pageX;
    TouchMoveX = TouchStartX;
    TouchIndex = parseInt($(event.target).attr("class").replace("LDFProcImg LDFProcImg_", ""));
    var jQStr = ".LDFPWhite_" + TouchIndex;
    TallTimeNum = parseInt($(jQStr).attr("data-alltime"));
    LeftTimeNum = parseInt($(".LDFPWhite_" + TouchIndex).attr("data-ctime"));
    PWidthValNum = parseFloat($(jQStr).parent().css("width"));  // 总宽度
    if (TallTimeNum > 0) {
        mobileTSFunc(TouchIndex);
    }
}
// 滑块滑动
function TouchMoveFunc(event) {
    TouchMoveX = event.touches[0].pageX;
    TouchMoveY = event.touches[0].pageY;
    var TLeftTimeNumber = Math.ceil(TallTimeNum * Math.abs(TouchMoveX - TouchStartX) / PWidthValNum);
    if (TouchStartX > TouchMoveX) {
        // 左移
        if ((LeftTimeNum - TLeftTimeNumber) < 0) {
            TLeftTimeNumber = 0;
        }
        else {
            TLeftTimeNumber = LeftTimeNum - TLeftTimeNumber;
        }
        playImageFunc(TouchIndex, TLeftTimeNumber, TallTimeNum);
    }
    else {
        // 右移
        if ((LeftTimeNum + TLeftTimeNumber) > TallTimeNum) {
            TLeftTimeNumber = TallTimeNum;
        }
        else {
            TLeftTimeNumber = LeftTimeNum + TLeftTimeNumber;
        }
        playImageFunc(TouchIndex, TLeftTimeNumber, TallTimeNum);
    }
}
// 滑块滑动控制(抬起来)
function TouchEndFunc(event) {
    mobileTEFunc(TouchIndex);
}
//#endregion

// 点击事件样式渲染
var ClickRecFunc = function (pID) {
    $(".answer-body").removeClass("select-answer");
    var jqStr = ".answer-body[parent-anid='" + pID + "']";
    $(jqStr).addClass("select-answer");
    if ($(jqStr).addClass("data-astatus") == "1") {
        var curObj = new Object();
        curObj.Id = $(jqStr).attr("answer-id");//答题点ID
        curObj.pId = $(jqStr).attr("parent-anid");//答题点ID
        curObj.IsKY = $(jqStr).attr("answer-isky");//是否是口语试题，0-不是口语题，1-是口语题
        curObj.AnsText = $(jqStr).attr("answer-anstext");//参考答案
        onClickAnswerPoint(JSON.stringify(curObj));
    }
};

// 判断是否在横线内
var isGCFunc = function (NodeHandle) {
    var isFlag = false;
    var PClsName = $(NodeHandle).attr("class");
    var tagName = $(NodeHandle).prop("tagName");
    while (tagName != undefined && tagName != "BODY" && ((PClsName != undefined && PClsName.indexOf("underlineContent") == -1) || PClsName == undefined)) {
        NodeHandle = $(NodeHandle).parent();
        PClsName = $(NodeHandle).attr("class");
        tagName = $(NodeHandle).prop("tagName");
    }
    if (PClsName != undefined && PClsName.indexOf("underlineContent") > -1) {
        isFlag = true;
    }
    return isFlag;
};
// 不调用fill需要增加处理(绑定横线内处理)
var addFillAssist = function () {
    $.each($(document).find(".underlineContent"), function (Iindex, Iitem) {
        // 卡控遍历条件(添加新的class)
        var ClsName = $(Iitem).attr("class");
        var hitStyleFlag = $(Iitem).attr("hitstyle");
        if (ClsName != undefined && ClsName.indexOf("cAStauts") == -1) {
            $(Iitem).addClass("cAStauts");
            RemoveSESpaceWhite(Iitem);
            if ($(Iitem).attr("shcode") == undefined) {
                $(Iitem).attr("shcode", 1);
            }
            if ($(Iitem).attr("showflag") == undefined) {
                $(Iitem).attr("showflag", "1");
            }
            $(Iitem).attr("ulflag", "1");
            $.each($(Iitem).find("u,span,p,img"), function (index, element) {
                var eClsName = $(element).attr("class");
                var eHitStyleFlag = $(element).attr("hitstyle");
                if (eClsName == undefined || eClsName.indexOf("cAStauts") == -1) {
                    $(element).addClass("cAStauts");
                    RemoveSESpaceWhite(element);
                }
                if ($(element).attr("ulflag") == undefined) {
                    $(element).attr("ulflag", "1");
                }
                if ($(element).attr("shcode") == undefined) {
                    $(element).attr("shcode", 1);
                }
                if ($(element).attr("showflag") == undefined) {
                    $(element).attr("showflag", "1");
                }
            });
        }
    });
    if (typeof (showGLWorld) == "function") {
        showGLWorld(styleWPSContrl.wordFlag, styleWPSContrl.phraseFlag, styleWPSContrl.sentenceFlag);
    }
};
// 删除多余空格
var RemoveSESpaceWhite = function (item) {
    if ($(item).find("u,span,p,img").length > 0) {
        return;
    }
    var HtmlStr = $(item).text();
    var RegStr = new RegExp("^\\s+");
    var MatchArr = HtmlStr.match(RegStr);
    if (MatchArr != null && MatchArr.length > 0) {
        HtmlStr = HtmlStr.replace(MatchArr[0], "");
    }
    RegStr = new RegExp("\\s+$");
    MatchArr = HtmlStr.match(RegStr);
    if (MatchArr != null && MatchArr.length > 0) {
        HtmlStr = HtmlStr.substring(0, HtmlStr.length - MatchArr[0].length);
    }
    $(item).text(HtmlStr);
};
// 处理显示或隐藏答案，(shcode是否可点击1可点击；ulflag判断是否存在横线内1表示在；showflag是否显示1显示)
var dealAnswerFunc = function (NodeHandle, OCFlag, ThProFlag) {
    if (OCFlag) {
        var showflagS = $(NodeHandle).attr("showflag");
        if ($(NodeHandle).attr("ulflag") == 1) {
            if (!ThProFlag || (ThProFlag && showflagS == 1)) {
                if ($(NodeHandle).text() == "暂无参考答案") {
                    $(NodeHandle).css("color", "#989898").attr("shcode", 1).attr("showflag", "1");
                }
                else {
                    $(NodeHandle).css("color", "#92D050").attr("shcode", 1).attr("showflag", "1");
                }
            }
        }
        else {
            $(NodeHandle).css("color", "#000000").attr("shcode", 1).attr("showflag", "1");
        }
        if ($(NodeHandle).attr("hitstyle") == "wordStyle") {
            if (styleWPSContrl.wordFlag) {
                if (!ThProFlag || (ThProFlag && showflagS == 1)) {
                    $(NodeHandle).css("color", "#db5d00").attr("shcode", 1).attr("showflag", "1");
                }
            }
            else {
                var ulflag = $(NodeHandle).attr("ulflag");
                if (ulflag == "1") {
                    if (!ThProFlag || (ThProFlag && showflagS == 1)) {
                        $(NodeHandle).css("color", "#92D050").attr("shcode", 0).attr("showflag", "1");
                    }
                }
                else {
                    $(NodeHandle).css("color", "#000000").attr("shcode", 0).attr("showflag", "1");
                }
            }
        }
        else if ($(NodeHandle).attr("hitstyle") == "phraseStyle") {
            if (styleWPSContrl.phraseFlag && showflagS == "1") {
                var ulflag = $(NodeHandle).attr("ulflag");
                if (ulflag == "1") {
                    $(NodeHandle).css("background-color", "#f2db8b").attr("shcode", 1).attr("showflag", "1")
                }
                else {
                    $(NodeHandle).css("background-color", "#f2db8b").attr("shcode", 1).attr("showflag", "1");
                }
            }
            else if (showflagS == "1") {
                var ulflag = $(NodeHandle).attr("ulflag");
                if (ulflag == "1") {
                    $(NodeHandle).css("background-color", "#ffffff").attr("shcode", 0).attr("showflag", "1");
                }
                else {
                    $(NodeHandle).css("background-color", "#ffffff").attr("shcode", 0).attr("showflag", "1");
                }
            }
        }
        else if ($(NodeHandle).attr("hitstyle") == "sentenceStyle") {
            if (styleWPSContrl.sentenceFlag && showflagS == "1") {
                $(NodeHandle).css("border-bottom", "2px solid #78ae43").attr("shcode", 1).attr("showflag", "1");
            }
            else if (showflagS == "1") {
                $(NodeHandle).css("border-bottom", "none").attr("shcode", 1).attr("showflag", "1");
            }
        }
        if (!ThProFlag) {
            $.each($(NodeHandle).find(".cAStauts"), function (index, element) {
                showflagS = $(element).attr("showflag");
                // 处理普通文本
                if ($(element).attr("ulflag") == 1) {
                    if (!ThProFlag || (ThProFlag && showflagS == 1)) {
                        if ($(element).text() == "暂无参考答案") {
                            $(element).css("color", "#989898").attr("shcode", 1).attr("showflag", "1");
                        }
                        else {
                            $(element).css("color", "#92D050").attr("shcode", 1).attr("showflag", "1");
                        }
                    }
                }
                else {
                    $(element).css("color", "#000000").attr("shcode", 1).attr("showflag", "1");
                }
                // 处理高亮
                if ($(element).attr("hitstyle") == "wordStyle") {
                    if (styleWPSContrl.wordFlag) {
                        if (!ThProFlag || (ThProFlag && showflagS == 1)) {
                            $(element).css("color", "#db5d00").attr("shcode", 1).attr("showflag", "1");
                        }
                    }
                    else {
                        if (!ThProFlag || (ThProFlag && showflagS == 1)) {
                            var ulflag = $(element).attr("ulflag");
                            if (ulflag == "1") {
                                if (!ThProFlag || (ThProFlag && showflagS == 1)) {
                                    $(element).css("color", "#92D050").attr("shcode", 0).attr("showflag", "1");
                                }
                            }
                            else {
                                $(element).css("color", "#000000").attr("shcode", 0).attr("showflag", "1");
                            }
                        }
                    }
                }
                else if ($(element).attr("hitstyle") == "phraseStyle") {
                    if (styleWPSContrl.phraseFlag) {
                        if (!ThProFlag || (ThProFlag && showflagS == 1)) {
                            var ulflag = $(element).attr("ulflag");
                            if (ulflag == "1") {
                                $(element).css("background-color", "#f2db8b").attr("shcode", 1).attr("showflag", "1");
                            }
                            else {
                                $(element).css("background-color", "#f2db8b").attr("shcode", 1).attr("showflag", "1");
                            }
                        }
                    }
                    else {
                        var ulflag = $(element).attr("ulflag");
                        if (ulflag == "1") {
                            $(element).css("background-color", "#ffffff").attr("shcode", 0).attr("showflag", "1");
                        }
                        else {
                            $(element).css("background-color", "#ffffff").attr("shcode", 0).attr("showflag", "1");
                        }
                    }
                }
                else if ($(element).attr("hitstyle") == "sentenceStyle") {
                    if (styleWPSContrl.sentenceFlag) {
                        if (!ThProFlag || (ThProFlag && showflagS == 1)) {
                            $(element).css("border-bottom", "2px solid #78ae43").attr("shcode", 1).attr("showflag", "1");
                        }
                    }
                    else {
                        $(element).css("border-bottom", "none").attr("shcode", 0).attr("showflag", "1");
                    }
                }
            });
        }
    }
    else {
        $(NodeHandle).css("color", "#ffffff").attr("shcode", 1).attr("showflag", "0");
        if ($(NodeHandle).attr("hitstyle") == "wordStyle") {
            $(NodeHandle).attr("shcode", 0).attr("showflag", "0");
        }
        else if ($(NodeHandle).attr("hitstyle") == "phraseStyle") {
            $(NodeHandle).css("background-color", "none").attr("shcode", 0).attr("showflag", "0");
        }
        else if ($(NodeHandle).attr("hitstyle") == "sentenceStyle") {
            $(NodeHandle).css("border-bottom", "none").attr("shcode", 0).attr("showflag", "0");
        }
        $.each($(NodeHandle).find(".cAStauts"), function (index, element) {
            // 处理普通文本
            $(element).css("color", "#ffffff").attr("shcode", 1).attr("showflag", "0");  // 合并处理
            // 处理高亮
            if ($(element).attr("hitstyle") == "wordStyle") {
                $(element).attr("shcode", 0).attr("showflag", "0");
            }
            else if ($(element).attr("hitstyle") == "phraseStyle") {
                $(element).css("background-color", "#ffffff").attr("shcode", 0).attr("showflag", "0");
            }
            else if ($(element).attr("hitstyle") == "sentenceStyle") {
                $(element).css("border-bottom", "none").attr("shcode", 0).attr("showflag", "0");
            }
        });
        var ClsName = $(NodeHandle).attr("class");
        if (ClsName.indexOf("underlinePart") > -1) {
            $(NodeHandle).css("border-bottom", "1px solid #979797");
        }
    }
    var underlineContentText = $(NodeHandle).text();  // 获取文本内容
    if (underlineContentText != undefined && underlineContentText.indexOf("√") > -1) {
        if (OCFlag) {
            $(NodeHandle).parent().find(".checkbox").find("input").prop('checked', true);
        }
        else {
            $(NodeHandle).parent().find(".checkbox").find("input").prop('checked', false);
        }
    }
};

//显示、隐藏答案
function showHideAnswer(flag) {
    if (flag) {
        $(".yaoshi").attr("src", PicInfo.yaoshiShowImgUrl);
        $.each($(".underlineContent").not(".noKey"), function (index, item) {
            dealAnswerFunc(item, true, false);
        });
    }
    else {
        $(".yaoshi").attr("src", PicInfo.yaoshiHideImgUrl);
        $.each($(".underlineContent,.underlineContent.no-answer").not(".noKey"), function (index, item) {
            dealAnswerFunc(item, false, false);
        });
    }
}

//显示、隐藏钥匙及答案 isShowYX:显示和隐藏钥匙，isShowAS：显示和隐藏答案
function showHideAnswerEx(isShowYX, isShowAS) {
    if (isShowYX) {
        $(".yaoshi").show();
    }
    else {
        $(".yaoshi").hide();
    }
    if (isShowAS) {
        $.each($(".underlineContent").not(".noKey"), function (index, item) {
            dealAnswerFunc(item, true, false);
        });
        $(".yaoshi").attr("data-status", "1");
        $(".yaoshi").attr("src", PicInfo.yaoshiShowImgUrl);
    }
    else {
        $.each($(".underlineContent,.underlineContent.no-answer").not(".noKey"), function (index, item) {
            dealAnswerFunc(item, false, false);
        });
        $(".yaoshi").attr("data-status", "0");
        $(".yaoshi").attr("src", PicInfo.yaoshiHideImgUrl);
    }
}

//页面加载完，原文 绑定事件(sWidthVal:屏幕宽度，isAStatus是否含有作答0表示没有)
function bindEventTeaOrignalYS(sWidthVal, isAStatus) {
    var bodyWidth = $(document.body).width();
    //处理答题点
    $.each($(".yaoshi"), function (index, item) {
        $(item).attr('answer-id', index);
    });
    //给音频绑定一个ID
    $.each($(".audioImg"), function (index, item) {
        $(item).attr("audiourl", "");
        $(item).attr('audio-id', index);
    });
    //给视频图标处理
    $.each($(".videoImg"), function (index, item) {
        $(item).attr("audiourl", "");
    });
    //给口语图标处理
    $.each($(".oralLanguageImg"), function (index, item) {
        $(item).attr("audiourl", "");
    });
    //处理参考答案
    $.each($(".underlineContent"), function (index, item) {
        $(item).attr("answer-anstext", $(item).html());
    });
    //去除多余的U空标签
    $.each($("u"), function (index, item) {
        var text = $(item).text();
        text = text.replace(/\s+/g, "");
        if (text == "") {
            $(item).remove();
        }
    });
    //处理暂无参考答案
    $.each($(".yaoshi"), function (index, item) {
        var parent = $(item).parent();
        var prev = $(item).nextUntil(".yaoshi").filter(".underlineContent");
        var prevF = $(item).nextUntil(".yaoshi").find(".underlineContent");
        if (isHasAnswerFunc($(item).next())) {
            var spanHtml = document.createElement("span");
            //添加子节点
            var uHtml = document.createElement("u");
            uHtml.className = "underlineContent no-answer";
            uHtml.innerText = "暂无参考答案";
            //处理改错题及勾选题
            if ($(parent)[0].tagName == 'P') {
                if ($(parent).hasClass('correntQue') || $(parent).hasClass('boxQue')) {
                    uHtml.innerHTML = "&nbsp;&nbsp;&nbsp;";
                    //改错题，要随机下划线长度
                    if ($(parent).hasClass('correntQue')) {
                        uHtml.style = "width:" + randomNum(220, 300) + "px;display:inline-block;height: 22px;";
                    }
                    else {
                        uHtml.style = "width:10px;display:inline-block;";
                    }
                    uHtml.setAttribute("answer-anstext", "");
                }
            }
            $(spanHtml).html(uHtml.outerHTML);
            $(item).after(spanHtml);
        }
    });
    //处理表格宽度
    AdjustTableFunc(sWidthVal, isAStatus);
    // 音频处理
    if (TestFlag) {
        $.each($(".audioImg"), function (index, element) {
            AddListenDiv(element, index, sWidthVal);
        });
    }
    //一题多空的答题点标注
    var checkId = 0;
    var headid = -1;
    var groupId = -1;
    $(".multipleStart").each(function (i, item) {
        var $startNode = $(item);
        $.merge($(item).nextUntil(".multipleEnd").filter("[class*='group']"), $(item).nextUntil(".multipleEnd").find("[class*='group']")).each(function (index, item) {
            checkId = $(item).find('.yaoshi').attr("answer-id");
            var gid = $(item).attr('class').replace(/.*group(\d+).*/g, "$1");
            if (index == 0 || groupId != gid) {
                groupId = gid;
                headid = checkId;
            }
            $(item).find('.yaoshi').attr('parent-anid', headid);
        });
    });
    //点击喇叭事件,音频播放
    $(".audioImg").on("click", function () {
        audioPlayClick(this);
    });
    //显示/隐藏习题答案
    $(".yaoshi").on("click", function () {
        var parentAnid = $(this).attr("parent-anid");
        var curDisplay = $(this).nextUntil(".yaoshi").find(".underlineContent").eq(0).css("display");
        if (curDisplay == "undefined" || curDisplay == undefined) return;
        if (curDisplay == "none" || $(this).attr("data-status") == "0") {
            if (parentAnid != undefined) {
                $.each($(this).parents().find(".yaoshi[parent-anid='" + parentAnid + "']"), function (index, item) {
                    $(item).attr("data-status", "1");
                    $(item).attr("src", PicInfo.yaoshiShowImgUrl);
                    $.each($(item).parent().find(".underlineContent").not(".noKey"), function (cIndex, cItem) {
                        dealAnswerFunc(cItem, true, false);
                    });
                });
            }
            else {
                $(this).attr("data-status", "1");
                $(this).attr("src", PicInfo.yaoshiShowImgUrl);
                $.each($(this).nextUntil(".yaoshi").find(".underlineContent").not(".noKey"), function (index, item) {
                    dealAnswerFunc(item, true, false);
                });
            }
            //不再存在已隐藏的钥匙，移动端回调
            if ($(".yaoshi[data-status='0']").length == 0) {
                //添加回调
                console.log("全部显示了");
                onClickKeyShow();
            }
        }
        else {
            if (parentAnid != undefined) {
                $.each($(this).parents().find(".yaoshi[parent-anid='" + parentAnid + "']"), function (index, item) {
                    $(item).attr("data-status", "0");
                    $(item).attr("src", PicInfo.yaoshiHideImgUrl);
                    $.each($(item).parent().find(".underlineContent").not(".noKey"), function (cIndex, cItem) {
                        dealAnswerFunc(cItem, false, false);
                    });
                });
            }
            else {
                $(this).attr("data-status", "0");
                $(this).attr("src", PicInfo.yaoshiHideImgUrl);
                $.each($(this).nextUntil(".yaoshi").find(".underlineContent").not(".noKey"), function (index, item) {
                    dealAnswerFunc(item, false, false);
                });
            }
            //添加回调
            onClickKeyHide();
        }
    });
    //点击播放事件,视频播放
    $(".videoImg").on("click", function () {
        $(".select-answer").removeClass("select-answer");
        var curHtml = $(this).parent().find(".videoUrl").html();
        var curAlt = $(this).attr("alt");//播放视频地址
        playVisiableAudioCallBack(2, $(this).attr("alt"));
    });
    addFillAssist();
}

//页面加载完，课件 绑定事件(sWidthVal:屏幕宽度，isAStatus是否含有作答0表示没有)
function bindEventYS(sWidthVal, isAStatus) {
    var bodyWidth = $(document.body).width();
    //不存在underline 属性下有内容，所以全部隐藏，若有就是源头数据有问题
    $('.underline').css("display", "none");
    // 处理干净underline
    dealUnderLineFunc();
    $.each($(".yaoshi"), function (index, item) {
        $(item).attr('answer-id', index);
    });
    //给音频绑定一个ID
    $.each($(".audioImg"), function (index, item) {
        $(item).attr("audiourl", "");
        $(item).attr('audio-id', index);
    });
    //给视频图标处理
    $.each($(".videoImg"), function (index, item) {
        $(item).attr("audiourl", "");
    });
    //给口语图标处理
    $.each($(".oralLanguageImg"), function (index, item) {
        $(item).attr("audiourl", "");
    });
    //去除多余的U空标签
    $.each($("u"), function (index, item) {
        var text = $(item).text();
        text = text.replace(/\s+/g, "");
        if (text == "") {
            $(item).remove();
        }
    });
    //处理暂无参考答案
    $.each($(".yaoshi"), function (index, item) {
        var parent = $(item).parent();
        var prev = $(item).nextAll(".underlineContent");
        if (isHasAnswerFunc($(item).next())) {
            var uHtml = document.createElement("u");
            uHtml.className = "underlineContent no-answer";
            uHtml.innerText = "暂无参考答案";
            //处理改错题及勾选题
            if ($(parent)[0].tagName == 'P') {
                if ($(parent).hasClass('correntQue') || $(parent).hasClass('boxQue')) {
                    uHtml.innerHTML = "&nbsp;&nbsp;&nbsp;";
                    //改错题，要随机下划线长度
                    if ($(parent).hasClass('correntQue')) {
                        uHtml.style = "width:" + randomNum(220, 300) + "px;display:inline-block;height: 22px;";
                    }
                    else {
                        uHtml.style = "width:10px;display:inline-block;";
                    }
                    uHtml.setAttribute("answer-anstext", "");
                }
            }
            $(item).after(uHtml);
        }
    });
    //处理表格宽度
    AdjustTableFunc(sWidthVal, isAStatus);
    // 音频处理
    if (TestFlag) {
        $.each($(".audioImg"), function (index, element) {
            AddListenDiv(element, index, sWidthVal);
        });
    }
    //一题多空的答题点标注
    var checkId = 0;
    var headid = -1;
    var groupId = -1;
    $(".multipleStart").each(function (i, item) {
        var $startNode = $(item);
        $.merge($(item).nextUntil(".multipleEnd").filter("[class*='group']"), $(item).nextUntil(".multipleEnd").find("[class*='group']")).each(function (index, item) {
            checkId = $(item).find('.yaoshi').attr("answer-id");
            var gid = $(item).attr('class').replace(/.*group(\d+).*/g, "$1");
            if (index == 0 || groupId != gid) {
                groupId = gid;
                headid = checkId;
            }
            $(item).find('.yaoshi').attr('parent-anid', headid);
        });
    });
    //显示/隐藏习题答案
    $(".yaoshi").on("click", function () {
        var parentAnid = $(this).attr("parent-anid");
        if ($(this).attr("data-status") == "0") {
            // 显示处理
            if (parentAnid != undefined) {
                $.each($(this).parents().find(".yaoshi[parent-anid='" + parentAnid + "']"), function (index, fItem) {
                    $(fItem).attr("data-status", "1");
                    $(fItem).attr("src", PicInfo.yaoshiShowImgUrl);
                    $.each($(fItem).parent().find(".underlineContent").not(".noKey"), function (index, item) {
                        dealAnswerFunc(item, true, false);
                    });
                });
            }
            else {
                $(this).attr("data-status", "1");
                $(this).attr("src", PicInfo.yaoshiShowImgUrl);
                //$(this).nextUntil(".yaoshi").filter(".underlineContent").css("color", "#92D050");
                $.each($(this).nextUntil(".yaoshi").filter(".underlineContent").not(".noKey"), function (index, item) {
                    dealAnswerFunc(item, true, false);
                });
            }
            //不再存在已隐藏的钥匙，移动端回调
            if ($(".yaoshi[data-status='0']").length == 0) {
                //添加回调
                onClickKeyShow();
            }
        }
        else {
            // 隐藏处理
            if (parentAnid != undefined) {
                $.each($(this).parents().find(".yaoshi[parent-anid='" + parentAnid + "']"), function (index, fItem) {
                    $(fItem).attr("data-status", "0");
                    $(fItem).attr("src", PicInfo.yaoshiHideImgUrl);
                    $.each($(fItem).parent().find(".underlineContent").not(".noKey"), function (index, item) {
                        dealAnswerFunc(item, false, false);
                    });
                });
            }
            else {
                $(this).attr("data-status", "0");
                $(this).attr("src", PicInfo.yaoshiHideImgUrl);
                //$(this).nextUntil(".yaoshi").filter(".underlineContent").css("color", "#ffffff");
                $.each($(this).nextUntil(".yaoshi").filter(".underlineContent").not(".noKey"), function (index, item) {
                    dealAnswerFunc(item, false, false);
                });
            }
            //添加回调
            onClickKeyHide();
        }
    });
    //点击喇叭事件,音频播放
    $(".audioImg").on("click", function () {
        audioPlayClick(this);
    });
    //点击播放事件,视频播放
    $(".videoImg").on("click", function () {
        $(".select-answer").removeClass("select-answer");
        $(this).attr("audiourl", "");
        var curHtml = $(this).parent().find(".videoUrl").html();
        var curAlt = $(this).attr("alt");//播放视频地址
        playVisiableAudioCallBack(2, $(this).attr("alt"));
    });
}

// 移动端使用，true：表示点击表格且正在移动，需阻止模块切换
function getPressFlag() {
    return pressTableFlag;
}

// 设置离焦事件
function resetPressFlag() {
    pressTableFlag = false;
}

// 打理干净underline
function dealUnderLineFunc() {
    var ArrList = [];
    $.each($('.underline'), function (index, element) {
        var nextClsName = $(this).next().attr("class");
        var prevClsName = $(this).prev().attr("class");
        if ($(this).prev().find(".underlineContent").length > 0) {
            ArrList.push(index);
        }
        else if (prevClsName != undefined && (prevClsName.indexOf("underlineContent") > -1 || prevClsName.indexOf("underline") > -1)) {
            ArrList.push(index);
        }
        else if ($(this).next().find(".underlineContent").length > 0) {
            ArrList.push(index);
        }
        else if (nextClsName != undefined && (nextClsName.indexOf("underlineContent") > -1 || nextClsName.indexOf("underline") > -1)) {
            ArrList.push(index);
        }
    });
    while (ArrList.length > 0) {
        var ArrStr = ArrList.pop();
        $('.underline').eq(ArrStr).remove();
    }
}

// 打补丁(非underlineContent下的span下嵌套underlineContent)
function dealSULContentFunc(item, Id, pId) {
    var reInfosArr = [];
    // 处理"非underlineContent下的span下嵌套underlineContent"
    var uLCClsName = $(item).attr("class");
    var nItem = $(item).next();
    var pItem = $(item).parent();
    if (uLCClsName != undefined && uLCClsName.indexOf("underlineContent") > -1 && uLCClsName.indexOf("noKey") == -1) {
        // 直接等于
        var info = new Object();
        info.Id = Id;
        info.pId = pId;
        info.AnsText = "";
        info.AnsText = $(item).attr("answer-anstext");
        if (info.AnsText == undefined) {
            info.AnsText = $(item).text();
        }
        reInfosArr.push(info);
        info = null;
        $(item).remove();
    }
    else if (uLCClsName != undefined && uLCClsName.indexOf("yaoshi") > -1) {
        // 到了下一个钥匙
        return reInfosArr;
    }
    else if ($(item).find(".yaoshi").length > 0 || $(item).find(".underlineContent").length > 0) {
        // 存在下个标签
        if ($(item).find(".yaoshi").length > 0) {
            var reInfosGet = dealSULContentFunc($(item).children(":first"), Id, pId);
            for (var i = 0; i < reInfosGet.length; i++) {
                reInfosArr.push(reInfosGet[i]);
            }
            return reInfosArr;
        }
        else {
            // 查找子节点的underlineContent
            $.each($(item).find(".underlineContent").not(".noKey"), function (iIndex, iItem) {
                var info = new Object();
                info.Id = Id;
                info.pId = pId;
                info.AnsText = "";
                info.AnsText = $(iItem).attr("answer-anstext");
                if (info.AnsText == undefined) {
                    info.AnsText = $(iItem).text();
                }
                reInfosArr.push(info);
                info = null;
            });
            $(item).find(".underlineContent").not(".noKey").remove();
        }
    }
    if (nItem.length > 0) {
        var reInfosGet = dealSULContentFunc(nItem, Id, pId);
        for (var i = 0; i < reInfosGet.length; i++) {
            reInfosArr.push(reInfosGet[i]);
        }
    }
    else {
        if (pItem[0] == undefined || pItem[0].tagName.toUpperCase() == "BODY") {
            return reInfosArr;
        }
        else {
            var reInfosGet = dealSULContentFunc(pItem.next(), Id, pId);
            for (var i = 0; i < reInfosGet.length; i++) {
                reInfosArr.push(reInfosGet[i]);
            }
        }
    }
    return reInfosArr;
}
// 继续打补丁(判断是否需要添加暂无参考答案)
function isHasAnswerFunc(item) {
    var uLCClsName = $(item).attr("class");
    if (uLCClsName != undefined && uLCClsName.indexOf("underlineContent") > -1) {
        return false;  // 存在答案
    }
    else if (uLCClsName != undefined && uLCClsName.indexOf("yaoshi") > -1) {
        // 到了下一个答题点
        return true;
    }
    else if ($(item).length > 0) {
        // 处理子答题点
        var TReStatus = 0;
        $.each($(item).find("span,u,img,p"), function (iIndex, iItem) {
            var iULCClsName = $(iItem).attr("class");
            if (iULCClsName != undefined && iULCClsName.indexOf("underlineContent") > -1) {
                TReStatus = 1;  // 返回false
                return false;  // 只能return $.each
            }
            else if (iULCClsName != undefined && iULCClsName.indexOf("yaoshi") > -1) {
                TReStatus = 2;  // 返回true
                return true; // 只能return $.each
            }
        });
        if (TReStatus > 0) {
            if (TReStatus == 1) {
                return false;
            }
            else {
                return true;
            }
        }
        // 处理子节点完毕(仍然没有),处理同龄
        if ($(item).next()) {
            // 存在同龄节点
            return isHasAnswerFunc($(item).next());
        }
        else {
            // 不存在同龄节点，查找父节点
            if ($(item).parent()[0].tagName.toUpperCase() == "BODY") {
                return true;
            }
            return isHasAnswerFunc($(item).parent().next());
        }
    }
    return true;
}

//学生端 处理作答区域
var answerData = new Array();
function handleAnswerRange() {
    // 隐藏答案划线
    $(".underlineContentShow").attr("data-status", "0");
    //规范文本格式
    var answerId = "";
    var tempJson = new Array();
    //先处理一题多空的情况，获取两个之间的答题点
    $(".multipleStart").each(function (i, item) {
        $.merge($(item).nextUntil(".multipleEnd").filter("[class*='group']"), $(item).nextUntil(".multipleEnd").find("[class*='group']")).each(function (index, item) {
            var checkId = $(item).find('.yaoshi').attr("answer-id");
            var headid = $(item).find('.yaoshi').attr("parent-anid");
            var ischecked = $(item).find(".underlineContent").text().indexOf("√") > -1;
            var answerText = ischecked ? "√" : "";
            //勾选题
            if ($(item).hasClass('boxQue')) {
                $(item).find('.yaoshi').after("<div class='checkbox' answer-id='" + checkId + "' parent-anid='" + headid + "' answer-isky='2' answer-anstext='" + answerText + "' answer-text=''><input id=" + checkId + " type='checkbox'><label for=" + checkId + "></label></div>");
                //$(item).find('input').prop('checked', ischecked);
                $(item).find('.underlineContent').hide();
            }
            //点击事件
            $(item).find('input').bind("click", function () {
                var curObj = new Object();
                curObj.Id = $(this).parent().attr("answer-id");//答题点ID
                curObj.pId = $(this).parent().attr("parent-anid");//答题点ID
                curObj.IsKY = $(this).parent().attr("answer-isky");//是否是口语试题，0-不是口语题，1-是口语题，2-打勾题
                //curObj.Text = $(this).parent().attr("answer-text");//用户作答内容
                curObj.Score = $(this).parent().attr("answer-score");//作答评分
                curObj.AnsText = $(this).parent().attr("answer-anstext");//参考答案
                curObj.Comment = $(this).parent().attr("answer-comment");//评语
                curObj.pId = curObj.pId ? curObj.pId : curObj.Id;//组ID
                curObj.Text = $(this).prop("checked") ? "√" : "";//用户作答内容
                $(this).parent().attr("answer-text", curObj.Text);//用户作答内容
                $(".checkbox").removeClass("select-answer");
                $(".answer-body").removeClass("select-answer");
                $(this).parent().addClass("select-answer");
                //已作答，弹出作答答案
                if ($(this).parent().data("ans-status") == "1") {
                    //移动端添加外部处理
                    onClickAnswerPoint(JSON.stringify(curObj));
                }
                else {
                    //移动端添加外部处理，弹出作答操作
                    onClickAnswerPoint(JSON.stringify(curObj));
                }
            });
            //删除钥匙节点
            $(item).find('.yaoshi').hide();
        });
    });

    //所有underline不做处理
    $.each($(".yaoshi").nextUntil(".yaoshi").filter(".underline"), function (index, item) {
        tempId = $(item).prevAll(".yaoshi").attr("answer-id");
        //记录上一次的ID
        if (tempId == undefined) {
            tempId = answerId;
        }
        else {
            answerId = tempId;
        }
        var prev = $(item).prev();
        if ((prev.length == 0 || $(prev).attr("class") != "tag-span") && $(prev).attr("class") != "underlineContent") {
            if ($("span[answer-id='" + tempId + "']").length == 0) {
                $(item).prop("outerHTML", "<span answer-id='" + tempId + "' class='tag-span' answer-isky='0'>_</span>");
            }
        }
        $(item).remove();
    });
    //提取参考答案并规范文本格式
    answerId = "";
    //$.each($(".yaoshi").nextUntil(".yaoshi").filter(".underlineContent"), function (index, item) {
    //    var info = new Object();
    //    info.Id = $(item).prevAll(".yaoshi").attr("answer-id");
    //    info.pId = $(item).prevAll(".yaoshi").attr("parent-anid");
    //    //记录上一次的ID
    //    if (info.Id == undefined) {
    //        info.Id = answerId;
    //    }
    //    else {
    //        answerId = info.Id;
    //    }
    //    if (info.pId == undefined) {
    //        info.pId = answerId;
    //    }
    //    info.AnsText = $(item).attr("answer-anstext");
    //    if (info.AnsText == undefined) {
    //        info.AnsText = $(item).text();
    //    }
    //    tempJson.push(info);
    //    // 特殊处理
    //    var tInfos = dealSULContentFunc($(item).next(), info.Id, info.pId);
    //    for (var i = 0; i < tInfos.length; i++) {
    //        tempJson.push(tInfos[i]);
    //    }
    //    var prev = $(item).prev();
    //    if (!$(prev).hasClass("checkbox")) {
    //        if (prev.length == 0 || $(prev).attr("class") != "tag-span") {
    //            //替换答案
    //            $(item).prop("outerHTML", "<span answer-id='" + info.Id + "' class='tag-span' answer-isky='0'>_</span>");
    //        }
    //        else {
    //            $(item).remove();
    //        }
    //    }
    //});
    $.each($(".yaoshi"), function (index, item) {
        var tId = $(item).attr("answer-id");
        var tPId = $(item).attr("parent-anid");
        //记录上一次的ID
        if (tId == undefined) {
            tId = answerId;
        }
        else {
            answerId = tId;
        }
        if (tPId == undefined) {
            tPId = answerId;
        }
        // 特殊处理
        var tInfos = dealSULContentFunc($(item).next(), tId, tPId);
        for (var i = 0; i < tInfos.length; i++) {
            tempJson.push(tInfos[i]);
        }
    });
    $.each($(".yaoshi"), function (index, item) {
        var Id = $(item).attr("answer-id");
        var prev = $(item).next();
        if (!$(prev).hasClass("checkbox")) {
            if (prev.length == 0 || $(prev).attr("class") != "tag-span") {
                if ($("span[answer-id='" + Id + "']").length == 0) {
                    var uHtml = document.createElement("span");
                    uHtml.className = "tag-span";
                    uHtml.innerText = "_";
                    uHtml.setAttribute("answer-id", Id);
                    $(item).after(uHtml);
                }
            }
        }
    });

    //处理口语试题
    $.each($(".oralLanguage").nextUntil(".oralLanguageDone"), function (num, part) {
        if (part.tagName != "p") {
            $.each($(part).find(".tag-span"), function (index, item) {
                $(item).attr("answer-isky", "1");
            });
        }
        else {
            if ($(part).hasClass("underlinePart")) {
                $.each($(part).find(".tag-span"), function (index, item) {
                    $(item).attr("answer-isky", "1");
                });
            }
        }
    });
    //合并参考答案数据
    var tempid = "";
    var temppid = "";
    var temptext = "";
    for (var i = 0; i < tempJson.length; i++) {
        if (tempid == tempJson[i].Id) {
            temptext = temptext + tempJson[i].AnsText;
        }
        else {
            if (tempid != "") {
                var info = new Object();
                info.Id = tempid;
                info.pId = temppid;
                info.AnsText = temptext;
                answerData.push(info);
                //重置
                tempid = "";
                temptext = "";
            }
            tempid = tempJson[i].Id;
            temppid = tempJson[i].pId;
            temptext = tempJson[i].AnsText;
            //最后一个存入
            if (i == tempJson.length - 1) {
                var info = new Object();
                info.Id = tempid;
                info.pId = temppid;
                info.AnsText = temptext;
                answerData.push(info);
            }
        }
    }
    //补全答题点
    var Num = 0;
    if (answerData.length > 0) {
        //Num = Number.parseInt(answerData[answerData.length - 1].Id);
        Num = Number.parseInt($(".yaoshi:last").attr('answer-id'));
        for (var i = 0; i < Num + 1; i++) {
            if (i < answerData.length) {
                var index = Number(answerData[i].Id) - i;
                for (var j = 0; j < index; j++) {
                    var info = new Object();
                    info.Id = (i + j).toString();
                    info.pId = info.Id;
                    info.AnsText = "";
                    answerData.splice(i, 0, info);
                }
            }
            else {
                var info = new Object();
                info.Id = (i).toString();
                info.pId = info.Id;
                info.AnsText = "";
                answerData.splice(i, 0, info);
            }
        }
    }
    //添加答题点的点击UI及交互
    $.each($(".tag-span"), function (index, item) {
        var answerText = "";
        var parentId = "";
        var isky = $(item).attr('answer-isky');
        var answerid = $(item).attr('answer-id');
        for (var i = 0; i < answerData.length; i++) {
            if (answerid == answerData[i].Id) {
                parentId = answerData[i].pId;
                answerText = answerData[i].AnsText;
                break;
            }
        }
        // 删除多选框后面的答题点
        prev = $(item).prev();
        if ($(prev).hasClass("checkbox")) {
            $(item).remove();
        }
        else {
            $(item).prop("outerHTML", "<div class='answer-body' answer-id='" + answerid + "' parent-anid='" + parentId + "' answer-anstext='" + answerText + "' answer-isky='" + isky + "' answer-showanswer='0' data-astatus='0' data-errstatus='0' onclick='ClickRecFunc(" + parentId + ")'><div class='answer-audio-range'><img class='nextpic' src='" + PicInfo.recordPlayImgUrl + "'/><span class='answer-audio-text'>作答音频</span></div><div class='answer-point-range'><div class='answer-point-range-div'><img class='nextpic' src='" + PicInfo.answerPointImgUrl + "'/><span class='answer-point-text'>答题点</span></div></div><buttom class='answer-text'></buttom></div>");
        }
        //删除钥匙节点
        var prev = $("img[answer-id='" + answerid + "']");
        if (prev.length > 0) {
            $(prev).remove();
        }
    });

    //添加点击事件
    $(".answer-body").on("click", function () {
        var curObj = new Object();
        curObj.Id = $(this).attr("answer-id");//答题点ID
        curObj.pId = $(this).attr("parent-anid");//答题点ID
        curObj.IsKY = $(this).attr("answer-isky");//是否是口语试题，0-不是口语题，1-是口语题
        curObj.Text = $(this).attr("answer-text");//用户作答内容
        curObj.Score = $(this).attr("answer-score");//作答评分
        curObj.AnsText = $(this).attr("answer-anstext");//参考答案
        curObj.Comment = $(this).attr("answer-comment");//评语
        curObj.pId = curObj.pId ? curObj.pId : curObj.Id;//组ID
        $(".checkbox").removeClass("select-answer");
        $(".answer-body").removeClass("select-answer");
        $(this).addClass("select-answer");
        //已作答，弹出作答答案
        if ($(this).data("ans-status") == "1") {
            //移动端添加外部处理
            onClickAnswerPoint(JSON.stringify(curObj));
        }
        else {
            //移动端添加外部处理，弹出作答操作
            onClickAnswerPoint(JSON.stringify(curObj));
        }
    });

    //去除多余的空格横线
    $.each($(".underline"), function (index, item) {
        var text = $(item).text();
        text = text.replace(/\s+/g, "");
        if (text == "") {
            $(item).remove();
        }
    });
    //删除所有钥匙节点
    $("img[class=yaoshi]").remove();
    //console.log(JSON.stringify(answerData));
    // 处理多选框样式
    dealCheckBox();
    // data-astatus控制作答样式(0表示未提交，1表示提交,2表示回显);data-errstatus判断是否(1)错误
    $(".answer-body").attr("data-astatus", "0").attr("data-errstatus", "0").attr("mobile-type", cTTypeFunc);
    return answerData;
}

//接收学生的作答
function reviewAnswer(answerJson) {
    if (answerJson != "" && answerJson) {
        var answerObj = JSON.parse(answerJson);
        var selectElement = $(".answer-body[answer-id='" + answerObj.Id + "']");
        var audioElement = $(selectElement).children(".answer-audio-range").children("img").eq(0);
        answerObj.IsKY = $(selectElement).attr("answer-isky");//是否是口语试题，0-不是口语题，1-是口语题

        //是否为音频作答(Type:1，文本作答，2-图片，3-语音，4-音频导入)
        if ((answerObj.Type == 3 || answerObj.Type == 4) && answerObj.AudioUrl != "") {
            $(selectElement).children(".answer-point-range").hide();
            $(selectElement).children(".answer-audio-range").css("display", "inline-block");
            $(selectElement).children(".answer-audio-range").eq(0).children("span").text("作答音频(" + answerObj.AudioLength + "s)");
            //填充作答内容
            $(selectElement).attr("answer-text", answerObj.Text);
            if (answerObj.Text != "") {
                answerObj.Text = "(" + answerObj.Text + ")";
                $(selectElement).children(".answer-text").show();
                $(selectElement).children(".answer-text").text(answerObj.Text);
            }
            else {
                $(selectElement).children(".answer-text").text("");
            }
            //是否之前存在作答音频
            $(selectElement).attr("answer-url", answerObj.AudioUrl);
            $(audioElement).attr("src", PicInfo.recordPlayImgUrl);
            $(selectElement).children(".answer-audio-range").attr("play-status", "0");
            //独立绑定事件
            $(audioElement).on("click", function () {
                recordAudioClick(this, answerObj.Id, answerObj.AudioUrl);
            });
            $(selectElement).attr("answer-showanswer", "1").attr("data-astatus", "3");
        }
        else {
            $(selectElement).attr("answer-text", answerObj.Text);//填充作答内容
            $(selectElement).children(".answer-audio-range").hide();
            if (answerObj.Text != "") {
                $(selectElement).children(".answer-text").show();
                $(selectElement).children(".answer-point-range").hide();
                $(selectElement).children(".answer-text").text(answerObj.Text);
                $(selectElement).attr("answer-showanswer", "1").attr("data-astatus", "3");
            }
            else {
                $(selectElement).children(".answer-text").hide();
                $(selectElement).children(".answer-text").text("");
                $(selectElement).children(".answer-point-range").show();
                $(selectElement).attr("answer-showanswer", "0").attr("data-astatus", "0");
            }
        }
    }
}

//提交，获取所有作答答案及参考答案
function getAllAnswer() {
    $(".answer-body").attr("data-astatus", "1").attr("data-errstatus", "0");  // 控制作答样式
    //处理作答
    $.each($(".answer-body"), function (index, item) {
        var isanswer = false;
        var answerid = $(item).attr("answer-id");
        var parentid = $(item).attr("parent-anid");
        //遍历同一小题的作答，如果作答了，整个小题都认为是作答了
        $.each($(".answer-body[parent-anid=" + parentid + "]"), function (n, item) {
            var atext = $(item).children(".answer-text").text();
            if (atext != "" && atext != "未作答") {
                isanswer = true;
            }
        });
        var mytext = $(item).children(".answer-text").text();
        var curDisplay = $(item).children(".answer-audio-range").css("display");
        if (mytext == "" && curDisplay == "none") {
            mytext = "未作答";
            if (isanswer) {
                mytext = "&nbsp;&nbsp;&nbsp;&nbsp;";
                $(item).children(".answer-text").html(mytext);
                $(item).children(".answer-text").addClass("noanswer-border");
            }
            else {
                $(item).children(".answer-text").text(mytext);
                $(item).children(".answer-text").addClass("no-answer");
                $(item).attr("data-errstatus", "1");
            }
            $(item).children(".answer-point-range").hide();
            $(item).children(".answer-text").show();
        }
        else {
            if (mytext == "未作答") {
                $(item).attr("data-errstatus", "1");
            }
        }
    });
    $(".answer-body").removeClass("select-answer");//移除样式
    $(".answer-body").unbind("click");//取消点击绑定事件
    $(".answer-body").children(".answer-audio-range").children("span").unbind("click");//取消点击绑定事件
    //打勾题的还原
    $.each($(".checkbox"), function (num, item) {
        var isanswer = false;
        var answerid = $(item).attr("answer-id");
        var parentid = $(item).attr("parent-anid");
        //遍历同一小题的作答，如果作答了，整个小题都认为是作答了
        $.each($(".checkbox[parent-anid=" + parentid + "]"), function (n, item) {
            var atext = $(item).attr("answer-text");
            if (atext != "" && atext != "未作答") {
                isanswer = true;
            }
        });
        //遍历同一小题的作答，如果作答了，整个小题都认为是作答了
        $.each($(".answer-body[parent-anid=" + parentid + "]"), function (n, item) {
            var atext = $(item).children(".answer-text").text();
            if (atext != "" && atext != "未作答") {
                isanswer = true;
            }
        });
        //提交直接还原作答现场
        var mytext = $(item).attr("answer-text");//我的答案
        var ischecked = mytext.indexOf("√") > -1;
        var answerText = $(item).attr("answer-anstext");//参考答案
        if (mytext == "") {
            mytext = "未作答";
            if (isanswer) {
                mytext = "&nbsp;&nbsp;&nbsp;";
            }
        }
        //mytext = mytext == "" ? "&nbsp;&nbsp;&nbsp;" : mytext;
        if (!isanswer) {
            $(item).prop("outerHTML", "<div class='answer-body' answer-id='" + answerid + "' parent-anid='" + parentid + "' answer-anstext='" + answerText + "' answer-isky='2' data-astatus='1' data-errstatus='0' onclick='ClickRecFunc(" + parentid + ")'><div class='answer-audio-range'><img class='nextpic' src='" + PicInfo.recordPlayImgUrl + "'/><span class='answer-audio-text'>作答音频</span></div><div class='answer-point-range' style='display:none;'><div class='answer-point-range-div'><img class='nextpic' src='" + PicInfo.answerPointImgUrl + "'/><span class='answer-point-text'>答题点</span></div></div><buttom class='answer-text no-answer' style='display:inline-block;'>" + mytext + "</buttom></div>");
        }
        else {
            $(item).prop("outerHTML", "<div class='answer-body' answer-id='" + answerid + "' parent-anid='" + parentid + "' answer-anstext='" + answerText + "' answer-isky='2' data-astatus='1' data-errstatus='0' onclick='ClickRecFunc(" + parentid + ")'><div class='answer-audio-range'><img class='nextpic' src='" + PicInfo.recordPlayImgUrl + "'/><span class='answer-audio-text'>作答音频</span></div><div class='answer-point-range' style='display:none;'><div class='answer-point-range-div'><img class='nextpic' src='" + PicInfo.answerPointImgUrl + "'/><span class='answer-point-text'>答题点</span></div></div><buttom class='answer-text' style='display:inline-block;'>" + mytext + "</buttom></div>");
        }
        if (mytext == "未作答") {
            $(".answer-body[answer-id='" + answerid + "']").attr("data-errstatus", "1");
        }
    });
    ControlFlag = false;
    //console.log(JSON.stringify(answerData));
    return answerData;
}

//回填所有答案，answerJson：所有作答及参考答案List，statusType：0-可作答，1-已提交，2-查看评阅
function backupAllAnswer(answerJson, statusType) {
    if (statusType == 0) {
        ControlFlag = true;
    }
    else {
        ControlFlag = false;
    }
    $(".answer-body").attr("data-astatus", statusType).attr("data-errstatus", "0");  // 实时记录作答状态
    if (answerJson != "" && answerJson) {
        var answerList = JSON.parse(answerJson);
        $.each($(".answer-body"), function (num, item) {
            var index = 0;
            var isanswer = false;
            var answerid = $(item).attr("answer-id");
            var parentid = $(item).attr("parent-anid");
            //查找作答
            for (var i = 0; i < answerList.length; i++) {
                if (answerid == answerList[i].Id) {
                    index = i;
                    break;
                }
            }
            //一题多空的作答关联查找
            for (var i = 0; i < answerList.length; i++) {
                if (parentid == answerList[i].pId) {
                    if (answerList[i].Text != "") {
                        isanswer = true;
                        break;
                    }
                }
            }
            //提交直接还原作答现场
            var mytext = answerList[index].Text;//我的答案
            answerList[index].IsKY = $(item).attr("answer-isky");//是否是口语试题，0-不是口语题，1-是口语题
            //添加音频控制
            var hasAudio = false;
            var audioElement = $(item).children(".answer-audio-range").children("img").eq(0);
            if ((answerList[index].Type == 3 || answerList[index].Type == 4) && answerList[index].AudioUrl != "") {
                hasAudio = true;
                $(item).children(".answer-point-range").hide();
                $(item).children(".answer-audio-range").css("display", "inline-block");
                $(item).children(".answer-audio-range").children("span").text("作答音频(" + answerList[index].AudioLength + "s)");
                //填充作答内容
                $(item).attr("answer-text", mytext);
                if (mytext != "") {
                    mytext = "(" + mytext + ")";
                    $(item).children(".answer-text").show();
                    $(item).children(".answer-text").text(mytext);
                }
                //音频节点
                $(audioElement).attr("src", PicInfo.recordPlayImgUrl);
                $(item).attr("answer-url", answerList[index].AudioUrl);
                $(item).children(".answer-audio-range").attr("play-status", "0");

                //独立绑定事件
                $(audioElement).on("click", function () {
                    recordAudioClick(this, answerList[index].Id, answerList[index].AudioUrl);
                });
            }
            //可作答状态，作答还原
            if (statusType == 0) {
                //已作答过，还原作答，增加作答后的UI节点
                if ((answerList[index].Type == 3 || answerList[index].Type == 4) && answerList[index].AudioUrl != "") {
                    $(item).attr("data-astatus", "3");
                    $(item).children(".answer-audio-range").children("span").on("click", function () {
                        $(".answer-body").removeClass("select-answer");
                        $(item).addClass("select-answer");
                        onClickAnswerPoint(JSON.stringify(answerList[index]));
                    });
                }
                else {
                    $(item).attr("answer-text", mytext);//填充作答内容
                    if (mytext != "") {
                        $(item).attr("data-astatus", "3");
                        $(item).children(".answer-text").show();
                        $(item).children(".answer-point-range").hide();
                        $(item).children(".answer-text").text(mytext);
                    }
                    else {
                        $(item).attr("data-errstatus", "1");
                    }
                }
            }
            //已提交，作答还原
            if (statusType == 1) {
                //取消点击绑定事件
                $(item).unbind('click');
                //填充作答内容
                $(item).attr("answer-text", mytext);
                if (mytext == "" && !hasAudio) {
                    mytext = "未作答";
                    if (isanswer) {
                        mytext = "&nbsp;&nbsp;&nbsp;&nbsp;";
                        $(item).children(".answer-text").html(mytext);
                        $(item).children(".answer-text").addClass("noanswer-border");
                    }
                    else {
                        $(item).children(".answer-text").text(mytext);
                        $(item).children(".answer-text").addClass("no-answer");
                        $(item).attr("data-errstatus", "1");
                    }
                    $(item).children(".answer-text").show();
                }
                else if (mytext == "" && hasAudio) {
                    $(item).children(".answer-text").hide();
                }
                else {
                    $(item).children(".answer-text").show();
                    $(item).children(".answer-text").text(mytext);
                    $(item).attr("data-errstatus", "0");
                }
                $(item).children(".answer-point-range").hide();
            }
            //已评阅，查看评阅详情
            if (statusType == 2) {
                //添加音频控制
                if ((answerList[index].Type == 3 || answerList[index].Type == 4) && answerList[index].AudioUrl != "") {
                    $(item).attr("data-errstatus", "0");
                    //独立绑定事件
                    $(item).children(".answer-audio-range").children("span").on("click", function () {
                        $(".answer-body").removeClass("select-answer");
                        $(item).addClass("select-answer");
                        onClickAnswerPoint(JSON.stringify(answerList[index]));
                    });
                }
                else {
                    $(item).attr("answer-text", mytext);//填充作答内容
                    if (mytext == "" && !hasAudio) {
                        mytext = "未作答";
                        if (isanswer) {
                            mytext = "&nbsp;&nbsp;&nbsp;&nbsp;";
                            $(item).children(".answer-text").html(mytext);
                            $(item).children(".answer-text").addClass("noanswer-border");
                        }
                        else {
                            $(item).children(".answer-text").text(mytext);
                            $(item).children(".answer-text").addClass("no-answer");
                            $(item).attr("data-errstatus", "1");
                        }
                        $(item).children(".answer-text").show();
                    }
                    else if (mytext == "" && hasAudio) {
                        $(item).children(".answer-text").hide();
                    }
                    else {
                        $(item).children(".answer-text").show();
                        $(item).children(".answer-text").text(mytext);
                        if (mytext == "") { }
                        $(item).attr("data-errstatus", "0");
                    }
                    $(item).children(".answer-point-range").hide();
                }
            }
            // 添加answer-boy的样式判断
            var DStatusFlag = $(item).find(".answer-point-range").css("display") != "none";
            if (DStatusFlag) {
                $(item).attr("answer-showanswer", "0");  // 修改显示格式
            }
            else {
                $(item).attr("answer-showanswer", "1");  // 修改显示格式
            }
        });
        //打勾题的还原
        $.each($(".checkbox"), function (num, item) {
            //可作答状态，作答还原
            var index = 0;
            var isanswer = false;
            var answerid = $(item).attr("answer-id");
            var parentid = $(item).attr("parent-anid");
            for (var i = 0; i < answerList.length; i++) {
                if (answerid == answerList[i].Id) {
                    index = i;
                    break;
                }
            }
            //一题多空的作答关联查找
            for (var i = 0; i < answerList.length; i++) {
                if (parentid == answerList[i].pId) {
                    if (answerList[i].Text != "") {
                        isanswer = true;
                        Score = answerList[i].Score;
                        break;
                    }
                }
            }
            //提交直接还原作答现场
            var mytext = answerList[index].Text;//我的答案
            var ischecked = mytext.indexOf("√") > -1;
            var answerText = $(item).attr("answer-anstext");//参考答案
            $(item).attr("answer-text", mytext);
            $(item).find('input').prop('checked', ischecked);
            //还原打勾效果
            if (ischecked && statusType == 0) {
                $(".cBoxCls_" + answerid).attr("data-status", "1");
            }
            //已提交，已评阅，还原HTML代码，去除checkbox
            if (statusType == 1 || statusType == 2) {
                if (mytext == "") {
                    mytext = "未作答";
                    if (isanswer) {
                        mytext = "&nbsp;&nbsp;&nbsp;";
                    }
                }
                //mytext = mytext == "" ? "&nbsp;&nbsp;&nbsp;" : mytext;
                if (!isanswer) {
                    $(item).prop("outerHTML", "<div class='answer-body' answer-id='" + answerid + "' parent-anid='" + parentid + "' answer-anstext='" + answerText + "' answer-isky='2' answer-text='" + mytext + "' data-astatus='" + statusType + "' data-errstatus='0' onclick='ClickRecFunc(" + parentid + ")'><div class='answer-audio-range'><img class='nextpic' src='" + PicInfo.recordPlayImgUrl + "'/><span class='answer-audio-text'>作答音频</span></div><div class='answer-point-range' style='display:none;'><div class='answer-point-range-div'><img class='nextpic' src='" + PicInfo.answerPointImgUrl + "'/><span class='answer-point-text'>答题点</span></div></div><buttom class='answer-text no-answer' style='display:inline-block;'>" + mytext + "</buttom></div>");
                }
                else {
                    $(item).prop("outerHTML", "<div class='answer-body' answer-id='" + answerid + "' parent-anid='" + parentid + "' answer-anstext='" + answerText + "' answer-isky='2' answer-text='" + mytext + "' data-astatus='" + statusType + "' data-errstatus='0' onclick='ClickRecFunc(" + parentid + ")'><div class='answer-audio-range'><img class='nextpic' src='" + PicInfo.recordPlayImgUrl + "'/><span class='answer-audio-text'>作答音频</span></div><div class='answer-point-range' style='display:none;'><div class='answer-point-range-div'><img class='nextpic' src='" + PicInfo.answerPointImgUrl + "'/><span class='answer-point-text'>答题点</span></div></div><buttom class='answer-text' style='display:inline-block;'>" + mytext + "</buttom></div>");
                }
                if (mytext == "未作答") {
                    $(".answer-body[answer-id='" + answerid + "']").attr("data-errstatus", "1");
                }
            }
        });
        //点击事件重新绑定
        if (statusType == 0 || statusType == 2) {
            //评阅样式
            if (statusType == 2) {
                $.each($(".answer-body"), function (num, item) {
                    var parentid = $(item).attr("parent-anid");
                    var answerid = $(".answer-body[parent-anid=" + parentid + "]").attr("answer-id");
                    if (answerList[answerid].Score == 0) {
                        if (!$(item).children(".answer-text").hasClass("good-answer")) {
                            $(item).children(".answer-text").addClass("bad-answer");
                        }
                    }
                    if (answerList[answerid].Score > 0) {
                        //遍历同一小题的评阅，并加上样式
                        $.each($(".answer-body[parent-anid=" + parentid + "]"), function (n, item) {
                            $(item).children(".answer-text").addClass("good-answer");
                        });
                    }
                });
                //点击事件重新绑定
                $(".answer-body").unbind("click").on("click", function () {
                    var curObj = new Object();
                    curObj.Id = $(this).attr("answer-id");//答题点ID
                    curObj.pId = $(this).attr("parent-anid");//答题点ID
                    curObj.IsKY = $(this).attr("answer-isky");//是否是口语试题，0-不是口语题，1-是口语题
                    curObj.Text = $(this).attr("answer-text");//用户作答内容
                    curObj.Score = $(this).attr("answer-score");//作答评分
                    curObj.AnsText = $(this).attr("answer-anstext");//参考答案
                    curObj.Comment = $(this).attr("answer-comment");//评语
                    curObj.pId = curObj.pId ? curObj.pId : curObj.Id;//组ID

                    $(".checkbox").removeClass("select-answer");
                    $(".answer-body").removeClass("select-answer");
                    $(".answer-body[parent-anid=" + curObj.pId + "]").addClass("select-answer");
                    //已作答，弹出作答答案
                    if ($(this).data("ans-status") == "1") {
                        //移动端添加外部处理
                        onClickAnswerPoint(JSON.stringify(curObj));
                    }
                    else {
                        //移动端添加外部处理，弹出作答操作
                        onClickAnswerPoint(JSON.stringify(curObj));
                    }
                });
            }
            $(".answer-body").unbind("click").on("click", function () {
                var curObj = new Object();
                curObj.Id = $(this).attr("answer-id");//答题点ID
                curObj.pId = $(this).attr("parent-anid");//答题点ID
                curObj.IsKY = $(this).attr("answer-isky");//是否是口语试题，0-不是口语题，1-是口语题
                curObj.Text = $(this).attr("answer-text");//用户作答内容
                curObj.Score = $(this).attr("answer-score");//作答评分
                curObj.AnsText = $(this).attr("answer-anstext");//参考答案
                curObj.Comment = $(this).attr("answer-comment");//评语
                curObj.pId = curObj.pId ? curObj.pId : curObj.Id;//组ID
                $(".checkbox").removeClass("select-answer");
                $(".answer-body").removeClass("select-answer");
                if (statusType == 2) {
                    $(".answer-body[parent-anid=" + curObj.pId + "]").addClass("select-answer");
                }
                else {
                    $(this).addClass("select-answer");
                }
                //已作答，弹出作答答案
                if ($(this).data("ans-status") == "1") {
                    //移动端添加外部处理
                    onClickAnswerPoint(JSON.stringify(curObj));
                }
                else {
                    //移动端添加外部处理，弹出作答操作
                    onClickAnswerPoint(JSON.stringify(curObj));
                }
            });
        }
    }
}

//老师评阅学生作答
function reviewStuAnswer(answerJson) {
    if (answerJson != "" && answerJson) {
        var answerObj = JSON.parse(answerJson);
        var selectElement = $(".answer-body[answer-id='" + answerObj.Id + "']");

        //$(selectElement).attr("answer-text", answerObj.Text);//用户作答内容
        $(selectElement).attr("answer-score", answerObj.Score);//作答评分
        $(selectElement).attr("answer-anstext ", answerObj.AnsText);//参考答案
        $(selectElement).attr("answer-comment", answerObj.Comment);//评语

        //遍历同一小题的评阅，并加上样式
        $.each($(".answer-body[parent-anid=" + answerObj.pId + "]"), function (n, item) {
            //评阅样式
            if (answerObj.Score == 0) {
                $(item).children(".answer-text").removeClass("good-answer");
                $(item).children(".answer-text").addClass("bad-answer");
            }
            if (answerObj.Score > 0) {
                $(item).children(".answer-text").removeClass("bad-answer");
                $(item).children(".answer-text").addClass("good-answer");
            }
        });
    }
}

//回填所有评阅信息，answerJson：所有作答及参考答案评阅信息List
function backupAllReview(answerJson) {
    if (answerJson != "" && answerJson) {
        var answerList = JSON.parse(answerJson);
        $.each($(".answer-body"), function (num, item) {
            var index = 0;
            var ismany = false;
            var answerid = $(item).attr("answer-id");
            var parentid = $(item).attr("parent-anid");
            //查找
            for (var i = 0; i < answerList.length; i++) {
                if (answerid == answerList[i].Id) {
                    index = i;
                    break;
                }
            }
            //一题多空的作答关联查找
            for (var i = 0; i < answerList.length; i++) {
                if (parentid == answerList[i].pId && answerid != answerList[i].Id) {
                    ismany = true;
                }
            }
            //$(item).attr("answer-id", answerList[index].Id);//答题点ID
            //$(item).attr("answer-text", answerList[index].Text);//用户作答内容
            $(item).attr("answer-score", answerList[index].Score);//作答评分
            $(item).attr("answer-anstext", answerList[index].AnsText);//参考答案
            $(item).attr("answer-comment", answerList[index].Comment);//评语

            //提交直接还原作答现场
            var mytext = answerList[index].Text;//我的答案
            var audioElement = $(item).children(".answer-audio-range").children("img").eq(0);
            if ((answerList[index].Type == 3 || answerList[index].Type == 4) && answerList[index].AudioUrl != "") {
                $(item).children(".answer-point-range").hide();
                $(item).children(".answer-audio-range").css("display", "inline-block");
                $(item).children(".answer-audio-range").children("span").text("作答音频(" + answerList[index].AudioLength + "s)");
                //填充作答内容
                $(item).attr("answer-text", mytext);
                if (mytext != "") {
                    mytext = "(" + mytext + ")";
                    $(item).children(".answer-text").show();
                    $(item).children(".answer-text").text(mytext);
                }
                //是否之前存在作答音频
                $(audioElement).attr("src", PicInfo.recordPlayImgUrl);
                $(item).attr("answer-url", answerList[index].AudioUrl);
                $(item).children(".answer-audio-range").attr("play-status", "0");
                //独立绑定事件
                $(audioElement).on("click", function () {
                    recordAudioClick(this, answerList[index].Id, answerList[index].AudioUrl);
                });
                $(item).children(".answer-audio-range").children("span").on("click", function () {
                    $(".answer-body").removeClass("select-answer");
                    $(item).addClass("select-answer");
                    onClickAnswerPoint(JSON.stringify(answerList[index]));
                });
            }
            else {
                $(item).attr("answer-text", mytext);//填充作答内容
                if (mytext == "") {
                    mytext = "未作答";
                    if (parentid != answerid || ismany) {
                        mytext = "&nbsp;&nbsp;&nbsp;&nbsp;";
                        $(item).children(".answer-text").html(mytext);
                        $(item).children(".answer-text").addClass("noanswer-border");
                    }
                    else {
                        $(item).children(".answer-text").text(mytext);
                        $(item).children(".answer-text").addClass("no-answer");
                        $(item).attr("data-errstatus", "1");
                    }
                }
                else {
                    $(item).children(".answer-text").text(mytext);
                }
                $(item).children(".answer-text").show();
                $(item).children(".answer-point-range").hide();
            }
            //评阅样式
            if (answerList[index].Score == 0) {
                if (!$(item).children(".answer-text").hasClass("good-answer")) {
                    $(item).children(".answer-text").addClass("bad-answer");
                }
            }
            if (answerList[index].Score > 0) {
                //遍历同一小题的评阅，并加上样式
                $.each($(".answer-body[parent-anid=" + parentid + "]"), function (n, item) {
                    $(item).children(".answer-text").addClass("good-answer");
                });
            }
        });
        //打勾题的还原
        $.each($(".checkbox"), function (num, item) {
            var index = 0;
            var isanswer = false;
            var answerid = $(item).attr("answer-id");
            var parentid = $(item).attr("parent-anid");
            //查找
            for (var i = 0; i < answerList.length; i++) {
                if (answerid == answerList[i].Id) {
                    index = i;
                    break;
                }
            }
            //一题多空的作答关联查找
            for (var i = 0; i < answerList.length; i++) {
                if (parentid == answerList[i].pId) {
                    if (answerList[i].Text != "") {
                        isanswer = true;
                        break;
                    }
                }
            }
            //提交直接还原作答现场
            var mytext = answerList[index].Text;//我的答案
            var ischecked = mytext.indexOf("√") > -1;
            var answerText = $(item).attr("answer-anstext");//参考答案
            if (mytext == "") {
                mytext = "未作答";
                if (isanswer) {
                    mytext = "&nbsp;&nbsp;&nbsp;";
                }
            }
            //mytext = mytext == "" ? "&nbsp;&nbsp;&nbsp;" : mytext;
            if (!isanswer) {
                $(item).prop("outerHTML", "<div class='answer-body' answer-id='" + answerid + "' parent-anid='" + parentid + "' answer-anstext='" + answerText + "' answer-isky='2' answer-text='" + mytext + "' data-astatus='2' data-errstatus='0' onclick='ClickRecFunc(" + parentid + ")'><div class='answer-audio-range'><img class='nextpic' src='" + PicInfo.recordPlayImgUrl + "'/><span class='answer-audio-text'>作答音频</span></div><div class='answer-point-range' style='display:none;'><div class='answer-point-range-div'><img class='nextpic' src='" + PicInfo.answerPointImgUrl + "'/><span class='answer-point-text'>答题点</span></div></div><buttom class='answer-text' style='display:inline-block;'>" + mytext + "</buttom></div>");
            }
            else {
                $(item).prop("outerHTML", "<div class='answer-body' answer-id='" + answerid + "' parent-anid='" + parentid + "' answer-anstext='" + answerText + "' answer-isky='2' answer-text='" + mytext + "' data-astatus='2' data-errstatus='0' onclick='ClickRecFunc(" + parentid + ")'><div class='answer-audio-range'><img class='nextpic' src='" + PicInfo.recordPlayImgUrl + "'/><span class='answer-audio-text'>作答音频</span></div><div class='answer-point-range' style='display:none;'><div class='answer-point-range-div'><img class='nextpic' src='" + PicInfo.answerPointImgUrl + "'/><span class='answer-point-text'>答题点</span></div></div><buttom class='answer-text no-answer' style='display:inline-block;'>" + mytext + "</buttom></div>");
            }
            if (mytext == "未作答") {
                $(".answer-body[answer-id='" + answerid + "']").attr("data-errstatus", "1");
            }
            //评阅样式
            if (answerList[index].Score == 0) {
                //遍历同一小题的评阅，并加上样式
                $.each($(".answer-body[parent-anid=" + parentid + "]"), function (n, item) {
                    $(item).children(".answer-text").addClass("bad-answer");
                });
            }
            if (answerList[index].Score > 0) {
                //遍历同一小题的评阅，并加上样式
                $.each($(".answer-body[parent-anid=" + parentid + "]"), function (n, item) {
                    $(item).children(".answer-text").addClass("good-answer");
                });
            }
        });
        //点击事件重新绑定
        $(".answer-body").unbind("click").on("click", function () {
            var curObj = new Object();
            curObj.Id = $(this).attr("answer-id");//答题点ID
            curObj.pId = $(this).attr("parent-anid");//答题点ID
            curObj.IsKY = $(this).attr("answer-isky");//是否是口语试题，0-不是口语题，1-是口语题
            curObj.Text = $(this).attr("answer-text");//用户作答内容
            curObj.Score = $(this).attr("answer-score");//作答评分
            curObj.AnsText = $(this).attr("answer-anstext");//参考答案
            curObj.Comment = $(this).attr("answer-comment");//评语
            curObj.pId = curObj.pId ? curObj.pId : curObj.Id;//组ID

            $(".checkbox").removeClass("select-answer");
            $(".answer-body").removeClass("select-answer");
            //$(this).addClass("select-answer");
            $(".answer-body[parent-anid=" + curObj.pId + "]").addClass("select-answer");
            //已作答，弹出作答答案
            if ($(this).data("ans-status") == "1") {
                //移动端添加外部处理
                onClickAnswerPoint(JSON.stringify(curObj));
            }
            else {
                //移动端添加外部处理，弹出作答操作
                onClickAnswerPoint(JSON.stringify(curObj));
            }
        });
    }
}

//处理播放录音，answerid：答题点ID，isPlay：是否播放（0-暂停，1-播放）
function playRecordAudio(answerid, isPlay) {
    //获取其他正在播放的音频
    var playing = $(".answer-body[answer-id='" + answerid + "']").children(".answer-audio-range");
    if (playing.length > 0) {
        if (isPlay == "1") {
            $(playing).attr("play-status", "1");
            $(playing).find("img").attr("src", PicInfo.recordPauseImgUrl);//移动端要根据本地路径替换
        }
        else {
            $(playing).attr("play-status", "0");
            $(playing).find("img").attr("src", PicInfo.recordPlayImgUrl);//移动端要根据本地路径替换
        }
    }
}
//滚动到相应DIV
function scrollAnswer(answerid) {
    //console.log(answerid);
    $(".checkbox").removeClass("select-answer");
    $(".answer-body").removeClass("select-answer");
    var ansDom = $(".answer-body[parent-anid='" + answerid + "']");
    if (ansDom.length == 0) {
        ansDom = $(".checkbox[parent-anid='" + answerid + "']");
    }
    $(ansDom).addClass("select-answer");
    var scroll_offset = $(ansDom).offset(); //得到box这个div层的offset，包含两个值，top和left
    var offset_top = scroll_offset.top;
    if (offset_top > 150) {
        offset_top = offset_top - 200;
    }
    $("body,html").animate({
        scrollTop: offset_top //让body的scrollTop等于pos的top，就实现了滚动
    });
}

//暂停播放原文音频
function pauseTextAudio(audioid) {
    //获取其他正在播放的音频
    var playing = $(".audioImg[audio-id='" + audioid + "']");
    if (playing.length > 0) {
        $(playing).attr("play-status", "0");
        $(playing).attr("src", PicInfo.audioPauseImgUrl);//移动端要根据本地 喇叭 路径替换
    }
}

//原文音频播放按钮点击事件
function audioPlayClick(myobj) {
    var curHtml = $(myobj).parent().find(".audioUrl").html();
    var curAlt = $(myobj).attr("alt");
    //处理当前按钮的状
    if ($(myobj).attr("play-status") == "1") {
        $(myobj).attr("play-status", "0");
        $(myobj).attr("src", PicInfo.audioPauseImgUrl);//移动端要根据本地 喇叭 路径替换
    }
    else {
        //停止其他作答音频播放
        var isRecordPlaying = $(".answer-audio-range[play-status='1']");
        if (isRecordPlaying.length > 0) {
            $(isRecordPlaying).attr("play-status", "0");
            $(isRecordPlaying).find("img").attr("src", PicInfo.recordPlayImgUrl);//移动端要根据本地路径替换
        }
        //停止其他原文音频播放
        var audioPlaying = $(".audioImg[play-status='1']");
        if (audioPlaying.length > 0) {
            $(audioPlaying).attr("play-status", "0");
            $(audioPlaying).attr("src", PicInfo.audioPauseImgUrl);//移动端要根据本地 喇叭 路径替换
        }
        //设置播放状态
        $(myobj).attr("play-status", "1");
        $(myobj).attr("src", PicInfo.audioPlayImgUrl);//移动端要根据本地 喇叭 路径替换
    }
    var info = new Object();
    info.Id = $(myobj).attr("audio-id");
    info.AudioUrl = curAlt;
    //移动端添加外部处理
    playVisiableAudioCallBack(1, JSON.stringify(info));
}

//作答录音播放按钮点击事件
function recordAudioClick(myobj, id, url) {
    $(".select-answer").removeClass("select-answer");
    $(myobj).parent().parent("answer-body").addClass("select-answer");
    //处理当前按钮的状态
    if ($(myobj).parent().attr("play-status") == "0") {
        //停止其他作答音频播放
        var isRecordPlaying = $(".answer-audio-range[play-status='1']");
        if (isRecordPlaying.length > 0) {
            $(isRecordPlaying).attr("play-status", "0");
            $(isRecordPlaying).find("img").attr("src", PicInfo.recordPlayImgUrl);//移动端要根据本地路径替换
        }
        //停止其他原文音频播放
        var audioPlaying = $(".audioImg[play-status='1']");
        if (audioPlaying.length > 0) {
            $(audioPlaying).attr("play-status", "0");
            $(audioPlaying).attr("src", PicInfo.recordPlayImgUrl);//移动端要根据本地 喇叭 路径替换
        }
        //设置播放状态
        $(myobj).parent().attr("play-status", "1");
        $(myobj).attr("src", PicInfo.recordPauseImgUrl);//移动端要根据本地路径替换
    }
    else {
        $(myobj).parent().attr("play-status", "0");
        $(myobj).attr("src", PicInfo.recordPlayImgUrl);//移动端要根据本地路径替换
    }
    //移动端添加外部处理，播放录音
    var info = new Object();
    info.Id = id;
    info.AudioUrl = url;
    //移动端添加外部处理，播放录音
    playVisiableAudioCallBack(3, JSON.stringify(info));
}

//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}

// 传递显示单词wordFlag/短语phraseFlag/句型sentenceFlag，true表示高亮,false表示不高亮
function showGLWorld(wordFlag, phraseFlag, sentenceFlag) {
    styleWPSContrl.wordFlag = wordFlag;
    styleWPSContrl.phraseFlag = phraseFlag;
    styleWPSContrl.sentenceFlag = sentenceFlag;
    $.each($(".underlineContent").find("u[hitstyle='wordStyle'],span[hitstyle='wordStyle'],p[hitstyle='wordStyle'],u[hitstyle='phraseStyle'],span[hitstyle='phraseStyle'],p[hitstyle='phraseStyle'],u[hitstyle='sentenceStyle'],span[hitstyle='sentenceStyle'],p[hitstyle='sentenceStyle']").not(".noKey"), function (index, element) {
        dealAnswerFunc(element, true, true);
    });
}
function playVisiableAudioCallBack(type, url) {
    //console.log(url);
    cancelBubble();
    plugin.startPlay(type, url);
}

function onClickAnswerPoint(data) {
    //alert(JSON.stringify(data));
    console.log(JSON.stringify(data));
    cancelBubble();
    plugin.onClickAnswerPoint(data);
}

function onClickKeyHide() {
    //alert(JSON.stringify(data));
    cancelBubble();
    plugin.onClickKeyHide();
}

function onClickKeyShow() {
    //alert(JSON.stringify(data));
    cancelBubble();
    plugin.onClickKeyShow();
}

function cancelBubble(e) {
    var evt = e ? e : window.event;
    if (evt.stopPropagation) { //W3C
        evt.stopPropagation();
    } else { //IE
        evt.cancelBubble = true;
    }
}

function getSelectedText(title) {
    var txt;
    if (window.getSelection) {
        txt = window.getSelection().toString();
    } else if (window.document.getSelection) {
        txt = window.document.getSelection().toString();
    } else if (window.document.selection) {
        txt = window.document.selection.createRange().text;
    }
    JSInterface.callback(txt, title);
}
// 控制播放按钮样式,OCStatus(0表示停止，1表示播放)
function playCssControl(iIndex, OCStatus) {
    var jQStr = ".LDFPlayS_" + iIndex;
    if (OCStatus == "0") {
        $(jQStr).attr("data-playstatus", 0);
    }
    else {
        $(jQStr).attr("data-playstatus", 1);
    }
}
// 控制滑块接口（Id第几个音频,leftVal进度条实时时间(毫秒),allTimes表示总时间(毫秒)）
function showImageFunc(Id, leftVal, allTimes) {
    playImageFunc(Id, leftVal, allTimes);
}
// 暂停所有的样式
function StopAllCss() {
    $.each($(".LDFPlayS"), function (index, item) {
        $(this).attr("data-playstatus", "0");
    });
};
// 控制字体大小
function adjustFontSize(FontSize) {
    $(".LDFTimerS").attr("data-fsFlag", FontSize);
}
// 音频进度条按下回调
function mobileTSFunc(ID) {
    pressTableFlag = true;
    // 移动端回调处理
    plugin.onSeekBarDown(ID); // 安卓
}
// 音频进度条松开回调
function mobileTEFunc(ID) {
    pressTableFlag = false;
    var CurrentTime = parseInt($(".LDFPWhite_" + ID).attr("data-ctime"));  // 当前滑动的时间进度
    var jQStr = ".LDFPlayS_" + ID;
    var AudioUrl = $(jQStr).parent().prev(".LDivTop").find(".LDivTItem[data-selected='1']").attr("data-auduourl");  // 路径
    // 移动端回调处理
    plugin.onSeekBarUp(ID, CurrentTime, AudioUrl);  // 安卓
}