;(function($){
"use strict"
$.fn.sortChildren=function(options){
    var  settings=$.isPlainObject(options)
            ?$.extend({ // Object parameter, new style
                cmp:function(){return $(this).text()},
                ignoreFirst:0, // ignore some of the first few children
                ignoreLast:0, // ignore some of the last few children
                reverse:false  // sort in reverse
            },options)
            :{ // cmp,ignoreFirst,ignoreLast,reverse // old parameters
                cmp:arguments[0],
                ignoreFirst:arguments[1],
                ignoreLast:arguments[2],
                reverse:arguments[3]
            }
    return this.each(function(){
        var self=$(this),
            children=$.makeArray(self.children()),
            first=children.splice(0,settings.ignoreFirst||0),
            last=children.splice(-(settings.ignoreLast||0),settings.ignoreLast)
        $.each(children.sort(settings.cmp), function(i, child){
            if (settings.reverse)
                self.prepend(child)
            else
                self.append(child)
        })
        self.prepend(first).append(last)
    })
}
$.fn.sortTable=function(){ // an example solution  for simple table sorting
    return this.each(function(){
        var sorts = $("thead th",this).map(function(i){
            return $.sortKeys.call(0,$(this).data("sort")||[{"childAlpha":i}])
        }).get()
        $("thead th",this).click(function() {
            if ($(this).hasClass("no-sort")) return
            var tbody = $(this).closest("table").children("tbody"),
                column = $(this).index(),
                alreadySorted = $(this).hasClass("sorted")
            if(alreadySorted) $(this).toggleClass("reversed").siblings().removeClass("sorted reversed")
            $(this).addClass("sorted").siblings().removeClass("sorted reversed")
            tbody.sortChildren({
                cmp: sorts[column],
                reverse: $(this).hasClass("reversed")
            })
        }).attr("title", "sortable").first().click()
    })
}
$.sortKeys=function(a){ // easier way to build sort compare functions.
    if ($.isArray(a))
        return $.sortFunc($.map(a,function(key,i){
            return $.map(key,function(childNo,sort){
                return $.sortFunc[sort](childNo)
            })
        }))
    else
        return $.sortFunc($.map(arguments,function(argument,i){
            return argument?$.sortFunc[argument](i):undefined
        }))
}
$.sortFunc=$.extend(function (sorts,options){
    var options= options||[]
    var funcs=sorts.map(function(v){
            if ($.isFunction(v)){
                options.push('')
                return v
            } else {
                var vS=v.split("::"),
                    option={},
                    o=vS.length==1?[]:vS[1].toLowerCase().split(" ")
                o.map(function(v){option[v]=true})
                options.push(option)
//                 console.log(v,JSON.stringify(options))
                return new Function("return "+vS[0])
            }
        })
    return function(a,b){
        for (var i=0;i<funcs.length;i++){
            var func=funcs[i]
                ,aV= func.call(a)
                ,bV= func.call(b)
            if (options[i].numeric){
                aV=+aV
                bV=+bV
            }
//             console.log("sort",aV,bV,reverse)
            var reverse=options[i].reverse?-1:+1
            if (aV < bV)
                return -1*reverse
            else if (aV > bV)
                return 1*reverse
        }
        return 0
    }
},{
    numeric: function() {
        return +$(this).text()
    },
    alpha: function() {
        return $(this).text()
    },
    reverseNumeric: function() {
        return - +$(this).text()
    },
    reverseAlpha: "$(this).text()::reverse",

    childNumeric: function(i) {
        return function(){ return  parseInt($.trim($(this).children().eq(i).text()))}
    },
    childReverseNumeric: function(i) {
        return function(){ return -parseInt($.trim($(this).children().eq(i).text()))}
    },
    childAlpha: function(i) {
        return function(){ return           $.trim($(this).children().eq(i).text())}
    },
})
})(jQuery)
