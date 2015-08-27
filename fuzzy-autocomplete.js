/* Written by Alex Jiao 
 * Usage: fuzzyAutocomplete($('#your-input-element'), ['data1', 'data2']);
 *        fuzzyAutocomplete($('#your-input-element'), '/javascripts/data.json');
 */
function fuzzyAutocomplete(input, data) {
    var dataList = [];
    // Check if data source is array or string type, otherwise return
    if (Array.isArray(data)) {
        dataList = dataList.concat(data);
    } else if (typeof data === 'string' || data instanceof String) {
        $.ajax({
            url: data,
            type: 'GET',
            success: function(data) {
                data.forEach(function(item) {
                    dataList.push(item);
                });
            }
        });
    } else {
        return;
    }
    // Fuzzy matching with regex
    var matchData = function(input, dataList) {
        var reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');
        return dataList.filter(function(data) {
            if (data.match(reg)) {
                return data;
            }
        });
    };
    // Change input value upon keyup
    var changeInput = function(input, dataList) {
        var val = input.val();
        var inputAncestor = input.parent();
        var res = inputAncestor.find('.fuzzy-autocomplete-result');
        while(res.length == 0) {
          inputAncestor = inputAncestor.parent();
          res = inputAncestor.find('.fuzzy-autocomplete-result');
        }
        res.empty().hide();
        var autoCompleteResult = matchData(val, dataList);
        if (val == "" || autoCompleteResult.length == 0) {
            return;
        }
        autoCompleteResult.forEach(function(e) {
            var p = $('<p />');
            p.css({
              'margin': '0px',
              'padding-left': parseInt(input.css('padding-left'),10) + parseInt(input.css('border-left-width'),10)
            });
            p.text(e);
            p.click(function() {
                input.val(p.text());
                res.empty().hide();
            })
            p.mouseenter(function() {
                $(this).css("background-color", "#BA9EB0");
            }).mouseleave(function() {
                $(this).css("background-color", "white");
            });
            res.append(p);
        });
        res.css({
            'left': input.position().left,
            'width': input.width() + parseFloat(input.css('padding-left'),10) + parseInt(input.css('border-left-width'),10) + 1,
            'position': 'absolute',
            'background-color': "white",
            'border': '1px solid #dddddd',
            'max-height': '150px',
            'overflow': 'scroll',
            'overflow-x': 'hidden',
            'font-family': input.css('font-family'),
            'font-size' : input.css('font-size'),
            'z-index' : '10'
        }).insertAfter(input).show();
    };
    // Create a div for collecting the results, and a container for enclosing the input element and result div
    var res = $("<div class='fuzzy-autocomplete-result' />");
    res.insertAfter(input);
    input.keyup(function() {
        changeInput(input, dataList);
    });
    // Hide result div upon clicking anywhere outside the div
    $(document).click(function(event) {
      if (!$(event.target).closest('.fuzzy-autocomplete-result').length) {
        res.empty().hide();
      }
    });
}
