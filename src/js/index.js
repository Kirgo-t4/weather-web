//header


const menu = document.querySelector('#burger')

menu.addEventListener('click', (e) => {
    document.querySelector('.top-menu__main-item-group').classList.toggle('show-menu')
})
