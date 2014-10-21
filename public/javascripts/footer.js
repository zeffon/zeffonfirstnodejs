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

//return the top

            (function(returnId) {
                var returnTopBtn = document.getElementById(returnId);
                var d = document.documentElement;
                var b = document.body;
                window.onscroll = set;
                returnTopBtn.onclick = function() {
                    returnTopBtn.style.display = "none";
                    window.onscroll = null;
                    this.timer = setInterval(function() {
                            d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
                            b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
                            if ((d.scrollTop + b.scrollTop) == 0) clearInterval(returnId.timer, window.onscroll = set);
                        },
                        10);
                };
                function set() {
                    returnId.style.display = (d.scrollTop + b.scrollTop > 100) ? 'block': "none"
                }
            })('returnTop')
//        returnTop('returnTop');
    );



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




