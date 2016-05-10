$(document).ready(function() {
    // 这个是index.html相关的代码
    // 获取窗口宽度，高度
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
    function fontAdjust(obj, fontsize) {
        obj.css('font-size', winWidth / 1920 * fontsize);
    }
    $('.gux-font-adjust').each(function(index, el) {
        $(this).css('font-size', fontAdjust($(this),this.dataset.fontsize));
    });
    $('body').css('height', winHeight);
    $('body').css('width', winWidth);
    $('#hello1').css('font-size', winWidth / 1920 * 88);
    $('#hello2').css('font-size', winWidth / 1920 * 40);
    $('#hello-input > input').css('font-size', winWidth / 1920 * 40);
    $('#hello-input > div > i').css('font-size', winWidth / 1920 * 40);
    $('.navbar-mynavbar .navbar-nav > li > a').css('font-size', winWidth / 1920 * 16);
    $(window).resize(function() {
        $('body').css('height', window.innerHeight);
        $('body').css('width', window.innerWidth);
        $('#hello1').css('font-size', winWidth / 1920 * 88);
        $('#hello2').css('font-size', winWidth / 1920 * 40);
        $('#hello-input > input').css('font-size', winWidth / 1920 * 40);
        $('#hello-input > div > i').css('font-size', winWidth / 1920 * 40);
        $('.navbar-mynavbar .navbar-nav > li > a').css('font-size', winWidth / 1920 * 16);
    })

    // var isBordered = 0;
    // window.onscroll = function(event) {
    //     /* Act on the event */
    //     if ($(this).scrollTop() && 　!isBordered) {
    //         $('.navbar-mynavbar').css('box-shadow', '0 5px 5px -3px rgba(0, 0, 0, 0.12)');
    //         isBordered = 1;
    //     } else if (!$(this).scrollTop()) {
    //         isBordered = 0;
    //         $('.navbar-mynavbar').css('box-shadow', '0 0 0 0 rgba(0, 0, 0, 0.12)');
    //     };
    // }
    // 
    $('#hello1').removeClass('hide');
    $('#hello2').removeClass('hide');
    $('#hello-input').removeClass('hide');
    $('#hello1').animo({ animation: 'fadeInLeft', duration: 3 });
    $('#hello2').animo({ animation: 'fadeInRight', duration: 3, delay: 0.5 });
    $('#hello-input').animo({ animation: 'fadeInUp', duration: 3, delay: 1 });




    // 这部分是搜索以后服装展示的页面desire_cloth_style_display.html相关的代码
    // $('.lightbox-item').each(function(index, el) {
    //  $(this).css('height', $(this).width());
    // });
    findAllCloth(1);

    function findAllCloth(pos) {
        if ($('#cloth-disp' + pos).length) {
            $('#cloth-disp' + pos).animo({ animation: 'fadeInUp', duration: 0.5, delay: 0.1 * (pos - 1), timing: "easy-in" }, findAllCloth(pos + 1));
        }
    }
    $('.cloth-disp-origin').hover(function() {
        $(this).append('<div class="cloth-disp-origin-cover"><button class="button button-caution button-circle button-small button-like" style="margin: auto 10px 10px 10px"><i class="fa fa-heart" style="color: white"></i></button><button class="button button-primary button-pill button-small button-try" style="margin: auto 10px 10px 10px">看看详情？</button><button class="button button-circle button-small button-dislike" style="margin: auto 10px 10px 10px"><i class="fa fa-times" style="color: white"></i></button></div>');
        var X = $(this).position().top;
        var Y = $(this).position().left;
        $('.cloth-disp-origin-cover').css({
            'top': X,
            'left': Y,
            'height': $(this).height(),
            'width': $(this).width(),
            'padding-top': $(this).height() - 50,
        })
        $('.button-like').click(function(event) {
            /* Act on the event */
        });
        $('.button-try').click(function(event) {
            /* Act on the event */
            window.location.href = 'cloth.html';
        });
        $('.button-dislike').click(function(event) {
            /* Act on the event */
        });
        $('.button-like')
        $('.button-like')
        $('.cloth-disp-origin-cover').hover();
    }, function() {
        $('.cloth-disp-origin-cover').remove();
    });
    $('.cloth-disp-origin').click(function(event) {
        $(this).parent().children('a').trigger('click');
    });

    // 这部分是动态供应链的页面smart_chain.html相关的代码
    animateAllChain(1);

    function animateAllChain(pos) {
        $('#smart-chain' + pos).show();
        if ($('#smart-chain' + pos).length) {
            $('#smart-chain' + pos).animo({ animation: 'rubberBand', duration: 1, timing: "easy-in" }, function() { animateAllChain(pos + 1); });
        }
    }
});
