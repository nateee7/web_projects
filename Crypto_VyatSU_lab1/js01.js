let input_raw = ""
let input_words = [];
let unique_letters = [];
let key_table = {};
let reference_frequency = [
        { letter:"е", frequency:0.0845 },
        { letter:"а", frequency:0.0801 },
        { letter:"о", frequency:0.1097 },
        { letter:"и", frequency:0.0765 },
        { letter:"н", frequency:0.0670 },
        { letter:"т", frequency:0.0626 },
        { letter:"с", frequency:0.0547 },
        { letter:"р", frequency:0.0473 },
        { letter:"в", frequency:0.0454 },
        { letter:"л", frequency:0.0440 },
        { letter:"к", frequency:0.0349 },
        { letter:"м", frequency:0.0321 },
        { letter:"д", frequency:0.0298 },
        { letter:"п", frequency:0.0281 },
        { letter:"у", frequency:0.0262 },
        { letter:"я", frequency:0.0201 },
        { letter:"ы", frequency:0.0190 },
        { letter:"ь", frequency:0.0174 },
        { letter:"г", frequency:0.0170 },
        { letter:"з", frequency:0.0165 },
        { letter:"б", frequency:0.0159 },
        { letter:"ч", frequency:0.0144 },
        { letter:"й", frequency:0.0121 },
        { letter:"х", frequency:0.0097 },
        { letter:"ж", frequency:0.0094 },
        { letter:"ш", frequency:0.0073 },
        { letter:"ю", frequency:0.0064 },
        { letter:"ц", frequency:0.0048 },
        { letter:"ш", frequency:0.0036 },
        { letter:"э", frequency:0.0032 },
        { letter:"ф", frequency:0.0026 }
    ];
let amount_letters = 0;
let tool = 0;   // 1 = a, 2 = b, 3 = c

function parse_words() {
    input_words = [];
    input_raw = document.getElementById("input_01").value;
    let inp = input_raw;
    // 12 32 31 45 32     23     12 43 12    233

    let buf = "", word = [], spaceWas = false;
    inp += '     ';
    for (let i = 0; i < inp.length; i++) {
        if (inp[i] != ' ' && inp[i] != ',' && inp[i] != '.') {
            buf += inp[i];
            spaceWas = false;
        }
        else if (inp[i] == ' ' && !spaceWas) {
            spaceWas = true;
            word.push(buf);
            buf = "";
        }
        else if (inp[i] == ' ' && spaceWas || (inp[i] == ',' || inp[i] == '.')) {
            if (inp[i] == ',' || inp[i] == '.') {
                word.push(buf);
                input_words.push(word);
                input_words.push(inp[i]);
                spaceWas = true;
               // console.log("buf = " + buf + "; word = " + word);
            }
            else if (word.length != 0) {
                input_words.push(word);
                // 12 32, 34 3 3 4     434   43. 232 3
            }
            word = [];
            buf = "";
        }
    }
}

function add_letter(i, letter) {
    if (letter != '~' && letter != ',' && letter != '.')
        document.getElementById("letters").innerHTML +=
            `<button
                id=btn_letter_${i}
                onclick="func_05(document.getElementById(\'btn_letter_${i}\').innerHTML)" >${letter}</button>`;
    else if (letter == ',' || letter == '.')
        document.getElementById("letters").innerHTML += `<h4>${letter}</h4>`;
    else
        document.getElementById("letters").innerHTML += `                     `;

}

function show_words() {
    let cnt = 0;
    document.getElementById("letters").innerHTML = ``;
    for (let i = 0; i < input_words.length; i++) {
        for (let j = 0; j < input_words[i].length; j++) {
            add_letter(cnt, input_words[i][j]);
            console.log(i + ", " + j + ", " + cnt + ", " + input_words[i][j]);
            cnt++;
        }
        add_letter(0, '~');
    }
}

function find_unique_letters() {
    unique_letters = [];
    for (let i = 0; i < input_words.length; i++) {
        for (let j = 0; j < input_words[i].length; j++) {
            if (!unique_letters.includes(input_words[i][j]))
                unique_letters.push(input_words[i][j]);
        }
    }
}

function update_key_table() {
    //key_table = [];
    for (let i = 0; i < unique_letters.length; i++) {
        const pair = {};
        pair.number = unique_letters[i];
        pair.letter = '?';
        pair.frequency = NaN;
        key_table[i] = pair;
    }
}

function count_letters() {
    amount_letters = 0;
    for (let i = 0; i < input_words.length; i++) {
        amount_letters += input_words[i].length;
    }
}

function draw_key_table() {
    //update_key_table();
    let html = `<table id="key_table_html">`;
    html +=
    `<tr>
        <th>Число</th>
        <th>Буква</th>
        <th>Частота</th>
    </tr>`;
    for (let i = 0; i < unique_letters.length; i++) {
        html +=
        `<tr>
            <th>${key_table[i].number}</th>
            <th>${key_table[i].letter}</th>
            <th>${key_table[i].frequency}</th>
        </tr>`
    }
    html += `</table>`;
    //console.log("html: " + html);
    document.getElementById("key_table_div").innerHTML = html;
}

function count_frequency() {
    let buf = 0.0;
    // count letters:
    for (let i = 0; i < unique_letters.length; i++) {
        buf = 0;
        for (let j = 0; j < input_words.length; j++) {
            for (let k = 0; k < input_words[j].length; k++)
                if (input_words[j][k] == unique_letters[i])
                    buf++;
            //buf += input_words[j].includes(unique_letters[i]);
        }
        key_table[i].frequency = buf;
        //console.log(`amount(${unique_letters[i]})=${key_table[i].frequency}`);
    }

    // count frequency:
    for (let i = 0; i < unique_letters.length; i++) {
        //buf = unique_letters[i] / amount_letters;
        //key_table[i].frequency = buf;
        key_table[i].frequency = key_table[i].frequency / amount_letters;
        //console.log(`freq(${unique_letters[i]})=${key_table[i].frequency}`);
    }
}

function sort_key_table() {
    let buf = {}, max = 0.0, max_i;
    for (let i = 0; i < unique_letters.length; i++) {
        for (let j = i; j < unique_letters.length; j++) {
            if (key_table[j].frequency > max) {
                max = key_table[j].frequency;
                max_i = j;
            }
        }
        console.log(max + " at " + max_i + " for number " + key_table[max_i].number);

        buf = key_table[i];
        key_table[i] = key_table[max_i];
        key_table[max_i] = buf;

        max = 0.0, max_i = 0;
    }
}

function replace_letter_in_words(old_l, new_l) {
    for (let i = 0; i < input_words.length; i++) {
        for (let j = 0; j < input_words[i].length; j++) {
            if (input_words[i][j] == old_l)
                input_words[i][j] = new_l;
        }
    }
}

function replace_letter_in_key_table(old_l, new_l) {
    for (let i = 0; i < unique_letters.length; i++) {
        if (key_table[i].number == old_l || key_table[i].letter == old_l)
            key_table[i].letter = new_l;
    }
}

function set_letter(pos, letter) {
    key_table[pos].letter = letter;

    let buf = key_table[pos].number;
//    for (let i = 0; i < input_words.length; i++) {
//        if (key_table[i].letter == letter)
//    }

    for (let i = 0; i < input_words.length; i++) {
        for (let j = 0; j < input_words[i].length; j++) {
            if (input_words[i][j] == buf)
                input_words[i][j] = letter;
        }
    }
//    for (let i = 0; i < unique_letters.length; i++) {
//        if (key_table[i].number == pos)
//            key_table[i].letter = letter;
//    }
}

function func_01() {
    document.getElementById("btn_01").disabled = true;
    document.getElementById("div_01").innerHTML += `<label for="btn_02">Вежливо попросить машину рассчитать положения букв в соответствии с методом анализа:</label>
                               <button id="btn_02" type="button" onclick="func_02()">Рассчитать</button>
                               <br><br><br><br><br>
                               <div id="key_table_div"></div>
                               <br><br><br><br><br>
                               <label for="user_suggest">Заменить:</label>
                               <div id="user_suggest">
                                   <input type="text" placeholder="число" id="input_02_number" size="2">
                                   <input type="text" placeholder="буква" id="input_02_letter" size="2">
                                   <button type="button" id="btn_03" onclick="func_03()">Заменить</button>

                               </div>
                               <br><br><br><br><br>
                               <div id="toolkit">
                                       <input type="radio" id="radio1_a" name="radio1" value="Заменить букву"/>
                                       <label for="radio1_a">Заменить букву</label><br>
                                       <input type="radio" id="radio1_b" name="radio1" value="..."/>
                                       <label for="radio1_b">...</label><br>
                                       <input type="radio" id="radio1_c" name="radio1" value="..."/>
                                       <label for="radio1_c">...</label><br>

                                       <button type="button" onclick="func_04()">Выбрать</button>
                                   </div>

                               `;
    parse_words();
        console.log(input_words);
    find_unique_letters();
        console.log(unique_letters);
    update_key_table();
        console.log(key_table);
    show_words();
    count_letters();
        console.log(amount_letters);
    count_frequency();
    sort_key_table();
    draw_key_table();
}

function func_02() {
    let bot_let;
    document.getElementById("btn_02").disabled = true;
    for (let i = 0; i < unique_letters.length; i++) {
        bot_let = reference_frequency[i].letter;
        console.log(i + ', ' + bot_let);
        set_letter(i, bot_let);


        //replace_letter_in_words(i, bot_let);
        //replace_letter_in_key_table(i, bot_let);
        //replace_letter_in_words(bot_num, bot_let);
        //replace_letter_in_key_table(bot_num, bot_let);
    }

    show_words();
    draw_key_table();
}

function func_03() {
    let user_num = document.getElementById("input_02_number").value;
    let user_let = document.getElementById("input_02_letter").value;

    replace_letter_in_words(user_num, user_let);
    replace_letter_in_key_table(user_num, user_let);

    show_words();
    draw_key_table();
}

function func_04() {
    if (document.getElementById("radio1_a").checked) {
        tool = 1;
    }
}

function func_05(inp_value) {
    if (tool != 1)
        return;
    let new_value = "";
    new_value = prompt("Введите новое значение:");
    console.log(inp_value, " -> ", new_value);
    // 1 12 2    32 1 21    32 1 2

    replace_letter_in_words(inp_value, new_value);
    replace_letter_in_key_table(inp_value, new_value);

    show_words();
    draw_key_table();
}
