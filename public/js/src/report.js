(function(conf) {
  var STRIP_WIDTH = 300;
  var $filmstrip = $('#filmstrip');

  $.getJSON('/work/' + conf.id, function(data) {
    $filmstrip.css('width', data.clips.length * (STRIP_WIDTH + 15));

    data.clips.forEach(function(clip) {
      var secs = gb.util.diffSeconds(clip.date, data.started)
        , $p = $('<p>', {html: secs + 's<br>'})
        , $img = $('<img>', {src: 'data:image/png;base64, ' + clip.imageData, width: STRIP_WIDTH});

      $filmstrip.append($p.append($img));
    });
  });

}(window.config));