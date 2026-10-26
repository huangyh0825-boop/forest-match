const vm=require('node:vm'),fs=require('node:fs');
const {Game,LEVELS,NAMES}=require('./dist/engine');
const ForestProgress=require('./dist/progress');
function boot(saved,options={}){
 const nodes=new Map(),timers=[];let written,created=0,reads=0,htmlWrites=0,timerId=0;
 class Node{
  constructor(fragment=false){this.fragment=fragment;this.children=[];this.style={setProperty(k,v){this[k]=v}};this.dataset={};this.attrs={};this.textContent='';this.className='';this.handlers={};this._html='';this.classList={toggle:()=>{},add:()=>{},remove:()=>{}};}
  get innerHTML(){return this._html}set innerHTML(v){this._html=v;htmlWrites++;}
  get childElementCount(){return this.children.length}get clientWidth(){reads++;return 400}get offsetLeft(){reads++;return Number(this.dataset.index||0)%8*50}get offsetTop(){reads++;return (Number(this.dataset.index||0)>>3)*50}get offsetWidth(){reads++;return 46}get offsetHeight(){reads++;return 46}
  append(...items){for(const item of items){if(item.fragment)this.append(...item.children.slice());else{item.parent=this;this.children.push(item);}}}
  replaceChildren(...items){this.children=[];this.append(...items)}insertBefore(item){this.append(item)}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this)}
  setAttribute(k,v){this.attrs[k]=String(v);this[k]=String(v)}getAttribute(k){return this.attrs[k]??null}
  addEventListener(k,v){this.handlers[k]=v}contains(){return false}focus(){}showModal(){this.open=true}close(){this.open=false}
 }
 function node(key){if(!nodes.has(key))nodes.set(key,new Node());return nodes.get(key)}
 const handlers={};class Music{constructor(){this.running=false}setEnabled(v){this.enabled=v}async start(){this.running=true;return true}pause(){this.running=false}}
 const ctx=vm.createContext({ForestMatch:{Game,LEVELS,NAMES},ForestProgress,ForestMusic:{MusicPlayer:Music},document:{hidden:false,querySelector:node,querySelectorAll:()=>[],addEventListener:(n,fn)=>handlers[n]=fn,createElement:()=>{created++;return new Node()},createDocumentFragment:()=>new Node(true)},window:{addEventListener(){}},getComputedStyle:()=>({columnGap:'4px'}),matchMedia:q=>({matches:options.reduced!==false&&q.includes('prefers-reduced'),addEventListener(){}}),localStorage:{getItem:()=>options.raw??JSON.stringify(saved),setItem:(_,value)=>written=JSON.parse(value)},setTimeout:(fn,ms)=>{timers.push({id:++timerId,fn,ms});return timerId},clearTimeout:id=>{const n=timers.findIndex(t=>t.id===id);if(n>=0)timers.splice(n,1)},Date,console});
 vm.runInContext(fs.readFileSync('./dist/app.js','utf8'),ctx);
 return {nodes,ctx,written:()=>written,handlers,timers,metrics:()=>({created,reads,htmlWrites}),async drain(){for(let tries=0;tries<1000;tries++){await Promise.resolve();if(timers.length){timers.shift().fn();continue;}if(!vm.runInContext('busy',ctx))return;}throw Error('UI did not settle');}};
}
module.exports={boot};
