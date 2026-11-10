(()=>{
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
canvas.className='transport-field';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);
const rnd=i=>{const x=Math.sin(i*127.1+29.4)*43758.5453;return x-Math.floor(x)};
let w=0,h=0,dpr=1,raf=0,phase=0,last=0,mode=0,from=[],to=[],points=[],hover={x:-1000,y:-1000},visible=true;
const count=innerWidth<700?44:90;
function distribution(kind){return Array.from({length:count},(_,i)=>{const u=rnd(i*7+kind*101),v=rnd(i*13+kind*173),t=i/count*Math.PI*2;let x,y;if(kind%4===0){x=.08+.84*u;y=.08+.84*v}else if(kind%4===1){const r=.12+.28*Math.sqrt(u);x=.5+r*Math.cos(t*3);y=.5+r*Math.sin(t*3)}else if(kind%4===2){x=.5+.34*Math.cos(t)*(.3+.7*u);y=.5+.24*Math.sin(t)*(.3+.7*u)}else{x=.13+.74*u;y=.5+.18*Math.sin(x*12+kind)+.14*(v-.5)}return [x*w,y*h]})}
function assign(source,dest){const used=new Uint8Array(dest.length),out=[];for(const p of source){let best=-1,cost=Infinity;for(let j=0;j<dest.length;j++){if(used[j])continue;const dx=p[0]-dest[j][0],dy=p[1]-dest[j][1],d=dx*dx+dy*dy;if(d<cost){cost=d;best=j}}used[best]=1;out.push(dest[best])}return out}
function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);points=distribution(mode);from=points.map(p=>p.slice());to=assign(from,distribution(mode+1));phase=0}
function step(now){if(document.hidden||!visible){raf=0;return}const dt=Math.min(50,now-(last||now));last=now;phase+=dt/14500;if(phase>=1){mode++;from=points.map(p=>p.slice());to=assign(from,distribution(mode+1));phase=0}const t=phase*phase*(3-2*phase);ctx.clearRect(0,0,w,h);for(let i=0;i<count;i++){const p=points[i],x=from[i][0]+(to[i][0]-from[i][0])*t,y=from[i][1]+(to[i][1]-from[i][1])*t;const dx=x-hover.x,dy=y-hover.y,d2=dx*dx+dy*dy,repel=Math.max(0,1-d2/18000);const k=repel*18/Math.sqrt(d2+1);const tx=x+dx*k,ty=y+dy*k;p[0]=x;p[1]=y;ctx.beginPath();ctx.arc(tx,ty,i%8===0?1.35:.9,0,Math.PI*2);ctx.fillStyle=i%4===0?'rgba(218,179,109,.23)':'rgba(153,136,178,.17)';ctx.fill()}raf=requestAnimationFrame(step)}
document.addEventListener('pointermove',e=>{hover.x=e.clientX;hover.y=e.clientY},{passive:true});
document.addEventListener('pointerleave',()=>{hover.x=-1000;hover.y=-1000},{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf){last=0;raf=requestAnimationFrame(step)}});
addEventListener('resize',resize,{passive:true});resize();raf=requestAnimationFrame(step);
})();