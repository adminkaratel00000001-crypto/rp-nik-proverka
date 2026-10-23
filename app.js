/* Интерфейс: вывод результата, события, тема. */
(function(){
"use strict";
const {EXAMPLES} = window.RPData;
const {analyze} = window.RPChecker;

/* ---------- отображение ---------- */
const $ = id => document.getElementById(id);
const TONE = {
  ok:  {t:'var(--ok)',  bg:'var(--okbg)',  title:'РП-ник',          stamp:'РП',    sub:'подходит'},
  warn:{t:'var(--warn)',bg:'var(--warnbg)',title:'Сомнительный ник',stamp:'?',     sub:'на усмотрение админа'},
  bad: {t:'var(--bad)', bg:'var(--badbg)', title:'Не РП-ник',       stamp:'НЕ РП', sub:'не подходит'}
};
function el(tag, cls, text){ const e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e; }

function render(nick){
  const out = $('result'); out.textContent='';
  if(!nick.trim()) return;
  const r = analyze(nick.trim());
  const tone = TONE[r.verdict];

  const card = el('div','id'); card.style.setProperty('--tone',tone.t); card.style.setProperty('--tonebg',tone.bg);
  const head = el('div','id-head'); head.append(el('span',null,tone.title), el('span',null,'Оценка: '+r.score+'/100'));
  const body = el('div','id-body');
  const fields = el('div','id-fields');
  const f1 = el('div','f'); f1.append(el('small',null,'Проверяемый ник'), el('b',null,nick.trim()));
  const f2 = el('div','f'); f2.append(el('small',null,'Правдоподобность'));
  const meter = el('div','meter'); const bar = el('i'); bar.style.width = r.score+'%'; meter.append(bar); f2.append(meter);
  fields.append(f1,f2);
  const stamp = el('div','stamp'); const inner = el('div'); inner.append(el('span',null,tone.stamp), el('em',null,tone.sub)); stamp.append(inner);
  body.append(fields, stamp);
  card.append(head, body);

  if(r.fix && r.fix!==nick.trim()){
    const fx = el('div','fix'); fx.append(el('span',null,'Возможно, имелось в виду:'));
    const code = el('code',null,r.fix); const btn = el('button',null,'Проверить это'); btn.type='button';
    btn.addEventListener('click',()=>{ $('nick').value=r.fix; render(r.fix); });
    fx.append(code, btn); card.append(fx);
  }

  const ul = el('ul','checks');
  r.checks.forEach(c=>{
    const li = el('li', c.state);
    const mark = el('div','mark', c.state==='pass'?'✓':c.state==='fail'?'✕':'!');
    const txt = el('div'); txt.append(el('div','t',c.title), el('div','d',c.detail));
    li.append(mark, txt); ul.append(li);
  });
  card.append(ul);
  out.append(card);
}

function renderBulk(){
  const lines = $('bulk').value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).slice(0,500);
  const wrap = $('bulkOut'); wrap.textContent='';
  if(!lines.length) return;
  const table = el('table'); const thead = el('thead'); const tr = el('tr');
  ['Ник','Итог','Оценка','Главная причина'].forEach(h=>tr.append(el('th',null,h))); thead.append(tr); table.append(thead);
  const tb = el('tbody');
  lines.forEach(n=>{
    const r = analyze(n); const row = el('tr');
    const pill = el('span','pill '+r.verdict, TONE[r.verdict].title);
    const why = r.checks.find(c=>c.state==='fail') || r.checks.find(c=>c.state==='soft');
    const c2 = el('td'); c2.append(pill);
    row.append(el('td',null,n), c2, el('td',null,String(r.score)), el('td',null, why ? why.title : '—'));
    tb.append(row);
  });
  table.append(tb); wrap.append(table);
}

/* ---------- события ---------- */
const input = $('nick');
input.addEventListener('input',()=>render(input.value));
input.addEventListener('keydown',e=>{ if(e.key==='Enter') render(input.value); });
$('go').addEventListener('click',()=>render(input.value));
$('bulkGo').addEventListener('click',renderBulk);

const ex = $('examples');
EXAMPLES.forEach(n=>{
  const b = el('button','ghost',n); b.type='button';
  b.addEventListener('click',()=>{ input.value=n; render(n); input.focus(); });
  ex.append(b);
});

// тема
const root = document.documentElement;
try{ const t = localStorage.getItem('rp-theme'); if(t) root.setAttribute('data-theme',t); }catch(e){}
$('theme').addEventListener('click',()=>{
  const dark = root.getAttribute('data-theme')==='dark' || (!root.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
  const next = dark ? 'light' : 'dark';
  root.setAttribute('data-theme',next);
  try{ localStorage.setItem('rp-theme',next); }catch(e){}
});
})();
