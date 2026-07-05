instanceBox = (function (){
	"use strict";
	var storage = localStorage,
		registry = {},
		globalScope = Function('return this')(),
		tools = {
			serialize : function (val) {
				if (val === null || val === undefined) return val;
				var type = typeof val;
				if (type !== 'object') return val;
				if (Array.isArray(val)) return val;
				if (val instanceof Date) return { __type: 'Date', val: val.toISOString() };
				if (val instanceof RegExp) return { __type: 'RegExp', val: val.toString() };
				var ctorName = val.constructor.name;
				if (ctorName === 'Object') return val;
				return { __instance__: true, constructorName: ctorName, data: pack(val) };
			},
			deserialize : function (val) {
				if (val && typeof val === 'object') {
					if (val.__type === 'Date') return new Date(val.val);
					if (val.__type === 'RegExp') return new RegExp(val.val);
					if (val.__instance__) return unpack(val.data);
				}
				return val;
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
			getItem : function (k) {
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
				return k ? k.replace(/^iB-/, '') : null;
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

	function unpack(fr){
		var fn = registry[fr.constructorName] || globalScope[fr.constructorName],
			proto = fn.prototype,
			o = Object.create(proto),
			i;

		for (i in fr.props) {
			o[i] = tools.deserialize(fr.props[i]);
		}
		return o;
	}

	function pack (o){
		var props = {},
			i;
		for (i in o) {
			if (o.hasOwnProperty(i)) {
				if (typeof o[i] === 'function') continue;
				props[i] = tools.serialize(o[i]);
			}
		}
		return {
			constructorName : o.constructor.name,
			props : props
		};
	}

	function getKey(k) {return 'iB-' + k;}

	return {
		register: function (name, constructor) { registry[name] = constructor; },
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
