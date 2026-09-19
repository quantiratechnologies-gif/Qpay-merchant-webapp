import React, { useState } from 'react';
import { Lock, Eye, ShieldCheck, Database, Check } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { ListRow } from '../components/ListRow';
import { Modal } from '../components/Modal';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../state/AppContext';

export const PrivacyScreen: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'العربية';

  const [activeModal, setActiveModal] = useState<'preferences' | 'export' | 'terms' | null>(null);
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [shareData, setShareData] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportData = () => {
    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
      setActiveModal(null);
    }, 2000);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B0B', minHeight: '100vh', paddingBottom: '36px', color: '#FFFFFF' }}>
      <AppHeader title={isAr ? 'الخصوصية' : 'Privacy'} showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* Encryption Hero Card */}
        <div
          style={{
            backgroundColor: '#171717',
            background: 'radial-gradient(ellipse at top left, rgba(212, 175, 55, 0.12) 0%, #171717 70%)',
            border: '1.5px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            color: '#FFFFFF',
            boxShadow: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D4AF37',
                flexShrink: 0,
              }}
            >
              <Lock size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {isAr ? 'تشفير مصرفي' : 'Banking Encryption'}
              </h3>
              <p style={{ fontSize: '12px', color: '#A3A3A3', margin: '2px 0 0 0' }}>
                {isAr ? 'حماية مشفرة لجميع البيانات' : 'Encrypted & protected data'}
              </p>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 800, color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', paddingInlineStart: '4px' }}>
          {isAr ? 'خيارات البيانات' : 'Data Controls'}
        </div>

        <div
          style={{
            backgroundColor: '#171717',
            borderRadius: '18px',
            border: '1px solid #262626',
            overflow: 'hidden',
          }}
        >
          <ListRow
            icon={<Eye size={18} color="#D4AF37" />}
            label={isAr ? 'تفضيلات مشاركة البيانات' : 'Data Preferences'}
            onClick={() => setActiveModal('preferences')}
          />
          <div style={{ height: '1px', backgroundColor: '#262626', margin: '0 16px' }} />
          <ListRow
            icon={<Database size={18} color="#D4AF37" />}
            label={isAr ? 'تصدير البيانات' : 'Export Data'}
            onClick={() => setActiveModal('export')}
          />
          <div style={{ height: '1px', backgroundColor: '#262626', margin: '0 16px' }} />
          <ListRow
            icon={<ShieldCheck size={18} color="#D4AF37" />}
            label={isAr ? 'شروط الخدمة والخصوصية' : 'Terms & Privacy'}
            onClick={() => setActiveModal('terms')}
          />
        </div>
      </div>

      {/* Preferences Modal */}
      <Modal isOpen={activeModal === 'preferences'} onClose={() => setActiveModal(null)} title={isAr ? 'تفضيلات البيانات' : 'Data Preferences'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', backgroundColor: '#1E1E1E', borderRadius: '12px', border: '1px solid #262626' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>{isAr ? 'العروض المخصصة' : 'Personalized Offers'}</div>
              <div style={{ fontSize: '11px', color: '#A3A3A3', marginTop: '1px' }}>{isAr ? 'اقتراحات المكافآت والعروض' : 'Tailored rewards'}</div>
            </div>
            <input type="checkbox" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#D4AF37', cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', backgroundColor: '#1E1E1E', borderRadius: '12px', border: '1px solid #262626' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>{isAr ? 'تحليلات المتاجر' : 'Merchant Analytics'}</div>
              <div style={{ fontSize: '11px', color: '#A3A3A3', marginTop: '1px' }}>{isAr ? 'مشاركة إحصاءات مجهولة المصدر' : 'Anonymized stats'}</div>
            </div>
            <input type="checkbox" checked={shareData} onChange={(e) => setShareData(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#D4AF37', cursor: 'pointer' }} />
          </div>

          <PrimaryButton onClick={() => setActiveModal(null)}>
            {isAr ? 'حفظ' : 'Save'}
          </PrimaryButton>
        </div>
      </Modal>

      {/* Export Data Modal */}
      <Modal isOpen={activeModal === 'export'} onClose={() => setActiveModal(null)} title={isAr ? 'تصدير البيانات' : 'Export Data'}>
        {exportSuccess ? (
          <div style={{ textAlign: 'center', padding: '18px 0' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.12)',
                color: '#D4AF37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px auto',
              }}
            >
              <Check size={24} />
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>{isAr ? 'تم بدء التصدير' : 'Export Initiated'}</h4>
            <p style={{ fontSize: '12px', color: '#A3A3A3', marginTop: '4px' }}>{isAr ? 'سيتم إرسال الملف إلى بريدك المسجل.' : 'Sent to your email shortly.'}</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <p style={{ fontSize: '13px', color: '#A3A3A3', marginBottom: '18px', lineHeight: '1.4' }}>
              {isAr ? 'تحميل أرشيف العمليات والإيصالات المسجلة.' : 'Download complete archive of transactions and receipts.'}
            </p>
            <PrimaryButton onClick={handleExportData}>
              {isAr ? 'تصدير الملف (CSV)' : 'Export CSV'}
            </PrimaryButton>
          </div>
        )}
      </Modal>

      {/* Privacy Statement Modal */}
      <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title={isAr ? 'شروط الخصوصية' : 'Privacy Statement'}>
        <div style={{ maxHeight: '260px', overflowY: 'auto', fontSize: '12.5px', color: '#A3A3A3', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ margin: 0 }}><strong style={{ color: '#FFFFFF' }}>{isAr ? '١. جمع المعلومات:' : '1. Information Collection:'}</strong> {isAr ? 'جمع البيانات الأساسية للتوثيق الأمني والامتثال المصرفي.' : 'Basic data collection for security and compliance.'}</p>
          <p style={{ margin: 0 }}><strong style={{ color: '#FFFFFF' }}>{isAr ? '٢. تشفير البيانات:' : '2. Data Encryption:'}</strong> {isAr ? 'جميع العمليات مشفرة بأعلى معايير الأمان TLS 1.3.' : 'All data encrypted via TLS 1.3 and 256-bit AES.'}</p>
          <p style={{ margin: 0 }}><strong style={{ color: '#FFFFFF' }}>{isAr ? '٣. حماية الخصوصية:' : '3. Privacy Protection:'}</strong> {isAr ? 'لا تتم مشاركة بياناتك إلا مع البنوك المصرحة لتنفيذ المعاملات.' : 'Data shared strictly with authorized settlement banks.'}</p>
        </div>
      </Modal>
    </div>
  );
};
