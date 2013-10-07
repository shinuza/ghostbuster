(function(gb) {
  var $form = $('form')
    , $validate = $('#validate')
    , $url = $('#url')
    , $width = $('#width')
    , $height = $('#height')
    , $viewport = $('#viewport_size')
    , $customViewport = $('#custom_viewport_size')
    , $options = $('#options')
    , $optionsButton = $('#options_button')
    , $optionsChevron = $optionsButton.find('span');



  $optionsButton.click(function() {
    $optionsChevron.toggleClass('glyphicon-chevron-down');
    $options.slideToggle();
  });

  $viewport.change(function() {
    if(this.value == 'custom') {
      $customViewport.removeClass('hide');
    } else {
      $customViewport.addClass('hide');
      var dimension = this.value.split('x');
      $width.val(dimension[0]);
      $height.val(dimension[1]);
    }
    $customViewport.popover('hide');
  });

  $form.submit(function() {
    var $this = $(this)
      , data = gb.util.serializeObject($this.serializeArray())
      , hasUrl = !!data.url
      , hasSizes = !!(parseInt(data.width, 10) && parseInt(data.height, 10));

    $url.popover(!hasUrl ? 'show' : 'hide');
    $customViewport.popover(!hasSizes ? 'show': 'hide');

    if(hasUrl && hasSizes) {
      $(document).trigger('form:submit', data);
      $validate.button('loading');
    }

    return false;
  });

  $options.hide();
  $viewport.change();
  $url.popover();
  $customViewport.popover();
  $validate.button();
}(window.gb));