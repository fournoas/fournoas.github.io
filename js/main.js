// main.js
$(function(){
  var $rootElement = $(document.documentElement);
  var $body = $('body');
  
  $('.img-preview').click(function(e){
    e.preventDefault();

    var imgSrc = $(e.target).data('src');
    $rootElement.addClass('is-clipped');
    $body.append('\
<div class="modal">\
  <div class="modal-background"></div>\
  <div class="modal-content">\
    <div class="modal-box"><img src="' + imgSrc + '"></div>\
    <button class="modal-close"></button>\
  </div>\
</div>');

    return false;
  });
  
  $body.on('click', '.modal-close', function(e){
    $rootElement.removeClass('is-clipped');
    $(e.target).parents('.modal').remove();
  });

  var $post = $body.find('.post');
  if ($post.length) {
    var postContainerWidth = $post.width();
    $post.find('table').each(function () {
      var $table = $(this);
      if ($table.width() > postContainerWidth) {
        $table.wrap('<div class="table-container"></div>');
      }
    });
  }
});
