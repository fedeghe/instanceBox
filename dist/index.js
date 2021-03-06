/*
instanceBox
federico.ghedina@gmail.com 2020
~3KB
*/
instanceBox=function(){"use strict";function unpack(fr,key){var f=eval("("+fr.constructor+")"),o=new f,i,j=0,fn=eval(fr.constructorName),proto=new fn;Object.setPrototypeOf(o,proto)
;for(i in fr.props)canDecoded(fr.props[i])&&(o[i]=tools.encoder.decode(fr.props[i]));for(i in fr.proto)f.prototype[i]=eval("("+fr.proto[i]+")");return o}function canDecoded(e){
return e.constructorName.match(/boolean|number|date|string|object|array/i)}function canEncoded(e){return e.constructor.name.match(/boolean|number|date|string|object|array/i)}function pack(e,t){
var r,o=e.constructor.prototype,n={},c={};try{for(r in e)e.hasOwnProperty(r)&&(console.log("-----"),console.log(r),canEncoded(e[r])&&(n[r]=tools.encoder.encode(e[r])));for(r in o)c[r]=o[r].toString()
}catch(e){return!1}return{constructor:e.constructor.toString(),constructorName:e.constructor.name,props:n,proto:c}}function getKey(e){return"iB-"+e}var storage=localStorage,tools={encoder:{
encode:function(e){switch(typeof e){case"string":return{nature:"string",val:e,constructorName:e.constructor.name};case"number":return{nature:"number",val:e,constructorName:e.constructor.name}
;case"boolean":return{nature:"boolean",val:e,constructorName:e.constructor.name};case"function":return{nature:"function",val:e.toString(),constructorName:e.constructor.name};case"object":return{
nature:"object",val:JSON.stringify(e),constructorName:e.constructor.name};case null:default:return null}},decode:function(el){switch(el.nature){case"string":case"number":case"boolean":return el.val
;case"function":return eval("("+el.val+")");case"object":return JSON.parse(el.val);case null:default:return null}}},base64:{forth:function(e){
return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,function(e,t){return String.fromCharCode("0x"+t)}))},back:function(e){return decodeURIComponent(atob(e).split("").map(function(e){
return"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)}).join(""))}}},store={base64:!0,setItem:function(e,t){var r=JSON.stringify(pack(t,e)),o=getKey(e);store.base64&&(r=tools.base64.forth(r));try{
storage.setItem(o,r),store.setSize(o,r)}catch(e){return e}return!0},getItem:function(e){var t=storage.getItem(getKey(e)),r=null;return t&&(store.base64&&(t=tools.base64.back(t,e)),
r=unpack(JSON.parse(t))),r},setSize:function(e,t){return storage.setItem(e+"---size",(t.length/1024).toFixed(2)+"KB")},getSize:function(e){var t=storage.getItem(getKey(e)+"---size")
;return null!==t?+t:null},key:function(e){var t=storage.key(e);return t=t.replace(/$iB-/,"")},removeItem:function(e){storage.removeItem(e)},clear:function(){storage.clear()},length:function(){
return storage.length},useLocalStorage:function(){storage=localStorage},useSessionStorage:function(){storage=sessionStorage}};return{base64:function(e){store.base64=!!e},
useLocalStorage:store.useLocalStorage,useSessionStorage:store.useSessionStorage,set:store.setItem,get:store.getItem,remove:store.removeItem,clear:store.clear,length:store.length,getSize:store.getSize}
}();