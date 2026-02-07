// Shared JS for pages (auth simulation, overview pie, seller verification, profile, password change)
// Enhanced with smooth animations and cursor tracking

/* ===========================
   ANIMATION & CURSOR TRACKING
   =========================== */

// Cursor tracking for parallax effects
class CursorTracker {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.isInitialized = false;
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;
      if (!this.isInitialized) this.isInitialized = true;
      this.applyParallax();
    });

    // smooth animation loop
    const animate = () => {
      this.x += (this.targetX - this.x) * 0.1;
      this.y += (this.targetY - this.y) * 0.1;
      requestAnimationFrame(animate);
    };
    animate();
  }

  applyParallax() {
    const bg = document.querySelector('.bg-layer');
    if (!bg) return;
    
    const xShift = (this.targetX / window.innerWidth - 0.5) * 8;
    const yShift = (this.targetY / window.innerHeight - 0.5) * 8;
    bg.style.transform = `translate(${xShift}px, ${yShift}px)`;
  }
}

// Initialize cursor tracker on load
window.addEventListener('DOMContentLoaded', () => {
  new CursorTracker();
});

// Page transition handler
class PageTransition {
  constructor() {
    this.init();
  }

  init() {
    // Hook all internal links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http')) return;
      
      e.preventDefault();
      this.transitionTo(href);
    });
  }

  transitionTo(url) {
    document.body.classList.add('page-exit');
    
    setTimeout(() => {
      window.location.href = url;
    }, 600);
  }
}

// Initialize page transitions
window.addEventListener('DOMContentLoaded', () => {
  new PageTransition();
});

/* ===========================
   UTILITY FUNCTIONS
   =========================== */

/* Small DOM helpers */
function $(s){ return document.querySelector(s); }
function $all(s){ return Array.from(document.querySelectorAll(s)); }

/* Toast UI: on-page, avoids blocked alerts */
function ensureToastContainer(){
  if ($('#gg_toast')) return $('#gg_toast');
  const t = document.createElement('div');
  t.id = 'gg_toast';
  t.style = 'position:fixed;right:20px;bottom:24px;z-index:9999;pointer-events:none;font-family:Inter,system-ui,sans-serif;';
  document.body.appendChild(t);
  return t;
}

function toast(msg, el=null, t=2300){
  if (el){ el.textContent = msg; setTimeout(()=>{ if(el) el.textContent=''; }, t); return; }
  const container = ensureToastContainer();
  const item = document.createElement('div');
  item.className = 'gg_toast_item';
  item.style = 'background:#183b1a;color:#fff;padding:10px 14px;margin-top:8px;border-radius:8px;box-shadow:0 8px 20px rgba(20,60,20,0.12);pointer-events:auto;opacity:0;transform:translateY(6px);transition:all .28s ease;';
  item.textContent = msg;
  container.appendChild(item);
  requestAnimationFrame(()=>{ item.style.opacity = '1'; item.style.transform = 'translateY(0)'; });
  setTimeout(()=>{ item.style.opacity='0'; item.style.transform='translateY(6px)'; setTimeout(()=>item.remove(),300); }, t);
}

/* Storage helpers */
function readUsers(){ return JSON.parse(localStorage.getItem('gg_users') || '[]'); }
function saveUsers(u){ localStorage.setItem('gg_users', JSON.stringify(u)); }
function readOrders(){ return JSON.parse(localStorage.getItem('gg_orders') || '[]'); }
function saveOrders(o){ localStorage.setItem('gg_orders', JSON.stringify(o)); }
function loadSellerReqs(){ return JSON.parse(localStorage.getItem('gg_sellerReqs') || '[]'); }
function saveSellerReqs(v){ localStorage.setItem('gg_sellerReqs', JSON.stringify(v)); }
function readProfile(){ return JSON.parse(localStorage.getItem('gg_profile') || '{}'); }
function saveProfile(p){ localStorage.setItem('gg_profile', JSON.stringify(p)); }

/* Ensure some demo data */
if(!localStorage.getItem('gg_users')) {
  saveUsers([{ email:'geeland@example.com', password:'admin123', name:'Geeland' }, { email:'buyer1@example.com', password:'x', name:'Buyer One' }]);
}
if(!localStorage.getItem('gg_sellerReqs')){
  saveSellerReqs([{ id:'r1', name:'Liam Brown', email:'liam@example.com', status:'pending' }]);
}
if(!localStorage.getItem('gg_orders')){
  saveOrders([{ id:'o1', buyer:'buyer1@example.com', total:20.5, status:'delivered' }]);
}
if(!localStorage.getItem('gg_profile')){
  saveProfile({ name:'Geeland', email:'geeland@example.com', phone:'' });
}

/* ===========================
   AUTH HANDLERS
   =========================== */

const regForm = $('#registerForm');
if (regForm) {
  regForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = $('#regEmail').value.trim().toLowerCase();
    const pass = $('#regPassword').value;
    const confirm = $('#regConfirm').value;
    const msgEl = $('#regMsg');

    if (!/\S+@\S+\.\S+/.test(email)) { toast('Please enter a valid email.', msgEl); return; }
    if (pass.length < 6) { toast('Password should be at least 6 characters.', msgEl); return; }
    if (pass !== confirm) { toast('Passwords do not match.', msgEl); return; }

    const users = readUsers();
    if (users.some(u => u.email === email)) {
      toast('Email already registered', msgEl);
      return;
    }

    users.push({ email, password: pass, name: email.split('@')[0] });
    saveUsers(users);
    toast('Email registered successfully');
    setTimeout(()=> location.href = 'login.html', 900);
  });
}

const loginForm = $('#loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = $('#loginEmail').value.trim().toLowerCase();
    const pass = $('#loginPassword').value;
    const msgEl = $('#loginMsg');

    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (!user) { toast('Email not registered. Please register first.', msgEl); return; }
    if (user.password !== pass) { toast('Incorrect password', msgEl); return; }

    localStorage.setItem('gg_currentUser', email);
    toast('Login successful');
    setTimeout(()=> location.href = 'admin.html', 600);
  });
}

/* ===========================
   PAGE-SPECIFIC LOGIC
   =========================== */

/* Page detection */
const path = window.location.pathname.toLowerCase();

/* ADMIN / Overview page: draw pie, stats and recent */
if (path.endsWith('/admin.html') || path.endsWith('/admin')) {
  // gather counts
  const users = readUsers();
  const sellerReqs = loadSellerReqs();
  const orders = readOrders();

  const sellers = sellerReqs.filter(r=>r.status==='approved').length;
  const buyers = Math.max(0, users.length - sellers);

  // update stats with animation
  const updateStatWithAnimation = (el, value) => {
    if (!el) return;
    el.classList.add('stat-number');
    let current = 0;
    const increment = value / 20;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        el.textContent = value;
        clearInterval(interval);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 30);
  };

  updateStatWithAnimation($('#stat-users'), users.length);
  updateStatWithAnimation($('#stat-sellers'), sellers);
  updateStatWithAnimation($('#stat-orders'), orders.length);

  // draw pie
  drawPie('pieChart', [buyers, sellers], ['Buyers','Sellers'], ['#7bbf77','#2e7d32']);
  
  // recent activity list
  const recent = (orders||[]).slice(-4).reverse().map(o=>`<div class="item"><div><strong>${o.id}</strong> <small>${o.buyer}</small></div><div>${o.total.toFixed(2)} USD</div></div>`).join('');
  $('#recentList').innerHTML = recent || '<div class="small">No recent activity</div>';
}

/* Verification page logic */
if (path.endsWith('/verification.html')) {
  const container = $('#sellerRequests');
  function render(){ 
    const list = loadSellerReqs();
    if(!container) return;
    if(list.length===0){ container.innerHTML='<div class="small">No requests</div>'; return; }
    container.innerHTML = list.map(r=>`
      <div class="item">
        <div style="flex:1"><strong>${r.name}</strong><br/><small>${r.email}</small></div>
        <div style="display:flex;gap:8px">
          ${r.status==='pending' ? `<button class="btn approve" data-id="${r.id}">Approve</button><button class="btn outline reject" data-id="${r.id}">Reject</button>` : `<span class="small">${r.status}</span>`}
        </div>
      </div>
    `).join('');
    $all('.approve').forEach(b=>b.onclick = ()=>{ update(b.dataset.id,'approved'); });
    $all('.reject').forEach(b=>b.onclick = ()=>{ update(b.dataset.id,'rejected'); });
  }
  function update(id, status){
    const list = loadSellerReqs();
    const i = list.findIndex(x=>x.id===id); if(i===-1) return;
    list[i].status = status; saveSellerReqs(list);
    toast('Request '+status); render();
  }
  render();
}

/* Password page logic */
if (path.endsWith('/password.html')) {
  $('#adminChangePassBtn')?.addEventListener('click', ()=>{
    const a = $('#adminNewPass').value, b = $('#adminNewPassConfirm').value;
    const msg = $('#adminPassMsg');
    if(!a || a.length<6){ toast('Enter 6+ chars', msg); return; }
    if(a!==b){ toast('Passwords do not match', msg); return; }
    const users = readUsers();
    const idx = users.findIndex(u=>u.email === 'geeland@example.com' || u.name === 'Geeland');
    if(idx>=0){ users[idx].password = a; saveUsers(users); $('#adminNewPass').value = $('#adminNewPassConfirm').value = ''; toast('Password changed', msg); }
    else toast('Admin user not found', msg);
  });
}

/* Profile page logic */
if (path.endsWith('/profile.html')) {
  const prof = readProfile();
  $('#profileName').value = prof.name || '';
  $('#profileEmail').value = prof.email || '';
  $('#profilePhone').value = prof.phone || '';
  $('#saveProfileBtn')?.addEventListener('click', ()=>{
    const p = { name: $('#profileName').value.trim(), email: $('#profileEmail').value.trim(), phone: $('#profilePhone').value.trim() };
    if(!p.name || !/\S+@\S+\.\S+/.test(p.email)){ toast('Name and valid email required', $('#profileMsg')); return; }
    saveProfile(p); toast('Profile saved', $('#profileMsg'));
  });
}

/* ===========================
   PIE CHART RENDERER
   =========================== */

function drawPie(canvasId, values, labels, colors){
  const c = document.getElementById(canvasId); if(!c) return;
  const ctx = c.getContext('2d');
  const total = values.reduce((s,v)=>s+v,0) || 1;
  const cx = c.width/2, cy = c.height/2, r = Math.min(cx,cy)-12;
  ctx.clearRect(0,0,c.width,c.height);
  let start = -0.5*Math.PI;
  for(let i=0;i<values.length;i++){
    const slice = values[i]/total;
    const end = start + slice*2*Math.PI;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,start,end); ctx.closePath();
    ctx.fillStyle = colors[i] || '#ccc'; ctx.fill();
    start = end;
  }
  // legend
  const legend = $('#chartLegend'); if(legend){
    legend.innerHTML = labels.map((lbl,i)=>`<div class="legend-item"><span class="swatch" style="background:${colors[i]}"></span>${lbl} — ${values[i]}</div>`).join('');
  }
}

/* ===========================
   SELLER REQUEST HELPERS
   =========================== */

function renderSellerReqs() {
  const container = $('#sellerRequests');
  if (!container) return;

  const list = loadSellerReqs();
  if (!list || list.length === 0) {
    container.innerHTML = '<div class="small">No requests</div>';
    return;
  }

  container.innerHTML = list.map(r => `
    <div class="item" data-id="${r.id}">
      <div style="flex:1">
        <strong>${r.name}</strong><br/><small>${r.email}</small>
      </div>
      <div style="display:flex;gap:8px">
        ${r.status === 'pending' ? `<button class="btn approve" data-id="${r.id}">Approve</button>
        <button class="btn outline reject" data-id="${r.id}">Reject</button>` : `<span class="small">${r.status}</span>`}
      </div>
    </div>
  `).join('');

  $all('#sellerRequests .approve').forEach(b => {
    if (b._ggApproveHandler) b.removeEventListener('click', b._ggApproveHandler);
    b._ggApproveHandler = () => updateRequest(b.dataset.id, 'approved');
    b.addEventListener('click', b._ggApproveHandler);
  });
  $all('#sellerRequests .reject').forEach(b => {
    if (b._ggRejectHandler) b.removeEventListener('click', b._ggRejectHandler);
    b._ggRejectHandler = () => updateRequest(b.dataset.id, 'rejected');
    b.addEventListener('click', b._ggRejectHandler);
  });
}

function updateRequest(id, status) {
  const list = loadSellerReqs();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return;
  list[idx].status = status;
  saveSellerReqs(list);
  renderSellerReqs();
  toast(`Request ${status}`);
}

// Initial render
renderSellerReqs();