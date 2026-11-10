(()=>{
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const canvas=document.createElement('canvas');canvas.className='cell-field';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
let w=0,h=0,cols=0,rows=0,a,b,im,frame=0,raf=0,visible=true,down=false,px=-1,py=-1;
const cell=6,rate=80,seed=(x,y)=>{const t=Math.sin(x*127.1+y*311.7)*43758.5453;return t-Math.floor(t)};
function resize(){const d=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(d,0,0,d,0,0);cols=Math.ceil(w/cell);rows=Math.ceil(h/cell);a=new Uint8Array(cols*rows);b=new Uint8Array(a.length);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)a[y*cols+x]=seed(x,y)>.86?1:0;im=ctx.createImageData(canvas.width,canvas.height)}
function disturb(x,y){const cx=Math.floor(x/cell),cy=Math.floor(y/cell);for(let dy=-5;dy<=5;dy++)for(let dx=-5;dx<=5;dx++){const xx=cx+dx,yy=cy+dy;if(xx<1||yy<1||xx>=cols-1||yy>=rows-1||dx*dx+dy*dy>27)continue;a[yy*cols+xx]=seed(xx+frame,yy+frame)>.35?1:0}}
function tick(){for(let y=1;y<rows-1;y++)for(let x=1;x<cols-1;x++){const i=y*cols+x,n=a[i-cols-1]+a[i-cols]+a[i-cols+1]+a[i-1]+a[i+1]+a[i+cols-1]+a[i+cols]+a[i+cols+1];b[i]=n===3||(a[i]&&n===2)?1:0}const t=a;a=b;b=t;if(frame%45===0){const x=3+Math.floor(seed(frame,7)*(cols-6)),y=3+Math.floor(seed(frame,11)*(rows-6));disturb(x*cell,y*cell)}}
function draw(){ctx.clearRect(0,0,w,h);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const i=y*cols+x;if(!a[i])continue;const shade=seed(x,y);ctx.fillStyle=shade>.7?'rgba(218,179,109,.24)':'rgba(146,128,172,.21)';ctx.fillRect(x*cell,y*cell,Math.max(1,cell-2),Math.max(1,cell-2))}}
let last=0;function loop(now){if(!visible||document.hidden){raf=0;return}if(now-last>rate){last=now;frame++;tick();draw()}raf=requestAnimationFrame(loop)}
const move=e=>{if(e.target.closest('a,button,input,textarea,select,summary'))return;if(e.type==='pointermove'&&!down)return;disturb(e.clientX,e.clientY)};
document.addEventListener('pointerdown',e=>{down=true;move(e)},{passive:true});document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerup',()=>down=false,{passive:true});document.addEventListener('pointercancel',()=>down=false,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(loop)}});
const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(loop)},{threshold:0});io.observe(document.body);
addEventListener('resize',resize,{passive:true});resize();raf=requestAnimationFrame(loop);
})();