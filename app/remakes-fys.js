// Remakes ForYouSong dos maiores vencedores com marca de outra loja.
// Gerado a 17/11/2026 a partir do ver-anuncio (voz, texto no ecrã, cortes). Só formato e ritmo; tudo novo e com a marca ForYouSong.
window.REMAKES_FYS = [
  {
    id: "R1",
    nome: "Reação no carro com a canção inteira",
    base: ["YM-DE1 · 14.800 € · YourMelody", "YM-FR1 · 13.900 € · YourMelody", "YM-FR2 · 5.600 € · YourMelody", "SG-EN9 · 4.700 € · SonglyGift"],
    origem: {
      gancho: "0,0 s: a pessoa já está a ouvir e a emocionar-se. No ecrã, uma frase de contexto em 2 a 3 linhas («Ela pensava que ele se tinha esquecido do aniversário…»). A letra começa logo, com o nome e a história do casal.",
      texto: "Uma caixa branca de contexto no topo do vídeo inteiro e a letra da canção em legendas por baixo, frase a frase.",
      cortes: "Quase sem cortes (0 a 6 em 1 a 3 minutos): um só plano longo, filmado com o telemóvel no tablier ou na mesa.",
      audio: "A canção personalizada do princípio ao fim (voz cantada, 90 a 110 palavras por minuto), com nomes, cidades e anos verdadeiros.",
      cta: "Não há pedido falado. O pedido está no texto do anúncio e no botão («Shop now»)."
    },
    porque: "É o formato com mais gasto acumulado dos três concorrentes: a prova é a lágrima verdadeira e a letra com pormenores reais.",
    cenas: [
      { t: "0 a 3 s", ver: "Plano fixo dentro do carro, lugar do pendura. Ela ouve pelo telemóvel e leva a mão à boca.", ecra: "contexto", som: "A canção começa com o nome dela." },
      { t: "3 a 20 s", ver: "Mesmo plano. Ele conduz e olha de lado; ela ri e chora.", ecra: "letra", som: "1.º verso: como se conheceram (sítio, ano)." },
      { t: "20 a 45 s", ver: "Ela vira-se para ele, abraço ou mão no ombro.", ecra: "letra", som: "Refrão com o nome." },
      { t: "45 a 60 s", ver: "Grande plano das mãos dadas ou do telemóvel com a capa ForYouSong.", ecra: "cta", som: "Fim do refrão, fade." }
    ],
    prompts: {
      video: "Vertical 9:16 smartphone footage, fixed dashboard camera inside a car in daylight, a woman in the passenger seat listening to a song on her phone, she covers her mouth and starts crying with happiness, the man driving glances at her and smiles, natural light, handheld UGC look, no text, no logos.",
      imagem: "Vertical 9:16 photo, warm natural light, couple in a car, woman holding a phone showing a music player with the title 'Our Song', emotional tears and smile, authentic smartphone photo, no brand logos."
    },
    legendas: {
      contexto: {
        DE: "Sie dachte, er hätte ihren Jahrestag vergessen… aber er hatte eine Überraschung 🥹",
        IT: "Pensava che avesse dimenticato il loro anniversario… invece aveva una sorpresa 🥹",
        FR: "Elle pensait qu'il avait oublié leur anniversaire… mais il avait préparé une surprise 🥹",
        EN: "She thought he forgot their anniversary… but he had a surprise 🥹",
        ES: "Pensaba que había olvidado su aniversario… pero tenía una sorpresa 🥹"
      },
      cta: {
        DE: "Euer eigenes Lied, mit eurer Geschichte · ForYouSong",
        IT: "La vostra canzone, con la vostra storia · ForYouSong",
        FR: "Votre chanson, avec votre histoire · ForYouSong",
        EN: "Your song, with your story · ForYouSong",
        ES: "Vuestra canción, con vuestra historia · ForYouSong"
      }
    }
  },
  {
    id: "R2",
    nome: "Montagem de reações com narração «E se…?»",
    base: ["SG-EN7 · 7.000 € · SonglyGift"],
    origem: {
      gancho: "0,0 s: imagem calma (janela aberta para o campo ao pôr do sol) com a pergunta no ecrã e falada ao mesmo tempo: «E se pudesses transformar as tuas memórias numa canção?».",
      texto: "Uma frase pequena e branca ao centro, que acompanha a voz.",
      cortes: "22 cortes em 27 s (8 por 10 s). O primeiro aos 3,9 s; depois, uma reação diferente a cada 1 a 2 s.",
      audio: "Voz off feminina e calma (138 palavras por minuto) com piano por baixo.",
      cta: "Ecrã final branco com a marca e a voz a dizer para criar a canção hoje."
    },
    porque: "Gancho de curiosidade sem pessoas nos 3 primeiros segundos, e depois prova social em catadupa («milhares já fizeram»).",
    cenas: [
      { t: "0 a 3,5 s", ver: "Janela a abrir para uma paisagem ao pôr do sol, câmara lenta.", ecra: "gancho", som: "Voz: a pergunta." },
      { t: "3,5 a 10 s", ver: "3 reações curtas: mãe com lenço, avó no sofá, mulher sentada no chão.", ecra: "frase2", som: "Voz: o que é (canção feita para quem gostas)." },
      { t: "10 a 22 s", ver: "6 a 8 reações de 1 a 1,5 s: carro, cozinha, sala; risos e lágrimas.", ecra: "frase3", som: "Voz: «Uma que nunca vão esquecer.»" },
      { t: "22 a 27 s", ver: "Ecrã final branco com o logótipo ForYouSong.", ecra: "cta", som: "Voz: o pedido." }
    ],
    prompts: {
      video: "Vertical 9:16, slow push-in through an open wooden window to green countryside at golden hour, soft clouds, cinematic, calm, no people, no text. Then series of short smartphone UGC clips: older women and couples reacting emotionally while listening to a song on a phone at home or in a car, crying and laughing, natural light.",
      imagem: "Vertical 9:16 end card, clean white background, centered ForYouSong logo, small line of text below, minimal, lots of white space."
    },
    legendas: {
      gancho: {
        DE: "Was wäre, wenn deine Erinnerungen ein Lied würden?",
        IT: "E se i tuoi ricordi diventassero una canzone?",
        FR: "Et si tes souvenirs devenaient une chanson ?",
        EN: "What if your memories became a song?",
        ES: "¿Y si tus recuerdos se convirtieran en una canción?"
      },
      frase2: {
        DE: "Ein Lied nur für den Menschen, den du liebst",
        IT: "Una canzone solo per la persona che ami",
        FR: "Une chanson rien que pour la personne que tu aimes",
        EN: "A song made only for the one you love",
        ES: "Una canción solo para la persona que quieres"
      },
      frase3: {
        DE: "Eins, das sie nie vergessen",
        IT: "Una che non dimenticherà mai",
        FR: "Une qu'elle n'oubliera jamais",
        EN: "One they'll never forget",
        ES: "Una que nunca olvidará"
      },
      cta: {
        DE: "Erstelle euer Lied mit ForYouSong",
        IT: "Crea la vostra canzone con ForYouSong",
        FR: "Crée votre chanson avec ForYouSong",
        EN: "Create yours with ForYouSong",
        ES: "Crea la vuestra con ForYouSong"
      }
    }
  },
  {
    id: "R3",
    nome: "Narração «É só preciso…» sobre um plano contínuo",
    base: ["SG-EN24 · 3.700 € · SonglyGift", "SG-EN28 · 4.500 € · SonglyGift"],
    origem: {
      gancho: "0,0 s: palavras grandes em maiúsculas ao centro, a aparecerem uma a uma com a voz («CRIAR ALGO INESQUECÍVEL SÓ…»).",
      texto: "Texto grande, em maiúsculas, palavra a palavra, ao longo do vídeo todo.",
      cortes: "0 a 1 cortes em 33 s: um só plano (pessoa a ouvir ou a abrir a prenda).",
      audio: "Voz off rápida (121 a 147 palavras por minuto) a explicar os passos: contar a história, escolher o estilo e a voz, receber a canção.",
      cta: "Falado no fim: visitar a loja e criar a canção."
    },
    porque: "É o mais simples de produzir (um plano e uma voz) e explica o produto em 30 s. Os dois vídeos têm o mesmo guião e ambos escalaram.",
    cenas: [
      { t: "0 a 3 s", ver: "Mulher a abrir um envelope com um código QR e a pôr os auscultadores.", ecra: "gancho", som: "Voz: a frase do gancho." },
      { t: "3 a 15 s", ver: "Mesmo plano: ela ouve, sorri, os olhos enchem-se.", ecra: "passos", som: "Voz: os 3 passos." },
      { t: "15 a 28 s", ver: "Ela tira os auscultadores e abraça quem lhe deu a prenda.", ecra: "frase3", som: "Voz: «Pessoal, emocionante, impossível de esquecer.»" },
      { t: "28 a 33 s", ver: "Grande plano do telemóvel com a página da ForYouSong.", ecra: "cta", som: "Voz: o pedido." }
    ],
    prompts: {
      video: "Vertical 9:16 single continuous shot, cozy living room, a woman opens a small gift envelope, puts on headphones, listens and slowly gets emotional, then hugs the person who gave it to her, warm lamp light, realistic smartphone footage, no text, no logos.",
      imagem: "Vertical 9:16 close-up of hands holding a gift card with a QR code and a pair of headphones on a wooden table, warm cozy light, no brand logos."
    },
    legendas: {
      gancho: {
        DE: "ETWAS UNVERGESSLICHES ZU ERSCHAFFEN IST GANZ EINFACH",
        IT: "CREARE QUALCOSA DI INDIMENTICABILE È SEMPLICISSIMO",
        FR: "CRÉER QUELQUE CHOSE D'INOUBLIABLE, C'EST TOUT SIMPLE",
        EN: "CREATING SOMETHING UNFORGETTABLE IS EASY",
        ES: "CREAR ALGO INOLVIDABLE ES MUY FÁCIL"
      },
      passos: {
        DE: "Erzähl eure Geschichte · wähle Stil und Stimme · fertig",
        IT: "Racconta la vostra storia · scegli stile e voce · fatto",
        FR: "Raconte votre histoire · choisis le style et la voix · c'est prêt",
        EN: "Tell your story · pick a style and voice · done",
        ES: "Cuenta vuestra historia · elige estilo y voz · listo"
      },
      frase3: {
        DE: "Persönlich. Emotional. Unvergesslich.",
        IT: "Personale. Emozionante. Indimenticabile.",
        FR: "Personnelle. Émouvante. Inoubliable.",
        EN: "Personal. Emotional. Unforgettable.",
        ES: "Personal. Emocionante. Inolvidable."
      },
      cta: {
        DE: "Jetzt auf ForYouSong erstellen",
        IT: "Creala ora su ForYouSong",
        FR: "Crée-la maintenant sur ForYouSong",
        EN: "Create it now on ForYouSong",
        ES: "Créala ahora en ForYouSong"
      }
    }
  },
  {
    id: "R4",
    nome: "POV com legenda palavra a palavra e cortes rápidos",
    base: ["SG-EN1 · 3.400 € · SonglyGift"],
    origem: {
      gancho: "0,0 s: reação exagerada (riso e choro) com uma caixa branca «POV: puseste o coração inteiro numa prenda… e foi isto que aconteceu». Primeiro corte aos 1,4 s.",
      texto: "A caixa POV fica fixa nos primeiros segundos; depois, uma palavra de cada vez em grande, ao centro, a seguir a voz.",
      cortes: "12 cortes em 25 s (5 por 10 s): uma reação nova em cada frase, algumas em ecrã dividido.",
      audio: "Voz off muito rápida (224 palavras por minuto) com música animada por baixo.",
      cta: "Falado no fim, com o nome da marca em grande sobre a última reação."
    },
    porque: "O ritmo prende: há uma pessoa nova a cada 2 s, e o «POV» põe quem vê no lugar de quem oferece.",
    cenas: [
      { t: "0 a 1,4 s", ver: "Mulher à mesa a rir e chorar ao mesmo tempo.", ecra: "gancho", som: "Voz: «Imagina dar uma prenda…»" },
      { t: "1,4 a 12 s", ver: "6 reações de 1,5 s: homem no carro, avó, mãe com bebé, casal a beijar-se, ecrã dividido de 3.", ecra: "palavras", som: "Voz: como funciona (contar a história e as memórias)." },
      { t: "12 a 22 s", ver: "5 reações: no chão da sala, no carro, no sofá.", ecra: "palavras", som: "Voz: «Mais do que uma surpresa: um momento para sempre.»" },
      { t: "22 a 25 s", ver: "Última reação desfocada com a marca ForYouSong por cima.", ecra: "cta", som: "Voz: o pedido." }
    ],
    prompts: {
      video: "Vertical 9:16 fast-paced montage of authentic smartphone UGC clips, different people (couples, grandmothers, a young mother with a baby, a man in a car) reacting with tears and laughter while listening to a personalized song, warm home and car interiors, 1.5 second shots, no text, no logos.",
      imagem: "Vertical 9:16 split screen of three emotional reaction frames stacked vertically, people crying with joy while listening to music on a phone, authentic UGC look, no logos."
    },
    legendas: {
      gancho: {
        DE: "POV: Du steckst dein ganzes Herz in ein Geschenk… und das passiert",
        IT: "POV: metti tutto il tuo cuore in un regalo… ed ecco cosa succede",
        FR: "POV : tu mets tout ton cœur dans un cadeau… et voilà ce qui se passe",
        EN: "POV: you put your whole heart into a gift… and this happened",
        ES: "POV: pones todo tu corazón en un regalo… y pasa esto"
      },
      palavras: {
        DE: "stell dir vor · ihr Gesicht · eure Geschichte · eure Momente",
        IT: "immagina · il suo viso · la vostra storia · i vostri momenti",
        FR: "imagine · son visage · votre histoire · vos moments",
        EN: "imagine · their face · your story · your moments",
        ES: "imagina · su cara · vuestra historia · vuestros momentos"
      },
      cta: {
        DE: "ForYouSong · Mach sie sprachlos",
        IT: "ForYouSong · Lasciala senza parole",
        FR: "ForYouSong · Laisse-la sans voix",
        EN: "ForYouSong · Leave them speechless",
        ES: "ForYouSong · Déjala sin palabras"
      }
    }
  }
];
