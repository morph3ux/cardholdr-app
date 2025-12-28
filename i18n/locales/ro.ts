export default {
  // Navigation
  tabs: {
    cards: 'Carduri',
    scan: 'Scanare',
    settings: 'Setări',
  },

  // Cards Screen
  cards: {
    title: 'Cardurile Mele',
    cardCount: '{{count}} card',
    cardCount_plural: '{{count}} carduri',
    emptyTitle: 'Niciun Card',
    emptyDescription:
      'Adaugă primul tău card de fidelitate. Scanează un cod de bare sau introdu manual detaliile.',
    addFirstCard: 'Adaugă Primul Card',
  },

  // Scan Screen
  scan: {
    title: 'Scanare Cod de Bare',
    requestingPermission: 'Se solicită permisiunea camerei...',
    permissionTitle: 'Acces la Cameră Necesar',
    permissionDescription:
      'CardHoldr are nevoie de acces la cameră pentru a scana codurile de bare de pe cardurile tale.',
    allowCamera: 'Permite Acces la Cameră',
    enterManually: 'Introdu Manual',
    enterManuallyInstead: 'Introdu Manual',
    scanHint: 'Aliniază codul de bare în cadru',
    barcodeDetected: 'Cod de Bare Detectat!',
  },

  // Add/Edit Card Screen
  cardForm: {
    addTitle: 'Adaugă Card',
    editTitle: 'Editare Card',
    save: 'Salvează',
    storeName: 'Numele Magazinului',
    storeNamePlaceholder: 'ex. Kaufland, Lidl, Mega Image',
    storeNameRequired: 'Numele magazinului este obligatoriu',
    cardNumber: 'Numărul Cardului',
    cardNumberPlaceholder: 'Introdu sau scanează numărul codului de bare',
    cardNumberPlaceholderEdit: 'Introdu numărul codului de bare',
    cardNumberRequired: 'Numărul cardului este obligatoriu',
    barcodeType: 'Tipul Codului de Bare',
    cardColor: 'Culoarea Cardului',
    notes: 'Note (Opțional)',
    notesPlaceholder: 'Informații suplimentare despre acest card',
    preview: 'Previzualizare',
    defaultStoreName: 'Numele Magazinului',
    defaultCardNumber: '0000 0000 0000',
  },

  // Card Detail Screen
  cardDetail: {
    loading: 'Se încarcă...',
    deleteTitle: 'Șterge Card',
    deleteMessage: 'Ești sigur că vrei să ștergi "{{name}}"?',
    cancel: 'Anulează',
    delete: 'Șterge',
    cardNumber: 'Numărul Cardului',
    notes: 'Note',
    editCard: 'Editează Card',
  },

  // Settings Screen
  settings: {
    title: 'Setări',
    general: 'GENERAL',
    notifications: 'Notificări',
    hapticFeedback: 'Feedback Haptic',
    enabled: 'Activat',
    language: 'Limbă',
    data: 'DATE',
    backupSync: 'Backup și Sincronizare',
    exportCards: 'Exportă Carduri',
    importCards: 'Importă Carduri',
    resetAllData: 'Resetează Toate Datele',
    about: 'DESPRE',
    privacyPolicy: 'Politica de Confidențialitate',
    termsOfService: 'Termeni și Condiții',
    contactSupport: 'Contactează Suport',
    comingSoon: 'În curând',
    version: 'CardHoldr v1.0.0',
    madeWith: 'Făcut cu ♥ pentru confidențialitatea ta',
    resetTitle: 'Resetează Toate Datele',
    resetMessage: 'Aceasta va șterge toate cardurile salvate. Această acțiune nu poate fi anulată.',
    reset: 'Resetează',
    done: 'Gata',
    resetSuccess: 'Toate datele au fost resetate.',
  },

  // Languages
  languages: {
    en: 'English',
    ro: 'Română',
    system: 'Limba Sistemului',
  },
};

