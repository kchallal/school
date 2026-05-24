export interface SosMessage {
  text: string
  category: 'biologie' | 'redirection' | 'corps' | 'progres' | 'neutre' | 'alternative'
}

export const SOS_MESSAGES: SosMessage[] = [
  // Biologie de l'envie
  {
    text: "Une envie intense dure entre 12 et 20 minutes. Elle atteint son pic — puis redescend, sans exception.",
    category: 'biologie',
  },
  {
    text: "Ce que tu ressens maintenant, c'est ton cerveau qui libère de la dopamine en anticipant. Ce pic redescend seul, même si tu ne cèdes pas.",
    category: 'biologie',
  },
  {
    text: "L'envie d'alcool active les mêmes circuits cérébraux que la faim. Mange quelque chose — tout de suite.",
    category: 'biologie',
  },
  {
    text: "Ton cerveau reconnaît l'environnement où tu buvais habituellement et déclenche une réponse automatique. Ce n'est pas un manque de volonté — c'est un réflexe conditionné, et les réflexes s'effacent.",
    category: 'biologie',
  },
  {
    text: "L'alcool augmente le GABA (effet calmant) et réduit le glutamate (activité). Après plusieurs jours sans alcool, ton cerveau a commencé à rééquilibrer ces systèmes. Un verre les dérègle à nouveau pour 48 à 72 heures.",
    category: 'biologie',
  },
  {
    text: "La sensation d'urgence que tu ressens va passer. Pas parce que tu bois — parce que les envies ont une durée de vie courte. Les neurosciences appellent ça l'extinction du craving.",
    category: 'biologie',
  },
  {
    text: "Quand tu ressens une forte envie, ton cortex préfrontal (prise de décision) est temporairement moins actif. C'est pourquoi ça semble irrésistible. Attends 10 minutes — l'équilibre revient.",
    category: 'biologie',
  },

  // Redirection physique
  {
    text: "Change d'espace physique immédiatement. Sors de là où tu es. L'envie est souvent liée au lieu autant qu'au moment.",
    category: 'redirection',
  },
  {
    text: "Bois un grand verre d'eau froide, rapidement. La sensation de plénitude gastrique réduit l'intensité de l'envie.",
    category: 'redirection',
  },
  {
    text: "Va marcher 5 minutes. Le mouvement physique interrompt le circuit de l'envie plus efficacement que la volonté seule.",
    category: 'redirection',
  },
  {
    text: "Mange quelque chose de substantiel maintenant. Faim et envie d'alcool se confondent souvent — ton cerveau fait la même lecture des deux.",
    category: 'redirection',
  },
  {
    text: "Appelle quelqu'un — n'importe qui, pour n'importe quelle raison. La voix d'un autre humain interrompt le processus de craving.",
    category: 'redirection',
  },
  {
    text: "Achète autre chose avec cet argent. N'importe quoi. Mais rentre d'abord chez toi, commande ensuite.",
    category: 'redirection',
  },
  {
    text: "Retarde d'exactement 15 minutes. Pas 'je ne boirai jamais'. Juste les 15 prochaines minutes. C'est tout.",
    category: 'redirection',
  },

  // Corps et organes
  {
    text: "Ton foie travaille en ce moment à convertir les réserves de graisses accumulées. Un verre interrompt ce processus pendant 48h — ton foie priorise l'alcool sur tout le reste.",
    category: 'corps',
  },
  {
    text: "Ta pression artérielle a baissé depuis que tu as arrêté. L'alcool la remonte en quelques heures, même avec une petite quantité.",
    category: 'corps',
  },
  {
    text: "Ton cerveau produit à nouveau de la mélatonine normalement. L'alcool supprime cette production et détruit la qualité du sommeil — même si tu t'endors plus vite, les phases REM sont bloquées.",
    category: 'corps',
  },
  {
    text: "La muqueuse de ton estomac est en cours de réparation. L'alcool l'irrite directement à chaque passage et ralentit cette réparation.",
    category: 'corps',
  },
  {
    text: "Ton pancréas ne subit plus le stress de réguler les pics de glycémie causés par l'alcool. C'est un organe dont on ne parle pas souvent dans ce contexte — pourtant il est très exposé.",
    category: 'corps',
  },
  {
    text: "Tes reins filtrent plus efficacement. L'alcool est un diurétique qui les surcharge et perturbe l'équilibre électrolytique.",
    category: 'corps',
  },
  {
    text: "Ton système immunitaire produit plus de globules blancs qu'il y a quelques semaines. L'alcool affaiblit directement l'immunité.",
    category: 'corps',
  },

  // Progrès acquis
  {
    text: "Les jours passés ne disparaissent pas si tu bois ce soir. Ton corps garde une mémoire de la récupération — mais chaque jour sobre s'additionne et chaque rechute coûte quelques jours de réparation.",
    category: 'progres',
  },
  {
    text: "Tu as déjà traversé les moments les plus difficiles du sevrage physique. L'envie que tu ressens maintenant est principalement psychologique — réelle, mais différente.",
    category: 'progres',
  },
  {
    text: "Ton corps a fait du travail réel ces derniers jours. Ce travail est là, dans tes organes, que tu t'en souviennes ou non.",
    category: 'progres',
  },
  {
    text: "La durée de ta série actuelle représente autant de jours où ton foie n'a pas eu à traiter d'alcool. C'est concret.",
    category: 'progres',
  },

  // Neutre / sans jugement
  {
    text: "L'information que tu ressens une forte envie est utile. Elle te montre où sont tes déclencheurs — pas une faiblesse, une donnée.",
    category: 'neutre',
  },
  {
    text: "Tu n'as pas à décider d'arrêter pour toujours en ce moment. Tu dois juste passer les 15 prochaines minutes.",
    category: 'neutre',
  },
  {
    text: "Si tu bois ce soir, il n'y a pas de jugement ici. L'app enregistre et continue. Reviens demain.",
    category: 'neutre',
  },
  {
    text: "Ce n'est pas une compétition. Il n'y a pas de spectateur. Tu fais ça pour toi, à ton rythme.",
    category: 'neutre',
  },
  {
    text: "Résister une fois ne garantit rien. Boire une fois ne signifie pas non plus que tout est perdu. C'est un processus, pas un test.",
    category: 'neutre',
  },
  {
    text: "Certaines personnes rechutent plusieurs fois avant d'atteindre une sobriété durable. Les données montrent que chaque tentative augmente les chances de la suivante.",
    category: 'neutre',
  },

  // Alternatives concrètes
  {
    text: "Commande une eau pétillante très froide avec du citron vert et des glaçons. La sensation en bouche est comparable. Le reste est différent.",
    category: 'alternative',
  },
  {
    text: "Demande au bar un mocktail : limonade maison, jus de pamplemousse avec du sel et du sirop, ou ginger beer. Ça existe, ça se demande.",
    category: 'alternative',
  },
  {
    text: "Une bière sans alcool très froide. Elle permet le rituel social et la sensation de fraîcheur sans les effets. Pas idéal pour tout le monde, mais une option.",
    category: 'alternative',
  },
  {
    text: "Un thé glacé non sucré, très fort. La légère amertume et la fraîcheur compensent une partie du manque sensoriel.",
    category: 'alternative',
  },
  {
    text: "Rentre chez toi d'abord. Prends une douche froide ou tiède. Mange quelque chose. Dans 30 minutes, l'intensité de l'envie aura changé.",
    category: 'alternative',
  },
]

export const DRINK_ALTERNATIVES = [
  'Eau gazeuse + citron vert + glaçons',
  'Ginger beer (non alcoolisée)',
  'Jus de pamplemousse + sel',
  'Thé glacé très fort, non sucré',
  'Bière sans alcool bien froide',
  'Limonade maison',
  'Eau chaude + citron + gingembre',
  'Kombucha nature',
  'Eau tonique nature',
  'Jus de tomate + épices (virgin bloody mary)',
]

export function getRandomMessages(count: number): SosMessage[] {
  const shuffled = [...SOS_MESSAGES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getNextMessage(currentIndex: number): SosMessage {
  return SOS_MESSAGES[currentIndex % SOS_MESSAGES.length]
}

export function getRandomAlternatives(count: number): string[] {
  const shuffled = [...DRINK_ALTERNATIVES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
