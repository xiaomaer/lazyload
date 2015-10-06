//获取元素到页面顶部的距离
function getoffsetTop(elem) {
		var offTop = 0;
		while (elem != null) {
			offTop += elem.offsetTop; //获取元素到其上一级元素顶部的距离
			elem = elem.offsetParent; //元素的上一级元素
		}
		return offTop;
	}
	//判断是否加载图片

function isLoad(elem) {
		var cHeight = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight, //可视窗口的高度
			sX = window.pageXOffset || document.body.scrollTop || document.documentElement.scrollTop, //浏览器可视窗口距离页面顶部的距离
			threshold = 0, //表示图片在什么时候进行加载，默认为 0 表示当图片进入可视区域立即加载；设为正数表示图片距离 threshold像素进入可视区域进行加载；设为负数表示图片进入可视区域threshold像素时进行加载。
			oTop = getoffsetTop(elem), //元素到页面顶部的距离
			viewHeight = oTop - sX - threshold; //元素到浏览器窗口顶部的距离
		if (cHeight >= viewHeight) //图片进入浏览器可视区域，加载图片
		{
			return true;
		} else { //图片没进入浏览器可视区域，不载图片
			return false;
		}
	}
	//加载图片

function loadImg(elems) {
		for (var i = 0, len = elems.length; i < len; i++) {
			if (isLoad(elems[i])) {
				//针对使用data-自定义的属性，要使用getAttribute()获取值
				elems[i].src = elems[i].getAttribute("data-url"); //实际的url替换原来的url
			}
		}
	}
	//封装成对象
var lazyLoad = {
	//获取元素到页面顶部的距离
	getoffsetTop: function(elem) {
		var offTop = 0;
		while (elem != null) {
			offTop += elem.offsetTop; //获取元素到其上一级元素顶部的距离
			elem = elem.offsetParent; //元素的上一级元素
		}
		return offTop;
	},
	//判断是否加载图片
	isLoad: function(elem) {
		var cHeight = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight, //可视窗口的高度
			sX = window.pageXOffset || document.body.scrollTop || document.documentElement.scrollTop, //浏览器可视窗口距离页面顶部的距离
			threshold = 10, //表示图片在什么时候进行加载，默认为 0 表示当图片进入可视区域立即加载；设为正数表示图片距离 threshold像素进入可视区域进行加载；设为负数表示图片进入可视区域threshold像素时进行加载。
			oTop = this.getoffsetTop(elem), //元素到页面顶部的距离
			viewHeight = oTop - sX - threshold; //元素到浏览器窗口顶部的距离
		if (cHeight >= viewHeight) //图片进入浏览器可视区域，加载图片
		{
			return true;
		} else { //图片没进入浏览器可视区域，不载图片
			return false;
		}
	},
	//加载图片。isFadein:true时，图片使用淡入动画效果加载
	loadImg: function(elems, isFadein) {
		for (var i = 0, len = elems.length; i < len; i++) {
			if (this.isLoad(elems[i])) {
				//已经加载过的图片，下次判断那些图片该加载时，直接跳过
				if (elems[i].className !== "loaded") {
					//针对使用data-自定义的属性，要使用getAttribute()获取值
					elems[i].src = elems[i].getAttribute("data-url"); //实际的url替换原来的url
					elems[i].className = "loaded"; //被加载出来的图片，添加class属性，用于判断下次是否要加载
					if (isFadein) {
						this.fadeIn(elems[i]);//淡入效果显示图片，有点闪烁？？
					}
				}
			} else {
				return; //下一个图片没有进入加载区域，就不在循环
			}
		}
	},
	//使用淡入动画效果加载图片
	fadeIn: function(elem) {
		var n = 0,
			isnotIE = window.XMLHttpRequest ? true : false;
		if (isnotIE) {
			elem.style.opacity = 0;
		} else {
			elem.style.filter = "alpha(opacity=0)";
		}
		var t = setInterval(function() {
			if (n < 100) {
				n += 5;
				if (isnotIE) {
					elem.style.opacity = n / 100;
				} else {
					elem.style.filter = "alpha(opacity=" + n + ")";
				}
			} else {
				clearInterval(t);
				
			}
		}, 50);
	}
};

window.onscroll = function() { //滚动时根据需要加载图片，加载图片的动画为淡入
	lazyLoad.loadImg(document.getElementsByTagName("img"), true);
};
window.onload = function() { //页面加载后，可视区域的图片显示为实际图片
	lazyLoad.loadImg(document.getElementsByTagName("img"), true);
};
