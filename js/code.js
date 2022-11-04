!function(root, document) {
    "use strict";
    function processCodeBlock(codeBlock) {
        function getCodeBlockTable(codeBlock) {
            if (!codeBlock.childNodes[0] || 
                !codeBlock.childNodes[0].tagName ||
                codeBlock.childNodes[0].tagName.toLowerCase() != 'table') {
                return
            }
            return codeBlock.childNodes[0]
        }
        function isFullscreenable(codeBlock) {
            let codeTable = getCodeBlockTable(codeBlock)
            if (!codeTable) return false
            if (codeTable.scrollHeight <= codeBlock.clientHeight && 
                codeTable.scrollWidth <= codeBlock.clientWidth) {
                return false
            }
            return true
        }
        root.setTimeout(function() {
            getCodeBlockTable(codeBlock) && codeBlock.classList.add('multiline')
        }, 0)
        let preContainer = codeBlock.parentElement
        codeBlock.addEventListener('dblclick', function () {
            if (!isFullscreenable(this)) return
            openModal($('<pre>').append($(codeBlock)), {
                contentClass: 'fullscreen',
                onClose: function (e) {
                    preContainer.appendChild(codeBlock)
                }
            })
        })
        codeBlock.addEventListener('mouseover', function () {
            if (!isFullscreenable(this)) return
            this.title = '双击全屏显示'
        })
        codeBlock.addEventListener('mouseout', function () {
            this.title = ''
        })
        return codeBlock
    }

    function render() {
        let codeBlocks = document.querySelectorAll('pre>code')
        for (let i in codeBlocks) {
            if (!codeBlocks.hasOwnProperty(i)) continue
            let codeBlock = processCodeBlock(codeBlocks[i])
            if (!codeBlock.hasAttribute('data-ln-selected')) continue
            let selectedLinesText = codeBlock.dataset.lnSelected
            if (!selectedLinesText) continue

            root.setTimeout(function () {
                selectedLinesText.split(',').forEach(function (range) {
                    let selectedRange = range.split(':')
                    let beginLine = parseInt(selectedRange[0])
                    let endLine = selectedRange.length > 1 ? parseInt(selectedRange[1]) : beginLine
                    if (beginLine > 0 && endLine > 0) {
                        for (let ln = beginLine; ln <= endLine; ln ++) {
                            let td = codeBlock.querySelector('.hljs-ln-line[data-line-number="' + ln +'"]')
                            if (td) {
                                td.parentElement.classList.add('hljs-ln-selected')
                            }
                        }
                    }
                })    
            }, 0)
        }
    }
    root.hljs ? root.hljs.initSelectLines = function () {
        if ("complete" === document.readyState) {
            render()
        } else {
            root.addEventListener("DOMContentLoaded", function () {
                render()
            })
        }
    } : root.console.error("highlight.js not detected!")
}(window, document);