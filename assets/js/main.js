const error_container = document.querySelector('.error-page');
const loader_container = document.querySelector('.loader');
const wrapper_container = document.querySelector('#wrapper');
const time_left_range =  document.querySelector('.time_left_range');
const input_text = document.querySelector('.input-text');
const btn_start = document.querySelector('.btn-start');
const game_text_1 = document.querySelector('.game-text-1');
const game_text_2 = document.querySelector('.game-text-2');
const counter_numbers = document.querySelectorAll('.number span');
const scoreContainer = document.querySelector('.scoreContainer');
const currentScore = document.querySelector('.current-score');
const gameName = document.querySelector('.game-name');
const modalCard = document.querySelector('.modal-card');
const shadown = document.querySelector('.shadow');
const buttonCloseModal = document.querySelector('.modal-close-btn');
const buttonOpenModal = document.querySelector('.modal-open-btn');
const select_minutes = document.querySelectorAll('#select-minutes input');
const typppe_option = document.querySelector('#typppe_option');
const menu_game_statistic = document.querySelector('.menu-game-statistic');
const error_label = document.querySelector('.error_label');
const time_label = document.querySelector('.time_label');
const menu_game_toggle = document.querySelector('.menu-game-toggle');
const acurracy_label = document.querySelector('.acurracy_label');
const game_end_info_container = document.querySelector('.game_end_info_container');
const btn_save_best_score = document.querySelector('.btn-save');
const btn_try_again = document.querySelector('.btn-try-again');
const total_score_text = document.querySelector('.total-score');
const cpm_text = document.querySelector('.cpm');
const wpm_text = document.querySelector('.wpm');
const total_error = document.querySelector('.total_error');
const best_score = document.querySelector('.best_score');
const ranking_number = document.querySelector('.ranking_number');
const type_word_option = document.querySelector('.typppe-word');
const type_text_option = document.querySelector('.typppe-text');
const game_mode = document.querySelector('#game_mode');
const normal_mode = document.querySelector('.normal_mode');
const legend_mode = document.querySelector('.legend_mode');
const minute_setting_container = document.querySelector('.minute-setting');
const container_tipe_game = document.querySelector('.container-tip-game');
const game_counter_container = document.querySelector('.counter');
const first_time_label = document.querySelector('.time_label_first');

const GAME_UTIL = {
    time_left: 15,
    time_elapsed: 0,
    MAX_WIDTH_RANGE: 38,
    initial_width_range: 38,
    phrases: [
        'Valorize as pequenas conquistas.',
        'A contribuição de um professor na vida do aluno é indiscutível.',
        'A influência de bons professores ninguém consegue apagar.',
        'Faça mais do que simplesmente acreditar, tenha fé.',
        'Que sejamos os que promovem a paz.',
        'Não coloque limite em seus sonhos. Coloque fé.',
        'O melhor momento para amar é agora.',
        'Se não puder fazer tudo, faça tudo que puder.',
        'Para certas coisas não basta querer, é preciso batalhar!',
        'Olhe para cima, que é de lá que vem tua força!',
        'Você nunca será velho demais para sonhar um novo sonho.',
        'Cada minuto de vida é um minuto a menos, não um minuto a mais.',
        'Mal nascemos e já começamos a morrer.',
        'A melhor utilidade que se pode dar à vida é amar.',
        'Confio em Deus e colho os bons frutos que Ele reservou para a minha vida.',
        'A melhor expressão do amor é o tempo.',
        'Abandone suas dores, não a esperança em dias melhores.',
        'Quem tem um porquê enfrenta qualquer como.',
        'Grandes realizações são possíveis quando se dá importância aos pequenos começos.',
        'As coisas que realmente importam na vida custam zero.',
    ],
    words: [
        'Perspicaz',
        'recíproco',
        'Super Homem',
        'Progrmação',

    ],
    currentListPhrasesIndex: 0,
    CYCLE_TIME: 1000/24,
    DELAY_TIME: 1800,
    current_score: 0,
    total_score: 0,
    best_score: 0,
    time_limit: 15,
    time_initial: 15,
    game_times: [15,30, 60, 120, 180, 300],
    phrases_index: 0,
    characterTyped: 0,
    errors: 0,
    total_errors: 0,
    current_quote: '',
    timer: null,
    correct_char: 0,
    incorrect_char: 0,
    seconds_counter_label: 0,
    minutes_counter_label: 0,
    new_times: 0,
    max_error: 0,
    isGamingWithRange: false
}
const END_POINT = 'https://raw.githubusercontent.com/BaziotaBeans/word_quotes_json/master/data.json';

let update_counter = 0;
let words = [];
let quotes = [];
let isGaming = false;
let isLagendGameMode = false;

let alphabetic = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLowerCase().split('');

wrapper_container.style.display = 'none';

setTimeout(() => {
    loader_container.style.display = 'none';
    wrapper_container.style.display = 'flex';
}, 1000)


game_mode.addEventListener('change', () => {
    handleMinuteContainer(game_mode.checked);
    if (game_mode.checked){
        GAME_UTIL.time_left = GAME_UTIL.MAX_WIDTH_RANGE;
        GAME_UTIL.isGamingWithRange = true;
    }
    else{
        GAME_UTIL.time_left = GAME_UTIL.time_initial;
        GAME_UTIL.isGamingWithRange = false;
    }

})

normal_mode.addEventListener('click', () => {
    handleMinuteContainer(false);
});

legend_mode.addEventListener('click', () => {
    handleMinuteContainer(true);
});

type_word_option.addEventListener('click', ()=> {
    typppe_option.click();
});

type_text_option.addEventListener('click', () => {
    typppe_option.click();
});

typppe_option.addEventListener('change', ({ target }) => {
    
    if (target.checked) GAME_UTIL.phrases = quotes;
    else GAME_UTIL.phrases = words;
});


function handleMinuteContainer(flag){
    game_mode.click();
    minute_setting_container.style.display = `${flag ? 'none' : 'flex'}`;
    isLagendGameMode = flag;
}




async function fetchWordQuotes(endpoints) {
    try{
        const result = await fetch(endpoints);
        if (result.ok){
            let data = await result.json();
            let auxiliar_list_words = [];

            quotes = data.quotes;
            alphabetic.map(item => {
                auxiliar_list_words.push(data.word[`word_${item}`].trim());
            });
            
            auxiliar_list_words.forEach(item => {
                item.split(',').forEach(subItem => {
                    words.push(subItem.trim());
                })
            })
            GAME_UTIL.phrases = words;
            // GAME_UTIL.words = words;
            isGaming = true;
        } else{
            error_container.style.display = 'flex';
        }
    }catch(error){
        console.log(error.message());
        error_container.style.display = 'flex';
    }
}




//END_POINT
fetchWordQuotes(END_POINT);




let counter = 0;


document.addEventListener('DOMContentLoaded', () => {
    handleDisplayScoreOrNameGame('none', 'block');
});


function init(){
    currentScore.textContent = 0;
}
  
init();


const isInputFull = () => {
    let input_length = current_input_value.split('').length;
    let current_quote_length = current_quote.split('').length;
}
/**
 * Update Quotes
 */
const updateQuote = () => {
    game_text_2.textContent = null;
    GAME_UTIL.current_quote = GAME_UTIL.phrases[GAME_UTIL.phrases_index];

    GAME_UTIL.current_quote.split('').forEach(current_char => {
        const genratedChar = document.createElement('span');
        genratedChar.innerText = current_char;
        game_text_2.appendChild(genratedChar);
    });
    

    GAME_UTIL.phrases_index = Math.floor(Math.random() * (GAME_UTIL.phrases.length - 1));

    /*
    if (GAME_UTIL.phrases_index < GAME_UTIL.phrases.length - 1 ){
        GAME_UTIL.phrases_index++;
    }

    else {
        GAME_UTIL.phrases_index = 0;
    }*/
}

const checkBackSpaceTyped = ({ keyCode }) => {
    if (keyCode === 8){
        GAME_UTIL.incorrect_char = ( GAME_UTIL.incorrect_char - 1 < 0 ) ? 0 : GAME_UTIL.incorrect_char - 1;
    }
}
/**
 * Handle Process in Current text
 */
const handleProcessCurrentText = () => {
    
    let current_input_value = input_text.value;
    let current_input_value_array = current_input_value.split('');


    GAME_UTIL.characterTyped++
    GAME_UTIL.errors = 0;

    let listCharacters = game_text_2.querySelectorAll('span');
    listCharacters.forEach((current_char, char_position) => {
        let typedChar = current_input_value_array[char_position];

        if (typedChar == null) {
            current_char.classList.remove('correct');
            current_char.classList.remove('incorrect');
        } else if (typedChar === current_char.innerText) {
            current_char.classList.add('correct');
            current_char.classList.remove('incorrect');
            GAME_UTIL.current_score++;
            GAME_UTIL.correct_char++;
            currentScore.textContent = GAME_UTIL.current_score;

        } else {
            current_char.classList.add('incorrect');
            current_char.classList.remove('correct');
            GAME_UTIL.current_score = (GAME_UTIL.current_score - 1 < 0) ? 0 : GAME_UTIL.current_score - 1;
            currentScore.textContent = GAME_UTIL.current_score;
            GAME_UTIL.errors++;
            GAME_UTIL.max_error++;
            GAME_UTIL.incorrect_char++; 
        }

    });

    error_label.textContent = GAME_UTIL.total_errors + GAME_UTIL.errors;    
    let correctCharacters = (GAME_UTIL.characterTyped - ( GAME_UTIL.total_errors + GAME_UTIL.errors));
    let accuracyValue = ((correctCharacters / GAME_UTIL.characterTyped) * 100);
    acurracy_label.textContent = `${Math.round(accuracyValue)}%`;

    if (current_input_value.length == GAME_UTIL.current_quote.length){
        
        if (!hasEqual(current_input_value, GAME_UTIL.current_quote)) return;

        
        if (GAME_UTIL.isGamingWithRange) uptdateWithRange();

        GAME_UTIL.incorrect_char = 0;
        GAME_UTIL.correct_char = 0;
        GAME_UTIL.current_score = 0;
        updateQuote();


        GAME_UTIL.total_errors += GAME_UTIL.errors;

        input_text.value = '';
    }
}


function uptdateWithRange(){
    GAME_UTIL.initial_width_range = GAME_UTIL.MAX_WIDTH_RANGE;
    GAME_UTIL.time_left = GAME_UTIL.MAX_WIDTH_RANGE;
}

function hasEqual(quotes_1, quotes_2){
    return quotes_1 === quotes_2;
}


function reduceWithRange(){
    let timer = setInterval(() => {
        time_left_range.style.width = `${GAME_UTIL.initial_width_range}rem`;
        GAME_UTIL.initial_width_range-= 0.28;
        counter++;

        if (GAME_UTIL.initial_width_range < -5 ) {
            finishGame()
        }
    }, (GAME_UTIL.CYCLE_TIME));
}
/**
 * Update Time
 */
const updateTimer = () => {
    if (GAME_UTIL.time_left > 0) {
        GAME_UTIL.time_left--;
        GAME_UTIL.time_elapsed++;
        
        if (getNumberLenght(GAME_UTIL.time_initial) > 2) {
            if (GAME_UTIL.seconds_counter_label != -1)
                time_label.textContent = `0${GAME_UTIL.minutes_counter_label}:${getNumberLenght(GAME_UTIL.seconds_counter_label) > 1 ? GAME_UTIL.seconds_counter_label : '0'+ GAME_UTIL.seconds_counter_label}s`;
            if (GAME_UTIL.seconds_counter_label < 0 && (GAME_UTIL.new_times - 60 >= 0)){
                GAME_UTIL.new_times -= 60; 
                init_counter_labels()
            }
            if (GAME_UTIL.seconds_counter_label < 0 && (GAME_UTIL.new_times - 60 < 0)){
                init_counter_labels()
                return;
            }
            GAME_UTIL.seconds_counter_label--;
        } else {
            time_label.textContent = `${GAME_UTIL.time_left}s`;
        }
    } else {
        finishGame();
    }
}

function init_counter_labels(){
    GAME_UTIL.seconds_counter_label = 60;
    GAME_UTIL.new_times -= 60;
    GAME_UTIL.minutes_counter_label--;
}

const finishGame = () => {
    clearInterval(GAME_UTIL.timer);



    input_text.style.display = 'none';

    container_tipe_game.style.display = 'none';
    
    game_end_info_container.style.display = 'flex';

    game_text_1.style.display = 'none';

    game_text_2.style.display = 'none';

    btn_start.style.display = 'none';

    game_counter_container.style.display = 'none';

    menu_game_statistic.style.display = 'none';

    let cpm = Math.round(((GAME_UTIL.characterTyped/GAME_UTIL.time_elapsed ) * 60));
    let wpm = Math.round((((GAME_UTIL.characterTyped / 5) / GAME_UTIL.time_elapsed ) * 60));

    cpm_text.textContent = cpm;
    wpm_text.textContent = wpm;
    total_error.textContent = GAME_UTIL.max_error;
}


const startGame = () => {
    resetValues();
    updateQuote();
    if (getNumberLenght(GAME_UTIL.time_initial) > 2) {
        GAME_UTIL.minutes_counter_label = (GAME_UTIL.time_initial/60) - 1;
        GAME_UTIL.new_times = GAME_UTIL.time_initial - 60;
        GAME_UTIL.seconds_counter_label = 60;
    }
    clearInterval(GAME_UTIL.timer);
    GAME_UTIL.timer = setInterval(updateTimer, 1000);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const resetValues = () => {
    // GAME_UTIL.time_initial = GAME_UTIL.time_left = GAME_UTIL.time_limit;
    cpm_text.textContent = '';
    wpm_text.textContent = '';
    total_error.textContent = '';
    menu_game_statistic.style.display = 'block';
    currentScore.textContent = 0;
    GAME_UTIL.current_score = 0;
    GAME_UTIL.correct_char = 0;
    GAME_UTIL.incorrect_char = 0;
    GAME_UTIL.seconds_counter_label = 0;
    GAME_UTIL.new_times -= 0;
    GAME_UTIL.minutes_counter_label = 0;
    
    
}


btn_start.addEventListener('click',() => {
    if (!isGaming) return;
    btn_start.classList.add('btn-start_desappear');
    input_text.classList.add('input_text_desappear');
    game_text_1.classList.add('game-text-1-desappear');
    game_text_2.classList.add('game-text-2-desappear');
    buttonOpenModal.style.visibility = 'hidden';
    counter_numbers.forEach((cur, index) => {
        cur.classList.add(`num${(index + 1)}`);
    });

    GAME_UTIL.phrases_index = Math.floor(Math.random() * (GAME_UTIL.phrases.length - 1));
    
    if (!GAME_UTIL.isGamingWithRange) time_left_range.style.display = 'none';

    counter_numbers[counter_numbers.length - 1].addEventListener('animationend', () => {
        
        
        input_text.focus();
        input_text.classList.remove('input_text_desappear');
        game_text_1.classList.remove('game-text-1-desappear');

        // handleDisplayScoreOrNameGame('flex', 'none');

        input_text.classList.add('input_text_appear');
        game_text_1.classList.add('game-text-1-appear');
        game_text_2.classList.add('game-text-2-appear');

        time_left_range.classList.add('time_left_rang_appear');
        game_text_1.style.display = 'none';
        game_text_2.innerHTML = GAME_UTIL.phrases[GAME_UTIL.phrases_index];
        
        }
    );
});


/**
 * All Event for handle score
 */
 function handleDisplayScoreOrNameGame(displayScore, displayNameGame){
    scoreContainer.style.display = displayScore;
    gameName.style.display = displayNameGame;
}


/**
 * All Event for Handle modal
 */
 buttonCloseModal.addEventListener('click', ()=>{
    handleModal(false)
});

shadown.addEventListener('click', ()=>{
    handleModal(false)
})

buttonOpenModal.addEventListener('click', ()=>{
    handleModal(true)
})

function handleModal(isVisible){
    shadown.style.display = `${isVisible ? 'block' : 'none'}`;
    modalCard.style.display = `${isVisible ? 'flex' : 'none'}`;
}

[...select_minutes].forEach((radioButton, index) => {
    radioButton.addEventListener('change', () => {
        GAME_UTIL.time_initial = GAME_UTIL.time_left = Number(radioButton.value);
    });
});

input_text.addEventListener('input', handleProcessCurrentText );
input_text.addEventListener('keydown', checkBackSpaceTyped );
input_text.addEventListener('focus', () => {
    startGame();
    if (GAME_UTIL.isGamingWithRange) {
        reduceWithRange();
        time_label.style.display = 'none';
        first_time_label.style.display = 'none';
    }else {
        time_left_range.style.display = 'none';
    }
} );
btn_try_again.addEventListener('click', () => {
    location.reload();
});

gameName.addEventListener('click', () => {
    location.reload();
});


function getNumberLenght(number){
    return Math.log(number) * Math.LOG10E + 1 | 0;
}

