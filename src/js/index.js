import { fix_menu } from "./fix-menu";
import { transforming_element } from './animateMoveOnScroll'

import '../sass/t_panel.sass'


const menu = document.querySelector('#burger')

// Переключение меню "бургер" в мобильной версии
menu.addEventListener('click', (e) => {
    document.querySelector('.top-menu__main-item-group').classList.toggle('show-menu')
})

// Фиксируем меню сверху, избегая его прокрутки
document.addEventListener('scroll', fix_menu)

const cloud_href = document.querySelector('#today-cloud img').getAttribute('src')

const t_panel = document.createElement('div')

// ----------Верхняя панель

t_panel.id = "today-panel"
t_panel.classList.add('today-panel')

const panel_header = document.createElement('h6')
panel_header.textContent = 'Сейчас: '

const t_panel_temp = document.createElement('div')
t_panel_temp.classList.add('today-panel__element')
t_panel_temp.classList.add('temperature')
t_panel_temp.textContent = document.querySelector('#today-temp .today__temperature').textContent

const t_panel_cloud = document.createElement('div')
t_panel_cloud.classList.add('today-panel__element')
t_panel_cloud.classList.add('cloud')
t_panel_cloud.innerHTML = `<img src="${cloud_href}" alt="cloudy" />`

const t_panel_press = document.createElement('div')
t_panel_press.classList.add('today-panel__element')
t_panel_press.classList.add('pressure')
t_panel_press.textContent = document.querySelector('#today-pressure .indicator__value').textContent

const t_panel_hum = document.createElement('div')
t_panel_hum.classList.add('today-panel__element')
t_panel_hum.classList.add('humidity')
t_panel_hum.textContent = document.querySelector('#today-humidity .indicator__value').textContent

const t_panel_wind = document.createElement('div')
t_panel_wind.classList.add('today-panel__element')
t_panel_wind.classList.add('wind')
t_panel_wind.innerHTML = document.querySelector('#today-wind .indicator__value').innerHTML

t_panel.appendChild(panel_header)
t_panel.appendChild(t_panel_temp)
t_panel.appendChild(t_panel_cloud)
t_panel.appendChild(t_panel_press)
t_panel.appendChild(t_panel_hum)
t_panel.appendChild(t_panel_wind)


document.querySelector('#screen-1').appendChild(t_panel)


// ----------Анимация при прокрутке--------------

transforming_element({
    start_selector: '#today-temp', 
    end_selector: '.today-panel .temperature', 
    trigger_selector: '.screen-1__section', 
    additional_styles: [{
        start_element: '#today-temp .today__temperature',
        end_element: '.today-panel .temperature',
        styles: ['font-size']
    }] 
})

transforming_element({
    start_selector: '#today-cloud', 
    end_selector: '.today-panel .cloud', 
    trigger_selector: '.screen-1__section'
})

transforming_element({
    start_selector: '#today-pressure .indicator__value' ,
    end_selector: '.today-panel .pressure', 
    trigger_selector: '.indicators', 
    additional_styles: [{
        start_element: '#today-pressure .indicator__value',
        end_element: '.today-panel .pressure',
        styles: ['font-size']
    }]
})

transforming_element({
    start_selector: '#today-humidity .indicator__value',
    end_selector: '.today-panel .humidity',
    trigger_selector: '.indicators',
    additional_styles: [{
        start_element: '#today-humidity .indicator__value',
        end_element: '.today-panel .humidity',
        styles: ['font-size']
    }]
})

transforming_element({
    start_selector: '#today-wind .indicator__value',
    end_selector: '.today-panel .wind',
    trigger_selector: '.indicators',
    additional_styles: [{
        start_element: '#today-wind .indicator__value',
        end_element: '.today-panel .wind',
        styles: ['font-size']
    }]
})





function setPanelAppearance({targetSelector, triggerSelector, OffsetY}) {
    const targetEl = document.querySelector(targetSelector)
    const trigEl = document.querySelector(triggerSelector)

    targetEl.style.opacity = '0'

    OffsetY = -1 * Math.abs(OffsetY)

    const callback = () => {
        const {y} = trigEl.getBoundingClientRect()
        targetEl.style.opacity = y > 0 ? '0' : '1'
        if ((y < 0) && (y > OffsetY)) {
            targetEl.style.transform = `scaleY(${ Math.abs(y) / Math.abs(OffsetY)})`
        }
        if (y < OffsetY) {
            targetEl.style.transform = ""
        }
    }

    document.addEventListener('scroll', callback)

    return callback
}

setPanelAppearance({
    targetSelector: '.today-panel',
    triggerSelector: '.screen-1__section',
    OffsetY: 20 
})


