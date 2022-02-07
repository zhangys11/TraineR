// requires jquery and jstree


/**
* Creating an ajax autocomplete control
*
* @param {jquery_selector} jquery selector for target element.
* @param {ajax_url} url of ajax method that provides candidate terms.
*/
function createAutocompleteAjaxControl(jquery_selector, ajax_url) {
    $(jquery_selector).autocomplete({
        minLength: 0,
        source: function (request, response) {
            $.ajax({
                url: ajax_url,
                type: "GET",
                dataType: "json",
                data: { term: request.term },
                success: function (data) {
                    response(data);
                }
            });
        },
        select: function (event, ui) {
            $(jquery_selector).val(ui.item.Name);
            return false;
        }
    }).bind('focus', function () {
        // When text is empty, pop up the candidate list
        if (!$(this).val()) {
            $(this).autocomplete("search");
        }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var ln = "<a>" + item.Name + "</a>";
        return $("<li></li>").data("item.autocomplete", item).append(ln).appendTo(ul);
    };
}
