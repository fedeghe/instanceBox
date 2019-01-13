instanceBox = (function (){
	"use strict";
	var storage = localStorage,
		tools = {
			encoder : {
				encode : function (el) {
					switch(typeof el) {
						case 'string': return {nature : 'string', val : el};
						case 'number': return {nature : 'number', val : el};
						case 'boolean': return {nature : 'boolean', val : el};
						case 'function': return {nature : 'function', val : el.toString()};
						case 'object': return {nature : 'object', val : JSON.stringify(el)};
						case null:
						default: return null;
					}
				},
				decode : function (el) {
					switch(el.nature) {
						case 'string':	
						case 'number':
						case 'boolean': return el.val;
						case 'function': return eval('(' + el.val + ')');
						case 'object': return JSON.parse(el.val);
						case null:
						default:
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
		},
		store = {
			base64 : true,
			setItem : function (k, el) {
				var w = JSON.stringify(pack(el)),
					key = getKey(k);
				if (store.base64) {
					w = tools.base64.forth(w);
				}
				try{
					storage.setItem(key, w);
					store.setSize(key, w);
				} catch(e) {
					return e;
				}
				return true;
			},
			getItem : function (k, cls) {
				var w = storage.getItem(getKey(k)),
					obj = null;
				if (w) {
					if (store.base64) w = tools.base64.back(w);
					obj = unpack(JSON.parse(w));
				}
				return obj;
			},
			setSize: function (k, w) {
				return storage.setItem(k + '---size', w.length);
			},
			getSize: function (k) {
				var r = storage.getItem(getKey(k) + '---size');
				return r !== null ? +r : null;
			},
			key : function (n) {
				var k = storage.key(n);
				k = k.replace(/$iB-/, ''); 
				return k;
			},
			removeItem : function (k) {storage.removeItem(k); },
			clear : function () {storage.clear(); },
			length : function () {return storage.length;},
			useLocalStorage : function () {
				storage = localStorage;
			},
			useSessionStorage: function () {
				storage = sessionStorage;
			}
		};

	function unpack(fr){
		var f = eval("(" + fr.constructor + ")"),
			o = new f(), i,
			fn = eval(fr.constructorName),
			proto = new fn();
		
		Object.setPrototypeOf(o, proto);
		for (i in fr.props) {
			o[i] = tools.encoder.decode(fr.props[i]);
		}
		for (i in fr.proto) {
			f.prototype[i] = eval("(" + fr.proto[i] + ")");
		}
		return o;
	}

	function pack (o){
		var constructorProto = o.constructor.prototype,
			props = {},
			proto = {},
			i;
		try {
			// owned
			for (i in o) {
				if (o.hasOwnProperty(i)){
					props[i] = tools.encoder.encode(o[i]);
				}
			}
			// proto
			for (i in constructorProto) {
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
	
	function getKey(k) {return 'iB-' + k;}

	return {
		base64: function (v) {store.base64 = !!v;},
		useLocalStorage : store.useLocalStorage,
		useSessionStorage : store.useSessionStorage,
		set : store.setItem,
		get : store.getItem,
		remove : store.removeItem,
		clear : store.clear,
		length : store.length,
		getSize: store.getSize
	};
}());

typeof module === 'object' &&
typeof module.exports === 'object' &&
(module.exports = instanceBox);