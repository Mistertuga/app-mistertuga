/* Campanhas marcadas para o separador TikTok da app MisterTuga.
   A app mostra a próxima (ou a de hoje) numa aba própria, com tudo o que se copia para o TikTok Ads Manager,
   e faz os ficheiros em Transferências › TikTok › «03-11 Portugal», etc.
   Cada vídeo é da página dos criativos (meta/media/<video>.mp4), por ordem: o 1.º é o A, o 2.º o B...
   Escolha de 02/11/2026: os que mais venderam na Meta em cada país, na língua certa, sem falar do Mundial
   e com a promoção que está na loja (leva 3 paga 2, leva 6 paga 3, leva 12 paga 5).
   03/11: em Portugal o #2 saiu (a Meta só guardou 360p, no TikTok via-se esborratado) e o #16 também (pouca prova);
   entraram o #13 e o #18, os dois «Muito validado». Entraram os EUA (MisterFútbol, em inglês, nenhum fala do Mundial).
   03/11, à tarde: a Itália passou para os vídeos novos da Drive (MISTERFUTBOL IT › OUTUBRO › LEGENDA), nunca anunciados:
   scripts 12, 11, 9, 8 e 6. O 10 ficou de fora porque é de Halloween («a promoção acaba com o Halloween»).
   Estes não têm números da Meta: o rotulo aparece no lugar do #. O ficheiro é meta/media/drive-<id da Drive>.mp4 e a capa o .jpg com o mesmo nome. */
window.CAMPANHAS = [
  {
    data: '2026-11-03',
    mercados: {
      PT: [
        { video: '791529540102527', pos: 5, texto: 'Compra 3 camisolas e leva mais 3 grátis. Só na MisterTuga!' },
        { video: '1976623516437615', pos: 2, texto: 'Leva 6, paga 3. Personaliza com o nome e o número que quiseres.' },
        { video: '682910114863828', pos: 13, texto: 'Leva 6 camisolas e paga só 3. Só na MisterTuga!' },
        { video: '1380953927010423', pos: 18, texto: 'Leva 3 camisolas e paga só 2. Só na MisterTuga!' },
        { video: '1149572130026725', pos: 6, texto: 'Uma camisola para cada dia da semana. Leva 6, paga 3.' },
      ],
      ES: [
        { video: '1094401732958819', pos: 4, texto: 'Compra 3 camisetas y llévate 3 más gratis. ¡Solo en MisterFútbol!', nota: 'fala do verão a meio' },
        { video: '897177916715964', pos: 2, texto: 'Llévate 12 camisetas y paga solo 5. Personalízalas con tu nombre y número.' },
        { video: '1854206758582239', pos: 9, texto: 'Calidad que se nota. Lleva 6, paga 3 en MisterFútbol.', nota: 'fala do verão a meio' },
        { video: '1554776615957223', pos: 6, texto: 'Lleva 6, paga 3. Personalízala con el nombre y el número que quieras.' },
        { video: '2066329170682821', pos: 17, capa: '2066329170682821', texto: 'Camisetas 26/27 ya disponibles. Lleva 6, paga 3.' },
      ],
      IT: [
        { video: 'drive-1qpl_r75gQwLa0hHcl0-WwK_Z0hrUSR1A', capa: 'drive-1qpl_r75gQwLa0hHcl0-WwK_Z0hrUSR1A', rotulo: 'Novo · script 12 IT outubro', dur: 22.6, fala: 'it', texto: 'Compra 3 maglie e ricevine altre 3 gratis. Solo su MisterFútbol!' },
        { video: 'drive-14eMM4yggImS-7AirXRkAheIFacrtzEmJ', capa: 'drive-14eMM4yggImS-7AirXRkAheIFacrtzEmJ', rotulo: 'Novo · script 11 IT outubro', dur: 26.5, fala: 'it', texto: 'Colori vivi, stemma pulito, cuciture dritte. Compra 6 maglie e ne paghi solo 3.' },
        { video: 'drive-1dmhud-yEAUeyy4U6WSXBWkZacBJ0kn_l', capa: 'drive-1dmhud-yEAUeyy4U6WSXBWkZacBJ0kn_l', rotulo: 'Novo · script 9 IT outubro', dur: 14.6, fala: 'it', texto: 'La maglia della leggenda e quella del futuro. Prendi 6, paghi 3.', nota: 'diz que o Messi acabou de deixar a seleção' },
        { video: 'drive-1qtzaR-0AZrz_7SfsjSYYCuowoytCT-SI', capa: 'drive-1qtzaR-0AZrz_7SfsjSYYCuowoytCT-SI', rotulo: 'Novo · script 8 IT outubro', dur: 12.8, fala: 'it', texto: 'Dividi con gli amici: prendi 6 maglie e ne paghi solo 3.' },
        { video: 'drive-1pir7iK-esUsiNRXq-SMy5j0tx7b8KcfO', capa: 'drive-1pir7iK-esUsiNRXq-SMy5j0tx7b8KcfO', rotulo: 'Novo · script 6 IT outubro', dur: 13.5, fala: 'it', texto: 'Prendi 6 maglie e ne paghi solo 3. Solo da MisterFútbol!' },
      ],
      US: [
        { video: '1415561263855553', pos: 2, texto: 'Buy 6 jerseys, pay for 3. Customize them with any name and number.' },
        { video: '1373845544613293', pos: 1, texto: 'Buy 12 jerseys, pay for just 5. Only at MisterFútbol!' },
        { video: '1408789211426773', pos: 3, texto: 'Buy 3 jerseys, pay for 2. Only at MisterFútbol!' },
        { video: '1068664372721416', pos: 19, texto: '26/27 jerseys now available. Buy 6, pay 3.' },
        { video: '1435098038778875', pos: 6, texto: "Buy 6, pay 3. Add your name and your favorite player's number." },
      ],
    },
  },
];
