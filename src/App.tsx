import React from 'react';
import { AppProvider, useApp } from './state/AppContext';

// Auth / Onboarding Screens
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { MobileNumberScreen } from './screens/MobileNumberScreen';
import { SmsOtpScreen } from './screens/SmsOtpScreen';
import { MerchantRegistrationScreen } from './screens/MerchantRegistrationScreen';
import { PermissionsScreen } from './screens/PermissionsScreen';

// Merchant Core Screens
import { MerchantHomeScreen } from './screens/MerchantHomeScreen';
import { MerchantSetupScreen } from './screens/MerchantSetupScreen';
import { MerchantSettlementBankScreen } from './screens/MerchantSettlementBankScreen';
import { MerchantPinSetupScreen } from './screens/MerchantPinSetupScreen';
import { SoftPOSTerminalScreen } from './screens/SoftPOSTerminalScreen';
import { TapCardScreen } from './screens/TapCardScreen';
import { MerchantPaymentReceivedScreen } from './screens/MerchantPaymentReceivedScreen';
import { MerchantQrGeneratorScreen } from './screens/MerchantQrGeneratorScreen';
import { PaymentLinkGeneratorScreen } from './screens/PaymentLinkGeneratorScreen';
import { SoundBoxNotifierScreen } from './screens/SoundBoxNotifierScreen';
import { MerchantCollectionsScreen } from './screens/MerchantCollectionsScreen';
import { MerchantInsightsScreen } from './screens/MerchantInsightsScreen';

// Merchant Settings Screens
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BankAccountsScreen } from './screens/BankAccountsScreen';
import { SecurityScreen } from './screens/SecurityScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { HelpSupportScreen } from './screens/HelpSupportScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';

// Modals
import { LanguageModal } from './screens/LanguageModal';
import { LogoutModal } from './screens/LogoutModal';
import { AddBankModal } from './screens/AddBankModal';
import { EditProfileModal } from './screens/EditProfileModal';
import { KycModal } from './screens/KycModal';
import { ManagerPinModal } from './components/ManagerPinModal';
import { DesktopWebLayout } from './components/desktop/DesktopWebLayout';

const hasEnvConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const MissingEnvScreen: React.FC = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#080C14',
      color: '#FFFFFF',
      padding: '24px',
      textAlign: 'center',
      fontFamily: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
    }}
  >
    <div
      style={{
        maxWidth: '480px',
        backgroundColor: '#111726',
        border: '1px solid rgba(239, 68, 68, 0.6)',
        borderRadius: '16px',
        padding: '32px 24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{ fontSize: '36px', marginBottom: '16px' }}>⚠️</div>
      <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#EF4444', margin: '0 0 12px 0' }}>
        Configuration Error / خطأ في الإعداد
      </h2>
      <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.6', margin: '0 0 16px 0' }}>
        Missing required Supabase environment variables. Please configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your environment or Vercel project settings.
      </p>
      <div
        style={{
          fontSize: '11px',
          color: '#94A3B8',
          backgroundColor: '#0A0E1A',
          padding: '10px',
          borderRadius: '8px',
          fontFamily: 'monospace',
        }}
      >
        VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY REQUIRED
      </div>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { currentScreen, isAuthenticated } = useApp();

  if (!hasEnvConfig) {
    return <MissingEnvScreen />;
  }

  const renderScreen = () => {
    // Auth guard: Unauthenticated sessions are restricted to login / OTP / Registration / PIN Setup
    if (!isAuthenticated) {
      if (currentScreen === 'SMS_OTP') {
        return <SmsOtpScreen />;
      }
      if (currentScreen === 'MERCHANT_REGISTER') {
        return <MerchantRegistrationScreen />;
      }
      if (currentScreen === 'MERCHANT_PIN_SETUP') {
        return <MerchantPinSetupScreen />;
      }
      return <MobileNumberScreen />;
    }

    switch (currentScreen) {
      // Auth / Onboarding
      case 'SPLASH':
        return <SplashScreen />;
      case 'ONBOARDING':
        return <OnboardingScreen />;
      case 'MOBILE_NUMBER':
        return <MobileNumberScreen />;
      case 'SMS_OTP':
        return <SmsOtpScreen />;
      case 'MERCHANT_REGISTER':
        return <MerchantRegistrationScreen />;
      case 'PERMISSIONS':
        return <PermissionsScreen />;

      // Merchant Core
      case 'MERCHANT_HOME':
        return <MerchantHomeScreen />;
      case 'MERCHANT_SETUP':
        return <MerchantSetupScreen />;
      case 'MERCHANT_BANK_LINK':
        return <MerchantSettlementBankScreen />;
      case 'MERCHANT_PIN_SETUP':
        return <MerchantPinSetupScreen />;
      case 'SOFTPOS_TERMINAL':
        return <SoftPOSTerminalScreen />;
      case 'SOFTPOS_TAP':
        return <TapCardScreen />;
      case 'MERCHANT_PAYMENT_SUCCESS':
        return <MerchantPaymentReceivedScreen />;
      case 'MERCHANT_QR_GENERATOR':
        return <MerchantQrGeneratorScreen />;
      case 'PAYMENT_LINK_GENERATOR':
        return <PaymentLinkGeneratorScreen />;
      case 'SOUNDBOX_NOTIFIER':
        return <SoundBoxNotifierScreen />;
      case 'MERCHANT_COLLECTIONS':
        return <MerchantCollectionsScreen />;
      case 'MERCHANT_INSIGHTS':
        return <MerchantInsightsScreen />;

      // Settings
      case 'HISTORY':
        return <HistoryScreen />;
      case 'PROFILE':
        return <ProfileScreen />;
      case 'BANK_ACCOUNTS':
        return <BankAccountsScreen />;
      case 'SECURITY':
        return <SecurityScreen />;
      case 'NOTIFICATIONS':
        return <NotificationsScreen />;
      case 'HELP_SUPPORT':
        return <HelpSupportScreen />;
      case 'PRIVACY':
        return <PrivacyScreen />;

      default:
        return <MerchantHomeScreen />;
    }
  };

  return (
    <DesktopWebLayout>
      {renderScreen()}

      {/* Bottom Sheet Modals */}
      <LanguageModal />
      <LogoutModal />
      <AddBankModal />
      <EditProfileModal />
      <KycModal />
      <ManagerPinModal />
    </DesktopWebLayout>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
