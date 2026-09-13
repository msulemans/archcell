const projects=[
{id:'courtyard-house',name:'The Courtyard House',location:'DHA, Lahore',type:'Residential',image:'residence.jpg',area:'1 kanal',year:'2025',theme:'Light, openness, connection.',description:'A quiet retreat around an open heart. Layered volumes, deep shade and generous greenery create a home that balances togetherness with moments of privacy.',materials:'Natural stone / Oak / Clear glass'},
{id:'stone-residence',name:'The Stone Residence',location:'Bahria Town, Lahore',type:'Residential',image:'hero-night.jpg',area:'10 marla',year:'2025',theme:'Warmth, framed in stone.',description:'An expressive stone facade gives way to a warm, luminous interior. Double-height spaces and a restrained material palette make ordinary evenings feel special.',materials:'Textured stone / Timber / Bronze'},
{id:'white-house',name:'House of Light',location:'DHA, Lahore',type:'Residential',image:'facade-detail.jpg',area:'1 kanal',year:'2024',theme:'A conversation with the sky.',description:'Sculpted white volumes hold a careful balance of openness and shelter. Every opening is an invitation for daylight, every shaded edge a place to pause.',materials:'White render / Concrete / Glass'},
{id:'garden-residence',name:'The Garden Residence',location:'Lake City, Lahore',type:'Residential',image:'villa-lawn.jpg',area:'2 kanal',year:'2024',theme:'Life, opening to the garden.',description:'Long horizontal lines connect family life with the landscape. Open living spaces, sheltered terraces and broad views give this generous home an easy rhythm.',materials:'Limestone / Timber / Landscape'},
{id:'quiet-courtyard',name:'A Quiet Courtyard',location:'Gulberg, Lahore',type:'Residential',image:'courtyard.jpg',area:'10 marla',year:'2023',theme:'An inward-looking sanctuary.',description:'A garden at the heart of the home brings a little of the outside into every day. Raw materials and soft planting offer a thoughtful retreat from the city.',materials:'Exposed concrete / Steel / Greenery'},
{id:'warm-minimalism',name:'The Warm Edit',location:'DHA, Lahore',type:'Interiors',image:'interior.jpg',area:'1 kanal',year:'2023',theme:'A softer kind of minimalism.',description:'Rich timber, tactile fabrics and subtle colour bring depth to a pared-back family interior. Comfort is designed into the details, from bespoke joinery to layered light.',materials:'Oak / Linen / Brushed brass'}
];
const grid=document.querySelector('#project-grid');
function renderProjects(){grid.innerHTML=projects.map((p,i)=>`<a class="project-card reveal" href="#project/${p.id}"><div class="project-image"><img src="/assets/${p.image}" alt="${p.name} — architectural inspiration" loading="lazy"><span class="project-number">0${i+1} / ${p.type.toUpperCase()}</span></div><div class="project-info"><div><h3>${p.name}</h3><p>${p.location}<span>·</span>${p.area}<span>·</span>${p.year}</p></div><span class="project-arrow" aria-hidden="true">↗</span></div></a>`).join('');observeReveals();}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
function observeReveals(){document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}
renderProjects();
const menuButton=document.querySelector('.menu-button'),mobileNav=document.querySelector('.mobile-nav');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');mobileNav.classList.remove('open');mobileNav.inert=true;document.body.classList.remove('locked')}
menuButton.addEventListener('click',()=>{const opened=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!opened));mobileNav.classList.toggle('open',!opened);mobileNav.inert=opened;document.body.classList.toggle('locked',!opened)});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

// Each sheet is an original, clearly marked illustrative diagram for the design preview.
const sheets=[
{code:'A-101',name:'Ground floor plan',category:'Architecture',kind:'plan'},
{code:'A-102',name:'First floor plan',category:'Architecture',kind:'upper'},
{code:'A-103',name:'Roof & terrace plan',category:'Architecture',kind:'roof'},
{code:'A-104',name:'Building section AA',category:'Architecture',kind:'section'},
{code:'A-201',name:'Front elevation',category:'Elevations',kind:'elevation'},
{code:'A-202',name:'Rear elevation',category:'Elevations',kind:'rear'},
{code:'S-101',name:'Foundation layout',category:'Structural',kind:'foundation'},
{code:'S-102',name:'Column layout',category:'Structural',kind:'columns'},
{code:'S-103',name:'Slab framing plan',category:'Structural',kind:'slab'},
{code:'E-101',name:'Lighting layout',category:'Electrical',kind:'lighting'},
{code:'E-102',name:'Power & socket layout',category:'Electrical',kind:'power'},
{code:'E-103',name:'Switching circuits',category:'Electrical',kind:'switches'},
{code:'P-101',name:'Water supply layout',category:'Plumbing',kind:'water'},
{code:'P-102',name:'Drainage layout',category:'Plumbing',kind:'drainage'},
{code:'P-103',name:'Sanitary fixture layout',category:'Plumbing',kind:'sanitary'},
{code:'I-101',name:'Furniture layout',category:'Interiors',kind:'furniture'},
{code:'I-102',name:'Reflected ceiling plan',category:'Interiors',kind:'ceiling'},
{code:'I-103',name:'Kitchen joinery detail',category:'Interiors',kind:'joinery'}
];
const cats=['All drawings','Architecture','Elevations','Structural','Electrical','Plumbing','Interiors'];
function escapeXML(value){return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}
function drawingSVG(sheet,project=projects[0],compact=false){
 const {kind}=sheet;const text=(x,y,t,size=10,fill='#7a806e')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-family="Arial,sans-serif" text-anchor="middle">${escapeXML(t)}</text>`;
 const rect=(x,y,w,h,more='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${more}/>`;
 const line=(x1,y1,x2,y2,more='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${more}/>`;
 let content='';
 const dim=(x1,y1,x2,y2,label)=>`<g stroke="#a7ac9c" stroke-width=".65">${line(x1,y1,x2,y2)}${line(x1-4,y1-4,x1+4,y1+4)}${line(x2-4,y2-4,x2+4,y2+4)}</g>${text((x1+x2)/2,(y1+y2)/2-8,label,9)}`;
 const elevation=['elevation','rear','section','joinery'].includes(kind);
 if(elevation){
   if(kind==='joinery'){
    content=`<g fill="none" stroke="#7f866f" stroke-width="2">${rect(165,150,470,235)}${line(165,245,635,245)}${line(165,275,635,275)}${[0,1,2,3,4].map(i=>rect(169+i*94,278,86,103)).join('')}${[0,1,2,3].map(i=>rect(169+i*117,154,109,87)).join('')}${rect(353,296,87,66)}${rect(460,247,90,25)}${line(507,247,507,227)}</g><g stroke="#b6a277">${[0,1,2,3,4].map(i=>line(235+i*94,306,244+i*94,306)).join('')}</g>${dim(165,412,635,412,'KITCHEN JOINERY / SCHEMATIC')}${text(400,120,'ELEVATION 01 — KITCHEN',12)}`;
   }else{
    const cut=kind==='section';content=`<g fill="none" stroke="#737d68" stroke-width="2">${rect(170,160,470,245)}${rect(150,270,510,14)}${rect(160,146,490,14)}${rect(200,300,120,105)}${rect(352,300,150,105)}${rect(530,290,75,115)}${rect(206,178,175,70)}${rect(429,178,185,70)}${line(292,178,292,248)}${line(518,178,518,248)}${line(397,300,397,405)}${line(447,300,447,405)}${line(120,408,690,408)}</g><g stroke="#a0a78f" stroke-width=".7">${Array.from({length:12},(_,i)=>line(178+i*8,162,178+i*8,267)).join('')}${line(179,251,390,251)}${line(179,260,390,260)}</g>${cut?`<g stroke="#757e68" fill="none">${Array.from({length:10},(_,i)=>line(345+i*14,390-i*11,360+i*14,390-i*11)).join('')}${line(344,399,491,279)}</g>${text(275,337,'LIVING',10)}${text(513,215,'BEDROOM',10)}`:''}${dim(160,121,650,121,'ILLUSTRATIVE ELEVATION — NOT TO SCALE')}${dim(700,147,700,406,'')}${text(736,282,'LEVELS',9)}${text(115,152,'ROOF',9)}${text(108,276,'LEVEL 01',9)}${text(108,408,'GROUND',9)}${kind==='rear'?`<g stroke="#858e78" fill="none">${rect(534,160,60,105)}${line(120,431,680,431)}</g>`:''}`;
   }
 }else{
   const roomNames=kind==='upper'?['BEDROOM 01','BEDROOM 02','FAMILY LOUNGE','TERRACE','BATH','BEDROOM 03']:kind==='roof'?['ROOF','SOLAR ZONE','OPEN TERRACE','LIGHT WELL','SERVICES','ROOF GARDEN']:['DRAWING ROOM','DINING','FAMILY LOUNGE','COURTYARD','KITCHEN','BEDROOM'];
   content=`<g fill="none" stroke="#64725c" stroke-width="3">${rect(208,108,388,328)}${line(208,228,360,228)}${line(360,108,360,228)}${line(360,228,596,228)}${line(437,108,437,228)}${line(208,338,360,338)}${line(360,228,360,436)}${line(360,338,596,338)}${line(484,338,484,436)}</g><g stroke="#a2a991" stroke-width=".9" fill="none">${rect(215,115,374,314)}${rect(223,101,109,12)}${rect(444,101,105,12)}${rect(223,430,103,12)}${rect(500,430,69,12)}${rect(590,246,12,65)}${rect(370,244,209,77,'stroke-dasharray="4 4"')}${Array.from({length:9},(_,i)=>line(209,240+i*9,249,240+i*9)).join('')}${line(229,316,229,245)}${line(229,245,225,251)}${line(229,245,233,251)}</g><g stroke="#e8eadd" stroke-width="7">${line(302,228,334,228)}${line(360,180,360,212)}${line(470,228,501,228)}${line(360,287,360,320)}${line(391,338,422,338)}${line(520,338,551,338)}</g><g stroke="#7e896e" stroke-width=".8" fill="none"><path d="M302 228V196Q334 196 334 228"/><path d="M360 180H392Q392 212 360 212"/><path d="M470 228V196Q502 196 502 228"/><path d="M391 338V369Q422 369 422 338"/></g>${text(285,171,roomNames[0])}${text(518,172,roomNames[1])}${text(291,290,roomNames[2],9)}${text(472,284,roomNames[3])}${text(420,390,roomNames[4])}${text(539,390,roomNames[5])}${text(398,172,'FOYER',9)}${text(285,390,'ENTRY / PORCH',9)}${dim(208,83,596,83,'ILLUSTRATIVE PLAN — NOT TO SCALE')}${dim(178,108,178,436,'')}${text(155,270,'NTS',9)}<g stroke="#7f886e" fill="none">${line(666,159,666,113)}<path d="M658 124L666 108L674 124Z"/></g>${text(666,99,'N',11)}`;
   if(['lighting','power','switches','ceiling'].includes(kind)){
    const pts=[[250,145],[315,145],[477,145],[551,145],[275,265],[310,314],[395,264],[551,306],[392,365],[460,411],[519,366],[566,411]];
    content+=`<g stroke="#bd934a" stroke-width="1.3" fill="none">${pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6"/>${line(x-4,y-4,x+4,y+4)}${line(x-4,y+4,x+4,y-4)}`).join('')}${['switches','power'].includes(kind)?pts.map(([x,y],i)=>line(x,y,360,i<4?190:i<8?302:397,'stroke-dasharray="5 4"')).join(''):''}${kind==='ceiling'?rect(234,126,100,83,'stroke-dasharray="4 3"'):''}</g>${text(405,477,kind==='power'?'POWER POINTS / INDICATIVE LOCATIONS':kind==='switches'?'DASHED LINES: SAMPLE SWITCHING CIRCUITS':'LIGHTING POINTS / INDICATIVE LOCATIONS',10,'#aa8547')}`;
   }else if(['water','drainage','sanitary'].includes(kind)){
    content+=`<g stroke="${kind==='drainage'?'#a57858':'#568990'}" fill="none" stroke-width="2"><path d="M625 442V360H421V391M625 360V130H555V165M625 300H562" ${kind==='drainage'?'stroke-dasharray="6 4"':''}/>${rect(411,369,25,21)}${rect(549,148,27,24)}<circle cx="625" cy="360" r="6"/>${kind==='sanitary'?rect(552,278,21,27):''}</g>${text(405,477,kind==='drainage'?'DRAINAGE ROUTES / DIAGRAM ONLY':'WATER & FIXTURE LOCATIONS / DIAGRAM ONLY',10,'#568990')}`;
   }else if(['foundation','columns','slab'].includes(kind)){
    content+=`<g fill="${kind==='foundation'?'none':'#9a8260'}" stroke="#9a8260" stroke-width="1.4">${[208,360,596].flatMap(x=>[108,228,338,436].map(y=>rect(x-9,y-9,18,18))).join('')}</g><g stroke="#9a8260" stroke-width=".9" stroke-dasharray="5 5">${[208,360,596].map(x=>line(x,64,x,461)).join('')}${[108,228,338,436].map(y=>line(184,y,630,y)).join('')}${kind==='slab'?Array.from({length:9},(_,i)=>line(220+i*40,115,220+i*40,428)).join(''):''}</g>${text(405,477,'STRUCTURAL CONCEPT / ENGINEERING DESIGN REQUIRED',10,'#9a8260')}`;
   }else if(kind==='furniture'){
    content+=`<g stroke="#889372" stroke-width="1.2" fill="none">${rect(224,129,17,66)}${rect(251,127,73,18)}${rect(264,172,48,23)}${rect(478,145,73,46,'rx="15"')}${rect(501,356,69,58)}${rect(505,359,27,17,'rx="3"')}${rect(537,359,27,17,'rx="3"')}${rect(373,348,73,13)}${rect(373,348,13,60)}</g>`;
   }
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 570" role="img" aria-label="${escapeXML(sheet.name)}, illustrative sample drawing"><rect width="800" height="570" fill="#e8eadd"/><rect x="20" y="20" width="760" height="530" fill="none" stroke="#aeb49e" stroke-width=".7"/>${text(400,46,'A R C H C E L L   /   T H E   D R A W I N G   R O O M',10)}${content}<g stroke="#9fa78e" stroke-width=".7">${line(20,500,780,500)}${line(570,500,570,550)}</g><text x="38" y="521" font-size="11" fill="#3f5036" font-family="Arial">${escapeXML(project.name.toUpperCase())} — ${escapeXML(sheet.name.toUpperCase())}</text><text x="38" y="539" font-size="9" fill="#727d62" font-family="Arial">DESIGN PREVIEW · ILLUSTRATIVE ONLY · NOT FOR CONSTRUCTION</text>${text(675,522,sheet.code,14,'#3f5036')}${text(675,539,'SAMPLE / NTS',9)}</svg>`;
}
document.querySelector('#plan-teaser').innerHTML=drawingSVG(sheets[0]);
let activeProject=projects[0],category='Architecture',currentSheet=0,zoom=1;
const detail=document.querySelector('#project-view'),main=document.querySelector('#main-content'),transition=document.querySelector('.page-transition');
function renderDetail(project){
 activeProject=project;category='Architecture';const next=projects[(projects.indexOf(project)+1)%projects.length];
 detail.innerHTML=`<article><section class="project-hero"><img src="/assets/${project.image}" alt="${project.name} — reference photography"><div class="project-hero-shade"></div><a class="project-back" href="#work">← Back to selected work</a><div class="project-hero-title"><p class="eyebrow">${project.type.toUpperCase()} / CONCEPT SHOWCASE</p><h1 tabindex="-1">${project.name}</h1><p>${project.location}<span>·</span>${project.year}</p></div><a href="#project/${project.id}/drawings" class="project-hero-cta">Explore the drawings <span>↓</span></a></section><div class="project-subnav"><a href="#project/${project.id}">The story</a><a href="#project/${project.id}/drawings">Drawing catalogue <span>18</span></a><span>${project.area} / ${project.type}</span></div><section class="project-story section-pad"><div><p class="eyebrow">THE IDEA</p><h2>${project.theme}</h2></div><div><p>${project.description}</p><dl class="project-facts"><div><dt>LOCATION</dt><dd>${project.location}</dd></div><div><dt>PLOT SIZE</dt><dd>${project.area}</dd></div><div><dt>MATERIAL PALETTE</dt><dd>${project.materials}</dd></div><div><dt>PROJECT SCOPE</dt><dd>Architecture, interiors & working drawings</dd></div></dl><p class="project-disclaimer">Concept showcase. Project details and photography are illustrative, ready to be replaced with the studio’s completed work.</p></div></section><section class="detail-image-pair"><img src="/assets/${project.id==='warm-minimalism'?'facade-detail.jpg':'interior.jpg'}" alt="Interior material and atmosphere reference" loading="lazy"><div><img src="/assets/${project.id==='quiet-courtyard'?'residence.jpg':'courtyard.jpg'}" alt="Architectural light and space reference" loading="lazy"><span>LIGHT, MATERIAL & THE SPACES BETWEEN.</span></div></section><section id="project-catalogue" class="catalogue section-pad"><div class="section-heading"><div><p class="eyebrow">FROM VISION TO DETAIL</p><h2>The complete <em>picture.</em></h2></div><div class="catalogue-count"><strong>18</strong><span>DRAWINGS<br>6 DISCIPLINES</span></div></div><p class="catalogue-intro">Explore each discipline, open a sheet, and look closer. These sample diagrams demonstrate the project library; they are not construction documents.</p><div class="catalogue-filters" aria-label="Filter drawings by discipline">${cats.map(c=>`<button data-category="${c}" aria-pressed="${c===category}">${c}<span>${c==='All drawings'?18:sheets.filter(s=>s.category===c).length}</span></button>`).join('')}</div><div class="sheet-grid" id="sheet-grid" aria-live="polite"></div><p class="catalogue-note">SAMPLE COLLECTION / SVG FORMAT / NOT TO SCALE</p></section><a class="next-project" href="#project/${next.id}"><img src="/assets/${next.image}" alt="${next.name}" loading="lazy"><div><p class="eyebrow">NEXT PROJECT</p><h2>${next.name}</h2></div><span>↗</span></a><div class="detail-footer"><a href="#">ARCHCELL</a><span>LAHORE, PAKISTAN</span><a href="#work">ALL PROJECTS ↗</a></div></article>`;
 detail.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;detail.querySelectorAll('[data-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderSheets()}));
 renderSheets();
}
function renderSheets(){document.querySelector('#sheet-grid').innerHTML=sheets.map((s,i)=>({s,i})).filter(({s})=>category==='All drawings'||s.category===category).map(({s,i})=>`<button class="sheet-card" data-sheet="${i}"><span class="sheet-image">${drawingSVG(s,activeProject,true)}<span class="open-sheet">View drawing ↗</span></span><span class="sheet-meta"><span>${s.code}<strong>${s.name}</strong></span><span aria-hidden="true">↗</span></span></button>`).join('');detail.querySelectorAll('[data-sheet]').forEach(b=>b.addEventListener('click',()=>openSheet(Number(b.dataset.sheet))));}
let routeGeneration=0;
async function route(animate=true){
 const generation=++routeGeneration;const hash=location.hash;const isProject=hash.startsWith('#project/');const wasProject=!detail.hidden;const parts=hash.slice(1).split('/');const p=projects.find(p=>p.id===parts[1]);const changePage=(isProject!==wasProject)||(isProject&&p&&p.id!==activeProject.id);
 closeMenu();
 if(changePage&&animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){transition.classList.add('active');await new Promise(r=>setTimeout(r,420));}
 if(generation!==routeGeneration)return;
 if(isProject&&p){main.hidden=true;detail.hidden=false;document.body.classList.add('project-open');if(changePage||!detail.innerHTML)renderDetail(p);document.title=`${p.name} — Archcell`;if(parts[2]==='drawings'){document.querySelector('#project-catalogue').scrollIntoView({behavior:changePage?'instant':'smooth'})}else{window.scrollTo({top:0,behavior:'instant'});detail.querySelector('h1').focus({preventScroll:true})}}
 else{main.hidden=false;detail.hidden=true;document.body.classList.remove('project-open');document.title='Archcell — Spaces for the way you live.';const el=document.getElementById(hash.slice(1));if(el)el.scrollIntoView({behavior:wasProject?'instant':'smooth'});else window.scrollTo({top:0,behavior:'instant'});observeReveals();}
 requestAnimationFrame(()=>transition.classList.remove('active'));
}
window.addEventListener('hashchange',()=>route());
document.addEventListener('click',e=>{const a=e.target.closest('a');if(a&&a.getAttribute('href')===location.hash){e.preventDefault();route(false)}});
route(false);

const dialog=document.querySelector('#drawing-dialog');
function updateSheet(){const sheet=sheets[currentSheet];document.querySelector('#drawing-title').textContent=sheet.name;document.querySelector('#drawing-code').textContent=`${activeProject.name} / ${sheet.code}`;document.querySelector('#drawing-sheet').innerHTML=drawingSVG(sheet,activeProject);document.querySelector('#sheet-counter').textContent=`${String(currentSheet+1).padStart(2,'0')} / 18`;document.querySelector('#previous-sheet').disabled=currentSheet===0;document.querySelector('#next-sheet').disabled=currentSheet===sheets.length-1;setZoom(1);}
function openSheet(index){currentSheet=index;updateSheet();dialog.showModal();document.body.classList.add('locked')}
function closeSheet(){dialog.close();document.body.classList.remove('locked')}
dialog.querySelector('.viewer-close').addEventListener('click',closeSheet);dialog.addEventListener('close',()=>document.body.classList.remove('locked'));
document.querySelector('#previous-sheet').addEventListener('click',()=>{if(currentSheet>0){currentSheet--;updateSheet()}});
document.querySelector('#next-sheet').addEventListener('click',()=>{if(currentSheet<sheets.length-1){currentSheet++;updateSheet()}});
function setZoom(value){zoom=Math.max(.75,Math.min(2.5,value));const el=document.querySelector('#drawing-sheet');el.style.width=`${zoom*100}%`;el.style.maxWidth=zoom>1?'none':'1200px';document.querySelector('#zoom-fit').textContent=Math.round(zoom*100)+'%';document.querySelector('#zoom-out').disabled=zoom<=.75;document.querySelector('#zoom-in').disabled=zoom>=2.5;}
document.querySelector('#zoom-in').addEventListener('click',()=>setZoom(zoom+.25));document.querySelector('#zoom-out').addEventListener('click',()=>setZoom(zoom-.25));document.querySelector('#zoom-fit').addEventListener('click',()=>setZoom(1));
document.querySelector('#download-sheet').addEventListener('click',()=>{const s=sheets[currentSheet];const blob=new Blob([drawingSVG(s,activeProject)],{type:'image/svg+xml'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`archcell-${activeProject.id}-${s.code}-SAMPLE.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'&&currentSheet<17){currentSheet++;updateSheet()}if(e.key==='ArrowLeft'&&currentSheet>0){currentSheet--;updateSheet()}});
const creditsDialog=document.querySelector('#credits-dialog');
document.querySelector('#credits-button').addEventListener('click',()=>{creditsDialog.showModal();document.body.classList.add('locked')});
creditsDialog.querySelector('.credits-close').addEventListener('click',()=>creditsDialog.close());creditsDialog.addEventListener('close',()=>document.body.classList.remove('locked'));
const credits=[["John Fornander", "The Courtyard House", "https://unsplash.com/photos/Id7u0EkTjBE"], ["Igor Savelev", "The Stone Residence", "https://unsplash.com/photos/a-house-with-a-swimming-pool-at-night-hnFmQgrmLt4"], ["Felix", "House of Light", "https://unsplash.com/photos/P21wf6KAykw"], ["Frames For Your Heart", "The Garden Residence", "https://unsplash.com/photos/white-concrete-building-under-blue-sky-during-daytime-mR1CIDduGLc"], ["Miguel Picq", "A Quiet Courtyard", "https://unsplash.com/photos/minimalist-concrete-courtyard-with-white-furniture-plants-and-geometric-shadows-poEga0PVyPs/"], ["Clay Banks", "The Warm Edit", "https://unsplash.com/photos/modern-living-room-with-stylish-furniture-and-large-windows-FL-ZcDK8tMo"]];
document.querySelector('#credits-list').innerHTML=credits.map(([name,where,url])=>`<a href="${url}" target="_blank" rel="noopener"><span>${name}<small>${where}</small></span><span>↗</span></a>`).join('');

// Fine-pointer interactions supplement the regular, keyboard-accessible links.
const cursor=document.querySelector('.cursor-label');
if(matchMedia('(hover: hover) and (pointer: fine)').matches){document.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.classList.toggle('shown',!!e.target.closest('.project-image'))});document.addEventListener('pointerleave',()=>cursor.classList.remove('shown'));}
let scrollTick=false;window.addEventListener('scroll',()=>{if(!scrollTick){requestAnimationFrame(()=>{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&detail.hidden){const heroImage=document.querySelector('.hero-image');const y=window.scrollY;if(y<window.innerHeight)heroImage.style.translate=`0 ${y*.16}px`;}scrollTick=false});scrollTick=true}},{passive:true});
observeReveals();
mobileNav.addEventListener('keydown',e=>{if(e.key==='Tab'){const links=[...mobileNav.querySelectorAll('a')];if(!e.shiftKey&&document.activeElement===links.at(-1)){e.preventDefault();menuButton.focus()}}});
menuButton.addEventListener('keydown',e=>{if(e.key==='Tab'&&menuButton.getAttribute('aria-expanded')==='true'){e.preventDefault();const links=mobileNav.querySelectorAll('a');links[e.shiftKey?links.length-1:0].focus()}});
mobileNav.querySelector('a').addEventListener('keydown',e=>{if(e.key==='Tab'&&e.shiftKey){e.preventDefault();menuButton.focus()}});
