/* Логика проверки ника. Не зависит от страницы (DOM). */
(function(){
"use strict";
const {FIRST, LAST, SUFFIXES, BAD_LONG, BAD_EXACT, KEYBOARD, CELEBS} = window.RPData;

/* ---------- логика ---------- */
const PART_RE = /^(?:(?:Mc|Mac|O'|D'|De|Di|Van|Von|Le|La)?[A-Z][a-z]+)(?:[-'][A-Z][a-z]+)*$/;
const VOWEL = /[aeiouy]/i;

function guessFix(raw){
  let s = raw.trim().replace(/\s+/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'');
  if(/[^\x00-\x7F]/.test(s)) return null;
  s = s.replace(/[0-9]+/g,'');
  if(!s.includes('_')){
    const m = s.match(/[A-Z][a-z']+/g);
    if(m && m.length===2 && m.join('')===s) s = m.join('_');
  }
  if(!s.includes('_')) return null;
  s = s.split('_').map(p => p ? p.charAt(0).toUpperCase()+p.slice(1).toLowerCase() : '').filter(Boolean).join('_');
  return s.split('_').length>=2 ? s : null;
}

function analyze(nick){
  const checks = [];
  const add = (id,title,state,detail,weight,fatal) => checks.push({id,title,state,detail,weight:weight||0,fatal:!!fatal});
  const raw = nick;
  const hasCyr = /[\u0400-\u04FF]/.test(raw);
  const hasDigit = /\d/.test(raw);
  const bad = raw.match(/[^A-Za-z_'\-]/g);

  // 1. символы
  if(hasCyr) add('chars','Допустимые символы','fail','В нике есть кириллица. РП-серверы обычно требуют латиницу: Nikita_Ilyashenko.',40,true);
  else if(hasDigit) add('chars','Допустимые символы','fail','Цифры в РП-нике не используются: в реальных именах их нет.',40,true);
  else if(bad) add('chars','Допустимые символы','fail','Недопустимые символы: «'+[...new Set(bad)].join(' ')+'». Разрешены латинские буквы, «_», «-» и «’».',35,true);
  else add('chars','Допустимые символы','pass','Только латинские буквы и разрешённые знаки.');

  // 2. структура
  const parts = raw.split('_');
  const emptyPart = parts.some(p => p==='');
  if(parts.length===1) add('struct','Формат «Имя_Фамилия»','fail','Нет нижнего подчёркивания между именем и фамилией.',40,true);
  else if(emptyPart) add('struct','Формат «Имя_Фамилия»','fail','Лишнее или пустое место вокруг «_» — должно быть ровно одно подчёркивание между словами.',35,true);
  else if(parts.length===2) add('struct','Формат «Имя_Фамилия»','pass','Ник состоит из двух слов, разделённых «_».');
  else if(parts.length===3) add('struct','Формат «Имя_Фамилия»','soft','Три слова (например, Carlos_De_Santos) допустимы не везде — уточните правила сервера.',10);
  else add('struct','Формат «Имя_Фамилия»','fail','Слишком много частей. Нужны имя и фамилия.',35,true);

  const okParts = parts.length>=2 && !emptyPart;

  // 3. регистр
  if(okParts && !hasCyr){
    const wrong = parts.filter(p => !PART_RE.test(p));
    if(!wrong.length) add('case','Регистр букв','pass','Каждое слово начинается с заглавной, остальные буквы строчные.');
    else add('case','Регистр букв','fail','Неверный регистр: '+wrong.map(p=>'«'+p+'»').join(', ')+'. Пример: Michael, McCarthy, O’Brien.',25,false);
  } else add('case','Регистр букв','fail','Проверить регистр нельзя — сначала исправьте формат.',15,false);

  // 4. длина
  if(okParts){
    const lens = parts.map(p=>p.length);
    const tooShort = lens.some(l=>l<2), tooLong = lens.some(l=>l>15);
    if(raw.length>24) add('len','Длина','fail','Ник длиннее 24 символов — сервер его не примет.',30,true);
    else if(tooShort) add('len','Длина','fail','Слишком короткое слово (меньше 2 букв).',25,true);
    else if(tooLong) add('len','Длина','fail','Слишком длинное слово (больше 15 букв) — настоящие имена такими не бывают.',20,false);
    else add('len','Длина','pass','Длина слов и всего ника в норме ('+raw.length+' из 24 символов).');
  }

  // 5. читаемость
  if(okParts && !hasCyr && !hasDigit){
    const problems = [];
    parts.forEach(p=>{
      const letters = p.replace(/[^A-Za-z]/g,'');
      if(letters.length>1 && !VOWEL.test(letters)) problems.push('«'+p+'» без гласных');
      if(/[^aeiouy]{5,}/i.test(letters)) problems.push('«'+p+'»: 5 согласных подряд');
      if(/(.)\1\1/i.test(letters)) problems.push('«'+p+'»: три одинаковые буквы подряд');
    });
    if(problems.length) add('read','Произносимость','fail',problems.join('; ')+'.',25,false);
    else add('read','Произносимость','pass','Слова можно прочитать вслух — похоже на настоящее имя.');
  }

  // 6. запрещённые слова и «набор клавиш»
  {
    const low = raw.toLowerCase();
    const items = low.split(/[_\-']/).filter(Boolean);
    const hitLong = BAD_LONG.find(b => low.includes(b));
    const hitExact = items.find(p => BAD_EXACT.includes(p));
    const keyb = KEYBOARD.find(k => low.replace(/[_\-']/g,'').includes(k));
    const xx = /^x+[a-z]|[a-z]x+$/i.test(raw) && /xx/i.test(raw);
    if(hitLong) add('bad','Запрещённые слова','fail','Содержит нежелательное слово «'+hitLong+'» (оскорбления, читы, администрация и т. п.).',50,true);
    else if(hitExact) add('bad','Запрещённые слова','fail','Слово «'+hitExact+'» похоже на игровой псевдоним, а не на имя.',40,true);
    else if(keyb) add('bad','Запрещённые слова','fail','Похоже на набор букв с клавиатуры («'+keyb+'»).',40,true);
    else if(xx) add('bad','Запрещённые слова','fail','Обрамление «xX…Xx» — признак ника-псевдонима.',40,true);
    else add('bad','Запрещённые слова','pass','Нежелательных слов не найдено.');
  }

  // 7. известные личности
  {
    const key = raw.toLowerCase().replace(/[-'’]/g,'');
    if(CELEBS.has(key)) add('celeb','Известные личности и персонажи','fail','Это имя знаменитости или героя — серверы такие ники запрещают.',50,true);
    else add('celeb','Известные личности и персонажи','pass','Совпадений с известными именами нет.');
  }

  // 8. одинаковые имя и фамилия
  if(okParts && parts.length>=2){
    if(parts[0].toLowerCase()===parts[parts.length-1].toLowerCase())
      add('dup','Имя и фамилия различаются','fail','Имя и фамилия совпадают.',30,true);
    else add('dup','Имя и фамилия различаются','pass','Имя и фамилия разные.');
  }

  // 9. похоже ли на реальное имя
  if(okParts && !hasCyr && !hasDigit){
    const f = parts[0].toLowerCase().replace(/[^a-z]/g,'');
    const l = parts[parts.length-1].toLowerCase().replace(/[^a-z]/g,'');
    const fKnown = FIRST.has(f), lKnown = LAST.has(l) || LAST.has(l.replace(/^(mc|mac|o|d|de|di|van|von|le|la)/,''));
    const lSuffix = SUFFIXES.test(l);
    if(fKnown && (lKnown||lSuffix)) add('real','Похоже на реальное имя','pass','Имя найдено в списке популярных, фамилия звучит правдоподобно.');
    else if(fKnown || lKnown) add('real','Похоже на реальное имя','pass','Одно из слов найдено в словаре настоящих имён.');
    else if(lSuffix) add('real','Похоже на реальное имя','soft','В словаре слов нет, но окончание фамилии типичное. Скорее всего, подойдёт.',8);
    else add('real','Похоже на реальное имя','soft','Ни имени, ни фамилии нет в словаре. Это не ошибка: словарь небольшой, но модератор может придраться.',15);
  }

  // итог
  let score = 100;
  checks.forEach(c=>{ if(c.state!=='pass') score -= c.weight; });
  score = Math.max(0, Math.min(100, score));
  const fatal = checks.some(c=>c.fatal && c.state==='fail');
  let verdict;
  if(fatal || score<55) verdict = 'bad';
  else if(score<80) verdict = 'warn';
  else verdict = 'ok';
  return {checks, score, verdict, fix: verdict==='ok' ? null : guessFix(raw)};
}

window.RPChecker = {analyze, guessFix};
})();
