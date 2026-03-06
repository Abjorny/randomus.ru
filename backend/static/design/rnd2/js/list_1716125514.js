let list_control;

class ListControl {
    constructor(prefix = 'list') {
        this.count_data = document.getElementById('count');
        this.list_input = document.getElementById('text_data');
        this.protocol_input = document.getElementById('protocol_textarea');
        this.save_list_checkbox = document.getElementById('save_list');
        this.no_counter_checkbox = document.getElementById('no_counter');
        this.remove_winners_checkbox = document.getElementById('remove_winners');

        this.main_list = [];
        this.no_duplicate_list = [];
        this.last_results = [];
        this.duplicate = false;
        this.save_list = false;

        this.last_ad_reload = Date.now();

        this.list_storage_name = `${prefix}_mainlist`;
        this.protocol_storage_name = `${prefix}_protocol`;
        this.save_list_storage_name = `${prefix}_save_list`;

        if (JSON.parse(localStorage.getItem(this.save_list_storage_name))) {
            this.save_list_checkbox.checked = true;
            this.save_list = true;
        }

        if (this.save_list) {
            this.list_input.value = localStorage.getItem(this.list_storage_name);
        }
        if (this.protocol_input && this.protocol_storage_name) {
            this.protocol_input.value = localStorage.getItem(this.protocol_storage_name);
        }

        this.update_main_list();
        this.update_list_counter();
        this.update_menu_item();
        this.update_max_count();
    }

    update_save_list() {
        if (this.save_list_checkbox && !this.save_list_checkbox.checked) {
            localStorage.removeItem(this.list_storage_name);
            this.save_list = false;
        } else {
            localStorage.setItem(this.list_storage_name, this.list_input.value);
            this.save_list = true;

        }
        localStorage.setItem(this.save_list_storage_name, this.save_list)
    }

    get_result(to, count, norepeat, sort, self = this) {
        let xhr = new XMLHttpRequest();
        let url = `/quick?from=0&to=${to}&count=${count}&norepeat=${norepeat}&sort=${sort}&json=1`
        xhr.open('GET', url);
        xhr.send();
        xhr.onload = function () {
            if (xhr.status !== 200) {
                self.update_status(false, self);
            } else {
                self.update_status(JSON.parse(xhr.response), self);
            }
        };
        xhr.onerror = function () {
            self.update_status(false, self);
        };
    };

    get_fakelist(add_double = 0) {
        let self = this;
        let xhr = new XMLHttpRequest();
        let url = `/name?type=2&sex=10&count=100&json=1`
        xhr.open('GET', url);
        xhr.send();
        xhr.onload = function () {
            if (xhr.status !== 200) {
                self.load_list(false, self);
            } else {
                self.load_list(JSON.parse(xhr.response), add_double, self);
            }
        };

        xhr.onerror = function () {
            self.update_status(false, self);
        };
    }

    get_numbers_from_range() {
        let str_range = prompt(
            'Укажите диапазон чисел в формате "от-до". До 1 000 000 записей.\nТекущий список будет очищен.',
            '1-100'
        );
        if (!str_range) {
            return;
        }

        let param = str_range.split('-');
        if (param.length <= 0 && param.length > 2) {
            return;
        }
        let from, to;
        if (param.length === 1) {
            from = 1;
            to = Math.round(Number(param[0]));
        } else {
            from = Math.round(Number(param[0]));
            to = Math.round(Number(param[1]));
        }
        if (isNaN(from) || isNaN(to)) {
            return;
        }
        if (from > to) {
            return;
        }
        if (to - from > 1000000) {
            to = from + 999999;
        }

        let result = [];
        for (let number = from; number <= to; number++) {
            result.push(number);
        }
        if (this.list_input && result) {
            this.list_input.value = result.join('\n');
            this.update_main_list();
        }
    }

    load_list(result, add_double, self = this) {
        if (result) {
            if (result.status === 'ok') {
                if (add_double) {
                    this.list_input.value = result.result.concat(result.result.slice(0, add_double)).join('\n');
                } else {
                    this.list_input.value = result.result.join('\n');
                }
                self.update_main_list();
                return;
            }
        }
        this.list_input.value = 'ошибка получения данных'
    }

    update_status(result, self = this) {
        self.clear_result();
        if (result) {
            if (result.status === 'ok') {
                rnd_hide_element('info_box');
                rnd_hide_element('error_box');
                rnd_show_element('result_box');
                document.getElementById('timestamp_label').textContent = result.timestamp;
                self.show_result(result.result);
                self.add_last_result_to_protocol(self);
                if (self.remove_winners_checkbox) {
                    let remove_winners = self.remove_winners_checkbox.value;
                    if (remove_winners == 0) {
                        self.clear_list_switch(true);
                    } else {
                        self.clear_list(remove_winners == 2);
                    }
                }
            } else if (result.status === 'error') {
                self.show_error(result.detail);
            }
        } else {
            self.show_error('Мы не смогли получить данные от сервера.')
        }
        hide_loader();
    }

    load_list_to_field(list_data) {
        this.list_input.value = list_data.join('\n');
        this.update_main_list();
    }

    sorting_list(reverse = false) {
        if (!this.main_list) {
            return;
        }
        if (reverse) {
            this.load_list_to_field(this.main_list.sort().reverse());
        } else {
            this.load_list_to_field(this.main_list.sort());
        }

    }

    remove_duplicate() {
        this.load_list_to_field(this.no_duplicate_list);
    }

    update_list_counter() {
        let no_counter = this.no_counter_checkbox.checked ? 1 : 0;
        let counter = document.getElementById('count_label');
        let send_button = document.getElementById('send_button');

        if (no_counter) {
            counter.innerHTML = 'Управление';
        } else {
            let add_str = (this.duplicate) ? `, ${this.duplicate} ${literal(this.duplicate, ['повтор', 'повтора', 'повторов'])}` : '';
            counter.innerHTML =
                `<strong>${rnd_format_number(this.main_list.length)}</strong> ${literal(this.main_list.length, ['запись', 'записи', 'записей'])}${add_str}`;
        }

        if (this.main_list.length) {
            send_button.removeAttribute('disabled');
        } else {
            send_button.setAttribute('disabled', '1');
        }
    }

    list_generate() {
        this.update_main_list();
        if (Date.now() - this.last_ad_reload > 30 * 1000) {
            this.last_ad_reload = Date.now();
            try {
                ad_reload();
            } catch {
            }
        }
        if (this.main_list.length) {
            let no_repeat = document.getElementById('norepeat').checked ? 1 : 0;
            setTimeout(() => this.get_result(
                this.main_list.length - 1,
                this.count_data.value,
                no_repeat,
                0
            ), 750, this);
        }
    };

    add_last_result_to_protocol(self = this) {
        if (!self.protocol_storage_name) {
            return;
        }

        let out_text = `# ${document.getElementById('timestamp_label').innerText}\n`;
        if (!this.no_counter_checkbox.checked) {
            out_text += `# Строк в списке: ${this.main_list.length}\n` ;
        }
        let result_value = [];
        self.last_results.forEach((item) => {
            result_value.push(item.value);
        });

        out_text += `# Победителей: ${result_value.length}\n`;
        out_text += result_value.join(', ');
        out_text += '\n\n';
        self.protocol_input.value += out_text;
        localStorage.setItem(this.protocol_storage_name, self.protocol_input.value);
    }

    update_main_list() {
        this.clear_list_switch(false);
        this.main_list = this.list_input.value.split(`\n`).map(e => e.trim()).filter(e => e);

        this.no_duplicate_list = Array.from(new Set(this.main_list));

        this.duplicate = this.main_list.length - this.no_duplicate_list.length;

        this.update_max_count();
        this.update_list_counter();
        this.update_menu_item();
        if (this.main_list.length < 50000 && this.save_list) {
            localStorage.setItem(this.list_storage_name, this.list_input.value);
        } else {
            localStorage.setItem(this.list_storage_name, '');
        }
    }

    update_menu_item() {
        if (this.main_list.length > 0) {
            document.getElementById('item_sort_down').classList.remove('dropdown-item-disable');
            document.getElementById('item_sort_up').classList.remove('dropdown-item-disable');
            document.getElementById('item_remove_duplicate').classList.remove('dropdown-item-disable');
            document.getElementById('item_clear_list').classList.remove('dropdown-item-disable');
        } else {
            document.getElementById('item_sort_down').classList.add('dropdown-item-disable');
            document.getElementById('item_sort_up').classList.add('dropdown-item-disable');
            document.getElementById('item_remove_duplicate').classList.add('dropdown-item-disable');
            document.getElementById('item_clear_list').classList.add('dropdown-item-disable');
        }
    }

    update_max_count() {
        let max_count;
        let no_repeat = document.getElementById('norepeat');
        if (no_repeat) {
            if (no_repeat.checked) {
                max_count = Math.min(this.no_duplicate_list.length, Number(this.count_data.dataset.maxvalue));
            } else {
                max_count = this.count_data.dataset.maxvalue;
            }
        } else {
            max_count = Math.max(1, this.main_list.length);
        }
        this.count_data.setAttribute('max', max_count.toString());
    }

    show_result(result) {
        function sort_by_filed(field) {
            return (a, b) => a[field] > b[field] ? 1 : -1;
        }

        let str_result = '';
        let sort = document.getElementById('sorting').value;
        let lines = document.getElementById('lines').checked ? 1 : 0;

        this.last_results = [];
        result.forEach((item) => {
            this.last_results.push({line: item, value: this.main_list[item]});
        });

        switch (sort) {
            case '1':
                this.last_results.sort(sort_by_filed('line'));
                break;
            case '2':
                this.last_results.sort(sort_by_filed('value'));
        }

        for (let i = 0; i < this.last_results.length; i++) {
            str_result +=
                `<div class="result_items result_element fade copy_button" data-clipboard-text="${this.last_results[i].value}">
            <span class="result_items_serial is-size-7 has-text-grey-light">${i + 1}</span>            
            <span class="has-text-weight-bold is-size-4 is-size-5-mobile is-size-3-widescreen has-text-weight-bold">            
            ${this.last_results[i].value}
            </span>
            <span class="is-size-7 has-text-grey-light has-text-weight-normal is-family-monospace">${(lines) ? '/' + (this.last_results[i].line + 1) : ''}</span>                        
        </div>                                        
        </div>`;
        }

        document.getElementById('result_container').innerHTML = str_result;

        let results_elements = document.querySelectorAll('.result_element');
        let max_width = Array.from(results_elements).reduce(
            (accumulator, item) => Math.max(item.offsetWidth, accumulator),
            0
        );
        Array.from(results_elements).forEach(function (el) {
            el.style.minWidth = `${max_width}px`;
        });


        document.getElementById('result_box').scrollIntoView({behavior: "smooth"});
        document.getElementById('separator_select').value = 5;
        let text = document.getElementById('result_textarea');
        let result_values = this.last_results.map((item) => {
            return item.value
        });
        text.innerHTML = result_values.join('\n');
        text.dataset.numbers = result_values.join(',')
        rnd_listener_copy_function();
        rnd_show_result_element();
    }

    clear_list(with_duplicate = false, scroll = false) {
        let result_indexes = this.last_results.map((item) => {
            return item.line
        });
        if (with_duplicate) {
            let check_list = this.main_list.filter((item, index) => {
                return result_indexes.includes(index);
            });
            this.main_list = this.main_list.filter((item, index) => {
                return !check_list.includes(item);
            });
        } else {
            this.main_list = this.main_list.filter((item, index) => {
                return !result_indexes.includes(index)
            });
        }
        this.load_list_to_field(this.main_list);
        if (scroll) {
            document.documentElement.scrollTo({top: 0, behavior: "smooth"});
        }
    }

    clear_list_switch(on = true) {
        let clear_list_div = document.getElementById('clear_list');
        if (on) {
            clear_list_div.classList.remove('is-hidden');
        } else {
            clear_list_div.classList.add('is-hidden');
        }
    }

    clear_protocol() {
        if (!this.protocol_storage_name) {
            return;
        }
        if (confirm('Очистить протокол? Это действие нельзя отменить')) {
            document.getElementById('protocol_textarea').value = '';
            localStorage.setItem(this.protocol_storage_name, '');
        }
    }

    clear_result() {
        document.getElementById('result_container').innerHTML = '';
    }

    show_error(message) {
        document.getElementById('error_detail').textContent = message;
        document.getElementById('error_detail').scrollIntoView({behavior: "smooth"});
        rnd_hide_element('result_box');
        rnd_show_element('error_box');
    }

}

function create_list_object() {
    list_control = new ListControl();
}
