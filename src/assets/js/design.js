
$(document).ready(function(){
    $("#mobileMenu").click(function(){
        $(".slideMenu").toggleClass("open");
    });

    $(".pullBack,.slideMenu>ul>li>a").click(function(){
        $(".slideMenu").removeClass("open");
    });
});
