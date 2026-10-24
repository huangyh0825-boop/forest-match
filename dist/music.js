(function(root){
'use strict';
// Original, gently looping pentatonic melody. Audio begins only after a user gesture.
const MELODY=[72,null,76,79,81,null,79,76,74,null,76,79,76,null,74,72,69,null,72,76,79,null,76,72,67,null,69,72,74,null,72,null];
class MusicPlayer{
 constructor(factory){this.factory=factory||(()=>new (root.AudioContext||root.webkitAudioContext)());this.context=null;this.timer=null;this.nodes=new Set();this.running=false;this.enabled=true;this.step=0;this.next=0;this.epoch=0;}
 async start(){if(!this.enabled||this.running)return this.running;const epoch=this.epoch;try{this.context??=this.factory();await this.context.resume();if(epoch!==this.epoch||!this.enabled||this.context.state!=='running')return false;if(this.running)return true;this.running=true;this.next=this.context.currentTime+.06;this.step=0;this.tick();this.timer=setInterval(()=>this.tick(),100);return true;}catch{return false;}}
 note(midi,time,duration,gain=.055){const ctx=this.context,osc=ctx.createOscillator(),env=ctx.createGain();osc.type='sine';osc.frequency.value=440*Math.pow(2,(midi-69)/12);env.gain.setValueAtTime(.0001,time);env.gain.exponentialRampToValueAtTime(gain,time+.025);env.gain.exponentialRampToValueAtTime(.0001,time+duration);osc.connect(env);env.connect(ctx.destination);this.nodes.add(osc);osc.onended=()=>{this.nodes.delete(osc);osc.disconnect();env.disconnect();};osc.start(time);osc.stop(time+duration+.02);}
 tick(){if(!this.running)return;const ctx=this.context;if(this.next<ctx.currentTime-.5)this.next=ctx.currentTime+.04;while(this.next<ctx.currentTime+.35){const n=this.step%MELODY.length,note=MELODY[n];if(note!==null)this.note(note,this.next,.8);if(n%8===0){const bass=[48,53,57,55][Math.floor(n/8)];this.note(bass,this.next,2.5,.035);this.note(bass+7,this.next,2.2,.02);}this.next+=.42;this.step++;}}
 pause(){this.epoch++;this.running=false;clearInterval(this.timer);this.timer=null;for(const node of this.nodes){try{node.stop();}catch{}}this.nodes.clear();}
 setEnabled(value){this.enabled=!!value;if(!this.enabled)this.pause();}
}
const api={MusicPlayer,MELODY};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ForestMusic=api;
})(typeof globalThis!=='undefined'?globalThis:this);
