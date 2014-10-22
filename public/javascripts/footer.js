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


//首先将#back-to-top隐藏
$("#back-to-top").hide();
//当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
$(function () {
    $(window).scroll(function(){
        if ($(window).scrollTop()>100){
            $("#back-to-top").fadeIn(1500);
        }
        else
        {
            $("#back-to-top").fadeOut(1500);
        }
    });
//当点击跳转链接后，回到页面顶部位置
    $("#back-to-top").click(function(){
        $('body,html').animate({scrollTop:0},1000);
        return false;
    });
});

    )





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




