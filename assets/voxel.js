(()=>{
const svg=document.getElementById('isometric');if(!svg)return;
const host=svg.parentElement,canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
canvas.className='voxel-canvas';canvas.setAttribute('aria-hidden','true');host.insertBefore(canvas,svg);svg.style.display='none';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 700px)');
const palette=[['#7e708b','#3f3a55','#595168'],['#827980','#48434e','#655c67'],['#947751','#5d4a3e','#806449'],['#77796f','#414b47','#596459']];
const rnd=i=>{const t=Math.sin(i*127.1+17.8)*43758.5453;return t-Math.floor(t)};
const P=[],push=(a,x,y,z)=>a.push([x,y,z]);
const original=[];for(let x=-4;x<=4;x++)for(let y=-4;y<=4;y++)for(let z=0;z<2+Math.floor(rnd(x*19+y*13+80)*3);z++)push(original,x*.7,y*.7,z*.7-1.6);
const bell=[];for(let x=-11;x<=11;x++)for(let y=-11;y<=11;y++){const h=5.7*Math.exp(-(x*x+y*y)/72);for(let z=0;z<Math.round(h);z++)push(bell,x*.32,y*.32,z*.53-2)}
const landscape=[];for(let x=-11;x<=11;x++)for(let y=-11;y<=11;y++){const h=2.6+1.3*Math.sin(x*.35)*Math.cos(y*.28)+.7*Math.cos((x+y)*.31);for(let z=0;z<Math.max(1,Math.round(h));z++)push(landscape,x*.32,y*.32,z*.6-2.1)}
const tree=[];const line=(a,p,q,n)=>{for(let j=0;j<=n;j++){const t=j/n;push(a,p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,p[2]+(q[2]-p[2])*t)}};
const branch=(x,y,z,depth,span)=>{if(depth>4)return;const end=[x,y,z+1.35];line(tree,[x,y,z],end,7);if(depth===4)return;branch(x-span,y+.22,z+1.35,depth+1,span*.52);branch(x+span,y-.22,z+1.35,depth+1,span*.52);line(tree,end,[x-span,y+.22,z+2.7],8);line(tree,end,[x+span,y-.22,z+2.7],8)};
branch(0,0,-3.6,0,2.4);
const knight=[];const silhouette=['......####.....','.....######....','....########...','...##########..','..###########..','..########.....','...#######.....','....######.....','.....######....','......######...','......#######..','.....########..','....#########..','...##########..','..###########..','..############.','..############.','..############.','.##############','###############'];
for(let y=0;y<silhouette.length;y++)for(let x=0;x<15;x++)if(silhouette[y][x]==='#')for(let d=-1;d<=1;d++)push(knight,(x-7)*.43,d*.43,(silhouette.length/2-y)*.43);
const network=[];for(let layer=0;layer<4;layer++){const count=[5,7,7,4][layer];for(let j=0;j<count;j++){const x=(layer-1.5)*2.25,z=(j-(count-1)/2)*1.04;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let d=-1;d<=1;d++)if(a*a+b*b+d*d<=2)push(network,x+a*.22,b*.22,z+d*.22)}}
for(let layer=0;layer<3;layer++){const n1=[5,7,7][layer],n2=[7,7,4][layer+0];for(let i=0;i<n1;i++)for(let j=0;j<n2;j++)if((i*3+j*5+layer)%4===0)line(network,[(layer-1.5)*2.25,0,(i-(n1-1)/2)*1.04],[(layer-.5)*2.25,0,(j-(n2-1)/2)*1.04],10)}
const shapes=[original,bell,landscape,tree,knight,network];
const normalize=pts=>{const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];for(const p of pts)for(let k=0;k<3;k++){lo[k]=Math.min(lo[k],p[k]);hi[k]=Math.max(hi[k],p[k])}const scale=Math.max(hi[0]-lo[0],hi[1]-lo[1],hi[2]-lo[2]);return pts.map(p=>p.map((v,k)=>(v-(lo[k]+hi[k])*.5)*8.7/scale))};
const sets=shapes.map(normalize).map(s=>s.sort((a,b)=>(a[0]*.53+a[1]*.29+a[2]*.47)-(b[0]*.53+b[1]*.29+b[2]*.47)));
const cap=mobile.matches?780:1350;
const size=Math.min(cap,Math.max(...sets.map(s=>s.length)));
const sample=s=>Array.from({length:size},(_,i)=>s[Math.min(s.length-1,Math.floor(i*s.length/size))]);
const targets=sets.map(sample),counts=sets.map(s=>Math.min(s.length,size));
const cubes=Array.from({length:size},(_,i)=>({p:targets[0][i].slice(),from:targets[0][i].slice(),to:targets[0][i].slice(),opacity:i<counts[0]?1:0,startOpacity:i<counts[0]?1:0,endOpacity:0,color:palette[Math.floor(rnd(i+31)*4)],offset:0}));
let width=0,height=0,dpr=1,active=false,idx=0,last=0,begin=0,raf=0,inside=false,pointer=[-999,-999];
function resize(){const r=host.getBoundingClientRect();width=r.width;height=r.height;dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
function project(p){const s=Math.min(width/13.8,height/12.8);return [width*.5+(p[0]-p[1])*s*.8,height*.51+(p[0]+p[1])*s*.39-p[2]*s*.88,s]}
function face(pts,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();ctx.fill()}
function draw(){ctx.clearRect(0,0,width,height);const list=cubes.filter(c=>c.opacity>.025).sort((a,b)=>(a.p[0]+a.p[1]+a.p[2]*.02)-(b.p[0]+b.p[1]+b.p[2]*.02));for(const c of list){const [x,y,s]=project(c.p),u=Math.max(1.25,s*.26),v=u*.48,d=u*.82;ctx.globalAlpha=c.opacity*.94;face([[x,y-v*2],[x+u,y-v],[x,y],[x-u,y-v]],c.color[0]);face([[x-u,y-v],[x,y],[x,y+d],[x-u,y-v+d]],c.color[1]);face([[x,y],[x+u,y-v],[x+u,y-v+d],[x,y+d]],c.color[2])}ctx.globalAlpha=1}
function next(now){idx=(idx+1)%targets.length;begin=now;active=true;for(let i=0;i<size;i++){const c=cubes[i];c.from=c.p.slice();c.to=targets[idx][i];c.startOpacity=c.opacity;c.endOpacity=i<counts[idx]?1:0}}
function frame(now){if(document.hidden||!inside){raf=0;return}if(!reduced.matches){if(!active&&now-last>6500)next(now);if(active){const t=Math.min(1,(now-begin)/2400),e=t*t*(3-2*t);for(const c of cubes){for(let j=0;j<3;j++)c.p[j]=c.from[j]+(c.to[j]-c.from[j])*e;c.opacity=c.startOpacity+(c.endOpacity-c.startOpacity)*e}if(t===1){active=false;last=now}}}draw();raf=requestAnimationFrame(frame)}
host.addEventListener('click',()=>{if(!reduced.matches)next(performance.now())});
host.addEventListener('pointermove',e=>{pointer=[e.clientX,e.clientY]},{passive:true});
const io=new IntersectionObserver(entries=>{inside=entries[0].isIntersecting;if(inside&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}},{threshold:.01});io.observe(host);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&inside&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}});
addEventListener('resize',resize,{passive:true});resize();draw();
})();