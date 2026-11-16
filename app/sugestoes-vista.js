/* Sugestões de vídeos (TikTok e Facebook): desenha os cartões de window.SUGESTOES (app/sugestoes.js).
   Os dados escreve-os o Claude: a análise de media buyer de cada vídeo e o estado que o Edu vai dizendo
   («mete o PT1» passa a «Vai entrar», depois «No ar», «Vencedor» ou «Cortado»).
   Usa-se assim: desenhaSugestoes('tiktok', elemento) ou desenhaSugestoes('facebook', elemento). */
(function () {
  const CSS = `
  .sg { max-width: 1500px; margin: 0 auto; padding: 18px 32px 60px; }
  .sg-barra { display: flex; align-items: center; gap: 12px 18px; flex-wrap: wrap; margin-bottom: 14px; }
  .sg-mercados { display: flex; gap: 6px; flex-wrap: wrap; }
  .sg-mercados button { font: inherit; font-size: 14px; padding: 7px 13px; border-radius: 8px; border: 1px solid var(--linha-forte); background: var(--cartao); color: var(--texto); cursor: pointer; }
  .sg-mercados button:hover { border-color: var(--suave); }
  .sg-mercados button.ativo { background: var(--texto); border-color: var(--texto); color: #fff; }
  .sg-mercados small { margin-left: 5px; opacity: .65; font-variant-numeric: tabular-nums; }
  .sg-como { color: var(--suave); font-size: 13.5px; }
  .sg-como b { color: var(--texto); font-weight: 600; }
  .sg-leitura { background: var(--cartao); border: 1px solid var(--linha); border-left: 3px solid var(--verde); border-radius: 10px; padding: 12px 16px; margin: 0 0 18px; max-width: 980px; }
  .sg-leitura h3 { margin: 0 0 4px; font-size: 13px; font-weight: 600; color: var(--suave); }
  .sg-leitura p { margin: 0; font-size: 14.5px; line-height: 1.55; }
  .sg-lista { display: grid; grid-template-columns: repeat(auto-fill, minmax(560px, 1fr)); gap: 18px; }
  .sg-c { background: var(--cartao); border: 1px solid var(--linha); border-radius: 14px; display: grid; grid-template-columns: 200px minmax(0, 1fr); overflow: hidden;
          box-shadow: 0 1px 2px rgba(60, 45, 30, .04), 0 8px 24px -16px rgba(60, 45, 30, .14); }
  .sg-c.reserva { opacity: .86; }
  .sg-tela { padding: 14px 0 14px 14px; }
  .sg-tela video { width: 100%; aspect-ratio: 9 / 16; object-fit: contain; display: block; background: var(--ecra, #171513); border-radius: 10px; position: sticky; top: 14px; }
  .sg-tela p { background: var(--ecra, #171513); color: #b9b0a5; font-size: 12.5px; padding: 40px 14px; text-align: center; border-radius: 10px; margin: 0; }
  .sg-corpo { padding: 14px 16px 14px; min-width: 0; }
  .sg-topo { display: flex; align-items: baseline; gap: 10px; }
  .sg-id { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
  .sg-ver { font-size: 12.5px; font-weight: 600; }
  .sg-ver.ja { color: var(--verde-escuro); } .sg-ver.testar { color: #8a7346; } .sg-ver.reserva { color: var(--suave); }
  .sg-estado { margin-left: auto; font-size: 12.5px; color: var(--suave); white-space: nowrap; }
  .sg-estado.entra { color: #8a7346; font-weight: 600; } .sg-estado.ar { color: var(--verde-escuro); font-weight: 600; }
  .sg-estado.ganha { color: var(--verde-escuro); font-weight: 700; } .sg-estado.corte, .sg-estado.nao { color: var(--rosa-escuro); font-weight: 600; }
  .sg-papel { margin: 3px 0 2px; font-size: 15.5px; font-weight: 650; line-height: 1.3; }
  .sg-origem { color: var(--suave); font-size: 12.5px; font-variant-numeric: tabular-nums; }
  .sg-porque { margin: 10px 0 10px; font-size: 14px; line-height: 1.5; }
  .sg-dl { margin: 0; display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 6px 12px; font-size: 13px; line-height: 1.45; }
  .sg-dl dt { color: var(--suave); }
  .sg-dl dd { margin: 0; overflow-wrap: anywhere; }
  .sg-dl ul { margin: 0; padding-left: 16px; }
  .sg-dl li + li { margin-top: 2px; }
  .sg-dl .riscos li::marker { color: var(--rosa); }
  .sg-texto { margin-top: 10px; padding: 9px 12px; border-radius: 9px; background: var(--fundo); font-size: 13.5px; -webkit-user-select: all; user-select: all; cursor: text; }
  .sg-texto small { display: block; font-size: 11.5px; color: var(--suave); -webkit-user-select: none; user-select: none; margin-bottom: 2px; }
  .sg-hist { margin-top: 8px; font-size: 12.5px; color: var(--suave); }
  .sg-fora { margin-top: 26px; max-width: 980px; font-size: 13.5px; }
  .sg-fora summary { cursor: pointer; color: var(--suave); }
  .sg-fora ul { margin: 8px 0 0; padding-left: 18px; color: var(--suave); }
  .sg-fora li { margin: 3px 0; }
  .sg-fora b { color: var(--texto); font-weight: 600; }
  .sg-vazio { color: var(--suave); padding: 30px 0; }
  @media (max-width: 1240px) { .sg-lista { grid-template-columns: minmax(0, 1fr); } }
  @media (max-width: 640px) {
    .sg { padding: 14px 16px 48px; }
    .sg-c { grid-template-columns: minmax(0, 1fr); }
    .sg-tela { padding: 12px 12px 0; }
    .sg-tela video { position: static; }
    .sg-tela video { max-height: 520px; }
    .sg-dl { grid-template-columns: minmax(0, 1fr); gap: 2px; }
    .sg-dl dd { margin-bottom: 6px; }
  }`;

  const NOMES = { PT: 'Portugal', ES: 'Espanha', US: 'EUA', IT: 'Itália', MX: 'México' };
  const ESTADOS = {
    'sugerido': ['Sugerido', ''], 'vai entrar': ['Vai entrar', 'entra'], 'no ar': ['No ar', 'ar'],
    'vencedor': ['Vencedor', 'ganha'], 'cortado': ['Cortado', 'corte'], 'recusado': ['Não entra', 'nao'],
  };
  const VER = { 'Meter já': 'ja', 'Testar': 'testar', 'Reserva': 'reserva' };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const guarda = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const le = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };

  let estilo = false;
  function poeEstilo() {
    if (estilo) return; estilo = true;
    const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
  }

  function cartao(c) {
    const [nomeEstado, classeEstado] = ESTADOS[c.estado || 'sugerido'] || [c.estado, ''];
    const capa = c.capa || c.video;
    const tela = c.video
      ? `<video controls preload="none" playsinline poster="../meta/media/${esc(capa)}.jpg" src="../meta/media/${esc(c.video)}.mp4"></video>`
      : `<p>Sem vídeo no Mac</p>`;
    const linha = (rot, v) => v ? `<dt>${rot}</dt><dd>${v}</dd>` : '';
    const riscos = (c.riscos || []).length ? `<ul class="riscos">${c.riscos.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : 'Nenhum à vista';
    const hist = (c.historico || []).map((h) => `${esc(h.data)}: ${esc(h.nota)}`).join(' · ');
    return `<article class="sg-c ${c.veredito === 'Reserva' ? 'reserva' : ''}" id="sg-${esc(c.id)}">
      <div class="sg-tela">${tela}</div>
      <div class="sg-corpo">
        <div class="sg-topo"><span class="sg-id">${esc(c.id)}</span><span class="sg-ver ${VER[c.veredito] || ''}">${esc(c.veredito)}</span>
          <span class="sg-estado ${classeEstado}">${esc(nomeEstado)}${c.anuncio ? ' · ' + esc(c.anuncio) : ''}</span></div>
        <p class="sg-papel">${esc(c.papel)}</p>
        <div class="sg-origem">${esc(c.origem)}${c.nota != null ? ` · nota ${esc(c.nota)} em 10` : ''}</div>
        <p class="sg-porque">${esc(c.porque)}</p>
        <dl class="sg-dl">
          ${linha('Prova', esc(c.prova))}
          ${linha('Gancho (0 a 3 s)', esc(c.gancho))}
          ${linha('Formato', esc(c.formato))}
          ${linha('Oferta', esc(c.oferta))}
          ${linha('Riscos', riscos)}
          ${linha('Como testar', esc(c.teste))}
        </dl>
        ${c.texto ? `<div class="sg-texto"><small>Texto do anúncio (clica para selecionar)</small>${esc(c.texto)}</div>` : ''}
        ${hist ? `<div class="sg-hist">${hist}</div>` : ''}
      </div>
    </article>`;
  }

  window.desenhaSugestoes = function (plataforma, el) {
    poeEstilo();
    const D = (window.SUGESTOES || {})[plataforma];
    if (!el) return;
    if (!D || !D.mercados || !Object.keys(D.mercados).length) { el.innerHTML = `<div class="sg"><p class="sg-vazio">Ainda não há sugestões.</p></div>`; return; }
    const chaves = Object.keys(D.mercados);
    const k = 'sg.' + plataforma;
    let atual = le(k);
    if (!chaves.includes(atual)) atual = chaves[0];

    const desenha = () => {
      const M = D.mercados[atual] || { itens: [] };
      const itens = M.itens || [];
      el.innerHTML = `<div class="sg">
        <div class="sg-barra">
          <div class="sg-mercados">${chaves.map((c) => `<button data-sg="${c}" class="${c === atual ? 'ativo' : ''}">${NOMES[c] || c}<small>${(D.mercados[c].itens || []).length}</small></button>`).join('')}</div>
          <div class="sg-como">Diz-me quais metes (por exemplo «mete o <b>${esc((itens[0] || {}).id || 'PT1')}</b> e o <b>${esc((itens[2] || {}).id || 'PT3')}</b>») e eu marco aqui e acompanho os resultados. ${(D.atualizado || window.SUGESTOES.atualizado) ? 'Análise de ' + esc(D.atualizado || window.SUGESTOES.atualizado) + '.' : ''}</div>
        </div>
        ${M.leitura ? `<section class="sg-leitura"><h3>Leitura do mercado</h3><p>${esc(M.leitura)}</p></section>` : ''}
        <div class="sg-lista">${itens.length ? itens.map(cartao).join('') : '<p class="sg-vazio">Sem sugestões para este mercado.</p>'}</div>
        ${(M.fora || []).length ? `<details class="sg-fora"><summary>Fortes que ficaram de fora (${M.fora.length})</summary><ul>${M.fora.map((f) => `<li><b>${esc(f.origem || f.video)}</b>: ${esc(f.motivo)}</li>`).join('')}</ul></details>` : ''}
      </div>`;
      // quando um vídeo começa, os outros param
      el.querySelectorAll('video').forEach((v) => v.addEventListener('play', () => el.querySelectorAll('video').forEach((o) => { if (o !== v) o.pause(); })));
    };
    el.onclick = (ev) => {
      const b = ev.target.closest('[data-sg]');
      if (!b) return;
      atual = b.dataset.sg; guarda(k, atual); desenha();
    };
    desenha();
  };

  // pára os vídeos quando a vista deixa de estar à vista (a página do TikTok troca de vista sem recarregar)
  window.paraSugestoes = function (el) { if (el) el.querySelectorAll('video').forEach((v) => v.pause()); };
})();
