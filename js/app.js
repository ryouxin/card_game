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
var liArray = [];
const allCards = ["fa fa-diamond",
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
var userInfo = {
    point: 0,
    moveStep: 0,
    seconds: 0,
    firstClick: 0,
    secondClick: 0,
    stars: $('.stars li').children().length,

}
var timeId = null;
gameInit();
//游戏初始化
function gameInit() {
    userInfo.point = 0;
    userInfo.moveStep = 0;
    userInfo.seconds = 0;
    userInfo.stars = $('.stars li').children().length;
    $('.stars li').children().attr('class', 'fa fa-star');
    $('.moves').html(userInfo.moveStep); //user move step number
    cardsInit() //初始化已翻牌卡牌
    getMathRandom(); //生成随即卡牌场景
    clearInterval(timeId);
}
$('.restart').click(function() { //游戏重开
    // checkGame();
    gameInit();
});

$(".card").click(function() { //监听用户动作
    if ($(this).attr('class') == 'card match') {
        return;
    }
    if (userInfo.moveStep === 0) {
        timeStart(); //开始计时
    }
    if ($(".open").length < 2) { //锁定同时翻开卡牌数量
        $(this).attr('class', 'card open show');
    } else {
        return;
    }
    if ($(".open").length == 1) { //判断翻开卡牌是否为同一个
        userInfo.firstClick = $(this);
    } else if ($(".open").length == 2) {
        userInfo.moveStep++;
        $('.moves').html(userInfo.moveStep);
        userInfo.secondClick = $(this);
        if (checkMatch(userInfo.firstClick, userInfo.secondClick)) { //匹配相同
            trunToMatch(userInfo.firstClick, userInfo.secondClick);
            userInfo.firstClick = userInfo.secondClick = '';
            userInfo.point++;
            checkGame(); //监听游戏状态
        } else {
            timeCount(userInfo.firstClick, userInfo.secondClick); //匹配不同
        }

    } else {
        $('.card').click(function() {
            return;
        });
    }
});


function timeStart() {
    var i = 0;
    timeId = self.setInterval(function() {
        userInfo.seconds++;
        if (userInfo.seconds == 30 || userInfo.seconds == 50 || userInfo.moveStep >= 15) {
            if (userInfo.stars > 1) {
                removeStar(i); //remove star
                i++;
            }

        }
    }, 1000);
}

function removeStar(i) {
    $(`.stars li:eq(${i})`).children().attr('class', 'fa fa-star-o');
    userInfo.stars--;

}

function timeCount(firstCard, secondCard) {
    if (!firstCard || !secondCard) {
        console.log('no first card or second card')
        return;
    }
    setTimeout(function() {
        if (firstCard.attr('class') == 'card open show' && secondCard.attr('class') == 'card open show') {
            firstCard.attr('class', 'card');
            secondCard.attr('class', 'card');
        }
    }, 500);
}

function checkMatch(firstCard, secondCard) {
    if (!firstCard || !secondCard) {
        return;
    }
    return (firstCard.children('i').attr('class') == secondCard.children('i').attr('class')) ? true : false;
}

function checkGame() {

    if ($(".match").length == 16) {
        var html = '';
        for (var i = 0; i < userInfo.stars; i++) {
            html += '<i class="fa fa-star"></i>'
        }
        setTimeout(function() {
            document.getElementById('userPointInfo').innerHTML = `win point:${userInfo.point} stars:${html} time: ${userInfo.seconds}`;
            // $('#userPointInfo').append(`win point:${userInfo.point} stars: ${userInfo.stars} time: ${userInfo.seconds}`);
            // $('#myModalCloss').after(`<p>win point:${userInfo.point} stars: ${userInfo.stars} time: ${userInfo.seconds}</p>`);
            document.getElementById('myModal').style.display = "block";
            $('#myModalCloss').click(function() {
                document.getElementById('myModal').style.display = "none";
            });
        }, 1500);
        clearInterval(timeId);
    }
}

function trunToMatch(firstCard, secondCard) {
    if (!firstCard || !secondCard) {
        return;
    }
    firstCard.attr('class', 'card match');
    secondCard.attr('class', 'card match');
}



function cardsInit() {
    $.each($('.open'), function() {
        $(this).attr('class', 'card');
    });
    $.each($('.match'), function() {
        $(this).attr('class', 'card');
    });
}

function getMathRandom() {
    liArray = [];
    var stack = [];
    for (var i = 0; i < 16; i++) {
        stack.push(i);
        console.log(stack[i]);
    }
    while (stack.length) {
        liArray.push(stack.splice(parseInt(Math.random() * stack.length), 1)[0]);
    }
    console.log(liArray); //创建随机数组
    $.each($('.deck').children(), function(i, n) {
        console.log(allCards[liArray[i]]); //根据随即数组 liarray 为key 取 allcards value
        $(this).children().attr('class', allCards[liArray[i]]);
    });
}
$('#replayGame').click(function() {
    gameInit();
    document.getElementById('myModal').style.display = "none";
});

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
