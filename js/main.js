// main.js
$(function(){
  let $body = $('body')
  let $rootElement = $(document.documentElement)

  window.openModal = function (element, option) {
    if (element instanceof Element) {
      element = $(element)
    }
    $rootElement.addClass('is-clipped')
    $modal = $('\
<div class="modal">\
  <div class="modal-background"></div>\
  <div class="modal-content">\
    <div class="modal-box"></div>\
    <button class="modal-close"></button>\
  </div>\
</div>')
    let $modalBox = $modal.find('.modal-box')
    let $modalContent = $modal.find('.modal-content')
    let $modalClose = $modal.find('.modal-close')
    if (option && option.contentClass) {
      $modalContent.addClass(option.contentClass)
    }
    $modalBox.append(element)
    $modalClose.on('click', function (e) {
      if (option && option.onClose) option.onClose($modal, e)
      if (e.defaultPrevented) return
      $rootElement.removeClass('is-clipped');
      $(e.target).parents('.modal').remove();
    })
    $body.append($modal)
    return $modal
  }

  $body.on('click', '.img-preview', function(e){
    e.preventDefault()
    let imgSrc = $(e.target).data('src')
    openModal($('<img src="' + imgSrc +'">'))
    return false
  })

  $('.catalogue-moment').each(function() {
    let dialogueTail = $('<div>').addClass('dialogue-tail').insertBefore(this)
  })
});
