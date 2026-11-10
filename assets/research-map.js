(() => {
  const root = document.querySelector('[data-research-map]');
  if (!root) return;

  // Percent coordinates keep the figure resolution-independent.
  const topics = [
    { id:'online', name:'Online learning', x:22, y:28, detail:'Learning sequentially from feedback, with guarantees on regret.' },
    { id:'bandits', name:'Convex bandits', x:49, y:18, detail:'Optimizing convex losses when only limited, bandit feedback is available.' },
    { id:'optimization', name:'Optimization', x:79, y:32, detail:'The mathematical tools underlying efficient learning and decision-making.' },
    { id:'games', name:'Game theory', x:19, y:75, detail:'Studying strategic interaction and no-regret learning in repeated games.' },
    { id:'rl', name:'Reinforcement learning', x:53, y:76, detail:'Sequential decisions, exploration, and learning from rewards.' },
    { id:'ot', name:'Optimal transport', x:83, y:76, detail:'Comparing distributions geometrically, with connections to learning and adaptation.' }
  ];
  const edges = [['online','bandits'],['online','games'],['online','rl'],['bandits','optimization'],['bandits','rl'],['optimization','ot'],['rl','ot'],['games','rl']];
  const svg = root.querySelector('.research-map-lines');
  const stage = root.querySelector('.research-map-visual');
  const title = root.querySelector('[data-map-topic]');
  const description = root.querySelector('[data-map-description]');
  const ns = 'http://www.w3.org/2000/svg';
  const byId = Object.fromEntries(topics.map(t => [t.id,t]));
  const lines = [];
  const buttons = new Map();
  let selected = null;

  edges.forEach(([a,b]) => {
    const line = document.createElementNS(ns,'line');
    line.setAttribute('x1',byId[a].x);line.setAttribute('y1',byId[a].y);
    line.setAttribute('x2',byId[b].x);line.setAttribute('y2',byId[b].y);
    svg.appendChild(line);
    lines.push({line,a,b});
  });
  topics.forEach(topic => {
    const button = document.createElement('button');
    button.type='button';button.className='research-node';
    button.textContent=topic.name;
    button.style.left=topic.x+'%';button.style.top=topic.y+'%';
    button.setAttribute('aria-pressed','false');
    button.setAttribute('aria-label',topic.name+': '+topic.detail);
    button.addEventListener('mouseenter',()=>show(topic.id));
    button.addEventListener('focus',()=>show(topic.id));
    button.addEventListener('click',()=>{selected=selected===topic.id?null:topic.id;show(selected);});
    stage.appendChild(button);
    buttons.set(topic.id,button);
  });
  function show(id) {
    lines.forEach(({line,a,b})=>line.classList.toggle('is-active',!!id&&(a===id||b===id)));
    buttons.forEach((button,key)=>{
      button.classList.toggle('is-active',key===id);
      button.setAttribute('aria-pressed',String(selected===key));
    });
    const topic=id&&byId[id];
    title.textContent=topic?topic.name:'Explore the connections';
    description.textContent=topic?topic.detail:'Select or hover over a topic to see how my interests connect.';
  }
  root.addEventListener('mouseleave',()=>show(selected));
  root.addEventListener('focusout',event=>{
    if(!root.contains(event.relatedTarget))show(selected);
  });
  show(null);
})();
