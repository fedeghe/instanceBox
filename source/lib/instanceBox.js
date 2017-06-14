FG = {};
FG.instanceBox = (function (){
	"use strict";
	var tools = {
		encoder : {
			encode : function (el) {
				switch(typeof el) {
					case "string": return {nature : "string", val : el};
					case "number": return {nature : "number", val : el};
					case "boolean": return {nature : "boolean", val : el};
					case 'function': return {nature : "function", val : el.toString()};
					case 'object': return {nature : 'object', val : JSON.stringify(el)};
					case null : return null;
					default : return null;
				}
			},
			decode : function (el) {

				switch(el.nature) {
					case "string":	
					case "number":
					case "boolean": return el.val;
					case 'function': return eval("(" + el.val + ")");
					case 'object': return JSON.parse(el.val);
					case null : 
						return null;
				}
			}
		},
		base64 : {
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
		}
	};
	function get(fr){
		var f = eval("(" + fr.constructor + ")"),
			o = new f(), i;
		o.prototype = {};
		for (i in fr.props) {
			o[i] = tools.encoder.decode(fr.props[i]);
		}
		for (i in fr.proto){
			f.prototype[i] = eval("(" + fr.proto[i] + ")");
		}
		return o;
	}

	function set (o){
		var constructorProto = o.constructor.prototype,
			props = {},
			proto = {};
		try {
			// owned
			for (var i in o) {
				if (o.hasOwnProperty(i)){
					props[i] = tools.encoder.encode(o[i]);
				}
			}
			// proto
			for (var i in constructorProto) {
				proto[i] = constructorProto[i].toString();
			}
		} catch(e){
			return false;
		}
		return {
			constructor : o.constructor.toString(),
			constructorName : o.constructor.name,
			props : props,
			proto : proto
		};
	} 
	var base64 = false,
		store = {
			base64 : false,
			setItem : function (k, el) {
				var w = JSON.stringify(set(el));
				if (this.base64) {
					w = tools.base64.forth(w);
				}
				localStorage.setItem(k, w);
			},
			getItem : function (k, cls) {
				var w = localStorage.getItem(k),
					obj;
				if (this.base64) w = tools.base64.back(w);
				obj = get(JSON.parse(w));
				Object.setPrototypeOf(obj, cls.prototype);
				return obj;
			},
			key : function (n) {return localStorage.key(n);},
			removeItem : function (k) {localStorage.removeItem(k); },
			clear : function () {localStorage.clear(); },
			length : function () {return localStorage.length;}
		};
	return {
		base64 : store.base64,
		set : store.setItem,
		get : store.getItem,
		remove : store.removeItem,
		clear : store.clear,
		length : store.length,
		key : store.key
	};
}());
