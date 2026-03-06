const dropdowns = document.querySelectorAll('.dropdown:not(.is-hoverable)');
const result_show_time = 2000;
const maxUint32 = 0xFFFFFFFF;

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        rnd_listener_result_main_image();
        rnd_listener_main_navigation();
        rnd_listener_cards();
        rnd_listener_tabs();
        rnd_listener_v_tabs()
        rnd_listener_message_close();
        rnd_listener_notification_close();
        rnd_listener_file_input();
        rnd_listener_change_separator();
        rnd_listener_submit();
        rnd_listener_visible_switch();
        rnd_listener_dropdown();
        rnd_listener_modal();

        rnd_listener_copy_function();

        setTimeout(auto_close_notification, 5000);
        auto_close_change();

        rnd_show_result_element();

        rnd_update_me();

        scroll_to_result();
    }, 0);
});


function rnd_scroll_after_save()
{
    const last_scroll_position = localStorage.getItem('lastScrollPosition');
    if (!last_scroll_position) {
        return;
    }
    let position_data = null
    try {
        position_data = JSON.parse(last_scroll_position);
    } catch (e) {
        return;
    }

    if (position_data.url !== location.href || Date.now() > position_data.timestamp + 5000) {
        return;
    }

    window.scroll(0, position_data.position);
}

function rnd_listener_modal() {
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            rnd_openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-close-button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            rnd_closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        const e = event || window.event;

        if (e.keyCode === 27) { // Escape key
            rnd_closeAllModals();
        }
    });
}


function rnd_openModal(el) {
    el.classList.add('is-active');
}

function rnd_closeModal(el) {
    if (!el.classList.contains('is-active')) {
        return;
    }

    let answer = true;
    if (el.dataset.onclose) {
        try {
            answer = eval(el.dataset.onclose);
        } catch (e) {}
    }

    if (answer) {
        el.classList.remove('is-active');
    }
}

function rnd_closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        rnd_closeModal($modal);
    });
}


function scroll_to_result() {
    let width = document.documentElement.clientWidth;
    if (width <= 768) {
        let result_scroll = document.getElementById('result_scroll');
        if (result_scroll) {
            result_scroll.scrollIntoView({behavior: "smooth"});
        }
    }
}

function rnd_update_me() {
    let alpha = document.getElementById('alpha');
    if (alpha) {
        alpha.addEventListener('click', function() {
            let p = ['bWFpbHRvOg==', 'c3VwcG9ydA==', 'QA==', 'cmFuZG9tdXMucnU='];
            let beta = document.getElementById('beta');
            let beta_descript = document.getElementById('beta_decript');
            beta.href = p.map(atob).join('');
            beta.textContent = p.slice(1).map(atob).join('');
            beta_descript.classList.remove('is-hidden');
            alpha.remove();
        });
    }
}

function rnd_listener_result_main_image() {
    let img = document.getElementById('result_main_image');
    if (!img) {
        return false;
    }
    let test_img = new Image();
    test_img.src = img.src;
    test_img.onload = function () {
        img.classList.remove('fade');
    }
}

function rnd_listener_main_navigation() {
    let navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if (navbarBurgers.length > 0) {
        navbarBurgers.forEach(function (el) {
            el.addEventListener('click', function () {
                let target = el.dataset.target;
                let target_obj = document.getElementById(target);
                el.classList.toggle('is-active');
                target_obj.classList.toggle('is-active');
            });
        });
    }
}

function rnd_listener_cards() {
    // Allow all cards content and footers to be collapsed
    let cardItems = Array.prototype.slice.call(document.querySelectorAll('.card-header-icon'), 0);
    if (cardItems.length > 0) {
        cardItems.forEach(function (el) {
            el.addEventListener('click', () => {
                let card = el.parentElement.parentElement;
                let content = card.querySelector('.card-content');
                let footer = card.querySelector('.card-footer');
                if (content !== undefined) {
                    content.classList.toggle('is-hidden');
                }
                if (footer !== undefined) {
                    footer.classList.toggle('is-hidden');
                }
            });
        });
    }
}

function rnd_listener_tabs() {
    let tabItems = Array.prototype.slice.call(document.querySelectorAll('.tabs > ul > li'), 0);
    if (tabItems.length > 0) {
        tabItems.forEach(function (el) {
            let tabs_div = el.parentElement.parentElement;
            let tabs_name = null;
            let restore_state = false;
            let active_tab = null;
            if (tabs_div.classList.contains('save-state')) {
                tabs_name = tabs_div.dataset.tabsname;
                active_tab = localStorage.getItem(`active_tab_${tabs_name}`);
                restore_state = localStorage.getItem(`save_state_${tabs_name}`) === '1';
            } else {
                tabs_div = null;
            }

            el.addEventListener('click', () => {
                let target = document.getElementById(el.dataset.target);
                if (!target) {
                    return;
                }

                if (tabs_name) {
                    localStorage.setItem(`active_tab_${tabs_name}`, el.dataset.target);
                }

                let new_url = el.dataset.newurl;
                if (new_url) {
                    history.pushState({'url': new_url}, '', new_url);
                }

                let currentActive_li = el.parentElement.querySelector('.is-active');
                let currentTarget_li = document.getElementById(currentActive_li.dataset.target);

                // Hide current tab and make current tab header not active
                currentTarget_li.classList.toggle('is-hidden');
                currentActive_li.classList.toggle('is-active');

                // Highlight new tab and show content
                el.classList.toggle('is-active');
                target.classList.toggle('is-hidden');
            });

            if (restore_state) {
                if (el.dataset.target) {
                    if (active_tab === el.dataset.target) {
                        let event_click = new Event('click');
                        el.dispatchEvent(event_click);
                    }
                }
            }

        });
    }
    rnd_save_active_tab_init();
}

function rnd_listener_sticky() {
    function handleButtonInterSection(entries) {
        entries.forEach((entry) => {
            let stick_container = entry.target.querySelector('.rnd-sticky-control');
            if (!entry.isIntersecting) {
                let stick_container_width = document.getElementById('settings_container').offsetWidth;
                if (stick_container_width > 0) {
                    stick_container.style.width = `${stick_container_width}px`;
                }
            } else {
                stick_container.style.width = 'unset';
            }
            stick_container.classList.toggle(FIXED_CLASS_NAME, !entry.isIntersecting);
        });
    }
    const FIXED_CLASS_NAME = "rnd-fixed-control";
    const buttons = Array.prototype.slice.call(document.querySelectorAll(".rnd-sticky-control"));
    // let intersectionObservers = [];

    buttons.forEach( (button) => {
        let container = button.parentElement;
        let intersectionObserver = new IntersectionObserver(
            handleButtonInterSection,
            {
                threshold: 0
            }
        );
        intersectionObserver.observe(container);
    });
}

function rnd_save_active_tab_init() {
    let tabItems = Array.prototype.slice.call(document.querySelectorAll('.tabs.save-state'), 0);
    if (tabItems.length > 0) {
        tabItems.forEach(function (tabs_div) {
            let tabs_name = tabs_div.dataset.tabsname;
            if (!tabs_name) {
                return;
            }

            tabs_div.classList.add('is-align-items-baseline');
            let switch_el = document.createElement('div');
            switch_el.classList.add('ml-4');
            let switch_id = `save_state_${tabs_name}`;
            let switch_el_state = localStorage.getItem(switch_id);
            let checked = '';
            if (switch_el_state === '1') {
                checked = "checked"
            }
            switch_el.innerHTML = `
                    <input id="${switch_id}" type="checkbox" class="switch is-small is-rounded is-link is-outlined" ${checked}>
                    <label for="${switch_id}">Запомнить вид</label>
            `;
            tabs_div.append(switch_el);
            switch_el.addEventListener('change', () => {
               let checkbox = document.getElementById(switch_id);
               if (checkbox) {
                   if (checkbox.checked) {
                       localStorage.setItem(switch_id, '1');
                   } else {
                       localStorage.setItem(switch_id, '0');
                   }
               }
            });


        });
    }
}

function rnd_listener_v_tabs() {
    // Special settings navigation
    let tabItems = Array.prototype.slice.call(document.querySelectorAll('.tabs-v > ul > li > a'), 0);
    if (tabItems.length > 0) {
        tabItems.forEach(function (el) {
            el.addEventListener('click', () => {
                let target = document.getElementById(el.dataset.target);
                let new_url = el.dataset.newurl;
                if (new_url) {
                    history.pushState({'url': new_url}, '', new_url);
                }

                let tabItems = Array.prototype.slice.call(document.querySelectorAll('.tabs-v > ul > li > a'), 0);
                tabItems.forEach(function (el) {
                    el.classList.remove('is-active');
                    let target = document.getElementById(el.dataset.target);
                    if (target) {
                        target.classList.add('is-hidden');
                    }
                });

                // Highlight new tab and show content
                el.classList.add('is-active');
                target.classList.remove('is-hidden');
            });
        });
    }
}

function rnd_listener_message_close() {
    // Message close button - hide message
    let messageItems = Array.prototype.slice.call(document.querySelectorAll('.message > .message-header > .delete'), 0);
    if (messageItems.length > 0) {
        messageItems.forEach(function (el) {
            el.addEventListener('click', () => {
                // Message block
                let message = el.parentElement.parentElement;
                message.classList.add('fade');
                setTimeout(function(el) {
                    el.classList.add('is-hidden');
                }, 500, message);
            });
        });
    }
}

function rnd_listener_notification_close() {
    // Notification close button - hide notification
    let notificationItems = Array.prototype.slice.call(document.querySelectorAll('.notification > .delete'), 0);
    if (notificationItems.length > 0) {
        notificationItems.forEach(function (el) {
            el.addEventListener('click', () => {
                // Notification block
                let notification = el.parentElement;
                notification.classList.add('fade');
                setTimeout(function(el) {
                    el.classList.add('is-hidden');
                }, 500, notification);
            });
        });
    }
}

function rnd_listener_file_input() {
    // File input
    let fileInput = Array.prototype.slice.call(document.querySelectorAll('.file.has-name > .file-label > .file-input'), 0);
    if (fileInput.length > 0) {
        fileInput.forEach(function (el) {
            el.addEventListener('change', () => {
                let fileName = el.parentElement.querySelector('.file-name');
                // add file name
                fileName.innerHTML = el.files[0].name;
            });
        });
    }
}

function rnd_listener_change_separator() {
    /**
     * Смена разделителя в текстовых результатах
     * .with_numeral - для поля ввода
     * data-label - id текстовой метки в атрибутах поля
     * data-titles - перечень склонений в атрибутах метки
     */
    let number_inputs = Array.prototype.slice.call(document.querySelectorAll('.with_numeral'), 0);
    let event_input = new Event("input");
    if (number_inputs.length > 0) {
        number_inputs.forEach(function (el) {
            el.addEventListener('input', () => {
                let label = document.getElementById(el.dataset.label);
                if (label) {
                    let titles = label.dataset.titles;
                    if (titles) {
                        label.textContent = literal(el.value, titles.split(','))
                    } else {
                        label.textContent = literal(el.value);
                    }
                }
            });
            el.dispatchEvent(event_input);
        });
    }
}

function rnd_listener_submit() {
    // Submit event
    let fromItems = Array.prototype.slice.call(document.getElementsByTagName('form'), 0);
    if (fromItems.length > 0) {
        fromItems.forEach(function (el) {
            if (el.dataset.noloader) {
                return;
            }
            el.addEventListener('submit', () => {
                show_loader(el.dataset.loadtext);
                if (el.dataset.saveposition) {
                    localStorage.setItem(
                        'lastScrollPosition',
                        JSON.stringify({
                            position: window.scrollY,
                            timestamp: Date.now(),
                            url: location.href
                            }
                        )
                    );
                }
                return true;
            });
        });
    }
}

function rnd_listener_dropdown() {
    if (dropdowns.length > 0) {
        // For each dropdown, add event handler to open on click.
        dropdowns.forEach(function(el) {
            el.addEventListener('click', function(e) {
                let already_open= el.classList.contains('is-active');
                closeDropdowns();
                e.stopPropagation();
                if (!already_open) {
                    el.classList.toggle('is-active');
                }
            });
        });

        // If user clicks outside dropdown, close it.
        document.addEventListener('click', function(e) {
            closeDropdowns();
        });
    }

    if (dropdowns) {
        document.addEventListener('click', function (e) {
            closeDropdowns();
        });
    }
}

function rnd_listener_visible_switch() {
    // Show elements by button
    let switchItems = Array.prototype.slice.call(document.querySelectorAll('.visible-switch'), 0);
    if (switchItems.length > 0) {
        switchItems.forEach(function (el) {
            if (el.dataset.target) {
                el.addEventListener('click', () => {
                    switch_visible(el.dataset.target);
                    //el.classList.toggle('is-active');
                    return true;
                });
            }
        });
    }
}

function rnd_listener_copy_function() {
    if (typeof(tippy) === 'undefined') {
        return;
    }

    const copy_text_before = 'Копировать';
    const copy_text_after = 'Скопировано';

    tippy('a.copy_button',
        {
            content: '',
            trigger: 'manual',
            theme: 'material',
            duration: [350, 100]
        }
    );

    tippy('div.copy_button',
        {
            content: copy_text_before,
            theme: 'material',
            followCursor: 'horizontal',
            duration: [350, 100],
            delay: [250, 0]
        }
    );

    tippy('b.copy_button',
        {
            content: '',
            trigger: 'manual',
            theme: 'material',
            duration: [350, 100]
        }
    );

    var clipboard = new ClipboardJS('.copy_button');
    clipboard.on('success', function (e) {
        e.clearSelection();
        e.trigger._tippy.setContent(copy_text_after);
        e.trigger._tippy.show();
        setTimeout(() => {
            e.trigger._tippy.hide()
        }, 1000);
        setTimeout(() => {
            e.trigger._tippy.setContent(copy_text_before)
        }, 1500);
    });

}

function closeDropdowns() {
    dropdowns.forEach(function(el) {
        el.classList.remove('is-active');
    });
}

function show_loader(message) {
    if (message) {
        let modaltext = document.getElementById('modal_text');
        modaltext.textContent = message;
    }
    let modal_items = Array.prototype.slice.call(
        document.querySelectorAll(
            '.rand-modal-cover, .rand-modal-modal, .rand-modal-content'
        ),
        0
    );
    modal_items.forEach(function (el) {
        el.classList.remove('is-hidden');
    });
}


function switch_visible(element, forcibly='') {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        if (!element.classList.contains('switch_element')) {
            if (forcibly === 'show') {
                element.classList.remove('is-hidden');
            } else if (forcibly === 'hide') {
                element.classList.add('is-hidden');
            } else {
                element.classList.toggle('is-hidden');
            }
            return true;
        } else {
            if ((element.classList.contains('is-hidden') || forcibly === 'show') && forcibly !== 'hide') {
                element.classList.remove('is-hidden');
                setTimeout(function(el) {
                    el.classList.remove('fade');
                }, 5, element);
            } else if ((!element.classList.contains('is-hidden') || forcibly === 'hide') && forcibly !== 'show') {
                element.classList.add('fade');
                setTimeout(function(el) {
                    el.classList.add('is-hidden');
                }, 500, element);
            }
            return true;
        }
    }
}

function hide_loader() {
    let modal_items = Array.prototype.slice.call(
        document.querySelectorAll(
            '.rand-modal-cover, .rand-modal-modal, .rand-modal-content'
        ),
        0
    );
    modal_items.forEach(function (el) {
        el.classList.add('is-hidden');
    });
}

/**
 * Смена разделителя в текстовых результатах
 */
function change_separator(select) {
    const separators = [', ', '; ', ',', ';', ' ', '\n', '\t', '\n', '\n'];
    let textarea = document.getElementById('result_textarea');
    let num_list = textarea.dataset.numbers.split(',');
    if (select.value == 7) {
        num_list.forEach(function (item, i, arr) {
            arr[i] = item.split(' ').join('\t');
        });
    }
    if (select.value == 8) {
        num_list.forEach(function (item, i, arr) {
            arr[i] = `- ${item}`;
        });
    }

    textarea.textContent = num_list.join(separators[select.value]);
}


function literal(number, titles = ['число', 'числа', 'чисел']) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

/**
 * Меняем ограничения на количество чисел
 * в зависимости от других параметров
 */
function change_max_count() {
    let maxcount = document.getElementById('max_count').value;
    if (document.getElementById('num_norepeat').checked) {
        let from = document.getElementById('num_from').value;
        let to = document.getElementById('num_to').value;
        if (to == '') {
            to = from;
        }
        if (to != '') {
            maxcount = Math.min(Math.max(from, to) - Math.min(from, to) + 1, maxcount);
        }
    }
    document.getElementById('num_count').setAttribute('max', maxcount);
}

/**
 * Управление активностью поля даты и времени розыгрыша ВК
 */
function auto_close_change() {
    let auto_close = document.getElementById('auto_close');
    if (auto_close) {
        let date_close = document.getElementById('date_close');
        if (document.getElementById('auto_close').checked) {
            date_close.removeAttribute("disabled");
        } else {
            date_close.setAttribute("disabled", "disabled");
        }
    }
}


/**
 * Закрывает все уведомления с соответствующим классом
 */
function auto_close_notification() {
    let notifications = Array.prototype.slice.call(document.querySelectorAll('.auto-close-notification'), 0);
    if (notifications.length > 0) {
        notifications.forEach(function (el) {
            el.classList.add('fade');
            setTimeout(function(el) {
                el.classList.add('is-hidden');
            }, 500, el);
        });
    }
}

function rnd_show_element(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        element.classList.remove('is-hidden');
    }
}

function rnd_hide_element(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        element.classList.add('is-hidden');
    }
}

function rnd_show_result_element() {
    let time_delay = 100;

    let results_elements = document.querySelectorAll('div.result_element');
    let max_width = Array.from(results_elements).reduce(
        (accumulator, item) => Math.max(item.offsetWidth, accumulator),
        0
    );
    Array.from(results_elements).forEach(function (el) {
        el.style.minWidth = `${max_width}px`;
    });

    results_elements = document.querySelectorAll('.result_element');
    if (results_elements.length > 0) {
        let show_delay = result_show_time / results_elements.length;
        results_elements.forEach(function (el) {
            setTimeout((el) => {
                el.classList.toggle('fade');
            }, time_delay, el);
            time_delay += show_delay;
        });
    }
}

function rnd_decode_data(data) {
    if (!data) {
        return '';
    }
    return decodeURIComponent(data.toString().replace(/\+/g,  " "));
}

function rnd_format_number(number, thinsp = false) {
    if (thinsp) {
        return new Intl.NumberFormat('ru-RU').format(number).replace(String.fromCharCode(160), '&thinsp;');
    }
    return new Intl.NumberFormat('ru-RU').format(number);
}

function rnd_format_file_size(size_of_bytes, out_format='kb', no_unit=false) {
    let unit = `&nbsp;${out_format.toUpperCase()}`;
    if (no_unit) {
        unit = '';
    }
    switch (out_format) {
        case 'mb':
            return self.rnd_format_number((size_of_bytes / 1024 / 1024).toFixed(2)) + unit;
        case 'kb':
            return self.rnd_format_number((size_of_bytes / 1024).toFixed(0)) + unit;
        default:
            return '-';
    }
}

/**
 * Устанавливает класс элемента в соответствии с условием
 * @param element Элемент или его ID
 * @param condition При true класс - удаляется, при false - устанавливается
 * @param changed_class Имя класса
 */
function rnd_toggle_class(element, condition, changed_class='is-hidden') {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (!element) {
        return;
    }
    if (condition) {
        element.classList.remove(changed_class);
    } else {
        element.classList.add(changed_class);
    }
}

function rnd_get_random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    if (min > max) {
        throw new Error('Значение min не может быть больше max');
    }

    const range = max - min + 1;
    const max_random = maxUint32 - (maxUint32 % range);
    let random_number;
    const array = new Uint32Array(1);

    do {
        window.crypto.getRandomValues(array);
        random_number = array[0];
    } while (random_number >= max_random);

    return min + (random_number % range);
}

function rnd_pad_left(number, length= 2, symbol= '0') {
    if (!number.isString) {
        number = number.toString();
    }
    return number.padStart(length, symbol);
}

function rnd_hex_to_hsl(HEX) {
    try {
        let r = 0, g = 0, b = 0;
        if (HEX.length == 4) {
            r = "0x" + HEX[1] + HEX[1];
            g = "0x" + HEX[2] + HEX[2];
            b = "0x" + HEX[3] + HEX[3];
        } else if (HEX.length == 7) {
            r = "0x" + HEX[1] + HEX[2];
            g = "0x" + HEX[3] + HEX[4];
            b = "0x" + HEX[5] + HEX[6];
        }
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            hue = 0,
            saturation = 0,
            lightness = 0;

        if (delta == 0)
            hue = 0;
        else if (cmax == r)
            hue = ((g - b) / delta) % 6;
        else if (cmax == g)
            hue = (b - r) / delta + 2;
        else
            hue = (r - g) / delta + 4;

        hue = Math.round(hue * 60);

        if (hue < 0)
            hue += 360;

        lightness = (cmax + cmin) / 2;
        saturation = delta == 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
        saturation = +(saturation * 100).toFixed(1);
        lightness = +(lightness * 100).toFixed(1);

        return {h: hue, s: saturation, l: lightness};
    } catch (e) {
        return false;
    }
}

function rnd_format_date(now) {

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timezoneOffsetMinutes = now.getTimezoneOffset();
    const offsetTotalMinutes = -timezoneOffsetMinutes; // Инвертируем знак, так как getTimezoneOffset возвращает обратное значение
    const offsetHours = Math.floor(Math.abs(offsetTotalMinutes) / 60);
    const offsetMinutes = Math.abs(offsetTotalMinutes) % 60;
    const offsetSign = offsetTotalMinutes >= 0 ? '+' : '-';

    let timezone = `UTC${offsetSign}${offsetHours}`;
    if (offsetMinutes !== 0) {
        timezone += `:${String(offsetMinutes).padStart(2, '0')}`;
    }

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds} ${timezone}`;
}
