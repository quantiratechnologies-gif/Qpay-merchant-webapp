import React, { useState } from 'react';
import { HelpCircle, MessageSquare, PhoneCall, ChevronDown, ChevronUp, Send, Check, ShieldAlert } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { ListRow } from '../components/ListRow';
import { Modal } from '../components/Modal';
import { useApp } from '../state/AppContext';

export const HelpSupportScreen: React.FC = () => {
  const { language, isRtl } = useApp();
  const isAr = language === 'العربية';

  const [activeModal, setActiveModal] = useState<'chat' | 'call' | 'dispute' | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: isAr ? 'مرحباً بك! كيف يمكنني مساعدتك في حساب كيو تي باي اليوم؟' : 'Hello! How can I assist you with your QTPay account today?',
      time: isAr ? 'الآن' : 'Just now',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [disputeSuccess, setDisputeSuccess] = useState(false);
  const [disputeTxnId, setDisputeTxnId] = useState('');
  const [disputeReason, setDisputeReason] = useState('');

  const faqs = [
    {
      q: isAr ? 'كم يستغرق استرداد مبالغ سريع؟' : 'How long does a Sarie refund take?',
      a: isAr
        ? 'يتم إيداع استرداد سريع الفوري خلال ثوانٍ إلى ساعتين. وفي حالات نادرة قد يستغرق حتى ٢٤ ساعة وفق إجراءات البنك المستقبل.'
        : 'Instant Sarie refunds are usually credited within seconds to 1-2 hours. In rare bank network delays, it can take up to 24 hours.',
    },
    {
      q: isAr ? 'ما هو الحد اليومي للتحويل عبر سريع؟' : 'What is the daily Sarie transfer limit?',
      a: isAr
        ? 'الحد اليومي القياسي للعمليات الفورية هو ٥٠,٠٠٠ ر.س عبر القنوات البنكية المعتمدة من ساما.'
        : 'The standard daily Sarie instant transaction limit is SAR 50,000 across digital banking apps.',
    },
    {
      q: isAr ? 'كيف أضيف حساباً بنكياً سعودياً جديداً؟' : 'How do I add a new Saudi bank account?',
      a: isAr
        ? 'انتقل إلى حسابات التسوية > اضغط إضافة بنك، ثم اختر البنك وأدخل رقم الآيبان المعتمد.'
        : 'Go to Profile > Bank Accounts > tap Add Bank, select your Saudi bank, and verify your mobile number via SMS.',
    },
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: isAr ? 'الآن' : 'Just now' },
    ]);
    setInputMsg('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: isAr
            ? `شكراً لتواصلك بخصوص "${userText}". فريق الدعم الفني يراجع استفسارك وسيقوم بالرد خلال لحظات.`
            : `Thank you for reaching out regarding "${userText}". Our customer support team is reviewing your inquiry and will respond shortly.`,
          time: isAr ? 'الآن' : 'Just now',
        },
      ]);
    }, 1000);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisputeSuccess(true);
    setTimeout(() => {
      setDisputeSuccess(false);
      setActiveModal(null);
      setDisputeTxnId('');
      setDisputeReason('');
    }, 1500);
  };

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: '#080C14',
        minHeight: '100%',
        paddingBottom: '36px',
        color: '#FFFFFF',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <AppHeader title={isAr ? 'المساعدة والدعم' : 'Help & Support'} showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* Priority Hero Banner */}
        <div
          style={{
            backgroundColor: '#111726',
            background: 'radial-gradient(ellipse at top, rgba(127, 232, 127, 0.14) 0%, #111726 70%)',
            border: '1.5px solid rgba(127, 232, 127, 0.35)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: 'rgba(127, 232, 127, 0.14)',
              color: '#7FE87F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px auto',
              border: '1px solid rgba(127, 232, 127, 0.3)',
            }}
          >
            <HelpCircle size={24} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            {isAr ? 'دعم فني ٢٤/٧' : '24/7 Support'}
          </h3>
          <p style={{ fontSize: '12px', color: '#A2A2BA', marginTop: '4px', marginBottom: 0 }}>
            {isAr ? 'مساعدة فورية وحل الاعتراضات' : 'Instant help and dispute resolution'}
          </p>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 800, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', marginInlineStart: '4px' }}>
          {isAr ? 'قنوات التواصل' : 'Contact Channels'}
        </div>

        <div style={{ backgroundColor: '#111726', border: '1px solid #2C2C44', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', boxShadow: 'none' }}>
          <ListRow
            icon={<MessageSquare size={18} color="#7FE87F" />}
            label={isAr ? 'المحادثة المباشرة' : 'Live Chat'}
            subLabel={isAr ? 'رد فوري' : 'Instant response'}
            onClick={() => setActiveModal('chat')}
          />
          <div style={{ height: '1px', backgroundColor: '#2C2C44', margin: '0 16px' }} />
          <ListRow
            icon={<PhoneCall size={18} color="#7FE87F" />}
            label={isAr ? 'الرقم المجاني' : 'Toll-Free Hotline'}
            subLabel="800-123-QTPAY"
            onClick={() => setActiveModal('call')}
          />
          <div style={{ height: '1px', backgroundColor: '#2C2C44', margin: '0 16px' }} />
          <ListRow
            icon={<ShieldAlert size={18} color="#7FE87F" />}
            label={isAr ? 'الاعتراضات' : 'Disputes'}
            subLabel={isAr ? 'رفع شكوى على عملية' : 'File a dispute'}
            onClick={() => setActiveModal('dispute')}
          />
        </div>

        {/* FAQs */}
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', marginInlineStart: '4px' }}>
          {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div
                key={index}
                className="interactive-tap"
                style={{
                  backgroundColor: '#111726',
                  border: '1px solid #2C2C44',
                  borderRadius: '16px',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  boxShadow: 'none',
                }}
                onClick={() => setExpandedFaq(isExpanded ? null : index)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>{faq.q}</span>
                  {isExpanded ? <ChevronUp size={16} color="#7FE87F" /> : <ChevronDown size={16} color="#6E6E85" />}
                </div>
                {isExpanded && (
                  <p style={{ fontSize: '12.5px', color: '#A2A2BA', marginTop: '10px', marginBottom: 0, lineHeight: '1.5', borderTop: '1px solid #2C2C44', paddingTop: '10px' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Chat Modal */}
      <Modal isOpen={activeModal === 'chat'} onClose={() => setActiveModal(null)} title={isAr ? 'المحادثة الفورية' : 'Live Support'}>
        <div style={{ height: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px', paddingRight: '4px' }}>
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={msg.sender === 'user' ? 'gold-gradient-btn' : ''}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? undefined : '#151524',
                color: msg.sender === 'user' ? '#080C14' : '#FFFFFF',
                border: msg.sender === 'user' ? 'none' : '1px solid #2C2C44',
                padding: '10px 14px',
                borderRadius: '14px',
                maxWidth: '80%',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder={isAr ? 'اكتب استفسارك هنا...' : 'Type your message...'}
            style={{ flex: 1, padding: '12px 14px', borderRadius: '12px', border: '1px solid #2C2C44', backgroundColor: '#151524', color: '#FFFFFF', fontSize: '13px', outline: 'none', textAlign: isRtl ? 'right' : 'left' }}
          />
          <button
            type="submit"
            className="interactive-tap gold-gradient-btn"
            style={{ border: 'none', color: '#080C14', padding: '0 16px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', boxShadow: 'none' }}
          >
            <Send size={16} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </form>
      </Modal>

      {/* Hotline Call Modal */}
      <Modal isOpen={activeModal === 'call'} onClose={() => setActiveModal(null)} title={isAr ? 'الرقم المجاني الموحد' : 'Toll-Free Hotline'}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'rgba(127, 232, 127, 0.14)',
              color: '#7FE87F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              border: '1.5px solid rgba(127, 232, 127, 0.3)',
            }}
          >
            <PhoneCall size={28} />
          </div>
          <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0', direction: 'ltr' }}>800-123-QTPAY</h4>
          <p style={{ fontSize: '12.5px', color: '#A2A2BA', margin: '0 0 20px 0' }}>
            {isAr ? 'متاح على مدار الساعة بالعربية والإنجليزية (مجاني داخل المملكة)' : 'Available 24x7 in Arabic and English (Toll-Free in KSA)'}
          </p>
          <a
            href="tel:80012378729"
            className="interactive-tap gold-gradient-btn"
            style={{ display: 'inline-block', padding: '12px 28px', color: '#080C14', borderRadius: '14px', fontWeight: 800, fontSize: '14px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(127, 232, 127, 0.25)' }}
          >
            {isAr ? 'اتصل الآن' : 'Call Now'}
          </a>
        </div>
      </Modal>

      {/* Report Dispute Modal */}
      <Modal isOpen={activeModal === 'dispute'} onClose={() => setActiveModal(null)} title={isAr ? 'رفع اعتراض على عملية' : 'Report Dispute'}>
        {disputeSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(127, 232, 127, 0.14)',
                color: '#7FE87F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <Check size={28} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>
              {isAr ? 'تم تسجيل الاعتراض بنجاح' : 'Dispute Filed'}
            </h4>
            <p style={{ fontSize: '12px', color: '#A2A2BA', marginTop: '4px' }}>
              {isAr ? 'رقم التذكرة: ' : 'Ticket #'}AP-DISP-{Math.floor(100000 + Math.random() * 900000)}
            </p>
          </div>
        ) : (
          <form onSubmit={handleDisputeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                {isAr ? 'المرجع البنكي للعملية (UTR)' : 'Transaction UTR'}
              </label>
              <input
                type="text"
                value={disputeTxnId}
                onChange={(e) => setDisputeTxnId(e.target.value)}
                placeholder={isAr ? 'مثال: UTR984729104821' : 'e.g. UTR984729104821'}
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #2C2C44', backgroundColor: '#151524', color: '#FFFFFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                {isAr ? 'سبب الاعتراض والتفاصيل' : 'Dispute Reason'}
              </label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder={isAr ? 'اشرح المشكلة بالتفصيل...' : 'Describe what went wrong...'}
                rows={3}
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #2C2C44', backgroundColor: '#151524', color: '#FFFFFF', fontSize: '13px', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
              />
            </div>

            <button
              type="submit"
              className="interactive-tap gold-gradient-btn"
              style={{
                marginTop: '8px',
                padding: '14px',
                borderRadius: '14px',
                color: '#080C14',
                border: 'none',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(127, 232, 127, 0.25)',
              }}
            >
              {isAr ? 'إرسال الاعتراض' : 'Submit Dispute'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
