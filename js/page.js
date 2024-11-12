// page.js
$(function(){
  let $page = $('.page');
  if (!$page.length) return;

  (function wrapTable($page) {
    let pageContainerWidth = $page.width();
    $page.find('table').each(function () {
      let $table = $(this);
      if ($table.width() > pageContainerWidth) {
        $table.wrap('<div class="table-container"></div>');
      }
    });        
  })($page);

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

  $page.find('img').each(function () {
    if (this.naturalWidth > this.width) {
      this.dataset.src = this.src
      this.classList.add('img-preview')
    }
  })

  $page.find('a').each(function () {
    let href = $(this).attr('href')
    if (this.classList.contains('card') ||
        !href || 
        !href.startsWith('http://') && 
        !href.startsWith('https://')) {
      return
    }
    let archivedLink = 'https://web.archive.org/web/2/' + this.href
    $('<sup style="padding: 0 .2rem;"><a href="' + 
      archivedLink + 
      '" target="_blank" rel="noopener" title="互联网存档"><i class="fa-regular fa-clone"></i></a></sup>').insertAfter($(this))
  })
});
