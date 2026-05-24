const fr = {
  appName: 'Libre',
  appTagline: 'Sans alcool, à ton rythme',

  // Onboarding
  onboarding_welcome_title: 'Bienvenue dans Libre',
  onboarding_welcome_sub: 'Une app sobre, locale, sans compte. Tes données restent sur ton téléphone.',
  onboarding_step1_title: 'Ton dernier verre',
  onboarding_step1_sub: 'Quand as-tu bu de l\'alcool pour la dernière fois ?',
  onboarding_last_drink_date: 'Date du dernier verre',
  onboarding_last_drink_count: 'Nombre de verres ce jour-là',
  onboarding_step2_title: 'Tes habitudes de consommation',
  onboarding_step2_sub: 'Pour calculer tes économies. Pas besoin d\'être exact.',
  onboarding_add_bottle: 'Ajouter une boisson',
  onboarding_bottle_name: 'Type (ex: vin rouge, bière, whisky…)',
  onboarding_bottle_price: 'Prix unitaire (€)',
  onboarding_bottle_qty: 'Quantité par semaine',
  onboarding_per_week: '/ semaine',
  onboarding_remove: 'Retirer',
  onboarding_start: 'Commencer',
  onboarding_next: 'Suivant',
  onboarding_back: 'Retour',

  // Nav
  nav_home: 'Accueil',
  nav_sos: 'SOS',
  nav_milestones: 'Étapes',
  nav_knowledge: 'Savoir',

  // Dashboard
  dash_days_sober: 'jours sobres',
  dash_current_streak: 'Série actuelle',
  dash_best_streak: 'Meilleure série',
  dash_total_sober: 'Total sobre',
  dash_sober_rate: 'Taux de sobriété',
  dash_savings_title: 'Économies',
  dash_savings_total: 'Économisé depuis le début',
  dash_savings_monthly: 'Par mois',
  dash_organs_title: 'Ton corps maintenant',
  dash_history_link: 'Voir l\'historique',
  dash_day: 'jour',
  dash_days: 'jours',
  dash_since: 'depuis le',
  dash_no_data: 'Pas encore de données',

  // SOS
  sos_title: 'Envie de boire ?',
  sos_subtitle: 'Prends 2 minutes. Cette envie va passer.',
  sos_progress_label: 'Ce que tu as construit',
  sos_craving_timer: 'Attends 15 minutes',
  sos_timer_running: 'Reste encore',
  sos_timer_done: 'Tu as tenu 15 minutes.',
  sos_alternatives_title: 'À commander ou acheter à la place',
  sos_resisted_btn: 'J\'ai résisté',
  sos_drank_btn: 'J\'ai quand même bu',
  sos_drank_count: 'Combien de verres ?',
  sos_drank_confirm: 'Enregistrer',
  sos_drank_note: 'Noté. Tes jours précédents restent comptés.',
  sos_message_next: 'Autre argument',

  // Milestones
  milestones_title: 'Tes étapes',
  milestones_subtitle: 'Ce qui se passe dans ton corps à chaque étape.',
  milestones_reached: 'Atteint',
  milestones_in: 'Dans',
  milestones_today: 'Aujourd\'hui',

  // Knowledge
  knowledge_title: 'Base de connaissances',
  knowledge_subtitle: 'Faits médicaux, sans filtre.',
  knowledge_read_more: 'Lire plus',

  // History
  history_title: 'Historique',
  history_sober_day: 'Jour sobre',
  history_drink_day: 'Verre bu',
  history_sos_resisted: 'SOS résisté',
  history_empty: 'Aucun événement enregistré.',

  // Settings
  settings_title: 'Paramètres',
  settings_reset: 'Réinitialiser toutes les données',
  settings_reset_confirm: 'Toutes tes données seront effacées. Continuer ?',
} as const

export default fr
export type TranslationKey = keyof typeof fr
