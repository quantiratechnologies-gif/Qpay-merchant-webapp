import React, { useState } from 'react';
import {
  Landmark,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { Modal } from '../components/Modal';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import { translateText, formatLocalizedNumber } from '../utils/i18n';

// Contactless NFC Waves Icon
const ContactlessIcon: React.FC<{ color?: string; size?: number }> = ({ color = '#D4AF37', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(90deg)', flexShrink: 0 }}>
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="20" r="1" fill={color} />
  </svg>
);

export const BankAccountsScreen: React.FC = () => {
  const { bankAccounts, toggleShowBalance, setPrimaryBank, removeBankAccount, setIsAddBankModalOpen, openPinModal, t, language } = useApp();
  const [bankToRemove, setBankToRemove] = useState<string | null>(null);

  const confirmRemove = () => {
    if (bankToRemove) {
      removeBankAccount(bankToRemove);
      setBankToRemove(null);
    }
  };

  const handleBalanceCheck = (bank: typeof bankAccounts[0]) => {
    const displayBankName = translateText(bank.bankName, language);
    const displayAccType = translateText(bank.accountType, language);

    if (bank.showBalance) {
      toggleShowBalance(bank.id);
    } else {
      openPinModal({
        title: `${t('banks.check_balance', 'Check Balance')} - ${displayBankName}`,
        subTitle: `${displayAccType} • ${bank.accountNumberMasked}`,
        amount: bank.balance,
        onSuccess: () => toggleShowBalance(bank.id),
      });
    }
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B0B', minHeight: '100%', paddingBottom: '96px' }}>
      <AppHeader title={t('banks.title', 'Bank Accounts')} showBack />

      <div style={{ padding: '16px 20px' }}>
        {/* Top Summary Banner */}
        <div
          style={{
            backgroundColor: '#171717',
            borderRadius: '16px',
            border: '1px solid #262626',
            padding: '16px 18px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#212121',
                color: '#D4AF37',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Landmark size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                  {language === 'العربية' ? 'الحسابات البنكية' : 'Bank Accounts'}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#D4AF37',
                    backgroundColor: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    padding: '2px 7px',
                    borderRadius: '10px',
                  }}
                >
                  {language === 'العربية' ? `${formatLocalizedNumber(bankAccounts.length, language)} نشطة` : `${bankAccounts.length} Active`}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#A3A3A3', fontWeight: 600, marginTop: '4px' }}>
                {language === 'العربية' ? 'حسابات التسوية عبر سريع' : 'Sarie Settlement Accounts'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAddBankModalOpen(true)}
            className="interactive-tap gold-gradient-btn"
            style={{
              border: 'none',
              borderRadius: '12px',
              padding: '9px 14px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 2px 10px rgba(212, 175, 55, 0.25)',
            }}
          >
            <Plus size={15} color="#0B0B0B" /> {language === 'العربية' ? 'إضافة بنك' : 'Add Bank'}
          </button>
        </div>

        {/* Bank Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
          {bankAccounts.map((bank) => {
            const rawNumbers = bank.accountNumberMasked.replace(/[^0-9]/g, '') || '3616';
            const displayBankName = t(bank.bankName, bank.bankName);
            const displayAccType = t(bank.accountType, bank.accountType);

            // PRIMARY BANK CARD MODEL
            if (bank.isPrimary) {
              return (
                <div
                  key={bank.id}
                  style={{
                    backgroundColor: '#171717',
                    borderRadius: '20px',
                    padding: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1.5px solid #D4AF37',
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.1)',
                    color: '#FFFFFF',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Card Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          backgroundColor: '#212121',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Landmark size={20} color="#D4AF37" />
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.01em', color: '#FFFFFF' }}>
                          {displayBankName}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '1px' }}>
                          {displayAccType}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.12)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        color: '#D4AF37',
                        fontSize: '10.5px',
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Star size={11} fill="#D4AF37" color="#D4AF37" /> {t('banks.primary', 'PRIMARY')}
                    </div>
                  </div>

                  {/* EMV Chip & Account Number Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '18px 0 20px 0', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '24px',
                          borderRadius: '4px',
                          backgroundColor: '#D4AF37',
                        }}
                      />
                      <ContactlessIcon color="#D4AF37" size={18} />
                    </div>

                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '16px',
                        letterSpacing: '0.12em',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        direction: 'ltr',
                      }}
                    >
                      •••• &nbsp; •••• &nbsp; •••• &nbsp; {rawNumbers}
                    </div>
                  </div>

                  {/* Integrated Balance Container */}
                  <div
                    style={{
                      backgroundColor: '#1E1E1E',
                      border: '1px solid #262626',
                      borderRadius: '14px',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A3A3A3' }}>
                        {t('home.total_balance', 'Available Balance')}
                      </div>
                      <div className="tabular-nums" style={{ fontSize: '19px', fontWeight: 900, color: '#D4AF37', marginTop: '2px', letterSpacing: '0.02em' }}>
                        {bank.showBalance ? formatCurrency(bank.balance, language) : (language === 'العربية' ? '•••••••• ر.س' : 'SAR ••••••••')}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBalanceCheck(bank)}
                      className="interactive-tap gold-gradient-btn"
                      style={{
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      {bank.showBalance ? <EyeOff size={13} color="#0B0B0B" /> : <Eye size={13} color="#0B0B0B" />}
                      <span>{bank.showBalance ? t('home.hide', 'Hide') : t('banks.check_balance', 'Check')}</span>
                    </button>
                  </div>

                  {/* Action Strip */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#D4AF37' }}>
                      <CheckCircle2 size={15} color="#D4AF37" />
                      <span>{language === 'العربية' ? 'الحساب الافتراضي' : 'Default Account'}</span>
                    </div>

                    <button
                      onClick={() => setBankToRemove(bank.id)}
                      className="interactive-tap"
                      style={{
                        backgroundColor: '#212121',
                        border: '1px solid #262626',
                        color: '#A3A3A3',
                        padding: '7px 12px',
                        borderRadius: '10px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} color="#A3A3A3" />
                      <span>{language === 'العربية' ? 'حذف' : 'Remove'}</span>
                    </button>
                  </div>
                </div>
              );
            }

            // SECONDARY BANK CARD MODEL
            return (
              <div
                key={bank.id}
                style={{
                  backgroundColor: '#171717',
                  border: '1px solid #262626',
                  borderRadius: '20px',
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#212121',
                        border: '1px solid #262626',
                        color: '#D4AF37',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Landmark size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15.5px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.01em' }}>
                        {displayBankName}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '1px' }}>
                        {displayAccType}
                      </div>
                    </div>
                  </div>

                  <ContactlessIcon color="#737373" size={18} />
                </div>

                {/* EMV Chip & Account Number Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 18px 0' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '24px',
                      borderRadius: '4px',
                      backgroundColor: '#262626',
                    }}
                  />

                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '15px',
                      letterSpacing: '0.1em',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      direction: 'ltr',
                    }}
                  >
                    •••• &nbsp; •••• &nbsp; •••• &nbsp; {rawNumbers}
                  </div>
                </div>

                {/* Integrated Balance Container */}
                <div
                  style={{
                    backgroundColor: '#1E1E1E',
                    border: '1px solid #262626',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A3A3A3' }}>
                      {t('home.total_balance', 'Available Balance')}
                    </div>
                    <div className="tabular-nums" style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px', letterSpacing: '0.01em' }}>
                      {bank.showBalance ? formatCurrency(bank.balance, language) : (language === 'العربية' ? '•••••••• ر.س' : 'SAR ••••••••')}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBalanceCheck(bank)}
                    className="interactive-tap"
                    style={{
                      backgroundColor: '#212121',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: '#D4AF37',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    {bank.showBalance ? <EyeOff size={13} color="#A3A3A3" /> : <Eye size={13} color="#D4AF37" />}
                    <span>{bank.showBalance ? t('home.hide', 'Hide') : t('banks.check_balance', 'Check')}</span>
                  </button>
                </div>

                {/* Action Strip */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={() => setPrimaryBank(bank.id)}
                    className="interactive-tap"
                    style={{
                      flex: 1,
                      backgroundColor: '#212121',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: '#D4AF37',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                    }}
                  >
                    <Star size={13} color="#D4AF37" /> {language === 'العربية' ? 'تعيين كأساسي' : 'Set as Primary'}
                  </button>

                  <button
                    onClick={() => setBankToRemove(bank.id)}
                    className="interactive-tap"
                    style={{
                      backgroundColor: '#212121',
                      border: '1px solid #262626',
                      color: '#A3A3A3',
                      padding: '9px 14px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} color="#A3A3A3" />
                    <span>{language === 'العربية' ? 'حذف' : 'Remove'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Bank Account Action */}
        <PrimaryButton onClick={() => setIsAddBankModalOpen(true)}>
          <Plus size={18} /> {language === 'العربية' ? 'إضافة حساب بنكي جديد' : 'Add Bank Account'}
        </PrimaryButton>

        {/* Security & Quantira Trust Footer */}
        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#171717',
            border: '1px solid #262626',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#A3A3A3', fontWeight: 600 }}>
              &bull; {language === 'العربية' ? 'مدعوم بنظام سريع وتشفير أمني متقدم' : 'Secured by Sarie & 256-Bit Encryption'}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {bankToRemove && (
        <Modal
          isOpen={Boolean(bankToRemove)}
          onClose={() => setBankToRemove(null)}
          title={language === 'العربية' ? 'حذف الحساب' : 'Remove Account'}
        >
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <p style={{ color: '#A3A3A3', fontSize: '14px', marginBottom: '20px', lineHeight: '20px' }}>
              {language === 'العربية'
                ? 'هل أنت متأكد من رغبتك في حذف هذا الحساب؟'
                : 'Are you sure you want to remove this bank account?'}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setBankToRemove(null)}
                className="interactive-tap"
                style={{
                  flex: 1,
                  backgroundColor: '#212121',
                  border: '1px solid #262626',
                  borderRadius: '10px',
                  padding: '12px',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {t('btn.cancel', 'Cancel')}
              </button>
              <button
                onClick={confirmRemove}
                className="interactive-tap"
                style={{
                  flex: 1,
                  backgroundColor: '#EF4444',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  color: '#FFFFFF',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {language === 'العربية' ? 'حذف' : 'Remove'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
