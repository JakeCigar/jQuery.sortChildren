Multi-key sorting for any HTML/XML elements.
============================================

Simple Templates

Usage
```JavaScript
        $("button.name").click(function(){
            $(this).nextAll("div").sortChildren($.sortFunc(["$(this).find('.name').text()"]))
        })
```
Demo
http://jakecigar.github.io/jQuery.sortChildren/
