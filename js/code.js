!function(root, document) {
    "use strict";
    function processCodeBlock(codeBlock) {
        let preContainer = codeBlock.parentElement
        codeBlock.classList.add('multiline')
        codeBlock.addEventListener('dblclick', function () {
            if (this.childNodes[0] && this.childNodes[0].tagName.toLowerCase() == 'table') {
                let codeTable = this.childNodes[0]
                if (codeTable.scrollHeight <= this.clientHeight && codeTable.scrollWidth <= this.clientWidth)
                    return
            } else return

            openModal($('<pre>').append($(codeBlock)), {
                contentClass: 'fullscreen',
                onClose: function (e) {
                    preContainer.appendChild(codeBlock)
                }
            })
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
                    let endLine = selectedRange.length > 1 ? parent(selectedRange[0]) : beginLine
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