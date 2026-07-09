(function() {
  var CRM = 'https://priority-crm-production.up.railway.app';
  var messages = [];
  var isOpen = false;
  var isTyping = false;

  // CSS
  var style = document.createElement('style');
  style.textContent = [
    '#prio-chat-btn{position:fixed;bottom:28px;right:28px;z-index:9999;width:60px;height:60px;border-radius:50%;background:#0C2057;border:none;cursor:pointer;box-shadow:0 8px 24px rgba(12,32,87,.35);display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s}',
    '#prio-chat-btn:hover{transform:scale(1.08)}',
    '#prio-chat-btn svg{width:28px;height:28px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '#prio-chat-badge{position:absolute;top:-4px;right:-4px;width:20px;height:20px;background:#DBAA59;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#0C2057;font-family:Poppins,sans-serif}',
    '#prio-chat-box{position:fixed;bottom:100px;right:28px;z-index:9998;width:360px;max-width:calc(100vw - 40px);background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(12,32,87,.22);display:none;flex-direction:column;overflow:hidden;font-family:Poppins,sans-serif}',
    '#prio-chat-box.open{display:flex;animation:prio-up .25s ease}',
    '@keyframes prio-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}',
    '.prio-head{background:#0C2057;padding:16px 18px;display:flex;align-items:center;gap:12px}',
    '.prio-av{width:38px;height:38px;border-radius:50%;background:#DBAA59;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;color:#0C2057;flex-shrink:0}',
    '.prio-hinfo h4{color:#fff;font-size:14px;margin:0 0 2px;font-family:Poppins,sans-serif}',
    '.prio-hinfo p{color:rgba(255,255,255,.7);font-size:12px;margin:0;display:flex;align-items:center;gap:5px;font-family:Poppins,sans-serif}',
    '.prio-hinfo p::before{content:"";width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block}',
    '.prio-close{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;font-size:20px;line-height:1;padding:0}',
    '#prio-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;max-height:300px;min-height:160px;background:#F8F9FC}',
    '.pm{max-width:82%;padding:10px 14px;border-radius:16px;font-size:13.5px;line-height:1.5;font-family:Poppins,sans-serif}',
    '.pm.bot{background:#fff;color:#1A2238;border-radius:4px 16px 16px 16px;box-shadow:0 2px 8px rgba(0,0,0,.06);align-self:flex-start}',
    '.pm.user{background:#0C2057;color:#fff;border-radius:16px 4px 16px 16px;align-self:flex-end}',
    '.pm.typing{background:#fff;align-self:flex-start;border-radius:4px 16px 16px 16px;box-shadow:0 2px 8px rgba(0,0,0,.06)}',
    '.pdots{display:flex;gap:4px;padding:2px 4px}',
    '.pdots span{width:7px;height:7px;border-radius:50%;background:#DBAA59;animation:pd .9s infinite}',
    '.pdots span:nth-child(2){animation-delay:.15s}.pdots span:nth-child(3){animation-delay:.3s}',
    '@keyframes pd{0%,80%,100%{transform:scale(.8);opacity:.5}40%{transform:scale(1.1);opacity:1}}',
    '#prio-quick{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px;background:#F8F9FC}',
    '.pqb{background:#fff;border:1.5px solid #E7E1D5;border-radius:20px;padding:6px 12px;font-size:12px;font-weight:600;color:#0C2057;cursor:pointer;font-family:Poppins,sans-serif;transition:all .15s}',
    '.pqb:hover{background:#0C2057;color:#fff;border-color:#0C2057}',
    '.prio-foot{padding:10px 12px;background:#fff;border-top:1px solid #E7E1D5;display:flex;gap:8px}',
    '#prio-inp{flex:1;border:1.5px solid #E7E1D5;border-radius:24px;padding:10px 16px;font-size:13.5px;font-family:Poppins,sans-serif;outline:none;transition:border .2s}',
    '#prio-inp:focus{border-color:#0C2057}',
    '#prio-snd{width:40px;height:40px;border-radius:50%;background:#DBAA59;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
    '#prio-snd svg{width:18px;height:18px;fill:none;stroke:#0C2057;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}'
  ].join('');
  document.head.appendChild(style);

  // Botón
  var btn = document.createElement('button');
  btn.id = 'prio-chat-btn';
  btn.setAttribute('aria-label', 'Abrir chat');
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><div id="prio-chat-badge">1</div>';
  btn.onclick = toggleChat;
  document.body.appendChild(btn);

  // Caja del chat
  var box = document.createElement('div');
  box.id = 'prio-chat-box';
  box.innerHTML =
    '<div class="prio-head">' +
      '<div class="prio-av">P</div>' +
      '<div class="prio-hinfo"><h4>Priority Assistant</h4><p>En línea ahora</p></div>' +
      '<button class="prio-close" id="prio-cls">✕</button>' +
    '</div>' +
    '<div id="prio-msgs"></div>' +
    '<div id="prio-quick"></div>' +
    '<div class="prio-foot">' +
      '<input id="prio-inp" placeholder="Escribe tu mensaje...">' +
      '<button id="prio-snd"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>' +
    '</div>';
  document.body.appendChild(box);

  document.getElementById('prio-cls').onclick = function(){ box.classList.remove('open'); isOpen=false; };
  document.getElementById('prio-snd').onclick = send;
  document.getElementById('prio-inp').onkeydown = function(e){ if(e.key==='Enter'){ e.preventDefault(); send(); }};

  function toggleChat(){
    isOpen = !isOpen;
    box.classList.toggle('open', isOpen);
    document.getElementById('prio-chat-badge').style.display = isOpen ? 'none' : 'flex';
    if(isOpen && messages.length === 0){
      setTimeout(function(){
        botMsg('¡Hola! Soy el asistente de Priority Seguros. ¿En qué puedo ayudarte hoy?');
        quickBtns(['Seguro de Salud','Seguro de Auto','Plan Familiar','¿Cuál me conviene?']);
      }, 350);
    }
    if(isOpen) setTimeout(function(){ document.getElementById('prio-inp').focus(); }, 100);
  }

  function botMsg(text){
    messages.push({role:'assistant',content:text});
    var d = document.createElement('div');
    d.className = 'pm bot'; d.textContent = text;
    document.getElementById('prio-msgs').appendChild(d);
    scroll();
  }

  function userMsg(text){
    messages.push({role:'user',content:text});
    var d = document.createElement('div');
    d.className = 'pm user'; d.textContent = text;
    document.getElementById('prio-msgs').appendChild(d);
    scroll();
    document.getElementById('prio-quick').innerHTML = '';
  }

  function showTyping(){
    var d = document.createElement('div');
    d.className='pm typing'; d.id='prio-typ';
    d.innerHTML='<div class="pdots"><span></span><span></span><span></span></div>';
    document.getElementById('prio-msgs').appendChild(d); scroll();
  }

  function hideTyping(){ var t=document.getElementById('prio-typ'); if(t) t.remove(); }
  function scroll(){ var m=document.getElementById('prio-msgs'); m.scrollTop=m.scrollHeight; }

  function quickBtns(opts){
    var q = document.getElementById('prio-quick');
    q.innerHTML = '';
    opts.forEach(function(o){
      var b = document.createElement('button');
      b.className='pqb'; b.textContent=o;
      b.onclick=function(){ sendText(o); };
      q.appendChild(b);
    });
  }

  function send(){
    var inp = document.getElementById('prio-inp');
    var t = inp.value.trim();
    if(t){ inp.value=''; sendText(t); }
  }

  function sendText(text){
    if(isTyping) return;
    userMsg(text);
    isTyping = true;
    showTyping();

    fetch(CRM + '/api/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({messages: messages.slice(-14)})
    })
    .then(function(r){ return r.json(); })
    .then(function(d){
      hideTyping(); isTyping=false;
      if(d.response) botMsg(d.response);
      if(d.action==='whatsapp'){
        quickBtns(['Continuar por WhatsApp →']);
        document.querySelector('.pqb').onclick = function(){
          window.open('https://wa.me/593979321722?text=Hola,%20vengo%20del%20chat%20del%20sitio%20web','_blank');
        };
      }
    })
    .catch(function(){
      hideTyping(); isTyping=false;
      botMsg('Tuve un problema al conectarme. Por favor escríbenos directamente por WhatsApp.');
      quickBtns(['Ir a WhatsApp →']);
      document.querySelector('.pqb').onclick = function(){
        window.open('https://wa.me/593979321722','_blank');
      };
    });
  }
})();
