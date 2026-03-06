let split_control;

class SplitControl extends ListControl
{
    constructor(prefix = 'split') {
        super(prefix);
        this.split_type = 'into';
        this.protocol_storage_name = null;
    }


    get_result(split_count, self = this) {
        let result = {
            groups: [],
            ungrouped: false
        }
        let base_count = split_count;
        let equal_amount = document.getElementById('equal_amount').checked ? 1 : 0;
        switch (self.split_type) {
            case 'by':
                equal_amount = true;
                split_count = Math.trunc(self.main_list.length / split_count)
                break;
            case 'into':
                base_count = Math.trunc(self.main_list.length / split_count);
                break;
        }

        let shuffled_list = self.main_list.slice();
        shuffled_list.sort((a, b) => crypto.getRandomValues(new Int8Array(1))[0]);


        for (let index = 0; index < split_count; index++) {
            result.groups[index] = shuffled_list.splice(0, base_count);
        }
        if (shuffled_list.length > 0) {

            if (equal_amount) {
                result.ungrouped = shuffled_list;
            } else {
                let index = 0;
                while (shuffled_list.length > 0) {
                    result.groups[index].push(shuffled_list.shift());
                    index++;
                }
            }
        }

        let xhr = new XMLHttpRequest();
        let url = `/quick?from=0&to=1&count=1&norepeat=0&sort=0&json=1`
        xhr.open('GET', url);
        xhr.send();
        xhr.onload = function () {
            if (xhr.status !== 200) {
                self.update_status(false, self)
            } else {
                let res = JSON.parse(xhr.response);
                res.result = result;
                self.update_status(res, self);
            }
        };

        xhr.onerror = function () {
            self.update_status(false, self);
        };
    }

    split() {
        this.update_main_list();
        if (Date.now() - this.last_ad_reload > 30 * 1000) {
            this.last_ad_reload = Date.now();
            try {
                ad_reload();
            } catch {
            }
        }
        if (this.main_list.length) {
            setTimeout(() => this.get_result(this.count_data.value), 750, this);
        }
    }

    show_result(result) {
        let str_result = '';
        let sort = document.getElementById('sorting').value;
        let serial_number = document.getElementById('serial_number').checked ? 1 : 0;

        switch (sort) {
            case '2':
                result.groups.forEach((item) => {
                    item.sort();
                });
                break;
        }

        if (result.ungrouped) {
            result.groups.push(result.ungrouped)
        }

        let text_result = '';
        for (let group_index = 0; group_index < result.groups.length; group_index++) {
            let is_ungrouped = result.ungrouped && group_index == result.groups.length - 1;
            let group_name = '';
            if (is_ungrouped) {
                group_name = 'Не распределены';
            } else {
                group_name = `${group_index + 1} группа`;
            }
            text_result += `${group_name}\r\n`;

            str_result +=
                `<div class="card mr-5 mb-5 result_element fade">
            <header class="card-header">
            <p class="card-header-title">${group_name}</p>
            <a class="button card-header-icon copy_button mt-1" data-clipboard-text="${result.groups[group_index].join('\r\n')}">
                <span class="icon is-small has-text-grey"> 
                    <i class="far fa-copy"></i>
                 </span>
            </a>
            </header>
            <div class="card-content"><ul>`;
            for (let item_index = 0; item_index < result.groups[group_index].length; item_index++) {
                str_result += `<li>`;
                if (serial_number && !is_ungrouped) {
                    str_result += `${item_index + 1}. `;
                    text_result += `${item_index + 1}. `;
                }
                str_result += `${result.groups[group_index][item_index]}</li>`;
                text_result += `${result.groups[group_index][item_index]}\r\n`;
            }
            str_result +=
                `</ol>                                                            
            </div>
            </div>`;
            text_result += `\r\n`;
        }


        document.getElementById('result_container').innerHTML = str_result;
        document.getElementById('result_box').scrollIntoView({behavior: "smooth"});
        document.getElementById('separator_select').value = 5;
        let text = document.getElementById('result_textarea');
        text.innerHTML = text_result.trim();
        rnd_listener_copy_function();
        rnd_show_result_element();
    }

    change_type(type) {
        let label = document.getElementById('split_label');
        let num_label = document.getElementById('num_label');
        label.classList.add('fade');

        setTimeout((self) => {
            switch (type) {
                // на n групп
                case 'into':
                    label.innerHTML = `Разделить на <a class="button is-small is-shadowless is-pulled-right has-text-weight-normal" onclick="split_control.change_type('by')">Разделить по</a>`;
                    document.getElementById('block_equal_amount').style.display = 'block';
                    num_label.dataset.titles = 'группу,группы,групп';
                    self.split_type = 'into';
                    break;
                // по n в группе
                case 'by':
                    label.innerHTML = `Разделить по <a class="button is-small is-shadowless is-pulled-right has-text-weight-normal" onclick="split_control.change_type('into')">Разделить на</a>`
                    document.getElementById('block_equal_amount').style.display = 'none';
                    num_label.dataset.titles = 'в группе,в группе,в группе';
                    self.split_type = 'by';
                    break;
            }
            document.getElementById('count').dispatchEvent(new Event('input'));
            label.classList.remove('fade');
        }, 400, this);
    }
}

function create_split_object() {
    split_control = new SplitControl();
}

