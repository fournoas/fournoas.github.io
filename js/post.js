// post.js
$(function(){
  var $post = $('.post');
  if ($post.length) {
    var postContainerWidth = $post.width();
    $post.find('table').each(function () {
      var $table = $(this);
      if ($table.width() > postContainerWidth) {
        $table.wrap('<div class="table-container"></div>');
      }
    });
  }

  var $tableOfContents = $('#TableOfContents');
  if ($tableOfContents.length > 0) {
    var $asideTOC = $('#aside-toc').children('.content');
    $asideTOC.append($tableOfContents.children('ul').clone());
  }
});
