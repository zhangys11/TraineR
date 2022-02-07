/*This file is copied from utility.edit.rule.js for advanced search page.*/

var ruleElementCounter = 0;
var availableTags = [">=", "<=", ">", "<", "==", "!=", "&&", "||", "!", "(", ")"];

/**
* Validate rule expression by ajax request.
* 
* @return {boolean} true if rule expression is valid; otherwise false.
*/
function validate() {
    var rule = $("#rule-preview");
    if (!rule)
        return true;
    var url = '/Rule/Validate';
    var result = false;
    $.ajax({
        url: url,
        data: { 'rule': UnEscape(rule.val()) },
        type: 'GET',
        async: false, // wait until ajax returns
        cache: false,
        timeout: 10000,
        dataType: 'json'
    }).done(function (data) {
        if (data && data.obj && data.obj.length > 0) {
            var validation = document.getElementById("rule-validation");
            // var save = document.getElementById("save");
            validation.value = data.obj[0];
            if (validation.value == getGlobalVar('Valid') || validation.value == getGlobalVar('Message_RuleEmpty')) {
                validation.setAttribute("style", "color:green");
                // save.setAttribute("disable", "enable");
                $("#save:submit").removeAttr("disabled");
                if (data.obj.length > 1)
                    rule.val(data.obj[1]); // normalized string
                var expr = document.getElementsByName("rule-expression")[0];
                expr.value = UnEscape(rule.val());
                result = true;
            }
            else {
                validation.setAttribute("style", "color:red");
                // save.setAttribute("disable", "disable");
                $("#save:submit").attr("disabled", true);
            }
        }
    });
    return result;
}

/**
* Get rule expression.
*/
function getRule() {
    return $('#rule-expression').val();
}

/**
* Get rule description.
*/
function getRuleDescription() {
    return $('#rule-description').val();
}

/**
* Get context item ids.
*/
function getContextItems() {
    var items = "";
    var rows = $('#selected-context-items tr[id]');
    for (var i = 0; i < rows.length; i++) {
        var id = rows[i].attributes['id'].value;
        items += id + ','; // comma is delimiter
    }
    return items;
}

/**
* Generate rule expression from graphic editor.
*/
function generateRuleExpr() {    
    $('#rule-preview').val(getRuleExpr()); // .trimRight();
    validate();
    // Defect: In IE10, autocomplete panel shows up when calling this function.
    // Caused by space key triggers autocomplete; though trimRight() can cure the pain, it is not decent.
    //    if ($.browser.msie) {
    //        setTimeout(function () {
    //            rule.focus();
    //            jQuery.event.trigger({ type: 'keypress', which: 32 });
    //        }, 500);
    //        // $('#rule-preview').autocomplete("disable");
    //    }
    // Later, this defect is fixed after replacing "textarea.innerHTML = " to "textarea.val()"
}

/**
* Visualize graphic editor by rule expression.
* 
* @param {string} rule Rule expression.
*/
function loadFromRuleExpr(rule) {
    if (rule) {
        var length = rule.length;
        var ch = null;
        var index = -1;
        var name = "";
        var op = "";
        var value = "";
        var j = 0;
        var k = 0;
        var names = new Array();
        for (var i = 0; i < length; i++) {
            ch = rule[i];
            if (ch == '(') {
                addRuleElement("(");
            }
            else if (ch == ')') {
                addRuleElement(")");
            }
            else if (ch == '!') {
                addRuleElement("not");
            }
            else if (ch == '&' && rule[i + 1] == '&') {
                addRuleElement("and");
                i++;
            }
            else if (ch == '|' && rule[i + 1] == '|') {
                addRuleElement("or");
                i++;
            }
            else if (ch == '[') {
                index = rule.indexOf(']', i);
                name = rule.substring(i + 1, index); //substring(start, end) doesnot include the end ch
                j = index + 1;
                while (j < length) {
                    if (rule[j] == ' ') {
                        j++;
                        continue;
                    }
                    if (rule[j + 1] != '=') {
                        op = rule[j]; // >,<
                    }
                    else if (rule[j + 1] == '=') {
                        op = rule[j] + rule[j + 1];
                        j++;
                    }
                    var sp = 0; // space
                    var b = false;
                    k = j + 1;
                    var sstart = -1;
                    var send = -1;
                    while (true) {
                        if (rule[k] === ' ' && b === false) {
                            sp++;
                            k++;
                            continue;
                        }
                        b = true;
                        if (rule[k] == '\'') {
                            if (sstart == -1) {
                                sstart = k;
                            }
                            else if (send == -1) {
                                send = k + 1;
                            }
                            else { // error
                            }
                        }
                        if (sstart != -1) {
                            if (send != -1) break;
                        }
                        else if (rule[k] == ' ') { // assume value is surrounded by space
                            sstart = j + 1 + sp;
                            send = k;
                            break;
                        }
                        if (k >= length) {// cannot exit for loop
                            sstart = j + 1 + sp;
                            send = k;
                            break;
                        }
                        k++;
                    }
                    value = rule.substring(sstart, send);

                    if (value.toLowerCase() == "'true'" || value.toLowerCase() == "'false'") {
                        addRuleElement("boolean", name, op, value);
                    }
                    else if (IsDecimal(value)) {
                        addRuleElement("numeric", name, op, value);
                    }
                    else if (Date.parse(value)) {
                        addRuleElement("date", name, op, value);
                    }
                    else {
                        addRuleElement("string", name, op, value);
                    }

                    // Rule context items are loaded as subset of problem.ContextItemDefinition
                    //if (names.contains(name) == false) {
                    //    names.push(name)
                    //    createContextItemControlFromServer(name);
                    //}

                    i = k;
                    name = "";
                    op = "";
                    value = "";
                    k = 0;
                    break;
                }
            }
        }
    }
}

/** 
* Rule only contains context item name, this method retrieve other info from server by ajax call.
* @param {string} name Context item name.
*/
function createContextItemControlFromServer(name) {
    var url = '/AjaxHandler/QueryContextItemByName';

    // getJSON also works
    // $.getJSON(url, { name: name },
    // function (json) {
    // });

    $.ajax({
        url: url,
        data: { 'name': name },
        type: 'GET',
        dataType: 'json' // dataType (default: Intelligent Guess (xml, json, script, or html))
    }).done(function (data) {
        // data is a jQuery XMLHttpRequest (jqXHR) object
        if (data && data.obj && data.obj.length>=6)
            createContextItemControl(data.obj[0], escape(data.obj[1]), escape(data.obj[3]), escape( data.obj[4]), escape(data.obj[5]));
    });
}

/**
* Append row into table for context Item.
* When using this function, make sure to escape parameters that may contain brackets.
* 
* @param {string} id Context item id.
* @param {string} name Context item name.
* @param {string} datatype Context item datatype.
* @param {string} unit Context item unit.
* @param {string} referencerange Context item referencerange.
* @param {boolean} popDialog Whether pop up dialog or open a new window for editing context item.
* @param {boolean} wiki Whether create a link at wikipedia.
* @param {boolean} weight Whether create an additional weight numeric textbox.
*/
function createContextItemControl(id, name, datatype, unit, referencerange, popDialog, wiki, weight) {
    // unescape paramters
    name = unescape(name);
    unit = unescape(unit);
    datatype = unescape(datatype);
    referencerange = unescape(referencerange);

    if (!name || !datatype) {
        return;
    }

    if (!unit){
        unit = "";
    }

    if (!referencerange){
        referencerange = "";
    }

    // judge whether the item already exists in table
    var table = document.getElementById("selected-context-items");
    for (var i = 1, row; row = table.rows[i]; i++) { // i=1, skip header row        
        if (row.cells[0].innerHTML == name || row.cells[0].firstChild.innerHTML == name)
            return;
    }

    var link = '<a href="/ContextItem/Edit/' + id + '" target="_blank">' + name + '</a>';
    if (wiki){
        link = '<a href =\'http://en.wikipedia.org/wiki/' + name + '\' target="_blank">' + name + '</a>';
    }
    if (popDialog) {
        link = '<span style = "text-decoration: underline; color: Blue; cursor:pointer" onclick="editContextItemTerms(\'' + id + '\');">' + name + '</span>';
    }
    var text = '<tr id="' + id + '"><td>' + link + '</td><td>';
    if (!unit || unit == 'null' || unit == 'undefined')
        text = text + '</td><td>';
    else
        text = text + unit + '</td><td>';
    text = text + datatype + '</td><td>';
    if (!referencerange || referencerange == 'null' || referencerange == 'undefined')
        text = text + '</td><td>';
    else
        text = text + referencerange + '</td><td>';
    if (weight) {
        text += "<input type='text' style='width:30px;' value='1'/>" + '</td><td>';
    }
    text += '<img onclick="del(\'' + id + '\');" style="cursor:pointer; position: relative; margin-bottom: -5px" src="data:image/.png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAHrSURBVHja5FQ9zuIwEPU4JighKN0HQoiKAiSQOEA4BJTQQINEwQkoKGiRaDgNXIGGn4qGAtEgFAQBlmB7vIW/jXazzVLvq/xG4/l5MzYopcifQMTxeLxcLpPJJCGEc16pVIbDoW3bMU9QSimlTqfT7XYDAAB4vV673c5xnMjp/X7n8/l0Oo2ISinbtrPZrGEYzPf96XS63W4ZYwBACAEA0zRjFXHOtUUpBQClUqnX68FkMlksFsVikXyCy+VSrVbheDxer9fD4aDT/gsQMZPJfH19sVwut9/vZ7OZ67qccyFEMpnUgTjniKhl050TQkzTfD6fnU6nVqsxQoiUMpFImKaZz+cLhcJqtRJCIGK5XHYcZ7PZ6FZrtZqUcrfbKaUopYQQqhUihIRh6Hlev99Pp9NCCM55s9lstVqv1wsRGWPdbrfdbkspEVHXQqNOlFKGYUTCAoBhGIgYhqGOrrMJISJ16O9KxMajKQBE9pgD/WhCsYl8djmG//5yTExN/37wEZhedL0VP36BUiqlvN/v+gAAiPh4PHzfj+j3Z7Ber0ejkeu6lmWFYfh8Ph3HQUTLsoIgEELYto2IqVTqfD5TSjnng8GgXq9/b898Pp/P50EQKKUYY9qowxuGoamUkhBiWZbneY1GgzH2cwCoMSPQ6evZfgAAAABJRU5ErkJggg==" alt="remove item" />' + '</td></tr>';

    $('#selected-context-items tr:last').after(text);
    addContextItemOption(name, datatype, unit);
}

/**
* Add a new context item option.
* The context item will be added to add-condition combobox, and also to intellisense tags.
*/
function addContextItemOption(name, datatype, unit) {
    var combo = document.getElementById("select-context-item");
    var text = name;
    addSelectOption(combo, datatype, text);
    availableTags.push('[' + name + ']');
}

/**
* Generate rule expression from graphic rule editor.
*/
function getRuleExpr() {
    var composer = document.getElementById("rule-composer");
    var length = composer.childNodes.length;
    var item = null;
    var expression = "";
    for (var i = 0; i < length; i++) {
        item = composer.childNodes[i];
        if (!item.tagName)
            continue;
        if (item.tagName.toLowerCase() == 'li') {
            var innerLength = item.childNodes.length;
            var innerItem = null;
            var innerExpression = "";
            for (var j = 0; j < innerLength; j++) {
                innerItem = item.childNodes[j];
                if (!innerItem.tagName)
                    continue;
                if (innerItem.tagName.toLowerCase() == 'input' ||
                    innerItem.tagName.toLowerCase() == 'select') {
                    var val = innerItem.value;
                    if (innerItem.attributes &&
                        innerItem.attributes["class"] &&
                        (innerItem.attributes["class"].value == ("string-value") || innerItem.attributes["class"].value == ("date-value")))
                        val = "'" + val + "'";
                    innerExpression += val;
                    innerExpression += ' ';
                }
            }
            expression += innerExpression;
        }
    }
    return expression;
}

/**
* Add an element to graphic rule editor.
* 
* @param {string} type Element type, e.g. condition clauses (bp>150), logical operators(||,&&), or parentheses.
* @param {string} name Context item name of a condition clause (lhs).
* @param {string} operator Math operator of a condition clause.
* @param {string} value Right hand side of a condition clause (rhs).
*
*/
function addRuleElement(type, name, operator, value) {
    var combo = document.getElementById("select-context-item");
    var text = name;
    if (!type) {
        type = combo.value;
        if (combo.selectedIndex == -1) {
            alert(getGlobalVar('Message_PleaseSelectContextItems'));
            return;
        }
        text = combo.options[combo.selectedIndex].text;
    }
    if (!type)
        return;

    type = type.toLowerCase();

    var composer = document.getElementById("rule-composer");
    var item = document.createElement("li");
    item.setAttribute("class", "ui-state-default");
    var thisId = "clause-" + (ruleElementCounter++); //specify a unique id
    item.setAttribute("id", thisId);
    composer.appendChild(item);

    if (type == "and") {
        var op = document.createElement("select");
        item.appendChild(op);
        addSelectOption(op, "&&", 'And');
        addSelectOption(op, "||", 'Or');
        addSelectOption(op, "!", 'Not');
        op.selectedIndex = 0;
    }
    else if (type == "or") {
        var op = document.createElement("select");
        item.appendChild(op);
        addSelectOption(op, "&&", 'And');
        addSelectOption(op, "||", 'Or');
        addSelectOption(op, "!", 'Not');
        op.selectedIndex = 1;
    }
    else if (type == "not") {
        var op = document.createElement("select");
        item.appendChild(op);
        addSelectOption(op, "&&", 'And');
        addSelectOption(op, "||", 'Or');
        addSelectOption(op, "!", 'Not');
        op.selectedIndex = 2;
    }
    else if (type == "(") {
        var op = document.createElement("select");
        item.appendChild(op);
        addSelectOption(op, "(", "(");
        addSelectOption(op, ")", ")");
        op.selectedIndex = 0;
    }
    else if (type == ")") {
        var op = document.createElement("select");
        item.appendChild(op);
        addSelectOption(op, "(", "(");
        addSelectOption(op, ")", ")");
        op.selectedIndex = 1;
    }
    else if (type == "numeric" || type == 'date') {
        var lhs = document.createTextNode(text + " ");
        item.appendChild(lhs);

        lhs = document.createElement("input");
        lhs.setAttribute("type", "hidden");
        lhs.setAttribute("value", "[" + text + "]");
        item.appendChild(lhs);

        var op = document.createElement("select");
        item.appendChild(op);
        addSelectOption(op, ">", ">");
        addSelectOption(op, ">=", ">="); //¡Ý
        addSelectOption(op, "<", "<");
        addSelectOption(op, "<=", "<="); //¡Ü
        addSelectOption(op, "==", "=");
        addSelectOption(op, "!=", "!="); //¡Ù
        if (operator)
            op.value = operator;

        var rhs = document.createElement("input");
        rhs.setAttribute("type", "text");
        if (!value) {
            if (type == 'date') {
                rhs.setAttribute("value", "2000-01-01");
            }
            else {
                rhs.setAttribute("value", "0.0");
            }
        }
        else {
            rhs.setAttribute("value", value);
        }
        rhs.setAttribute("style", "width:50px");
        if (type == 'date') {
            rhs.setAttribute("class", "date-value");
        }
        item.appendChild(rhs);
    }
    else if (type == "boolean") {
        var lhs = document.createTextNode(text + " ");
        item.appendChild(lhs);

        lhs = document.createElement("input");
        lhs.setAttribute("type", "hidden");
        lhs.setAttribute("value", "[" + text + "]");
        item.appendChild(lhs);

        var op = document.createElement("select");
        item.appendChild(op);
        addSelectOption(op, "==", "=");
        op.value = "==";

        var rhs = document.createElement("select");
        item.appendChild(rhs);
        addSelectOption(rhs, "'true'", 'true');
        addSelectOption(rhs, "'false'", 'false');
        if (value)
            rhs.value = value;
    }
    else if (type == "string") {
        var lhs = document.createTextNode(text + " ");
        item.appendChild(lhs);

        lhs = document.createElement("input");
        lhs.setAttribute("type", "hidden");
        lhs.setAttribute("value", "[" + text + "]");
        item.appendChild(lhs);

        var op = document.createElement("select");
        item.appendChild(op);
        addSelectOption(op, "==", "=");
        addSelectOption(op, "!=", "!=");
        //op.value = "==";
        if (operator)
            op.value = operator;
        
        var rhs = document.createElement("input");
        rhs.setAttribute("type", "text");
        if (value)
            rhs.setAttribute("value", value);
        rhs.setAttribute("style", "width:50px");
        rhs.setAttribute("class", "string-value");
        item.appendChild(rhs);
    }

    var del = document.createElement("label");
    del.innerHTML = "[-]";
    del.setAttribute("style", "float:right; cursor: pointer;");
    del.setAttribute("onclick", "del('" + thisId + "');");
    item.appendChild(del);
};