
$(document).ready(function(){
    $("#mobileMenu").click(function(){
        $(".slideMenu").toggleClass("open");
    });
    
    $(".pullBack,.slideMenu>ul>li>a").click(function(){
        $(".slideMenu").removeClass("open");
    });
    
    
    $("#advcanceSearch").click(function(){
        $(".advancedTools").toggle();
    });
    
    $("#showNotify, .notificationBox>li>.showMore").click(function(){
        $(".notificationBox").toggle();
    });
    
    
});