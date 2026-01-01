export default {
  // Navigation
  tabs: {
    cards: 'Cards',
    add: 'Add Card',
    settings: 'Settings',
  },

  // Cards Screen
  cards: {
    title: 'My Cards',
    cardCount: '{{count}} card',
    cardCount_plural: '{{count}} cards',
    emptyTitle: 'No Cards Yet',
    emptyDescription:
      'Add your first loyalty card to get started. Scan a barcode or enter details manually.',
    addFirstCard: 'Add Your First Card',
  },

  // Scan Screen
  scan: {
    title: 'Scan Barcode',
    requestingPermission: 'Requesting camera permission...',
    permissionTitle: 'Camera Access Required',
    permissionDescription:
      'CardHoldr needs camera access to scan barcodes on your loyalty cards.',
    allowCamera: 'Allow Camera Access',
    enterManually: 'Enter Manually',
    enterManuallyInstead: 'Enter Manually Instead',
    scanHint: 'Align the barcode within the frame',
    barcodeDetected: 'Barcode Detected!',
  },

  // Add/Edit Card Screen
  cardForm: {
    addTitle: 'Add Card',
    editTitle: 'Edit Card',
    save: 'Save',
    storeName: 'Store Name',
    storeNamePlaceholder: 'e.g., Starbucks, Target, CVS',
    storeNameRequired: 'Store name is required',
    cardNumber: 'Card Number',
    cardNumberPlaceholder: 'Enter or scan the barcode number',
    cardNumberPlaceholderEdit: 'Enter the barcode number',
    cardNumberRequired: 'Card number is required',
    barcodeType: 'Barcode Type',
    cardColor: 'Card Color',
    notes: 'Notes (Optional)',
    notesPlaceholder: 'Any additional info about this card',
    preview: 'Preview',
    defaultStoreName: 'Store Name',
    defaultCardNumber: '0000 0000 0000',
  },

  // Card Detail Screen
  cardDetail: {
    loading: 'Loading...',
    deleteTitle: 'Delete Card',
    deleteMessage: 'Are you sure you want to delete "{{name}}"?',
    cancel: 'Cancel',
    delete: 'Delete',
    cardNumber: 'Card Number',
    notes: 'Notes',
    editCard: 'Edit Card',
  },

  // Settings Screen
  settings: {
    title: 'Settings',
    general: 'GENERAL',
    notifications: 'Notifications',
    hapticFeedback: 'Haptic Feedback',
    enabled: 'Enabled',
    language: 'Language',
    data: 'DATA',
    backupSync: 'Backup & Sync',
    exportCards: 'Export Cards',
    importCards: 'Import Cards',
    resetAllData: 'Reset All Data',
    about: 'ABOUT',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    contactSupport: 'Contact Support',
    comingSoon: 'Coming soon',
    version: 'CardHoldr v1.0.0',
    madeWith: 'Made with ♥ for your privacy',
    resetTitle: 'Reset All Data',
    resetMessage: 'This will delete all your saved cards. This action cannot be undone.',
    reset: 'Reset',
    done: 'Done',
    resetSuccess: 'All data has been reset.',
  },

  // Languages
  languages: {
    en: 'English',
    ro: 'Română',
    system: 'System Default',
  },
};

