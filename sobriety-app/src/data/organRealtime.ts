export type TimeSlot = 'nuit' | 'matin' | 'midi' | 'apres-midi' | 'soiree'

export function getTimeSlot(): TimeSlot {
  const h = new Date().getHours()
  if (h >= 23 || h < 6) return 'nuit'
  if (h >= 6 && h < 11) return 'matin'
  if (h >= 11 && h < 14) return 'midi'
  if (h >= 14 && h < 18) return 'apres-midi'
  return 'soiree'
}

export function getTimeLabel(slot: TimeSlot): string {
  const map: Record<TimeSlot, string> = {
    nuit: 'Cette nuit',
    matin: 'Ce matin',
    midi: 'En ce moment',
    'apres-midi': 'Cet après-midi',
    soiree: 'Ce soir',
  }
  return map[slot]
}

export interface OrganActivity {
  organ: string
  icon: string
  activity: string
  contrast: string
}

export const ORGAN_ACTIVITIES: Record<TimeSlot, OrganActivity[]> = {
  nuit: [
    {
      organ: 'Foie',
      icon: '🫁',
      activity: 'Phase de régénération cellulaire maximale. Tes hépatocytes se répliquent et réparent les dommages accumulés dans la journée. L\'autophagie — nettoyage des protéines endommagées — est à son pic absolu.',
      contrast: 'Avec de l\'alcool : la régénération serait bloquée, le foie traiterait l\'éthanol en priorité toute la nuit.',
    },
    {
      organ: 'Cerveau',
      icon: '🧠',
      activity: 'Le système glymphatique active un nettoyage des déchets métaboliques accumulés dans la journée — dont les protéines associées à la maladie d\'Alzheimer. Ce processus est 10 fois plus actif pendant le sommeil.',
      contrast: 'L\'alcool supprime les phases REM et réduit drastiquement ce nettoyage cérébral nocturne.',
    },
    {
      organ: 'Hormones',
      icon: '⚗️',
      activity: 'Pic de production d\'hormone de croissance (GH), qui orchestre la réparation des tissus dans tout le corps. La mélatonine est à son niveau le plus haut de la nuit.',
      contrast: 'L\'alcool réduit la production de GH de 70 à 80% pendant la nuit — le corps répare moins, même si tu dors.',
    },
    {
      organ: 'Système immunitaire',
      icon: '🛡️',
      activity: 'Pic de prolifération des lymphocytes T et de production de cytokines. C\'est la fenêtre de consolidation de ta mémoire immunitaire — ton corps mémorise les menaces rencontrées.',
      contrast: 'L\'alcool supprime directement ce processus, d\'où une récupération plus lente de toute maladie.',
    },
    {
      organ: 'Peau',
      icon: '✨',
      activity: 'La réparation cutanée nocturne est à son pic entre 23h et 3h : cellules en division active, production de collagène, réparation des dommages accumulés dans la journée.',
      contrast: 'L\'alcool déshydrate les cellules cutanées et réduit la production de collagène même pendant le sommeil.',
    },
  ],

  matin: [
    {
      organ: 'Foie',
      icon: '🫁',
      activity: 'Libère du glucose dans le sang pour alimenter le cerveau au réveil — c\'est la glycogénolyse matinale. Il prépare aussi les acides biliaires pour digérer les graisses du petit-déjeuner.',
      contrast: 'Un foie endommagé par l\'alcool libère trop peu de glucose au réveil — d\'où les hypoglycémies et tremblements matinaux des gros buveurs.',
    },
    {
      organ: 'Cerveau',
      icon: '🧠',
      activity: 'Pic de cortisol matinal (6h–9h) : éveille le cortex préfrontal, améliore la prise de décision et la mémoire de travail. Les souvenirs consolidés cette nuit sont maintenant accessibles.',
      contrast: 'L\'alcool perturbe ce pic de cortisol et fragmente la consolidation mémorielle nocturne — les apprentissages de la veille sont partiellement perdus.',
    },
    {
      organ: 'Coeur',
      icon: '❤️',
      activity: 'Pression artérielle augmente progressivement de façon normale et saine. Chez les personnes sobres, ce profil matinal est beaucoup plus régulier et moins brutal.',
      contrast: 'La gueule de bois élève la pression artérielle matinale de façon marquée — c\'est l\'une des heures les plus à risque cardiovasculaire pour les gros consommateurs.',
    },
    {
      organ: 'Intestins',
      icon: '🫃',
      activity: 'Forte activité péristaltique — les contractions intestinales sont plus intenses le matin, stimulées par le cortisol. Le microbiome, en train de se reconstruire, commence sa journée.',
      contrast: 'L\'alcool irrite directement la muqueuse intestinale et perturbe le microbiome, causant les troubles digestifs matinaux fréquents des buveurs réguliers.',
    },
  ],

  midi: [
    {
      organ: 'Foie',
      icon: '🫁',
      activity: 'Pic d\'activité enzymatique : métabolisation des nutriments du repas, synthèse de protéines plasmatiques — albumine, facteurs de coagulation. Sans alcool, toute cette capacité est dédiée à la nutrition.',
      contrast: 'Un verre à midi force le foie à tout abandonner pour traiter l\'éthanol en priorité — la digestion est mise en pause.',
    },
    {
      organ: 'Cerveau',
      icon: '🧠',
      activity: 'Fenêtre de performance cognitive maximale. Dopamine et noradrénaline à leur pic de la journée. Mémoire à court terme, concentration et prise de décision sont au meilleur de leur forme.',
      contrast: 'Même une faible dose d\'alcool réduit mesurément la vitesse de traitement cognitif — les effets persistent plusieurs heures après.',
    },
    {
      organ: 'Pancréas',
      icon: '🫀',
      activity: 'Produit de l\'insuline pour traiter les glucides du repas. Sans alcool chronique, la sensibilité à l\'insuline est améliorée — ta glycémie est plus stable et plus prévisible.',
      contrast: 'L\'alcool perturbe la régulation glycémique et surcharge le pancréas — c\'est un facteur de risque direct de diabète de type 2.',
    },
    {
      organ: 'Système digestif',
      icon: '🫃',
      activity: 'Sécrétion maximale d\'acide gastrique et d\'enzymes digestives. La muqueuse gastrique, en cours de réparation depuis que tu as arrêté de boire, travaille sans obstacle chimique.',
      contrast: 'L\'alcool augmente directement l\'acidité gastrique et érode la muqueuse à chaque passage — c\'est la cause des gastrites.',
    },
  ],

  'apres-midi': [
    {
      organ: 'Foie',
      icon: '🫁',
      activity: 'Gestion active des réserves lipidiques : sans alcool, il peut convertir les graisses stockées en énergie plutôt que les accumuler. C\'est une des raisons de la perte de poids progressive.',
      contrast: 'L\'alcool perturbe la lipogenèse et favorise l\'accumulation de graisse hépatique — la stéatose.',
    },
    {
      organ: 'Muscles',
      icon: '💪',
      activity: 'Performance musculaire à son pic (14h–16h). La synthèse protéique musculaire — réparation et construction — fonctionne à plein régime sans l\'inhibition de l\'alcool.',
      contrast: 'L\'alcool inhibe la synthèse protéique musculaire de 15 à 20%, même après une session de sport.',
    },
    {
      organ: 'Reins',
      icon: '💧',
      activity: 'Filtration maximale du sang. Sans alcool, l\'équilibre électrolytique (sodium, potassium, magnésium) est stable — les reins n\'ont pas à compenser une déshydratation chronique.',
      contrast: 'L\'alcool est un diurétique puissant : il force les reins à éliminer plus d\'eau qu\'absorbée — d\'où les carences en électrolytes.',
    },
    {
      organ: 'Cerveau',
      icon: '🧠',
      activity: 'Légère baisse d\'alerte naturelle (14h–15h). Chez les non-consommateurs, elle est moins prononcée et se corrige rapidement — pas besoin de stimulant artificiel.',
      contrast: 'La somnolence post-alcool de l\'après-midi est plus intense, dure plus longtemps, et laisse un état "brumeux" persistant.',
    },
  ],

  soiree: [
    {
      organ: 'Foie',
      icon: '🫁',
      activity: 'Prépare les stocks de glycogène pour la nuit. C\'est la période où il serait le plus sollicité par l\'alcool si tu buvais — et où il se repose ce soir, entamant sa réparation nocturne.',
      contrast: 'C\'est l\'heure où la majorité de l\'alcool consommé arrive au foie. L\'acétaldéhyde — toxique — est produit ici et perturbe la nuit entière.',
    },
    {
      organ: 'Cerveau',
      icon: '🧠',
      activity: 'La mélatonine commence à monter. Sans alcool, ce signal naturel prépare un endormissement de qualité avec des cycles REM complets et une vraie récupération cérébrale.',
      contrast: 'L\'alcool bloque la mélatonine et supprime les phases REM — même s\'il accélère l\'endormissement, le sommeil n\'est pas récupérateur.',
    },
    {
      organ: 'Peau',
      icon: '✨',
      activity: 'Les cellules épidermiques entrent en phase de division active. La production de collagène démarre pour la nuit. Ta peau commence à se renouveler.',
      contrast: 'L\'alcool déshydrate les cellules cutanées et réduit la production de collagène — le teint "alcoolisé" du matin vient de là.',
    },
    {
      organ: 'Système nerveux',
      icon: '⚡',
      activity: 'Le système nerveux parasympathique prend le relais (mode récupération). Rythme cardiaque et pression artérielle descendent progressivement vers leurs niveaux nocturnes.',
      contrast: 'L\'alcool perturbe ce basculement vers le mode récupération — le corps reste en état de stress physiologique malgré la sensation de détente.',
    },
  ],
}
