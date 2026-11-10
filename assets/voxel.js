(()=>{
const svg=document.getElementById('isometric'),field=document.getElementById('cube-field');
if(!svg||!field)return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const NS='http://www.w3.org/2000/svg',N=132,colors=[['#3f3a55','#595168','#7e708b'],['#48434e','#655c67','#827980'],['#5d4a3e','#806449','#947751'],['#414b47','#596459','#77796f']];
const seed=(i)=>{let x=Math.sin(i*127.1+43.7)*43758.5453;return x-Math.floor(x)};
const normalize=(points)=>{const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(const p of points)for(let j=0;j<3;j++){min[j]=Math.min(min[j],p[j]);max[j]=Math.max(max[j],p[j])}const scale=Math.max(...max.map((v,j)=>v-min[j]),1);return points.map(p=>p.map((v,j)=>(v-(min[j]+max[j])/2)*7.5/scale))};
const samples=(fn,count=N)=>Array.from({length:count},(_,i)=>fn(i));
const originals=samples(i=>{const x=i%6-2.5,y=Math.floor(i/6)%5-2,z=Math.floor(i/30)%5-2;return [x,y,z]});
const gaussian=samples(i=>{const x=(i%12-5.5)*.62,y=(Math.floor(i/12)%11-5)*.62;const z=4.3*Math.exp(-((x*x+y*y)/5))-1.8;return [x,y,z+(seed(i)*.3-.15)]});
const landscape=samples(i=>{const x=(i%12-5.5)*.6,y=(Math.floor(i/12)%11-5)*.6;return [x,y,1.25*Math.sin(x*1.25)*Math.cos(y*.9)+.24*x*y]});
const tree=samples(i=>{const depth=Math.floor(Math.log2(i+1)),first=2**depth-1,k=i-first,span=2**Math.max(0,5-depth);return [(k-(2**depth-1)/2)*span*.2,depth*.9-2.5,Math.sin(k*2.3)*.22]});
const knight=(()=>{const layers=['...##....','..####...','..#####..','..######.','..######.','..#####..','...####..','....###..','...####..','..#####..','..######.','..######.','.#######.','########.'];const pts=[];for(let y=0;y<layers.length;y++)for(let x=0;x<8;x++)if(layers[y][x]==='#')for(let d=0;d<2;d++)pts.push([(x-3.5)*.72,(7-y)*.66,(d-.5)*.7]);return samples(i=>pts[Math.floor(i*pts.length/N)%pts.length])})();
const network=samples(i=>{const layer=i%4,index=Math.floor(i/4)%9;return [(layer-1.5)*2.25,(index-4)*.77,Math.sin(index*2.2+layer)*.8]});
const shapes=[originals,gaussian,landscape,tree,knight,network].map(normalize);
const order=(points)=>points.slice().sort((a,b)=>a[0]*.7+a[1]*.3+a[2]*.6-(b[0]*.7+b[1]*.3+b[2]*.6));
const targets=shapes.map(order);
field.replaceChildren();
const cubes=samples(i=>{const g=document.createElementNS(NS,'g');const polys=[0,1,2].map(()=>{const p=document.createElementNS(NS,'polygon');g.appendChild(p);return p});field.appendChild(g);return {g,polys,p:targets[0][i].slice(),start:targets[0][i].slice(),end:targets[0][i].slice(),color:colors[Math.floor(seed(i+17)*colors.length)]}});
const view=svg.viewBox.baseVal;
function draw(c){const [x,y,z]=c.p,unit=7.5,sx=240+(x-y)*unit*1.12,sy=202+(x+y)*unit*.55-z*unit*1.15,w=unit*1.12,h=unit*.55,d=unit*.9;const polys=[[[sx,sy],[sx-w,sy-h],[sx,sy-2*h],[sx+w,sy-h]],[[sx-w,sy-h],[sx,sy],[sx,sy+d],[sx-w,sy-h+d]],[[sx,sy],[sx+w,sy-h],[sx+w,sy-h+d],[sx,sy+d]]];for(let j=0;j<3;j++){c.polys[j].setAttribute('points',polys[j].map(v=>v.join(',')).join(' '));c.polys[j].setAttribute('fill',c.color[[2,0,1][j]])}}
function render(){for(const c of cubes)draw(c);const sorted=cubes.slice().sort((a,b)=>(a.p[0]+a.p[1]+a.p[2]*.01)-(b.p[0]+b.p[1]+b.p[2]*.01));for(const c of sorted)field.appendChild(c.g)}
let current=0,begin=0,duration=2100,active=false,raf=0,last=0;
function next(now){if(reduce.matches)return;current=(current+1)%targets.length;begin=now;active=true;for(let i=0;i<N;i++){cubes[i].start=cubes[i].p.slice();cubes[i].end=targets[current][i]}}
function frame(now){if(document.hidden){raf=0;return}if(!reduce.matches){if(!active&&now-last>7200){next(now);last=now}if(active){const t=Math.min(1,(now-begin)/duration),e=t*t*(3-2*t);for(let i=0;i<N;i++)for(let j=0;j<3;j++)cubes[i].p[j]=cubes[i].start[j]+(cubes[i].end[j]-cubes[i].start[j])*e;if(t===1){active=false;last=now}}}render();raf=requestAnimationFrame(frame)}
render();
const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}else if(!entries[0].isIntersecting&&raf){cancelAnimationFrame(raf);raf=0}},{threshold:.05});observer.observe(svg);
svg.parentElement.addEventListener('click',()=>{if(reduce.matches)return;next(performance.now());if(!raf)raf=requestAnimationFrame(frame)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}});
})();