(function(win, doc) {
  var $doc = $(doc);

  $doc.on('form:submit', function(e, data) {
    gb.util.postJSON('/jobs', JSON.stringify(data)).then(function(json) {
      $(document).trigger('job:accepted', json);
    });
  });

  $doc.on('job:accepted', function(e, data) {
    $.getJSON('/jobs/' + data.id).then(function(json) {
      document.location = '/reports/' + json.id;
    });
  });
}(window, document));
