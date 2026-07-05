/*
instanceBox 1.0.14
federico.ghedina@gmail.com 2026
~3KB
*/
instanceBox=function(){"use strict";function unpack(fr,key){var fn=eval(fr.constructorName),proto=fn.prototype,o=Object.create(proto),i
;for(i in fr.props)canDecoded(fr.props[i])&&(o[i]=tools.encoder.decode(fr.props[i]));for(i in fr.proto)fn.prototype[i]=eval("("+fr.proto[i]+")");return o}function canDecoded(e){
return e&&("instance"===e.nature||/^(Boolean|Number|Date|String|Object|Array|RegExp|Function)$/.test(e.constructorName))}function pack(e,t){var r,o,n,c=e.constructor.prototype,a={},s={};try{
for(r in e)e.hasOwnProperty(r)&&(null===(o=e[r])||void 0===o||("function"==typeof o?a[r]=tools.encoder.encode(o):"object"!=typeof o?a[r]=tools.encoder.encode(o):(n=o.constructor.name,
/^(Object|Array|Date|RegExp)$/.test(n)?a[r]=tools.encoder.encode(o):a[r]={nature:"instance",val:pack(o),constructorName:n})));for(r in c)s[r]=c[r].toString()}catch(e){return!1}return{
constructor:e.constructor.toString(),constructorName:e.constructor.name,props:a,proto:s}}function getKey(e){return"iB-"+e}var storage=localStorage,tools={encoder:{encode:function(e){
if(null===e)return{nature:"object",val:"null",constructorName:"Object"};switch(typeof e){case"string":return{nature:"string",val:e,constructorName:e.constructor.name};case"number":return{
nature:"number",val:e,constructorName:e.constructor.name};case"boolean":return{nature:"boolean",val:e,constructorName:e.constructor.name};case"function":return{nature:"function",val:e.toString(),
constructorName:e.constructor.name};case"object":return{nature:"object",val:JSON.stringify(e),constructorName:e.constructor.name};default:return null}},decode:function(el){switch(el.nature){
case"string":case"number":case"boolean":return el.val;case"function":return eval("("+el.val+")");case"object":return JSON.parse(el.val);case"instance":return unpack(el.val);default:return null}}},
base64:{forth:function(e){return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,function(e,t){return String.fromCharCode("0x"+t)}))},back:function(e){
return decodeURIComponent(atob(e).split("").map(function(e){return"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)}).join(""))}}},store={base64:!0,setItem:function(e,t){
var r=JSON.stringify(pack(t,e)),o=getKey(e);store.base64&&(r=tools.base64.forth(r));try{storage.setItem(o,r),store.setSize(o,r)}catch(e){return e}return!0},getItem:function(e){
var t=storage.getItem(getKey(e)),r=null;return t&&(store.base64&&(t=tools.base64.back(t,e)),r=unpack(JSON.parse(t))),r},setSize:function(e,t){return storage.setItem(e+"---size",t.length)},
getSize:function(e){var t=storage.getItem(getKey(e)+"---size");return null!==t?+t:null},key:function(e){var t=storage.key(e);return t=t.replace(/^iB-/,"")},removeItem:function(e){
storage.removeItem(getKey(e))},clear:function(){storage.clear()},length:function(){var e,t,r=0;for(e=0;e<storage.length;e++)(t=storage.key(e))&&0===t.indexOf("iB-")&&t.indexOf("---size")<0&&r++
;return r},useLocalStorage:function(){storage=localStorage},useSessionStorage:function(){storage=sessionStorage}};return{base64:function(e){store.base64=!!e},useLocalStorage:store.useLocalStorage,
useSessionStorage:store.useSessionStorage,set:store.setItem,get:store.getItem,remove:store.removeItem,clear:store.clear,length:store.length,getSize:store.getSize,key:store.key}}();