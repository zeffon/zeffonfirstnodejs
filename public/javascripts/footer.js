/**
 * Created by yuzefeng on 14-10-21.
 */





$(document).ready(
//
    function(){

    $(".nav li a").click(function(){
        $(this).parent().siblings().removeClass("active");
        $(this).parent().addClass("active");
    })
    $('.nav li a').each(function(){
    if($($(this))[0].href==String(window.location))
    $(this).parent().addClass('active');
    });
    }
    )

//return the top
$(function(){

    $(window).scroll(function(){  //只要窗口滚动,就触发下面代码

        var scrollt = document.documentElement.scrollTop + document.body.scrollTop; //获取滚动后的高度

        if( scrollt >200 ){  //判断滚动后高度超过200px,就显示

            $("#returnTop").fadeIn(400); //淡出

        }else{

            $("#returnTop").stop().fadeOut(400); //如果返回或者没有超过,就淡入.必须加上stop()停止之前动画,否则会出现闪动

        }

    });

    $("#returnTop").click(function(){ //当点击标签的时候,使用animate在200毫秒的时间内,滚到顶部

        $("html,body").animate({scrollTop:"0px"},200);

    });

});



    tinymce.init({

        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste"
        ],

        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    });
//
    $(function () {
        $(".tags").keyup(function () {
            var i = $(this).val();
            $(".tags").not($(this)).each(function () {
                if ($(this).val() == i && $(this).val() != "") {
                    $(this).css("background", "pink");
                    alert("有相同内容！");
                }
            });
        });
    });

    function checkform(){

        if(tinyMCE.get("editor_text").getContent()==="" || tinyMCE.get("editor_text").getContent()===null){
            alert("必须输入文章内容");
            $("textarea").focus();
            return false;
        }else if(($(".tagOne").val() === $(".tagTwo").val() || $(".tagThree").val() === $(".tagTwo").val()) || $(".tagOne").val() === $(".tagThree").val()){
            alert("必须输入不同的标签");
            return false;
        }
    }




