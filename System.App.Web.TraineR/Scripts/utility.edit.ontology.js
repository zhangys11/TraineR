/**
* Add a new term.
*
* @param {string} term A literal term for concept.
*/
function addTerm(term) {
    if (!term) term = '';
    var area = document.getElementById('context_item_nlp');
    if (area) {
        var newDiv = document.createElement("div");
        newDiv.innerHTML = '<input style="margin:3px; width: 220px;" value = "' + term + '"/><img onclick="deleteTerm(this);" style="cursor:pointer; position: relative; margin-bottom: -5px" src="data:image/.png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAHrSURBVHja5FQ9zuIwEPU4JighKN0HQoiKAiSQOEA4BJTQQINEwQkoKGiRaDgNXIGGn4qGAtEgFAQBlmB7vIW/jXazzVLvq/xG4/l5MzYopcifQMTxeLxcLpPJJCGEc16pVIbDoW3bMU9QSimlTqfT7XYDAAB4vV673c5xnMjp/X7n8/l0Oo2ISinbtrPZrGEYzPf96XS63W4ZYwBACAEA0zRjFXHOtUUpBQClUqnX68FkMlksFsVikXyCy+VSrVbheDxer9fD4aDT/gsQMZPJfH19sVwut9/vZ7OZ67qccyFEMpnUgTjniKhl050TQkzTfD6fnU6nVqsxQoiUMpFImKaZz+cLhcJqtRJCIGK5XHYcZ7PZ6FZrtZqUcrfbKaUopYQQqhUihIRh6Hlev99Pp9NCCM55s9lstVqv1wsRGWPdbrfdbkspEVHXQqNOlFKGYUTCAoBhGIgYhqGOrrMJISJ16O9KxMajKQBE9pgD/WhCsYl8djmG//5yTExN/37wEZhedL0VP36BUiqlvN/v+gAAiPh4PHzfj+j3Z7Ber0ejkeu6lmWFYfh8Ph3HQUTLsoIgEELYto2IqVTqfD5TSjnng8GgXq9/b898Pp/P50EQKKUYY9qowxuGoamUkhBiWZbneY1GgzH2cwCoMSPQ6evZfgAAAABJRU5ErkJggg==" alt="'
            + '@Resource.Delete' + '" />';
        area.appendChild(newDiv);
    }
}

/**
* Delete a term.
*
* @param {element} e An html element.
*/
function deleteTerm(e) {
    var area = document.getElementById('context_item_nlp');
    if (area) {
        area.removeChild(e.parentNode);
    }
}

/**
* Render view for terms of context item / concept
*
* @param {string} id Context item id.
*
* @return {boolean} true if succeed.
*/
function renderContextItemTerms(id) {
    if (!id) {
        return false;
    }

    if (id === 0 || id === '0') { // create case
        return false;
    }

    var ret = false;
    $.ajax({
        url: '/AjaxHandler/QueryTermsForContextItem',
        type: 'GET',
        data: { id: id },
        async: false, // wait until ajax returns
        cache: false,
        timeout: 10000
        // never ever specify dataType: 'json' for html return
    }).done(function (data) {
        if (data && data.obj) {
            var area = $('#context_item_nlp');
            if (area) {
                $('#ContextItemId').val(id);
                $('#Terms').val(JSON.stringify(data.obj));

                for (var i = 0; i < data.obj.length; i++) {
                    addTerm(data.obj[i]);
                }

                ret = true;
            }
            else {
                alert("cannot find div with id = context_item_nlp");
            }
        }
        else {
            alert("Failed to query terms for context item with id = " + id);
        }
    });
    return ret;
}

/**
* Pop up a dialog to edit terms of context item / concept
*
* @param {string} id Context item id.
*/
function editContextItemTerms(id) {
    if (!id) return;

    if (renderContextItemTerms(id)) {
        $('#dialog-edit-context-item-terms').dialog("open");
    }
}

/**
* Return a json serialization string of terms from view.
*
* @return {string} a json serialization string of terms.
*/
function getTerms() {
    var term = [];
    var inputs = $('#context_item_nlp > div > input');
    for (var i = 0; i < inputs.length; i++) {
        term.push(inputs[i].value);
    }
    return JSON.stringify(term);
}

/**
* Append multiple context items within the same synonymous group into table.
* 
* @param {string} id Context item id.
*/
function createContextItemControlsForMapping(id) {
    $.ajax({
        url: '/AjaxHandler/QueryContextItemGroupById',
        type: 'GET',
        data: { id: id },
        async: false, // wait until ajax returns
        cache: false,
        timeout: 10000,
        dataType: 'json'
    }).done(function (data) {
        if (data && data.obj)
        {
            for (var i = 0; i < data.obj.length; i++)
            {
                var item = data.obj[i];
                if (item) {
                    // c.Name, c.Code, c.CodingSystem, c.InputCode, c.Type, c.Hierarchy, c.DataType 6, c.Unit, c.ReferenceRange, c.Id.ToString(), c.FK_EMR_Id, (c.PrimaryItem == c).ToString()
                    createContextItemControlForMapping(item[9], escape(item[0]), escape(item[6]), escape(item[7]), escape(item[8]), escape(item[4]), escape(item[1]), escape(item[2]), escape(item[10]), escape(item[11]), item[12]);
                }
            }
        }        
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
*/
function createContextItemControlForMapping(id, name, datatype, unit, referencerange, type, code, codingsystem, fk, source, primary) {
    // unescape paramters
    name = unescape(name);
    unit = unescape(unit);
    datatype = unescape(datatype);
    referencerange = unescape(referencerange);
    type = unescape(type);
    code= unescape(code);
    codingsystem=unescape(codingsystem);
    fk = unescape(fk);
    source = unescape(source);

    // judge whether the item already exists in table
    var table = document.getElementById("selected-context-items");
    for (var i = 1, row; row = table.rows[i]; i++) { // i=1, skip header row 
        if (row.cells[1].innerHTML == id || row.cells[1].firstChild.innerHTML == id)
            return;
    }

    var checked = '';
    if (primary && primary.toLowerCase() == 'true') {
        checked = ' checked="checked"';
    }
    var isPrimary = '<input type="radio" name="primary_item" ' + checked + '/>';

    var link = '<a href="/ContextItem/Edit/' + id + '" target="_blank">' + name + '</a>';
    var text = '<tr id="' + id + '"><td>' + isPrimary + '</td><td>' + id + '</td><td>' + link + '</td><td>';
    if (!unit || unit == 'null')
        text = text + '</td><td>';
    else
        text = text + unit + '</td><td>';
    text = text + datatype + '</td><td>';
    if (!referencerange || referencerange == 'null')
        text = text + '</td><td>';
    else
        text = text + referencerange + '</td><td>';
    if (!type || type == 'null')
        text = text + '</td><td>';
    else
        text = text + type + '</td><td>';
    if (!code || code == 'null')
        text = text + '</td><td>';
    else
        text = text + code + '</td><td>';
    if (!codingsystem || codingsystem == 'null')
        text = text + '</td><td>';
    else
        text = text + codingsystem + '</td><td>';
    if (!fk || fk == 'null')
        text = text + '</td><td>';
    else
        text = text + fk + '</td><td>';
    if (!source || source == 'null')
        text = text + '</td><td>';
    else
        text = text + source + '</td><td>';
    text += '<img onclick="del(' + id + ');" style="cursor:pointer; position: relative; margin-bottom: -5px" src="data:image/.png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAHrSURBVHja5FQ9zuIwEPU4JighKN0HQoiKAiSQOEA4BJTQQINEwQkoKGiRaDgNXIGGn4qGAtEgFAQBlmB7vIW/jXazzVLvq/xG4/l5MzYopcifQMTxeLxcLpPJJCGEc16pVIbDoW3bMU9QSimlTqfT7XYDAAB4vV673c5xnMjp/X7n8/l0Oo2ISinbtrPZrGEYzPf96XS63W4ZYwBACAEA0zRjFXHOtUUpBQClUqnX68FkMlksFsVikXyCy+VSrVbheDxer9fD4aDT/gsQMZPJfH19sVwut9/vZ7OZ67qccyFEMpnUgTjniKhl050TQkzTfD6fnU6nVqsxQoiUMpFImKaZz+cLhcJqtRJCIGK5XHYcZ7PZ6FZrtZqUcrfbKaUopYQQqhUihIRh6Hlev99Pp9NCCM55s9lstVqv1wsRGWPdbrfdbkspEVHXQqNOlFKGYUTCAoBhGIgYhqGOrrMJISJ16O9KxMajKQBE9pgD/WhCsYl8djmG//5yTExN/37wEZhedL0VP36BUiqlvN/v+gAAiPh4PHzfj+j3Z7Ber0ejkeu6lmWFYfh8Ph3HQUTLsoIgEELYto2IqVTqfD5TSjnng8GgXq9/b898Pp/P50EQKKUYY9qowxuGoamUkhBiWZbneY1GgzH2cwCoMSPQ6evZfgAAAABJRU5ErkJggg==" alt="remove item" />' + '</td></tr>';

    $('#selected-context-items tr:last').after(text);
}