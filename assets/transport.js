(()=>{
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
canvas.className='transport-field';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);
const random=i=>{const x=Math.sin(i*127.1+29.4)*43758.5453;return x-Math.floor(x)};
let w=0,h=0,dpr=1,raf=0,phase=0,last=0,mode=0,from=[],to=[],hover={x:-999,y:-999},points=[];
const count=innerWidth<700?72:130;
function layout(k){return Array.from({length:count},(_,i)=>{const t=i/count*Math.PI*2,u=random(i*7+k*31),v=random(i*13+k*47);let x,y;const center=innerWidth<700?[.78,.76]:[.82,.45];if(k%3===0){const a=t*2.5,r=.12+.23*u;x=center[0]+r*Math.cos(a);y=center[1]+r*.68*Math.sin(a)}else if(k%3===1){x=center[0]+(u-.5)*.43;y=center[1]+.17*Math.sin(u*11+k)+.08*(v-.5)}else{const a=t*3,r=.05+.22*u;x=center[0]+r*Math.cos(a);y=center[1]+r*Math.sin(a)}return [Math.max(.03,Math.min(.97,x))*w,Math.max(.03,Math.min(.97,y))*h]})}
function match(a,b){const used=new Uint8Array(b.length);return a.map(p=>{let index=-1,best=Infinity;for(let j=0;j<b.length;j++){if(used[j])continue;const dx=p[0]-b[j][0],dy=p[1]-b[j][1],cost=dx*dx+dy*dy;if(cost<best){best=cost;index=j}}used[index]=1;return b[index]})}
function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);from=layout(mode);to=match(from,layout(mode+1));points=from.map(p=>p.slice());phase=0}
function frame(now){if(document.hidden){raf=0;return}const dt=Math.min(50,now-(last||now));last=now;phase+=dt/12500;if(phase>=1){mode++;from=points.map(p=>p.slice());to=match(from,layout(mode+1));phase=0}const t=phase*phase*(3-2*phase);ctx.clearRect(0,0,w,h);for(let i=0;i<count;i++){const x=from[i][0]+(to[i][0]-from[i][0])*t,y=from[i][1]+(to[i][1]-from[i][1])*t;points[i]=[x,y];const dx=x-hover.x,dy=y-hover.y,d2=dx*dx+dy*dy,f=Math.max(0,1-d2/24000)*24/Math.sqrt(d2+1),px=x+dx*f,py=y+dy*f;ctx.beginPath();ctx.arc(px,py,i%9===0?1.7:1.05,0,Math.PI*2);ctx.fillStyle=i%3===0?'rgba(218,179,109,.46)':'rgba(150,133,177,.39)';ctx.fill()}raf=requestAnimationFrame(frame)}
document.addEventListener('pointermove',e=>{hover.x=e.clientX;hover.y=e.clientY},{passive:true});
document.addEventListener('pointerout',e=>{if(!e.relatedTarget){hover.x=-999;hover.y=-999}},{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf){last=0;raf=requestAnimationFrame(frame)}});
addEventListener('resize',resize,{passive:true});resize();raf=requestAnimationFrame(frame);
})();