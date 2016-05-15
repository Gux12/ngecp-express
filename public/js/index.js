$(document).ready(function () {
    $(".uk-slidenav-previous").css("margin-left", "-20px;");
    $('#img-disp-1').hover(function() {
        $(this).append('<div class="cloth-disp-origin-cover"><a href="cloth.html"><p class="p-content" style="margin-top: 20px;">定制需求记录： 定制腰带</p></a><a><p class="p-content" style="margin-top: 25px;">定制需求记录： 衬衫</p></a><a><p class="p-content" style="margin-top: 25px;">非定制需求记录： 皮鞋</p></a><a><p class="p-content" style="margin-top: 25px;">定制需求记录： 球鞋</p></a></div>');
        var X = $(this).position().top;
        var Y = $(this).position().left;
        $('.cloth-disp-origin-cover').css({
            'top': X,
            'left': Y,
            'height': $(this).height(),
            'width': $(this).width(),
            'padding-top': $(this).height() - 280,
        })
        $('.button-like')
        $('.button-like')
        $('.cloth-disp-origin-cover').hover();
    }, function() {
        $('.cloth-disp-origin-cover').remove();
    });

    $('#img-disp-2').hover(function() {
        $(this).append('<div class="cloth-disp-origin-cover"><a href="cloth.html"><p class="p-content" style="margin-top: 20px;">女士创意衬衫设计</p></a><a><p class="p-content" style="margin-top: 25px;">女士创意裙子设计</p></a><a><p class="p-content" style="margin-top: 25px;">女士创意围巾设计</p></a><a><p class="p-content" style="margin-top: 25px;">女士创意帽子设计</p></a></div>');
        var X = $(this).position().top;
        var Y = $(this).position().left;
        $('.cloth-disp-origin-cover').css({
            'top': X,
            'left': Y,
            'height': $(this).height(),
            'width': $(this).width(),
            'padding-top': $(this).height() - 280,
        })
        $('.button-like')
        $('.button-like')
        $('.cloth-disp-origin-cover').hover();
    }, function() {
        $('.cloth-disp-origin-cover').remove();
    });

    $('#img-disp-3').hover(function() {
        $(this).append('<div class="cloth-disp-origin-cover"></div>');
        var X = $(this).position().top;
        var Y = $(this).position().left;
        $('.cloth-disp-origin-cover').css({
            'top': X,
            'left': Y,
            'height': $(this).height(),
            'width': $(this).width(),
            'padding-top': $(this).height() - 280,
        })
        $('.button-like')
        $('.button-like')
        $('.cloth-disp-origin-cover').hover();
    }, function() {
        $('.cloth-disp-origin-cover').remove();
    });

    $('#img-disp-4').hover(function() {
        $(this).append('<div class="cloth-disp-origin-cover"></div>');
        var X = $(this).position().top;
        var Y = $(this).position().left;
        $('.cloth-disp-origin-cover').css({
            'top': X,
            'left': Y,
            'height': $(this).height(),
            'width': $(this).width(),
            'padding-top': $(this).height() - 280,
        })
        $('.button-like')
        $('.button-like')
        $('.cloth-disp-origin-cover').hover();
    }, function() {
        $('.cloth-disp-origin-cover').remove();
    });

    $('.img-disp').click(function() {
        window.location.href= $(this).parent().children('a').attr('href');
    });
});