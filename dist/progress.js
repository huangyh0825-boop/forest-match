(function(root){
'use strict';
function normalizeSave(stored,total){const result={unlocked:1,stars:{},best:{},sound:false,music:true};if(!stored||typeof stored!=='object'||Array.isArray(stored))return result;const number=(v,max)=>Number.isFinite(Number(v))?Math.max(0,Math.min(max,Math.floor(Number(v)))):0;result.unlocked=Math.max(1,number(stored.unlocked,total));for(let id=1;id<=total;id++){const stars=number(stored.stars?.[id],3),best=number(stored.best?.[id],1e9);if(stars){result.stars[id]=stars;result.unlocked=Math.min(total,Math.max(result.unlocked,id+1));}if(best)result.best[id]=best;}if(typeof stored.sound==='boolean')result.sound=stored.sound;if(typeof stored.music==='boolean')result.music=stored.music;return result;}
const api={normalizeSave};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ForestProgress=api;
})(typeof globalThis!=='undefined'?globalThis:this);
