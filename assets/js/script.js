
/* ============================================================
   APEX v3 PREMIUM — Sistema Entrenador
   ============================================================ */

/* ── State ── */
var state = {
  entrenador:{nombre:'Entrenador',deporte:'Multi-deporte',club:'FASCIA Club'},
  atletas:[],
  rutinas:[],
  logsRendimiento:[],
  eventos:[],
  planes:[],
  pagos:[],
  documentos:[],
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
var liveSession=null; // { atletaId, rutinaId, dia, startedAt, muscles:{...}, timerId }

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
      // Limpiar datos huérfanos: métricas/pagos/planes/sesiones de atletas que ya no existen
      var atletaIds = state.atletas.map(function(a){return a.id});
      state.logsRendimiento = state.logsRendimiento.filter(function(m){return atletaIds.indexOf(m.atletaId)!==-1});
      state.pagos = state.pagos.filter(function(p){return atletaIds.indexOf(p.atletaId)!==-1});
      state.planes = state.planes.filter(function(p){return !p.atletaId || atletaIds.indexOf(p.atletaId)!==-1});
      state.sesiones = state.sesiones.filter(function(s){return atletaIds.indexOf(s.atletaId)!==-1});
      state.anotaciones = state.anotaciones.filter(function(n){return atletaIds.indexOf(n.atletaId)!==-1});
      state.rutinas = state.rutinas.filter(function(r){return !r.atletaId || atletaIds.indexOf(r.atletaId)!==-1});
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
  var colors=['#F1FF0A','#F5FF4D','#C2CC08','var(--coral2)','#9CA306'];
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
  moveSidebarBlob(false);
  renderView(id);
  moveMobileNavBlob(false);
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
  updateDaysPickerBtn();
  renderDaysTabs();
  // Init body-muscles after DOM is painted
  setTimeout(function(){
    initBodyMuscles();
  }, 200);
}

/* ── Sidebar ── */
var _sidebarBlobLastTop = null;

function buildSidebar(){
  var el=document.getElementById('suName'); if(el) el.textContent=state.entrenador.nombre;
  var es2=document.getElementById('suSport'); if(es2) es2.textContent=state.entrenador.deporte;
  var nav=document.getElementById('sidebarNav');
  nav.innerHTML='<div class="sidebar-blob" id="sidebarBlob"></div>'
    + NAV_ITEMS.map(function(item){
    var badge=item.id==='atletas'?state.atletas.filter(function(a){return a.estado==='Activo'}).length
             :item.id==='pagos'?state.pagos.filter(function(p){return p.estado==='Pendiente'||p.estado==='Vencido'}).length:0;
    return '<button class="nav-item'+(currentView===item.id?' active':'')+'" data-view="'+item.id+'" onclick="navigate(\''+item.id+'\')">'
      +'<i class="fa-solid '+item.icon+' nav-icon"></i>'
      +'<span class="nav-label">'+item.label+'</span>'
      +(badge>0?'<span class="nav-badge">'+badge+'</span>':'')
      +'</button>';
  }).join('');
  _sidebarBlobLastTop = null;
  requestAnimationFrame(function(){ moveSidebarBlob(true); });
}

/* Slide + vertical-jelly-stretch the active blob to the current nav item.
   Mirrors the horizontal liquid effect from the reference nav, adapted to a
   vertical list: scaleY instead of scaleX, transform-origin flips top/bottom
   based on travel direction. */
function moveSidebarBlob(instant){
  var blob = document.getElementById('sidebarBlob');
  var navEl = document.getElementById('sidebarNav');
  var activeBtn = navEl ? navEl.querySelector('.nav-item.active') : null;
  if(!blob || !navEl || !activeBtn) { if(blob) blob.classList.remove('show'); return; }

  var btnRect = activeBtn.getBoundingClientRect();
  var navRect = navEl.getBoundingClientRect();
  var targetTop = btnRect.top - navRect.top + navEl.scrollTop;

  blob.classList.add('show');

  if(instant || _sidebarBlobLastTop === null){
    blob.style.transition = 'none';
    blob.style.top = targetTop + 'px';
    blob.style.transform = 'scaleY(1)';
    // Force reflow so the next transition isn't merged with this instant set
    void blob.offsetHeight;
    blob.style.transition = '';
    _sidebarBlobLastTop = targetTop;
    return;
  }

  var goingDown = targetTop > _sidebarBlobLastTop;
  blob.style.transformOrigin = goingDown ? 'center top' : 'center bottom';

  // Phase 1: stretch toward the target while still at the old position
  blob.style.transition = 'transform 0.3s cubic-bezier(0.42,0,0.58,1)';
  blob.style.transform = 'scaleY(1.8)';

  setTimeout(function(){
    blob.style.transition = 'top 0.5s cubic-bezier(0.25,1,0.5,1), transform 0.45s cubic-bezier(0.25,1,0.5,1)';
    blob.style.top = targetTop + 'px';
    blob.style.transform = 'scaleY(1)';
  }, 140);

  _sidebarBlobLastTop = targetTop;
}

function buildMobileNav(){
  var nav=document.getElementById('mobileNavInner');
  if(!nav) return;
  nav.innerHTML='<div class="mnav-blob" id="mnavBlob"></div>'
    + MOBILE_NAV.map(function(item){
    return '<button class="mobile-nav-item'+(currentView===item.id?' active':'')+'" data-view="'+item.id+'" onclick="navigate(\''+item.id+'\')">'
      +'<i class="fa-solid '+item.icon+'"></i>'
      +'<span class="mnav-label">'+item.label+'</span>'
      +'</button>';
  }).join('');
  nav.querySelectorAll('.mobile-nav-item').forEach(function(btn){
    btn.addEventListener('click', mnavCreateRipple);
  });
}

/* Liquid blob para el mobile nav — replica exacta de la mecánica de nav.html:
   1) mide el botón activo real (getBoundingClientRect) → así el blob siempre
      encaja con el ancho real del botón (ícono + texto), nunca un tamaño fijo.
   2) detecta dirección comparando con la última posición.
   3) fase 1: estira (scaleX) hacia el destino desde el origen correcto
      (left/right center según dirección) mientras sigue en la posición vieja.
   4) fase 2 (tras un timeout corto): mueve left/width al botón destino y
      vuelve a scaleX(1) con una curva más elástica — efecto "aterrizaje". */
var _mnavBlobLastLeft = null;

function moveMobileNavBlob(instant){
  var blob = document.getElementById('mnavBlob');
  var inner = document.getElementById('mobileNavInner');
  var activeBtn = inner ? inner.querySelector('.mobile-nav-item.active') : null;
  if(!blob || !inner || !activeBtn){ if(blob) blob.classList.remove('show'); return; }

  var btnRect = activeBtn.getBoundingClientRect();
  var innerRect = inner.getBoundingClientRect();
  var pad = 4; // pequeño respiro horizontal, igual de sutil que en el nav de referencia
  var targetLeft = (btnRect.left - innerRect.left) + pad;
  var targetWidth = btnRect.width - (pad * 2);

  blob.classList.add('show');

  if(instant || _mnavBlobLastLeft === null){
    blob.style.transition = 'none';
    blob.style.width = targetWidth + 'px';
    blob.style.left = targetLeft + 'px';
    blob.style.transform = 'scaleX(1)';
    void blob.offsetHeight; // forzar reflow para que la próxima transición no se mezcle con esta
    blob.style.transition = '';
    _mnavBlobLastLeft = targetLeft;
    return;
  }

  var goingRight = targetLeft > _mnavBlobLastLeft;
  blob.style.transformOrigin = goingRight ? 'left center' : 'right center';

  // Fase 1: estiramiento líquido hacia el destino
  blob.style.transition = 'transform 0.3s cubic-bezier(0.42,0,0.58,1)';
  blob.style.transform = 'scaleX(2.2)';

  setTimeout(function(){
    // Fase 2: aterriza en la posición/ancho real del botón destino
    blob.style.transition = 'left 0.5s cubic-bezier(0.25,1,0.5,1), width 0.3s ease, transform 0.45s cubic-bezier(0.25,1,0.5,1)';
    blob.style.width = targetWidth + 'px';
    blob.style.left = targetLeft + 'px';
    blob.style.transform = 'scaleX(1)';
  }, 160);

  _mnavBlobLastLeft = targetLeft;
}

function mnavCreateRipple(e){
  var btn = e.currentTarget;
  var circle = document.createElement('span');
  circle.className = 'mnav-ripple';
  var rect = btn.getBoundingClientRect();
  var size = Math.max(rect.width, rect.height);
  circle.style.width = circle.style.height = size + 'px';
  var x = (e.clientX || (rect.left+rect.width/2)) - rect.left - size/2;
  var y = (e.clientY || (rect.top+rect.height/2)) - rect.top - size/2;
  circle.style.left = x + 'px';
  circle.style.top = y + 'px';
  btn.appendChild(circle);
  circle.addEventListener('animationend', function(){ circle.remove(); });
}

function toggleSidebar(){
  sidebarCollapsed=!sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed',sidebarCollapsed);
  document.getElementById('collapseIcon').className='fa-solid '+(sidebarCollapsed?'fa-chevron-right':'fa-chevron-left');
  if(!sidebarCollapsed){
    setTimeout(function(){ moveSidebarBlob(true); }, 320);
  }
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
  var a=state.atletas.find(function(x){return x.id===id});
  var nombre=a?(a.nombre+' '+a.apellido):'este atleta';
  showConfirm({
    title:'Eliminar atleta',
    message:'¿Seguro que quieres eliminar a '+nombre+'? Se perderán también sus rutinas, métricas, pagos y sesiones asociadas. Esta acción no se puede deshacer.',
    confirmText:'Eliminar', danger:true,
    onConfirm:function(){
      state.atletas=state.atletas.filter(function(x){return x.id!==id});
      saveState();
      toast('Atleta eliminado','warn');renderAthletes();buildSidebar();
    }
  });
}

function showAthleteDetail(id){
  var a=state.atletas.find(function(x){return x.id===id});if(!a) return;
  var rt=state.rutinas.filter(function(r){return r.atletaId===id});
  var mt=state.logsRendimiento.filter(function(m){return m.atletaId===id});
  var py=state.pagos.filter(function(p){return p.atletaId===id});
  var pp=py.filter(function(p){return p.estado==='Pendiente'||p.estado==='Vencido'}).length;
  var sesiones=(state.sesiones||[]).filter(function(s){return s.atletaId===id}).slice().reverse();
  var sesionDias=PLAN_DIAS.filter(function(d){ return sesiones.some(function(s){return s.dia===d}); });
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
          +'<button class="btn btn-sm btn-outline" onclick="closeModalThen(function(){showRoutineDetail('+r.id+')})"><i class="fa-solid fa-eye"></i></button>'
          +'<button class="btn btn-sm btn-primary" onclick="startLiveSession('+a.id+','+r.id+')"><i class="fa-solid fa-play"></i> Iniciar Sesión</button>'
          +'</div></div>';
      }).join('')
      +'</div>'
      :'<p class="text-sm text-muted">No hay rutinas asignadas. Crea una rutina y asígnasela desde el constructor.</p>')
    +'</div>'

    +(sesiones.length>0?'<div style="margin-bottom:16px">'
    +'<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap">'
    +'<p class="section-label" style="margin:0"><span><i class="fa-solid fa-clock-rotate-left" style="margin-right:7px"></i>Historial de sesiones ('+sesiones.length+')</span></p>'
    +(sesionDias.length>1?'<select class="form-control" id="athleteSessionDayFilter" style="width:auto;font-size:0.75rem;padding:5px 8px" onchange="renderAthleteSessions('+a.id+')"><option value="">Todos los días</option>'+sesionDias.map(function(d){return '<option>'+d+'</option>'}).join('')+'</select>':'')
    +'</div>'
    +'<div id="athleteSessionsList" style="display:flex;flex-direction:column;gap:6px;max-height:180px;overflow-y:auto"></div>'
    +'</div>':'')

    +'<div class="modal-footer">'
    +'<button class="btn btn-danger btn-md" onclick="deleteAthlete('+a.id+')"><i class="fa-solid fa-trash"></i> Eliminar</button>'
    +'<button class="btn btn-outline btn-md" onclick="closeModalThen(function(){openAthleteModal('+a.id+')})"><i class="fa-solid fa-pen"></i> Editar</button>'
    +'</div></div>');
  renderAthleteSessions(id);
}

/* Lista de sesiones del alumno, filtrable por día (selector "Todos los días" / día específico).
   Se usa tanto para la carga inicial como para refrescar cuando cambia el filtro. */
function renderAthleteSessions(athleteId){
  var box=document.getElementById('athleteSessionsList');
  if(!box) return;
  var filterDia=(document.getElementById('athleteSessionDayFilter')||{value:''}).value;
  var sesiones=(state.sesiones||[]).filter(function(s){return s.atletaId===athleteId && (!filterDia || s.dia===filterDia)}).slice().reverse();
  box.innerHTML = sesiones.length ? sesiones.map(function(s){
    var r=state.rutinas.find(function(x){return x.id===s.rutinaId});
    var musc=Object.keys(s.musculos||{});
    var completados=musc.filter(function(m){return s.musculos[m].completado}).length;
    return '<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;cursor:pointer" onclick="showSessionDetail('+s.id+')">'
      +'<div><p class="text-sm" style="color:var(--text2)">'+esc(s.fecha)+' · '+esc(r?r.nombre:'Rutina')+(s.dia?' · <span style="color:var(--coral2)">'+esc(s.dia)+'</span>':'')+'</p>'
      +'<p class="text-xs text-muted">'+esc(s.horaInicio)+' – '+esc(s.horaFin)+' · '+fmtDuration(s.duracionTotalSeg)+' · '+completados+'/'+musc.length+' músculos completados</p></div>'
      +'<i class="fa-solid fa-chevron-right text-muted" style="font-size:0.7rem"></i></div>';
  }).join('') : '<p class="text-sm text-muted" style="padding:6px 0">Sin sesiones para este filtro.</p>';
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
var BM_COLOR_ACTIVE  = '#F1FF0A';  // coral — agregado al constructor
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
var builderData  = {};  // { 'Bíceps': { exercises:[], done:false } } — datos del día activo
var builderDays  = [];  // ['Lunes','Miércoles','Viernes'] — días sugeridos para los ejercicios

/* ── Multi-day plan state ── */
var weekPlan     = {};  // { 'Lunes': { enfoque:'Empuje', muscles:{ 'Bíceps':{...} } }, ... }
var activePlanDay = null; // día seleccionado actualmente en el constructor

var DIAS_SEMANA = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

/* ══════════════════════════════════════════
   DAYS PICKER — selector opcional de días de entrenamiento
   Siempre visible arriba del constructor; pre-llena el campo
   "Día" de cada ejercicio sin alterar el flujo del muñeco.
══════════════════════════════════════════ */
function renderDaysPicker(){
  var pop = document.getElementById('daysPickerPop');
  if(!pop) return;
  pop.innerHTML = '<p class="days-picker-title">Días de entrenamiento</p>'
    + '<div class="days-picker-grid">'
    + DIAS_SEMANA.map(function(d){
        var checked = builderDays.indexOf(d) !== -1;
        return '<div class="day-check'+(checked?' checked':'')+'" onclick="toggleBuilderDay(\''+d+'\')">'
          + '<div class="day-check-box"><i class="fa-solid fa-check"></i></div>'
          + '<span class="day-check-label">'+d+'</span>'
          + '</div>';
      }).join('')
    + '</div>'
    + (builderDays.length>0?'<button class="days-picker-clear" onclick="clearBuilderDays()"><i class="fa-solid fa-rotate-left" style="margin-right:5px"></i>Limpiar selección</button>':'');
  updateDaysPickerBtn();
}

function updateDaysPickerBtn(){
  var btn = document.getElementById('daysPickerBtn');
  var lbl = document.getElementById('daysPickerLabel');
  if(!btn || !lbl) return;
  if(builderDays.length === 0){
    lbl.textContent = 'Días';
    btn.classList.remove('has-days');
  } else if(builderDays.length === 1){
    lbl.textContent = builderDays[0];
    btn.classList.add('has-days');
  } else {
    lbl.textContent = builderDays.length+' días';
    btn.classList.add('has-days');
  }
}

function toggleBuilderDay(d){
  var idx = builderDays.indexOf(d);
  if(idx === -1) builderDays.push(d);
  else builderDays.splice(idx,1);
  builderDays.sort(function(a,b){return DIAS_SEMANA.indexOf(a)-DIAS_SEMANA.indexOf(b)});
  renderDaysPicker();
}

function clearBuilderDays(){
  builderDays = [];
  renderDaysPicker();
}

function toggleDaysPicker(){
  var pop = document.getElementById('daysPickerPop');
  if(!pop) return;
  var willOpen = !pop.classList.contains('open');
  if(willOpen){ renderDaysPicker(); }
  pop.classList.toggle('open', willOpen);
}

/* Cerrar el popover al hacer clic afuera */
document.addEventListener('click', function(e){
  var wrap = document.getElementById('daysPickerWrap');
  var pop = document.getElementById('daysPickerPop');
  if(!wrap || !pop || !pop.classList.contains('open')) return;
  if(!wrap.contains(e.target)) pop.classList.remove('open');
});

/* Día sugerido para un ejercicio nuevo: si hay un solo día elegido arriba, se usa directo.
   Si hay varios, se sugiere el primero que aún no tenga ejercicios asignados (round-robin simple). */
function suggestedDay(){
  if(builderDays.length === 0) return '';
  if(builderDays.length === 1) return builderDays[0];
  // Round-robin: contar cuántos ejercicios totales hay por cada día sugerido y elegir el que tenga menos
  var counts = {};
  builderDays.forEach(function(d){ counts[d] = 0; });
  Object.keys(builderData).forEach(function(m){
    builderData[m].exercises.forEach(function(e){
      if(e.dia && counts.hasOwnProperty(e.dia)) counts[e.dia]++;
    });
  });
  var best = builderDays[0];
  builderDays.forEach(function(d){ if(counts[d] < counts[best]) best = d; });
  return best;
}

/* ══════════════════════════════════════════
   MULTI-DAY TABS — sistema de pestañas por día
══════════════════════════════════════════ */

var PLAN_DIAS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

/* Guarda los datos del día activo en weekPlan antes de cambiar */
function saveActiveDay(){
  if(!activePlanDay) return;
  if(!weekPlan[activePlanDay]) weekPlan[activePlanDay] = { enfoque:'', muscles:{} };
  weekPlan[activePlanDay].muscles = JSON.parse(JSON.stringify(builderData));
  // Guardar enfoque del día desde el input
  var enfoqueEl = document.getElementById('builderDayFocus');
  if(enfoqueEl) weekPlan[activePlanDay].enfoque = enfoqueEl.value;
}

/* Carga los datos del día en builderData */
function loadDay(dia){
  if(!weekPlan[dia]) weekPlan[dia] = { enfoque:'', muscles:{} };
  builderData = JSON.parse(JSON.stringify(weekPlan[dia].muscles));
}

/* Cambia al día seleccionado */
function switchPlanDay(dia){
  saveActiveDay();
  activePlanDay = dia;
  loadDay(dia);
  renderDaysTabs();
  // Actualizar input de enfoque del día
  var enfoqueEl = document.getElementById('builderDayFocus');
  if(enfoqueEl) enfoqueEl.value = (weekPlan[dia] && weekPlan[dia].enfoque) || '';
  // Re-renderizar el modelo para el nuevo día
  bmRender(bmRoot, bmCurrentView, 'build');
  updateBuilderSummary();
}

/* Activa o desactiva un día del plan */
function togglePlanDay(dia){
  if(weekPlan[dia] !== undefined){
    // Ya está activo — si tiene ejercicios, confirmar eliminación
    var hasEx = Object.keys(weekPlan[dia].muscles || {}).length > 0;
    if(hasEx){
      showConfirm({
        title:'Quitar día',
        message:'¿Eliminar todos los ejercicios de '+dia+'? Esta acción no se puede deshacer.',
        confirmText:'Eliminar', danger:true,
        onConfirm:function(){ _doTogglePlanDayOff(dia); }
      });
      return;
    }
    _doTogglePlanDayOff(dia);
  } else {
    // Agregar el día
    weekPlan[dia] = { enfoque:'', muscles:{} };
    activePlanDay = dia;
    loadDay(dia);
    renderDaysTabs();
    bmRender(bmRoot, bmCurrentView, 'build');
    updateBuilderSummary();
  }
}
function _doTogglePlanDayOff(dia){
  delete weekPlan[dia];
  if(activePlanDay === dia){
    var remaining = PLAN_DIAS.filter(function(d){ return weekPlan[d] !== undefined; });
    activePlanDay = remaining.length > 0 ? remaining[0] : null;
    if(activePlanDay) loadDay(activePlanDay);
    else builderData = {};
  }
  renderDaysTabs();
  bmRender(bmRoot, bmCurrentView, 'build');
  updateBuilderSummary();
}

/* Renderiza los tabs de días */
function renderDaysTabs(){
  var container = document.getElementById('builderDaysTabs');
  if(!container) return;
  var activeDays = PLAN_DIAS.filter(function(d){ return weekPlan[d] !== undefined; });
  container.innerHTML =
    '<div class="bdt-label">Días del plan:</div>'
    + PLAN_DIAS.map(function(d){
        var isActive = weekPlan[d] !== undefined;
        var isCurrent = d === activePlanDay;
        var muscleCnt = isActive ? Object.keys(weekPlan[d].muscles || {}).length : 0;
        return '<button class="bdt-tab'
          + (isActive ? ' bdt-tab--on' : '')
          + (isCurrent ? ' bdt-tab--current' : '')
          + '" onclick="isActiveDay(\'' + d + '\') ? switchPlanDay(\'' + d + '\') : togglePlanDay(\'' + d + '\')">'
          + '<span class="bdt-day">' + d.slice(0,3) + '</span>'
          + (isActive && muscleCnt > 0 ? '<span class="bdt-cnt">' + muscleCnt + '</span>' : '')
          + '</button>';
      }).join('')
    + '<div class="bdt-sep"></div>'
    + (activePlanDay
        ? '<div class="bdt-enfoque-wrap"><i class="fa-solid fa-pen-nib" style="color:var(--text4);font-size:0.65rem"></i>'
          + '<input id="builderDayFocus" class="bdt-enfoque-input" placeholder="Enfoque del día (ej: Empuje, Pierna…)" value="'
          + esc((weekPlan[activePlanDay] && weekPlan[activePlanDay].enfoque) || '') + '"'
          + ' oninput="if(weekPlan[activePlanDay])weekPlan[activePlanDay].enfoque=this.value">'
          + '</div>'
        : '<span class="bdt-hint">Activa un día para comenzar</span>');
}

function isActiveDay(d){ return weekPlan[d] !== undefined; }


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
  if(!activePlanDay){
    toast('Activa un día primero tocando uno de los botones de días arriba','warn');
    return;
  }
  if(!builderData[muscleName]){
    builderData[muscleName] = { exercises:[], done:false };
    // Sincronizar al weekPlan del día activo
    if(weekPlan[activePlanDay]) weekPlan[activePlanDay].muscles = builderData;
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
    updateDaysPickerBtn();
    renderDaysTabs();
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
  // Guardar día activo antes de contar
  saveActiveDay();
  var muscles=new Set(), totalEx=0, dias=new Set();
  PLAN_DIAS.forEach(function(d){
    if(!weekPlan[d]) return;
    dias.add(d);
    Object.keys(weekPlan[d].muscles || {}).forEach(function(m){
      muscles.add(m);
      totalEx += weekPlan[d].muscles[m].exercises.length;
    });
  });
  return {muscles:muscles.size, exercises:totalEx, dias:dias.size, min:totalEx*8};
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
  // Si ya hay un modal abierto del mismo músculo, actualizar in-place para evitar flash
  var existing = document.querySelector('.modal-overlay .modal');
  if(existing){
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    var newModal = tmp.querySelector('.modal');
    if(newModal){
      // Animar suavemente actualizando contenido
      existing.style.transition = 'opacity 0.1s';
      existing.style.opacity = '0.7';
      setTimeout(function(){
        existing.outerHTML = newModal.outerHTML;
        var updated = document.querySelector('.modal-overlay .modal');
        if(updated){
          updated.style.opacity = '0.7';
          updated.style.transition = 'opacity 0.15s';
          setTimeout(function(){ updated.style.opacity = '1'; }, 10);
        }
      }, 80);
      return;
    }
  }
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
    var sugDay = suggestedDay();
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
      +   '<div class="mc-field"><label>Día'+(sugDay?' <span style="color:var(--coral2);font-weight:400">· sugerido</span>':'')+'</label><select id="bmfi-dia-'+sid+'" class="form-control">'
      +   '<option value=""'+(!sugDay?' selected':'')+'>Sin asignar</option>'+DIAS.map(function(d){return '<option'+(d===sugDay?' selected':'')+'>'+d+'</option>'}).join('')
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
    +   '<div class="mc-icon" style="background:rgba(241,255,10,0.15);border:1px solid rgba(241,255,10,0.3)">'
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
  builderData[muscle].exercises.push({nombre:exName, series:4, reps:'8-12', peso:'', descanso:'90s', dia:suggestedDay()});
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
  builderDays = [];
  weekPlan = {};
  activePlanDay = null;
  renderDaysPicker();
  renderDaysTabs();
  bmRender(bmRoot, bmCurrentView, 'build');
  closeMuscleCard();
  updateBuilderSummary();
  // Limpiar campos de config
  var nameEl = document.getElementById('builderRutinaName');
  var focusEl = document.getElementById('builderRutinaFocus');
  if(nameEl) nameEl.value = '';
  if(focusEl) focusEl.value = '';
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
    // Cerrar si el usuario toca fuera de la burbuja (evita que la capa quede
    // "atascada" bloqueando toda la app si el usuario abandona el tutorial)
    backdrop.addEventListener('click', function(e){
      if(e.target === backdrop) endTutorial();
    });
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
    +   '<button class="tutorial-bubble-close" onclick="endTutorial()" title="Cerrar tutorial"><i class="fa-solid fa-xmark"></i></button>'
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

function groupRoutineByMuscle(r, dia){
  var groups={};
  (r.ejercicios||[]).forEach(function(e){
    if(dia && e.dia !== dia) return; // si se pidió un día específico, solo sus ejercicios
    var m = (e.notas && MUSCLE_ICONS[e.notas]) ? e.notas : (guessMuscleByExerciseName(e.nombre) || 'General');
    if(!groups[m]) groups[m]=[];
    groups[m].push({nombre:e.nombre, series:e.series, reps:e.reps, peso:e.peso, descanso:e.descanso, log:[]});
  });
  return groups;
}

/* Días de la plantilla que realmente tienen ejercicios asignados, en orden Lunes→Domingo */
function diasConEjercicios(r){
  var set={};
  (r.ejercicios||[]).forEach(function(e){ if(e.dia) set[e.dia]=true; });
  return PLAN_DIAS.filter(function(d){ return set[d]; });
}

/* Músculos que le tocan a la plantilla en un día específico (para mostrar en el selector) */
function diaMusculos(r, dia){
  var list=[];
  (r.ejercicios||[]).forEach(function(e){
    if(e.dia===dia && e.notas && list.indexOf(e.notas)===-1) list.push(e.notas);
  });
  return list;
}

function startLiveSession(atletaId, rutinaId){
  var r=state.rutinas.find(function(x){return x.id===rutinaId});
  if(!r){ toast('Rutina no encontrada','error'); return; }
  var dias = diasConEjercicios(r);
  if(dias.length <= 1){
    // Rutina de un solo día (o plantilla antigua sin días) → comportamiento de siempre, sin preguntar
    startLiveSessionForDay(atletaId, rutinaId, dias[0] || null);
    return;
  }
  showDayPickerModal(atletaId, rutinaId, dias);
}

/* Mini-modal: "¿Qué día entrenas hoy?" — el entrenador elige manualmente
   cuál de los días de la plantilla va a entrenar el alumno en esta sesión. */
function showDayPickerModal(atletaId, rutinaId, dias){
  var r=state.rutinas.find(function(x){return x.id===rutinaId});
  if(!r) return;
  showModal('<div class="modal">'
    + '<div class="modal-header"><h2 class="modal-title"><i class="fa-solid fa-calendar-day" style="margin-right:8px;color:var(--coral2)"></i>¿Qué día entrena hoy?</h2>'
    + '<button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    + '<p class="text-sm text-muted" style="margin-bottom:14px">'+esc(r.nombre)+' · elige el día de la plantilla que toca entrenar</p>'
    + '<div style="display:flex;flex-direction:column;gap:8px">'
    + dias.map(function(d){
        var muscles = diaMusculos(r, d);
        var ef = (r.planSemanal && r.planSemanal[d] && r.planSemanal[d].enfoque) || '';
        return '<button class="btn btn-outline btn-md" style="justify-content:space-between;text-align:left;padding:12px 14px;height:auto" onclick="startLiveSessionForDay('+atletaId+','+rutinaId+',\''+d+'\')">'
          + '<span><strong>'+d+'</strong>'+(ef?' <span class="text-xs text-muted">· '+esc(ef)+'</span>':'')
          + '<br><span class="text-xs text-muted">'+esc(muscles.join(', ') || 'Sin músculos')+'</span></span>'
          + '<i class="fa-solid fa-chevron-right" style="flex:none;margin-left:8px"></i>'
          + '</button>';
      }).join('')
    + '</div></div>');
}

function startLiveSessionForDay(atletaId, rutinaId, dia){
  var r=state.rutinas.find(function(x){return x.id===rutinaId});
  if(!r){ toast('Rutina no encontrada','error'); return; }
  var groups=groupRoutineByMuscle(r, dia);
  if(Object.keys(groups).length===0){ toast('Esta rutina no tiene ejercicios','warn'); return; }
  liveSession={ atletaId:atletaId, rutinaId:rutinaId, dia:dia||null, startedAt:Date.now(), finishedAt:null, timerId:null, muscles:{} };
  Object.keys(groups).forEach(function(m){
    liveSession.muscles[m]={ exercises:groups[m], completado:false, startedAt:null, finishedAt:null };
  });
  closeModalThen(function(){ navigate('session'); });
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
    +     '<p class="page-sub" style="margin:0">'+esc(a?(a.nombre+' '+a.apellido):'—')+' · '+esc(r?r.nombre:'—')+(liveSession.dia?' · <span style="color:var(--coral2);font-weight:600">'+esc(liveSession.dia)+'</span>':'')+'</p>'
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
    +   '<div class="mc-icon" style="background:'+(d.completado?'rgba(48,209,88,0.15)':'rgba(241,255,10,0.15)')+';border:1px solid '+(d.completado?'rgba(48,209,88,0.3)':'rgba(241,255,10,0.3)')+'">'
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
    showConfirm({
      title:'Finalizar sesión',
      message:'Quedan '+pendientes.length+' músculo(s) sin marcar como completados ('+pendientes.join(', ')+'). ¿Finalizar la rutina igual?',
      confirmText:'Finalizar', danger:true,
      onConfirm:function(){ _doFinishLiveSession(); }
    });
    return;
  }
  _doFinishLiveSession();
}
function _doFinishLiveSession(){
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
    dia: liveSession.dia || null,
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
    +'<p class="text-sm" style="margin-bottom:12px"><i class="fa-solid fa-user text-muted" style="margin-right:6px"></i><strong>'+esc(a?(a.nombre+' '+a.apellido):'—')+'</strong>'+(s.dia?' <span style="color:var(--coral2)">· '+esc(s.dia)+'</span>':'')+'</p>'
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
  // Guardar el día activo antes de finalizar
  saveActiveDay();

  var activeDays = PLAN_DIAS.filter(function(d){ return weekPlan[d] !== undefined; });
  if(activeDays.length === 0){ toast('Agrega al menos un día con ejercicios','warn'); return; }

  var allMuscles = [];
  activeDays.forEach(function(dia){
    Object.keys(weekPlan[dia].muscles || {}).forEach(function(m){
      if(allMuscles.indexOf(m) === -1) allMuscles.push(m);
    });
  });
  if(allMuscles.length === 0){ toast('Agrega al menos un músculo en algún día','warn'); return; }

  // Construir lista plana de ejercicios con campo dia y notas=músculo
  var allExercises = [];
  activeDays.forEach(function(dia){
    var dayMuscles = weekPlan[dia].muscles || {};
    Object.keys(dayMuscles).forEach(function(muscle){
      dayMuscles[muscle].exercises.forEach(function(e){
        allExercises.push({id:uid(), nombre:e.nombre, series:e.series, reps:e.reps,
          peso:e.peso, descanso:e.descanso, dia:dia, notas:muscle});
      });
    });
  });

  _exercises = allExercises;

  // Nombre y enfoque desde config inicial
  var nombreConfig = (document.getElementById('builderRutinaName')||{value:''}).value.trim();
  var enfoqueConfig = (document.getElementById('builderRutinaFocus')||{value:''}).value;
  if(!nombreConfig){
    var muscleName = allMuscles.slice(0,2).join(' + ') + (allMuscles.length>2?' +'+(allMuscles.length-2)+' más':'');
    nombreConfig = 'Rutina ' + muscleName;
  }

  editId.routine = null;

  // Resumen de días con enfoque
  var diasResumenHtml = activeDays.map(function(d){
    var ef = (weekPlan[d] && weekPlan[d].enfoque) ? ' · ' + weekPlan[d].enfoque : '';
    var cnt = Object.keys(weekPlan[d].muscles || {}).length;
    return '<span class="badge badge-gray"><i class="fa-solid fa-calendar-day" style="margin-right:4px;font-size:0.55rem"></i>'
      + d.slice(0,3) + ef + (cnt ? ' · ' + cnt + 'M' : '') + '</span>';
  }).join('');

  showModal('<div class="modal modal-wide">'
    + '<div class="modal-header"><h2 class="modal-title">Guardar Plantilla</h2>'
    + '<button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button></div>'
    + '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:16px">' + diasResumenHtml + '</div>'
    + '<div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:12px;margin-bottom:12px">'
    + '<div class="form-group"><label class="form-label">Nombre *</label><input class="form-control" id="rf-nombre" value="' + esc(nombreConfig) + '"></div>'
    + '<div class="form-group"><label class="form-label">Tipo</label><select class="form-control" id="rf-tipo">'
    + TIPOS_RUTINA.map(function(t){ return '<option' + ((enfoqueConfig && t.toLowerCase().indexOf(enfoqueConfig.toLowerCase().slice(0,4)) !== -1) ? ' selected' : '') + '>' + t + '</option>'; }).join('')
    + '</select></div>'
    + '<div class="form-group"><label class="form-label">Dificultad</label><select class="form-control" id="rf-dificultad">' + DIFICULTADES.map(function(d){return '<option'+(d==='Media'?' selected':'')+'>'+d+'</option>'}).join('') + '</select></div>'
    + '</div>'
    + '<div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:12px">'
    + '<p style="font-size:0.62rem;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px"><i class="fa-solid fa-calendar-week" style="margin-right:6px;color:var(--coral2)"></i>Plan semanal (' + activeDays.length + ' días)</p>'
    + activeDays.map(function(d){
        var ef = (weekPlan[d] && weekPlan[d].enfoque) || '—';
        var cnt = Object.keys(weekPlan[d].muscles || {}).length;
        var exCnt = 0;
        Object.keys(weekPlan[d].muscles || {}).forEach(function(m){ exCnt += weekPlan[d].muscles[m].exercises.length; });
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--line2)">'
          + '<span class="text-sm" style="color:var(--text2);font-weight:600">' + d + '</span>'
          + '<span class="text-xs text-muted">' + ef + '</span>'
          + '<span class="text-xs" style="color:var(--coral2)">' + cnt + ' músc · ' + exCnt + ' ejerc.</span>'
          + '</div>';
      }).join('')
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px">'
    + '<div class="form-group"><label class="form-label">Deporte</label><select class="form-control" id="rf-deporte"><option value="">General</option>'+DEPORTES.map(function(d){return '<option>'+esc(d)+'</option>'}).join('')+'</select></div>'
    + '<div class="form-group"><label class="form-label">Duración (min)</label><input class="form-control" type="number" id="rf-duracion" value="' + (allExercises.length*8||45) + '"></div>'
    + '<div class="form-group"><label class="form-label">Fecha</label><input class="form-control" type="date" id="rf-fecha" value="' + today() + '"></div>'
    + '</div>'
    + '<div class="form-group" style="margin-bottom:12px"><label class="form-label">Descripción</label>'
    + '<textarea class="form-control" id="rf-descripcion" rows="2">Plantilla ' + activeDays.length + ' días. Enfoque: ' + (enfoqueConfig || 'General') + '. Músculos: ' + esc(allMuscles.join(', ')) + '</textarea></div>'
    + '<div id="rf-err" style="color:var(--coral);font-size:0.78rem;margin-bottom:8px"></div>'
    + '<div class="modal-footer">'
    + '<button class="btn btn-ghost btn-md" onclick="closeModal()">Cancelar</button>'
    + '<button class="btn btn-primary btn-md" onclick="saveRoutineFromBuilder()"><i class="fa-solid fa-floppy-disk"></i> Guardar Plantilla</button>'
    + '</div></div>');
}

function saveRoutineFromBuilder(){
  if(!gv('rf-nombre')){ document.getElementById('rf-err').textContent='Nombre requerido'; return; }
  // Construir metadata del weekPlan para guardarlo en la rutina
  var activeDays = PLAN_DIAS.filter(function(d){ return weekPlan[d] !== undefined; });
  var planSemanal = {};
  activeDays.forEach(function(d){
    planSemanal[d] = { enfoque: (weekPlan[d] && weekPlan[d].enfoque) || '' };
  });
  var data = {
    nombre:gv('rf-nombre'), tipo:gv('rf-tipo'), dificultad:gv('rf-dificultad'),
    deporte:gv('rf-deporte'), duracion:+(document.getElementById('rf-duracion').value)||60,
    fecha:gv('rf-fecha'), descripcion:gv('rf-descripcion'),
    atletaId: null,
    ejercicios:JSON.parse(JSON.stringify(_exercises)),
    planSemanal: planSemanal,
    activa:true
  };
  state.rutinas.push(Object.assign({}, data, {id:uid()}));
  saveState();
  toast('¡Plantilla guardada! ✓', 'success');
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
  showConfirm({
    title:'Eliminar anotación',
    message:'¿Seguro que quieres eliminar esta anotación? Esta acción no se puede deshacer.',
    confirmText:'Eliminar', danger:true,
    onConfirm:function(){
      state.anotaciones=state.anotaciones.filter(function(n){return n.id!==id});
      saveState();
      renderPizarraTimeline();
      toast('Anotación eliminada','warn');
    }
  });
}

function deleteMetric(id){
  showConfirm({
    title:'Eliminar métrica',
    message:'¿Seguro que quieres eliminar este registro de métrica? Esta acción no se puede deshacer.',
    confirmText:'Eliminar', danger:true,
    onConfirm:function(){
      state.logsRendimiento=state.logsRendimiento.filter(function(m){return m.id!==id});
      saveState();
      toast('Métrica eliminada','warn');
      if(_pizarraAthlete!=null) renderPizarraTimeline();
    }
  });
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
function deleteEvent(id){
  showConfirm({
    title:'Eliminar evento',
    message:'¿Seguro que quieres eliminar este evento del calendario? Esta acción no se puede deshacer.',
    confirmText:'Eliminar', danger:true,
    onConfirm:function(){
      state.eventos=state.eventos.filter(function(e){return e.id!==id});
      saveState();
      toast('Evento eliminado','warn');renderCalendar();
    }
  });
}

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

function deletePlan(id){
  showConfirm({
    title:'Eliminar plan',
    message:'¿Seguro que quieres eliminar este plan de nutrición? Esta acción no se puede deshacer.',
    confirmText:'Eliminar', danger:true,
    onConfirm:function(){
      state.planes=state.planes.filter(function(p){return p.id!==id});
      saveState();
      toast('Plan eliminado','warn');renderNutrition();
    }
  });
}

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
function deletePayment(id){
  showConfirm({
    title:'Eliminar registro de pago',
    message:'¿Seguro que quieres eliminar este registro de pago? Esta acción no se puede deshacer.',
    confirmText:'Eliminar', danger:true,
    onConfirm:function(){
      state.pagos=state.pagos.filter(function(p){return p.id!==id});
      saveState();
      toast('Registro eliminado','warn');renderPayments();buildSidebar();
    }
  });
}

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

function deleteDoc(id){
  showConfirm({
    title:'Eliminar documento',
    message:'¿Seguro que quieres eliminar este documento? Esta acción no se puede deshacer.',
    confirmText:'Eliminar', danger:true,
    onConfirm:function(){
      state.documentos=state.documentos.filter(function(d){return d.id!==id});
      saveState();
      toast('Documento eliminado','warn');renderDocs();
    }
  });
}

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
var _modalClosing = false;
function showModal(html){
  _modalClosing = false;
  var c=document.getElementById('modalContainer');
  c.innerHTML='<div class="modal-overlay" onclick="handleOvClick(event)">'+html+'</div>';
  document.body.style.overflow='hidden';
}
function closeModal(){
  if(_modalClosing) return;
  _modalClosing = true;
  var c=document.getElementById('modalContainer');
  // Animate out
  var m=c.querySelector('.modal');
  if(m){
    m.style.cssText+='animation:none;transform:translateY(30px);opacity:0;transition:transform 0.22s ease,opacity 0.22s ease';
    setTimeout(function(){
      c.innerHTML='';
      document.body.style.overflow='';
      _modalClosing = false;
    },230);
  } else {
    c.innerHTML='';document.body.style.overflow='';
    _modalClosing = false;
  }
}
function handleOvClick(e){
  if(e.target!==e.currentTarget || _modalClosing) return;
  if(document.querySelector('.modal-confirm')){ confirmCancel(); return; }
  closeModal();
}

/* ════════════════════════════
   CONFIRM MODAL
   Reemplaza el confirm() nativo del navegador por un modal
   con el diseño del sistema. Uso:
   showConfirm({
     title:'Eliminar atleta',
     message:'¿Seguro que quieres eliminar a Juan Pérez? Esta acción no se puede deshacer.',
     confirmText:'Eliminar', cancelText:'Cancelar', danger:true,
     onConfirm:function(){ ...acción real... }
   });
════════════════════════════ */
var _confirmCallback = null;
var _confirmSnapshot  = null;

function showConfirm(opts){
  opts = opts || {};
  _confirmCallback = typeof opts.onConfirm === 'function' ? opts.onConfirm : function(){};
  // Si ya había un modal abierto (ej. el detalle de un atleta), lo guardamos
  // para poder restaurarlo si el usuario cancela.
  var c = document.getElementById('modalContainer');
  _confirmSnapshot = c.innerHTML || null;
  var danger = opts.danger !== false; // por defecto las confirmaciones son de "alerta"
  var icon = opts.icon || (danger ? 'fa-triangle-exclamation' : 'fa-circle-question');
  showModal('<div class="modal modal-confirm">'
    + '<div class="confirm-icon'+(danger?' confirm-icon-danger':'')+'"><i class="fa-solid '+icon+'"></i></div>'
    + (opts.title?'<h3 class="confirm-title">'+esc(opts.title)+'</h3>':'')
    + '<p class="confirm-text">'+esc(opts.message||'¿Confirmas esta acción?')+'</p>'
    + '<div class="confirm-actions">'
    +   '<button class="btn btn-ghost btn-md" onclick="confirmCancel()">'+esc(opts.cancelText||'Cancelar')+'</button>'
    +   '<button class="btn '+(danger?'btn-danger-solid':'btn-primary')+' btn-md" onclick="confirmAccept()">'+esc(opts.confirmText||'Aceptar')+'</button>'
    + '</div></div>');
}
function confirmAccept(){
  var cb = _confirmCallback;
  _confirmCallback = null;
  _confirmSnapshot = null;
  closeModal();
  if(cb) cb();
}
function confirmCancel(){
  var snap = _confirmSnapshot;
  _confirmCallback = null;
  _confirmSnapshot = null;
  if(snap){
    // Volver al modal que estaba abierto antes de pedir confirmación
    var c = document.getElementById('modalContainer');
    c.innerHTML = snap;
    document.body.style.overflow = 'hidden';
  } else {
    closeModal();
  }
}
/* Cierra el modal actual y ejecuta callback luego de la animación de salida */
function closeModalThen(fn){  if(_modalClosing){ setTimeout(function(){ fn(); }, 240); return; }
  _modalClosing = true;
  var c=document.getElementById('modalContainer');
  var m=c.querySelector('.modal');
  if(m){
    m.style.cssText+='animation:none;transform:translateY(30px);opacity:0;transition:transform 0.22s ease,opacity 0.22s ease';
    setTimeout(function(){
      c.innerHTML='';
      document.body.style.overflow='';
      _modalClosing = false;
      fn();
    },230);
  } else {
    c.innerHTML='';document.body.style.overflow='';
    _modalClosing = false;
    fn();
  }
}
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    if(document.getElementById('tutorialBackdrop')){ endTutorial(); return; }
    if(document.querySelector('.modal-confirm')){ confirmCancel(); return; }
    closeModal();
  }
});

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
  var diasUsados=[...new Set((r.ejercicios||[]).map(function(e){return e.dia}).filter(Boolean))];
  var DIAS_ORDEN=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
  diasUsados.sort(function(a,b){return DIAS_ORDEN.indexOf(a)-DIAS_ORDEN.indexOf(b)});
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
    +(diasUsados.length>0?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px">'+diasUsados.map(function(d){return '<span class="badge badge-gray" style="font-size:0.6rem"><i class="fa-solid fa-calendar-day" style="margin-right:3px;font-size:0.55rem"></i>'+esc(d.slice(0,3))+'</span>'}).join('')+'</div>':'')
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

function deleteRoutine(id){
  var r=state.rutinas.find(function(x){return x.id===id});
  var nombre=r?r.nombre:'esta rutina';
  showConfirm({
    title:'Eliminar rutina',
    message:'¿Seguro que quieres eliminar "'+nombre+'"? Esta acción no se puede deshacer.',
    confirmText:'Eliminar', danger:true,
    onConfirm:function(){
      state.rutinas=state.rutinas.filter(function(x){return x.id!==id});
      saveState();
      toast('Rutina eliminada','warn'); renderRoutines();
    }
  });
}

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
    +['#','Ejercicio','Series','Reps','Carga','Descanso','Día','Notas'].map(function(h){return '<th>'+h+'</th>'}).join('')
    +'</tr></thead><tbody>'
    +r.ejercicios.map(function(e,i){
      return '<tr><td style="color:var(--coral2);font-family:var(--font-display)">'+(i+1)+'</td>'
        +'<td style="font-weight:600">'+esc(e.nombre)+'</td><td>'+e.series+'</td>'
        +'<td>'+esc(e.reps)+'</td><td>'+(esc(e.peso)||'—')+'</td>'
        +'<td>'+esc(e.descanso)+'</td>'
        +'<td>'+(e.dia?'<span class="badge badge-gray" style="font-size:0.6rem">'+esc(e.dia.slice(0,3))+'</span>':'—')+'</td>'
        +'<td class="text-muted">'+(esc(e.notas)||'—')+'</td></tr>';
    }).join('')+'</tbody></table></div>':'')
    +'<div class="modal-footer">'
    +'<button class="btn btn-danger btn-md" onclick="deleteRoutine('+r.id+')"><i class="fa-solid fa-trash"></i></button>'
    +'<button class="btn btn-outline btn-md" onclick="closeModalThen(function(){openRoutineModal('+r.id+')})"><i class="fa-solid fa-pen"></i> Editar</button>'
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
  var DIAS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
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
      +'<div class="ex-row-grid" style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:8px">'
      +[['Series',e.series,'number',''],['Reps',e.reps,'text',''],['Carga',e.peso,'text','kg'],['Descanso',e.descanso,'text','']].map(function(x,fi){
        return '<div><p style="font-size:0.6rem;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">'+x[0]+'</p>'
          +'<input class="form-control" value="'+esc(x[1]||'')+'" type="'+x[2]+'" placeholder="'+x[3]+'" oninput="updEx('+i+','+(fi+1)+',this.value)" style="font-size:0.8rem;padding:8px 10px"></div>';
      }).join('')+'</div>'
      +'<div><p style="font-size:0.6rem;font-weight:700;color:var(--text4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Día</p>'
      +'<select class="form-control" oninput="updEx('+i+',6,this.value)" style="font-size:0.8rem;padding:8px 10px">'
      +'<option value=""'+(!e.dia?' selected':'')+'>Sin asignar</option>'
      +DIAS.map(function(d){return '<option'+(e.dia===d?' selected':'')+'>'+d+'</option>'}).join('')
      +'</select></div></div>';
  }).join('');
}

function addExercise(){_exercises.push({id:uid(),nombre:'',series:4,reps:'8-12',peso:'',descanso:'90s',dia:'',notas:''});renderExerciseList()}
function removeExercise(i){_exercises.splice(i,1);renderExerciseList()}
function updEx(i,fi,v){var fields=['nombre','series','reps','peso','descanso','notas','dia'];if(_exercises[i]) _exercises[i][fields[fi]]=fi===1?+v:v}

function saveRoutine(){
  if(!gv('rf-nombre')){document.getElementById('rf-err').textContent='Nombre requerido';return}
  var atletaIdVal=document.getElementById('rf-atletaId').value;
  var data={nombre:gv('rf-nombre'),tipo:gv('rf-tipo'),dificultad:gv('rf-dificultad'),deporte:gv('rf-deporte'),duracion:+(document.getElementById('rf-duracion').value)||60,fecha:gv('rf-fecha'),descripcion:gv('rf-descripcion'),atletaId:atletaIdVal?+atletaIdVal:null,ejercicios:JSON.parse(JSON.stringify(_exercises)),activa:true};
  if(!atletaIdVal){
    showConfirm({
      title:'Guardar sin atleta',
      message:'No asignaste esta rutina a ningún atleta: no aparecerá en su perfil ni se podrá iniciar una sesión en vivo con ella. ¿Guardar igual?',
      confirmText:'Guardar igual', danger:false,
      onConfirm:function(){ _doSaveRoutine(data); }
    });
    return;
  }
  _doSaveRoutine(data);
}
function _doSaveRoutine(data){
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
  requestAnimationFrame(function(){ moveMobileNavBlob(true); });
  renderDashboard();
  setInterval(saveState, 4000);
  window.addEventListener('beforeunload', saveState);
  window.addEventListener('resize', function(){
    moveSidebarBlob(true);
    moveMobileNavBlob(true);
  });
}

init();
