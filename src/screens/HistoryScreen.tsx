import React, { useState } from 'react';
import { Search, X, Receipt } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { TransactionRow } from '../components/TransactionRow';
import { useApp } from '../state/AppContext';
import { translateText } from '../utils/i18n';

type FilterType = 'all' | 'sent' | 'received' | 'pending';

export const HistoryScreen: React.FC = () => {
  const { transactions, t, isRtl, language } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'sent'
        ? t.type === 'sent'
        : filter === 'received'
        ? t.type === 'received'
        : t.type === 'pending';

    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.subTitle && t.subTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.utr.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const groupedByDate: Record<string, typeof transactions> = {};
  filteredTransactions.forEach((t) => {
    const key = t.date || 'TODAY';
    if (!groupedByDate[key]) groupedByDate[key] = [];
    groupedByDate[key].push(t);
  });

  const getFilterLabel = (f: FilterType) => {
    if (language === 'العربية') {
      if (f === 'all') return 'الكل';
      if (f === 'sent') return 'المدفوعات';
      if (f === 'received') return 'المستلمة';
      if (f === 'pending') return 'قيد الانتظار';
    }
    return f;
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#080C14', minHeight: '100%', paddingBottom: '96px' }}>
      <AppHeader
        title={t('history.title', 'Transactions')}
        showSearch
        onSearchClick={() => setShowSearchInput(!showSearchInput)}
      />

      {showSearchInput && (
        <div style={{ padding: '0 20px', marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#111726',
              border: '1px solid rgba(127, 232, 127, 0.4)',
              borderRadius: '12px',
              padding: '10px 14px',
              boxShadow: '0 0 16px rgba(127, 232, 127, 0.12)',
            }}
          >
            <Search size={16} color="#7FE87F" />
            <input
              type="text"
              placeholder={language === 'العربية' ? 'البحث بالاسم أو المرجع البنكي...' : 'Search by name or UTR...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                width: '100%',
                textAlign: isRtl ? 'right' : 'left',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6E6E85',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter Tabs / Chips */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '0 20px',
          marginBottom: '18px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {(['all', 'sent', 'received', 'pending'] as FilterType[]).map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`interactive-tap ${isActive ? 'gold-gradient-btn' : ''}`}
              style={{
                backgroundColor: isActive ? undefined : '#151524',
                border: isActive ? 'none' : '1px solid #2C2C44',
                color: isActive ? '#080C14' : '#A2A2BA',
                borderRadius: '20px',
                padding: '7px 16px',
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'capitalize',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 2px 10px rgba(127, 232, 127, 0.25)' : 'none',
              }}
            >
              {getFilterLabel(f)}
            </button>
          );
        })}
      </div>

      {/* Grouped Transaction Lists */}
      <div style={{ padding: '0 20px', marginBottom: '24px' }}>
        {Object.keys(groupedByDate).length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              backgroundColor: '#111726',
              border: '1px solid #2C2C44',
              borderRadius: '16px',
              padding: '40px 20px',
              color: '#A2A2BA',
              boxShadow: 'none',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#182236',
                color: '#7FE87F',
                border: '1px solid rgba(127, 232, 127, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <Receipt size={24} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
              {language === 'العربية' ? 'لا توجد عمليات' : 'No transactions'}
            </div>
            <div style={{ fontSize: '13px', marginTop: '4px', color: '#6E6E85' }}>
              {language === 'العربية' ? 'جرّب تعديل البحث أو الفلاتر' : 'Try adjusting your search or filters'}
            </div>
          </div>
        ) : (
          Object.entries(groupedByDate).map(([dateLabel, items]) => (
            <div key={dateLabel} style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '12px', fontWeight: 500, color: '#A2A2BA',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  marginInlineStart: '4px',
                }}
              >
                {translateText(dateLabel, language)}
              </div>
              <div
                style={{
                  backgroundColor: '#111726',
                  border: '1px solid #2C2C44',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  padding: '8px 8px 0 8px',
                  boxShadow: 'none',
                }}
              >
                {items.map((txn) => (
                  <TransactionRow key={txn.id} transaction={txn} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
