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

BackTop=function(btnId){
    var btn=document.getElementById(btnId);
    var d=document.documentElement;
    window.onscroll=set;
    btn.onclick=function (){
        btn.style.display="none";
        window.onscroll=null;
        this.timer=setInterval(function(){
            d.scrollTop-=Math.ceil(d.scrollTop*0.1);
            if(d.scrollTop==0) clearInterval(btn.timer,window.onscroll=set);
        },10);
    };
    function set(){btn.style.display=d.scrollTop?'block':"none"}
};
BackTop('returnTop');


