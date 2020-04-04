import { fix_menu } from "./fix-menu";
import { transforming_element } from './animateMoveOnScroll'

import '../sass/t_panel.sass'


const menu = document.querySelector('#burger')

menu.addEventListener('click', (e) => {
    document.querySelector('.top-menu__main-item-group').classList.toggle('show-menu')
})

document.addEventListener('scroll', fix_menu)

const cloud_href = document.querySelector('#today-cloud img').getAttribute('src')

const t_panel = document.createElement('div')
t_panel.id = "today-panel"
t_panel.classList.add('today-panel')
t_panel.innerHTML = `
        <h6 class="today-panel__header">Сейчас:</h6>
        <div class="today-panel__element temperature">
            -5.5&deg;C
        </div>
        <div class="today-panel__element cloud">
            <img src="${cloud_href}" alt="cloudy" />
        </div>
`

document.querySelector('#screen-1').appendChild(t_panel)


// ----------Animation scroll--------------

transforming_element('#today-temp', '.today-panel .temperature', '#screen-1__temp', [{
    start_element: '#today-temp .today__temperature',
    end_element: '.today-panel .temperature',
    styles: ['font-size']
}] )

transforming_element('#today-cloud', '.today-panel .cloud', '#screen-1__cloud')

