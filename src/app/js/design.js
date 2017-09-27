$(document).ready(function(){
    var myWidth = $(window).width();
    var myHeight = $(window).height();
    $(".flag").css("border-right-width", myWidth/2);
    $(".flag").css("border-top-width", myHeight/2);    

    var defaultTop = $("header").height()+$(".fixedBlock").height()+20;
    $(".belowFixedBlock").css("top", defaultTop);

    $(function () {	
        $('header, .fixedBlock').attrchange('polling', {
            isComputedStyle: 'true',
            //pollingInterval: 5000, 
            properties: ['height'],
            callback: function (changes) {
                var logger = [];
                for (var keys in changes) {
                    var properties = $(this).attrchange('getProperties');
                    var myNewValue = parseInt(changes[keys].newValue.replace("px",""));
                    var myCalc = $("header").height() + 20 + myNewValue;
                    $(".belowFixedBlock").css("top", myCalc);
                   
                   //calculate hierarchy tree height calculation
                    var headerHeight = $("header").height() + 20 + $(".fixedBlock").height();
                    var myCalcHeight = window.innerHeight - headerHeight - 120;
                    $('treecontrol>ul').css('height',myCalcHeight );
                    /*var myCalctree = $("#myH").height();
                    $(".tree").css("max-height",myCalctree);*/
                }					
            }
        });
    });
    
    
  /*  $(".panel-title a").removeClass("collapsed");*/
    
    
     $(".tree li.parent").click(function(){
        $(this).toggleClass("closed");
    });
    
    
    $(".accordion2 .a2block").click(function(){
        $(".accordion2 .a2block").removeClass("open");
        $(this).toggleClass("open");
    });
    
    
    /*var treeHeightL = $(".treeSt>div:first-child").height();
    var treeHeightR = $(".treeSt>div:last-child").height();
    if(treeHeightL > treeHeightR){
        $(".treeSt>div:last-child").css("box-shadow","-2px 0 0 0 #DEDEDE");
    }else{
        $(".treeSt>div:first-child").css("box-shadow","2px 0 0 0 #DEDEDE");
    }*/
    
    
    var loginBg = $(".loginPage .pageMinHeight").height();
    $(".loginPage .leftLoginArea").css("min-height", loginBg);
    
    
});