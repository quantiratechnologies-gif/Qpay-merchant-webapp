import React from 'react';
import type { Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useApp } from '../state/AppContext';
import { translateText } from '../utils/i18n';

interface TransactionRowProps {
  transaction: Transaction;
  onClick?: () => void;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  onClick,
}) => {
  const { language } = useApp();
  const isAr = language === 'العربية';
  const isReceived = transaction.type === 'received';

  const defaultSub = isReceived
    ? (isAr ? 'مستلمة عبر سريع' : 'Received via Sarie')
    : (isAr ? 'مدفوعة عبر سريع' : 'Paid via Sarie');
  const displayTitle = translateText(transaction.title, language);
  const displaySub = translateText(transaction.subTitle || defaultSub, language);
  const displayDate = translateText(transaction.date, language);

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          onClick();
        }
      }}
      className={onClick ? 'interactive-tap' : ''}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        backgroundColor: '#171717',
        border: '1px solid #262626',
        borderRadius: '14px',
        marginBottom: '10px',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: 'none',
        transition: 'border-color 0.15s ease, transform 0.1s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: isReceived ? 'rgba(212, 175, 55, 0.12)' : '#1F1F1F',
            border: `1px solid ${isReceived ? 'rgba(212, 175, 55, 0.35)' : '#2A2A2A'}`,
            color: isReceived ? '#D4AF37' : '#FFFFFF',
            fontWeight: 800,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {transaction.avatarInitials || transaction.title.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '14px', color: '#FFFFFF', lineHeight: '18px' }}>
            {displayTitle}
          </div>
          <div style={{ fontSize: '11.5px', color: '#A3A3A3', marginTop: '2px' }}>
            {displaySub} &bull; {transaction.utr.substring(0, 10)}
          </div>
        </div>
      </div>

      <div style={{ textAlign: language === 'العربية' ? 'left' : 'right' }}>
        <div
          className="tabular-nums"
          style={{
            fontWeight: 900,
            fontSize: '15px',
            color: isReceived ? '#D4AF37' : '#FFFFFF',
          }}
        >
          {isReceived ? '+' : '-'}{formatCurrency(transaction.amount, language)}
        </div>
        <div style={{ fontSize: '10.5px', color: '#737373', marginTop: '2px', fontWeight: 600 }}>
          {displayDate}
        </div>
      </div>
    </div>
  );
};
