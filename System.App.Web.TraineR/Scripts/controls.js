/*
* Defines the combobox widget.
*/
$.widget("ui.combobox", {
    _create: function () {
        var self = this;
        var select = this.element.hide(),
      selected = select.children(":selected"),
      value = selected.val() ? selected.text() : "";
        var input = $("<input />")
      .insertAfter(select)
      .val(value)
      .autocomplete({
          delay: 0,
          minLength: 0,
          source: function (request, response) {
              var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
              response(select.children("option").map(function () {
                  var text = $(this).text();
                  if (this.value && (!request.term || matcher.test(text)))//text.indexOf(request.term)>=0
                      return {
                          label: text,
                          value: text.split()[1],
                          option: this
                      };
              }));
          },
          select: function (event, ui) {
              ui.item.option.selected = true;
              self._trigger("selected", event, {
                  item: ui.item.option
              });
          },
          change: function (event, ui) {
              if (!ui.item) {
                  var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
           valid = false;
                  select.children("option").each(function () {
                      if (this.value.match(matcher)) {
                          this.selected = valid = true;
                          return false;
                      }
                  });
                  if (!valid) {
                      // remove invalid value, as it didn't match anything
                      $(this).val("");
                      select.val("");
                      return false;
                  }
              }
          }
      })
      .addClass("ui-widget ui-widget-content ui-corner-left");

        input.data("ui-autocomplete")._renderItem = function (ul, item) {
            return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a>" + item.label + "</a>")
            .appendTo(ul);
        };
        // In jQuery UI 1.10, they changed naming convention: autocomplete -> ui-autocomplete
        // http://jqueryui.com/upgrade-guide/1.10/

        //    $( "<button> </button>" )
        //    .attr( "tabIndex", -1 )
        //    .attr( "title", "Show All Items" )
        //   .insertAfter( input )
        //   .button({
        //      icons: {
        //       primary: "ui-icon-triangle-1-s"
        //     },
        //      text: false
        //    })
        //    .removeClass( "ui-corner-all" )
        //    .addClass( "ui-corner-right ui-button-icon" )
        //   .click(function() {
        //     // close if already visible
        //     if (input.autocomplete("widget").is(":visible")) {
        //        input.autocomplete("close");
        //       return;
        //      }
        //     // pass empty string as value to search for, displaying all results
        //      input.autocomplete("search", "");
        //      input.focus();
        //    });
    }
});


/*
* Exextend the $.fn object with new methods check() and uncheck(). * e.g. $(":checkbox").check(); $(":checkbox").uncheck();
*/
(function ($) {
    $.fn.extend({
        check: function () {
            return this.filter(":radio, :checkbox").attr("checked", true);
        },
        uncheck: function () {
            return this.filter(":radio, :checkbox").removeAttr("checked");
        }
    });
} (jQuery));
