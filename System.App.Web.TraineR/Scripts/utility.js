/**
* Access global vars
*
* @param {string} varname Variant name.
*/
function getGlobalVar(varname) {
    if (typeof (globals) === 'undefined') {
        return "";
    }

    if (typeof (globals[varname]) === 'undefined') {
        return "";
    }
    else {
        return globals[varname];
    }
}

/**
* Add ECMA262-5 method binding if not supported natively
*/
if (!('bind' in Function.prototype)) {
    Function.prototype.bind = function (owner) {
        var that = this;
        if (arguments.length <= 1) {
            return function () {
                return that.apply(owner, arguments);
            };
        } else {
            var args = Array.prototype.slice.call(arguments, 1);
            return function () {
                return that.apply(owner, arguments.length === 0 ? args : args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };
}

/*
* Add ECMA262-5 string trim if not supported natively
*/
if (!('trim' in String.prototype)) {
    String.prototype.trim = function () {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}

String.format = function () {
    if (arguments.length === 0)
        return null;

    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

/*
* Add ECMA262-5 Array methods if not supported natively
*/
if (!('contains' in Array.prototype)) {
    Array.prototype.contains = function (obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    };
}

if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf = function (find, i /*opt*/) {
        if (i === undefined) i = 0;
        if (i < 0) i += this.length;
        if (i < 0) i = 0;
        for (var n = this.length; i < n; i++) {
            if (i in this && this[i] === find) {
                return i;
            }
        }
        return -1;
    };
}
if (!('lastIndexOf' in Array.prototype)) {
    Array.prototype.lastIndexOf = function (find, i /*opt*/) {
        if (i === undefined) i = this.length - 1;
        if (i < 0) i += this.length;
        if (i > this.length - 1) i = this.length - 1;
        for (i++; i-- > 0; ) /* i++ because from-argument is sadly inclusive */
        {
            if (i in this && this[i] === find) {
                return i;
            }
        }
        return -1;
    };
}
if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach = function (action, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++) {
            if (i in this) {
                action.call(that, this[i], i, this);
            }
        }
    };
}
if (!('map' in Array.prototype)) {
    Array.prototype.map = function (mapper, that /*opt*/) {
        var other = new Array(this.length);
        for (var i = 0, n = this.length; i < n; i++) {
            if (i in this) {
                other[i] = mapper.call(that, this[i], i, this);
            }
        }
        return other;
    };
}
if (!('filter' in Array.prototype)) {
    Array.prototype.filter = function (filter, that /*opt*/) {
        var other = [], v;
        for (var i = 0, n = this.length; i < n; i++) {
            if (i in this && filter.call(that, v = this[i], i, this)) {
                other.push(v);
            }
        }
        return other;
    };
}
if (!('every' in Array.prototype)) {
    Array.prototype.every = function (tester, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++) {
            if (i in this && !tester.call(that, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
}
if (!('some' in Array.prototype)) {
    Array.prototype.some = function (tester, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++) {
            if (i in this && tester.call(that, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };
}

if (!Array.prototype.remove) {
    Array.prototype.remove = function (vals, all) {
        var i, removedItems = [];
        if (!Array.isArray(vals)) vals = [vals];
        for (var j = 0; j < vals.length; j++) {
            if (all) {
                for (i = this.length; i--;) {
                    if (this[i] === vals[j])
                        removedItems.push(this.splice(i, 1));
                }
            }
            else {
                i = this.indexOf(vals[j]);
                if (i > -1)
                    removedItems.push(this.splice(i, 1));
            }
        }
        return removedItems;
    };
}

/**
* Extend trimLeft() method for String.
*/
String.prototype.trimLeft = function () { return this.replace(/(^\s*)/g, ""); };
/**
* Extend trimRight() method for String.
*/
String.prototype.trimRight = function () { return this.replace(/(\s*$)/g, ""); };

/**
* Extend endWith() method for String.
*/
String.prototype.endWith = function (str) {
    if (str === null || str === "" || this.length === 0 || str.length > this.length) {
        return false;
    }
    if (this.substring(this.length - str.length) == str) {
        return true;
    }
    else {
        return false;
    }
};

/**
* Extend startWith() method for String.
*/
String.prototype.startWith = function (str) {
    if (str === null || str === "" || this.length === 0 || str.length > this.length) {
        return false;
    }
    if (this.substr(0, str.length) == str) {
        return true;
    }
    else {
        return false;
    }
};

/**
* Extend contains() method for String.
*/
String.prototype.contains = function (it) {
    return this.indexOf(it) != -1;
};

/*
* Extend the Object.keys function if not exist
*/
if (typeof Object.keys !== "function") {
    (function () {
        Object.keys = Object_keys;
        function Object_keys(obj) {
            var keys = [], name;
            for (name in obj) {
                if (obj.hasOwnProperty(name)) {
                    keys.push(name);
                }
            }
            return keys;
        }
    })();
}

/**
* An equivalent of python zip function
*
* @param {array} arrays An array of key-value pairs.
*/
function zip(arrays) {
    return arrays[0].map(function (_, i) {
        return arrays.map(function (array) { return array[i]; });
    });
}

/**
* Comparison of two key-value pairs objects.
* This is a shallow comparison
*
* @param {object} o1 First object.
* @param {object} o2 Second object.
*
* @return {boolean} whether equal.
*/
function shallowEquals(o1, o2) {
    var k1 = Object.keys(o1).sort();
    var k2 = Object.keys(o2).sort();
    if (k1.length != k2.length) return false;
    for (var i = 0; i < k1.length; i++) {
        if (k2.contains(k1[i]) === false)
            return false;
        if (o1[k1[i]] != o2[k1[i]])
            return false;
    }
    return true;
}

/**
* Write text to clipboard. 
* Perform "Ctrl+C" under Windows OS.
* To unit test this method by window.clipboardData.getData('Text'), you must "Allow paste operations via script" by browser setting.
* 
* @param {string} s The text to be written to system clipboard.
*
*/
function writeClipboard(s) {
    window.clipboardData.setData('Text', s);
}
/* version 2 */
function writeClipboard2(s) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", s);
}

/**
* add an option to a select control if there is no such an option
* WARNING: only works for plain select control; doesnot work on editable-select, which is an "input"
*
* @param {Element} combo Target select control.
* @param {string} value Option value.
* @param {string} text Option text.
* @param {string} selectedValue Value to be selected for the combo.
*/
function addSelectOption(combo, value, text, selectedValue) {
    if (!combo || combo.outerHTML.toLowerCase().startWith("<select") === false)
        return;

    for (var i = 0; i < combo.options.length; i++) {
        if (combo.options[i].text == text && combo.options[i].value == value) {
            if (selectedValue && selectedValue.toLowerCase() == value.toLowerCase())
                combo.options[i].setAttribute("selected", "selected");
            return; // there is already a same option
        }
    }

    var option = document.createElement("option");
    option.value = value;
    option.text = text;
    if (selectedValue && selectedValue.toLowerCase() == value.toLowerCase())
        option.setAttribute("selected", "selected");

    try {
        combo.add(option, null); //Standard    
    } catch (error) {
        combo.add(option); // IE only     
    } // or appendChild
}

/**
* add an option to a multi select control.
*
* @param {Element} select Target select control.
* @param {string} value Option value.
* @param {string} text Option text.
* @param {string} selected Whether the option is selected.
*/
function addMultiSelectOption(select, value, text, selected) {
    if (!select || select.outerHTML.toLowerCase().startWith("<select") === false)
        return;
    var option = document.createElement("option");
    option.value = value;
    option.text = text;
    if (selected === true)
        option.setAttribute("selected", "selected");
    try {
        select.add(option, null); //Standard    
    } catch (error) {
        select.add(option); // IE only     
    }
}

/**
* Escape html.
* Different from javascript built-in escape() function.
*
* @param {string} s HTML string.
* @return {string} escaped HTML string.
*/
function Escape(s) {
    c = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#039;', '#': '&#035;'
    };
    return s.replace(/[<&>'"#]/g, function (i) { return c[i]; });
}

/**
* Unescape html.
* Different from javascript built-in unescape() function.
*
* @param {string} s HTML string.
* @return {string} unescaped HTML string.
*/
function UnEscape(s) {
    return s.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '\"').replace(/&#39;/g, ''); // g is global replacement
}

function IsDigit(cCheck) {
    return ('0' <= cCheck) && (cCheck <= '9');
}

function IsAlpha(cCheck) {
    return (('a' <= cCheck) && (cCheck <= 'z')) || (('A' <= cCheck) && (cCheck <= 'Z'));
}

function IsDecimal(s) {
    var length = s.length;
    var ch = null;
    var dot = 0;
    for (var i = 0; i < length; i++) {
        ch = s[i];
        if (ch == '.') {
            dot++;
            if (dot > 1)
                return false;
        }
        else if (IsDigit(ch) === false)
            return false;
    }
    return true;
}

/**
* Return a string of multi select value.
*
* @param {string} id Multi select element id.
*
* @return {string} A string of selected option values concat by comma.
*/
function getMultiSelectVal(id) {
    var r = getMultiSelectValAsArray(id);
    var s = "";
    for (var i = 0; i < r.length; i++) {
        s += r[i] + ",";
    }
    return s;
}

/**
* Return an array of multi select values.
*
* @param {string} id Multi select element id.
*
* @return {string} An array selected option values.
*/
function getMultiSelectValAsArray(id) {
    var r = [];
    
    var select = document.getElementById(id);
    if (!select || select.outerHTML.toLowerCase().startWith("<select") === false)
        return r;
    
    // escape special character for JQuery selector
    r = $('#' + id.replace(/\./g,"\\.")).val();
    if (r) {
        for (var i = 0; i < r.length; i++) {
            // trim
            r[i] = r[i].trim();
        }
        // remove duplicate
        r = r.filter(function (v, i) { return r.indexOf(v) == i; }); 
        return r;
    }
    else {
        return []; 
    }
}

/**
* Create an image btn html.
*
* @param {string} src Image source path.
* @param {string} fn onclick function.
* @return {string} HTML string.
*/
function createImgBtnHtml(src, fn, tip) {
    var img = document.createElement("img");
    img.setAttribute("src", src);
    if (tip) {
        img.setAttribute("alt", tip);
        img.setAttribute("title", tip);
    }
    img.setAttribute("style", "cursor:pointer;");
    var html = img.outerHTML;
    var index = html.length - 1;
    html = html.substring(0, index) + " onclick=\"" + fn + ";\"></IMG>";
    return html;
}

/**
* Delete a html element.
*
* @param {string} id Element id.
*/
function del(id) {
    var me = document.getElementById(id);
    if (me) me.parentNode.removeChild(me);
}

/**
* Some initial stock colors
*/
var stockColors = {
'null': 'white',
'': 'white',
'0': 'white',
'1': '#ffcc00',
'2': '#f2b3d1',
'3': '#a1eabc',
'4': '#9ed9ef',
'5': '#aa7777',
'6': '#0099CC',
'7': '#33CC33',
'8': '#FFFF66',
'9': '#CC99FF',
'10': '#CC9900'
};

/**
* Return a stock color
* 
* @param {string} id id for stock color.
*/
function getStockColor(id) {
    if (typeof (stockColors[id]) === 'undefined') {
        stockColors[id] = getRandomColor();
    }
    return stockColors[id];
}

/**
* Get Random Color
*/
function getRandomColor() {
    // random values between 0 and 255, these are the 3 colour values
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);

    return getHex(r, g, b);
}

/**
* Convert integter to hex
*
* @param {integer} n An integer between [0,255].
*/
function intToHex(n) {
    n = n.toString(16);
    // eg: #0099ff. without this check, it would output #099ff
    if (n.length < 2)
        n = "0" + n;
    return n;
}

/**
* Outpupt the hex value from r,g,b values
*/
function getHex(r, g, b) {
    return '#' + intToHex(r) + intToHex(g) + intToHex(b);
}

/**
* Insert a row into specified table
*
* @param {integer} id Target table id.
* @param {integer} _id Entity id.
* @param {integer} _name Entity name.
*/
function insertRow(id, _id, _name) {
    var thisId = id + '_' + _id;

    // detect whether the item already exists in selected table
    var rows = $('#' + id + ' tr[id]');
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].attributes['id'].value == thisId) {
            alert(getGlobalVar('Message_AlreadySelected'));
            return;
        }
    }

    var html = '<tr id="' + thisId + '"><td><span>' + UnEscape(_name) + '</span></td><td><img  onmouseover="this.style.cursor=\'pointer\';" onclick = "del(\'' + thisId + '\')" src="data:image/.png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAHrSURBVHja5FQ9zuIwEPU4JighKN0HQoiKAiSQOEA4BJTQQINEwQkoKGiRaDgNXIGGn4qGAtEgFAQBlmB7vIW/jXazzVLvq/xG4/l5MzYopcifQMTxeLxcLpPJJCGEc16pVIbDoW3bMU9QSimlTqfT7XYDAAB4vV673c5xnMjp/X7n8/l0Oo2ISinbtrPZrGEYzPf96XS63W4ZYwBACAEA0zRjFXHOtUUpBQClUqnX68FkMlksFsVikXyCy+VSrVbheDxer9fD4aDT/gsQMZPJfH19sVwut9/vZ7OZ67qccyFEMpnUgTjniKhl050TQkzTfD6fnU6nVqsxQoiUMpFImKaZz+cLhcJqtRJCIGK5XHYcZ7PZ6FZrtZqUcrfbKaUopYQQqhUihIRh6Hlev99Pp9NCCM55s9lstVqv1wsRGWPdbrfdbkspEVHXQqNOlFKGYUTCAoBhGIgYhqGOrrMJISJ16O9KxMajKQBE9pgD/WhCsYl8djmG//5yTExN/37wEZhedL0VP36BUiqlvN/v+gAAiPh4PHzfj+j3Z7Ber0ejkeu6lmWFYfh8Ph3HQUTLsoIgEELYto2IqVTqfD5TSjnng8GgXq9/b898Pp/P50EQKKUYY9qowxuGoamUkhBiWZbneY1GgzH2cwCoMSPQ6evZfgAAAABJRU5ErkJggg==" alt="Delete"/></img></td><td class="item_id" style = "display:none">' + _id + '</td></tr>';

    $('#' + id + ' tr:last').after(html);
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

/**
* Generate GUID
*/
function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/**
* Insert a row into specified table
*
* @param {string} url URL.
* @param {dictionary} params paramters.
* @param {method} method HTTP method.
*/
function post(url, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", url);

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }
    document.body.appendChild(form);
    form.submit();
}

/**
* Perform a form post
*
* @param {string} url URL.
* @param {string} param parameter.
*/
function postKnowledgeQuery(url, param) {
    var params = {};
    params["para"] = param;
    post(url, params);
}

/** htmlEncode
*/
function htmlEncode(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}

/** htmlDecode
*/
function htmlDecode(value) {
    return $('<div/>').html(value).text();
}

/** get browser type and version
*/
navigator.sayswho = function () {
    var ua = navigator.userAgent, tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }

    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem !== null)
            return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) !== null)
        M.splice(1, 1, tem[1]); 

    return M.join(' ');
};

navigator.msie = function () {
    return navigator.sayswho() && navigator.sayswho().toLowerCase().contains('ie');
};

navigator.firefox = function () {
    return navigator.sayswho() && navigator.sayswho().toLowerCase().contains('firefox');
};

navigator.edge = function () {
    return navigator.sayswho() && navigator.sayswho().toLowerCase().contains('edge');
};

navigator.chrome = function () {
    return navigator.sayswho && navigator.sayswho.toLowerCase().contains('chrome');
};

/**
* set favicon
*
* @param {string} url URL. Can be a base64 image.
*/
function setFavicon(img) {
    var favicon = document.querySelector('link[rel="SHORTCUT ICON"]');

    if (!favicon) {
        favicon = document.createElement('link');
        favicon.setAttribute('rel', 'shortcut icon');
        var head = document.querySelector('head');
        head.appendChild(favicon);
    }


    favicon.setAttribute('type', 'image/png');
    favicon.setAttribute('href', img);
}


/**
 * 
 * Judge whether a string is a valid JSON. 
 * 
 * @param {any} s The string to be validated.
 */
function isJsonString(s) {
    try {
        JSON.parse(s);
    }
    catch (e) {
        return false;
    }
    return true;
}