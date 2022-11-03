// post.js
$(function(){
  let $post = $('.post');
  if (!$post.length) return;

  (function wrapTable($post) {
    let postContainerWidth = $post.width();
    $post.find('table').each(function () {
      let $table = $(this);
      if ($table.width() > postContainerWidth) {
        $table.wrap('<div class="table-container"></div>');
      }
    });        
  })($post);

  (function mountTOC() {
    let $tableOfContents = $('#TableOfContents');
    if ($tableOfContents.length) {
      let $rootElement = $(document.documentElement);
      let $asideBar = $('#aside-toc');
      let $collapsedTOC = $('#collapsed-toc');
      let $asideTOC = $asideBar.children('.content');
      $asideTOC.append($tableOfContents.children('ul').clone());
  
      let anchorPositions;
      let loadAnchorPositions = function () {
        anchorPositions = new Array();
        $('h1,h2,h3,h4,h5,h6').each(function () {
          if (!this.id) return;
          anchorPositions.unshift({id: this.id, top: this.offsetTop});
        });
      };
      loadAnchorPositions();
  
      $(window).scroll(function () {
        $(anchorPositions).each(function () {
          if (window.pageYOffset + 1 >= this.top) {
            $asideTOC.find('a').removeClass('active');
            $asideTOC.find('a[href="#' + this.id + '"]').addClass('active');
            loadAnchorPositions();
            return false;
          }
        });
      });
  
      $asideBar.on('click', 'a', function () {
        $asideBar.removeClass('active');
        $rootElement.removeClass('is-clipped');
      });
  
      $collapsedTOC.children('a').click(function () {
        $rootElement.addClass('is-clipped');
        $asideBar.addClass('active');
        return false;
      });
    }  
  })();
});
