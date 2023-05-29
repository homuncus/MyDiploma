$(document).ready(function () {

    $('.footer_placeholder').height($('.footer').outerHeight());
});

$(window).resize(function () {
    $('.footer_placeholder').height($('.footer').outerHeight());
});