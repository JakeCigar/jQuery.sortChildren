"use strict"
;(function($){
$.fn.sortChildren=function(cmp,ignoreFirst,ignoreLast){
	return this.each(function(){
		var self=$(this),
			children=$.makeArray(self.children()),
			first=children.splice(0,ignoreFirst||0),
			last=children.splice(-(ignoreLast||0),ignoreLast)
		self.append(first)
		$.each(children.sort(cmp), function(i, child){
			self.append(child)
		})
		self.append(last)
	})
}
$.sortFunc=$.extend(function (keys){
	var options=[]
		,funcs=keys.map(function(v){
			if ($.isFunction(v)){
				options.push('')
				return v
			} else {
				var vS=v.split("::"),
					o=vS[1].toLowerCase().split(" "),
					option={}
				o.map(function(v){option[v]=true})
				options.push(option)
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
			var reverse=options[i].reverse?-1:+1
			if (aV < bV) 
				return -1*reverse
			else if (aV > bV)
				return 1*reverse
		}
		return 0
	}
},{
	numeric:function(){return +$(this).text()},
	alpha:function(){return $(this).text()},
	reverseNumeric:function(){return - +$(this).text()},
	reverseAlpha:"$(this).text()::reverse"
})
})(jQuery)