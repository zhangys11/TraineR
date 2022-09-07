// DataTables support localization, refer to  http://www.datatables.net/plug-ins/i18n

var en = {
    "sEmptyTable": "No data available in table",
    "sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
    "sInfoEmpty": "Showing 0 to 0 of 0 entries",
    "sInfoFiltered": "(filtered from _MAX_ total entries)",
    "sInfoPostFix": "",
    "sInfoThousands": ",",
    "sLengthMenu": "Show _MENU_ entries.",
    "sLoadingRecords": "Loading...",
    "sProcessing": "Processing...",
    "sSearch": "Search:",
    "sZeroRecords": "No matching records found",
    "oPaginate": {
        "sFirst": "First", "sLast": "Last",
        "sNext": "Next", "sPrevious": "Previous"
    },
    "oAria": {
        "sSortAscending": ": activate to sort column ascending",
        "sSortDescending": ": activate to sort column descending"
    }
};

var cn = {
    "sProcessing": "处理中...",
    "sLengthMenu": "显示 _MENU_ 项结果",
    "sZeroRecords": "没有匹配结果",
    "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
    "sInfoPostFix": "",
    "sSearch": "搜索:",
    "sUrl": "",
    "oPaginate": {
        "sFirst": "首页",
        "sPrevious": "上页",
        "sNext": "下页",
        "sLast": "末页"
    }
};

var cnt = {
    "sProcessing": "處理中...",
    "sLengthMenu": "顯示 _MENU_ 項結果",
    "sZeroRecords": "沒有匹配結果",
    "sInfo": "顯示第 _START_ 至 _END_ 項結果，共 _TOTAL_ 項",
    "sInfoEmpty": "顯示第 0 至 0 項結果，共 0 項",
    "sInfoFiltered": "(從 _MAX_ 項結果過濾)",
    "sInfoPostFix": "",
    "sSearch": "搜索:",
    "sUrl": "",
    "oPaginate": {
        "sFirst": "首頁",
        "sPrevious": "上頁",
        "sNext": "下頁",
        "sLast": "尾頁"
    }
};

var jp = {
    "sProcessing": "処理中...",
    "sLengthMenu": "_MENU_ 件表示",
    "sZeroRecords": "データはありません。",
    "sInfo": " _TOTAL_ 件中 _START_ から _END_ まで表示",
    "sInfoEmpty": " 0 件中 0 から 0 まで表示",
    "sInfoFiltered": "（全 _MAX_ 件より抽出）",
    "sInfoPostFix": "",
    "sSearch": "検索:",
    "sUrl": "",
    "oPaginate": {
        "sFirst": "先頭",
        "sPrevious": "前",
        "sNext": "次",
        "sLast": "最終"
    }
};

var dk = {
    "sProcessing": "Henter...",
    "sLengthMenu": "Vis _MENU_ linjer",
    "sZeroRecords": "Ingen linjer matcher s&oslash;gningen",
    "sInfo": "Viser _START_ til _END_ af _TOTAL_ linjer",
    "sInfoEmpty": "Viser 0 til 0 af 0 linjer",
    "sInfoFiltered": "(filtreret fra _MAX_ linjer)",
    "sInfoPostFix": "",
    "sSearch": "S&oslash;g:",
    "sUrl": "",
    "oPaginate": {
        "sFirst": "F&oslash;rste",
        "sPrevious": "Forrige",
        "sNext": "N&aelig;ste",
        "sLast": "Sidste"
    }
};

// DataTable is created only once, and cannot dynamically set language without recreating it.
function getLanguage(lanstr) {
    var lang = lanstr.toLowerCase();
    if (lang == 'cn')
        lan = cn;
    else if (lang == 'en')
        lan = en;
    else if (lang == 'jp')
        lan = jp;
    else
        lan = en;

    return lan;
}

/*
function getLanguage() {
    var lan = cn; // en;

    $.ajax({
        url: '/Culture/QueryCurrentCulture',
        type: 'GET',
        dataType: 'json'
    }).done(function (json) {
        // 1 = zh-CN, 2 = en-US
        if (json.culture && json.culture.toLowerCase().contains('chi'))
            lan = cn;
        else if (json.culture && json.culture.toLowerCase().contains('eng'))
            lan = en;
        else if (json.culture && json.culture.toLowerCase().contains('jap'))
            lan = jp;
        else
            lan = cn;
    });

    return lan;
}
*/


function createDataTable(id, url, columns, persistState, lanstr) {
    var options = {
        // "sPaginationType": "simple", // "full_numbers",
        "oLanguage": getLanguage(lanstr),
        // "bJQueryUI": true, /* use JQueryUI style */
        "bServerSide": true,
        "sAjaxSource": url,
        "bProcessing": true,
        // "bAutoWidth": false,
        "bSort": false, /* disable sorting */
        "bRetrieve": true
    };
    
    if (columns)
    {
        options.columns = columns;
    }

    // SAVE STATE, so that users can come back to their previous workspace
    // requires the URL is the same
    if (persistState)
    {        
        options["bStateSave"] = true;
        options["fnStateSave"] = function (oSettings, oData) {
            localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
        };
        options["fnStateLoad"] = function (oSettings) {
            var data = localStorage.getItem('DataTables_' + window.location.pathname);
            return JSON.parse(data);
        };
    }

    return $(id).dataTable(options);    
}


/**
* Re-read an Ajax source and update data table
* SCRIPT5007: Unable to get property 'oApi' of undefined or null reference
*/
/*
$.fn.dataTableExt.oApi.fnReloadAjax = function (oSettings, sNewSource) {
    if (typeof sNewSource != 'undefined') {
        oSettings.sAjaxSource = sNewSource;
    }
    this.fnClearTable(this);
    this.oApi._fnProcessingDisplay(oSettings, true);
    var that = this;
    $.getJSON(oSettings.sAjaxSource, null, function (json) {
        // Got the data - add it to the table
        for (var i = 0; i < json.aaData.length; i++) {
            that.oApi._fnAddData(oSettings, json.aaData[i]);
        }
        oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
        that.fnDraw(that);
        that.oApi._fnProcessingDisplay(oSettings, false);
    });
};
*/