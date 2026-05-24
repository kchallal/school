export interface KnowledgeArticle {
  id: string
  icon: string
  title: string
  tags: string[]
  summary: string
  sections: { heading: string; content: string }[]
}

export const KNOWLEDGE_BASE: KnowledgeArticle[] = [
  {
    id: 'liver',
    icon: '🫁',
    title: 'Le foie',
    tags: ['organe', 'métabolisme'],
    summary: 'Le foie est le premier organe à traiter l\'alcool. Il est aussi l\'un des rares organes humains capables de se régénérer.',
    sections: [
      {
        heading: 'Ce que fait l\'alcool au foie',
        content: 'L\'alcool est métabolisé presque exclusivement par le foie (90%). Le processus produit de l\'acétaldéhyde — une molécule toxique qui endommage les cellules hépatiques, génère du stress oxydatif et déclenche une inflammation. Le foie priorise l\'alcool sur tout autre carburant, ce qui perturbe la métabolisation des graisses et crée une accumulation : c\'est la stéatose hépatique (foie gras alcoolique).',
      },
      {
        heading: 'Ce qui se répare',
        content: 'Le foie a une capacité de régénération exceptionnelle. En l\'absence de cirrhose établie, des études montrent une réduction de 15 à 20% du tissu adipeux après 1 mois d\'abstinence. Les enzymes hépatiques (ALT, AST) reviennent généralement dans les normes en 1 à 3 mois. Une fibrose légère peut commencer à s\'inverser à partir de 6 mois.',
      },
      {
        heading: 'Ce qui ne se répare pas facilement',
        content: 'La cirrhose (remplacement du tissu hépatique par du tissu cicatriciel) est difficilement réversible une fois établie. C\'est pourquoi la fenêtre de récupération précoce est importante — plus l\'abstinence commence tôt, plus les chances de récupération complète sont élevées.',
      },
    ],
  },
  {
    id: 'brain',
    icon: '🧠',
    title: 'Le cerveau',
    tags: ['organe', 'neurologie', 'envie'],
    summary: 'L\'alcool modifie les systèmes de neurotransmetteurs. La récupération est progressive mais réelle et mesurable.',
    sections: [
      {
        heading: 'Comment l\'alcool agit sur le cerveau',
        content: 'L\'alcool amplifie l\'action du GABA (neurotransmetteur inhibiteur, effet calmant) et inhibe le glutamate (neurotransmetteur excitateur). À long terme, le cerveau compense en réduisant les récepteurs GABA et en augmentant les récepteurs glutamate. C\'est ce déséquilibre qui cause les symptômes de sevrage quand on arrête — le cerveau est en "hyperexcitation" sans la substance inhibitrice.',
      },
      {
        heading: 'Le circuit de la récompense',
        content: 'L\'alcool déclenche une libération de dopamine dans le noyau accumbens — le centre de la récompense. Avec une consommation répétée, le cerveau s\'adapte en réduisant sa propre production de dopamine. Résultat : moins de plaisir avec la même quantité, et moins de plaisir dans les activités sans alcool. Après l\'arrêt, ce système se recalibre progressivement sur plusieurs semaines à mois.',
      },
      {
        heading: 'Ce qui se récupère',
        content: 'Des IRM montrent une augmentation mesurable du volume de matière grise après 3 à 6 mois d\'abstinence. La mémoire à court terme, la concentration et les fonctions exécutives (prise de décision, contrôle des impulsions) s\'améliorent. Le cerveau ne récupère pas à la même vitesse pour tout le monde, mais la trajectoire est cohérente.',
      },
    ],
  },
  {
    id: 'heart',
    icon: '❤️',
    title: 'Le coeur et les vaisseaux',
    tags: ['organe', 'cardiovasculaire'],
    summary: 'L\'alcool a un effet direct sur la fréquence cardiaque, la tension et le risque d\'arythmie.',
    sections: [
      {
        heading: 'Effets cardiovasculaires de l\'alcool',
        content: 'L\'alcool dilate les vaisseaux sanguins (sensation de chaleur) et augmente la fréquence cardiaque. À long terme, il contribue à l\'hypertension artérielle, augmente le risque de cardiomyopathie (affaiblissement du muscle cardiaque) et de fibrillation auriculaire — une arythmie qui multiplie par 5 le risque d\'AVC.',
      },
      {
        heading: 'La récupération cardiovasculaire',
        content: 'La pression artérielle commence à baisser dès la première semaine. Après 2 semaines, la baisse est significative et mesurable. Le risque de fibrillation auriculaire réduit après 3 mois. Après 1 an, le profil cardiovasculaire global se rapproche de celui d\'un non-consommateur.',
      },
      {
        heading: 'Un mythe à corriger',
        content: 'L\'idée que "un verre de vin par jour protège le coeur" est issue d\'études épidémiologiques confondues par des biais. Les études plus rigoureuses montrent que le niveau de risque cardiovasculaire le plus bas correspond à une consommation nulle.',
      },
    ],
  },
  {
    id: 'sleep',
    icon: '😴',
    title: 'Le sommeil',
    tags: ['bien-être', 'récupération'],
    summary: 'L\'alcool fait s\'endormir plus vite mais détruit la qualité du sommeil. La récupération du sommeil est l\'une des plus rapides et des plus marquées.',
    sections: [
      {
        heading: 'Pourquoi l\'alcool nuit au sommeil',
        content: 'L\'alcool a un effet sédatif qui facilite l\'endormissement — c\'est une des raisons pour lesquelles il est souvent utilisé comme aide. Mais il fragmente et supprime les phases de sommeil REM (sommeil paradoxal, essentiel à la consolidation mémorielle et à la régulation émotionnelle). Il augmente aussi la fréquence des réveils nocturnes et des apnées.',
      },
      {
        heading: 'Le rebond REM',
        content: 'Dans les premières semaines d\'abstinence, beaucoup de personnes rapportent des rêves très intenses et parfois des cauchemars. C\'est un phénomène connu : le cerveau "rattrape" les phases REM supprimées. Ce phénomène est temporaire et signe que le sommeil se restructure.',
      },
      {
        heading: 'La récupération',
        content: 'Après 1 mois, l\'architecture du sommeil est significativement améliorée pour la majorité. La durée des phases de sommeil profond augmente. Les personnes rapportent moins de fatigue diurne et une meilleure énergie — même si les premières semaines peuvent être difficiles.',
      },
    ],
  },
  {
    id: 'skin',
    icon: '✨',
    title: 'La peau et l\'hydratation',
    tags: ['bien-être', 'visible'],
    summary: 'La peau est l\'un des premiers endroits où les effets de l\'abstinence deviennent visibles.',
    sections: [
      {
        heading: 'L\'alcool et la déshydratation',
        content: 'L\'alcool est un diurétique puissant. Pour chaque gramme d\'alcool consommé, ton corps élimine plus d\'eau qu\'il n\'en absorbe. Cette déshydratation chronique affecte directement la peau : perte d\'élasticité, teint terne, cernes marquées, pores dilatés, rougeurs chroniques (dilatation des capillaires).',
      },
      {
        heading: 'Ce qui change rapidement',
        content: 'Après 1 semaine, la réhydratation est déjà perceptible. Après 1 mois, des changements nets sont souvent visibles : teint plus uniforme, disparition ou réduction des rougeurs, peau plus "gonflée" (moins creuse). La production de collagène, ralentie par l\'alcool, redémarre.',
      },
      {
        heading: 'Effets indirects',
        content: 'Un meilleur sommeil améliore aussi la peau (réparation cellulaire nocturne). L\'argent économisé peut aller vers des soins. La résultante est souvent plus rapide et plus visible que ce que les gens anticipent.',
      },
    ],
  },
  {
    id: 'immunity',
    icon: '🛡️',
    title: 'Le système immunitaire',
    tags: ['santé', 'global'],
    summary: 'L\'alcool affaiblit l\'immunité de façon mesurable. La récupération est progressive mais réelle.',
    sections: [
      {
        heading: 'Comment l\'alcool affaiblit les défenses',
        content: 'L\'alcool réduit la production et l\'efficacité des globules blancs (lymphocytes T et B, cellules NK). Il perturbe la barrière intestinale, permettant à des bactéries de passer dans le sang. Il réduit la réponse inflammatoire normale — ce qui peut sembler positif mais signifie en réalité une moins bonne réaction aux infections.',
      },
      {
        heading: 'Ce qui récupère',
        content: 'Après 2 semaines, l\'activité des globules blancs augmente. Après 1 mois, la réponse immunitaire générale est améliorée. Les personnes qui arrêtent de boire rapportent souvent moins de maladies hivernales, une récupération plus rapide et une meilleure réponse aux vaccins.',
      },
    ],
  },
  {
    id: 'memory',
    icon: '📚',
    title: 'La mémoire et la concentration',
    tags: ['neurologie', 'quotidien'],
    summary: 'L\'alcool affecte la mémoire à plusieurs niveaux. La récupération cognitive est l\'une des plus significatives de l\'abstinence.',
    sections: [
      {
        heading: 'Effets sur la mémoire',
        content: 'L\'alcool perturbe la consolidation mémorielle qui se produit pendant le sommeil REM. Il réduit la production de nouveaux neurones dans l\'hippocampe (neurogenèse). À long terme, les épisodes de blackout laissent des "trous" réels — des événements qui n\'ont pas été encodés en mémoire long terme.',
      },
      {
        heading: 'La récupération cognitive',
        content: 'Après 3 mois, la mémoire à court terme et la concentration s\'améliorent de façon notable. Des IRM fonctionnelles montrent une activité préfrontale augmentée. La vitesse de traitement de l\'information s\'améliore. Ces changements sont souvent ressentis avant d\'être mesurés : moins d\'oublis, meilleure capacité de focus.',
      },
      {
        heading: 'Ce qui ne revient pas forcément',
        content: 'Des années de consommation intensive peuvent laisser des déficits cognitifs durables — notamment dans les fonctions exécutives complexes et la mémoire spatiale. Mais même dans ces cas, une amélioration partielle est documentée. Le cerveau garde une plasticité remarquable.',
      },
    ],
  },
  {
    id: 'digestion',
    icon: '🫃',
    title: 'Le système digestif',
    tags: ['organe', 'santé'],
    summary: 'L\'alcool irrite directement la muqueuse digestive de l\'œsophage à l\'intestin.',
    sections: [
      {
        heading: 'Effets directs sur le tube digestif',
        content: 'L\'alcool irrite la muqueuse de l\'œsophage (risque de reflux, de cancer à long terme), de l\'estomac (gastrite, ulcères), et de l\'intestin (perméabilité intestinale accrue). Il perturbe la flore intestinale (microbiome) qui joue un rôle dans l\'immunité, l\'humeur (axe intestin-cerveau) et la digestion.',
      },
      {
        heading: 'La récupération digestive',
        content: 'La muqueuse gastrique commence à se réparer après 72 heures. Les reflux et douleurs abdominales liées à l\'alcool disparaissent généralement en 1 à 3 semaines. La flore intestinale prend plus de temps à se reconstituer — entre 3 et 6 mois pour une amélioration significative. Les prébiotiques et fibres alimentaires accélèrent ce processus.',
      },
    ],
  },
  {
    id: 'cravings',
    icon: '⚡',
    title: 'Comprendre les envies (cravings)',
    tags: ['psychologie', 'envie', 'neurosciences'],
    summary: 'Les envies sont biologiques, prévisibles et ont une durée de vie limitée. Les comprendre change la façon dont on y répond.',
    sections: [
      {
        heading: 'La durée d\'une envie',
        content: 'Une envie atteint son pic en 5 à 10 minutes, puis commence à diminuer. Elle disparaît quasi-systématiquement en 15 à 20 minutes, même sans agir. Ce n\'est pas de la volonté — c\'est de la biologie. Les personnes qui apprennent à "surfer" l\'envie (l\'observer sans agir) ont de meilleurs résultats à long terme que celles qui utilisent la répression active.',
      },
      {
        heading: 'Les déclencheurs (triggers)',
        content: 'Les envies sont souvent liées à des déclencheurs spécifiques : lieux (bar, supermarché), heures (fin de journée, vendredi soir), émotions (stress, ennui, célébration), personnes. Identifier ses propres déclencheurs permet de les anticiper. Ça ne les fait pas disparaître immédiatement, mais ça change la relation à l\'envie — de subie à attendue.',
      },
      {
        heading: 'La technique des 5 sens',
        content: 'Quand une envie frappe : nomme 5 choses que tu vois, 4 que tu entends, 3 que tu peux toucher, 2 que tu sens, 1 que tu goûtes. Cette technique d\'ancrage sensoriel active le cortex préfrontal et réduit l\'intensité de l\'envie en moins de 2 minutes.',
      },
    ],
  },
  {
    id: 'relapse',
    icon: '🔄',
    title: 'La rechute — ce que disent les données',
    tags: ['rechute', 'processus', 'réalisme'],
    summary: 'La rechute est statistiquement fréquente dans les processus d\'arrêt de l\'alcool. Ce n\'est pas un échec — c\'est une information.',
    sections: [
      {
        heading: 'Les chiffres réels',
        content: 'Entre 40% et 60% des personnes qui arrêtent de boire connaissent au moins une rechute dans la première année. Ce taux est similaire à celui d\'autres maladies chroniques comme le diabète ou l\'hypertension. Les rechutes font partie du processus pour beaucoup de personnes — pas parce que l\'arrêt est impossible, mais parce que les circuits cérébraux liés à la dépendance sont durables.',
      },
      {
        heading: 'Ce que chaque tentative apporte',
        content: 'Les études montrent que chaque tentative sérieuse d\'arrêt augmente la probabilité de succès de la suivante. Les personnes apprennent à identifier leurs déclencheurs, à gérer les périodes difficiles, à reconnaître les signes avant-coureurs. Une rechute après 30 jours n\'efface pas les 30 jours de récupération physique — elle les interrompt.',
      },
      {
        heading: 'Rechute ≠ retour à zéro',
        content: 'Le corps garde une mémoire de la récupération. Après une rechute, les jours de récupération précédents reprennent leur effet dès la reprise de l\'abstinence. Ce qui change, c\'est la trajectoire : chaque période sobre compte, même si elle n\'est pas continue.',
      },
    ],
  },
]
