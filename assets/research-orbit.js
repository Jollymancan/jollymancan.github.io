(() => {
  const stage=document.querySelector('[data-research-map] .research-map-visual');
  if(!stage || !window.IntersectionObserver)return;
  const canvas=document.createElement('canvas');
  canvas.className='research-orbit';canvas.setAttribute('aria-hidden','true');
  stage.insertBefore(canvas,stage.firstChild);
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const points=[];let x=.1,y=1,z=1.05;
  const dt=.008;
  const derivative=(a,b,c)=>[10*(b-a),a*(28-c)-b,a*b-(8/3)*c];
  for(let i=0;i<8500;i++){
    const k1=derivative(x,y,z);
    const k2=derivative(x+k1[0]*dt/2,y+k1[1]*dt/2,z+k1[2]*dt/2);
    const k3=derivative(x+k2[0]*dt/2,y+k2[1]*dt/2,z+k2[2]*dt/2);
    const k4=derivative(x+k3[0]*dt,y+k3[1]*dt,z+k3[2]*dt);
    x+=dt*(k1[0]+2*k2[0]+2*k3[0]+k4[0])/6;
    y+=dt*(k1[1]+2*k2[1]+2*k3[1]+k4[1])/6;
    z+=dt*(k1[2]+2*k2[2]+2*k3[2]+k4[2])/6;
    if(i>600 && i%3===0)points.push([x,z,y]);
  }
  let width=0,height=0,frame=0,raf=0,last=0,visible=false;
  function project(p){return [width*(.5+(p[0]+p[2]*.16)/54),height*(.51+(p[1]-26-p[2]*.13)/79)];}
  function stroke(start,end,color,weight){
    ctx.beginPath();
    for(let i=start;i<end;i++){
      const p=project(points[i%points.length]);
      if(i===start)ctx.moveTo(...p);else ctx.lineTo(...p);
    }
    ctx.strokeStyle=color;ctx.lineWidth=weight;ctx.stroke();
  }
  function draw(){
    if(!width||!height)return;
    ctx.clearRect(0,0,width,height);
    stroke(0,points.length,'rgba(143,125,161,.095)',.75);
    const head=frame%points.length;
    stroke(Math.max(0,head-210),head+1,'rgba(191,161,118,.28)',1.05);
    if(head<210 && frame>=points.length)stroke(points.length-(210-head),points.length,'rgba(191,161,118,.28)',1.05);
  }
  function resize(){
    const rect=stage.getBoundingClientRect();width=rect.width;height=rect.height;
    if(!width||!height)return;
    const ratio=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);draw();
  }
  function tick(time){
    raf=0;if(!visible||motion.matches||document.hidden)return;
    if(time-last>=45){frame=(frame+2)%points.length;draw();last=time;}
    raf=requestAnimationFrame(tick);
  }
  function updatePlayback(){
    cancelAnimationFrame(raf);raf=0;
    if(visible&&!motion.matches&&!document.hidden)raf=requestAnimationFrame(tick);
    else draw();
  }
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;updatePlayback();},{threshold:.05}).observe(stage);
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',updatePlayback);
  if(motion.addEventListener)motion.addEventListener('change',updatePlayback);
  resize();
})();
