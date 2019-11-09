// Initial hiding of all elements except the first
let screensToDisplay = 4;

$('#contact-btn').on('click', function(){
    alert('You can contact me at: jordanampz@hotmail.com');
})

$('#pay').on('click', function(){
    alert('Thank you for trying out this demo.');
});

$(`.mobile-screen:gt(${screensToDisplay})`).addClass('hide');
$('#showAllScreens').click(function(){
    $(`.mobile-screen:gt(0)`).toggle('hide');
    if(screensToDisplay==0){
        screensToDisplay = 1;
        $('#mobile-home').fadeIn();
        $('#mobile-home').animate({
            top: '300px'
        }, 300);

        TweenMax.fromTo("#mobile-home, .mobile-menu", .7, {
            y: 0
        }, {
            delay: 0,
            y: -250,
            ease: Power2.easeInOut,
            onComplete: function(){
            }
        });
        function reSize(){
            resize = 0;
            if ($(window).width() < 1650) {
                resize = -300;
                TweenMax.fromTo("#mobile-home, .mobile-menu", .7, {
                    y: 0
                }, {
                    delay: 0,
                    y: resize,
                    ease: Power2.easeInOut,
                    onComplete: function(){
                    }
                });
             }
             else {
                resize = -250;
                TweenMax.fromTo("#mobile-home, .mobile-menu", .7, {
                    y: 0
                }, {
                    delay: 0,
                    y: resize,
                    ease: Power2.easeInOut,
                    onComplete: function(){
                    }
                });
             }
        }
        reSize();
        var rtime;
        var timeout = false;
        var delta = 200;

        $(window).resize(function() {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(resizeend, delta);
            }
        });
        function resizeend() {
            if (new Date() - rtime < delta) {
                setTimeout(resizeend, delta);
            } else {
                timeout = false;
                reSize();
            }               
        }
        $('#mobile-menu').fadeIn();
        $('#mobile-bag').fadeIn();
        $('#mobile-sales').fadeIn();
        $('#showAllScreens').html('Hide all screens');
    } else if(screensToDisplay==1){
        $('#showAllScreens').html('Show all screens');
        screensToDisplay = 0;
    }
});

let slidesNavigation = () => 
{
    $('.shop_now-btn, #bag-home').click(function(){
        TweenMax.fromTo("#mobile-home", .5, {
            y: 0
        }, {
            delay: 0,
            y: -250,
            ease: Power2.easeInOut,
            onComplete: function(){
                $('#mobile-home').hide();
                $('#mobile-bag').hide();
                $('#mobile-sales').show();
            }
        });
        $("#mobile-sales").fadeIn();
    });
    
    $('#logo img, #close-menu, .home-btn').click(function(){
        TweenMax.fromTo("#mobile-sales", .5, {
            y: -0
        }, {
            delay: 0,
            y: 0,
            ease: Power2.easeInOut,
            onComplete: function(){
                $("#mobile-sales").hide();
                $('#mobile-bag').hide();
                $("#mobile-menu").hide();
            }
        });

        $("#mobile-home").fadeIn();

        TweenMax.fromTo("#mobile-home", .5, {
            y: -300
        }, {
            delay: 0,
            y: 0,
            ease: Power2.easeInOut,
            onComplete: function(){
                $('#mobile-sales').hide();
                $("#mobile-home").show();
            }
        }); 
    });

    $('.home-menu').click(function(){
        TweenMax.fromTo("#mobile-home", .5, {
            y: 0
        }, {
            delay: 0,
            y: -300,
            ease: Power2.easeInOut,
            onComplete: function(){
                $('#mobile-home').hide();
                $('#mobile-sales').hide();
                $('#mobile-bag').hide();
                $('#mobile-menu').show();
            }
        });

       
        $("#mobile-menu").fadeIn();
        TweenMax.fromTo("#mobile-menu", .6, {
            y: 300
        }, {
            delay: 0.1,
            y: 0,
            ease: Power2.easeInOut,
            onComplete: function(){
                $('#mobile-home').hide();
            }
        });
    });

    $('.sale-items').click(function(){
        TweenMax.fromTo("#mobile-home, #mobile-menu", .7, {
            y: 0
        }, {
            delay: 0.1,
            y: -300,
            ease: Power2.easeInOut,
            onComplete: function(){
                $('#mobile-home').hide();
                $('#mobile-menu').hide();
                $('#mobile-bag').hide();
                $('#mobile-sales').show();
            }
        });

        $('#mobile-menu').hide();
        $("#mobile-sales").fadeIn();
    });

    $('.bag-screen, .shopping-cart').click(function(){
        TweenMax.fromTo("#mobile-home, #home-menu", .5, {
            y: 0
        }, {
            delay: 0,
            y: -300,
            ease: Power2.easeInOut,
            onComplete: function(){
                $('#mobile-home').hide();
                $('#mobile-sales').hide();
                $('#mobile-menu').hide();
            }
        });

       
        $("#mobile-bag").fadeIn();
        TweenMax.fromTo("#mobile-bag", .2, {
            y: 600
        }, {
            delay: 0,
            y: 0,
            ease: Power2.easeInOut,
            onComplete: function(){
                $('#mobile-home').hide();
                $('#mobile-sales').hide();
                $('#mobile-menu').hide();
            }
        });
    });
}
slidesNavigation();


