instanceBox = (function (){
	"use strict";
	var storage = localStorage,
		base64 = {
			forth : function (str) {
				return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
					function toSolidBytes(match, p1) {
						return String.fromCharCode('0x' + p1);
					}
				));
			},
			back : function (str) {
				return decodeURIComponent(atob(str).split('').map(function(c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				}).join(''));
			}
		},
		store = {
			base64 : false,
			setItem : function (k, el) {
				var v = JSON.stringify({
					constructorName : el.constructor.name,
					el : el
				})
				v = this.base64 ? base64.forth(v) : v;
				storage.setItem(getKey(k), v);
				return true;
			},
			getItem : function (k) {
				var cnt = storage.getItem(getKey(k));
				if (cnt == null) return null;
				var	o = JSON.parse(this.base64 ? base64.back(cnt) : cnt),
					constructorName = o.constructorName,
					el = o.el,
					fn = eval(constructorName),
					res = new fn(),
					i;
				for (i in el)
					if (el.hasOwnProperty(i))
						res[i] = el[i];
				return res;
			},
			key : function (n) {
				var k = storage.key(n);
				k = k.replace(/$iB-/, ''); 
				return k;
			},
			removeItem : function (k) {storage.removeItem(getKey(k));},
			clear : function () {storage.clear();},
			length : function () {return storage.length;},
			use : function (st) {
				switch (st) {
					case 'local': storage = localStorage; break;
					case 'session': storage = sessionStorage; break;
				}
			}
		};
	function getKey(k) {return "iB-" + k;}
	return {
		use : store.use,
		base64 : store.base64,
		set : store.setItem,
		get : store.getItem,
		remove : store.removeItem,
		clear : store.clear,
		length : store.length,
		key : store.key
	};
}());