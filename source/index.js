instanceBox = (function (){
	"use strict";
	var storage = localStorage,
		tools = {
			encoder : {
				encode : function (el) {
					if (el === null) return {nature : 'object', val : 'null', constructorName: 'Object'};
					switch(typeof el) {
						case 'string': return {nature : 'string', val : el, constructorName: el.constructor.name};
						case 'number': return {nature : 'number', val : el, constructorName: el.constructor.name};
						case 'boolean': return {nature : 'boolean', val : el, constructorName: el.constructor.name};
						case 'function': return {nature : 'function', val : el.toString(), constructorName: el.constructor.name};
						case 'object': return {nature : 'object', val : JSON.stringify(el), constructorName: el.constructor.name};
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
						case 'instance': return unpack(el.val);
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
				var w = JSON.stringify(pack(el, k)),
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
			getItem : function (k) {
				var w = storage.getItem(getKey(k)),
					obj = null;
				if (w) {
					if (store.base64) w = tools.base64.back(w, k);
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
				k = k.replace(/^iB-/, '');
				return k;
			},
			removeItem : function (k) { storage.removeItem(getKey(k)); },
			clear : function () {storage.clear(); },
			length : function () {
				var count = 0, i, k;
				for (i = 0; i < storage.length; i++) {
					k = storage.key(i);
					if (k && k.indexOf('iB-') === 0 && k.indexOf('---size') < 0) {
						count++;
					}
				}
				return count;
			},
			useLocalStorage : function () {
				storage = localStorage;
			},
			useSessionStorage: function () {
				storage = sessionStorage;
			}
		};

	function unpack(fr, key){
		var fn = eval(fr.constructorName),
			proto = fn.prototype,
			o = Object.create(proto),
			i;

		for (i in fr.props) {
			if (canDecoded(fr.props[i])) {
				o[i] = tools.encoder.decode(fr.props[i]);
			}
		}
		for (i in fr.proto) {
			fn.prototype[i] = eval("(" + fr.proto[i] + ")");
		}
		return o;
	}
	function canDecoded(el) {
		return el && (el.nature === 'instance' || /^(Boolean|Number|Date|String|Object|Array|RegExp|Function)$/.test(el.constructorName));
	}
	function pack (o, key){
		var constructorProto = o.constructor.prototype,
			props = {},
			proto = {},
			i, val, ctorName;
		try {
			// owned
			for (i in o) {
				if (o.hasOwnProperty(i)) {
					val = o[i];
					if (val === null || val === undefined) {
						// skip non-serializable
					} else if (typeof val === 'function') {
						props[i] = tools.encoder.encode(val);
					} else if (typeof val !== 'object') {
						props[i] = tools.encoder.encode(val);
					} else {
						ctorName = val.constructor.name;
						if (/^(Object|Array|Date|RegExp)$/.test(ctorName)) {
							props[i] = tools.encoder.encode(val);
						} else {
							props[i] = {
								nature: 'instance',
								val: pack(val),
								constructorName: ctorName
							};
						}
					}
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
		getSize: store.getSize,
		key: store.key
	};
}());

// doesn't make any sense now
//
// typeof module === 'object' &&
// typeof module.exports === 'object' &&
// (module.exports = instanceBox);