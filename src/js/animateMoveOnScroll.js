
export class AnimateMoveOnScroll {
    constructor(element) {
        this.__element = element
        this.__startOffset = 0
        this.__endOffset = 0
        this.__lastY = 0
        this.__direction = 'FORWARD'
        this.__passthrow = false
        this.__onScroll = null
        this.__onStart = null
        this.__onEnd = null
        return this
    }

    setStartOffset(pix) {
        this.__startOffset = pix
        return this
    }

    setEndOffset(pix) {
        this.__endOffset = pix
        return this
    }

    setOnScroll(scrollFunc) {
        if (typeof scrollFunc === 'function') {
            this.__onScroll = scrollFunc
        } else {
            throw new Error('Wrong type of argument, need function')
        }
        return this
    }

    setOnStart(startFunc) {
        if (typeof startFunc === 'function') {
            this.__onStart = startFunc
        } else {
            throw new Error('Wrong type of argument, need function')
        }
        return this
    }

    setOnEnd(endFunc) {
        if (typeof endFunc === 'function') {
            this.__onEnd = endFunc
        } else {
            throw new Error('Wrong type of argument, need function')
        }
        return this
    }

    do() {
        document.addEventListener('scroll', (e) => {
            if (window.scrollY > this.__lastY) {
                this.__direction = 'FORWARD'
            } else {
                this.__direction = 'REVERSE'
            }
            this.__lastY = window.scrollY
            const {top, height, bottom} = this.__element.getBoundingClientRect()
            const progress = 1 - (bottom + this.__endOffset) / (this.__startOffset + height + this.__endOffset)
            if (( top <= this.__startOffset) && ( bottom >= this.__endOffset)) {
                if (!this.__passthrow) {
                    if (this.__onStart) {
                        this.__onStart({'element': this.__element, 'direction': this.__direction })
                    }
                }
                if (this.__onScroll) {
                    this.__onScroll({'element': this.__element, 'top': top, 'bottom': bottom, 'direction': this.__direction, 'progress': progress})
                }
                
                this.__passthrow = true
            } else {
                if (this.__passthrow) {
                    if (this.__onEnd) {
                        this.__onEnd({'element': this.__element, 'direction': this.__direction})
                    }
                }
                this.__passthrow = false
            }
        })
        return this
    }

}

export function transforming_element({start_selector, end_selector, trigger_selector, additional_styles}) {

    const start_element = document.querySelector(start_selector)
    const end_element = document.querySelector(end_selector)
    const trigger_element = document.querySelector(trigger_selector)

    if (getComputedStyle(end_element).display === 'none') return


    let styleChanges = {
        start_element: start_element,
        end_element: end_element,
        additional: additional_styles || []
    }

    styleChanges.end_element.style.opacity = '0'

    styleChanges.list_styles = []
    styleChanges.list_elements = []

    styleChanges.list_elements.push(styleChanges.start_element)
    styleChanges.additional.forEach(elm => {
        styleChanges.list_elements.push(document.querySelector(elm.start_element))
    })

    const base_styles = ['left', 'top', 'height', 'width']

    base_styles.forEach(style => {
        styleChanges.list_styles.push({
            start_element: styleChanges.start_element,
            end_element: styleChanges.end_element,
            style: style,
            type: 'POSITION'
        })
    })

    styleChanges.additional.forEach((element, i) => {
        element.styles.forEach(style => {
            styleChanges.list_styles.push({
                start_element: document.querySelector(styleChanges.additional[i].start_element),
                end_element: document.querySelector(styleChanges.additional[i].end_element),
                style: style,
                type: 'COMPUTED'
            })
        })
    })

    styleChanges.parent_element = styleChanges.start_element.parentNode

    new AnimateMoveOnScroll(trigger_element)
    .setStartOffset(80)
    .setEndOffset(2)
    .setOnStart(e => {

        if (e.direction === 'FORWARD') {

            styleChanges.list_styles.forEach(entry => {
                switch(entry.type) {
                    case 'COMPUTED':
                        entry.start = parseInt(window.getComputedStyle(entry.start_element, null).getPropertyValue(entry.style))
                        entry.end = parseInt(window.getComputedStyle(entry.end_element, null).getPropertyValue(entry.style))
                        break
                    case 'POSITION':
                        if (entry.style === 'top') {
                            entry.start = entry.start_element.getBoundingClientRect()[entry.style] - trigger_element.getBoundingClientRect()[entry.style] + 80
                        } else {
                            entry.start = entry.start_element.getBoundingClientRect()[entry.style]
                        }
                        entry.end = entry.end_element.getBoundingClientRect()[entry.style]
                        break
                }
            })

        }

        if (e.direction === 'REVERSE') {
            styleChanges.end_element.style.opacity = '0'
        }

        if (styleChanges.start_element.parentNode) {
            styleChanges.start_element.parentNode.removeChild(styleChanges.start_element)
        }

        document.querySelector('body').appendChild(styleChanges.start_element)
        
        styleChanges.start_element.querySelectorAll('.not-move').forEach(e => e.style.display = 'none')
    })
    .setOnEnd(e => {
        if (e.direction === 'FORWARD') {
            styleChanges.end_element.style.opacity = '1'
            styleChanges.start_element.parentNode.removeChild(styleChanges.start_element)
        }
        if (e.direction === 'REVERSE') {
            styleChanges.start_element.parentNode.removeChild(styleChanges.start_element)
            styleChanges.parent_element.appendChild(styleChanges.start_element)
            styleChanges.start_element.style = ''
            styleChanges.start_element.querySelectorAll('.not-move').forEach(e => e.style = '')
        }
    })
    .setOnScroll(e => {
        styleChanges.start_element.setAttribute('style', '')
        styleChanges.start_element.style.position = 'fixed'
        styleChanges.start_element.style.zIndex = 100

        styleChanges.list_elements.forEach(elm => {
            let style_string = ''

            if (elm === styleChanges.start_element) {
                style_string += 'position: fixed; z-index: 100;'
            }

            styleChanges.list_styles.forEach(entry => {
                if (entry.start_element === elm) {
                    style_string += `${entry.style}: ${entry.start - (entry.start - entry.end) *  e.progress}px;`
                }
            })

            elm.setAttribute('style', style_string)

        })
    })
    .do()
}
