import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User,
  BankAccount,
  Transaction,
  AppNotification,
  DeviceSession,
  ScreenId,
  BottomTab,
  UserRole,
  MerchantInfo,
  MerchantCollection,
  PaymentAcceptanceMethod,
  CashierInfo,
  MerchantSettlement,
} from '../types';
import { authService } from '../services/authService';
import { bankService } from '../services/bankService';
import { transactionService } from '../services/transactionService';
import { notificationService } from '../services/notificationService';

import { translateText, formatSaudiCurrency, type SupportedLanguage } from '../utils/i18n';
import { syncCollectionToSupabase, subscribeToMerchantCollections } from '../services/supabaseClient';

interface AppContextType {
  // Localization & Translation
  language: string;
  isRtl: boolean;
  t: (key: string, defaultText?: string) => string;

  // Navigation & Screen Stack
  currentScreen: ScreenId;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  navigateTo: (screen: ScreenId, params?: Record<string, any>) => void;
  goBack: () => void;
  screenParams: Record<string, any>;
  activeTab: BottomTab;
  setActiveTab: (tab: BottomTab) => void;
  startOnboardingFlow: () => void;

  // App Data State
  user: User;
  bankAccounts: BankAccount[];
  transactions: Transaction[];
  notifications: AppNotification[];
  deviceSessions: DeviceSession[];
  lastTransaction: Transaction | null;

  // Actions
  updateUser: (updatedData: Partial<User>) => void;
  toggleShowBalance: (bankId: string) => void;
  addBankAccount: (bankName: string) => Promise<void>;
  removeBankAccount: (bankId: string) => void;
  setPrimaryBank: (bankId: string) => void;
  completePayment: (params: {
    title: string;
    subTitle: string;
    amount: number;
    avatarInitials?: string;
    category?: string;
    bankId?: string;
  }) => Promise<Transaction>;

  // Modals & Bottom Sheets
  isPinModalOpen: boolean;
  openPinModal: (paymentData: { title: string; amount: number; subTitle: string; onSuccess?: () => void }) => void;
  closePinModal: () => void;
  pendingPaymentData: { title: string; amount: number; subTitle: string; onSuccess?: () => void } | null;

  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  setAppLanguage: (lang: string) => void;
  toggleLanguage: () => void;

  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (open: boolean) => void;
  performLogout: () => void;

  isAddBankModalOpen: boolean;
  setIsAddBankModalOpen: (open: boolean) => void;

  isScanModalOpen: boolean;
  setIsScanModalOpen: (open: boolean) => void;

  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: (open: boolean) => void;

  // Merchant Ecosystem State & Actions
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  merchantInfo: MerchantInfo;
  updateMerchantInfo: (info: Partial<MerchantInfo>) => void;
  merchantCollections: MerchantCollection[];
  merchantSettlements: MerchantSettlement[];
  triggerSettleNow: () => Promise<MerchantSettlement>;
  lastMerchantCollection: MerchantCollection | null;
  processMerchantCollection: (params: {
    amount: number;
    paymentMethod: PaymentAcceptanceMethod;
    cardLast4?: string;
    orderRef?: string;
    customerMasked?: string;
  }) => Promise<MerchantCollection>;
  processMerchantRefund: (collectionId: string, pin: string) => Promise<boolean>;
  cashiers: CashierInfo[];
  addCashier: (cashier: Omit<CashierInfo, 'id'>) => void;
  toggleCashierStatus: (cashierId: string) => void;
  softPosAmount: number;
  setSoftPosAmount: (amt: number) => void;
  softPosCardScheme: string;
  setSoftPosCardScheme: (scheme: string) => void;
  isKycModalOpen: boolean;
  setIsKycModalOpen: (open: boolean) => void;
  soundBoxLanguage: 'ar' | 'en';
  setSoundBoxLanguage: (lang: 'ar' | 'en') => void;
  soundBoxVolume: number;
  setSoundBoxVolume: (vol: number) => void;
  speakSoundBox: (amount: number, forceLang?: 'ar' | 'en') => void;

  terminateSession: (sessionId: string) => void;

  // Manager PIN & OTP Security Controls
  activeOtp: string;
  setActiveOtp: (otp: string) => void;
  verifyOtp: (enteredOtp: string) => boolean;
  verifyMerchantPin: (pin: string) => boolean;
  isManagerPinModalOpen: boolean;
  managerPinModalData: { title: string; subtitle?: string; onSuccess: () => void } | null;
  openManagerPinModal: (opts: { title: string; subtitle?: string; onSuccess: () => void }) => void;
  closeManagerPinModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


const INITIAL_SESSIONS: DeviceSession[] = [
  { id: 's-1', deviceName: 'QTPay Android App', deviceType: 'mobile', location: 'Riyadh - Android 14', lastActive: 'Active Now', isCurrent: true },
  { id: 's-2', deviceName: 'QTPay iOS App', deviceType: 'mobile', location: 'Jeddah - iPhone 15 Pro', lastActive: '2 days ago', isCurrent: false },
  { id: 's-3', deviceName: 'Chrome on Mac', deviceType: 'browser', location: 'Riyadh - macOS Sequoia', lastActive: 'Active Now', isCurrent: false },
  { id: 's-4', deviceName: 'Safari on iPhone', deviceType: 'browser', location: 'Dammam - iOS 18', lastActive: '3 days ago', isCurrent: false },
];

const INITIAL_MERCHANT_INFO: MerchantInfo = {
  businessName: 'Starmart Supermarket',
  category: 'Grocery & Daily Essentials',
  city: 'Riyadh',
  postalCode: '12211',
  crNumber: 'CR-1010849201',
  vatNumber: '310948201900003',
  nationalId: '1098472910',
  isKycVerified: true,
  settlementBank: 'Al Rajhi Bank',
  settlementIban: 'SA03 8000 0000 6271 5005',
  merchantPin: '',
  terminalId: 'POS-RUH-8841',
  storePhone: '+966 11 482 9900',
};

const INITIAL_MERCHANT_COLLECTIONS: MerchantCollection[] = [
  {
    id: 'POS-8839201',
    orderRef: 'ORD-9841',
    amount: 145.0,
    vatAmount: 18.91,
    netAmount: 126.09,
    paymentMethod: 'softpos_mada',
    cardLast4: '4821',
    customerMasked: '+966 50 ••• 1234',
    date: 'Today, 11:42 AM',
    timestamp: new Date(),
    status: 'settled',
    zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTU=',
  },
  {
    id: 'POS-8839202',
    orderRef: 'ORD-9842',
    amount: 67.5,
    vatAmount: 8.8,
    netAmount: 58.7,
    paymentMethod: 'softpos_applepay',
    cardLast4: '1092',
    customerMasked: '+966 55 ••• 8765',
    date: 'Today, 10:15 AM',
    timestamp: new Date(Date.now() - 3600000),
    status: 'refunded',
    zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTU=',
  },
  {
    id: 'POS-8839203',
    orderRef: 'INV-4019',
    amount: 450.0,
    vatAmount: 58.7,
    netAmount: 391.3,
    paymentMethod: 'zatca_qr',
    customerMasked: 'Tariq Al-Otaibi',
    date: 'Today, 09:30 AM',
    timestamp: new Date(Date.now() - 7200000),
    status: 'settled',
    zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTU=',
  },
  {
    id: 'POS-8839204',
    orderRef: 'LNK-2041',
    amount: 1200.0,
    vatAmount: 156.52,
    netAmount: 1043.48,
    paymentMethod: 'payment_link',
    customerMasked: 'Sara Al-Mansoor',
    date: 'Yesterday, 04:15 PM',
    timestamp: new Date(Date.now() - 86400000),
    status: 'refunded',
    zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTU=',
  },
  {
    id: 'CSH-1049201',
    orderRef: 'REG-01',
    amount: 80.0,
    vatAmount: 10.43,
    netAmount: 69.57,
    paymentMethod: 'cash',
    customerMasked: 'Cash Sale • Register 1',
    date: 'Yesterday, 08:30 PM',
    timestamp: new Date(Date.now() - 100000000),
    status: 'settled',
    zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTU=',
  },
];

const INITIAL_MERCHANT_SETTLEMENTS: MerchantSettlement[] = [
  {
    id: 'STL-908124',
    settlementRef: 'SETTLE-2026-0916-01',
    utr: 'SARIE88290184201',
    amount: 1862.50,
    vatAmount: 242.93,
    date: 'Today, 06:00 AM',
    timestamp: new Date(),
    status: 'settled',
    bankName: 'Al Rajhi Bank',
    ibanMasked: 'SA03 8000 •••• 5005',
    method: 'auto_settle',
  },
  {
    id: 'STL-908123',
    settlementRef: 'SETTLE-2026-0915-02',
    utr: 'SARIE88290183994',
    amount: 3450.00,
    vatAmount: 450.00,
    date: 'Yesterday, 06:00 AM',
    timestamp: new Date(Date.now() - 86400000),
    status: 'settled',
    bankName: 'Al Rajhi Bank',
    ibanMasked: 'SA03 8000 •••• 5005',
    method: 'auto_settle',
  },
  {
    id: 'STL-908122',
    settlementRef: 'SETTLE-2026-0914-01',
    utr: 'SARIE88290181120',
    amount: 5120.75,
    vatAmount: 667.92,
    date: '14 Sep 2026, 08:30 PM',
    timestamp: new Date(Date.now() - 172800000),
    status: 'settled',
    bankName: 'Al Rajhi Bank',
    ibanMasked: 'SA03 8000 •••• 5005',
    method: 'instant_settlenow',
  },
  {
    id: 'STL-908121',
    settlementRef: 'SETTLE-2026-0913-01',
    utr: 'SARIE88290179921',
    amount: 4210.00,
    vatAmount: 549.13,
    date: '13 Sep 2026, 06:00 AM',
    timestamp: new Date(Date.now() - 259200000),
    status: 'settled',
    bankName: 'Al Rajhi Bank',
    ibanMasked: 'SA03 8000 •••• 5005',
    method: 'auto_settle',
  },
];

const INITIAL_CASHIERS: CashierInfo[] = [
  { id: 'csh-1', name: 'Khalid Mansour', role: 'Supervisor', pin: '1122', active: true, terminal: 'Terminal 01 (Main POS)' },
  { id: 'csh-2', name: 'Yasmin Al-Harbi', role: 'Cashier', pin: '3344', active: true, terminal: 'Terminal 02 (Express Checkout)' },
  { id: 'csh-3', name: 'Sultan Al-Ghamdi', role: 'Cashier', pin: '5566', active: false, terminal: 'Terminal 03 (Drive Thru)' },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramScreen = urlParams.get('screen') as ScreenId | null;
      if (paramScreen && (paramScreen === 'MOBILE_NUMBER' || paramScreen === 'SMS_OTP' || paramScreen === 'MERCHANT_REGISTER')) {
        return false;
      }
      const explicitlyLoggedOut = localStorage.getItem('qpay_merchant_explicit_logout') === 'true';
      if (explicitlyLoggedOut) {
        return false;
      }
      return true;
    }
    return true;
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramScreen = urlParams.get('screen') as ScreenId | null;
      if (paramScreen) return paramScreen;

      const explicitlyLoggedOut = localStorage.getItem('qpay_merchant_explicit_logout') === 'true';
      if (explicitlyLoggedOut) return 'MOBILE_NUMBER';

      return 'MERCHANT_HOME';
    }
    return 'MERCHANT_HOME';
  });

  const [screenStack, setScreenStack] = useState<{ screen: ScreenId; params?: Record<string, any> }[]>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramScreen = urlParams.get('screen') as ScreenId | null;
      if (paramScreen) return [{ screen: paramScreen }];

      const explicitlyLoggedOut = localStorage.getItem('qpay_merchant_explicit_logout') === 'true';
      if (explicitlyLoggedOut) return [{ screen: 'MOBILE_NUMBER' }];
    }
    return [{ screen: 'MERCHANT_HOME' }];
  });
  const [screenParams, setScreenParams] = useState<Record<string, any>>({});
  const [activeTab, setActiveTabState] = useState<BottomTab>('home');

  const [userRole, setUserRole] = useState<UserRole>('merchant');
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo>(INITIAL_MERCHANT_INFO);
  const [merchantCollections, setMerchantCollections] = useState<MerchantCollection[]>(INITIAL_MERCHANT_COLLECTIONS);
  const [merchantSettlements, setMerchantSettlements] = useState<MerchantSettlement[]>(INITIAL_MERCHANT_SETTLEMENTS);
  const [lastMerchantCollection, setLastMerchantCollection] = useState<MerchantCollection | null>(null);
  const [cashiers, setCashiers] = useState<CashierInfo[]>(INITIAL_CASHIERS);
  const [softPosAmount, setSoftPosAmount] = useState<number>(0);
  const [softPosCardScheme, setSoftPosCardScheme] = useState<string>('mada');
  const [isKycModalOpen, setIsKycModalOpen] = useState<boolean>(false);
  const [soundBoxLanguage, setSoundBoxLanguageState] = useState<'ar' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qpay_soundbox_lang') as 'ar' | 'en' | null;
      if (saved === 'ar' || saved === 'en') return saved;
    }
    return 'ar';
  });

  const setSoundBoxLanguage = (lang: 'ar' | 'en') => {
    setSoundBoxLanguageState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('qpay_soundbox_lang', lang);
      } catch {
        // ignore
      }
    }
  };

  const [soundBoxVolume, setSoundBoxVolume] = useState<number>(1.0);

  const [user, setUser] = useState<User>({
    name: 'Fahad Al-Harbi',
    avatarInitials: 'FA',
    upiId: 'fahad@sarie',
    mobile: '+966 50 123 4567',
    email: 'fahad.alharbi@email.sa',
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>(INITIAL_SESSIONS);

  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('qtpay_lang') || 'English';
    }
    return 'English';
  });
  const [isRtl, setIsRtl] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qtpay_lang');
      return saved === 'العربية';
    }
    return false;
  });

  // Modals state
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pendingPaymentData, setPendingPaymentData] = useState<{
    title: string;
    amount: number;
    subTitle: string;
    onSuccess?: () => void;
  } | null>(null);

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);

  // OTP & Manager PIN Security Controls
  const [activeOtp, setActiveOtp] = useState<string>('589204');

  const verifyOtp = (enteredOtp: string): boolean => {
    const clean = enteredOtp.trim();
    return clean === activeOtp;
  };

  const verifyMerchantPin = (pin: string): boolean => {
    const currentPin = (merchantInfo.merchantPin || localStorage.getItem('qpay_merchant_pin') || '').trim();
    if (!currentPin) return false;
    return pin.trim() === currentPin;
  };

  const [isManagerPinModalOpen, setIsManagerPinModalOpen] = useState<boolean>(false);
  const [managerPinModalData, setManagerPinModalData] = useState<{
    title: string;
    subtitle?: string;
    onSuccess: () => void;
  } | null>(null);

  const openManagerPinModal = (opts: { title: string; subtitle?: string; onSuccess: () => void }) => {
    setManagerPinModalData(opts);
    setIsManagerPinModalOpen(true);
  };

  const closeManagerPinModal = () => {
    setIsManagerPinModalOpen(false);
    setManagerPinModalData(null);
  };

  useEffect(() => {
    // Check URL query parameters for test automation (e.g. ?screen=ELECTRICITY)
    const urlParams = new URLSearchParams(window.location.search);
    const initialScreen = urlParams.get('screen') as ScreenId | null;
    if (initialScreen) {
      setCurrentScreen(initialScreen);
      setScreenStack([{ screen: initialScreen }]);
    }

    // Load initial data
    authService.getCurrentUser().then(setUser);
    bankService.getBankAccounts().then(setBankAccounts);
    transactionService.getInitialTransactions().then(setTransactions);
    notificationService.getInitialNotifications().then(setNotifications);

    // Real-time Supabase collections listener for Web Dashboard
    const unsubscribe = subscribeToMerchantCollections((newCol) => {
      setMerchantCollections((prev) => {
        if (prev.some((c) => c.id === newCol.id || (newCol.orderRef && c.orderRef === newCol.orderRef))) {
          return prev;
        }
        return [newCol, ...prev];
      });
      speakSoundBox(newCol.amount);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Expose global test helpers for Playwright / automation verification
  useEffect(() => {
    (window as any).__qtpay = {
      navigateTo,
      goBack,
      openPinModal,
      closePinModal,
      setIsLanguageModalOpen,
      setAppLanguage,
      toggleLanguage,
      setIsLogoutModalOpen,
      setIsAddBankModalOpen,
      setIsScanModalOpen,
      setIsEditProfileModalOpen,
      currentScreen,
    };
  });

  const startOnboardingFlow = () => {
    localStorage.removeItem('hasSeenOnboarding');
    setCurrentScreen('SPLASH');
    setScreenStack([{ screen: 'SPLASH' }]);
    setTimeout(() => {
      setCurrentScreen('ONBOARDING');
      setScreenStack([{ screen: 'ONBOARDING' }]);
    }, 1800);
  };

  const navigateTo = (screen: ScreenId, params?: Record<string, any>) => {
    setScreenParams(params || {});
    setCurrentScreen(screen);
    setScreenStack((prev) => [...prev, { screen, params }]);

    // Sync bottom navigation active tab
    if (screen === 'MERCHANT_HOME') setActiveTabState('home');
    else if (screen === 'SOFTPOS_TERMINAL' || screen === 'BANK_ACCOUNTS') setActiveTabState('account');
    else if (screen === 'PAYMENT_LINK_GENERATOR') setActiveTabState('pay');
    else if (screen === 'MERCHANT_QR_GENERATOR') setActiveTabState('scan');
    else if (screen === 'MERCHANT_INSIGHTS' || screen === 'MERCHANT_COLLECTIONS' || screen === 'HISTORY') setActiveTabState('history');
    else if (screen === 'MERCHANT_BANK_LINK' || screen === 'PROFILE') setActiveTabState('profile');
  };

  const goBack = () => {
    if (screenStack.length > 1) {
      const newStack = [...screenStack];
      newStack.pop();
      const prev = newStack[newStack.length - 1];
      setScreenStack(newStack);
      setCurrentScreen(prev.screen);
      setScreenParams(prev.params || {});

      if (prev.screen === 'MERCHANT_HOME') setActiveTabState('home');
      else if (prev.screen === 'SOFTPOS_TERMINAL' || prev.screen === 'BANK_ACCOUNTS') setActiveTabState('account');
      else if (prev.screen === 'PAYMENT_LINK_GENERATOR') setActiveTabState('pay');
      else if (prev.screen === 'MERCHANT_QR_GENERATOR') setActiveTabState('scan');
      else if (prev.screen === 'MERCHANT_INSIGHTS' || prev.screen === 'MERCHANT_COLLECTIONS' || prev.screen === 'HISTORY') setActiveTabState('history');
      else if (prev.screen === 'MERCHANT_BANK_LINK' || prev.screen === 'PROFILE') setActiveTabState('profile');
    } else {
      if (isAuthenticated) {
        navigateTo('MERCHANT_HOME');
      } else {
        navigateTo('MOBILE_NUMBER');
      }
    }
  };

  const setActiveTab = (tab: BottomTab) => {
    setActiveTabState(tab);
    switch (tab) {
      case 'home':
        navigateTo('MERCHANT_HOME');
        break;
      case 'account':
        navigateTo('SOFTPOS_TERMINAL');
        break;
      case 'pay':
        navigateTo('PAYMENT_LINK_GENERATOR');
        break;
      case 'scan':
        navigateTo('MERCHANT_QR_GENERATOR');
        break;
      case 'history':
        navigateTo('MERCHANT_INSIGHTS');
        break;
      case 'profile':
        navigateTo('PROFILE');
        break;
    }
  };

  const toggleShowBalance = (bankId: string) => {
    setBankAccounts((prev) =>
      prev.map((acc) => (acc.id === bankId ? { ...acc, showBalance: !acc.showBalance } : acc))
    );
  };

  const addBankAccount = async (bankName: string) => {
    const newBank = await bankService.addBankAccount(bankName);
    setBankAccounts((prev) => [...prev, newBank]);

    const isAr = language === 'العربية';
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: isAr ? 'تم ربط الحساب البنكي' : 'Bank linked',
      description: isAr
        ? `تم ربط ${translateText(bankName, 'ar')} بنجاح وتوثيقه لدى سريع.`
        : `${bankName} was linked successfully.`,
      timestamp: isAr ? 'الآن' : 'Just now',
      read: false,
      type: 'info',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const removeBankAccount = (bankId: string) => {
    setBankAccounts((prev) => {
      const remaining = prev.filter((acc) => acc.id !== bankId);
      if (remaining.length > 0 && !remaining.some((a) => a.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return remaining;
    });
  };

  const setPrimaryBank = (bankId: string) => {
    setBankAccounts((prev) =>
      prev.map((acc) => ({
        ...acc,
        isPrimary: acc.id === bankId,
      }))
    );
  };


  const completePayment = async (params: {
    title: string;
    subTitle: string;
    amount: number;
    avatarInitials?: string;
    category?: string;
    bankId?: string;
  }) => {
    const isAr = language === 'العربية';
    const newTxn: Transaction = {
      id: 'QT' + Math.floor(10000000000 + Math.random() * 90000000000).toString(),
      title: params.title,
      subTitle: params.subTitle,
      amount: params.amount,
      type: 'sent',
      date: 'TODAY',
      timestamp: new Date(),
      utr: 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      avatarInitials: params.avatarInitials || params.title.substring(0, 2).toUpperCase(),
      category: params.category || 'Payment',
    };

    // Deduct from primary bank account (or specified bank account)
    setBankAccounts((prev) =>
      prev.map((acc) => {
        if (params.bankId ? acc.id === params.bankId : acc.isPrimary) {
          const newBal = Math.max(0, acc.balance - params.amount);
          return { ...acc, balance: newBal };
        }
        return acc;
      })
    );

    setTransactions((prev) => [newTxn, ...prev]);
    setLastTransaction(newTxn);

    const formattedAmt = formatSaudiCurrency(params.amount, language as SupportedLanguage);
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: isAr ? 'تم التحويل بنجاح' : 'Payment successful',
      description: isAr
        ? `تم دفع ${formattedAmt} إلى ${params.title}`
        : `${formattedAmt} paid to ${params.title}`,
      timestamp: isAr ? 'الآن' : 'Just now',
      read: false,
      type: 'success',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newTxn;
  };

  // SoundBox Audio Chime & Guaranteed Real Voice Player
  const speakSoundBox = (amount: number, forceLang?: 'ar' | 'en') => {
    const targetLang = forceLang || soundBoxLanguage || 'ar';
    const isArabic = targetLang === 'ar';
    const roundedAmt = Math.round(amount);

    // 1. Play SoftPOS audio notification chime via Web Audio
    try {
      if (typeof window !== 'undefined') {
        const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
          const now = ctx.currentTime;
          [587.33, 783.99, 987.77].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            gain.gain.setValueAtTime(0.25 * (soundBoxVolume || 1.0), now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.28);
          });
        }
      }
    } catch (e) {
      console.warn('SoundBox chime notice:', e);
    }

    // 2. Play Authentic Pre-rendered High-Fidelity Audio File (Works 100% on all OS/Browsers)
    let audioPlayed = false;
    try {
      if (typeof window !== 'undefined') {
        const knownAmounts = [25, 67, 145, 150, 450, 480, 1200, 5000, 9999];
        const audioFileName = knownAmounts.includes(roundedAmt)
          ? `soundbox_${targetLang}_${roundedAmt}.mp3`
          : `soundbox_${targetLang}_default.mp3`;

        const audio = new Audio(`./audio/${audioFileName}`);
        audio.volume = soundBoxVolume !== undefined ? soundBoxVolume : 1.0;

        setTimeout(() => {
          audio.play()
            .then(() => {
              audioPlayed = true;
            })
            .catch(() => {
              fallbackTts();
            });
        }, 120);
      }
    } catch {
      fallbackTts();
    }

    // 3. Fallback to SpeechSynthesis if audio element fails
    function fallbackTts() {
      if (audioPlayed) return;
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const text = isArabic
            ? `تم استلام ${amount} ريال سعودي بنجاح`
            : `Received ${amount} Saudi Riyals successfully`;

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = isArabic ? 'ar-SA' : 'en-US';
          utterance.rate = 0.92;
          utterance.pitch = 1.0;
          utterance.volume = soundBoxVolume !== undefined ? soundBoxVolume : 1.0;

          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {
            const matchedVoice = isArabic
              ? voices.find((v) => v.lang.toLowerCase().startsWith('ar') || v.name.toLowerCase().includes('arabic'))
              : voices.find((v) => v.lang.toLowerCase().startsWith('en') || v.name.toLowerCase().includes('english'));
            if (matchedVoice) utterance.voice = matchedVoice;
          }

          window.speechSynthesis.speak(utterance);
        }
      } catch (e) {
        console.warn('Fallback TTS notice:', e);
      }
    }
  };

  const updateMerchantInfo = (info: Partial<MerchantInfo>) => {
    setMerchantInfo((prev) => ({ ...prev, ...info }));
  };

  const processMerchantCollection = async (params: {
    amount: number;
    paymentMethod: PaymentAcceptanceMethod;
    cardLast4?: string;
    orderRef?: string;
    customerMasked?: string;
  }): Promise<MerchantCollection> => {
    const grossAmount = params.amount;
    // 15% ZATCA Standard VAT calculation: VAT = Gross - (Gross / 1.15)
    const netAmount = Number((grossAmount / 1.15).toFixed(2));
    const vatAmount = Number((grossAmount - netAmount).toFixed(2));
    const isAr = language === 'العربية';

    const newCollection: MerchantCollection = {
      id: 'POS-' + Math.floor(1000000 + Math.random() * 9000000).toString(),
      orderRef: params.orderRef || 'ORD-' + Math.floor(1000 + Math.random() * 9000).toString(),
      amount: grossAmount,
      vatAmount,
      netAmount,
      paymentMethod: params.paymentMethod,
      cardLast4: params.cardLast4,
      customerMasked: params.customerMasked || '+966 50 ••• ' + Math.floor(1000 + Math.random() * 9000).toString(),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date(),
      status: 'settled',
      zatcaQrCode: btoa(`${merchantInfo.businessName}|${merchantInfo.vatNumber}|${new Date().toISOString()}|${grossAmount}|${vatAmount}`),
    };

    setMerchantCollections((prev) => [newCollection, ...prev]);
    setLastMerchantCollection(newCollection);
    syncCollectionToSupabase(newCollection);

    // Trigger SoundBox Voice Alert
    speakSoundBox(grossAmount);

    const formattedAmt = formatSaudiCurrency(grossAmount, language as SupportedLanguage);
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: isAr ? 'تم استلام دفعة جديدة' : 'Merchant Payment Received',
      description: isAr
        ? `تم تحصيل ${formattedAmt} بنجاح`
        : `${formattedAmt} collected via ${params.paymentMethod.replace('_', ' ').toUpperCase()}`,
      timestamp: isAr ? 'الآن' : 'Just now',
      read: false,
      type: 'success',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newCollection;
  };

  const processMerchantRefund = async (collectionId: string, pin: string): Promise<boolean> => {
    if (!verifyMerchantPin(pin)) {
      return false;
    }
    setMerchantCollections((prev) =>
      prev.map((c) => (c.id === collectionId ? { ...c, status: 'refunded' as const } : c))
    );
    return true;
  };

  const addCashier = (cashierData: Omit<CashierInfo, 'id'>) => {
    const newCashier: CashierInfo = {
      id: `csh-${Date.now()}`,
      ...cashierData,
    };
    setCashiers((prev) => [...prev, newCashier]);
  };

  const toggleCashierStatus = (cashierId: string) => {
    setCashiers((prev) =>
      prev.map((c) => (c.id === cashierId ? { ...c, active: !c.active } : c))
    );
  };

  const openPinModal = (data: { title: string; amount: number; subTitle: string; onSuccess?: () => void }) => {
    setPendingPaymentData(data);
    setIsPinModalOpen(true);
  };

  const closePinModal = () => {
    setIsPinModalOpen(false);
    setPendingPaymentData(null);
  };

  const triggerSettleNow = async (): Promise<MerchantSettlement> => {
    // Exclude cash transactions from bank settlement by default
    const settleable = merchantCollections.filter(
      (c) => c.status !== 'refunded' && c.paymentMethod !== 'cash'
    );
    const settleAmount = settleable.reduce((sum, c) => sum + c.amount, 0);
    const netAmount = Number((settleAmount / 1.15).toFixed(2));
    const vatAmount = Number((settleAmount - netAmount).toFixed(2));
    const isAr = language === 'العربية';

    const newSettlement: MerchantSettlement = {
      id: 'STL-' + Math.floor(100000 + Math.random() * 900000).toString(),
      settlementRef:
        'SETTLE-' +
        new Date().toISOString().slice(0, 10).replace(/-/g, '') +
        '-' +
        Math.floor(10 + Math.random() * 90).toString(),
      utr: 'SARIE' + Math.floor(10000000000 + Math.random() * 90000000000).toString(),
      amount: settleAmount,
      vatAmount,
      netAmount,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date(),
      status: 'settled',
      bankName: merchantInfo.settlementBank || 'Al Rajhi Bank',
      ibanMasked: merchantInfo.settlementIban || 'SA03 8000 •••• 5005',
      method: 'instant_settlenow',
    };

    setMerchantSettlements((prev) => [newSettlement, ...prev]);

    const formattedAmt = formatSaudiCurrency(settleAmount, language as SupportedLanguage);
    const bankNameDisplay = isAr ? translateText(newSettlement.bankName, 'ar') : newSettlement.bankName;
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: isAr ? 'تم إيداع التسوية الفورية عبر سريع' : 'Instant Sarie Payout Dispatched',
      description: isAr
        ? `تم إيداع ${formattedAmt} مباشرة في ${bankNameDisplay}. مرجع سريع: ${newSettlement.utr}`
        : `${formattedAmt} credited instantly to ${newSettlement.bankName}. UTR: ${newSettlement.utr}`,
      timestamp: isAr ? 'الآن' : 'Just now',
      read: false,
      type: 'success',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newSettlement;
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => {
      const newName = updatedData.name !== undefined ? updatedData.name : prev.name;
      const initials = newName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'QT';

      return {
        ...prev,
        ...updatedData,
        avatarInitials: initials,
      };
    });
  };

  const t = (key: string, defaultText?: string) => {
    return translateText(key, language as SupportedLanguage, defaultText);
  };

  const setAppLanguage = (lang: string) => {
    setLanguage(lang);
    const rtl = lang === 'العربية';
    setIsRtl(rtl);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('qtpay_lang', lang);
      } catch {
        // noop
      }
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = rtl ? 'ar' : 'en';
    }
    setIsLanguageModalOpen(false);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'العربية' ? 'English' : 'العربية';
    setAppLanguage(nextLang);
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = isRtl ? 'ar' : 'en';
    }
  }, [isRtl]);

  const performLogout = () => {
    try {
      localStorage.setItem('qpay_merchant_explicit_logout', 'true');
      sessionStorage.removeItem('qpay_merchant_authenticated');
      localStorage.removeItem('qpay_merchant_authenticated');
      localStorage.removeItem('qpay_merchant_session');
      localStorage.removeItem('hasSeenOnboarding');
      localStorage.removeItem('hasCompletedOnboarding');
      localStorage.removeItem('hasGrantedPermissions');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setIsLogoutModalOpen(false);
    setCurrentScreen('MOBILE_NUMBER');
    setScreenStack([{ screen: 'MOBILE_NUMBER' }]);
  };

  const terminateSession = (sessionId: string) => {
    setDeviceSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };


  return (
    <AppContext.Provider
      value={{
        language,
        isRtl,
        t,
        currentScreen,
        isAuthenticated,
        setIsAuthenticated,
        navigateTo,
        goBack,
        screenParams,
        activeTab,
        setActiveTab,
        startOnboardingFlow,
        user,
        bankAccounts,
        transactions,
        notifications,
        deviceSessions,
        lastTransaction,
        updateUser,
        toggleShowBalance,
        addBankAccount,
        removeBankAccount,
        setPrimaryBank,
        completePayment,
        isPinModalOpen,
        openPinModal,
        closePinModal,
        pendingPaymentData,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        setAppLanguage,
        toggleLanguage,
        isLogoutModalOpen,
        setIsLogoutModalOpen,
        performLogout,
        isAddBankModalOpen,
        setIsAddBankModalOpen,
        isScanModalOpen,
        setIsScanModalOpen,
        isEditProfileModalOpen,
        setIsEditProfileModalOpen,
        terminateSession,
        // Merchant State & Handlers
        userRole,
        setUserRole,
        merchantInfo,
        updateMerchantInfo,
        merchantCollections,
        merchantSettlements,
        triggerSettleNow,
        lastMerchantCollection,
        processMerchantCollection,
        processMerchantRefund,
        cashiers,
        addCashier,
        toggleCashierStatus,
        softPosAmount,
        setSoftPosAmount,
        softPosCardScheme,
        setSoftPosCardScheme,
        isKycModalOpen,
        setIsKycModalOpen,
        soundBoxLanguage,
        setSoundBoxLanguage,
        soundBoxVolume,
        setSoundBoxVolume,
        speakSoundBox,
        // Security Controls
        activeOtp,
        setActiveOtp,
        verifyOtp,
        verifyMerchantPin,
        isManagerPinModalOpen,
        managerPinModalData,
        openManagerPinModal,
        closeManagerPinModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


