
/* ============================================================
   APEX v3 PREMIUM — Sistema Entrenador
   ============================================================ */

/* ── State ── */
var state = {
  entrenador:{nombre:'Entrenador',deporte:'Multi-deporte',club:'APEX Club'},
  atletas:[
    {id:1,nombre:'Carlos',apellido:'Méndez',email:'carlos@mail.com',telefono:'+56 9 1234 5678',deporte:'Fútbol',edad:22,peso:75,altura:178,posicion:'Delantero',estado:'Activo',notas:'Rápido, trabaja explosividad',fechaIngreso:'2024-01-15',objetivo:'Mejorar velocidad y resistencia'},
    {id:2,nombre:'María',apellido:'González',email:'maria@mail.com',telefono:'+56 9 8765 4321',deporte:'Fitness',edad:28,peso:62,altura:165,posicion:'',estado:'Activo',notas:'Objetivo pérdida de grasa',fechaIngreso:'2024-02-01',objetivo:'Perder 5kg en 3 meses'},
    {id:3,nombre:'Diego',apellido:'Rojas',email:'diego@mail.com',telefono:'+56 9 5555 0000',deporte:'Powerlifting',edad:25,peso:90,altura:175,posicion:'',estado:'Activo',notas:'Competidor regional',fechaIngreso:'2024-03-10',objetivo:'Total competencia 700kg'},
    {id:4,nombre:'Ana',apellido:'Torres',email:'ana@mail.com',telefono:'+56 9 4444 3333',deporte:'Natación',edad:19,peso:58,altura:170,posicion:'',estado:'Lesionado',notas:'Lesión hombro, en recuperación',fechaIngreso:'2024-01-20',objetivo:'Recuperación y competencia'}
  ],
  rutinas:[
    {id:1,nombre:'Fuerza Upper Body',atletaId:3,deporte:'Powerlifting',tipo:'Fuerza',duracion:90,dificultad:'Alta',descripcion:'Rutina de press banca y accesorios',ejercicios:[{id:1,nombre:'Press de Banca',series:5,reps:'5',peso:'120kg',descanso:'3min',notas:'Competitivo'},{id:2,nombre:'Press Inclinado',series:4,reps:'8',peso:'80kg',descanso:'2min',notas:''},{id:3,nombre:'Fondos con peso',series:3,reps:'10',peso:'20kg',descanso:'90s',notas:''}],fecha:'2024-06-01',activa:true},
    {id:2,nombre:'Velocidad y Agilidad',atletaId:1,deporte:'Fútbol',tipo:'Velocidad',duracion:60,dificultad:'Media',descripcion:'Entrenamiento físico para delanteros',ejercicios:[{id:1,nombre:'Sprint 30m',series:6,reps:'1',peso:'Peso corporal',descanso:'2min',notas:'Máxima velocidad'},{id:2,nombre:'Slalom conos',series:4,reps:'3',peso:'',descanso:'90s',notas:''}],fecha:'2024-06-05',activa:true}
  ],
  logsRendimiento:[
    {id:1,atletaId:3,atletaNombre:'Diego Rojas',metrica:'Press de Banca 1RM',valor:160,unidad:'kg',fecha:'2024-06-01',notas:'Nuevo récord',categoria:'Fuerza'},
    {id:2,atletaId:1,atletaNombre:'Carlos Méndez',metrica:'Sprint 100m',valor:11.2,unidad:'s',fecha:'2024-06-02',notas:'Condiciones normales',categoria:'Velocidad'},
    {id:3,atletaId:2,atletaNombre:'María González',metrica:'Peso Corporal',valor:63.5,unidad:'kg',fecha:'2024-06-03',notas:'',categoria:'Antropometría'},
    {id:4,atletaId:3,atletaNombre:'Diego Rojas',metrica:'Sentadilla 1RM',valor:200,unidad:'kg',fecha:'2024-06-05',notas:'Buena técnica',categoria:'Fuerza'}
  ],
  eventos:[
    {id:1,titulo:'Sesión Potencia - Diego',tipo:'Entrenamiento',atletaIds:[3],fecha:new Date().toISOString().split('T')[0],hora:'09:00',duracion:90,lugar:'Gimnasio Principal',notas:'',color:'var(--coral)'},
    {id:2,titulo:'Evaluación Física Grupal',tipo:'Evaluacion',atletaIds:[1,2,3,4],fecha:new Date(Date.now()+172800000).toISOString().split('T')[0],hora:'10:00',duracion:120,lugar:'Cancha',notas:'Traer ropa deportiva',color:'#f59e0b'}
  ],
  planes:[
    {id:1,atletaId:3,nombre:'Plan Masa Muscular',calorias:3500,proteinas:200,carbohidratos:400,grasas:100,comidas:[{nombre:'Desayuno',calorias:700,descripcion:'Avena con proteína, frutas, huevos'},{nombre:'Almuerzo',calorias:1000,descripcion:'Arroz, pollo, verduras, aceite oliva'},{nombre:'Pre-entreno',calorias:400,descripcion:'Banana, mantequilla maní, proteína'},{nombre:'Post-entreno',calorias:500,descripcion:'Shake proteína, dextrosa'},{nombre:'Cena',calorias:900,descripcion:'Salmón, papas, brócoli'}],notas:'Tomar 3L agua diaria',fecha:'2024-06-01'}
  ],
  pagos:[
    {id:1,atletaId:1,atletaNombre:'Carlos Méndez',concepto:'Mensualidad Junio',monto:80000,moneda:'CLP',estado:'Pagado',fechaEmision:'2024-06-01',fechaVencimiento:'2024-06-05',metodoPago:'Transferencia',notas:''},
    {id:2,atletaId:2,atletaNombre:'María González',concepto:'Mensualidad Junio',monto:80000,moneda:'CLP',estado:'Pendiente',fechaEmision:'2024-06-01',fechaVencimiento:'2024-06-10',metodoPago:'',notas:''},
    {id:3,atletaId:3,atletaNombre:'Diego Rojas',concepto:'Pack 3 meses',monto:210000,moneda:'CLP',estado:'Pagado',fechaEmision:'2024-04-01',fechaVencimiento:'2024-04-05',metodoPago:'Efectivo',notas:''},
    {id:4,atletaId:4,atletaNombre:'Ana Torres',concepto:'Mensualidad Junio',monto:80000,moneda:'CLP',estado:'Vencido',fechaEmision:'2024-05-01',fechaVencimiento:'2024-05-10',metodoPago:'',notas:'Lesionada, pendiente acuerdo'}
  ],
  documentos:[
    {id:1,atletaId:1,nombre:'Contrato Temporada 2024',tipo:'Contrato',contenido:'Contrato de entrenamiento personal para la temporada 2024.\n\nClub APEX — Condiciones de entrenamiento, responsabilidades y compromisos del atleta y entrenador para el período 2024.',fecha:'2024-01-15',etiquetas:['contrato','temporada']},
    {id:2,atletaId:null,nombre:'Protocolo Evaluación Física',tipo:'Protocolo',contenido:'Protocolo estándar para evaluaciones físicas del club.\n\n1. Test de antropometría\n2. Sprint 30m y 100m\n3. Salto vertical y horizontal\n4. Test de fuerza máxima\n5. Test de resistencia aeróbica (VO2 Max)',fecha:'2024-01-01',etiquetas:['protocolo','evaluacion']}
  ],
  sesiones:[],
  anotaciones:[]
};

/* ── Constantes ── */
var DEPORTES=['Fútbol','Básquetbol','Tenis','Natación','Atletismo','Fitness','Powerlifting','Crossfit','Rugby','Voleibol','Ciclismo','Boxeo','MMA','Golf','General'];
var TIPOS_RUTINA=['Fuerza','Hipertrofia','Resistencia','Velocidad','Técnica','Movilidad','HIIT','Potencia','Rehabilitación','Mixta'];
var DIFICULTADES=['Baja','Media','Alta','Élite'];
var TIPO_EVENTO=['Entrenamiento','Competencia','Evaluacion','Reunion','Descanso'];
var METRICAS=[
  {valor:'Peso Corporal',unidad:'kg',cat:'Antropometría'},
  {valor:'% Grasa Corporal',unidad:'%',cat:'Antropometría'},
  {valor:'IMC',unidad:'',cat:'Antropometría'},
  {valor:'Sprint 100m',unidad:'s',cat:'Velocidad'},
  {valor:'Sprint 30m',unidad:'s',cat:'Velocidad'},
  {valor:'1RM Press Banca',unidad:'kg',cat:'Fuerza'},
  {valor:'1RM Sentadilla',unidad:'kg',cat:'Fuerza'},
  {valor:'1RM Peso Muerto',unidad:'kg',cat:'Fuerza'},
  {valor:'Salto Vertical',unidad:'cm',cat:'Potencia'},
  {valor:'VO2 Max',unidad:'ml/kg/min',cat:'Resistencia'},
  {valor:'Personalizado',unidad:'',cat:'Otro'}
];
var NAV_ITEMS=[
  {id:'dashboard',icon:'fa-gauge-high',label:'Dashboard'},
  {id:'atletas',icon:'fa-users',label:'Atletas'},
  {id:'rutinas',icon:'fa-clipboard-list',label:'Rutinas'},
  {id:'rendimiento',icon:'fa-chart-line',label:'Rendimiento'},
  {id:'calendario',icon:'fa-calendar-days',label:'Calendario'},
  {id:'nutricion',icon:'fa-bowl-food',label:'Nutrición'},
  {id:'pagos',icon:'fa-credit-card',label:'Pagos'},
  {id:'documentos',icon:'fa-folder-open',label:'Documentos'}
];
var MOBILE_NAV=[
  {id:'dashboard',icon:'fa-gauge-high',label:'Inicio'},
  {id:'atletas',icon:'fa-users',label:'Atletas'},
  {id:'rutinas',icon:'fa-clipboard-list',label:'Rutinas'},
  {id:'rendimiento',icon:'fa-chart-line',label:'Métricas'},
  {id:'calendario',icon:'fa-calendar-days',label:'Agenda'}
];
var EVENT_COLORS={Entrenamiento:'var(--coral)',Competencia:'#d97706',Evaluacion:'#0A84FF',Reunion:'#8b5cf6',Descanso:'var(--green)'};

/* ── App state ── */
var currentView='dashboard';
var sidebarCollapsed=false;
var athleteViewMode='grid';
var editId={athlete:null,routine:null};
var calDate=new Date();
var _exercises=[];
var _statusFilter='Todos';
var liveSession=null; // { atletaId, rutinaId, startedAt, muscles:{...}, timerId }

/* ── Persistencia (localStorage) ── */
var STORAGE_KEY='fasciaState_v1';
function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
}
function loadState(){
  try{
    var raw=localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    var saved=JSON.parse(raw);
    if(saved && typeof saved==='object'){
      Object.keys(saved).forEach(function(k){ state[k]=saved[k]; });
      if(!state.sesiones) state.sesiones=[];
      if(!state.anotaciones) state.anotaciones=[];
    }
  }catch(e){}
}

/* ── Helpers ── */
function uid(){return Date.now()+Math.floor(Math.random()*1000)}
function fmt(n){return new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',minimumFractionDigits:0}).format(n)}
function imc(p,h){return(h>0)?((p/((h/100)*(h/100))).toFixed(1)):'—'}
function today(){return new Date().toISOString().split('T')[0]}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function statusColor(s){return s==='Activo'||s==='Pagado'?'green':s==='Lesionado'||s==='Vencido'?'red':s==='Pendiente'?'amber':'gray'}
function diffColor(d){return d==='Baja'?'green':d==='Media'?'amber':d==='Alta'||d==='Élite'?'red':'gray'}
function eventColor(t){return {Entrenamiento:'red',Competencia:'amber',Evaluacion:'blue',Reunion:'gray',Descanso:'green'}[t]||'gray'}
function athleteName(id){var a=state.atletas.find(function(x){return x.id===id});return a?(a.nombre+' '+a.apellido):'—'}

function avatarHtml(name,size){
  size=size||36;
  var parts=name.trim().split(' ');
  var init=(parts[0]?parts[0][0]:'')+(parts[1]?parts[1][0]:'');
  init=init.toUpperCase().slice(0,2);
  var colors=['#FF2D55','#FF375F','#CC1F3F','var(--coral2)','#991130'];
  var color=colors[name.charCodeAt(0)%colors.length];
  return '<div class="avatar" style="width:'+size+'px;height:'+size+'px;font-size:'+(size*0.35).toFixed(0)+'px;background:'+color+'">'+esc(init)+'</div>';
}

/* ── Toast ── */
function toast(msg,type){
  type=type||'success';
  var icons={success:'fa-check-circle',warn:'fa-triangle-exclamation',error:'fa-circle-xmark'};
  var el=document.createElement('div');
  el.className='toast '+type;
  el.innerHTML='<i class="fa-solid '+icons[type]+' toast-icon-'+type[0]+'"></i><span>'+esc(msg)+'</span>';
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(function(){
    el.style.cssText+='opacity:0;transform:translateX(20px);transition:all .3s ease';
    setTimeout(function(){el.remove()},320);
  },2800);
}

/* ── Navigation ── */
function navigate(id){
  if(currentView==='session' && id!=='session' && liveSession && liveSession.timerId){
    clearInterval(liveSession.timerId);
    liveSession.timerId=null;
  }
  currentView=id;
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active')});
  var v=document.getElementById('view-'+id);
  if(v){v.classList.add('active')}
  document.querySelectorAll('.nav-item,.mobile-nav-item').forEach(function(n){n.classList.remove('active')});
  document.querySelectorAll('[data-view="'+id+'"]').forEach(function(n){n.classList.add('active')});
  renderView(id);
  buildMobileNav();
  // Scroll to top
  var main=document.getElementById('mainContent');
  if(main) main.scrollTop=0;
}

function renderView(id){
  var map={dashboard:renderDashboard,atletas:renderAthletes,rutinas:renderRutinaView,session:renderSessionView,rendimiento:renderMetrics,calendario:renderCalendar,nutricion:renderNutrition,pagos:renderPayments,documentos:renderDocs};
  if(map[id]) map[id]();
}

function renderRutinaView(){
  // Ensure crear tab is visible
  var crear = document.getElementById('tabPanelCrear');
  var ver   = document.getElementById('tabPanelVer');
  if(crear) crear.style.display = 'flex';
  if(ver)   ver.style.display   = 'none';
  var btnC = document.getElementById('tabCrear');
  var btnV = document.getElementById('tabVer');
  if(btnC){ btnC.classList.add('rtab-active'); }
  if(btnV){ btnV.classList.remove('rtab-active'); }
  // Init body-muscles after DOM is painted
  setTimeout(function(){
    initBodyMuscles();
  }, 200);
}

/* ── Sidebar ── */
function buildSidebar(){
  var el=document.getElementById('suName'); if(el) el.textContent=state.entrenador.nombre;
  var es2=document.getElementById('suSport'); if(es2) es2.textContent=state.entrenador.deporte;
  var nav=document.getElementById('sidebarNav');
  nav.innerHTML=NAV_ITEMS.map(function(item){
    var badge=item.id==='atletas'?state.atletas.filter(function(a){return a.estado==='Activo'}).length
             :item.id==='pagos'?state.pagos.filter(function(p){return p.estado==='Pendiente'||p.estado==='Vencido'}).length:0;
    return '<button class="nav-item'+(currentView===item.id?' active':'')+'" data-view="'+item.id+'" onclick="navigate(\''+item.id+'\')">'
      +'<i class="fa-solid '+item.icon+' nav-icon"></i>'
      +'<span class="nav-label">'+item.label+'</span>'
      +(badge>0?'<span class="nav-badge">'+badge+'</span>':'')
      +'</button>';
  }).join('');
}

function buildMobileNav(){
  var nav=document.getElementById('mobileNavInner');
  if(!nav) return;
  nav.innerHTML=MOBILE_NAV.map(function(item){
    return '<button class="mobile-nav-item'+(currentView===item.id?' active':'')+'" data-view="'+item.id+'" onclick="navigate(\''+item.id+'\')">'
      +'<i class="fa-solid '+item.icon+'"></i>'
      +'<span>'+item.label+'</span>'
      +'</button>';
  }).join('');
}

function toggleSidebar(){
  sidebarCollapsed=!sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed',sidebarCollapsed);
  document.getElementById('collapseIcon').className='fa-solid '+(sidebarCollapsed?'fa-chevron-right':'fa-chevron-left');
}

/* ════════════════════════════
   DASHBOARD
════════════════════════════ */
function renderDashboard(){
  var today_=today();
  var todayEvents=state.eventos.filter(function(e){return e.fecha===today_});
  var paid=state.pagos.filter(function(p){return p.estado==='Pagado'}).reduce(function(s,p){return s+p.monto},0);
  var pending=state.pagos.filter(function(p){return p.estado==='Pendiente'||p.estado==='Vencido'}).length;
  var active=state.atletas.filter(function(a){return a.estado==='Activo'}).length;
  var injured=state.atletas.filter(function(a){return a.estado==='Lesionado'}).length;
  var uniqueSports=[...new Set(state.atletas.map(function(a){return a.deporte}))].filter(Boolean);

  var dEl=document.getElementById('dashDate');
  if(dEl) dEl.innerHTML=new Date().toLocaleDateString('es-CL',{weekday:'long',year:'numeric',month:'long',day:'numeric'})
    +(todayEvents.length?' &nbsp;<span style="color:var(--coral2)">· '+todayEvents.length+' sesión'+(todayEvents.length>1?'es':'')+' hoy</span>':'');

  var stats=[
    {l:'Atletas Activos',v:active,s:injured?injured+' lesionados':'Sin lesiones',i:'fa-users',accent:true},
    {l:'Rutinas Activas',v:state.rutinas.filter(function(r){return r.activa}).length,s:state.rutinas.length+' en total',i:'fa-clipboard-list'},
    {l:'Sesiones Hoy',v:todayEvents.length,s:'en agenda',i:'fa-calendar-days',accent:true},
    {l:'Cobrado',v:fmt(paid),s:pending+' por cobrar',i:'fa-credit-card'},
    {l:'Métricas',v:state.logsRendimiento.length,s:'registros totales',i:'fa-chart-line'},
    {l:'Deportes',v:uniqueSports.length,s:'disciplinas',i:'fa-medal'}
  ];
  var sEl=document.getElementById('dashStats');
  if(sEl) sEl.innerHTML=stats.map(function(s){
    return '<div class="stat-card'+(s.accent?' accent':'')+'">'
      +'<div class="stat-label">'+s.l+'</div>'
      +'<div class="stat-value">'+esc(String(s.v))+'</div>'
      +(s.s?'<div class="stat-sub">'+esc(s.s)+'</div>':'')
      +(s.i?'<span class="stat-icon"><i class="fa-solid '+s.i+'"></i></span>':'')
      +'</div>';
  }).join('');

  // Sports
  var sportData=uniqueSports.map(function(d){return{d:d,n:state.atletas.filter(function(a){return a.deporte===d}).length}}).sort(function(a,b){return b.n-a.n});
  var maxN=Math.max.apply(null,sportData.map(function(x){return x.n}).concat([1]));
  var spEl=document.getElementById('dashSports');
  if(spEl) spEl.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">'
    +'<p style="font-family:var(--font-display);font-size:1rem;color:var(--text);letter-spacing:0.06em;text-transform:uppercase">Distribución por Deporte</p>'
    +'<button class="btn btn-ghost btn-sm" onclick="navigate(\'atletas\')" style="color:var(--coral2)">Ver →</button>'
    +'</div>'
    +(sportData.length===0?'<p class="text-muted text-sm">Sin atletas registrados.</p>':'')
    +sportData.map(function(x){
      return '<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;margin-bottom:6px">'
        +'<span class="text-sm" style="color:var(--text2)">'+esc(x.d)+'</span>'
        +'<span style="font-family:var(--font-display);font-size:0.9rem;color:var(--coral2)">'+x.n+'</span></div>'
        +'<div class="progress-bar"><div class="progress-fill" style="width:'+Math.round(x.n/maxN*100)+'%"></div></div></div>';
    }).join('');

  // Schedule
  var upcoming=state.eventos.filter(function(e){return e.fecha>=today_}).sort(function(a,b){return a.fecha.localeCompare(b.fecha)}).slice(0,5);
  var schEl=document.getElementById('dashSchedule');
  if(schEl) schEl.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">'
    +'<p style="font-family:var(--font-display);font-size:1rem;color:var(--text);letter-spacing:0.06em;text-transform:uppercase">Agenda Próxima</p>'
    +'<button class="btn btn-ghost btn-sm" onclick="navigate(\'calendario\')" style="color:var(--coral2)">Ver →</button>'
    +'</div>'
    +(upcoming.length===0?'<p class="text-muted text-sm">Sin eventos próximos.</p>':'')
    +upcoming.map(function(e){
      var bc=EVENT_COLORS[e.tipo]||'var(--coral)';
      return '<div style="display:flex;gap:12px;padding:10px 12px;background:var(--bg3);border-radius:10px;border-left:3px solid '+bc+';margin-bottom:8px">'
        +'<div style="flex:1"><p style="font-weight:600;font-size:0.85rem;color:var(--text)">'+esc(e.titulo)+'</p>'
        +'<p class="text-xs text-muted mt-4">'+(e.fecha===today_?'Hoy':e.fecha)+' · '+e.hora+' · '+e.duracion+'min</p>'
        +(e.lugar?'<p class="text-xs text-muted"><i class="fa-solid fa-location-dot" style="margin-right:4px"></i>'+esc(e.lugar)+'</p>':'')
        +'</div><span class="badge badge-'+eventColor(e.tipo)+'">'+e.tipo+'</span></div>';
    }).join('');

  // Roster
  var rEl=document.getElementById('dashRoster');
  if(rEl) rEl.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">'
    +'<p style="font-family:var(--font-display);font-size:1rem;color:var(--text);letter-spacing:0.06em;text-transform:uppercase">Plantel</p>'
    +'<button class="btn btn-ghost btn-sm" onclick="navigate(\'atletas\')" style="color:var(--coral2)">Gestionar →</button>'
    +'</div>'
    +state.atletas.slice(0,6).map(function(a,i){
      return '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;'+(i<Math.min(state.atletas.length,6)-1?'border-bottom:1px solid var(--line)':'')+'">'
        +avatarHtml(a.nombre+' '+a.apellido,34)
        +'<div style="flex:1"><p style="font-weight:600;font-size:0.85rem;color:var(--text)">'+esc(a.nombre)+' '+esc(a.apellido)+'</p>'
        +'<p class="text-xs text-muted">'+esc(a.deporte)+(a.posicion?' · '+esc(a.posicion):'')+'</p></div>'
        +'<span class="badge badge-'+statusColor(a.estado)+'">'+a.estado+'</span></div>';
    }).join('');

  // Metrics
  var last=[].concat(state.logsRendimiento).reverse().slice(0,5);
  var mEl=document.getElementById('dashMetrics');
  if(mEl) mEl.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">'
    +'<p style="font-family:var(--font-display);font-size:1rem;color:var(--text);letter-spacing:0.06em;text-transform:uppercase">Últimas Métricas</p>'
    +'<button class="btn btn-ghost btn-sm" onclick="navigate(\'rendimiento\')" style="color:var(--coral2)">Ver →</button>'
    +'</div>'
    +(last.length===0?'<p class="text-muted text-sm">Sin registros.</p>':'')
    +last.map(function(m,i){
      return '<div style="padding:10px 0;'+(i<last.length-1?'border-bottom:1px solid var(--line)':'')+'">'
        +'<div style="display:flex;justify-content:space-between;align-items:center">'
        +'<span style="font-size:0.83rem;color:var(--text);font-weight:600">'+esc(m.metrica)+'</span>'
        +'<span style="font-family:var(--font-display);font-size:1rem;color:var(--coral2)">'+m.valor+'<span style="font-size:0.7rem;color:var(--text3);margin-left:3px">'+esc(m.unidad)+'</span></span>'
        +'</div><p class="text-xs text-muted">'+esc(m.atletaNombre)+' · '+m.fecha+'</p></div>';
    }).join('');
}

/* ════════════════════════════
   ATLETAS
════════════════════════════ */
function buildStatusFilters(){
  var el=document.getElementById('statusFilters');
  if(!el||el.dataset.built) return;
  el.dataset.built='1';
  ['Todos','Activo','Inactivo','Lesionado'].forEach(function(s){
    var b=document.createElement('button');
    b.textContent=s; b.dataset.status=s;
    b.className='btn btn-sm btn-outline';
    b.style.cssText=s==='Todos'?'border-color:var(--coral);color:var(--coral2)':'';
    b.onclick=function(){
      _statusFilter=s;
      el.querySelectorAll('button').forEach(function(x){x.style.cssText=''});
      b.style.cssText='border-color:var(--coral);color:var(--coral2)';
      renderAthletes();
    };
    el.appendChild(b);
  });
}

function renderAthletes(){
  buildStatusFilters();
  var q=(document.getElementById('athleteSearch')||{value:''}).value.toLowerCase();
  var sf=(document.getElementById('athleteSportFilter')||{value:''}).value;
  var sportSel=document.getElementById('athleteSportFilter');
  if(sportSel){
    var sports=[...new Set(state.atletas.map(function(a){return a.deporte}))].filter(Boolean);
    var cur=sportSel.value;
    sportSel.innerHTML='<option value="">Todos</option>'+sports.map(function(s){return '<option value="'+esc(s)+'"'+(cur===s?' selected':'')+'>'+esc(s)+'</option>'}).join('');
  }
  var sub=document.getElementById('atletasSub');
  if(sub){var act=state.atletas.filter(function(a){return a.estado==='Activo'}).length;var inj=state.atletas.filter(function(a){return a.estado==='Lesionado'}).length;sub.textContent=state.atletas.length+' atletas · '+act+' activos · '+inj+' lesionados'}
  var list=state.atletas;
  if(q) list=list.filter(function(a){return (a.nombre+' '+a.apellido+' '+a.email+' '+a.deporte).toLowerCase().includes(q)});
  if(sf) list=list.filter(function(a){return a.deporte===sf});
  if(_statusFilter!=='Todos') list=list.filter(function(a){return a.estado===_statusFilter});
  var c=document.getElementById('athletesContainer');
  if(!c) return;
  if(list.length===0){c.innerHTML='<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-users"></i></div><p class="empty-msg">No se encontraron atletas. ¡Agrega el primero!</p></div>';return}
  if(athleteViewMode==='grid'){
    c.innerHTML='<div class="athlete-grid stagger">'+list.map(function(a){return athleteCardHtml(a)}).join('')+'</div>';
  } else {
    c.innerHTML='<div style="background:var(--surf);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden">'
      +'<table class="table"><thead><tr>'+['Atleta','Deporte','Edad','Peso','IMC','Estado','','Acciones'].map(function(h){return '<th>'+h+'</th>'}).join('')+'</tr></thead>'
      +'<tbody>'+list.map(function(a){
        return '<tr onclick="showAthleteDetail('+a.id+')">'
          +'<td><div style="display:flex;align-items:center;gap:10px">'+avatarHtml(a.nombre+' '+a.apellido,32)+'<div><p style="font-weight:600;color:var(--text)">'+esc(a.nombre)+' '+esc(a.apellido)+'</p><p class="text-xs text-muted">'+esc(a.email)+'</p></div></div></td>'
          +'<td>'+esc(a.deporte)+'</td><td>'+(a.edad||'—')+'</td><td>'+(a.peso?a.peso+'kg':'—')+'</td>'
          +'<td>'+imc(a.peso,a.altura)+'</td>'
          +'<td><span class="badge badge-'+statusColor(a.estado)+'">'+a.estado+'</span></td>'
          +'<td class="text-xs text-muted"><i class="fa-solid fa-clipboard-list"></i> '+state.rutinas.filter(function(r){return r.atletaId===a.id}).length+' &nbsp;<i class="fa-solid fa-chart-line"></i> '+state.logsRendimiento.filter(function(m){return m.atletaId===a.id}).length+'</td>'
          +'<td onclick="event.stopPropagation()"><div style="display:flex;gap:6px">'
          +'<button class="btn btn-sm btn-outline" onclick="openAthleteModal('+a.id+')"><i class="fa-solid fa-pen"></i></button>'
          +'<button class="btn btn-sm btn-danger" onclick="deleteAthlete('+a.id+')"><i class="fa-solid fa-xmark"></i></button>'
          +'</div></td></tr>';
      }).join('')+'</tbody></table></div>';
  }
}

function athleteCardHtml(a){
  var rc=state.rutinas.filter(function(r){return r.atletaId===a.id}).length;
  var mc=state.logsRendimiento.filter(function(m){return m.atletaId===a.id}).length;
  return '<div class="athlete-card" onclick="showAthleteDetail('+a.id+')">'
    +'<div class="athlete-card-top"></div>'
    +'<div class="athlete-card-body">'
    +'<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:13px">'
    +avatarHtml(a.nombre+' '+a.apellido,46)
    +'<div style="flex:1;overflow:hidden">'
    +'<p style="font-weight:700;font-size:0.95rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(a.nombre)+' '+esc(a.apellido)+'</p>'
    +'<p class="text-xs text-muted mt-4">'+esc(a.deporte)+(a.posicion?' · '+esc(a.posicion):'')+'</p>'
    +'<div class="mt-8"><span class="badge badge-'+statusColor(a.estado)+'">'+a.estado+'</span></div>'
    +'</div></div>'
    +'<div class="athlete-mini-stats">'
    +[['Edad',a.edad||'—',''],['Peso',a.peso||'—',a.peso?'kg':''],['Talla',a.altura||'—',a.altura?'cm':''],['IMC',imc(a.peso,a.altura),'']].map(function(x){
      return '<div class="mini-stat"><div class="mini-stat-label">'+x[0]+'</div><div class="mini-stat-val">'+x[1]+'<span style="font-size:0.58rem;color:var(--text4)">'+x[2]+'</span></div></div>';
    }).join('')
    +'</div>'
    +(a.objetivo?'<div style="background:var(--coral-pale);border:1px solid var(--danger-border);border-radius:8px;padding:8px 10px;margin-bottom:10px"><p class="text-xs" style="color:var(--text2);line-height:1.5"><i class="fa-solid fa-bullseye" style="color:var(--coral2);margin-right:5px"></i>'+esc(a.objetivo)+'</p></div>':'')
    +'<div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid var(--line)">'
    +'<div style="display:flex;gap:12px">'
    +'<span class="text-xs text-muted"><i class="fa-solid fa-clipboard-list" style="margin-right:4px"></i>'+rc+'</span>'
    +'<span class="text-xs text-muted"><i class="fa-solid fa-chart-line" style="margin-right:4px"></i>'+mc+'</span>'
    +'</div>'
    +'<div style="display:flex;gap:6px" onclick="event.stopPropagation()">'
    +'<button class="btn btn-sm btn-outline" onclick="openAthleteModal('+a.id+')"><i class="fa-solid fa-pen"></i></button>'
    +'<button class="btn btn-sm btn-danger" onclick="deleteAthlete('+a.id+')"><i class="fa-solid fa-xmark"></i></button>'
    +'</div></div></div></div>';
}

function setAthleteView(m){
  athleteViewMode=m;
  document.getElementById('tabGrid').className='tab'+(m==='grid'?' active':'');
  document.getElementById('tabList').className='tab'+(m==='lista'?' active':'');
  renderAthletes();
}

function deleteAthlete(id){
  state.atletas=state.atletas.filter(function(a){return a.id!==id});
  toast('Atleta eliminado','warn');renderAthletes();buildSidebar();
}

function showAthleteDetail(id){
  var a=state.atletas.find(function(x){return x.id===id});if(!a) return;
  var rt=state.rutinas.filter(function(r){return r.atletaId===id});
  var mt=state.logsRendimiento.filter(function(m){return m.atletaId===id});
  var py=state.pagos.filter(function(p){return p.atletaId===id});
  var pp=py.filter(function(p){return p.estado==='Pendiente'||p.estado==='Vencido'}).length;
  var sesiones=(state.sesiones||[]).filter(function(s){return s.atletaId===id}).slice().reverse();
  showModal('<div class="modal modal-wide">'
    +'<div class="modal-header"><h2 class="modal-title">'+esc(a.nombre)+' '+esc(a.apellido)+'</h2><button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    +'<div style="display:flex;gap:18px;align-items:flex-start;margin-bottom:20px;padding:16px 18px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--line)">'
    +avatarHtml(a.nombre+' '+a.apellido,60)
    +'<div style="flex:1"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">'
    +'<span class="badge badge-'+statusColor(a.estado)+'">'+a.estado+'</span>'
    +(a.deporte?'<span class="badge badge-white">'+esc(a.deporte)+'</span>':'')
    +(a.posicion?'<span class="badge badge-gray">'+esc(a.posicion)+'</span>':'')
    +'</div><p class="text-sm text-muted">'+esc(a.email)+'</p>'
    +(a.telefono?'<p class="text-sm text-muted">'+esc(a.telefono)+'</p>':'')
    +'<p class="text-xs text-muted mt-4">Ingreso: '+esc(a.fechaIngreso||'—')+'</p></div></div>'
    +'<div class="grid-4" style="margin-bottom:16px">'
    +[['Edad',a.edad||'—','años'],['Peso',a.peso||'—','kg'],['Talla',a.altura||'—','cm'],['IMC',imc(a.peso,a.altura),'']].map(function(x){
      return '<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:12px;text-align:center">'
        +'<p style="font-size:0.62rem;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:0.1em">'+x[0]+'</p>'
        +'<p style="font-family:var(--font-display);font-size:1.4rem;color:var(--text);margin-top:4px">'+x[1]+'</p>'
        +(x[2]?'<p style="font-size:0.62rem;color:var(--text4)">'+x[2]+'</p>':'')
        +'</div>';
    }).join('')
    +'</div>'
    +'<div class="grid-2" style="margin-bottom:12px">'
    +'<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:12px 14px">'
    +'<p style="font-size:0.62rem;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px">Actividad</p>'
    +'<p class="text-sm"><i class="fa-solid fa-clipboard-list text-muted" style="margin-right:6px"></i>'+rt.length+' rutinas asignadas</p>'
    +'<p class="text-sm mt-4"><i class="fa-solid fa-chart-line text-muted" style="margin-right:6px"></i>'+mt.length+' métricas registradas</p></div>'
    +'<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:12px 14px">'
    +'<p style="font-size:0.62rem;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px">Pagos</p>'
    +'<p class="text-sm"><i class="fa-solid fa-credit-card text-muted" style="margin-right:6px"></i>'+py.length+' registros</p>'
    +(pp>0?'<p class="text-sm mt-4" style="color:var(--coral)"><i class="fa-solid fa-triangle-exclamation" style="margin-right:6px"></i>'+pp+' pendiente'+(pp>1?'s':'')+'</p>':'')
    +'</div></div>'
    +(a.objetivo?'<div style="background:var(--coral-pale);border:1px solid var(--danger-border);border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:12px">'
    +'<p style="font-size:0.62rem;font-weight:700;color:var(--coral2);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px"><i class="fa-solid fa-bullseye" style="margin-right:5px"></i>Objetivo</p>'
    +'<p class="text-sm" style="color:var(--text2)">'+esc(a.objetivo)+'</p></div>':'')
    +(a.notas?'<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:16px">'
    +'<p style="font-size:0.62rem;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px">Notas</p>'
    +'<p class="text-sm" style="color:var(--text2);line-height:1.6">'+esc(a.notas)+'</p></div>':'')

    +'<div style="background:var(--coral-pale);border:1px solid var(--danger-border);border-radius:var(--radius-sm);padding:12px 14px;margin-bottom:16px">'
    +'<p style="font-size:0.62rem;font-weight:700;color:var(--coral2);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px"><i class="fa-solid fa-bolt" style="margin-right:5px"></i>Rutinas asignadas ('+rt.length+')</p>'
    +(rt.length>0
      ?'<div style="display:flex;flex-direction:column;gap:6px;max-height:200px;overflow-y:auto">'
      +rt.slice().reverse().map(function(r){
        return '<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">'
          +'<div><p class="text-sm" style="color:var(--text2)">'+esc(r.nombre)+' '+(r.activa?'<span class="badge badge-green" style="margin-left:4px">Activa</span>':'<span class="badge badge-gray" style="margin-left:4px">Inactiva</span>')+'</p>'
          +'<p class="text-xs text-muted">'+(r.ejercicios||[]).length+' ejercicios · '+esc(r.tipo||'')+(r.fecha?' · '+esc(r.fecha):'')+'</p></div>'
          +'<div style="display:flex;gap:6px">'
          +'<button class="btn btn-sm btn-outline" onclick="closeModal();showRoutineDetail('+r.id+')"><i class="fa-solid fa-eye"></i></button>'
          +'<button class="btn btn-sm btn-primary" onclick="startLiveSession('+a.id+','+r.id+')"><i class="fa-solid fa-play"></i> Iniciar Sesión</button>'
          +'</div></div>';
      }).join('')
      +'</div>'
      :'<p class="text-sm text-muted">No hay rutinas asignadas. Crea una rutina y asígnasela desde el constructor.</p>')
    +'</div>'

    +(sesiones.length>0?'<div style="margin-bottom:16px">'
    +'<p class="section-label"><span><i class="fa-solid fa-clock-rotate-left" style="margin-right:7px"></i>Historial de sesiones ('+sesiones.length+')</span></p>'
    +'<div style="display:flex;flex-direction:column;gap:6px;max-height:180px;overflow-y:auto">'
    +sesiones.map(function(s){
      var r=state.rutinas.find(function(x){return x.id===s.rutinaId});
      var musc=Object.keys(s.musculos||{});
      var completados=musc.filter(function(m){return s.musculos[m].completado}).length;
      return '<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;cursor:pointer" onclick="showSessionDetail('+s.id+')">'
        +'<div><p class="text-sm" style="color:var(--text2)">'+esc(s.fecha)+' · '+esc(r?r.nombre:'Rutina')+'</p>'
        +'<p class="text-xs text-muted">'+esc(s.horaInicio)+' – '+esc(s.horaFin)+' · '+fmtDuration(s.duracionTotalSeg)+' · '+completados+'/'+musc.length+' músculos completados</p></div>'
        +'<i class="fa-solid fa-chevron-right text-muted" style="font-size:0.7rem"></i></div>';
    }).join('')
    +'</div></div>':'')

    +'<div class="modal-footer">'
    +'<button class="btn btn-danger btn-md" onclick="deleteAthlete('+a.id+');closeModal()"><i class="fa-solid fa-trash"></i> Eliminar</button>'
    +'<button class="btn btn-outline btn-md" onclick="closeModal();openAthleteModal('+a.id+')"><i class="fa-solid fa-pen"></i> Editar</button>'
    +'</div></div>');
}

function openAthleteModal(id){
  id=id||null;
  editId.athlete=id;
  var a=id?state.atletas.find(function(x){return x.id===id}):{};
  showModal('<div class="modal modal-wide">'
    +'<div class="modal-header"><h2 class="modal-title">'+(id?'Editar Atleta':'Nuevo Atleta')+'</h2><button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    +'<p class="section-label"><i class="fa-solid fa-user" style="margin-right:8px"></i>Datos Personales</p>'
    +'<div class="grid-2" style="margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Nombre *</label><input class="form-control" id="af-nombre" value="'+esc(a.nombre||'')+'" placeholder="Carlos"></div>'
    +'<div class="form-group"><label class="form-label">Apellido *</label><input class="form-control" id="af-apellido" value="'+esc(a.apellido||'')+'" placeholder="Méndez"></div>'
    +'<div class="form-group"><label class="form-label">Email *</label><input class="form-control" type="email" id="af-email" value="'+esc(a.email||'')+'"></div>'
    +'<div class="form-group"><label class="form-label">Teléfono</label><input class="form-control" id="af-telefono" value="'+esc(a.telefono||'')+'" placeholder="+56 9 xxxx xxxx"></div>'
    +'<div class="form-group"><label class="form-label">Fecha Ingreso</label><input class="form-control" type="date" id="af-fechaIngreso" value="'+(a.fechaIngreso||today())+'"></div>'
    +'<div class="form-group"><label class="form-label">Estado</label><select class="form-control" id="af-estado">'
    +['Activo','Inactivo','Lesionado'].map(function(s){return '<option'+(((a.estado||'Activo')===s)?' selected':'')+'>'+s+'</option>'}).join('')
    +'</select></div></div>'
    +'<p class="section-label"><i class="fa-solid fa-trophy" style="margin-right:8px"></i>Deporte</p>'
    +'<div class="grid-2" style="margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Deporte *</label><select class="form-control" id="af-deporte">'
    +'<option value="">— Seleccionar —</option>'
    +DEPORTES.map(function(d){return '<option value="'+esc(d)+'"'+((a.deporte===d)?' selected':'')+'>'+esc(d)+'</option>'}).join('')
    +'</select></div>'
    +'<div class="form-group"><label class="form-label">Posición</label><input class="form-control" id="af-posicion" value="'+esc(a.posicion||'')+'" placeholder="Delantero, Pivote…"></div></div>'
    +'<p class="section-label"><i class="fa-solid fa-weight-scale" style="margin-right:8px"></i>Composición Corporal</p>'
    +'<div class="grid-4" style="margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Edad</label><input class="form-control" type="number" id="af-edad" value="'+(a.edad||'')+'" placeholder="0"></div>'
    +'<div class="form-group"><label class="form-label">Peso (kg)</label><input class="form-control" type="number" step="0.1" id="af-peso" value="'+(a.peso||'')+'" oninput="updIMC()"></div>'
    +'<div class="form-group"><label class="form-label">Altura (cm)</label><input class="form-control" type="number" id="af-altura" value="'+(a.altura||'')+'" oninput="updIMC()"></div>'
    +'<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:10px 12px">'
    +'<p style="font-size:0.62rem;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:0.06em">IMC</p>'
    +'<p id="imcPrev" style="font-family:var(--font-display);font-size:1.4rem;margin-top:2px;color:var(--text4)">'+imc(a.peso||0,a.altura||0)+'</p></div></div>'
    +'<p class="section-label"><i class="fa-solid fa-bullseye" style="margin-right:8px"></i>Objetivos</p>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Objetivo Principal</label><input class="form-control" id="af-objetivo" value="'+esc(a.objetivo||'')+'" placeholder="Ej: Mejorar velocidad…"></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Notas</label><textarea class="form-control" id="af-notas" rows="3" placeholder="Lesiones previas, restricciones…">'+esc(a.notas||'')+'</textarea></div>'
    +'<div id="af-err" style="color:var(--coral);font-size:0.78rem;margin-bottom:8px"></div>'
    +'<div class="modal-footer">'
    +'<button class="btn btn-ghost btn-md" onclick="closeModal()">Cancelar</button>'
    +'<button class="btn btn-primary btn-md" onclick="saveAthlete()">'
    +'<i class="fa-solid '+(id?'fa-floppy-disk':'fa-plus')+'"></i> '+(id?'Guardar Cambios':'Registrar Atleta')
    +'</button></div></div>');
  updIMC();
}

function updIMC(){
  var p=parseFloat((document.getElementById('af-peso')||{value:0}).value)||0;
  var h=parseFloat((document.getElementById('af-altura')||{value:0}).value)||0;
  var el=document.getElementById('imcPrev');if(!el) return;
  var v=imc(p,h); el.textContent=v;
  var n=parseFloat(v);
  el.style.color=isNaN(n)?'var(--text4)':n<18.5||n>30?'var(--coral2)':'var(--green)';
}

function gv(id){var el=document.getElementById(id);return el?el.value.trim():''}

function saveAthlete(){
  var errs=[];
  if(!gv('af-nombre')) errs.push('Nombre requerido');
  if(!gv('af-apellido')) errs.push('Apellido requerido');
  if(!gv('af-email')) errs.push('Email requerido');
  if(!gv('af-deporte')) errs.push('Selecciona un deporte');
  var errEl=document.getElementById('af-err');
  if(errs.length){if(errEl) errEl.textContent=errs.join(' · ');return}
  var data={nombre:gv('af-nombre'),apellido:gv('af-apellido'),email:gv('af-email'),telefono:gv('af-telefono'),deporte:gv('af-deporte'),posicion:gv('af-posicion'),estado:gv('af-estado'),fechaIngreso:gv('af-fechaIngreso'),edad:+(document.getElementById('af-edad')||{value:0}).value||0,peso:+(document.getElementById('af-peso')||{value:0}).value||0,altura:+(document.getElementById('af-altura')||{value:0}).value||0,objetivo:gv('af-objetivo'),notas:gv('af-notas')};
  if(editId.athlete){
    state.atletas=state.atletas.map(function(a){return a.id===editId.athlete?Object.assign({},a,data):a});
    toast('Atleta actualizado ✓');
  } else {
    state.atletas.push(Object.assign({},data,{id:uid()}));
    toast('Atleta registrado ✓');
  }
  closeModal();renderAthletes();buildSidebar();
}

/* ════════════════════════════
   RUTINAS
════════════════════════════ */

/* ════════════════════════════
   MUSCLE DATA
════════════════════════════ */
var MUSCLE_EXERCISES = {
  'Pectorales':['Press de Banca','Press Inclinado','Aperturas con Mancuernas','Fondos en Paralelas','Crossover en Polea','Push-up'],
  'Dorsales':['Dominadas','Remo con Barra','Jalón al Pecho','Remo en Polea Baja','Remo con Mancuerna','Pull-over','Face Pull','Remo en Polea','Pájaros'],
  'Deltoides':['Press Militar','Elevaciones Laterales','Elevaciones Frontales','Arnold Press','Pájaros','Face Pull'],
  'Deltoides Posterior':['Pájaros','Face Pull','Remo al Mentón','Elevaciones en Polea','Rotación Externa con Banda','Rotación Interna con Banda'],
  'Bíceps':['Curl con Barra','Curl Martillo','Curl Concentrado','Curl en Polea','Chin-up','Curl con Barra EZ'],
  'Tríceps':['Press Francés','Extensión en Polea','Fondos Tríceps','Kickback','Press Cerrado'],
  'Antebrazos':['Curl de Muñeca','Extensión de Muñeca','Agarre de Barra','Dead Hang'],
  'Abdominales':['Crunch','Plancha','Elevación de Piernas','Russian Twist','Cable Crunch','Ab Wheel','Dead Bug','Palof Press','Vacuum'],
  'Oblicuos':['Russian Twist','Crunch Lateral','Plancha Lateral','Woodchop en Polea','Push-up Plus','Pull-over','Plancha con Deslizamiento'],
  'Lumbar':['Hiperextensión','Buenos Días','Superman','Peso Muerto Rumano'],
  'Trapecios':['Encogimientos','Remo al Mentón','Peso Muerto','Face Pull'],
  'Cuádriceps':['Sentadilla','Prensa de Piernas','Extensión de Cuádriceps','Zancada','Hack Squat','Elevación de Rodilla','Dragon Flag','Marcha en el Lugar','Plank con Rodilla','Zancada Lateral','Hip Flexor Stretch'],
  'Isquiotibiales':['Curl de Femoral','Peso Muerto Rumano','Buenos Días','Leg Press pie alto'],
  'Glúteos':['Hip Thrust','Sentadilla Profunda','Zancada','Patada de Glúteo','Peso Muerto Sumo','Abducción de Cadera','Clamshell','Monster Walk','Hip Thrust Unilateral'],
  'Gemelos':['Elevación de Talones de pie','Elevación de Talones sentado','Saltos','Leg Press Talones','Leg Press Talones Lento'],
  'Cuello':['Flexión de Cuello','Extensión de Cuello','Rotación Cervical'],
  'Aductores':['Sumo Squat','Abducción de Cadera','Cable Kick-in'],
  'Tibial Anterior':['Dorsiflexión con Banda','Elevación de Punta de Pie'],
};

var MUSCLE_ICONS = {
  'Pectorales':'fa-person','Dorsales':'fa-person','Deltoides':'fa-dumbbell',
  'Deltoides Posterior':'fa-dumbbell','Bíceps':'fa-hand-fist','Tríceps':'fa-hand-fist',
  'Antebrazos':'fa-hand-fist','Abdominales':'fa-person-running','Oblicuos':'fa-person-running',
  'Lumbar':'fa-person','Trapecios':'fa-person',
  'Cuádriceps':'fa-person-walking','Isquiotibiales':'fa-person-walking',
  'Glúteos':'fa-person-walking','Gemelos':'fa-person-walking',
  'Cuello':'fa-person','Aductores':'fa-person-walking','Tibial Anterior':'fa-person-walking',
};

/* ══════════════════════════════════════════════════════════════════
   RUTINAS — react-muscle-highlighter + Builder
   CDN: https://esm.sh/react-muscle-highlighter (loader <script type="module"> en <head>)
══════════════════════════════════════════════════════════════════ */

/* ── Colores del mapa muscular ── */
var BM_COLOR_DEFAULT = '#23232E';  // músculo sin actividad
var BM_COLOR_BORDER  = 'rgba(255,255,255,0.10)';
var BM_COLOR_ACTIVE  = '#FF2D55';  // coral — agregado al constructor
var BM_COLOR_PENDING = '#FF9F0A';  // ámbar — pendiente en sesión
var BM_COLOR_DONE    = '#30D158';  // verde — completado en sesión

/* ── Partes del modelo sin uso para entrenamiento (se ocultan) ── */
var BM_HIDDEN_PARTS = ['knees','hands','ankles','feet','head','hair'];

/* ── Mapa slug del modelo → nombre del grupo muscular en español ──
   Algunos slugs son compartidos por frontal/posterior con nombre distinto,
   ej. 'deltoids' = Deltoides en vista frontal y Deltoides Posterior en posterior */
var BM_SLUG_MAP = {
  front: {
    chest:'Pectorales', obliques:'Oblicuos', abs:'Abdominales', biceps:'Bíceps',
    triceps:'Tríceps', neck:'Cuello', trapezius:'Trapecios', deltoids:'Deltoides',
    adductors:'Aductores', quadriceps:'Cuádriceps', tibialis:'Tibial Anterior',
    calves:'Gemelos', forearm:'Antebrazos'
  },
  back: {
    neck:'Cuello', trapezius:'Trapecios', deltoids:'Deltoides Posterior',
    'upper-back':'Dorsales', triceps:'Tríceps', 'lower-back':'Lumbar',
    forearm:'Antebrazos', gluteal:'Glúteos', adductors:'Aductores',
    hamstring:'Isquiotibiales', calves:'Gemelos'
  }
};

/* ── React roots (constructor y sesión) ── */
var bmCurrentView = 'FRONT';
var bmSessionView = 'FRONT';
var bmRoot        = null;
var bmSessionRoot = null;

/* ── Builder state ── */
var builderData  = {};  // { 'Bíceps': { exercises:[], done:false } }
var _exercises   = [];

/* ── Color a pintar para un grupo muscular según el modo ── */
function bmColorForGroup(name, mode){
  if(mode === 'build'){
    return builderData[name] ? BM_COLOR_ACTIVE : null;
  }
  if(!liveSession) return null;
  var d = liveSession.muscles[name];
  if(!d) return null;
  return d.completado ? BM_COLOR_DONE : BM_COLOR_PENDING;
}

/* ── Arma el arreglo `data` que espera react-muscle-highlighter ── */
function bmBuildData(view, mode){
  var slugMap = view === 'FRONT' ? BM_SLUG_MAP.front : BM_SLUG_MAP.back;
  var data = [];
  Object.keys(slugMap).forEach(function(slug){
    var color = bmColorForGroup(slugMap[slug], mode);
    if(color) data.push({ slug: slug, color: color });
  });
  return data;
}

/* ── Renderiza (o re-renderiza) el modelo en un root de React ya creado ── */
function bmRender(root, view, mode){
  if(!root || !window.RMH) return;
  var slugMap = view === 'FRONT' ? BM_SLUG_MAP.front : BM_SLUG_MAP.back;
  root.render(window.RMH.h(window.RMH.Body, {
    data: bmBuildData(view, mode),
    side: view === 'FRONT' ? 'front' : 'back',
    gender: 'male',
    defaultFill: BM_COLOR_DEFAULT,
    border: BM_COLOR_BORDER,
    hiddenParts: BM_HIDDEN_PARTS,
    onBodyPartPress: function(part){
      var muscleName = slugMap[part.slug];
      if(!muscleName) return;
      if(mode === 'build') bmOnClick(muscleName);
      else sessionBmOnClick(muscleName);
    }
  }));
}

/* ── Inicializar modelo del constructor ── */
function initBodyMuscles(){
  var container = document.getElementById('bmChartContainer');
  if(!container) return;
  if(!window.RMH){
    container.innerHTML = '<p class="bm-loading">Cargando mapa muscular…</p>';
    setTimeout(initBodyMuscles, 200);
    return;
  }
  if(!bmRoot){
    container.innerHTML = '';
    bmRoot = window.RMH.createRoot(container);
  }
  bmRender(bmRoot, bmCurrentView, 'build');
}

/* ── Switch front / back (constructor) ── */
function bmSwitchView(view){
  bmCurrentView = view;
  var btnF = document.getElementById('btnFront');
  var btnB = document.getElementById('btnBack');
  if(btnF) btnF.className = 'bm-vtbtn' + (view==='FRONT'?' bm-vtbtn-active':'');
  if(btnB) btnB.className = 'bm-vtbtn' + (view==='BACK' ?' bm-vtbtn-active':'');
  if(!bmRoot) initBodyMuscles();
  else bmRender(bmRoot, bmCurrentView, 'build');
}

/* ── Cuando el usuario toca un músculo en el modelo (constructor) ── */
function bmOnClick(muscleName){
  if(!builderData[muscleName]){
    builderData[muscleName] = { exercises:[], done:false };
    bmRender(bmRoot, bmCurrentView, 'build');
    updateBuilderSummary();
  }
  openMuscleCard(muscleName, 'build');
}

/* ── Tab switch ── */
function switchRutinaTab(tab){
  var crear = document.getElementById('tabPanelCrear');
  var ver   = document.getElementById('tabPanelVer');
  var btnC  = document.getElementById('tabCrear');
  var btnV  = document.getElementById('tabVer');
  if(tab==='crear'){
    if(crear) crear.style.display='flex';
    if(ver)   ver.style.display='none';
    if(btnC){ btnC.classList.add('rtab-active'); }
    if(btnV){ btnV.classList.remove('rtab-active'); }
    // Init body-muscles if not yet done
    setTimeout(function(){
      if(!bmRoot) initBodyMuscles();
      maybeStartTutorial();
    }, 80);
  } else {
    if(crear) crear.style.display='none';
    if(ver)   ver.style.display='block';
    if(btnV){ btnV.classList.add('rtab-active'); }
    if(btnC){ btnC.classList.remove('rtab-active'); }
    renderRoutines();
  }
}

/* ══════════════════════════════════════════
   BUILDER CORE
══════════════════════════════════════════ */
function getBuilderTotals(){
  var muscles=Object.keys(builderData), totalEx=0, dias=new Set();
  muscles.forEach(function(m){
    builderData[m].exercises.forEach(function(e){ totalEx++; if(e.dia) dias.add(e.dia); });
  });
  return {muscles:muscles.length, exercises:totalEx, dias:dias.size, min:totalEx*8};
}

function updateBuilderSummary(){
  var t = getBuilderTotals();
  var bar  = document.getElementById('builderSummaryBar');
  var btnF = document.getElementById('btnFinalizar');
  var stat = document.getElementById('builderStatus');
  var hint = document.getElementById('builderEmptyHint');
  if(t.muscles > 0){
    if(bar) bar.style.display='flex';
    if(hint) hint.style.display='none';
    if(btnF){ btnF.classList.toggle('disabled', t.exercises===0); }
    var s1=document.getElementById('sumMusculos'); if(s1) s1.textContent=t.muscles;
    var s2=document.getElementById('sumEjercicios'); if(s2) s2.textContent=t.exercises;
    var s3=document.getElementById('sumDias'); if(s3) s3.textContent=t.dias||'—';
    var s4=document.getElementById('sumMin'); if(s4) s4.textContent='~'+t.min;
    var chips=document.getElementById('sumMuscleChips');
    if(chips){
      chips.innerHTML = Object.keys(builderData).map(function(m){
        var d=builderData[m];
        var n=d.exercises.length;
        return '<span class="sum-chip" onclick="openMuscleCard(\''+esc(m)+'\',\'build\')">'+esc(m)+(n>0?' · '+n:'')+'</span>';
      }).join('');
    }
    if(stat) stat.textContent = t.muscles+' músculo'+(t.muscles>1?'s':'')+' · '+t.exercises+' ejercicio'+(t.exercises!==1?'s':'');
  } else {
    if(bar) bar.style.display='none';
    if(hint) hint.style.display='flex';
    if(btnF) btnF.classList.add('disabled');
    if(stat) stat.textContent = 'Toca un músculo para comenzar';
  }
}

/* ══════════════════════════════════════════
   CARD FLOTANTE DE MÚSCULO (modal estilo iOS)
   Reutilizada en modo 'build' (constructor) y 'session' (en vivo)
══════════════════════════════════════════ */
var _muscleCard = null; // { muscle, mode, formOpen }

function safeId(s){ return String(s||'').replace(/[^a-zA-Z0-9_-]/g,'_'); }

function openMuscleCard(muscle, mode){
  _muscleCard = { muscle:muscle, mode:mode||'build', formOpen:false };
  if(mode==='session' && liveSession && liveSession.muscles[muscle] && !liveSession.muscles[muscle].startedAt){
    liveSession.muscles[muscle].startedAt = Date.now();
  }
  renderMuscleCard();
}
function closeMuscleCard(){
  _muscleCard = null;
  closeModal();
}
function renderMuscleCard(){
  if(!_muscleCard) return;
  var html = _muscleCard.mode==='session'
    ? buildSessionMuscleCardHtml(_muscleCard.muscle)
    : buildBuilderMuscleCardHtml(_muscleCard.muscle);
  showModal(html);
}

/* ── Card en modo construcción ── */
function buildBuilderMuscleCardHtml(muscle){
  var d = builderData[muscle];
  if(!d) return '<div class="modal"></div>';
  var icon = MUSCLE_ICONS[muscle] || 'fa-circle';
  var exs = MUSCLE_EXERCISES[muscle] || [];
  var sid = safeId(muscle);

  var suggestHtml = '';
  if(exs.length > 0){
    suggestHtml = '<p class="mc-suggest-label">Sugeridos — toca para agregar</p>'
      + '<div class="mc-suggest-chips">'
      + exs.slice(0,6).map(function(e){
          return '<button class="mc-chip" onclick="builderAddSuggested(\''+esc(muscle)+'\',\''+esc(e)+'\')">'
            + '<i class="fa-solid fa-plus" style="font-size:0.6rem;margin-right:4px;color:var(--coral)"></i>'+esc(e)+'</button>';
        }).join('')
      + '</div>';
  }

  var exHtml = d.exercises.map(function(e, ei){
    return '<div class="mc-ex">'
      + '<div class="mc-ex-num">'+(ei+1)+'</div>'
      + '<span class="mc-ex-name">'+esc(e.nombre)+'</span>'
      + '<span class="mc-ex-meta">'+e.series+'×'+esc(e.reps)+(e.peso?' · '+esc(e.peso):'')+(e.dia?' · '+esc(e.dia):'')+'</span>'
      + '<button class="mc-ex-del" onclick="builderRemoveEx(\''+esc(muscle)+'\','+ei+')"><i class="fa-solid fa-xmark"></i></button>'
      + '</div>';
  }).join('');

  var DIAS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
  var formHtml = '';
  if(_muscleCard.formOpen){
    formHtml = '<div class="mc-form">'
      + '<div class="mc-form-row cols1">'
      +   '<div class="mc-field"><label>Ejercicio *</label>'
      +   '<input id="bmfi-nom-'+sid+'" class="form-control" placeholder="Ej: Press de banca…"></div>'
      + '</div>'
      + '<div class="mc-form-row cols3">'
      +   '<div class="mc-field"><label>Series</label><input id="bmfi-ser-'+sid+'" type="number" value="4" class="form-control"></div>'
      +   '<div class="mc-field"><label>Reps</label><input id="bmfi-rep-'+sid+'" value="8-12" class="form-control"></div>'
      +   '<div class="mc-field"><label>Peso</label><input id="bmfi-pes-'+sid+'" placeholder="kg" class="form-control"></div>'
      + '</div>'
      + '<div class="mc-form-row cols2">'
      +   '<div class="mc-field"><label>Día</label><select id="bmfi-dia-'+sid+'" class="form-control">'
      +   '<option value="">Sin asignar</option>'+DIAS.map(function(d){return '<option>'+d+'</option>'}).join('')
      +   '</select></div>'
      +   '<div class="mc-field"><label>Descanso</label><input id="bmfi-des-'+sid+'" value="90s" class="form-control"></div>'
      + '</div>'
      + '<div class="mc-form-actions">'
      +   '<button class="mc-form-save" onclick="builderSaveForm(\''+esc(muscle)+'\')"><i class="fa-solid fa-check" style="margin-right:5px"></i>Guardar</button>'
      +   '<button class="mc-form-cancel" onclick="builderToggleForm()">Cancelar</button>'
      + '</div></div>';
  }

  return '<div class="modal modal-muscle">'
    + '<div class="mc-head">'
    +   '<div class="mc-icon" style="background:rgba(255,45,85,0.15);border:1px solid rgba(255,45,85,0.3)">'
    +     '<i class="fa-solid '+icon+'" style="font-size:0.72rem;color:var(--coral2)"></i>'
    +   '</div>'
    +   '<span class="mc-name">'+esc(muscle)+'</span>'
    +   '<span class="mc-badge '+(d.exercises.length>0?'mc-badge-done':'mc-badge-edit')+'">'
    +     (d.exercises.length > 0 ? d.exercises.length+' ejerc.' : 'NUEVO')
    +   '</span>'
    +   '<button class="modal-close" onclick="closeMuscleCard()"><i class="fa-solid fa-xmark"></i></button>'
    + '</div>'
    + '<div class="mc-body">'
    +   suggestHtml
    +   (exHtml || '<p style="font-size:0.76rem;color:var(--text4);text-align:center;padding:10px 0">Sin ejercicios aún</p>')
    +   (formHtml || '<button class="mc-add-btn" onclick="builderToggleForm()"><i class="fa-solid fa-plus" style="margin-right:5px"></i>Agregar ejercicio</button>')
    + '</div>'
    + '<div class="modal-footer">'
    +   '<button class="btn btn-danger btn-md" onclick="builderRemoveMuscle(\''+esc(muscle)+'\')"><i class="fa-solid fa-trash"></i> Quitar músculo</button>'
    +   '<button class="btn btn-primary btn-md" onclick="closeMuscleCard()"><i class="fa-solid fa-check"></i> Listo</button>'
    + '</div></div>';
}

function builderToggleForm(){
  if(!_muscleCard) return;
  _muscleCard.formOpen = !_muscleCard.formOpen;
  renderMuscleCard();
  if(_muscleCard.formOpen){
    setTimeout(function(){ var i=document.getElementById('bmfi-nom-'+safeId(_muscleCard.muscle)); if(i) i.focus(); }, 60);
  }
}

function builderAddSuggested(muscle, exName){
  if(!builderData[muscle]) return;
  builderData[muscle].exercises.push({nombre:exName, series:4, reps:'8-12', peso:'', descanso:'90s', dia:''});
  updateBuilderSummary();
  renderMuscleCard();
}

function builderSaveForm(muscle){
  var sid = safeId(muscle);
  var nom = (document.getElementById('bmfi-nom-'+sid)||{value:''}).value.trim();
  if(!nom){ toast('Escribe el nombre del ejercicio','warn'); return; }
  var ser = parseInt((document.getElementById('bmfi-ser-'+sid)||{value:'4'}).value)||4;
  var rep = (document.getElementById('bmfi-rep-'+sid)||{value:'8-12'}).value||'8-12';
  var pes = (document.getElementById('bmfi-pes-'+sid)||{value:''}).value||'';
  var dia = (document.getElementById('bmfi-dia-'+sid)||{value:''}).value||'';
  var des = (document.getElementById('bmfi-des-'+sid)||{value:'90s'}).value||'90s';
  if(!builderData[muscle]) return;
  builderData[muscle].exercises.push({nombre:nom, series:ser, reps:rep, peso:pes, descanso:des, dia:dia});
  _muscleCard.formOpen = false;
  updateBuilderSummary();
  renderMuscleCard();
}

function builderRemoveEx(muscle, idx){
  if(!builderData[muscle]) return;
  builderData[muscle].exercises.splice(idx,1);
  updateBuilderSummary();
  renderMuscleCard();
}

function builderRemoveMuscle(muscle){
  delete builderData[muscle];
  bmRender(bmRoot, bmCurrentView, 'build');
  if(_muscleCard && _muscleCard.muscle===muscle){ closeMuscleCard(); }
  updateBuilderSummary();
}

function clearBuilderAll(){
  builderData = {};
  bmRender(bmRoot, bmCurrentView, 'build');
  closeMuscleCard();
  updateBuilderSummary();
}

/* ══════════════════════════════════════════
   TUTORIAL — burbujas de onboarding
══════════════════════════════════════════ */
var TUTORIAL_STEPS=[
  {target:'#bmChartContainer', title:'Modelo interactivo', text:'Este es el modelo de cuerpo completo, totalmente interactivo. Cada zona representa un grupo muscular.'},
  {target:'.bm-view-toggle', title:'Vista frontal / posterior', text:'Alterna entre frontal y posterior para acceder a todos los músculos del cuerpo.'},
  {target:'#tabPanelCrear', title:'Crea tu rutina', text:'Toca cualquier músculo para abrir su tarjeta y agregar ejercicios. El resumen y el botón Guardar Rutina aparecerán aquí abajo cuando agregues al menos un músculo.', placement:'bottom'}
];
var _tutorialStep=-1;

function maybeStartTutorial(){
  if(localStorage.getItem('fasciaTutorialSeen')) return;
  setTimeout(startTutorial, 450);
}
function startTutorial(){
  _tutorialStep=0;
  showTutorialStep();
}
function showTutorialStep(){
  var step=TUTORIAL_STEPS[_tutorialStep];
  if(!step){ endTutorial(); return; }
  var target=document.querySelector(step.target);
  var backdrop=document.getElementById('tutorialBackdrop');
  if(!backdrop){
    backdrop=document.createElement('div');
    backdrop.id='tutorialBackdrop';
    backdrop.className='tutorial-backdrop';
    document.body.appendChild(backdrop);
  }
  var rect = target ? target.getBoundingClientRect() : {left:16,top:16,width:0,height:0,bottom:16,right:16};
  var highlightHtml = (target && rect.width>0) ? '<div class="tutorial-highlight" style="left:'+rect.left+'px;top:'+rect.top+'px;width:'+rect.width+'px;height:'+rect.height+'px"></div>' : '';
  var placement = step.placement || (rect.top > window.innerHeight/2 ? 'top' : 'bottom');
  var bubbleStyle;
  if(placement==='bottom'){
    var topPos = Math.min(rect.bottom+12, window.innerHeight-200);
    bubbleStyle = 'top:'+Math.max(topPos,12)+'px';
  } else {
    bubbleStyle = 'bottom:'+Math.max(window.innerHeight-rect.top+12,12)+'px';
  }
  var left = Math.min(Math.max(rect.left, 12), window.innerWidth-292);
  backdrop.innerHTML = highlightHtml
    + '<div class="tutorial-bubble" style="left:'+left+'px;'+bubbleStyle+'">'
    +   '<p class="tutorial-bubble-title">'+esc(step.title)+'</p>'
    +   '<p class="tutorial-bubble-text">'+esc(step.text)+'</p>'
    +   '<div class="tutorial-bubble-actions">'
    +     '<span class="tutorial-step-count">'+(_tutorialStep+1)+'/'+TUTORIAL_STEPS.length+'</span>'
    +     '<div style="display:flex;gap:8px">'
    +       (_tutorialStep>0?'<button class="btn btn-ghost btn-sm" onclick="tutorialPrev()">Atrás</button>':'')
    +       '<button class="btn btn-primary btn-sm" onclick="tutorialNext()">'+(_tutorialStep===TUTORIAL_STEPS.length-1?'Entendido':'Siguiente')+'</button>'
    +     '</div>'
    +   '</div>'
    + '</div>';
}
function tutorialNext(){ _tutorialStep++; showTutorialStep(); }
function tutorialPrev(){ _tutorialStep--; showTutorialStep(); }
function endTutorial(){
  var backdrop=document.getElementById('tutorialBackdrop');
  if(backdrop) backdrop.remove();
  try{ localStorage.setItem('fasciaTutorialSeen','1'); }catch(e){}
  _tutorialStep=-1;
}

/* ══════════════════════════════════════════
   SESIÓN EN VIVO
══════════════════════════════════════════ */

/* Agrupa los ejercicios de una rutina por músculo (campo notas).
   Si notas no corresponde a un músculo conocido, se agrupan en 'General'. */
function guessMuscleByExerciseName(nombre){
  if(!nombre) return null;
  var n = String(nombre).toLowerCase().trim();
  var found=null;
  Object.keys(MUSCLE_EXERCISES).some(function(m){
    var hit = MUSCLE_EXERCISES[m].some(function(ex){ return ex.toLowerCase()===n; });
    if(hit){ found=m; return true; }
    return false;
  });
  return found;
}

function groupRoutineByMuscle(r){
  var groups={};
  (r.ejercicios||[]).forEach(function(e){
    var m = (e.notas && MUSCLE_ICONS[e.notas]) ? e.notas : (guessMuscleByExerciseName(e.nombre) || 'General');
    if(!groups[m]) groups[m]=[];
    groups[m].push({nombre:e.nombre, series:e.series, reps:e.reps, peso:e.peso, descanso:e.descanso, log:[]});
  });
  return groups;
}

function startLiveSession(atletaId, rutinaId){
  var r=state.rutinas.find(function(x){return x.id===rutinaId});
  if(!r){ toast('Rutina no encontrada','error'); return; }
  var groups=groupRoutineByMuscle(r);
  if(Object.keys(groups).length===0){ toast('Esta rutina no tiene ejercicios','warn'); return; }
  liveSession={ atletaId:atletaId, rutinaId:rutinaId, startedAt:Date.now(), finishedAt:null, timerId:null, muscles:{} };
  Object.keys(groups).forEach(function(m){
    liveSession.muscles[m]={ exercises:groups[m], completado:false, startedAt:null, finishedAt:null };
  });
  closeModal();
  navigate('session');
}

function renderSessionView(){
  var view=document.getElementById('view-session');
  if(!view) return;
  if(!liveSession){
    view.innerHTML='';
    navigate('atletas');
    return;
  }
  var a=state.atletas.find(function(x){return x.id===liveSession.atletaId});
  var r=state.rutinas.find(function(x){return x.id===liveSession.rutinaId});

  view.innerHTML = ''
    + '<div class="session-header">'
    +   '<div style="flex:1;min-width:160px">'
    +     '<h1 class="page-title" style="font-size:1.3rem;margin-bottom:2px"><span class="page-title-bar"></span>Sesión en vivo</h1>'
    +     '<p class="page-sub" style="margin:0">'+esc(a?(a.nombre+' '+a.apellido):'—')+' · '+esc(r?r.nombre:'—')+'</p>'
    +   '</div>'
    +   '<div class="session-timer-box">'
    +     '<p class="session-timer" id="sessionTimer">00:00</p>'
    +     '<p class="sum-lbl">Tiempo total</p>'
    +   '</div>'
    +   '<button class="btn btn-primary btn-md" onclick="finishLiveSession()"><i class="fa-solid fa-flag-checkered"></i> Finalizar Rutina</button>'
    + '</div>'
    + '<div class="session-body">'
    +   '<div class="session-muscle-list" id="sessionMuscleList"></div>'
    +   '<div class="session-bodymap">'
    +     '<div class="bm-view-toggle">'
    +       '<button class="bm-vtbtn bm-vtbtn-active" id="sbtnFront" onclick="bmSessionSwitchView(\'FRONT\')">Frontal</button>'
    +       '<button class="bm-vtbtn" id="sbtnBack" onclick="bmSessionSwitchView(\'BACK\')">Posterior</button>'
    +     '</div>'
    +     '<div id="bmSessionContainer" style="flex:1;display:flex;align-items:center;justify-content:center;min-height:300px;height:100%;padding:8px 0"></div>'
    +     '<div class="bm-hint"><i class="fa-solid fa-hand-pointer" style="color:var(--coral);margin-right:5px"></i>Toca un músculo para registrar la serie</div>'
    +   '</div>'
    + '</div>';

  renderSessionMuscleList();
  setTimeout(function(){ initSessionBodyMuscles(); }, 80);

  if(liveSession.timerId) clearInterval(liveSession.timerId);
  liveSession.timerId=setInterval(updateSessionTimer, 1000);
  updateSessionTimer();
}

function updateSessionTimer(){
  if(!liveSession) return;
  var el=document.getElementById('sessionTimer'); if(!el) return;
  var sec=Math.max(0,Math.floor((Date.now()-liveSession.startedAt)/1000));
  var h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=sec%60;
  var mm=(m<10?'0':'')+m, ss=(s<10?'0':'')+s;
  el.textContent = (h>0 ? h+':'+mm : mm) + ':' + ss;
}

function renderSessionMuscleList(){
  var box=document.getElementById('sessionMuscleList');
  if(!box || !liveSession) return;
  box.innerHTML = Object.keys(liveSession.muscles).map(function(m){
    var d=liveSession.muscles[m];
    var icon=MUSCLE_ICONS[m]||'fa-circle';
    return '<button class="session-muscle-btn '+(d.completado?'done':'')+'" onclick="openMuscleCard(\''+esc(m)+'\',\'session\')">'
      + '<span class="session-muscle-check"><i class="fa-solid '+(d.completado?'fa-check':'')+'"></i></span>'
      + '<i class="fa-solid '+icon+'" style="width:16px;text-align:center;color:var(--text4)"></i>'
      + '<span style="flex:1;text-align:left">'+esc(m)+'</span>'
      + '<span class="session-muscle-meta">'+d.exercises.length+' ejerc.</span>'
      + '</button>';
  }).join('');
}

function initSessionBodyMuscles(){
  var container=document.getElementById('bmSessionContainer');
  if(!container) return;
  if(!window.RMH){
    container.innerHTML='<p class="bm-loading">Cargando mapa muscular…</p>';
    setTimeout(initSessionBodyMuscles,200);
    return;
  }
  container.innerHTML='';
  bmSessionRoot = window.RMH.createRoot(container);
  bmRender(bmSessionRoot, bmSessionView, 'session');
}

function bmSessionSwitchView(view){
  bmSessionView=view;
  var f=document.getElementById('sbtnFront'), b=document.getElementById('sbtnBack');
  if(f) f.className='bm-vtbtn'+(view==='FRONT'?' bm-vtbtn-active':'');
  if(b) b.className='bm-vtbtn'+(view==='BACK'?' bm-vtbtn-active':'');
  bmRender(bmSessionRoot, bmSessionView, 'session');
}

function updateSessionBodyMap(){
  bmRender(bmSessionRoot, bmSessionView, 'session');
}

function sessionBmOnClick(muscleName){
  if(!liveSession) return;
  if(liveSession.muscles[muscleName]){
    openMuscleCard(muscleName,'session');
  } else {
    toast('Ese músculo no forma parte de la rutina de hoy','warn');
  }
}

/* ── Card en modo sesión: registro en vivo ── */
function buildSessionMuscleCardHtml(muscle){
  var d = liveSession && liveSession.muscles[muscle];
  if(!d) return '<div class="modal"></div>';
  var icon = MUSCLE_ICONS[muscle] || 'fa-circle';
  var sid = safeId(muscle);

  var exHtml = d.exercises.map(function(ex, exi){
    var logHtml = ex.log.map(function(l, li){
      return '<div class="mc-ex" style="margin-bottom:5px">'
        + '<div class="mc-ex-num">'+l.serie+'</div>'
        + '<span class="mc-ex-name">'+esc(l.reps)+' reps'+(l.peso?' · '+esc(l.peso):'')+'</span>'
        + '<span class="mc-ex-meta">'+esc(l.hora)+'</span>'
        + '<button class="mc-ex-del" onclick="sessionRemoveSet(\''+esc(muscle)+'\','+exi+','+li+')"><i class="fa-solid fa-xmark"></i></button>'
        + '</div>';
    }).join('');
    return '<div class="session-ex-block">'
      + '<div class="session-ex-head">'
      +   '<span class="mc-ex-name" style="font-weight:600;flex:none">'+esc(ex.nombre)+'</span>'
      +   '<span class="mc-ex-meta">Objetivo: '+esc(String(ex.series))+'×'+esc(ex.reps)+(ex.peso?' · '+esc(ex.peso):'')+'</span>'
      + '</div>'
      + (logHtml || '<p style="font-size:0.7rem;color:var(--text4);padding:2px 0 6px">Sin series registradas aún</p>')
      + '<div class="session-set-form">'
      +   '<input id="sslog-reps-'+sid+'-'+exi+'" class="form-control" placeholder="Reps" value="'+esc(ex.reps)+'">'
      +   '<input id="sslog-peso-'+sid+'-'+exi+'" class="form-control" placeholder="Peso" value="'+esc(ex.peso)+'">'
      +   '<button class="btn btn-sm btn-primary" onclick="sessionAddSet(\''+esc(muscle)+'\','+exi+')"><i class="fa-solid fa-plus"></i> Serie</button>'
      + '</div>'
      + '</div>';
  }).join('');

  return '<div class="modal modal-muscle">'
    + '<div class="mc-head">'
    +   '<div class="mc-icon" style="background:'+(d.completado?'rgba(48,209,88,0.15)':'rgba(255,45,85,0.15)')+';border:1px solid '+(d.completado?'rgba(48,209,88,0.3)':'rgba(255,45,85,0.3)')+'">'
    +     '<i class="fa-solid '+icon+'" style="font-size:0.72rem;color:'+(d.completado?'var(--green)':'var(--coral2)')+'"></i>'
    +   '</div>'
    +   '<span class="mc-name">'+esc(muscle)+'</span>'
    +   '<span class="mc-badge '+(d.completado?'mc-badge-done':'mc-badge-edit')+'">'+(d.completado?'✓ COMPLETADO':'EN PROGRESO')+'</span>'
    +   '<button class="modal-close" onclick="closeMuscleCard()"><i class="fa-solid fa-xmark"></i></button>'
    + '</div>'
    + '<div class="mc-body">'
    +   (exHtml || '<p style="font-size:0.76rem;color:var(--text4);text-align:center;padding:10px 0">Sin ejercicios</p>')
    + '</div>'
    + '<div class="modal-footer">'
    +   '<button class="btn btn-outline btn-md" onclick="closeMuscleCard()">Cerrar</button>'
    +   '<button class="btn '+(d.completado?'btn-outline':'btn-primary')+' btn-md" onclick="sessionMarkMuscleDone(\''+esc(muscle)+'\')"><i class="fa-solid fa-check"></i> '+(d.completado?'Marcar pendiente':'Marcar completado')+'</button>'
    + '</div></div>';
}

function sessionAddSet(muscle, exIdx){
  if(!liveSession) return;
  var d=liveSession.muscles[muscle]; if(!d) return;
  var ex=d.exercises[exIdx]; if(!ex) return;
  var sid=safeId(muscle);
  var repsEl=document.getElementById('sslog-reps-'+sid+'-'+exIdx);
  var pesoEl=document.getElementById('sslog-peso-'+sid+'-'+exIdx);
  var reps=(repsEl&&repsEl.value.trim())||ex.reps;
  var peso=(pesoEl&&pesoEl.value.trim())||ex.peso;
  ex.log.push({serie:ex.log.length+1, reps:reps, peso:peso, hora:new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit',second:'2-digit'})});
  if(!d.startedAt) d.startedAt=Date.now();
  renderMuscleCard();
}

function sessionRemoveSet(muscle, exIdx, setIdx){
  if(!liveSession) return;
  var ex=liveSession.muscles[muscle].exercises[exIdx]; if(!ex) return;
  ex.log.splice(setIdx,1);
  ex.log.forEach(function(l,i){ l.serie=i+1; });
  renderMuscleCard();
}

function sessionMarkMuscleDone(muscle){
  if(!liveSession) return;
  var d=liveSession.muscles[muscle]; if(!d) return;
  d.completado=!d.completado;
  if(d.completado){
    d.finishedAt=Date.now();
    if(!d.startedAt) d.startedAt=d.finishedAt;
    toast(muscle+' completado ✓');
  } else {
    d.finishedAt=null;
  }
  updateSessionBodyMap();
  renderSessionMuscleList();
  renderMuscleCard();
}

function finishLiveSession(){
  if(!liveSession) return;
  var pendientes=Object.keys(liveSession.muscles).filter(function(m){ return !liveSession.muscles[m].completado; });
  if(pendientes.length>0){
    if(!confirm('Quedan '+pendientes.length+' músculo(s) sin marcar como completados ('+pendientes.join(', ')+'). ¿Finalizar la rutina igual?')) return;
  }
  liveSession.finishedAt=Date.now();
  var totalSec=Math.max(0,Math.round((liveSession.finishedAt-liveSession.startedAt)/1000));
  var musculos={};
  Object.keys(liveSession.muscles).forEach(function(m){
    var d=liveSession.muscles[m];
    musculos[m]={
      completado: d.completado,
      duracionSeg: (d.startedAt && d.finishedAt) ? Math.max(0,Math.round((d.finishedAt-d.startedAt)/1000)) : null,
      ejercicios: d.exercises
    };
  });
  state.sesiones.push({
    id: uid(),
    atletaId: liveSession.atletaId,
    rutinaId: liveSession.rutinaId,
    fecha: today(),
    horaInicio: new Date(liveSession.startedAt).toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'}),
    horaFin: new Date(liveSession.finishedAt).toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'}),
    duracionTotalSeg: totalSec,
    musculos: musculos
  });
  saveState();
  if(liveSession.timerId) clearInterval(liveSession.timerId);
  var atletaId=liveSession.atletaId;
  closeMuscleCard();
  liveSession=null;
  toast('¡Sesión guardada! ✓');
  navigate('atletas');
  setTimeout(function(){ showAthleteDetail(atletaId); }, 250);
}

function fmtDuration(sec){
  if(sec==null) return '—';
  var m=Math.floor(sec/60), s=sec%60;
  return m+' min'+(s>0?' '+s+'s':'');
}

/* ── Detalle completo de una sesión guardada (progreso del atleta) ── */
function showSessionDetail(id){
  var s=(state.sesiones||[]).find(function(x){return x.id===id}); if(!s) return;
  var a=state.atletas.find(function(x){return x.id===s.atletaId});
  var r=state.rutinas.find(function(x){return x.id===s.rutinaId});
  var musc=Object.keys(s.musculos||{});
  var completados=musc.filter(function(m){return s.musculos[m].completado}).length;

  showModal('<div class="modal modal-wide">'
    +'<div class="modal-header"><h2 class="modal-title">'+esc(r?r.nombre:'Sesión')+'</h2>'
    +'<button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    +'<p class="text-sm" style="margin-bottom:12px"><i class="fa-solid fa-user text-muted" style="margin-right:6px"></i><strong>'+esc(a?(a.nombre+' '+a.apellido):'—')+'</strong></p>'
    +'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px">'
    +[['Fecha',esc(s.fecha)],['Horario',esc(s.horaInicio)+' – '+esc(s.horaFin)],['Duración',fmtDuration(s.duracionTotalSeg)],['Completados',completados+'/'+musc.length]].map(function(x){
      return '<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:10px;text-align:center">'
        +'<p style="font-size:0.6rem;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:0.1em">'+x[0]+'</p>'
        +'<p style="font-family:var(--font-display);font-size:1.05rem;color:var(--text);margin-top:4px">'+x[1]+'</p></div>';
    }).join('')+'</div>'
    +(musc.length>0 ? musc.map(function(m){
      var d=s.musculos[m]||{};
      var icon=MUSCLE_ICONS[m]||'fa-circle';
      var totalSets=(d.ejercicios||[]).reduce(function(acc,e){return acc+((e.log||[]).length)},0);
      return '<div class="session-ex-block">'
        +'<div class="session-ex-head">'
        +  '<span class="mc-ex-name" style="font-weight:700;flex:none"><i class="fa-solid '+icon+'" style="margin-right:6px;color:'+(d.completado?'var(--green)':'var(--coral2)')+'"></i>'+esc(m)+'</span>'
        +  '<span class="badge '+(d.completado?'badge-green':'badge-gray')+'">'+(d.completado?'Completado':'Pendiente')+'</span>'
        +  '<span class="mc-ex-meta">'+fmtDuration(d.duracionSeg)+' · '+totalSets+' serie'+(totalSets!==1?'s':'')+' registrada'+(totalSets!==1?'s':'')+'</span>'
        +'</div>'
        + (d.ejercicios||[]).map(function(ex){
            var logHtml=(ex.log||[]).map(function(l){
              return '<div class="mc-ex" style="margin-bottom:5px">'
                +'<div class="mc-ex-num">'+l.serie+'</div>'
                +'<span class="mc-ex-name">'+esc(l.reps)+' reps'+(l.peso?' · '+esc(l.peso):'')+'</span>'
                +'<span class="mc-ex-meta">'+esc(l.hora)+'</span>'
                +'</div>';
            }).join('');
            return '<div style="margin-top:8px">'
              +'<p class="mc-ex-name" style="font-weight:600;margin-bottom:4px">'+esc(ex.nombre)+' <span class="mc-ex-meta">Objetivo: '+esc(String(ex.series))+'×'+esc(ex.reps)+(ex.peso?' · '+esc(ex.peso):'')+'</span></p>'
              +(logHtml || '<p style="font-size:0.7rem;color:var(--text4);padding:2px 0 6px">Sin series registradas</p>')
              +'</div>';
          }).join('')
        +'</div>';
    }).join('') : '<p class="text-sm text-muted">Sin datos registrados en esta sesión.</p>')
    +'<div class="modal-footer"><button class="btn btn-outline btn-md" onclick="closeModal()">Cerrar</button></div></div>');
}

/* ── Finalize and save routine ── */
function finalizarRutina(){
  var muscles = Object.keys(builderData);
  if(muscles.length === 0){ toast('Agrega al menos un músculo','warn'); return; }
  var allExercises = [];
  muscles.forEach(function(muscle){
    builderData[muscle].exercises.forEach(function(e){
      allExercises.push({id:uid(), nombre:e.nombre, series:e.series, reps:e.reps,
        peso:e.peso, descanso:e.descanso, notas:muscle});
    });
  });
  _exercises = allExercises;
  var muscleName = muscles.slice(0,2).join(' + ') + (muscles.length>2?' +'+(muscles.length-2)+' más':'');
  editId.routine = null;
  showModal('<div class="modal modal-wide">'
    + '<div class="modal-header"><h2 class="modal-title">Guardar Rutina</h2>'
    + '<button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    + '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:16px">'
    + muscles.map(function(m){
        var icon=MUSCLE_ICONS[m]||'fa-circle';
        return '<span class="badge badge-red"><i class="fa-solid '+icon+'" style="margin-right:4px"></i>'+esc(m)+'</span>';
      }).join('')
    + '</div>'
    + '<div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:12px;margin-bottom:12px">'
    + '<div class="form-group"><label class="form-label">Nombre *</label><input class="form-control" id="rf-nombre" value="Rutina '+esc(muscleName)+'"></div>'
    + '<div class="form-group"><label class="form-label">Tipo</label><select class="form-control" id="rf-tipo">'+TIPOS_RUTINA.map(function(t){return '<option>'+t+'</option>'}).join('')+'</select></div>'
    + '<div class="form-group"><label class="form-label">Dificultad</label><select class="form-control" id="rf-dificultad">'+DIFICULTADES.map(function(d){return '<option'+(d==='Media'?' selected':'')+'>'+d+'</option>'}).join('')+'</select></div>'
    + '</div>'
    + '<div class="form-group" style="margin-bottom:12px;background:var(--coral-pale);border:1px solid var(--danger-border);border-radius:var(--radius-sm);padding:10px 12px">'
    + '<label class="form-label" style="color:var(--coral2)"><i class="fa-solid fa-user-check" style="margin-right:5px"></i>Asignar a atleta *</label>'
    + '<select class="form-control" id="rf-atletaId"><option value="">Sin asignar</option>'+state.atletas.map(function(a){return '<option value="'+a.id+'">'+esc(a.nombre)+' '+esc(a.apellido)+'</option>'}).join('')+'</select>'
    + '<p style="font-size:0.68rem;color:var(--text4);margin-top:5px">Si no asignas un atleta, la rutina no aparecerá en su perfil ni podrá iniciarse una sesión en vivo con ella.</p>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px">'
    + '<div class="form-group"><label class="form-label">Deporte</label><select class="form-control" id="rf-deporte"><option value="">General</option>'+DEPORTES.map(function(d){return '<option>'+esc(d)+'</option>'}).join('')+'</select></div>'
    + '<div class="form-group"><label class="form-label">Duración (min)</label><input class="form-control" type="number" id="rf-duracion" value="'+(allExercises.length*8||45)+'"></div>'
    + '<div class="form-group"><label class="form-label">Fecha</label><input class="form-control" type="date" id="rf-fecha" value="'+today()+'"></div>'
    + '</div>'
    + '<div class="form-group" style="margin-bottom:12px"><label class="form-label">Descripción</label>'
    + '<textarea class="form-control" id="rf-descripcion" rows="2">Rutina enfocada en: '+esc(muscles.join(', '))+'</textarea></div>'
    + '<div class="section-label"><span><i class="fa-solid fa-dumbbell" style="margin-right:7px"></i>Ejercicios ('+allExercises.length+')</span>'
    + '<button class="btn btn-sm btn-secondary" onclick="addExercise()">＋ Agregar</button></div>'
    + '<div id="exList" style="display:flex;flex-direction:column;gap:7px;max-height:220px;overflow-y:auto;margin-bottom:8px"></div>'
    + '<div id="rf-err" style="color:var(--coral);font-size:0.78rem;margin-bottom:8px"></div>'
    + '<div class="modal-footer">'
    + '<button class="btn btn-ghost btn-md" onclick="closeModal()">Cancelar</button>'
    + '<button class="btn btn-primary btn-md" onclick="saveRoutineFromBuilder()"><i class="fa-solid fa-floppy-disk"></i> Guardar Rutina</button>'
    + '</div></div>');
  renderExerciseList();
}

function saveRoutineFromBuilder(){
  if(!gv('rf-nombre')){ document.getElementById('rf-err').textContent='Nombre requerido'; return; }
  var atletaIdVal = document.getElementById('rf-atletaId').value;
  if(!atletaIdVal){
    if(!confirm('No asignaste esta rutina a ningún atleta: no aparecerá en su perfil ni se podrá iniciar una sesión en vivo con ella. ¿Guardar igual?')) return;
  }
  var data = {
    nombre:gv('rf-nombre'), tipo:gv('rf-tipo'), dificultad:gv('rf-dificultad'),
    deporte:gv('rf-deporte'), duracion:+(document.getElementById('rf-duracion').value)||60,
    fecha:gv('rf-fecha'), descripcion:gv('rf-descripcion'),
    atletaId:atletaIdVal?+atletaIdVal:null,
    ejercicios:JSON.parse(JSON.stringify(_exercises)), activa:true
  };
  state.rutinas.push(Object.assign({}, data, {id:uid()}));
  saveState();
  toast('¡Rutina guardada! ✓', 'success');
  closeModal();
  clearBuilderAll();
}

/* ══════════════════════════════════════════
   ROUTINES LIST (Ver tab)
══════════════════════════════════════════ */

/* ══════════════════════════════════════════
   RENDIMIENTO — pizarra por atleta
══════════════════════════════════════════ */
var _pizarraAthlete=null;
var _metricReturnTo=null;

function renderMetrics(){
  var search=(document.getElementById('rendSearch')||{value:''}).value.toLowerCase().trim();
  var cf=(document.getElementById('metricCatFilter')||{value:''}).value;
  var cfEl=document.getElementById('metricCatFilter');
  if(cfEl){
    var cats=[].concat(state.logsRendimiento.map(function(m){return m.categoria})).filter(function(v,i,a){return v && a.indexOf(v)===i});
    var cur=cfEl.value;
    cfEl.innerHTML='<option value="">Todas las categorías</option>'+cats.map(function(c){return '<option'+(cur===c?' selected':'')+'>'+esc(c)+'</option>'}).join('');
  }
  var totalMetricas=state.logsRendimiento.length, totalNotas=(state.anotaciones||[]).length;
  var sub=document.getElementById('rendSub'); if(sub) sub.textContent=totalMetricas+' métricas · '+totalNotas+' anotaciones';

  var list=state.atletas.filter(function(a){
    if(search && (a.nombre+' '+a.apellido).toLowerCase().indexOf(search)===-1) return false;
    if(cf){
      var has=state.logsRendimiento.some(function(m){return m.atletaId===a.id && m.categoria===cf});
      if(!has) return false;
    }
    return true;
  });

  var c=document.getElementById('metricsContainer'); if(!c) return;
  if(list.length===0){c.innerHTML='<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-chart-line"></i></div><p class="empty-msg">Sin atletas que coincidan con la búsqueda.</p></div>';return}
  c.innerHTML='<div class="grid-3 pizarra-grid">'+list.map(pizarraCardHtml).join('')+'</div>';
}

/* Combina métricas + anotaciones de un atleta en una sola línea de tiempo, más reciente primero */
function pizarraEntries(atletaId){
  var entries=[];
  state.logsRendimiento.filter(function(m){return m.atletaId===atletaId}).forEach(function(m){
    entries.push({type:'metrica', ts:m.id, fecha:m.fecha, data:m});
  });
  (state.anotaciones||[]).filter(function(n){return n.atletaId===atletaId}).forEach(function(n){
    entries.push({type:'nota', ts:n.id, fecha:n.fecha, data:n});
  });
  entries.sort(function(x,y){return y.ts-x.ts});
  return entries;
}

function pizarraCardHtml(a){
  var entries=pizarraEntries(a.id);
  var last=entries[0];
  var preview = last
    ? (last.type==='metrica'
        ? '<i class="fa-solid fa-chart-line" style="color:var(--coral2);margin-right:5px"></i>'+esc(last.data.metrica)+': '+last.data.valor+' '+esc(last.data.unidad)
        : '<i class="fa-solid fa-note-sticky" style="color:var(--text4);margin-right:5px"></i>'+esc((last.data.texto||'').slice(0,54))+((last.data.texto||'').length>54?'…':''))
    : 'Sin registros aún';
  var lastDate = last ? last.fecha : '—';

  // Último valor por categoría (vista rápida)
  var cats={};
  state.logsRendimiento.filter(function(m){return m.atletaId===a.id}).forEach(function(m){
    if(!cats[m.categoria] || m.id>cats[m.categoria].id) cats[m.categoria]=m;
  });
  var catKeys=Object.keys(cats).filter(Boolean).slice(0,3);

  return '<div class="athlete-card pizarra-card" onclick="openPizarra('+a.id+')">'
    +'<div class="athlete-card-top"></div>'
    +'<div class="athlete-card-body">'
    +'<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:10px">'
    +avatarHtml(a.nombre+' '+a.apellido,44)
    +'<div style="flex:1;overflow:hidden">'
    +'<p style="font-weight:700;font-size:0.92rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(a.nombre)+' '+esc(a.apellido)+'</p>'
    +'<p class="text-xs text-muted mt-4">'+esc(a.deporte)+'</p>'
    +'</div></div>'
    +(catKeys.length>0
      ?'<div class="athlete-mini-stats" style="grid-template-columns:repeat('+catKeys.length+',1fr)">'+catKeys.map(function(k){
          var m=cats[k];
          return '<div class="mini-stat"><div class="mini-stat-label">'+esc(k)+'</div><div class="mini-stat-val">'+m.valor+'<span style="font-size:0.58rem;color:var(--text4)"> '+esc(m.unidad)+'</span></div></div>';
        }).join('')+'</div>'
      :'<p class="text-xs text-muted" style="padding:4px 0 10px">Sin métricas registradas</p>')
    +'<div class="pizarra-preview">'
    +'<span class="pizarra-preview-text">'+preview+'</span>'
    +'<span class="pizarra-preview-date">'+esc(lastDate)+'</span>'
    +'</div>'
    +'</div></div>';
}

function openPizarra(atletaId){
  _pizarraAthlete=atletaId;
  var a=state.atletas.find(function(x){return x.id===atletaId}); if(!a) return;
  showModal('<div class="modal modal-wide">'
    +'<div class="modal-header"><h2 class="modal-title">'+esc(a.nombre)+' '+esc(a.apellido)+' · Pizarra</h2><button class="modal-close" onclick="_pizarraAthlete=null;closeModal();renderMetrics()"><i class="fa-solid fa-xmark"></i></button></div>'
    +'<div class="pizarra-actions">'
    +'<button class="btn btn-sm btn-outline" onclick="openMetricModal('+a.id+')"><i class="fa-solid fa-chart-line"></i> Registrar Métrica</button>'
    +'<button class="btn btn-sm btn-primary" onclick="showAnotacionForm()"><i class="fa-solid fa-note-sticky"></i> Agregar Anotación</button>'
    +'</div>'
    +'<div id="anotacionFormArea"></div>'
    +'<div id="pizarraTimeline"></div>'
    +'</div>');
  renderPizarraTimeline();
}

function renderPizarraTimeline(){
  var box=document.getElementById('pizarraTimeline'); if(!box || _pizarraAthlete==null) return;
  var entries=pizarraEntries(_pizarraAthlete);
  if(entries.length===0){
    box.innerHTML='<div class="empty-state" style="padding:24px 0"><div class="empty-icon"><i class="fa-solid fa-clipboard"></i></div><p class="empty-msg">Sin registros aún. Agrega una métrica o una anotación.</p></div>';
    return;
  }
  box.innerHTML='<div class="timeline">'+entries.map(function(e){
    if(e.type==='metrica'){
      var m=e.data;
      return '<div class="timeline-item">'
        +'<div class="timeline-icon timeline-icon-metric"><i class="fa-solid fa-chart-line"></i></div>'
        +'<div class="timeline-body">'
        +'<div class="timeline-head"><span class="timeline-title">'+esc(m.metrica)+'</span>'+(m.categoria?'<span class="badge badge-blue">'+esc(m.categoria)+'</span>':'')+'</div>'
        +'<p class="timeline-value">'+m.valor+' <span style="font-size:0.7rem;color:var(--text3)">'+esc(m.unidad)+'</span></p>'
        +(m.notas?'<p class="timeline-notes">'+esc(m.notas)+'</p>':'')
        +'<div class="timeline-foot"><span class="timeline-date"><i class="fa-solid fa-calendar" style="margin-right:4px"></i>'+esc(m.fecha)+'</span><button class="timeline-del" onclick="deleteMetric('+m.id+')"><i class="fa-solid fa-trash"></i></button></div>'
        +'</div></div>';
    } else {
      var n=e.data;
      return '<div class="timeline-item">'
        +'<div class="timeline-icon timeline-icon-note"><i class="fa-solid fa-note-sticky"></i></div>'
        +'<div class="timeline-body">'
        +'<div class="timeline-head"><span class="timeline-title">Anotación</span></div>'
        +'<p class="timeline-notes" style="color:var(--text2)">'+esc(n.texto).replace(/\n/g,'<br>')+'</p>'
        +'<div class="timeline-foot"><span class="timeline-date"><i class="fa-solid fa-clock" style="margin-right:4px"></i>'+esc(n.fecha)+' · '+esc(n.hora)+'</span><button class="timeline-del" onclick="deleteAnotacion('+n.id+')"><i class="fa-solid fa-trash"></i></button></div>'
        +'</div></div>';
    }
  }).join('')+'</div>';
}

function showAnotacionForm(){
  var area=document.getElementById('anotacionFormArea'); if(!area) return;
  if(area.innerHTML.trim()){ area.innerHTML=''; return; }
  area.innerHTML='<div class="anotacion-form">'
    +'<textarea class="form-control" id="anotacionTexto" rows="3" placeholder="Escribe una anotación: técnica, ánimo, molestias, observaciones del entrenamiento…"></textarea>'
    +'<div class="mc-form-actions">'
    +'<button class="mc-form-save" onclick="saveAnotacion()"><i class="fa-solid fa-check" style="margin-right:5px"></i>Guardar</button>'
    +'<button class="mc-form-cancel" onclick="showAnotacionForm()">Cancelar</button>'
    +'</div></div>';
  setTimeout(function(){ var ta=document.getElementById('anotacionTexto'); if(ta) ta.focus(); },50);
}

function saveAnotacion(){
  if(_pizarraAthlete==null) return;
  var texto=(document.getElementById('anotacionTexto')||{value:''}).value.trim();
  if(!texto){ toast('Escribe algo primero','warn'); return; }
  var a=state.atletas.find(function(x){return x.id===_pizarraAthlete});
  state.anotaciones.push({id:uid(), atletaId:_pizarraAthlete, atletaNombre:a?(a.nombre+' '+a.apellido):'', texto:texto, fecha:today(), hora:new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'})});
  saveState();
  var area=document.getElementById('anotacionFormArea'); if(area) area.innerHTML='';
  renderPizarraTimeline();
  toast('Anotación guardada ✓');
}

function deleteAnotacion(id){
  state.anotaciones=state.anotaciones.filter(function(n){return n.id!==id});
  saveState();
  renderPizarraTimeline();
  toast('Anotación eliminada','warn');
}

function deleteMetric(id){
  state.logsRendimiento=state.logsRendimiento.filter(function(m){return m.id!==id});
  saveState();
  toast('Métrica eliminada','warn');
  if(_pizarraAthlete!=null) renderPizarraTimeline();
}

function openMetricModal(atletaId){
  _metricReturnTo = (atletaId!==undefined && atletaId!==null) ? atletaId : null;
  var closeAction = _metricReturnTo!=null ? ('openPizarra('+_metricReturnTo+')') : 'closeModal()';
  showModal('<div class="modal">'
    +'<div class="modal-header"><h2 class="modal-title">Registrar Métrica</h2><button class="modal-close" onclick="'+closeAction+'"><i class="fa-solid fa-xmark"></i></button></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Atleta *</label><select class="form-control" id="mf-atletaId"'+(_metricReturnTo!=null?' disabled':'')+'>'
    +'<option value="">— Seleccionar —</option>'
    +state.atletas.map(function(a){return '<option value="'+a.id+'"'+(_metricReturnTo===a.id?' selected':'')+'>'+esc(a.nombre)+' '+esc(a.apellido)+'</option>'}).join('')
    +'</select></div>'
    +'<div class="grid-2" style="margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Métrica *</label><select class="form-control" id="mf-metrica" onchange="updMetricUnit()">'
    +METRICAS.map(function(m){return '<option value="'+esc(m.valor)+'" data-u="'+esc(m.unidad)+'" data-c="'+esc(m.cat)+'">'+esc(m.valor)+'</option>'}).join('')
    +'</select></div>'
    +'<div class="form-group"><label class="form-label">Nombre personalizado</label><input class="form-control" id="mf-custom" placeholder="Solo si seleccionas Personalizado"></div></div>'
    +'<div class="grid-2" style="margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Valor *</label><input class="form-control" type="number" step="0.01" id="mf-valor"></div>'
    +'<div class="form-group"><label class="form-label">Unidad</label><input class="form-control" id="mf-unidad"></div></div>'
    +'<div class="grid-2" style="margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Fecha</label><input class="form-control" type="date" id="mf-fecha" value="'+today()+'"></div>'
    +'<div class="form-group"><label class="form-label">Categoría</label><input class="form-control" id="mf-cat" readonly></div></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Notas</label><input class="form-control" id="mf-notas"></div>'
    +'<div id="mf-err" style="color:var(--coral);font-size:0.78rem;margin-bottom:8px"></div>'
    +'<div class="modal-footer"><button class="btn btn-ghost btn-md" onclick="'+closeAction+'">Cancelar</button><button class="btn btn-primary btn-md" onclick="saveMetric()"><i class="fa-solid fa-plus"></i> Registrar</button></div>'
    +'</div>');
  updMetricUnit();
}

function updMetricUnit(){
  var sel=document.getElementById('mf-metrica');if(!sel) return;
  var opt=sel.selectedOptions[0];
  var u=document.getElementById('mf-unidad');var ct=document.getElementById('mf-cat');
  if(u) u.value=opt?opt.dataset.u||'':'';
  if(ct) ct.value=opt?opt.dataset.c||'':'';
}

function saveMetric(){
  if(!gv('mf-atletaId')){document.getElementById('mf-err').textContent='Selecciona un atleta';return}
  var atletaId=+gv('mf-atletaId');var a=state.atletas.find(function(x){return x.id===atletaId});
  var ms=gv('mf-metrica');var metrica=(ms==='Personalizado'&&gv('mf-custom'))?gv('mf-custom'):ms;
  var valor=parseFloat((document.getElementById('mf-valor')||{value:''}).value);
  if(isNaN(valor)){document.getElementById('mf-err').textContent='Valor requerido';return}
  state.logsRendimiento.push({id:uid(),atletaId:atletaId,atletaNombre:a.nombre+' '+a.apellido,metrica:metrica,valor:valor,unidad:gv('mf-unidad'),fecha:gv('mf-fecha'),notas:gv('mf-notas'),categoria:gv('mf-cat')});
  saveState();
  toast('Métrica registrada ✓');
  if(_metricReturnTo!=null){ openPizarra(_metricReturnTo); } else { closeModal(); renderMetrics(); }
}

/* ════════════════════════════
   CALENDARIO
════════════════════════════ */
function renderCalendar(){
  var c=document.getElementById('calendarContainer');if(!c) return;
  var yr=calDate.getFullYear(),mn=calDate.getMonth();
  var monthStr=new Date(yr,mn,1).toLocaleDateString('es-CL',{month:'long',year:'numeric'});
  var firstDay=new Date(yr,mn,1).getDay();
  var daysInMonth=new Date(yr,mn+1,0).getDate();
  var today_=today();
  var days=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  var html='<div class="card"><div class="cal-header">'
    +'<button class="btn btn-secondary btn-sm" onclick="prevMonth()"><i class="fa-solid fa-chevron-left"></i></button>'
    +'<span class="cal-month">'+monthStr+'</span>'
    +'<button class="btn btn-secondary btn-sm" onclick="nextMonth()"><i class="fa-solid fa-chevron-right"></i></button>'
    +'</div><div class="cal-grid">'
    +days.map(function(d){return '<div class="cal-day-name">'+d+'</div>'}).join('')
    +Array(firstDay).fill('').map(function(){return '<div class="cal-day empty"></div>'}).join('');
  for(var d=1;d<=daysInMonth;d++){
    var ds=yr+'-'+String(mn+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    var evs=state.eventos.filter(function(e){return e.fecha===ds});
    var isToday=ds===today_;
    html+='<div class="cal-day'+(isToday?' today':'')+'" onclick="openDayEvents(\''+ds+'\')">'
      +'<div class="cal-day-num">'+d+'</div>'
      +evs.slice(0,3).map(function(e){
        var bc=EVENT_COLORS[e.tipo]||'var(--coral)';
        return '<div class="cal-event" style="background:'+bc+'20;color:'+bc+';border:1px solid '+bc+'40">'+esc(e.titulo)+'</div>';
      }).join('')
      +(evs.length>3?'<div class="cal-event" style="color:var(--text4)">+'+(evs.length-3)+' más</div>':'')
      +'</div>';
  }
  html+='</div></div>';
  var upcoming=state.eventos.filter(function(e){return e.fecha>=today_}).sort(function(a,b){return a.fecha.localeCompare(b.fecha)}).slice(0,8);
  html+='<div class="card" style="margin-top:16px">'
    +'<p style="font-family:var(--font-display);font-size:1rem;color:var(--text);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:16px">Próximos Eventos</p>'
    +(upcoming.length===0?'<p class="text-muted text-sm">Sin eventos próximos.</p>':'')
    +upcoming.map(function(e){
      var bc=EVENT_COLORS[e.tipo]||'var(--coral)';
      var dayNum=e.fecha.split('-')[2];
      var monStr=new Date(e.fecha+'T00:00').toLocaleDateString('es-CL',{month:'short'});
      return '<div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);align-items:center">'
        +'<div style="width:44px;text-align:center;flex-shrink:0">'
        +'<p style="font-family:var(--font-display);font-size:1.3rem;color:var(--text)">'+dayNum+'</p>'
        +'<p style="font-size:0.6rem;font-weight:700;color:var(--text4);text-transform:uppercase">'+monStr+'</p></div>'
        +'<div style="width:3px;height:36px;background:'+bc+';border-radius:2px;flex-shrink:0;box-shadow:0 0 8px '+bc+'40"></div>'
        +'<div style="flex:1">'
        +'<p style="font-weight:600;font-size:0.87rem;color:var(--text)">'+esc(e.titulo)+'</p>'
        +'<p class="text-xs text-muted mt-4">'+e.hora+' · '+e.duracion+'min'+(e.lugar?' · '+esc(e.lugar):'')+'</p></div>'
        +'<span class="badge badge-'+eventColor(e.tipo)+'">'+e.tipo+'</span>'
        +'<button class="btn btn-sm btn-danger" onclick="deleteEvent('+e.id+')"><i class="fa-solid fa-xmark"></i></button></div>';
    }).join('')+'</div>';
  c.innerHTML=html;
}

function prevMonth(){calDate.setMonth(calDate.getMonth()-1);renderCalendar()}
function nextMonth(){calDate.setMonth(calDate.getMonth()+1);renderCalendar()}
function deleteEvent(id){state.eventos=state.eventos.filter(function(e){return e.id!==id});toast('Evento eliminado','warn');renderCalendar()}

function openDayEvents(ds){
  var evs=state.eventos.filter(function(e){return e.fecha===ds});
  if(evs.length===0){openEventModal(ds);return}
  showModal('<div class="modal"><div class="modal-header"><h2 class="modal-title">Eventos: '+ds+'</h2><button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    +evs.map(function(e){
      var bc=EVENT_COLORS[e.tipo]||'var(--coral)';
      return '<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:14px;margin-bottom:10px;border-left:3px solid '+bc+'">'
        +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'
        +'<p style="font-weight:600;color:var(--text)">'+esc(e.titulo)+'</p>'
        +'<span class="badge badge-'+eventColor(e.tipo)+'">'+e.tipo+'</span></div>'
        +'<p class="text-xs text-muted">'+e.hora+' · '+e.duracion+'min'+(e.lugar?' · '+esc(e.lugar):'')+'</p>'
        +(e.notas?'<p class="text-xs text-muted mt-4">'+esc(e.notas)+'</p>':'')+'</div>';
    }).join('')
    +'<div class="modal-footer"><button class="btn btn-ghost btn-md" onclick="closeModal()">Cerrar</button><button class="btn btn-primary btn-md" onclick="closeModal();openEventModal(\''+ds+'\')"><i class="fa-solid fa-plus"></i> Agregar</button></div></div>');
}

function openEventModal(preDate){
  preDate=preDate||null;
  showModal('<div class="modal">'
    +'<div class="modal-header"><h2 class="modal-title">Nuevo Evento</h2><button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Título *</label><input class="form-control" id="ef-titulo" placeholder="Ej: Sesión potencia - Diego"></div>'
    +'<div class="grid-2" style="margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Tipo</label><select class="form-control" id="ef-tipo">'+TIPO_EVENTO.map(function(t){return '<option>'+t+'</option>'}).join('')+'</select></div>'
    +'<div class="form-group"><label class="form-label">Lugar</label><input class="form-control" id="ef-lugar" placeholder="Gimnasio, Cancha…"></div></div>'
    +'<div class="grid-2" style="margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Fecha</label><input class="form-control" type="date" id="ef-fecha" value="'+(preDate||today())+'"></div>'
    +'<div class="form-group"><label class="form-label">Hora</label><input class="form-control" type="time" id="ef-hora" value="09:00"></div></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Duración (min)</label><input class="form-control" type="number" id="ef-duracion" value="60"></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Atletas</label><select class="form-control" id="ef-atletas" multiple style="height:80px">'
    +state.atletas.map(function(a){return '<option value="'+a.id+'">'+esc(a.nombre)+' '+esc(a.apellido)+'</option>'}).join('')
    +'</select></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Notas</label><input class="form-control" id="ef-notas"></div>'
    +'<div id="ef-err" style="color:var(--coral);font-size:0.78rem;margin-bottom:8px"></div>'
    +'<div class="modal-footer"><button class="btn btn-ghost btn-md" onclick="closeModal()">Cancelar</button><button class="btn btn-primary btn-md" onclick="saveEvent()"><i class="fa-solid fa-plus"></i> Agregar</button></div></div>');
}

function saveEvent(){
  if(!gv('ef-titulo')){document.getElementById('ef-err').textContent='Título requerido';return}
  var sel=document.getElementById('ef-atletas');
  var ids=sel?[].slice.call(sel.selectedOptions).map(function(o){return +o.value}):[];
  var tipo=gv('ef-tipo');
  state.eventos.push({id:uid(),titulo:gv('ef-titulo'),tipo:tipo,lugar:gv('ef-lugar'),fecha:gv('ef-fecha'),hora:gv('ef-hora'),duracion:+(document.getElementById('ef-duracion')||{value:60}).value||60,notas:gv('ef-notas'),atletaIds:ids,color:EVENT_COLORS[tipo]||'var(--coral)'});
  toast('Evento creado ✓');closeModal();renderCalendar();
}

/* ════════════════════════════
   NUTRICIÓN
════════════════════════════ */
function renderNutrition(){
  var sub=document.getElementById('nutriSub');if(sub) sub.textContent=state.planes.length+' planes';
  var c=document.getElementById('nutritionContainer');if(!c) return;
  if(state.planes.length===0){c.innerHTML='<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-bowl-food"></i></div><p class="empty-msg">Sin planes nutricionales.</p></div>';return}
  c.innerHTML='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px">'
    +state.planes.map(function(p){
      var a=state.atletas.find(function(x){return x.id===p.atletaId});
      var total=p.proteinas*4+p.carbohidratos*4+p.grasas*9||1;
      return '<div class="card">'
        +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">'
        +'<div><p style="font-weight:700;font-size:1rem;color:var(--text)">'+esc(p.nombre)+'</p>'
        +(a?'<p class="text-xs text-muted mt-4"><i class="fa-solid fa-user" style="margin-right:5px"></i>'+esc(a.nombre)+' '+esc(a.apellido)+'</p>':'')+'</div>'
        +'<span style="font-family:var(--font-display);font-size:1.5rem;color:var(--coral2)">'+p.calorias+' <span style="font-size:0.7rem;color:var(--text3)">kcal</span></span></div>'
        +'<div class="macro-bar"><div class="macro-label"><span>Proteínas</span><span>'+p.proteinas+'g · '+Math.round(p.proteinas*4/total*100)+'%</span></div><div class="progress-bar"><div class="progress-fill" style="width:'+Math.round(p.proteinas*4/total*100)+'%;background:var(--blue)"></div></div></div>'
        +'<div class="macro-bar"><div class="macro-label"><span>Carbohidratos</span><span>'+p.carbohidratos+'g · '+Math.round(p.carbohidratos*4/total*100)+'%</span></div><div class="progress-bar"><div class="progress-fill" style="width:'+Math.round(p.carbohidratos*4/total*100)+'%;background:var(--amber)"></div></div></div>'
        +'<div class="macro-bar"><div class="macro-label"><span>Grasas</span><span>'+p.grasas+'g · '+Math.round(p.grasas*9/total*100)+'%</span></div><div class="progress-bar"><div class="progress-fill" style="width:'+Math.round(p.grasas*9/total*100)+'%;background:var(--green)"></div></div></div>'
        +'<p class="section-label" style="margin-top:16px"><i class="fa-solid fa-utensils" style="margin-right:7px"></i>Comidas</p>'
        +p.comidas.map(function(m){
          return '<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--line)">'
            +'<div><p style="font-size:0.85rem;font-weight:600;color:var(--text)">'+esc(m.nombre)+'</p><p class="text-xs text-muted mt-4">'+esc(m.descripcion)+'</p></div>'
            +'<span style="font-family:var(--font-display);font-size:0.9rem;color:var(--amber);flex-shrink:0;margin-left:10px">'+m.calorias+' kcal</span></div>';
        }).join('')
        +(p.notas?'<p class="text-xs text-muted" style="margin-top:12px"><i class="fa-solid fa-circle-info" style="margin-right:5px"></i>'+esc(p.notas)+'</p>':'')
        +'<div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end"><button class="btn btn-sm btn-danger" onclick="deletePlan('+p.id+')"><i class="fa-solid fa-trash"></i> Eliminar</button></div>'
        +'</div>';
    }).join('')+'</div>';
}

function deletePlan(id){state.planes=state.planes.filter(function(p){return p.id!==id});toast('Plan eliminado','warn');renderNutrition()}

function openNutritionModal(){
  showModal('<div class="modal modal-wide">'
    +'<div class="modal-header"><h2 class="modal-title">Nuevo Plan Nutricional</h2><button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    +'<div class="grid-2" style="margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Nombre *</label><input class="form-control" id="nf-nombre" placeholder="Plan Masa Muscular"></div>'
    +'<div class="form-group"><label class="form-label">Atleta</label><select class="form-control" id="nf-atletaId"><option value="">General</option>'+state.atletas.map(function(a){return '<option value="'+a.id+'">'+esc(a.nombre)+' '+esc(a.apellido)+'</option>'}).join('')+'</select></div></div>'
    +'<div class="grid-4" style="margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Calorías</label><input class="form-control" type="number" id="nf-cal" value="2500"></div>'
    +'<div class="form-group"><label class="form-label">Proteínas (g)</label><input class="form-control" type="number" id="nf-prot" value="150"></div>'
    +'<div class="form-group"><label class="form-label">Carbos (g)</label><input class="form-control" type="number" id="nf-carb" value="300"></div>'
    +'<div class="form-group"><label class="form-label">Grasas (g)</label><input class="form-control" type="number" id="nf-gras" value="80"></div></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Notas</label><input class="form-control" id="nf-notas" placeholder="Tomar 3L agua diaria…"></div>'
    +'<div id="nf-err" style="color:var(--coral);font-size:0.78rem;margin-bottom:8px"></div>'
    +'<div class="modal-footer"><button class="btn btn-ghost btn-md" onclick="closeModal()">Cancelar</button><button class="btn btn-primary btn-md" onclick="savePlan()"><i class="fa-solid fa-plus"></i> Crear Plan</button></div></div>');
}

function savePlan(){
  if(!gv('nf-nombre')){document.getElementById('nf-err').textContent='Nombre requerido';return}
  var ai=gv('nf-atletaId')?+gv('nf-atletaId'):null;
  state.planes.push({id:uid(),atletaId:ai,nombre:gv('nf-nombre'),calorias:+(document.getElementById('nf-cal').value)||2500,proteinas:+(document.getElementById('nf-prot').value)||150,carbohidratos:+(document.getElementById('nf-carb').value)||300,grasas:+(document.getElementById('nf-gras').value)||80,comidas:[],notas:gv('nf-notas'),fecha:today()});
  toast('Plan creado ✓');closeModal();renderNutrition();
}

/* ════════════════════════════
   PAGOS
════════════════════════════ */
function renderPayments(){
  var paid=state.pagos.filter(function(p){return p.estado==='Pagado'}).reduce(function(s,p){return s+p.monto},0);
  var pend=state.pagos.filter(function(p){return p.estado==='Pendiente'||p.estado==='Vencido'}).reduce(function(s,p){return s+p.monto},0);
  var sub=document.getElementById('pagosSub');if(sub) sub.textContent=state.pagos.length+' registros · '+fmt(paid)+' cobrado · '+fmt(pend)+' pendiente';
  var c=document.getElementById('paymentsContainer');if(!c) return;
  if(state.pagos.length===0){c.innerHTML='<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-credit-card"></i></div><p class="empty-msg">Sin registros de pago.</p></div>';return}
  var scs=[{l:'Total Cobrado',v:fmt(paid),col:'var(--green)'},{l:'Por Cobrar',v:fmt(pend),col:'var(--amber)'},{l:'Registros',v:state.pagos.length,col:'var(--text)'},{l:'Vencidos',v:state.pagos.filter(function(p){return p.estado==='Vencido'}).length,col:'var(--coral2)'}];
  c.innerHTML='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">'
    +scs.map(function(s){return '<div class="stat-card"><div class="stat-label">'+s.l+'</div><div class="stat-value" style="font-size:1.2rem;color:'+s.col+'">'+s.v+'</div></div>'}).join('')
    +'</div>'
    +'<div style="background:var(--surf);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden"><div style="overflow-x:auto"><table class="table">'
    +'<thead><tr>'+['Atleta','Concepto','Monto','Estado','Emisión','Vencimiento','Método',''].map(function(h){return '<th>'+h+'</th>'}).join('')+'</tr></thead>'
    +'<tbody>'+state.pagos.map(function(p){
      return '<tr><td><div style="display:flex;align-items:center;gap:8px">'+avatarHtml(p.atletaNombre,28)+'<span style="font-size:0.83rem;color:var(--text)">'+esc(p.atletaNombre)+'</span></div></td>'
        +'<td>'+esc(p.concepto)+'</td>'
        +'<td style="font-family:var(--font-display);font-size:1rem;color:var(--text)">'+fmt(p.monto)+'</td>'
        +'<td><span class="badge badge-'+statusColor(p.estado)+'">'+p.estado+'</span></td>'
        +'<td class="text-muted">'+p.fechaEmision+'</td>'
        +'<td class="text-muted">'+p.fechaVencimiento+'</td>'
        +'<td class="text-muted text-xs">'+(p.metodoPago||'—')+'</td>'
        +'<td onclick="event.stopPropagation()"><div style="display:flex;gap:6px">'
        +(p.estado!=='Pagado'?'<button class="btn btn-sm btn-secondary" onclick="markPaid('+p.id+')" title="Marcar pagado"><i class="fa-solid fa-check" style="color:var(--green)"></i></button>':'')
        +'<button class="btn btn-sm btn-danger" onclick="deletePayment('+p.id+')"><i class="fa-solid fa-xmark"></i></button>'
        +'</div></td></tr>';
    }).join('')+'</tbody></table></div></div>';
}

function markPaid(id){
  state.pagos=state.pagos.map(function(p){return p.id===id?Object.assign({},p,{estado:'Pagado',metodoPago:p.metodoPago||'Transferencia'}):p});
  toast('Marcado como pagado ✓');renderPayments();buildSidebar();
}
function deletePayment(id){state.pagos=state.pagos.filter(function(p){return p.id!==id});toast('Registro eliminado','warn');renderPayments();buildSidebar()}

function openPaymentModal(){
  showModal('<div class="modal">'
    +'<div class="modal-header"><h2 class="modal-title">Nuevo Cobro</h2><button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Atleta *</label><select class="form-control" id="pf-atletaId"><option value="">— Seleccionar —</option>'+state.atletas.map(function(a){return '<option value="'+a.id+'">'+esc(a.nombre)+' '+esc(a.apellido)+'</option>'}).join('')+'</select></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Concepto *</label><input class="form-control" id="pf-concepto" placeholder="Mensualidad Junio, Pack 3 meses…"></div>'
    +'<div class="grid-2" style="margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Monto (CLP)</label><input class="form-control" type="number" id="pf-monto" value="80000"></div>'
    +'<div class="form-group"><label class="form-label">Estado</label><select class="form-control" id="pf-estado">'+['Pendiente','Pagado','Vencido'].map(function(s){return '<option>'+s+'</option>'}).join('')+'</select></div></div>'
    +'<div class="grid-2" style="margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Fecha Emisión</label><input class="form-control" type="date" id="pf-emision" value="'+today()+'"></div>'
    +'<div class="form-group"><label class="form-label">Fecha Vencimiento</label><input class="form-control" type="date" id="pf-vencimiento" value="'+today()+'"></div></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Método</label><select class="form-control" id="pf-metodo"><option value="">—</option>'+['Transferencia','Efectivo','Tarjeta','Otro'].map(function(m){return '<option>'+m+'</option>'}).join('')+'</select></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Notas</label><input class="form-control" id="pf-notas"></div>'
    +'<div id="pf-err" style="color:var(--coral);font-size:0.78rem;margin-bottom:8px"></div>'
    +'<div class="modal-footer"><button class="btn btn-ghost btn-md" onclick="closeModal()">Cancelar</button><button class="btn btn-primary btn-md" onclick="savePayment()"><i class="fa-solid fa-plus"></i> Registrar</button></div></div>');
}

function savePayment(){
  if(!gv('pf-atletaId')||!gv('pf-concepto')){document.getElementById('pf-err').textContent='Atleta y concepto requeridos';return}
  var ai=+gv('pf-atletaId');var a=state.atletas.find(function(x){return x.id===ai});
  state.pagos.push({id:uid(),atletaId:ai,atletaNombre:a.nombre+' '+a.apellido,concepto:gv('pf-concepto'),monto:+(document.getElementById('pf-monto')||{value:0}).value||0,moneda:'CLP',estado:gv('pf-estado'),fechaEmision:gv('pf-emision'),fechaVencimiento:gv('pf-vencimiento'),metodoPago:gv('pf-metodo'),notas:gv('pf-notas')});
  toast('Pago registrado ✓');closeModal();renderPayments();buildSidebar();
}

/* ════════════════════════════
   DOCUMENTOS
════════════════════════════ */
function renderDocs(){
  var sub=document.getElementById('docsSub');if(sub) sub.textContent=state.documentos.length+' documentos';
  var c=document.getElementById('docsContainer');if(!c) return;
  if(state.documentos.length===0){c.innerHTML='<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-folder-open"></i></div><p class="empty-msg">Sin documentos.</p></div>';return}
  c.innerHTML='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">'
    +state.documentos.map(function(d){
      var a=d.atletaId?state.atletas.find(function(x){return x.id===d.atletaId}):null;
      return '<div class="card card-hover" onclick="showDoc('+d.id+')">'
        +'<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">'
        +'<div style="background:var(--coral-pale);border:1px solid var(--danger-border);border-radius:var(--radius-sm);width:42px;height:42px;display:flex;align-items:center;justify-content:center;color:var(--coral2);font-size:1.1rem;flex-shrink:0"><i class="fa-solid fa-file-lines"></i></div>'
        +'<span class="badge badge-blue">'+esc(d.tipo)+'</span></div>'
        +'<p style="font-weight:700;font-size:0.95rem;color:var(--text);margin-bottom:6px">'+esc(d.nombre)+'</p>'
        +(a?'<p class="text-xs text-muted mb-8"><i class="fa-solid fa-user" style="margin-right:5px"></i>'+esc(a.nombre)+' '+esc(a.apellido)+'</p>':'<p class="text-xs text-muted mb-8"><i class="fa-solid fa-users" style="margin-right:5px"></i>General</p>')
        +'<p class="text-xs text-muted">'+d.fecha+'</p>'
        +(d.etiquetas&&d.etiquetas.length?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px">'+d.etiquetas.map(function(t){return '<span class="badge badge-gray">'+esc(t)+'</span>'}).join('')+'</div>':'')
        +'<div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end" onclick="event.stopPropagation()">'
        +'<button class="btn btn-sm btn-danger" onclick="deleteDoc('+d.id+')"><i class="fa-solid fa-xmark"></i></button></div></div>';
    }).join('')+'</div>';
}

function showDoc(id){
  var d=state.documentos.find(function(x){return x.id===id});if(!d) return;
  showModal('<div class="modal modal-wide">'
    +'<div class="modal-header"><h2 class="modal-title">'+esc(d.nombre)+'</h2><button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    +'<div style="display:flex;gap:8px;margin-bottom:16px"><span class="badge badge-blue">'+esc(d.tipo)+'</span><span class="text-xs text-muted">'+d.fecha+'</span></div>'
    +'<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:16px;white-space:pre-wrap;font-family:var(--font-mono);font-size:0.82rem;color:var(--text2);max-height:300px;overflow-y:auto;line-height:1.7">'+esc(d.contenido)+'</div>'
    +'<div class="modal-footer"><button class="btn btn-ghost btn-md" onclick="closeModal()">Cerrar</button></div></div>');
}

function deleteDoc(id){state.documentos=state.documentos.filter(function(d){return d.id!==id});toast('Documento eliminado','warn');renderDocs()}

function openDocModal(){
  showModal('<div class="modal">'
    +'<div class="modal-header"><h2 class="modal-title">Nuevo Documento</h2><button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Nombre *</label><input class="form-control" id="df-nombre" placeholder="Contrato Temporada 2025"></div>'
    +'<div class="grid-2" style="margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Tipo</label><select class="form-control" id="df-tipo">'+['Contrato','Protocolo','Informe','Evaluación','Otro'].map(function(t){return '<option>'+t+'</option>'}).join('')+'</select></div>'
    +'<div class="form-group"><label class="form-label">Atleta</label><select class="form-control" id="df-atletaId"><option value="">General</option>'+state.atletas.map(function(a){return '<option value="'+a.id+'">'+esc(a.nombre)+' '+esc(a.apellido)+'</option>'}).join('')+'</select></div></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Contenido</label><textarea class="form-control" id="df-contenido" rows="5" placeholder="Escribe el contenido…"></textarea></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Etiquetas (coma)</label><input class="form-control" id="df-tags" placeholder="contrato, temporada"></div>'
    +'<div id="df-err" style="color:var(--coral);font-size:0.78rem;margin-bottom:8px"></div>'
    +'<div class="modal-footer"><button class="btn btn-ghost btn-md" onclick="closeModal()">Cancelar</button><button class="btn btn-primary btn-md" onclick="saveDoc()"><i class="fa-solid fa-plus"></i> Guardar</button></div></div>');
}

function saveDoc(){
  if(!gv('df-nombre')){document.getElementById('df-err').textContent='Nombre requerido';return}
  var ai=gv('df-atletaId')?+gv('df-atletaId'):null;
  var tags=gv('df-tags').split(',').map(function(t){return t.trim()}).filter(Boolean);
  state.documentos.push({id:uid(),atletaId:ai,nombre:gv('df-nombre'),tipo:gv('df-tipo'),contenido:(document.getElementById('df-contenido')||{value:''}).value||'',fecha:today(),etiquetas:tags});
  toast('Documento guardado ✓');closeModal();renderDocs();
}

/* ════════════════════════════
   MODAL SYSTEM
════════════════════════════ */
function showModal(html){
  var c=document.getElementById('modalContainer');
  c.innerHTML='<div class="modal-overlay" onclick="handleOvClick(event)">'+html+'</div>';
  document.body.style.overflow='hidden';
}
function closeModal(){
  var c=document.getElementById('modalContainer');
  // Animate out
  var ov=c.querySelector('.modal-overlay');
  var m=c.querySelector('.modal');
  if(m){
    m.style.cssText+='animation:none;transform:translateY(30px);opacity:0;transition:transform 0.25s,opacity 0.25s';
    setTimeout(function(){c.innerHTML='';document.body.style.overflow=''},250);
  } else {
    c.innerHTML='';document.body.style.overflow='';
  }
}
function handleOvClick(e){if(e.target===e.currentTarget) closeModal()}
document.addEventListener('keydown',function(e){if(e.key==='Escape') closeModal()});

/* ════════════════════════════
   ROUTINES — VER TAB
════════════════════════════ */

function renderRoutines(){
  var q  = (document.getElementById('routineSearch')||{value:''}).value.toLowerCase();
  var sf = (document.getElementById('routineSportFilter')||{value:''}).value;
  var sportSel = document.getElementById('routineSportFilter');
  if(sportSel){
    var sports=[...new Set(state.rutinas.map(function(r){return r.deporte}))].filter(Boolean);
    var cur=sportSel.value;
    sportSel.innerHTML='<option value="">Todos</option>'+sports.map(function(s){return '<option value="'+esc(s)+'"'+(cur===s?' selected':'')+'>'+esc(s)+'</option>'}).join('');
  }
  var sub=document.getElementById('rutinasSub');
  if(sub) sub.textContent=state.rutinas.length+' rutinas · '+state.rutinas.filter(function(r){return r.activa}).length+' activas';
  var list=state.rutinas;
  if(q) list=list.filter(function(r){return (r.nombre+' '+r.deporte+' '+r.tipo).toLowerCase().includes(q)});
  if(sf) list=list.filter(function(r){return r.deporte===sf});
  var c=document.getElementById('routinesContainer'); if(!c) return;
  if(list.length===0){
    c.innerHTML='<div class="empty-state">'
      +'<div class="empty-icon"><i class="fa-solid fa-clipboard-list"></i></div>'
      +'<p class="empty-msg">Sin rutinas aún</p>'
      +'<button class="btn btn-primary btn-md" style="margin-top:14px" onclick="switchRutinaTab(\'crear\')">'
      +'<i class="fa-solid fa-fire-flame-curved"></i> Ir al Constructor</button></div>';
    return;
  }
  c.innerHTML='<div class="routine-grid stagger">'+list.map(function(r){return routineCardHtml(r)}).join('')+'</div>';
}

function routineCardHtml(r){
  var an=r.atletaId?athleteName(r.atletaId):null;
  return '<div class="routine-card" onclick="showRoutineDetail('+r.id+')">'
    +'<div class="routine-card-accent"></div>'
    +'<div style="padding:16px 18px 14px">'
    +'<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'
    +'<span class="badge badge-'+diffColor(r.dificultad)+'">'+esc(r.dificultad)+'</span>'
    +'<span class="badge badge-white">'+esc(r.tipo)+'</span>'
    +(r.deporte?'<span class="badge badge-gray">'+esc(r.deporte)+'</span>':'')
    +'<span class="badge badge-'+(r.activa?'green':'gray')+'">'+(r.activa?'Activa':'Inactiva')+'</span></div>'
    +'<p style="font-weight:700;font-size:1rem;color:var(--text);margin-bottom:8px">'+esc(r.nombre)+'</p>'
    +(an?'<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding:7px 10px;background:var(--bg3);border-radius:8px;border:1px solid var(--line)">'+avatarHtml(an,22)+'<span class="text-xs text-muted">'+esc(an)+'</span></div>':'')
    +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px">'
    +[['⏱',r.duracion+'min'],['💪',r.ejercicios.length+' ejerc.'],['📅',r.fecha]].map(function(x){
      return '<div style="background:var(--bg3);border:1px solid var(--line);border-radius:8px;padding:7px;text-align:center"><div style="font-size:0.85rem">'+x[0]+'</div><div class="text-xs text-muted mt-4">'+esc(x[1])+'</div></div>';
    }).join('')+'</div>'
    +(r.descripcion?'<p class="text-xs text-muted" style="border-top:1px solid var(--line);padding-top:8px">'+esc(r.descripcion)+'</p>':'')
    +'<div style="display:flex;gap:8px;margin-top:10px;justify-content:flex-end" onclick="event.stopPropagation()">'
    +'<button class="btn btn-sm btn-outline" onclick="openRoutineModal('+r.id+')"><i class="fa-solid fa-pen"></i> Editar</button>'
    +'<button class="btn btn-sm btn-danger" onclick="deleteRoutine('+r.id+')"><i class="fa-solid fa-xmark"></i></button>'
    +'</div></div></div>';
}

function deleteRoutine(id){ state.rutinas=state.rutinas.filter(function(r){return r.id!==id}); toast('Rutina eliminada','warn'); renderRoutines(); }

function showRoutineDetail(id){
  var r=state.rutinas.find(function(x){return x.id===id}); if(!r) return;
  showModal('<div class="modal modal-wide">'
    +'<div class="modal-header"><h2 class="modal-title">'+esc(r.nombre)+'</h2>'
    +'<button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    +'<div style="display:flex;gap:7px;margin-bottom:16px;flex-wrap:wrap">'
    +'<span class="badge badge-'+diffColor(r.dificultad)+'">'+esc(r.dificultad)+'</span>'
    +'<span class="badge badge-white">'+esc(r.tipo)+'</span>'
    +(r.deporte?'<span class="badge badge-gray">'+esc(r.deporte)+'</span>':'')
    +'<span class="badge badge-'+(r.activa?'green':'gray')+'">'+(r.activa?'Activa':'Inactiva')+'</span></div>'
    +(r.atletaId?'<p class="text-sm" style="margin-bottom:12px"><i class="fa-solid fa-user text-muted" style="margin-right:6px"></i><strong>'+esc(athleteName(r.atletaId))+'</strong></p>':'')
    +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">'
    +[['Duración',r.duracion+' min'],['Ejercicios',r.ejercicios.length],['Fecha',r.fecha]].map(function(x){
      return '<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:12px;text-align:center">'
        +'<p style="font-size:0.62rem;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:0.1em">'+x[0]+'</p>'
        +'<p style="font-family:var(--font-display);font-size:1.2rem;color:var(--text);margin-top:4px">'+x[1]+'</p></div>';
    }).join('')+'</div>'
    +(r.descripcion?'<p class="text-sm" style="color:var(--text2);margin-bottom:16px">'+esc(r.descripcion)+'</p>':'')
    +(r.ejercicios.length>0?'<p class="section-label"><i class="fa-solid fa-dumbbell" style="margin-right:8px"></i>Ejercicios ('+r.ejercicios.length+')</p>'
    +'<div style="overflow-x:auto"><table class="table"><thead><tr>'
    +['#','Ejercicio','Series','Reps','Carga','Descanso','Notas'].map(function(h){return '<th>'+h+'</th>'}).join('')
    +'</tr></thead><tbody>'
    +r.ejercicios.map(function(e,i){
      return '<tr><td style="color:var(--coral2);font-family:var(--font-display)">'+(i+1)+'</td>'
        +'<td style="font-weight:600">'+esc(e.nombre)+'</td><td>'+e.series+'</td>'
        +'<td>'+esc(e.reps)+'</td><td>'+(esc(e.peso)||'—')+'</td>'
        +'<td>'+esc(e.descanso)+'</td><td class="text-muted">'+(esc(e.notas)||'—')+'</td></tr>';
    }).join('')+'</tbody></table></div>':'')
    +'<div class="modal-footer">'
    +'<button class="btn btn-danger btn-md" onclick="deleteRoutine('+r.id+');closeModal()"><i class="fa-solid fa-trash"></i></button>'
    +'<button class="btn btn-outline btn-md" onclick="closeModal();openRoutineModal('+r.id+')"><i class="fa-solid fa-pen"></i> Editar</button>'
    +'</div></div>');
}

function openRoutineModal(id){
  id=id||null; editId.routine=id;
  var r=id?state.rutinas.find(function(x){return x.id===id}):{ejercicios:[]};
  _exercises=JSON.parse(JSON.stringify(r.ejercicios||[]));
  showModal('<div class="modal modal-wide">'
    +'<div class="modal-header"><h2 class="modal-title">'+(id?'Editar Rutina':'Nueva Rutina')+'</h2>'
    +'<button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    +'<div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:12px;margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Nombre *</label><input class="form-control" id="rf-nombre" value="'+esc(r.nombre||'')+'"></div>'
    +'<div class="form-group"><label class="form-label">Tipo</label><select class="form-control" id="rf-tipo">'+TIPOS_RUTINA.map(function(t){return '<option'+(((r.tipo||'Fuerza')===t)?' selected':'')+'>'+t+'</option>'}).join('')+'</select></div>'
    +'<div class="form-group"><label class="form-label">Dificultad</label><select class="form-control" id="rf-dificultad">'+DIFICULTADES.map(function(d){return '<option'+(((r.dificultad||'Media')===d)?' selected':'')+'>'+d+'</option>'}).join('')+'</select></div></div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:12px">'
    +'<div class="form-group"><label class="form-label">Deporte</label><select class="form-control" id="rf-deporte"><option value="">General</option>'+DEPORTES.map(function(d){return '<option'+(((r.deporte||'')===d)?' selected':'')+'>'+esc(d)+'</option>'}).join('')+'</select></div>'
    +'<div class="form-group"><label class="form-label">Atleta</label><select class="form-control" id="rf-atletaId"><option value="">Sin asignar</option>'+state.atletas.map(function(a){return '<option value="'+a.id+'"'+(r.atletaId===a.id?' selected':'')+'>'+esc(a.nombre)+' '+esc(a.apellido)+'</option>'}).join('')+'</select></div>'
    +'<div class="form-group"><label class="form-label">Duración (min)</label><input class="form-control" type="number" id="rf-duracion" value="'+(r.duracion||60)+'"></div>'
    +'<div class="form-group"><label class="form-label">Fecha</label><input class="form-control" type="date" id="rf-fecha" value="'+(r.fecha||today())+'"></div></div>'
    +'<div class="form-group" style="margin-bottom:12px"><label class="form-label">Descripción</label><textarea class="form-control" id="rf-descripcion" rows="2">'+esc(r.descripcion||'')+'</textarea></div>'
    +'<div class="section-label"><span><i class="fa-solid fa-dumbbell" style="margin-right:8px"></i>Ejercicios</span><button class="btn btn-sm btn-secondary" onclick="addExercise()">＋ Agregar</button></div>'
    +'<div id="exList" style="display:flex;flex-direction:column;gap:8px;max-height:280px;overflow-y:auto;margin-bottom:8px"></div>'
    +'<div id="rf-err" style="color:var(--coral);font-size:0.78rem;margin-bottom:8px"></div>'
    +'<div class="modal-footer"><button class="btn btn-ghost btn-md" onclick="closeModal()">Cancelar</button>'
    +'<button class="btn btn-primary btn-md" onclick="saveRoutine()"><i class="fa-solid fa-floppy-disk"></i> Guardar</button></div>'
    +'</div>');
  renderExerciseList();
}

function renderExerciseList(){
  var c=document.getElementById('exList'); if(!c) return;
  if(_exercises.length===0){c.innerHTML='<p style="font-size:0.78rem;color:var(--text4);text-align:center;padding:16px;background:var(--bg3);border-radius:var(--radius-sm);border:1px dashed var(--line2)">Sin ejercicios. Haz clic en "+ Agregar".</p>';return}
  var musculos=Object.keys(MUSCLE_ICONS).sort();
  c.innerHTML=_exercises.map(function(e,i){
    return '<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:12px">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'
      +'<span style="font-size:0.68rem;font-weight:700;color:var(--coral2);letter-spacing:0.1em;text-transform:uppercase">EJERCICIO #'+(i+1)+'</span>'
      +'<button onclick="removeExercise('+i+')" style="background:none;border:none;color:var(--coral);cursor:pointer"><i class="fa-solid fa-xmark"></i></button></div>'
      +'<div class="ex-row-grid" style="display:grid;grid-template-columns:2fr 1.4fr;gap:8px;margin-bottom:8px">'
      +'<div><p style="font-size:0.6rem;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Ejercicio</p>'
      +'<input class="form-control" value="'+esc(e.nombre||'')+'" type="text" placeholder="Nombre" oninput="updEx('+i+',0,this.value)" style="font-size:0.8rem;padding:8px 10px"></div>'
      +'<div><p style="font-size:0.6rem;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Músculo</p>'
      +'<select class="form-control" oninput="updEx('+i+',5,this.value)" style="font-size:0.8rem;padding:8px 10px">'
      +'<option value=""'+(!e.notas||!MUSCLE_ICONS[e.notas]?' selected':'')+'>Sin asignar</option>'
      +musculos.map(function(m){return '<option'+(e.notas===m?' selected':'')+'>'+esc(m)+'</option>'}).join('')
      +'</select></div></div>'
      +'<div class="ex-row-grid" style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px">'
      +[['Series',e.series,'number',''],['Reps',e.reps,'text',''],['Carga',e.peso,'text','kg'],['Descanso',e.descanso,'text','']].map(function(x,fi){
        return '<div><p style="font-size:0.6rem;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">'+x[0]+'</p>'
          +'<input class="form-control" value="'+esc(x[1]||'')+'" type="'+x[2]+'" placeholder="'+x[3]+'" oninput="updEx('+i+','+(fi+1)+',this.value)" style="font-size:0.8rem;padding:8px 10px"></div>';
      }).join('')+'</div></div>';
  }).join('');
}

function addExercise(){_exercises.push({id:uid(),nombre:'',series:4,reps:'8-12',peso:'',descanso:'90s',notas:''});renderExerciseList()}
function removeExercise(i){_exercises.splice(i,1);renderExerciseList()}
function updEx(i,fi,v){var fields=['nombre','series','reps','peso','descanso','notas'];if(_exercises[i]) _exercises[i][fields[fi]]=fi===1?+v:v}

function saveRoutine(){
  if(!gv('rf-nombre')){document.getElementById('rf-err').textContent='Nombre requerido';return}
  var atletaIdVal=document.getElementById('rf-atletaId').value;
  if(!atletaIdVal){
    if(!confirm('No asignaste esta rutina a ningún atleta: no aparecerá en su perfil ni se podrá iniciar una sesión en vivo con ella. ¿Guardar igual?')) return;
  }
  var data={nombre:gv('rf-nombre'),tipo:gv('rf-tipo'),dificultad:gv('rf-dificultad'),deporte:gv('rf-deporte'),duracion:+(document.getElementById('rf-duracion').value)||60,fecha:gv('rf-fecha'),descripcion:gv('rf-descripcion'),atletaId:atletaIdVal?+atletaIdVal:null,ejercicios:JSON.parse(JSON.stringify(_exercises)),activa:true};
  if(editId.routine){state.rutinas=state.rutinas.map(function(r){return r.id===editId.routine?Object.assign({},r,data):r});toast('Rutina actualizada ✓')}
  else{state.rutinas.push(Object.assign({},data,{id:uid()}));toast('Rutina creada ✓')}
  saveState();
  closeModal();renderRoutines();
}

/* ════════════════════════════
   INIT
════════════════════════════ */
function init(){
  loadState();
  buildSidebar();
  buildMobileNav();
  renderDashboard();
  setInterval(saveState, 4000);
  window.addEventListener('beforeunload', saveState);
}

init();