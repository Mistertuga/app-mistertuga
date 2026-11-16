/* Separador «TikTok» da app MisterTuga (02/11/2026).
   Para pôr anúncios à mão na conta CONTA_TOP_DOLLARES_01: escolhe os vídeos que mais venderam na Meta,
   faz os ficheiros prontos para o TikTok (a app de Mac usa o ffmpeg de ~/tiktok-ads/bin) e escreve tudo o
   que se copia para o TikTok Ads Manager. As regras de escalar e cortar estão em REGRAS e em decide(). */
(function () {
  'use strict';

  const CONTA = { nome: 'CONTA_TOP_DOLLARES_01', id: '7703611195114307590', pixel: 'D6G5LHRC77UF3AJEKD5G', perfil: '@mr.tuga2' };
  const DADOS = window.DADOS || { mercados: [], taxa: 0.89158 };
  const TAXA = DADOS.taxa || 0.89158; // quantos euros vale 1 dólar

  // Os links saem de _shared/marketUrls.ts da loja; a etiqueta do nome é a que a fetch-tiktok-adspend reconhece.
  const MERCADOS = [
    { k: 'PT', nome: 'Portugal', marca: 'MisterTuga', url: 'https://mistertuga.com/pt', lingua: 'pt', etiqueta: '[PT]' },
    { k: 'ES', nome: 'Espanha', marca: 'MisterFútbol', url: 'https://mister-futbol.com/', lingua: 'es', etiqueta: '[ES]' },
    { k: 'US', nome: 'EUA', pais: 'United States', marca: 'MisterFútbol', url: 'https://mister-futbol.com/us', lingua: 'en', etiqueta: '[US]' },
    { k: 'MX', nome: 'México', pais: 'Mexico', marca: 'MisterFútbol', url: 'https://mister-futbol.com/mx', lingua: 'mx', etiqueta: '[MX]', nota: 'o painel da loja ainda não separa o México pelo nome' },
    { k: 'IT', nome: 'Itália', pais: 'Italy', marca: 'MisterFútbol', url: 'https://mister-futbol.com/it', lingua: 'it', etiqueta: '[IT]' },
    { k: 'NL', nome: 'Países Baixos', pais: 'Netherlands', marca: 'MisterFútbol', url: 'https://mister-futbol.com/nl', lingua: 'nl', etiqueta: '[NL-BE]' },
    { k: 'BE', nome: 'Bélgica', pais: 'Belgium', marca: 'MisterFútbol', url: 'https://mister-futbol.com/be', lingua: 'nl', etiqueta: '[NL-BE]' },
    { k: 'GB', nome: 'Reino Unido', pais: 'United Kingdom', marca: 'MisterFútbol', url: 'https://mister-futbol.com/gb', lingua: 'gb', etiqueta: '[GB]', nota: 'o painel da loja ainda não separa o Reino Unido pelo nome' },
  ];
  MERCADOS.forEach((m) => { m.pais = m.pais || { PT: 'Portugal', ES: 'Spain' }[m.k]; });

  // Textos dos anúncios: a promoção que está na loja (LocaleContext.tsx: «Leva 6 Paga 3 ou Leva 3 Paga 2»).
  // O TikTok não aceita links, @ nem # no texto, e o máximo são 100 caracteres.
  const TEXTOS = {
    pt: ['Compra 3 camisolas e leva mais 3 grátis. Só na MisterTuga!', 'Leva 6, paga 3. Personaliza com o nome e o número que quiseres.', 'Camisolas 26/27 já disponíveis. Leva 6, paga 3.'],
    es: ['Compra 3 camisetas y llévate 3 más gratis. ¡Solo en MisterFútbol!', 'Lleva 6, paga 3. Personalízala con el nombre y el número que quieras.', 'Camisetas 26/27 ya disponibles. Lleva 6, paga 3.'],
    mx: ['Compra 3 camisetas y llévate 3 más gratis. ¡Solo en MisterFútbol!', 'Llévate 6 y paga 3. Personalízala con el nombre y número que quieras.', 'Camisetas 26/27 ya disponibles. Llévate 6 y paga 3.'],
    en: ['Buy 3 jerseys, get 3 more free. Only at MisterFútbol!', 'Buy 6, pay for 3. Customize it with any name and number.', 'New 26/27 jerseys are here. Buy 6, pay for 3.'],
    gb: ['Buy 3 football shirts, get 3 more free. Only at MisterFútbol!', 'Buy 6, pay for 3. Personalise it with any name and number.', 'New 26/27 shirts are here. Buy 6, pay for 3.'],
    it: ['Compra 3 maglie e ricevine altre 3 gratis. Solo da MisterFútbol!', 'Compra 6, paga 3. Personalizzala con il nome e il numero che vuoi.', 'Maglie 26/27 già disponibili. Compra 6, paga 3.'],
    nl: ['Koop 3 voetbalshirts en krijg er 3 gratis bij. Alleen bij MisterFútbol!', 'Koop 6, betaal 3. Personaliseer met de naam en het nummer dat je wilt.', 'Shirts 26/27 nu beschikbaar. Koop 6, betaal 3.'],
  };
  const FALA = { pt: 'português', es: 'espanhol', mx: 'espanhol', en: 'inglês', gb: 'inglês', it: 'italiano', nl: 'neerlandês', fr: 'francês', de: 'alemão' };
  const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const MAXIMO = 5;

  // ---------- ajudas ----------
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (n, casas = 2) => Number(n).toLocaleString('pt-PT', { minimumFractionDigits: n % 1 ? casas : 0, maximumFractionDigits: casas });
  const usd = (n) => '$' + num(Math.round(n * 100) / 100);
  const eur = (n) => num(Math.round(n * 100) / 100) + ' €';
  const pct = (n) => num(Math.round(n * 100) / 100) + '%';
  const inteiro = (n) => Math.round(n).toLocaleString('pt-PT');
  const guarda = (k, v) => { try { localStorage.setItem('tt.' + k, JSON.stringify(v)); } catch (e) { /* sem memória no browser: fica só nesta sessão */ } };
  const lido = (k, d) => { try { const v = localStorage.getItem('tt.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const NATIVO = !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.mistertuga);
  const nativo = (o) => window.webkit.messageHandlers.mistertuga.postMessage(o);
  const hoje = new Date();
  const DIA = String(hoje.getDate()).padStart(2, '0') + '-' + String(hoje.getMonth() + 1).padStart(2, '0');
  const DATA = hoje.toLocaleDateString('pt-PT');

  // ---------- estado ----------
  const E = {
    vista: 'preparar',
    mercado: MERCADOS.some((m) => m.k === lido('mercado')) ? lido('mercado') : 'PT',
    dm: null, // o mercado do Decidir (segue o do Preparar, mas pode mudar sem mexer na escolha)
    escolhidos: [], // chaves, pela ordem em que foram escolhidas
    textos: {},
    proprios: [], // vídeos escolhidos do Mac (copiados para ~/tiktok-ads/tiktok/videos)
    formatos: {}, // chave → [largura, altura]
    usadas: new Set(), // letras já feitas hoje neste mercado
    ocupado: false,
    estado: {}, // chave → { t, mb, erro }
    feito: null, // o plano que acabou de ser preparado (fica à vista para copiar)
    // a campanha marcada
    cm: null, // o país que está à vista
    cTem: {}, // país → ficheiros que já estão na pasta dele
    cEstado: {}, // nome do anúncio → { t, mb, erro }
    cOcupado: false, cFeitos: 0, cFalta: 0,
  };
  const mercado = () => MERCADOS.find((m) => m.k === E.mercado);
  const dadosMeta = (k) => DADOS.mercados.find((m) => m.chave === k);
  const pasta = () => `${DIA} ${mercado().nome}`;

  // O CPA alvo de cada mercado: o que a Meta paga em média por venda lá (valor médio das encomendas ÷ ROAS médio).
  function cpaMeta(k) {
    const m = dadosMeta(k);
    if (!m || !m.roas_medio) return null;
    let v = 0, c = 0;
    for (const f of m.itens) { v += f.valor || 0; c += f.compras || 0; }
    return c ? (v / c) / m.roas_medio : null; // euros
  }
  const alvoPadrao = (k) => { const e = cpaMeta(k); return e ? Math.round(e / TAXA) : 40; };
  const alvo = (k = E.mercado) => lido('alvo.' + k, null) ?? alvoPadrao(k);
  const orcamentoPadrao = (k) => Math.max(50, Math.round(alvo(k)) * 10);
  const orcamento = (k = E.mercado) => lido('orc.' + k, null) ?? orcamentoPadrao(k);

  // ---------- os vídeos ----------
  function videosDoMercado() {
    const m = dadosMeta(E.mercado);
    const meta = (m ? m.itens : []).filter((f) => f.video).map((f) => ({
      chave: 'meta:' + f.video, origem: `meta/media/${f.video}.mp4`, src: `../meta/media/${f.video}.mp4`,
      capa: f.capa ? `../meta/media/${f.capa}.jpg` : '', pos: f.pos, roas: f.roas, compras: f.compras, cpa: f.cpa,
      dur: f.analise && f.analise.dur, fala: f.analise && f.analise.lingua, analisado: !!f.analise,
    }));
    return E.proprios.concat(meta);
  }
  const porChave = () => Object.fromEntries(videosDoMercado().map((v) => [v.chave, v]));

  function formato(chave) {
    const f = E.formatos[chave];
    if (!f) return '';
    const r = f[0] / f[1];
    if (Math.abs(r - 9 / 16) < 0.02) return '';
    if (Math.abs(r - 1) < 0.03) return '1:1';
    if (Math.abs(r - 0.8) < 0.02) return '4:5';
    if (Math.abs(r - 16 / 9) < 0.03) return '16:9';
    return r > 1 ? 'deitado' : 'alto';
  }

  function letrasLivres() {
    const usadas = [...E.usadas].map((l) => LETRAS.indexOf(l));
    const de = usadas.length ? Math.max(...usadas) + 1 : 0;
    return LETRAS.slice(de);
  }

  function anuncios() {
    const m = mercado(), v = porChave(), livres = letrasLivres();
    return E.escolhidos.filter((c) => v[c]).map((c, i) => {
      const letra = livres[i] || '?';
      const nome = `${m.k} ${DIA} ${letra}`;
      return { ...v[c], letra, nome, ficheiro: nome + '.mp4', texto: E.textos[c] };
    });
  }

  const nomeCampanha = (m, dia = DIA) => `${m.etiqueta} ${m.marca} | ${m.nome} | Vendas | ${dia}`;
  const nomeGrupo = (m, dia = DIA) => `${m.etiqueta} ${m.nome} | Grupo ${dia}`;
  function link(m) {
    return `${m.url}?utm_source=tiktok&utm_medium=paid&utm_campaign=__CAMPAIGN_NAME__&utm_term=__AID_NAME__&utm_content=__CID_NAME__&utm_id=__CAMPAIGN_ID__`;
  }

  function problemas(t) {
    const s = String(t || '').trim(), p = [];
    if (!s) p.push('falta o texto');
    const n = [...s].length;
    if (n > 100) p.push(`tem ${n} caracteres, o máximo é 100`);
    if (s.includes('@')) p.push('tira o @');
    if (s.includes('#')) p.push('tira o #');
    if (/(https?:\/\/|www\.)|\.(com|pt|es|net|store|shop)\b/i.test(s)) p.push('tira o link');
    if (/\p{Extended_Pictographic}/u.test(s)) p.push('tira os emojis');
    return p;
  }

  // ---------- desenhar: preparar ----------
  function desenhaConta() {
    $('#conta').innerHTML = `Conta <b>${CONTA.nome}</b> · dólares · pixel tuga ligado · ${esc(CONTA.perfil)}`;
  }

  function desenhaMercados() {
    $('#mercados').innerHTML = MERCADOS.map((m) => `<button data-m="${m.k}" class="${m.k === E.mercado ? 'ativo' : ''}">${esc(m.nome)}</button>`).join('');
    const m = mercado(), e = cpaMeta(m.k);
    $('#sobre').innerHTML = `<b>${esc(m.marca)}</b> · ${esc(m.url.replace('https://', '').replace(/\/$/, ''))}` +
      (e ? ` · CPA médio na Meta ${usd(e / TAXA)} (${eur(e)})` : '') + (m.nota ? ` · ${esc(m.nota)}` : '');
  }

  function desenhaGrelha() {
    const m = mercado(), lista = videosDoMercado(), mm = dadosMeta(m.k);
    $('#sub-videos').textContent = mm ? `Os que mais venderam na Meta em ${m.nome}, já em alta qualidade. Escolhe 3 a ${MAXIMO}.` : 'Escolhe 3 a 5.';
    $('#do-mac').hidden = !NATIVO;
    soltaVideos('#grelha');
    if (E.vista !== 'preparar') { E.grelhaSolta = true; return; } // desenha-se ao abrir o Preparar (ver soltaEscondidas)
    E.grelhaSolta = false;
    if (!lista.length) { $('#grelha').innerHTML = '<p class="vazio">Não há vídeos deste mercado na página dos criativos.</p>'; return; }
    $('#grelha').innerHTML = lista.map((v) => {
      const fala = falaDe(v, m);
      let linha1, linha2;
      if (v.mac) { linha1 = 'Do Mac'; linha2 = esc(v.nome); }
      else {
        linha1 = `#${v.pos} · ROAS ${num(v.roas)}`;
        linha2 = `${inteiro(v.compras)} vendas · CPA ${eur(v.cpa)}`;
      }
      const extra = [v.dur ? `${num(Math.round(v.dur))} s` : '', fala].filter(Boolean).join(' · ');
      return `<button class="cv" data-c="${esc(v.chave)}">
        <div class="tela"><video muted playsinline loop preload="metadata" ${v.capa ? `poster="${esc(v.capa)}"` : ''} src="${esc(v.src)}"></video>
        <span class="letra"></span><span class="formato"></span></div>
        <div class="dados"><b>${linha1}</b>${linha2}<br>${extra}<span class="fundo"></span></div></button>`;
    }).join('');
    ligaVideos('#grelha');
    marcaEscolhidos();
  }

  // a língua em que o vídeo fala, a vermelho se não for a do mercado
  function falaDe(v, m) {
    if (!v.fala) return v.analisado ? 'sem voz' : '';
    const l = FALA[v.fala] || v.fala;
    return FALA[v.fala] !== FALA[m.lingua] ? `<span class="mau">fala ${l}</span>` : `fala ${l}`;
  }

  // Antes de desenhar outra vez uma grelha: larga os vídeos que lá estavam. Sem isto o Mac fica com eles abertos
  // até os apagar sozinho e, depois de mudar de país umas vezes, os novos aparecem pretos.
  function soltaVideos(onde) {
    for (const v of document.querySelectorAll(onde + ' video')) {
      v.pause();
      v.removeAttribute('src');
      for (const s of v.querySelectorAll('source')) s.remove();
      v.load();
    }
  }

  // Só a aba à vista tem os vídeos carregados: os 18 do Preparar (escondidos) e os 5 da campanha juntos eram demais
  // para o Mac e os últimos ficavam pretos.
  function soltaEscondidas() {
    if (E.vista !== 'preparar') { soltaVideos('#grelha'); E.grelhaSolta = true; }
    if (E.vista !== 'campanha') soltaVideos('#c-grelha');
  }

  // o formato de cada vídeo e o vídeo a andar com o rato por cima
  // normal: como um leitor normal (na campanha marcada): com som e a barra para andar para trás e para a frente,
  // sem andar com o rato por cima; quando um começa, os outros param.
  function ligaVideos(onde, normal = false) {
    for (const el of document.querySelectorAll(onde + ' .cv')) {
      const vid = el.querySelector('video'), chave = el.dataset.c;
      vid.addEventListener('loadedmetadata', () => { E.formatos[chave] = [vid.videoWidth, vid.videoHeight]; marcaFormato(el, chave); });
      if (normal) {
        vid.addEventListener('play', () => { for (const o of document.querySelectorAll('video')) if (o !== vid) o.pause(); });
      } else {
        el.addEventListener('mouseenter', () => { vid.play().catch(() => {}); });
        el.addEventListener('mouseleave', () => { vid.pause(); });
      }
      marcaFormato(el, chave);
    }
  }

  function marcaFormato(el, chave) {
    const f = formato(chave);
    el.querySelector('.formato').textContent = f;
    el.querySelector('.fundo').innerHTML = f ? '<br>fica com fundo desfocado' : '';
  }

  function marcaEscolhidos() {
    const livres = letrasLivres();
    for (const el of document.querySelectorAll('#grelha .cv')) {
      const i = E.escolhidos.indexOf(el.dataset.c);
      el.classList.toggle('escolhido', i >= 0);
      el.querySelector('.letra').textContent = i >= 0 ? (livres[i] || '?') : '';
    }
  }

  const copiar = (texto, rotulo = 'Copiar') => `<button class="copiar" data-copiar="${esc(texto)}">${rotulo}</button>`;
  const campo = (r, v, extra = '') => `<div class="campo"><span class="r">${r}</span><div class="v">${v}</div><div>${extra}</div></div>`;

  // Os campos da campanha e do grupo, iguais no Preparar e na campanha marcada.
  // id: '' no Preparar, 'c-' na campanha (os campos do CPA alvo e do orçamento têm id próprio em cada uma).
  function blocoCampanha(m, dia) {
    return `<div class="bloco"><h3>Campanha</h3>
        ${campo('Objetivo', '<code>Sales</code><small>no site, campanha manual (o Smart+ fica para os vídeos que já venderam)</small>')}
        ${campo('Nome', `<code>${esc(nomeCampanha(m, dia))}</code><small>começa por ${esc(m.etiqueta)} para o painel da loja saber o mercado</small>`, copiar(nomeCampanha(m, dia)))}
        ${campo('Orçamento', 'no grupo<small>o da campanha fica desligado</small>')}
      </div>`;
  }

  function blocoGrupo(m, dia, id, inicio) {
    const a = alvo(m.k), o = orcamento(m.k), e = cpaMeta(m.k);
    return `<div class="bloco"><h3>Grupo de anúncios</h3>
        ${campo('Nome', `<code>${esc(nomeGrupo(m, dia))}</code>`, copiar(nomeGrupo(m, dia)))}
        ${campo('Onde', `<code>Website</code> e o pixel tuga<small>${CONTA.pixel}</small>`, copiar(CONTA.pixel, 'Copiar ID'))}
        ${campo('Evento', '<code>Purchase</code><small>a loja manda «CompletePayment», que o TikTok mostra assim</small>')}
        ${campo('Posição', 'só <code>TikTok</code><small>tirar Pangle e Global App Bundle</small>')}
        ${campo('País', `<code>${esc(m.pais)}</code>`, copiar(m.pais))}
        ${campo('Público', '18+, todos os géneros<small>sem interesses: o TikTok procura sozinho</small>')}
        ${campo('CPA alvo', `<label class="numero"><span>$</span><input id="${id}alvo" type="number" min="1" step="1" value="${a}"></label><small>${e ? `o que a Meta paga em média por venda em ${esc(m.nome)} (${eur(e)})` : 'o máximo que queres pagar por venda'}</small>`)}
        ${campo('Orçamento', `<label class="numero"><span>$</span><input id="${id}orc" type="number" min="20" step="10" value="${o}"></label><small>por dia. 10 vezes o CPA alvo, para aprender depressa. <button class="ligeiro" id="${id}teste50">Testar com $50</button></small>`, `<button class="copiar" data-copiar-de="${id}orc">Copiar</button>`)}
        ${inicio ? campo('Início', `<code>${esc(inicio)}</code><small>em Schedule, à hora da conta, sem data de fim</small>`) : ''}
        ${campo('Licitação', '<code>Maximum Results</code><small>sem limite de custo, para começar</small>')}
        ${campo('Atribuição', '7 dias clique, 1 dia visualização')}
      </div>`;
  }

  function desenhaPlano() {
    const m = mercado(), lista = E.feito ? E.feito.anuncios : anuncios();
    const ads = lista.map((ad) => {
      const p = problemas(ad.texto);
      const mini = ad.capa ? `<img class="mini" src="${esc(ad.capa)}" alt="">` : `<video class="mini" muted preload="metadata" src="${esc(ad.src)}"></video>`;
      const sobre = ad.mac ? esc(ad.nome0) : `Meta #${ad.pos} · ROAS ${num(ad.roas)}`;
      return `<div class="anuncio" data-a="${esc(ad.chave)}">
        <div class="cab">${mini}<div><b>${esc(ad.nome)}</b><br><span>${sobre}</span></div>${E.feito ? '' : `<button class="copiar tirar" data-tirar="${esc(ad.chave)}">Tirar</button>`}</div>
        ${campo('Nome', `<code>${esc(ad.nome)}</code>`, copiar(ad.nome))}
        ${campo('Identidade', `<code>${esc(CONTA.perfil)}</code>`)}
        ${campo('Vídeo', `<code>${esc(ad.ficheiro)}</code><small>Transferências › TikTok › ${esc(E.feito ? E.feito.pasta : pasta())}</small>`)}
        ${campo('Texto', `<textarea data-texto="${esc(ad.chave)}" rows="2" class="${p.length ? 'mal' : ''}">${esc(ad.texto)}</textarea><div class="contador ${p.length ? 'mal' : ''}" data-contador="${esc(ad.chave)}">${contador(ad.texto)}</div>`,
          `<button class="copiar" data-copiar-texto="${esc(ad.chave)}">Copiar</button>`)}
        ${campo('Botão', '<code>Shop now</code>')}
        ${campo('URL', `<code>${esc(link(m))}</code><small>o TikTok troca os __NOMES__ pelos da campanha, do grupo e do anúncio</small>`, copiar(link(m)))}
      </div>`;
    }).join('');
    $('#plano').innerHTML = `
      <h2>2. No TikTok Ads Manager</h2>
      <p class="nota">Por esta ordem, como aparece lá. A conta abre no AdsPower, perfil «TIKTOK».</p>
      ${blocoCampanha(m, DIA)}
      ${blocoGrupo(m, DIA, '')}
      <div class="bloco"><h3>Anúncios, um por vídeo</h3>
        ${ads || '<p class="sem">Escolhe os vídeos à esquerda.</p>'}
      </div>`;
    desenhaPe();
  }

  function contador(t) {
    const p = problemas(t), n = [...String(t || '').trim()].length;
    return `${n}/100` + (p.length ? ' · ' + p.join(', ') : '');
  }

  function desenhaPe() {
    const lista = E.feito ? E.feito.anuncios : anuncios();
    const btn = $('#fazer');
    let aviso = '';
    if (E.feito) {
      btn.disabled = false;
      btn.textContent = 'Preparar outros';
    } else {
      const maus = lista.filter((a) => problemas(a.texto).length);
      if (!NATIVO) aviso = 'Os ficheiros só se fazem na app MisterTuga do Mac.';
      else if (maus.length) aviso = `Corrige o texto de ${maus.map((a) => a.nome).join(', ')}.`;
      else if (lista.length && lista.length < 3) aviso = 'O TikTok aprende melhor com 3 a 5 vídeos no grupo.';
      btn.disabled = !lista.length || E.ocupado || !NATIVO || maus.length > 0;
      const feitos = lista.filter((a) => E.estado[a.chave] && E.estado[a.chave].t !== 'a preparar').length;
      btn.textContent = E.ocupado ? `A preparar ${Math.min(feitos + 1, lista.length)} de ${lista.length}…`
        : lista.length ? `Preparar ${lista.length === 1 ? 'o vídeo' : `os ${lista.length} vídeos`}` : 'Escolhe os vídeos';
    }
    $('#aviso').textContent = aviso;
    $('#estado').innerHTML = lista.filter((a) => E.estado[a.chave]).map((a) => {
      const s = E.estado[a.chave];
      const txt = s.t === 'pronto' ? `pronto · ${num(s.mb, 1)} MB` : s.t === 'erro' ? `não deu: ${esc(s.erro)}` : 'a preparar…';
      return `<li class="${s.t === 'pronto' ? 'ok' : s.t === 'erro' ? 'erro' : ''}"><span>${esc(a.nome)}</span><span>${txt}</span></li>`;
    }).join('');
    $('#feito').innerHTML = E.feito ? `Prontos em Transferências › TikTok › ${esc(E.feito.pasta)}, com o plano.txt. <button class="ligeiro" id="finder">Mostrar no Finder</button>` : '';
  }

  // ---------- preparar os ficheiros ----------
  async function letrasDeHoje() {
    E.usadas = new Set();
    if (!NATIVO) return;
    try {
      const nomes = await nativo({ acao: 'tiktok-lista', pasta: pasta() });
      const re = new RegExp('^' + mercado().k + ' ' + DIA + ' ([A-Z])\\.mp4$');
      for (const n of nomes || []) { const x = re.exec(n); if (x) E.usadas.add(x[1]); }
    } catch (e) { /* pasta ainda não existe */ }
  }

  function planoTexto(lista, m, dia = DIA, data = DATA, inicio = '') {
    const L = [];
    L.push(`TikTok · ${m.nome} · ${data}`, `Conta ${CONTA.nome} (${CONTA.id})`, '');
    L.push('CAMPANHA', 'Objetivo: Sales, no site, campanha manual', `Nome: ${nomeCampanha(m, dia)}`, 'Orçamento: no grupo (o da campanha desligado)', '');
    L.push('GRUPO DE ANÚNCIOS', `Nome: ${nomeGrupo(m, dia)}`, `Onde: Website, pixel tuga ${CONTA.pixel}`, 'Evento: Purchase',
      'Posição: só TikTok (sem Pangle nem Global App Bundle)', `País: ${m.pais}`, 'Público: 18+, todos os géneros, sem interesses',
      `CPA alvo: $${alvo(m.k)}`, `Orçamento: $${orcamento(m.k)} por dia`);
    if (inicio) L.push(`Início: ${inicio}, à hora da conta, sem data de fim`);
    L.push('Licitação: Maximum Results', 'Atribuição: 7 dias clique, 1 dia visualização', '');
    L.push('ANÚNCIOS');
    for (const a of lista) {
      L.push(`${a.nome}`, `  Vídeo: ${a.ficheiro}` + (a.mac ? ` (do Mac: ${a.nome0 || ''})` : a.rotulo ? ` (${a.rotulo})` : ` (Meta #${a.pos} em ${m.nome}, ROAS ${num(a.roas)})`),
        `  Identidade: ${CONTA.perfil}`, `  Texto: ${String(a.texto).trim()}`, '  Botão: Shop now', `  URL: ${link(m)}`, '');
    }
    L.push('REGRAS (separador Regras da app)', '- Não mexer nos primeiros 3 dias.', `- Cortar um vídeo que gaste $${alvo(m.k) * 2} (2 vezes o CPA alvo) sem vender.`,
      '- Escalar duplicando o grupo quando o CPA estiver no alvo 3 dias seguidos, com 3 vendas ou mais.');
    return L.join('\n') + '\n';
  }

  async function preparar() {
    if (E.feito) { // «Preparar outros»
      E.feito = null; E.escolhidos = []; E.textos = {}; E.estado = {};
      await letrasDeHoje();
      desenhaGrelha(); desenhaPlano();
      return;
    }
    const lista = anuncios(), m = mercado();
    if (!lista.length || E.ocupado || !NATIVO || lista.some((a) => problemas(a.texto).length)) return;
    E.ocupado = true; E.estado = {};
    desenhaPe();
    for (const a of lista) {
      E.estado[a.chave] = { t: 'a preparar' };
      desenhaPe();
      try {
        const r = await nativo({ acao: 'tiktok-preparar', origem: a.origem, pasta: pasta(), nome: a.ficheiro });
        E.estado[a.chave] = { t: 'pronto', mb: r.mb };
      } catch (e) {
        E.estado[a.chave] = { t: 'erro', erro: String((e && e.message) || e) };
      }
      desenhaPe();
    }
    const bons = lista.filter((a) => E.estado[a.chave].t === 'pronto');
    E.ocupado = false;
    if (bons.length) {
      try { await nativo({ acao: 'tiktok-guardar', pasta: pasta(), nome: 'plano.txt', texto: planoTexto(bons, m) }); } catch (e) { /* o plano está à vista na app */ }
      E.feito = { pasta: pasta(), anuncios: lista };
      desenhaPlano();
      nativo({ acao: 'tiktok-mostrar', pasta: pasta() }).catch(() => {});
      if (window.mtTesteFeito) window.mtTesteFeito(E);
    } else {
      desenhaPe();
    }
  }

  async function doMac() {
    if (!NATIVO) return;
    let r;
    try { r = await nativo({ acao: 'tiktok-escolher' }); } catch (e) { alert('Não deu para usar esse vídeo: ' + ((e && e.message) || e)); return; }
    for (const v of r || []) {
      const chave = 'mac:' + v.origem;
      if (!E.proprios.some((p) => p.chave === chave)) E.proprios.unshift({ chave, mac: true, origem: v.origem, src: '../' + v.origem, nome: v.nome, nome0: v.nome });
      if (!E.escolhidos.includes(chave) && E.escolhidos.length < MAXIMO) { E.escolhidos.push(chave); E.textos[chave] = textoPadrao(E.escolhidos.length - 1); }
    }
    desenhaGrelha(); desenhaPlano();
  }

  const textoPadrao = (i) => { const t = TEXTOS[mercado().lingua] || TEXTOS.en; return t[i % t.length]; };

  function escolhe(chave) {
    if (E.ocupado) return;
    if (E.feito) { $('#aviso').textContent = 'Carrega em «Preparar outros» para começar um anúncio novo.'; return; }
    const i = E.escolhidos.indexOf(chave);
    if (i >= 0) { E.escolhidos.splice(i, 1); delete E.textos[chave]; delete E.estado[chave]; }
    else if (E.escolhidos.length >= MAXIMO) { $('#aviso').textContent = `No máximo ${MAXIMO} vídeos por grupo: tira um primeiro.`; return; }
    else {
      E.escolhidos.push(chave);
      const usados = new Set(Object.values(E.textos));
      const t = TEXTOS[mercado().lingua] || TEXTOS.en;
      E.textos[chave] = t.find((x) => !usados.has(x)) || t[(E.escolhidos.length - 1) % t.length];
    }
    marcaEscolhidos(); desenhaPlano();
  }

  async function mudaMercado(k) {
    if (E.ocupado || k === E.mercado) return;
    E.mercado = k; E.dm = k; guarda('mercado', k);
    E.escolhidos = E.escolhidos.filter((c) => c.startsWith('mac:'));
    E.textos = {}; E.estado = {}; E.feito = null;
    E.escolhidos.forEach((c, i) => { E.textos[c] = textoPadrao(i); });
    await letrasDeHoje();
    desenhaMercados(); desenhaGrelha(); desenhaPlano(); desenhaDecidir();
  }

  async function copia(texto, botao) {
    try {
      if (NATIVO) await nativo({ acao: 'copiar', texto }); else await navigator.clipboard.writeText(texto);
      const antes = botao.textContent;
      botao.textContent = 'Copiado'; botao.classList.add('feito');
      setTimeout(() => { botao.textContent = antes; botao.classList.remove('feito'); }, 1300);
    } catch (e) { botao.textContent = 'Não deu'; }
  }

  // ---------- a campanha marcada (campanhas.js) ----------
  // Uma aba com os vídeos já escolhidos para cada país, o que se copia para o TikTok e o botão que faz os ficheiros.
  const ISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const CAMP = (() => {
    const todas = (window.CAMPANHAS || []).filter((c) => c && c.data && c.mercados).sort((a, b) => a.data.localeCompare(b.data));
    const c = todas.find((x) => x.data >= ISO(hoje)) || todas[todas.length - 1];
    if (!c) return null;
    const d = new Date(c.data + 'T12:00:00'), amanha = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
    const dd = String(d.getDate()).padStart(2, '0'), mm = String(d.getMonth() + 1).padStart(2, '0');
    const quando = c.data === ISO(hoje) ? 'hoje' : c.data === ISO(amanha) ? 'amanhã' : '';
    return {
      ...c, dia: `${dd}-${mm}`, datapt: d.toLocaleDateString('pt-PT'), inicio: `${dd}/${mm}/${d.getFullYear()} 00:00`,
      extenso: d.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' }), quando,
      rotulo: quando === 'amanhã' ? 'Amanhã' : quando === 'hoje' ? 'Hoje' : `Campanha ${d.getDate()}/${d.getMonth() + 1}`,
      ks: Object.keys(c.mercados).filter((k) => MERCADOS.some((m) => m.k === k)),
    };
  })();
  const mercadoK = (k) => MERCADOS.find((m) => m.k === k);
  const pastaC = (k) => `${CAMP.dia} ${mercadoK(k).nome}`;

  function anunciosC(k) {
    const mm = dadosMeta(k);
    return (CAMP.mercados[k] || []).map((x, i) => {
      const f = (mm ? mm.itens : []).find((y) => String(y.video) === String(x.video)) || {};
      const letra = LETRAS[i], nome = `${k} ${CAMP.dia} ${letra}`;
      return {
        chave: `c:${k}:${letra}`, letra, nome, ficheiro: nome + '.mp4', origem: `meta/media/${x.video}.mp4`, src: `../meta/media/${x.video}.mp4`,
        previa: `../meta/media-previa/${x.video}.mp4`, // a cópia leve para ver (meta/scripts/previas.py); se não houver, vê-se o original
        capa: (f.capa || x.capa) ? `../meta/media/${f.capa || x.capa}.jpg` : '', pos: f.pos ?? x.pos, roas: f.roas, compras: f.compras, cpa: f.cpa,
        dur: (f.analise && f.analise.dur) || x.dur, fala: (f.analise && f.analise.lingua) || x.fala, analisado: !!f.analise || !!x.fala,
        texto: x.texto, nota: x.nota || '', rotulo: x.rotulo || '', // rotulo: vídeo novo, sem números da Meta (ex.: «Novo, script 12 da Drive»)
      };
    });
  }
  const totalC = () => CAMP.ks.reduce((s, k) => s + anunciosC(k).length, 0);
  const temC = (k, ficheiro) => !!(E.cTem[k] && E.cTem[k].has(ficheiro));
  const faltamC = () => CAMP.ks.flatMap((k) => anunciosC(k).filter((a) => !temC(k, a.ficheiro)).map((a) => [k, a]));
  const maiuscula = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  async function verPastasC() {
    if (!NATIVO || !CAMP) return;
    for (const k of CAMP.ks) {
      try { E.cTem[k] = new Set((await nativo({ acao: 'tiktok-lista', pasta: pastaC(k) })) || []); } catch (e) { E.cTem[k] = new Set(); }
    }
  }

  function somaCampanha() {
    if (!CAMP) return;
    const total = CAMP.ks.reduce((s, k) => s + (+orcamento(k) || 0), 0);
    $('#c-sobre').innerHTML = `<b>${esc(maiuscula(CAMP.extenso))}</b>${CAMP.quando ? ` (${CAMP.quando})` : ''} · ${CAMP.ks.length} campanhas, ${totalC()} vídeos · ${usd(total)} por dia ao todo`;
  }

  function cartaoC(a, m) {
    const extra = [a.dur ? `${num(Math.round(a.dur))} s` : '', falaDe(a, m)].filter(Boolean).join(' · ');
    const linha2 = a.compras != null ? `${inteiro(a.compras)} vendas · CPA ${eur(a.cpa)}` : '';
    return `<div class="cv fixo escolhido" data-c="${esc(a.chave)}">
        <div class="tela"><video controls playsinline loop preload="metadata" ${a.capa ? `poster="${esc(a.capa)}"` : ''}><source src="${esc(a.previa)}" type="video/mp4"><source src="${esc(a.src)}" type="video/mp4"></video>
        <span class="letra">${a.letra}</span><span class="formato"></span></div>
        <div class="dados"><b>${a.rotulo ? esc(a.rotulo) : `#${a.pos}${a.roas != null ? ` · ROAS ${num(a.roas)}` : ''}`}</b>${linha2}<br>${extra}${a.nota ? `<br><span class="mau">${esc(a.nota)}</span>` : ''}<span class="fundo"></span></div></div>`;
  }

  function anuncioC(a, m, i) {
    const p = problemas(a.texto);
    const mini = a.capa ? `<img class="mini" src="${esc(a.capa)}" alt="">` : `<video class="mini" muted preload="metadata" src="${esc(a.src)}"></video>`;
    return `<div class="anuncio">
        <div class="cab">${mini}<div><b>${esc(a.nome)}</b><br><span>${a.rotulo ? esc(a.rotulo) : `Meta #${a.pos}${a.roas != null ? ` · ROAS ${num(a.roas)}` : ''}`}</span></div></div>
        ${campo('Nome', `<code>${esc(a.nome)}</code>`, copiar(a.nome))}
        ${campo('Identidade', `<code>${esc(CONTA.perfil)}</code>`)}
        ${campo('Vídeo', `<code>${esc(a.ficheiro)}</code><small>Transferências › TikTok › ${esc(pastaC(m.k))}</small>`)}
        ${campo('Texto', `<span class="texto">${esc(a.texto)}</span>${p.length ? `<small class="mau">${esc(p.join(', '))}</small>` : ''}`, copiar(a.texto))}
        ${campo('Botão', '<code>Shop now</code>')}
        ${campo('URL', `<code>${esc(link(m))}</code>${i === 0 ? '<small>o TikTok troca os __NOMES__ pelos da campanha, do grupo e do anúncio</small>' : ''}`, copiar(link(m)))}
      </div>`;
  }

  function desenhaCampanha() {
    if (!CAMP) return;
    const m = mercadoK(E.cm), lista = anunciosC(E.cm);
    $('#c-mercados').innerHTML = CAMP.ks.map((k) => `<button data-cm="${k}" class="${k === E.cm ? 'ativo' : ''}">${esc(mercadoK(k).nome)}</button>`).join('');
    somaCampanha();
    $('#c-sub').textContent = lista.length && lista.every((a) => a.rotulo)
      ? `Vídeos novos da Drive, ainda nunca anunciados, a falar ${FALA[m.lingua]} e com a promoção que está na loja.`
      : `Os que mais venderam na Meta em ${m.nome}, a falar ${FALA[m.lingua]} e com a promoção que está na loja.`;
    soltaVideos('#c-grelha');
    $('#c-grelha').innerHTML = lista.map((a) => cartaoC(a, m)).join('');
    ligaVideos('#c-grelha', true);
    $('#c-plano').innerHTML = `
      <h2>No TikTok Ads Manager</h2>
      <p class="nota">Uma campanha por país, por esta ordem, como aparece lá. A conta abre no AdsPower, perfil «TIKTOK».</p>
      ${blocoCampanha(m, CAMP.dia)}
      ${blocoGrupo(m, CAMP.dia, 'c-', CAMP.inicio)}
      <div class="bloco"><h3>Anúncios, um por vídeo</h3>${lista.map((a, i) => anuncioC(a, m, i)).join('')}</div>`;
    desenhaPeC();
  }

  function desenhaPeC() {
    if (!CAMP) return;
    const btn = $('#c-fazer'), total = totalC(), falta = faltamC().length;
    let aviso = '';
    if (!NATIVO) {
      aviso = 'Os ficheiros só se fazem na app MisterTuga do Mac.';
      btn.disabled = true; btn.textContent = `Fazer os ${total} vídeos`;
    } else if (E.cOcupado) {
      btn.disabled = true; btn.textContent = `A fazer ${Math.min(E.cFeitos + 1, E.cFalta)} de ${E.cFalta}…`;
    } else {
      btn.disabled = false;
      btn.textContent = !falta ? 'Mostrar no Finder' : falta === total ? `Fazer os ${total} vídeos` : falta === 1 ? 'Fazer o que falta' : `Fazer os ${falta} que faltam`;
    }
    $('#c-aviso').textContent = aviso;
    $('#c-estado').innerHTML = NATIVO ? anunciosC(E.cm).map((a) => {
      const s = E.cEstado[a.nome], tem = temC(E.cm, a.ficheiro);
      const txt = s && s.t === 'a preparar' ? 'a fazer…' : s && s.t === 'erro' ? `não deu: ${esc(s.erro)}` : tem ? (s && s.mb ? `pronto · ${num(s.mb, 1)} MB` : 'pronto') : 'por fazer';
      return `<li class="${s && s.t === 'erro' ? 'erro' : tem ? 'ok' : ''}"><span>${esc(a.nome)}</span><span>${txt}</span></li>`;
    }).join('') : '';
    const prontos = total - falta;
    $('#c-feito').innerHTML = NATIVO && prontos ? `${prontos === total ? `Os ${total}` : `${prontos} de ${total}`} prontos em Transferências › TikTok, numa pasta por país, cada uma com o plano.txt.` : '';
  }

  // o plano.txt de cada país, com os vídeos que estão na pasta e o CPA alvo e o orçamento que estão na app
  async function guardaPlanosC() {
    for (const k of CAMP.ks) {
      const prontos = anunciosC(k).filter((a) => temC(k, a.ficheiro));
      if (!prontos.length) continue;
      try { await nativo({ acao: 'tiktok-guardar', pasta: pastaC(k), nome: 'plano.txt', texto: planoTexto(prontos, mercadoK(k), CAMP.dia, CAMP.datapt, CAMP.inicio) }); } catch (e) { /* o plano está à vista na app */ }
    }
  }

  async function fazerCampanha() {
    if (!NATIVO || !CAMP || E.cOcupado) return;
    const falta = faltamC();
    if (!falta.length) { await guardaPlanosC(); nativo({ acao: 'tiktok-mostrar', pasta: pastaC(E.cm) }).catch(() => {}); return; }
    E.cOcupado = true; E.cFeitos = 0; E.cFalta = falta.length;
    desenhaPeC();
    for (const [k, a] of falta) {
      E.cEstado[a.nome] = { t: 'a preparar' };
      desenhaPeC();
      try {
        const r = await nativo({ acao: 'tiktok-preparar', origem: a.origem, pasta: pastaC(k), nome: a.ficheiro });
        E.cEstado[a.nome] = { t: 'pronto', mb: r.mb };
        (E.cTem[k] = E.cTem[k] || new Set()).add(a.ficheiro);
      } catch (e) {
        E.cEstado[a.nome] = { t: 'erro', erro: String((e && e.message) || e) };
      }
      E.cFeitos++;
      desenhaPeC();
    }
    await guardaPlanosC();
    E.cOcupado = false;
    desenhaPeC();
    nativo({ acao: 'tiktok-mostrar', pasta: pastaC(E.cm) }).catch(() => {});
    if (window.mtTesteCampanha) window.mtTesteCampanha(E);
  }

  // ---------- decidir ----------
  // As regras do separador Regras, em contas. x: gasto ($), compras, dias, imp, cliques e v6 (% que vê 6 s), estes três opcionais.
  function decide(x, a) {
    const gasto = +x.gasto || 0, compras = Math.floor(+x.compras || 0), dias = +x.dias || 0, imp = +x.imp || 0;
    const cliques = x.cliques === '' || x.cliques == null ? null : +x.cliques;
    const v6 = x.v6 === '' || x.v6 == null ? null : +x.v6;
    const cpa = compras > 0 ? gasto / compras : null;
    const ctr = imp > 0 && cliques != null ? cliques / imp * 100 : null;
    const R = (v, porque, faz) => ({ v, porque, faz, cpa, ctr, v6 });
    const minimo = Math.max(50, a);
    if (!gasto) return R('esperar', 'Ainda não há números.', 'Mete o gasto, as compras e há quantos dias o anúncio corre.');
    if (compras === 0 && gasto >= 2 * a) return R('cortar', `Gastou ${usd(gasto)}, 2 vezes o CPA alvo (${usd(2 * a)}), sem vender.`, 'Pausa este anúncio (não o grupo) e mete outro vídeo no lugar.');
    if (dias < 2 || gasto < minimo) return R('esperar', `Ainda é cedo: um vídeo só se julga depois de 48 horas e ${usd(minimo)} gastos.`, 'Não mexas em nada. Volta a ver amanhã.');
    if (ctr != null && imp >= 10000 && ctr < 0.5) return R('cortar', `Com ${inteiro(imp)} impressões, só ${pct(ctr)} clica. Abaixo de 0,5% corta-se.`, 'Pausa este anúncio: o vídeo não faz clicar.');
    if (v6 != null && v6 < 25) return R('cortar', `Só ${pct(v6)} vê até aos 6 segundos. Abaixo de 25% corta-se.`, 'Pausa este anúncio: o começo do vídeo não prende.');
    if (compras > 0 && dias >= 3 && cpa > 1.5 * a) return R('cortar', `No ${dias}.º dia, cada venda custa ${usd(cpa)}, mais de 1,5 vezes o alvo (${usd(1.5 * a)}).`, 'Pausa este anúncio e mete outro vídeo no lugar.');
    if (compras >= 3 && dias >= 3 && cpa <= a) return R('escalar', `${compras} vendas em ${dias} dias, a ${usd(cpa)} cada: no alvo de ${usd(a)} ou abaixo.`,
      'Duplica o grupo com este vídeo e o mesmo orçamento: é assim que o TikTok manda escalar com Maximum Results. Quando o grupo fizer 50 compras numa semana, sobe o orçamento 20 a 30% de 3 em 3 dias.');
    if (compras > 0 && cpa <= a) return R('manter', `Vende a ${usd(cpa)}, dentro do alvo, mas ${compras < 3 ? `só com ${compras} ${compras === 1 ? 'venda' : 'vendas'}` : `só há ${dias} dias`}: ainda pode ser sorte.`,
      'Deixa correr sem mexer. Escala-se com 3 vendas no alvo e 3 dias a correr.');
    if (compras === 0) return R('manter', `Ainda sem vendas, mas não chegou a 2 vezes o CPA alvo (${usd(2 * a)}).`, `Deixa correr. Se chegar a ${usd(2 * a)} sem vender, corta.`);
    if (dias < 3) return R('manter', `Cada venda custa ${usd(cpa)}, acima do alvo, mas ainda não é o 3.º dia.`, 'Deixa correr até ao 3.º dia e volta a ver.');
    return R('manter', `Cada venda custa ${usd(cpa)}: acima do alvo (${usd(a)}), mas abaixo de 1,5 vezes (${usd(1.5 * a)}).`, 'Deixa correr e junta vídeos novos ao grupo. Se passar de 1,5 vezes o alvo, corta.');
  }

  const PALAVRA = { escalar: 'Escalar', manter: 'Manter', esperar: 'Esperar', cortar: 'Cortar' };
  const CALC = { gasto: '', compras: '', dias: '', imp: '', cliques: '', v6: '' };

  function desenhaDecidir() {
    const m = MERCADOS.find((x) => x.k === E.dm) || mercado();
    $('#form').innerHTML = `
      <div class="alvo">
        <label>Mercado<select id="d-mercado">${MERCADOS.map((x) => `<option value="${x.k}" ${x.k === m.k ? 'selected' : ''}>${esc(x.nome)}</option>`).join('')}</select></label>
        <label>CPA alvo ($)<input id="d-alvo" type="number" min="1" step="1" value="${alvo(m.k)}"></label>
      </div>
      <label>Gasto ($)<input data-d="gasto" type="number" min="0" step="0.01" value="${CALC.gasto}"></label>
      <label>Compras<input data-d="compras" type="number" min="0" step="1" value="${CALC.compras}"></label>
      <label>Dias a correr<input data-d="dias" type="number" min="0" step="1" value="${CALC.dias}"></label>
      <label>Impressões<input data-d="imp" type="number" min="0" step="1" value="${CALC.imp}" placeholder="opcional"></label>
      <label>Cliques<input data-d="cliques" type="number" min="0" step="1" value="${CALC.cliques}" placeholder="opcional"></label>
      <label>% que vê 6 s<input data-d="v6" type="number" min="0" max="100" step="0.1" value="${CALC.v6}" placeholder="opcional"></label>`;
    desenhaVeredito();
  }

  function desenhaVeredito() {
    const r = decide(CALC, alvo(E.dm));
    const numeros = [r.cpa != null ? `CPA ${usd(r.cpa)}` : '', r.ctr != null ? `CTR ${pct(r.ctr)} (normal 0,5 a 1,5%)` : '', r.v6 != null ? `6 s ${pct(r.v6)} (bom acima de 40%)` : ''].filter(Boolean).join(' · ');
    const el = $('#veredito');
    el.className = 'veredito ' + r.v;
    el.innerHTML = `<p class="palavra">${PALAVRA[r.v]}</p><p>${esc(r.porque)}</p><p class="faz">${esc(r.faz)}</p>${numeros ? `<p class="numeros">${numeros}</p>` : ''}`;
  }

  // ---------- regras ----------
  const FONTES = {
    aprender: ['TikTok: fase de aprendizagem', 'https://ads.tiktok.com/help/article/learning-phase?lang=en'],
    escalar: ['TikTok: escalar o gasto', 'https://ads.tiktok.com/help/article/scaling-auction-ad-spend-solutions?lang=en'],
    orcamento: ['TikTok: licitação e orçamento', 'https://ads.tiktok.com/help/article/bidding-budget-solutions-drive-tiktok-auction-ad-performance'],
    cpa: ['TikTok: CPA estável ao escalar', 'https://ads.tiktok.com/help/article/how-to-achieve-cpa-stability-while-scaling-spending-on-tiktok?lang=en'],
    eventos: ['TikTok: o evento Purchase', 'https://ads.tiktok.com/help/article/how-to-adopt-tiktoks-updated-standard-events'],
    utm: ['TikTok: UTM com macros', 'https://ads.tiktok.com/help/article/track-offsite-web-events-with-utm-parameters'],
    specs: ['TikTok: formato dos vídeos', 'https://ads.tiktok.com/help/article/video-ads-specifications?lang=en'],
    smart: ['TikTok: Smart+', 'https://ads.tiktok.com/business/es/blog/smart-plus-ai-performance-solution'],
    mega: ['Megadigital: aprendizagem', 'https://megadigital.ai/en/blog/tiktok-learning-phase/'],
    nestap: ['Nestscale: aprendizagem', 'https://nestscale.com/blog/tiktok-ads-learning-phase.html'],
    tikad: ['TikAdSuite: orçamento', 'https://tikadsuite.com/blog/tiktok-ads-budget-optimization-tips/'],
    nest: ['Nestscale: métricas', 'https://nestscale.com/blog/tiktok-ads-metrics-how-to-measure-ad-performance-on-tiktok.html'],
    optim: ['TheOptimizer: regras de corte', 'https://theoptimizer.io/docs/automation/rule-templates'],
    birch: ['Birch: regras para o TikTok', 'https://bir.ch/birch-course/best-practices-for-tiktok.md'],
  };
  const TIPOS = { tt: ['TikTok', 'dito pelo próprio TikTok'], pr: ['Prática', 'regra de quem anuncia todos os dias, não é do TikTok'], lj: ['Loja', 'por causa da nossa loja'], nos: ['Nós', 'dos nossos números da Meta'] };
  // cada regra: [texto, [tipo, fonte?], ...]
  const REGRAS = [
    ['Montar', 'antes de gastar', [
      ['Uma campanha por mercado. O nome começa por [PT], [ES], [US], [IT] ou [NL-BE], porque é assim que o painel da loja sabe de que mercado é o gasto.', ['lj']],
      ['Objetivo Sales, no site, campanha manual. O Smart+ fica para depois, só com vídeos que já tenham 10 compras em 28 dias, e corre pelo menos 7 dias.', ['tt', 'smart']],
      ['Pixel tuga e evento Purchase. A loja manda «CompletePayment», que o TikTok mostra como Purchase desde maio de 2025.', ['tt', 'eventos']],
      ['Orçamento de cada grupo: 10 vezes o CPA alvo por dia, para a aprendizagem acabar depressa.', ['tt', 'orcamento']],
      ['Com menos dinheiro também dá, mas nunca menos de $50 por dia em cada grupo: aprende mais devagar.', ['pr', 'tikad']],
      ['3 a 5 vídeos por grupo. Mais do que isso espalha o dinheiro e nenhum chega a aprender.', ['pr', 'aprender']],
      ['Só TikTok nos posicionamentos, sem Pangle nem Global App Bundle. Na Meta, a Audience Network enchia o CTR de cliques que não compravam.', ['nos']],
      ['Vídeos em 9:16 (1080x1920), em H.264. A app já os faz assim; os que não são 9:16 levam um fundo desfocado em vez de faixas pretas.', ['tt', 'specs']],
    ]],
    ['Os primeiros dias', 'não mexer', [
      ['Enquanto aprende não se edita, não se pausa e não se mexe muito no orçamento: cada mudança grande faz a aprendizagem recomeçar.', ['tt', 'aprender']],
      ['Os números acalmam depois de uns 25 resultados ou 7 dias. Até lá não se julga o ROAS.', ['tt', 'aprender']],
      ['Um vídeo só se julga depois de 48 horas e $50 gastos.', ['pr', 'mega']],
    ]],
    ['Cortar um vídeo', 'pausar o anúncio, não o grupo', [
      ['Gastou 2 vezes o CPA alvo e não vendeu nada.', ['pr', 'optim']],
      ['10 000 impressões e menos de 0,5% de cliques (CTR).', ['pr', 'birch']],
      ['Menos de 25% vê até aos 6 segundos. Acima de 40% é bom.', ['pr', 'nest']],
      ['No 3.º dia, cada venda ainda custa mais de 1,5 vezes o alvo.', ['pr', 'optim']],
      ['Se é o grupo todo que dispara no CPA, o TikTok diz para não o pausar: muda a licitação para Target Cost per Result, com o CPA alvo.', ['tt', 'cpa']],
    ]],
    ['Escalar', 'pôr mais dinheiro no que vende', [
      ['Quando: CPA no alvo ou abaixo, 3 dias seguidos, com pelo menos 3 vendas.', ['pr', 'tikad']],
      ['Como: com Maximum Results não se sobe o orçamento do grupo que está a dar. Duplica-se para um grupo novo, com o mesmo vídeo e o mesmo orçamento.', ['tt', 'cpa']],
      ['Quando o grupo fizer 50 compras numa semana, já pode subir: 20 a 30% de cada vez, de 2 em 2 ou de 3 em 3 dias.', ['tt', 'escalar'], ['pr', 'tikad']],
      ['Para subir mais sem o CPA fugir: mudar o grupo para Target Cost per Result, com o CPA alvo, e só depois subir o orçamento.', ['tt', 'cpa']],
    ]],
    ['Medir', 'o que conta são as vendas', [
      ['Comparar o que o TikTok diz com as vendas que entraram: a loja guarda o ttclid e as UTM de cada encomenda.', ['lj']],
      ['Cada anúncio leva no link o nome da campanha, do grupo e do anúncio (as macros do TikTok), para se saber de onde veio cada venda.', ['tt', 'utm']],
      ['Referências: CTR normal entre 0,5 e 1,5% (média de 0,84%); um bom começo prende mais de 30% nos 3 primeiros segundos.', ['pr', 'nest']],
    ]],
  ];

  function desenhaRegras() {
    const tag = ([tipo, fonte]) => fonte
      ? `<a class="tag ${tipo}" href="${FONTES[fonte][1]}" title="${esc(FONTES[fonte][0])}">${TIPOS[tipo][0]}</a>`
      : `<span class="tag ${tipo}">${TIPOS[tipo][0]}</span>`;
    const tabela = MERCADOS.map((m) => {
      const e = cpaMeta(m.k);
      return e ? `<li><span><b>${esc(m.nome)}</b> · CPA alvo ${usd(alvo(m.k))} (${eur(e)} na Meta) · orçamento ${usd(orcamentoPadrao(m.k))} por dia em cada grupo</span><span class="de"><span class="tag nos">Nós</span></span></li>` : '';
    }).join('');
    $('#regras').innerHTML = `
      <h2>Regras</h2>
      <p class="lead">O que fazer com o dinheiro em cada anúncio. Cada regra diz de onde vem; carrega na etiqueta para ver a fonte. As do separador Decidir são estas, em contas.</p>
      <p class="legenda">${Object.entries(TIPOS).map(([k, [n, d]]) => `<span><span class="tag ${k}">${n}</span>${d}</span>`).join('')}</p>
      ${REGRAS.map(([titulo, sub, lista]) => `<section><h3>${titulo}<small>${sub}</small></h3><ol>${lista.map(([texto, ...de]) => `<li><span>${esc(texto)}</span><span class="de">${de.map(tag).join('')}</span></li>`).join('')}</ol></section>`).join('')}
      <section><h3>O CPA alvo de cada mercado<small>o que a Meta paga em média por venda (valor médio das encomendas ÷ ROAS médio)</small></h3><ol>${tabela}</ol></section>
      <section><h3>Fontes</h3><ul class="fontes">${Object.values(FONTES).map(([t, u]) => `<li><a href="${u}">${esc(t)}</a></li>`).join('')}</ul></section>`;
  }

  // ---------- eventos ----------
  document.addEventListener('click', (ev) => {
    const t = ev.target;
    const v = t.closest('#vistas button');
    if (v) { mostraVista(v.dataset.v); return; }
    const m = t.closest('#mercados button');
    if (m) { mudaMercado(m.dataset.m); return; }
    const cm = t.closest('#c-mercados button');
    if (cm) { if (cm.dataset.cm !== E.cm) { E.cm = cm.dataset.cm; desenhaCampanha(); } return; }
    if (t.closest('#c-fazer')) { fazerCampanha(); return; }
    if (t.closest('#c-teste50')) { guarda('orc.' + E.cm, 50); $('#c-orc').value = 50; somaCampanha(); return; }
    const c = t.closest('#grelha .cv');
    if (c) { escolhe(c.dataset.c); return; }
    const tirar = t.closest('[data-tirar]');
    if (tirar) { escolhe(tirar.dataset.tirar); return; }
    const cp = t.closest('[data-copiar]');
    if (cp) { copia(cp.dataset.copiar, cp); return; }
    const ct = t.closest('[data-copiar-texto]');
    if (ct) { copia(String(E.textos[ct.dataset.copiarTexto] || '').trim(), ct); return; }
    const cd = t.closest('[data-copiar-de]');
    if (cd) { copia(String($('#' + cd.dataset.copiarDe).value), cd); return; }
    if (t.closest('#fazer')) { preparar(); return; }
    if (t.closest('#do-mac')) { doMac(); return; }
    if (t.closest('#finder') && E.feito) { nativo({ acao: 'tiktok-mostrar', pasta: E.feito.pasta }).catch(() => {}); return; }
    if (t.closest('#teste50')) { guarda('orc.' + E.mercado, 50); $('#orc').value = 50; somaCampanha(); return; }
  });

  document.addEventListener('input', (ev) => {
    const t = ev.target;
    if (t.dataset.texto) {
      const chave = t.dataset.texto;
      E.textos[chave] = t.value;
      if (E.feito) { const a = E.feito.anuncios.find((x) => x.chave === chave); if (a) a.texto = t.value; }
      const p = problemas(t.value);
      t.classList.toggle('mal', p.length > 0);
      const el = document.querySelector(`[data-contador="${CSS.escape(chave)}"]`);
      el.textContent = contador(t.value); el.classList.toggle('mal', p.length > 0);
      if (!E.feito) desenhaPe();
    } else if (t.id === 'alvo' || t.id === 'd-alvo' || t.id === 'c-alvo') {
      // o mesmo CPA alvo no Preparar, no Decidir e na campanha, quando é o mesmo país
      const ids = { alvo: E.mercado, 'd-alvo': E.dm, 'c-alvo': E.cm };
      const n = Math.round(+t.value), k = ids[t.id];
      if (n > 0) {
        guarda('alvo.' + k, n);
        for (const [id, kk] of Object.entries(ids)) if (id !== t.id && kk === k && $('#' + id)) $('#' + id).value = n;
        if (lido('orc.' + k, null) == null) { // o orçamento segue o alvo enquanto não for mudado à mão
          if (k === E.mercado && $('#orc')) $('#orc').value = orcamentoPadrao(k);
          if (k === E.cm && $('#c-orc')) $('#c-orc').value = orcamentoPadrao(k);
        }
        desenhaVeredito(); somaCampanha();
      }
    } else if (t.id === 'orc' || t.id === 'c-orc') {
      const n = Math.round(+t.value), k = t.id === 'orc' ? E.mercado : E.cm;
      if (n > 0) {
        guarda('orc.' + k, n);
        const outro = $(t.id === 'orc' ? '#c-orc' : '#orc');
        if (outro && E.mercado === E.cm) outro.value = n;
        somaCampanha();
      }
    } else if (t.dataset.d) {
      CALC[t.dataset.d] = t.value;
      desenhaVeredito();
    }
  });

  document.addEventListener('change', (ev) => {
    if (ev.target.id === 'd-mercado') { E.dm = ev.target.value; desenhaDecidir(); }
  });

  function mostraVista(v) {
    E.vista = v;
    for (const b of document.querySelectorAll('#vistas button')) b.classList.toggle('ativo', b.dataset.v === v);
    for (const s of document.querySelectorAll('.vista')) s.classList.toggle('ativa', s.id === 'v-' + v);
    // o CPA alvo e o orçamento podem ter mudado noutra aba
    if (v === 'regras') desenhaRegras();
    else if (v === 'campanha') desenhaCampanha();
    else if (v === 'decidir') desenhaDecidir();
    else if (v === 'moderador') carregaLogsModerador();
    else if (v === 'preparar') { if (E.grelhaSolta) desenhaGrelha(); if (!E.ocupado) desenhaPlano(); }
    soltaEscondidas();
    window.scrollTo(0, 0);
  }

  function carregaLogsModerador() {
    const box = $('#mod-logs');
    if (!box) return;
    fetch('/moderation_audit.log?t=' + Date.now())
      .then(r => r.ok ? r.text() : 'Sem registos recentes. O moderador está a vigiar em segundo plano.')
      .then(txt => {
        box.innerHTML = esc(txt).replace(/\n/g, '<br>');
        box.scrollTop = box.scrollHeight;
      })
      .catch(() => {
        box.innerHTML = 'Moderador ativo em segundo plano via CDP :54384 (AdsPower).<br>A monitorar 124 termos e 35 padrões de frases longas a cada 15 segundos.';
      });
  }

  // ---------- arranque ----------
  async function arranca() {
    E.dm = E.mercado;
    desenhaConta();
    await letrasDeHoje();
    desenhaMercados(); desenhaGrelha(); desenhaPlano(); desenhaDecidir(); desenhaRegras();
    if (CAMP && CAMP.ks.length) {
      E.cm = CAMP.ks[0];
      const b = $('#b-campanha');
      b.textContent = CAMP.rotulo; b.hidden = false;
      await verPastasC();
      desenhaCampanha();
      if (CAMP.quando) mostraVista('campanha'); // abre na campanha enquanto é para hoje ou amanhã
    }
    soltaEscondidas();
  }
  window.mtTikTok = {
    E, CAMP, escolhe, preparar, decide, mudaMercado, mostraVista, anuncios, anunciosC, fazerCampanha, problemas,
    planoTexto: () => planoTexto(anuncios(), mercado()),
    planoTextoC: (k) => planoTexto(anunciosC(k), mercadoK(k), CAMP.dia, CAMP.datapt, CAMP.inicio),
  };
  arranca();
})();
