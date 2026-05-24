export interface Milestone {
  id: string
  days: number
  label: string
  organs: OrganEffect[]
  summary: string
}

export interface OrganEffect {
  organ: string
  icon: string
  effect: string
}

export const MILESTONES: Milestone[] = [
  {
    id: '6h',
    days: 0.25,
    label: '6 heures',
    summary: 'L\'alcool quitte progressivement le sang.',
    organs: [
      { organ: 'Foie', icon: '🫁', effect: 'Commence à métaboliser les dernières molécules d\'éthanol.' },
      { organ: 'Coeur', icon: '❤️', effect: 'Fréquence cardiaque commence à se normaliser.' },
    ],
  },
  {
    id: '24h',
    days: 1,
    label: '24 heures',
    summary: 'Le pic de sevrage physique commence. Ton corps s\'ajuste.',
    organs: [
      { organ: 'Foie', icon: '🫁', effect: 'L\'acétaldéhyde (métabolite toxique) est en cours d\'élimination.' },
      { organ: 'Cerveau', icon: '🧠', effect: 'Les récepteurs GABA commencent à se recalibrer après la suppression artificielle.' },
      { organ: 'Sang', icon: '💉', effect: 'Glycémie se stabilise, fin des pics et chutes liés à l\'alcool.' },
    ],
  },
  {
    id: '48h',
    days: 2,
    label: '48 heures',
    summary: 'Fenêtre critique du sevrage. Les symptômes physiques sont à leur maximum.',
    organs: [
      { organ: 'Cerveau', icon: '🧠', effect: 'Pic d\'hyperexcitabilité neurologique (récepteurs GABA/glutamate en déséquilibre). Si tu ressens des tremblements importants, consulte un médecin.' },
      { organ: 'Corps', icon: '💧', effect: 'Réhydratation active — boire beaucoup d\'eau aide réellement.' },
    ],
  },
  {
    id: '72h',
    days: 3,
    label: '72 heures',
    summary: 'Le plus dur du sevrage physique est derrière toi pour la plupart des gens.',
    organs: [
      { organ: 'Cerveau', icon: '🧠', effect: 'Les symptômes physiques du sevrage atteignent leur pic puis commencent à diminuer.' },
      { organ: 'Foie', icon: '🫁', effect: 'Début du processus de dégraissage hépatique.' },
      { organ: 'Estomac', icon: '🫃', effect: 'La muqueuse gastrique entre en phase de réparation.' },
    ],
  },
  {
    id: '1w',
    days: 7,
    label: '1 semaine',
    summary: 'Premières améliorations visibles et mesurables.',
    organs: [
      { organ: 'Sommeil', icon: '😴', effect: 'Les cycles REM commencent à se reconstruire. Le sommeil reste agité mais s\'améliore.' },
      { organ: 'Peau', icon: '✨', effect: 'Premier gain d\'hydratation cutanée visible. L\'alcool est un puissant déshydratant.' },
      { organ: 'Cerveau', icon: '🧠', effect: 'La neuro-inflammation commence à diminuer. Légère amélioration de la concentration.' },
    ],
  },
  {
    id: '2w',
    days: 14,
    label: '2 semaines',
    summary: 'Le système cardiovasculaire commence à enregistrer des changements réels.',
    organs: [
      { organ: 'Coeur', icon: '❤️', effect: 'Baisse significative de la pression artérielle. Mesurable chez la plupart des gens.' },
      { organ: 'Foie', icon: '🫁', effect: 'Réduction mesurable de l\'inflammation hépatique (enzymes ALT/AST en baisse).' },
      { organ: 'Système immunitaire', icon: '🛡️', effect: 'Augmentation de l\'activité des globules blancs.' },
    ],
  },
  {
    id: '1m',
    days: 30,
    label: '1 mois',
    summary: 'Un mois. Changements substantiels dans tous les systèmes.',
    organs: [
      { organ: 'Foie', icon: '🫁', effect: 'Réduction de 15 à 20% du tissu adipeux hépatique (stéatose). Visible à l\'échographie.' },
      { organ: 'Peau', icon: '✨', effect: 'Amélioration nette du teint, de l\'éclat et de l\'hydratation. Réduction des rougeurs.' },
      { organ: 'Sommeil', icon: '😴', effect: 'Architecture du sommeil significativement améliorée. Rêves plus intenses au début (rebond REM).' },
      { organ: 'Poids', icon: '⚖️', effect: 'Perte de poids souvent visible — l\'alcool représente 7 kcal/g, sans valeur nutritive.' },
    ],
  },
  {
    id: '3m',
    days: 90,
    label: '3 mois',
    summary: 'Récupération profonde en cours.',
    organs: [
      { organ: 'Foie', icon: '🫁', effect: 'Enzymes hépatiques (ALT, AST) proches ou revenues à la normale dans la majorité des cas.' },
      { organ: 'Cerveau', icon: '🧠', effect: 'Mémoire à court terme et concentration significativement améliorées. Volume de matière grise en augmentation.' },
      { organ: 'Coeur', icon: '❤️', effect: 'Risque de fibrillation auriculaire nettement réduit. Tension artérielle stabilisée.' },
      { organ: 'Système digestif', icon: '🫃', effect: 'Muqueuse gastrique réparée. Réduction des reflux et douleurs abdominales.' },
    ],
  },
  {
    id: '6m',
    days: 180,
    label: '6 mois',
    summary: 'La récupération atteint les niveaux cellulaires.',
    organs: [
      { organ: 'Foie', icon: '🫁', effect: 'Si fibrose légère préexistante, des signes de réversion sont possibles. Le foie a une capacité de régénération remarquable.' },
      { organ: 'Cerveau', icon: '🧠', effect: 'Volume de matière grise en augmentation mesurable par IRM. Connexions synaptiques renforcées.' },
      { organ: 'Système immunitaire', icon: '🛡️', effect: 'Immunité considérablement renforcée. Moins de maladies, récupération plus rapide.' },
      { organ: 'Sang', icon: '💉', effect: 'Réduction du risque de diabète de type 2 liée à l\'amélioration de la sensibilité à l\'insuline.' },
    ],
  },
  {
    id: '1y',
    days: 365,
    label: '1 an',
    summary: 'Un an. Les risques à long terme commencent à diminuer significativement.',
    organs: [
      { organ: 'Foie', icon: '🫁', effect: 'Sans cirrhose préexistante, retour à la normale dans de nombreux cas documentés.' },
      { organ: 'Cerveau', icon: '🧠', effect: 'Connexions neuronales et volumes cérébraux significativement améliorés. Réduction durable du risque de démence.' },
      { organ: 'Cancer', icon: '🔬', effect: 'Risque de cancer du foie -15%, gorge/œsophage -25%, côlon -10% par rapport à une consommation régulière continuée.' },
      { organ: 'Coeur', icon: '❤️', effect: 'Risque d\'AVC ischémique et d\'infarctus réduit. Profil lipidique amélioré.' },
    ],
  },
]
