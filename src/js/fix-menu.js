const header = document.querySelector('.top-menu')
const main = document.querySelector('#screen-1')
let menu_height = header.getBoundingClientRect().height


export const fix_menu = () => {
    if (window.pageYOffset) {
        header.classList.add('fixed')
        main.style.paddingTop = menu_height + 'px'
    } else {
        header.classList.remove('fixed')
        main.style.paddingTop = ''
    }
}

