/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976

/*
    规定随即卡牌属性
*/
var li_array = [];
var all_cards = ["fa fa-diamond",
    "fa fa-paper-plane-o",
    "fa fa-anchor",
    "fa fa-bolt",
    "fa fa-cube",
    "fa fa-leaf",
    "fa fa-bicycle",
    "fa fa-bomb",
    "fa fa-diamond",
    "fa fa-paper-plane-o",
    "fa fa-anchor",
    "fa fa-bolt",
    "fa fa-cube",
    "fa fa-leaf",
    "fa fa-bicycle",
    "fa fa-bomb",
];

// user info
var user_info = {
    point: 0,
    move_step: 0,
    seconds: 0,
    first_click: 0,
    second_click: 0,
    stars: $('.stars li').children().length,

}
var time_id = null;
game_init()
//游戏初始化
function game_init() {
    user_info.point = 0;
    user_info.move_step = 0;
    user_info.seconds = 0;
    user_info.stars = $('.stars li').children().length;
    $('.stars li').children().attr('class', 'fa fa-star');
    $('.moves').html(user_info.move_step); //user move step number
    cards_init() //初始化已翻牌卡牌
    get_math_random(); //生成随即卡牌场景
    clearInterval(time_id);
}
$('.restart').click(function() { //游戏重开
    game_init();
});

$(".card").click(function() { //监听用户动作
    if (user_info.move_step == 0) {
        time_start(); //开始计时
    }
    if ($(".open").length < 2) { //锁定同时翻开卡牌数量
        $(this).attr('class', 'card open show');
        user_info.move_step++;
        $('.moves').html(user_info.move_step);
    } else {
        return;
    }
    if ($(".open").length == 1) { //判断翻开卡牌是否为同一个
        user_info.first_click = $(this);
    } else if ($(".open").length == 2) {
        user_info.second_click = $(this);
        if (check_match(user_info.first_click, user_info.second_click)) { //匹配相同
            trun_to_match(user_info.first_click, user_info.second_click);
            user_info.first_click = user_info.second_click = '';
            user_info.point++;
            check_game(); //监听游戏状态
        } else {
            time_count(user_info.first_click, user_info.second_click); //匹配不同
        }

    } else {
        $('.card').click(function() {
            return;
        });
    }
});

function time_start() {
    var i = 0;
    time_id = self.setInterval(function() {
        user_info.seconds++;
        if (user_info.seconds == 100 || user_info.seconds == 30 || user_info.seconds == 50) {
            remove_star(i); //remove star
            i++;
        }
    }, 1000);
}

function remove_star(i) {
    $(".stars li:eq(" + i + ")").children().attr('class', 'fa fa-star-o');
    user_info.stars--;

}

function time_count(first_card, second_card) {
    if (!first_card || !second_card) {
        console.log('no first card or second card')
        return;
    }
    setTimeout(function() {
        if (first_card.attr('class') == 'card open show' && second_card.attr('class') == 'card open show') {
            first_card.attr('class', 'card');
            second_card.attr('class', 'card');
        }
    }, 500);
}

function check_match(first_card, second_card) {
    if (!first_card || !second_card) {
        return;
    }
    return (first_card.children('i').attr('class') == second_card.children('i').attr('class')) ? true : false;
}

function check_game() {
    if ($(".match").length == 16) {
        setTimeout(function() {
            alert('win point:' + user_info.point + ' stars: ' + user_info.stars)
        }, 1500);
        clearInterval(time_id);
    }
}

function trun_to_match(first_card, second_card) {
    if (!first_card || !second_card) {
        return;
    }
    first_card.attr('class', 'card match');
    second_card.attr('class', 'card match');
}



function cards_init() {
    $.each($('.open'), function() {
        $(this).attr('class', 'card');
    });
    $.each($('.match'), function() {
        $(this).attr('class', 'card');
    });
}

function get_math_random() {
    li_array = [];
    var stack = [];
    for (var i = 0; i < 16; i++) {
        stack.push(i);
    }
    while (stack.length) {
        li_array.push(stack.splice(parseInt(Math.random() * stack.length), 1)[0]);
    }
    $.each($('.deck').children(), function(i, n) {
        $(this).children().attr('class', all_cards[li_array[i]]);
    });
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
