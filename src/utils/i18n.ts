export type SupportedLanguage = 'English' | 'العربية' | 'en' | 'ar' | string;

export const toArabicNumerals = (val: string | number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return val
    .toString()
    .replace(/\d/g, (digit) => arabicDigits[parseInt(digit, 10)])
    .replace(/\./g, '٫')
    .replace(/,/g, '٬');
};

export const TRANSLATIONS: Record<string, { en: string; ar: string }> = {
  // Brand & Common UI
  'app.name': { en: 'QTPay', ar: 'كيو تي باي' },
  'app.tagline': { en: 'QUICK. TRUSTED. PAYMENTS.', ar: 'مدفوعات أعمال فورية وموثوقة' },
  'powered.by': { en: 'Powered by Quantira Technologies', ar: 'مشغل بواسطة تقنيات كوانتيرا' },
  'lang.ar': { en: 'Arabic', ar: 'العربية' },
  'lang.en': { en: 'English', ar: 'الإنجليزية' },
  'lang.switch_pill_ar': { en: '🇸🇦 عربي', ar: '🇸🇦 عربي' },
  'lang.switch_pill_en': { en: '🇬🇧 EN', ar: '🇬🇧 EN' },
  'lang.select_language': { en: 'Select Language', ar: 'اختر لغة التطبيق' },
  'merchant.badge': { en: 'MERCHANT', ar: 'التاجر' },

  // Navigation Links
  'nav.home': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'nav.overview': { en: 'Overview', ar: 'لوحة التحكم الرئيسية' },
  'nav.softpos': { en: 'SoftPOS Tap', ar: 'الدفع باللمس بالجوال' },
  'nav.accounts': { en: 'SoftPOS', ar: 'الدفع باللمس' },
  'nav.pay': { en: 'Pay Links', ar: 'روابط الدفع الرقمية' },
  'nav.pay_links': { en: 'Pay Links', ar: 'روابط الدفع الرقمية' },
  'nav.scan': { en: 'PAY QR', ar: 'رمز الدفع PAY QR' },
  'nav.zatca_qr': { en: 'PAY QR', ar: 'رمز الدفع PAY QR' },
  'nav.statements': { en: 'Statements', ar: 'كشوفات الحساب' },
  'nav.collections': { en: 'Collections', ar: 'التحصيلات' },
  'nav.settlements': { en: 'Settlements', ar: 'التسويات' },
  'nav.history': { en: 'Collections', ar: 'التحصيلات' },
  'nav.analytics': { en: 'Analytics', ar: 'التحليلات والتقارير' },
  'nav.insights': { en: 'Insights', ar: 'التحليلات' },
  'nav.soundbox': { en: 'SoundBox', ar: 'جهاز الإشعار الصوتي' },
  'nav.settings': { en: 'Settings', ar: 'الإعدادات العامة' },
  'nav.security': { en: 'Security & Staff', ar: 'الكاشيرات والأمان' },
  'nav.alerts': { en: 'Alerts & Activity', ar: 'التنبيهات وسجل النشاط' },
  'nav.bank_iban': { en: 'Bank IBAN', ar: 'حساب التسوية البنكي' },
  'nav.business_setup': { en: 'Business & Tax Info', ar: 'بيانات المنشأة والضريبة' },
  'nav.cards': { en: 'Terminals', ar: 'الأجهزة' },
  'nav.profile': { en: 'My Store', ar: 'متجري' },
  'nav.exit': { en: 'Exit', ar: 'خروج' },

  // Categories & Sections
  'cat.operations': { en: 'Operations', ar: 'العمليات الأساسية' },
  'cat.management': { en: 'Management', ar: 'إدارة المنشأة' },
  'cat.statements': { en: 'Statements', ar: 'كشوفات الحساب' },
  'cat.settings': { en: 'Settings', ar: 'الإعدادات' },

  // Buttons & Actions
  'btn.back': { en: 'Back', ar: 'رجوع' },
  'btn.continue': { en: 'Continue', ar: 'متابعة' },
  'btn.verify': { en: 'Verify', ar: 'تحقق' },
  'btn.confirm': { en: 'Confirm', ar: 'تأكيد' },
  'btn.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'btn.done': { en: 'Done', ar: 'تم' },
  'btn.close': { en: 'Close', ar: 'إغلاق' },
  'btn.share': { en: 'Share Receipt', ar: 'مشاركة الإيصال' },
  'btn.copied': { en: 'Copied', ar: 'تم النسخ' },
  'btn.copy': { en: 'Copy', ar: 'نسخ' },
  'btn.refund': { en: 'Refund', ar: 'استرداد' },
  'btn.collect': { en: 'Charge', ar: 'تحصيل' },
  'btn.save': { en: 'Save Changes', ar: 'حفظ التغييرات' },
  'btn.logout': { en: 'Log Out', ar: 'تسجيل الخروج' },
  'btn.add_bank': { en: 'Add Bank Account', ar: 'إضافة حساب بنكي' },
  'btn.edit_profile': { en: 'Edit Profile', ar: 'تعديل الملف' },
  'btn.export_csv': { en: 'Export CSV', ar: 'تصدير CSV' },
  'btn.download_invoice': { en: 'Tax Invoice', ar: 'فاتورة ضريبية' },
  'btn.view_all': { en: 'View All', ar: 'عرض الكل' },
  'btn.settle_now': { en: 'Settle Now', ar: 'تسوية فورية' },
  'btn.clear': { en: 'Clear', ar: 'مسح' },
  'btn.autofill': { en: 'Autofill', ar: 'تعبئة تلقائية' },
  'btn.resend': { en: 'Resend', ar: 'إعادة الإرسال' },
  'btn.new_charge': { en: 'New Charge', ar: 'عملية جديدة' },
  'btn.create_link': { en: 'Create Payment Link', ar: 'إنشاء رابط دفع' },
  'btn.share_whatsapp': { en: 'Share via WhatsApp', ar: 'مشاركة عبر واتساب' },
  'btn.download_poster': { en: 'Download Poster', ar: 'تحميل الملصق' },

  // Search & Global Header
  'search.placeholder': {
    en: 'Search collections, UTR, transactions, customers, invoices...',
    ar: 'بحث سريع في التحصيلات، العمليات، الفواتير، المرجع البنكي...',
  },
  'search.pages_features': { en: 'Pages & Features', ar: 'الصفحات والأقسام' },
  'search.collections_txns': { en: 'Transactions & Collections', ar: 'العمليات والتحصيلات' },
  'search.no_matches': { en: 'No matches found for', ar: 'لم يتم العثور على نتائج لـ' },
  'search.esc_dismiss': { en: 'ESC to dismiss', ar: 'ESC للإغلاق' },
  'search.jump': { en: 'Jump', ar: 'انتقال' },
  'search.title': { en: 'QPay Merchant Search', ar: 'بحث تاجر كيو باي' },

  // Verification Badges & Compliance
  'badge.wathq_zatca': { en: 'Wathq & ZATCA Verified', ar: 'موثق واثق وزكاة' },
  'badge.sama_zatca': { en: 'SAMA & ZATCA Verified', ar: 'موثق من ساما وهيئة الزكاة' },
  'badge.rails_list': { en: 'mada • Sarie • Wathq', ar: 'مدى • سريع • واثق' },
  'badge.nfc': { en: 'NFC', ar: 'NFC' },
  'badge.phase2': { en: 'Phase 2', ar: 'المرحلة ٢' },
  'badge.active': { en: 'Active', ar: 'نشط' },
  'badge.live': { en: 'Live', ar: 'مباشر' },

  // Dashboard & Overview KPI
  'home.today_total': { en: 'Today Total Amount', ar: 'إجمالي اليوم' },
  'home.total_txns': { en: 'Total Transactions', ar: 'عدد العمليات اليوم' },
  'home.avg_ticket': { en: 'Average Ticket', ar: 'متوسط قيمة العملية' },
  'home.vat_included': { en: 'Includes 15% VAT breakdown', ar: 'شامل ١٥٪ ضريبة القيمة المضافة' },
  'home.vs_yesterday': { en: '+18.4% vs yesterday', ar: '+١٨٫٤٪ مقارنة بالأمس' },
  'home.accepted_rails_sub': { en: 'mada, Apple Pay, & Cards', ar: 'مدى وأبل باي والبطاقات' },
  'home.accept_channels': { en: 'Accept Payment Channels', ar: 'طرق تحصيل وقبول المدفوعات' },
  'home.cash_sales': { en: 'Cash Sales', ar: 'سجل النقد' },
  'home.live_ledger': { en: 'Live Collections Ledger', ar: 'أحدث التحصيلات المباشرة' },
  'home.live_ledger_sub': {
    en: 'Real-time ZATCA Phase 2 compliant transactions',
    ar: 'سجل العمليات المتوافقة مع ضريبة القيمة المضافة ١٥٪',
  },
  'home.view_full_ledger': { en: 'View Full Ledger', ar: 'عرض الكل' },
  'home.instant_payout': { en: 'Instant Sarie Payout', ar: 'محطة التسوية الفورية' },
  'home.sarie_247': { en: 'Sarie 24/7', ar: 'سريع ٢٤/٧' },
  'home.dest_iban': { en: 'Destination IBAN', ar: 'الحساب البنكي المعتمد' },
  'home.store_qr': { en: 'Store Stand QR', ar: 'باركود المتجر المعتمد' },
  'home.get_poster': { en: 'Get Poster', ar: 'تحميل الملصق' },
  'home.processing_payout': { en: 'Processing Payout...', ar: 'جاري التحويل عبر سريع...' },

  // Table Columns
  'table.customer_method': { en: 'Customer / Method', ar: 'العميل / الطريقة' },
  'table.sarie_ref': { en: 'Sarie Reference', ar: 'المرجع البنكي UTR' },
  'table.reference': { en: 'Reference', ar: 'المرجع' },
  'table.time': { en: 'Time', ar: 'الوقت' },
  'table.timestamp': { en: 'Timestamp', ar: 'الوقت' },
  'table.status': { en: 'Status', ar: 'الحالة' },
  'table.amount': { en: 'Amount', ar: 'المبلغ' },
  'table.vat': { en: 'VAT', ar: 'الضريبة' },
  'table.action': { en: 'Action', ar: 'إجراء' },
  'table.bank': { en: 'Bank', ar: 'البنك' },
  'table.type': { en: 'Type', ar: 'النوع' },
  'table.settlement_ref': { en: 'Settlement Ref', ar: 'مرجع التسوية' },
  'table.utr': { en: 'Sarie UTR', ar: 'مرجع سريع UTR' },

  // Transaction Statuses
  'status.settled': { en: 'Settled', ar: 'مكتملة' },
  'status.refunded': { en: 'Refunded', ar: 'مستردة' },
  'status.in_progress': { en: 'Processing', ar: 'قيد المعالجة' },
  'status.failed': { en: 'Failed', ar: 'غير مكتملة' },
  'status.instant': { en: 'Instant', ar: 'فوري' },
  'status.auto': { en: 'Auto', ar: 'تلقائي' },

  // Payment Methods
  'method.mada': { en: 'mada Card', ar: 'بطاقة مدى' },
  'method.softpos_mada': { en: 'mada Contactless', ar: 'مدى اللاتلامسية' },
  'method.applepay': { en: 'Apple Pay', ar: 'أبل باي' },
  'method.softpos_applepay': { en: 'Apple Pay', ar: 'أبل باي' },
  'method.visa': { en: 'VISA', ar: 'فيزا' },
  'method.mastercard': { en: 'Mastercard', ar: 'ماستركارد' },
  'method.zatca_qr': { en: 'ZATCA QR', ar: 'رمز زاتكا' },
  'method.cash': { en: 'Cash Sale', ar: 'نقدي' },
  'method.payment_link': { en: 'Payment Link', ar: 'رابط دفع' },

  // SoftPOS Terminal & Checkout Modes
  'softpos.title': { en: 'SoftPOS Terminal', ar: 'نقطة البيع (SoftPOS Terminal)' },
  'softpos.subtitle': {
    en: 'Supermarket & Retail Checkout • Card, Cash & Online QR',
    ar: 'محطة الكاشير ونقاط البيع • بطاقات، نقدي وباركود أونلاين',
  },
  'softpos.tab_card': { en: 'Card', ar: 'بطاقة' },
  'softpos.tab_cash': { en: 'Cash', ar: 'نقداً' },
  'softpos.tab_online': { en: 'Online / QR', ar: 'دفع إلكتروني' },
  'softpos.total_charge': { en: 'TOTAL CHARGE AMOUNT', ar: 'المبلغ المطلوب تحصيله' },
  'softpos.rail_scheme': { en: 'Card Network / Rail', ar: 'شبكة وطريقة الدفع' },
  'softpos.tax_summary': { en: 'ZATCA Tax Invoice Summary', ar: 'تفاصيل الفاتورة الضريبية (زاتكا)' },
  'softpos.taxable_subtotal': { en: 'Taxable Subtotal', ar: 'المبلغ الصافي الخاضع للضريبة' },
  'softpos.vat_15': { en: 'VAT (15%)', ar: 'ضريبة القيمة المضافة (١٥٪)' },
  'softpos.gross_total': { en: 'Gross Total', ar: 'المجموع النهائي' },
  'softpos.cash_tendered': { en: 'Cash Received', ar: 'المبلغ المستلم من العميل' },
  'softpos.change_due': { en: 'Change Due', ar: 'الباقي للمشتري' },
  'softpos.remaining_due': { en: 'Remaining Due', ar: 'المبلغ المتبقي' },
  'softpos.exact_amount': { en: 'Exact', ar: 'بالضبط' },
  'softpos.charge_cash_cta': { en: 'Confirm Cash & Issue Receipt', ar: 'إتمام الدفع نقداً وإصدار الفاتورة' },
  'softpos.charge_online_cta': { en: 'Confirm QR Payment', ar: 'تأكيد الدفع بالباركود' },
  'softpos.simulate_qr_scan': { en: 'Simulate Customer Scan & Pay', ar: 'محاكاة مسح ودفع العميل' },
  'softpos.online_qr_title': { en: 'Dynamic Pay QR Code', ar: 'باركود الدفع الفوري (PAY QR)' },
  'softpos.online_qr_desc': {
    en: 'Customer scans with Banking App / Apple Pay to complete instant payment',
    ar: 'يقوم العميل بمسح الباركود عبر تطبيقه البنكي أو أبل باي لإتمام الدفع فوراً',
  },
  'softpos.copy_pay_link': { en: 'Copy Pay Link', ar: 'نسخ رابط الدفع' },
  'softpos.pay_link_copied': { en: 'Pay Link Copied!', ar: 'تم نسخ الرابط!' },
  'softpos.order_ref_label': {
    en: 'Invoice / Order Reference (Optional)',
    ar: 'رقم الفاتورة أو ملاحظة (اختياري)',
  },
  'softpos.order_ref_placeholder': {
    en: 'e.g., Order #1092 or Cashier 1',
    ar: 'مثال: طلب #١٠٩ أو كاشير ١',
  },
  'softpos.charge_cta': {
    en: 'Tap / Pay with Card',
    ar: 'ادفع بتمرير البطاقة',
  },

  // Tap Card NFC Screen
  'tap.waiting_title': { en: 'Hold Card or Phone to Back of Device', ar: 'مرر البطاقة أو الجوال خلف الجهاز' },
  'tap.waiting_sub': {
    en: 'Accepts Contactless Debit Cards, Apple Pay, Visa, and Mastercard',
    ar: 'يدعم البطاقات البنكية وأبل باي وفيزا وماستركارد اللاتلامسية',
  },
  'tap.reading_title': { en: 'Reading Contactless Chip...', ar: 'جاري قراءة الشريحة اللاتلامسية...' },
  'tap.reading_sub': {
    en: 'Please keep the card still until authorization finishes',
    ar: 'يرجى إبقاء البطاقة ثابتة حتى انتهاء التفويض',
  },
  'tap.auth_title': { en: 'Authorizing with Banking Network...', ar: 'جاري التفويض مع الشبكة البنكية...' },
  'tap.success_title': { en: 'Payment Approved!', ar: 'تمت العملية بنجاح!' },
  'tap.success_sub': {
    en: 'Instantly settled to your bank account via Sarie',
    ar: 'تمت التسوية الفورية إلى حسابك البنكي عبر سريع',
  },
  'tap.awaiting_card': { en: 'Awaiting Card', ar: 'انتظار البطاقة' },
  'tap.reading': { en: 'Reading', ar: 'جاري القراءة' },
  'tap.authorizing': { en: 'Authorizing', ar: 'جاري التفويض' },
  'tap.approved': { en: 'Approved', ar: 'مقبولة' },
  'tap.terminal_label': { en: 'SoftPOS Terminal • NFC Contactless', ar: 'نقطة بيع SoftPOS • اللاتلامسية NFC' },

  // Payment Received & Receipt
  'receipt.title': { en: 'Payment Receipt & E-Invoice', ar: 'إيصال التحصيل والفوترة' },
  'receipt.subtitle': {
    en: 'ZATCA Phase 2 e-invoice with instant settlement record',
    ar: 'فاتورة زاتكا إلكترونية مع سجل التسوية الفورية',
  },
  'receipt.approved': { en: 'Payment Approved', ar: 'تمت العملية بنجاح' },
  'receipt.direct_settle': { en: 'Direct settlement to', ar: 'تسوية مباشرة إلى' },
  'receipt.settled_sarie': { en: 'Settled via Sarie', ar: 'تمت التسوية عبر سريع' },
  'receipt.e_invoice': { en: 'ZATCA Phase 2 E-Invoice', ar: 'فاتورة زاتكا الإلكترونية' },
  'receipt.store': { en: 'Store', ar: 'المتجر' },
  'receipt.cr': { en: 'Commercial Reg (CR)', ar: 'السجل التجاري' },
  'receipt.vat_id': { en: 'VAT Registration', ar: 'الرقم الضريبي' },
  'receipt.invoice_ref': { en: 'Invoice Reference', ar: 'مرجع الفاتورة' },
  'receipt.taxable_amount': { en: 'Taxable Amount', ar: 'المبلغ الخاضع للضريبة' },
  'receipt.vat_amount': { en: '15% VAT Amount', ar: 'مبلغ ضريبة القيمة المضافة' },
  'receipt.total_gross': { en: 'Total Gross (SAR)', ar: 'الإجمالي شامل الضريبة' },
  'receipt.soundbox_alert': { en: 'Play SoundBox Voice Alert', ar: 'تشغيل تنبيه الصوت' },
  'receipt.share_cta': { en: 'Share Receipt', ar: 'مشاركة الإيصال' },
  'receipt.new_charge_cta': { en: 'Start New Charge', ar: 'عملية جديدة' },

  // Payment Links
  'links.title': { en: 'Digital Payment Links', ar: 'روابط الدفع الرقمية (Smart Payment Links)' },
  'links.subtitle': {
    en: 'Create, share, and track remote payment links via WhatsApp, SMS, or Email',
    ar: 'إنشاء ومشاركة روابط تحصيل رقمية مع العملاء عبر واتساب والرسائل النصية والبريد الإلكتروني',
  },
  'links.form_title': { en: 'Create New Payment Link', ar: 'بيانات رابط الدفع الجديد' },
  'links.customer_name': { en: 'Customer Name', ar: 'اسم العميل' },
  'links.customer_placeholder': { en: 'e.g., Mohammed Al-Ghamdi', ar: 'مثال: محمد الغامدي' },
  'links.charge_amount': { en: 'Charge Amount (SAR)', ar: 'المبلغ المطلوب تحصيله (ر.س)' },
  'links.order_ref': { en: 'Order / Invoice Reference', ar: 'رقم الطلب / المرجع' },
  'links.generate_btn': { en: 'Generate Link', ar: 'توليد الرابط' },
  'links.ready_title': { en: 'Payment Link Ready', ar: 'رابط الدفع جاهز للمشاركة' },
  'links.copy_btn': { en: 'Copy Link', ar: 'نسخ الرابط' },
  'links.share_wa': { en: 'Share on WhatsApp', ar: 'مشاركة عبر واتساب' },
  'links.test_checkout': { en: 'Test Live Customer Checkout', ar: 'تجربة محاكاة دفع العميل' },
  'links.simulating': { en: 'Simulating...', ar: 'جاري محاكاة الدفع...' },

  // ZATCA QR Generator
  'zatca.generator_title': { en: 'ZATCA Dynamic QR Generator', ar: 'مُولِّد رمز الفاتورة الضريبية زاتكا' },
  'zatca.generator_sub': {
    en: 'Create Phase 2 compliant TLV encrypted QR codes for print & display',
    ar: 'إنشاء رمز استجابة سريعة مشفر TLV متوافق مع متطلبات هيئة الزكاة والضريبة والجمارك',
  },
  'zatca.invoice_details': { en: 'Invoice Parameters', ar: 'بيانات الفاتورة' },
  'zatca.invoice_amount': { en: 'Invoice Amount (Incl. VAT)', ar: 'مبلغ الفاتورة الإجمالي (شامل الضريبة)' },
  'zatca.store_name': { en: 'Store Name', ar: 'اسم المنشأة' },
  'zatca.cr_num': { en: 'Commercial Registration (CR)', ar: 'السجل التجاري' },
  'zatca.vat_num': { en: 'ZATCA VAT ID', ar: 'الرقم الضريبي' },
  'zatca.download_qr': { en: 'Download QR Image', ar: 'تنزيل صورة الباركود' },
  'zatca.print_poster': { en: 'Print Stand Display', ar: 'طباعة ملصق المتجر' },
  'zatca.tlv_inspector': { en: 'TLV Encrypted Data Inspector', ar: 'محلل تشفير زاتكا TLV' },
  'zatca.compliant_phase2': { en: 'ZATCA Phase 2 Validated', ar: 'معتمد ومطابق للمرحلة الثانية' },

  // Statements & Collections
  'statements.title': { en: 'Collections & Settlements', ar: 'التحصيلات والتسويات' },
  'statements.subtitle': {
    en: 'Full transaction ledger with Sarie instant settlement',
    ar: 'سجل العمليات الكامل مع تسوية سريع الفورية',
  },
  'statements.unsettled_title': { en: "Today's Unsettled Payout", ar: 'رصيد التحصيلات غير المسوى' },
  'statements.bank_account': { en: 'Bank Account:', ar: 'الحساب البنكي:' },
  'statements.daily_auto': { en: 'Daily 06:00 AM', ar: 'يومياً ٠٦:٠٠ ص' },
  'statements.history_title': { en: 'Sarie Settlement History', ar: 'سجل التسويات البنكية (سريع)' },
  'statements.count_label': { en: 'Settlements', ar: 'تسويات' },
  'statements.empty_category': { en: 'No transactions in this category', ar: 'لا توجد عمليات في هذا التصنيف' },
  'statements.filter_all': { en: 'All', ar: 'الكل' },
  'statements.filter_cards': { en: 'Cards', ar: 'بطاقات' },
  'statements.filter_apple': { en: 'Apple Pay', ar: 'أبل باي' },
  'statements.filter_zatca': { en: 'ZATCA QR', ar: 'رمز زاتكا' },
  'statements.filter_cash': { en: 'Cash', ar: 'نقدي' },
  'statements.filter_links': { en: 'Links', ar: 'روابط' },
  'statements.refund_modal_title': { en: 'Transaction Details & Refund', ar: 'تفاصيل العملية والاسترداد' },
  'statements.refund_pin_label': {
    en: 'Enter 4-Digit Merchant PIN to Refund',
    ar: 'أدخل الرمز السري للتاجر (٤ أرقام للاسترداد)',
  },
  'statements.refund_auth_cta': { en: 'Authorize Refund', ar: 'تأكيد الاسترداد' },
  'statements.refund_processing': { en: 'Processing Refund...', ar: 'جاري معالجة الاسترداد...' },
  'statements.refund_success_msg': {
    en: 'returned to customer bank account.',
    ar: 'إلى حساب العميل البنكي فورياً.',
  },

  // Insights & Analytics
  'insights.title': { en: 'Insights & Analytics', ar: 'التحليلات والمؤشرات' },
  'insights.subtitle': {
    en: 'Real-time sales breakdown, peak transaction hours, and payment rail distribution',
    ar: 'مؤشرات المبيعات المباشرة، ساعات الذروة وتوزيع قنوات الدفع',
  },
  'insights.total_vol': { en: 'Total Collection Volume', ar: 'إجمالي حجم المبيعات' },
  'insights.peak_hour': { en: 'Peak Velocity Window', ar: 'ساعة الذروة' },
  'insights.peak_window_val': { en: '11:00 AM – 01:00 PM', ar: '١١:٠٠ ص – ٠١:٠٠ م' },
  'insights.speed_label': { en: 'Avg Tap-to-Pay Speed', ar: 'متوسط سرعة الدفع اللاتلامسي' },
  'insights.speed_val': { en: '1.2 seconds', ar: '١٫٢ ثانية' },
  'insights.rail_distribution': { en: 'Payment Rail Distribution', ar: 'توزيع قنوات الدفع' },
  'insights.hourly_chart': { en: 'Hourly Transaction Velocity', ar: 'حركة العمليات بالساعة' },
  'insights.tab_today': { en: 'Today', ar: 'اليوم' },
  'insights.tab_week': { en: 'This Week', ar: 'هذا الأسبوع' },
  'insights.tab_month': { en: 'This Month', ar: 'هذا الشهر' },

  // SoundBox Screen
  'soundbox.title': { en: 'Smart SoundBox Notifier', ar: 'صندوق الصوت الذكي للإشعارات' },
  'soundbox.subtitle': {
    en: 'Real-time multilingual voice broadcast device for instant payment confirmation',
    ar: 'جهاز الإشعار الصوتي الفوري لتأكيد عمليات الدفع باللغتين العربية والإنجليزية',
  },
  'soundbox.status_online': { en: 'SoundBox Device Online & Ready', ar: 'جهاز الصوت متصل وجاهز للعمل' },
  'soundbox.mac_label': { en: 'Device ID / MAC:', ar: 'معرف الجهاز / MAC:' },
  'soundbox.audio_language': { en: 'Broadcast Language', ar: 'لغة الإشعار الصوتي' },
  'soundbox.volume': { en: 'Speaker Volume', ar: 'مستوى الصوت' },
  'soundbox.test_cta': { en: 'Test Live Voice Alert', ar: 'اختبار الإشعار الصوتي التجريبي' },
  'soundbox.activity_log': { en: 'Live Broadcast Log', ar: 'سجل الإشعارات الصوتية المباشرة' },

  // Security Screen
  'security.title': { en: 'Security & Staff Cashier PINs', ar: 'الأمان وإدارة رموز الكاشيرات' },
  'security.subtitle': {
    en: 'Manage authorized cashiers, staff access PINs, and device login sessions',
    ar: 'إدارة الكاشيرات المصرح لهم، رموز الدخول وصلاحيات أجهزة نقاط البيع',
  },
  'security.manager_pin_card': { en: 'Merchant Manager PIN', ar: 'الرمز السري الرئيسي للمدير' },
  'security.manager_pin_sub': {
    en: 'Used to authorize instant payouts, refunds, and store setup changes',
    ar: 'يستخدم لتفويض التسويات الفورية وعمليات الاسترداد وتعديل الحساب البنكي',
  },
  'security.change_pin_btn': { en: 'Change Manager PIN', ar: 'تغيير رمز المدير' },
  'security.cashiers_list': { en: 'Staff & Cashier Terminals', ar: 'الكاشيرات ونقاط البيع' },
  'security.add_cashier_btn': { en: 'Add New Cashier', ar: 'إضافة كاشير جديد' },
  'security.cashier_name': { en: 'Cashier Name', ar: 'اسم الكاشير' },
  'security.cashier_pin': { en: 'Terminal PIN', ar: 'رمز الجهاز' },
  'security.cashier_status': { en: 'Status', ar: 'الحالة' },
  'security.sessions_title': { en: 'Active Device Sessions', ar: 'جلسات الأجهزة النشطة' },
  'security.terminate_session': { en: 'End Session', ar: 'إنهاء الجلسة' },
  'security.current_device': { en: 'Current Device', ar: 'الجهاز الحالي' },

  // Notifications Screen
  'notif.title': { en: 'Alerts & System Notifications', ar: 'التنبيهات وإشعارات النظام' },
  'notif.subtitle': {
    en: 'Real-time payment receipts, settlement dispatches, and security logs',
    ar: 'إشعارات التحصيل اللحظية، إيداعات سريع الفورية وسجلات الأمان',
  },
  'notif.filter_all': { en: 'All Notifications', ar: 'جميع التنبيهات' },
  'notif.filter_unread': { en: 'Unread', ar: 'غير مقروءة' },
  'notif.mark_all_read': { en: 'Mark all as read', ar: 'تحديد الكل كمقروء' },
  'notif.empty': { en: 'No notifications', ar: 'لا توجد إشعارات' },
  'notif.empty_sub': { en: "You're all caught up.", ar: 'أنت على اطلاع بكل جديد.' },

  // Settlement Bank Screen
  'bank.title': { en: 'Bank IBAN & Settlement Account', ar: 'حساب التسوية البنكي والآيبان' },
  'bank.subtitle': {
    en: 'Verified Saudi corporate account for 24/7 instant Sarie payouts',
    ar: 'الحساب البنكي السعودي المعتمد لإيداع مبيعات المتجر عبر سريع على مدار الساعة',
  },
  'bank.active_account': { en: 'Current Settlement Account', ar: 'حساب التسوية الحالي' },
  'bank.iban_verified': { en: 'SAMA & Sarie Linked', ar: 'موثق لدى البنك المركزي وسريع' },
  'bank.switch_account_btn': { en: 'Change Settlement IBAN', ar: 'تحديث الحساب البنكي' },
  'bank.supported_banks': { en: 'Supported Saudi National Banks', ar: 'البنوك السعودية المعتمدة' },

  // Business Profile / Setup Screen
  'setup.title': { en: 'Business & Tax Profile', ar: 'بيانات المنشأة والضريبة' },
  'setup.subtitle': {
    en: 'Commercial registration, ZATCA tax identifier, and business store details',
    ar: 'بيانات السجل التجاري، الرقم الضريبي لزاتكا ومعلومات المتجر',
  },
  'setup.business_name': { en: 'Business / Store Name', ar: 'اسم المنشأة / المتجر' },
  'setup.category': { en: 'Business Category', ar: 'النشاط التجاري' },
  'setup.city': { en: 'Operating City', ar: 'المدينة' },
  'setup.postal_code': { en: 'Postal Code', ar: 'الرمز البريدي' },
  'setup.cr_number': { en: 'Commercial Registration (CR)', ar: 'رقم السجل التجاري' },
  'setup.vat_number': { en: 'ZATCA VAT ID', ar: 'الرقم الضريبي (١٥ رقم)' },
  'setup.save_btn': { en: 'Save Business Profile', ar: 'حفظ بيانات المنشأة' },

  // Auth: Mobile Number Screen
  'auth.signin_title': { en: 'Merchant Sign In', ar: 'تسجيل دخول التاجر' },
  'auth.signin_sub': {
    en: 'Manage your SoftPOS, sales & instant daily settlements',
    ar: 'إدارة نقاط البيع، المبيعات والتحصيلات اليومية',
  },
  'auth.manager_name': { en: 'Merchant / Manager Name', ar: 'اسم التاجر / المفوض' },
  'auth.mobile_number': { en: 'Registered Mobile Number', ar: 'رقم الجوال المعتمد' },
  'auth.demo_profiles': { en: 'Quick Demo Profiles for QA', ar: 'حسابات تجريبية سريعة للمعاينة' },
  'auth.continue_verify': { en: 'Continue to Verification', ar: 'متابعة وتسجيل الدخول' },
  'auth.no_account': { en: "Don't have a merchant account?", ar: 'ليس لديك حساب منشأة؟' },
  'auth.create_new': { en: 'Create Account', ar: 'إنشاء حساب جديد' },

  // Auth: SMS OTP Screen
  'otp.sms_header': { en: 'SMS OTP • Messages', ar: 'رسالة نصية • الآن' },
  'otp.portal_code': { en: 'Merchant Portal Code: ', ar: 'رمز تحقق بوابة التاجر: ' },
  'otp.mobile_link': { en: 'Mobile Number', ar: 'رقم الجوال' },
  'otp.enter_code_title': { en: 'Enter Verification Code', ar: 'رمز التحقق السريع' },
  'otp.sent_to': { en: 'Sent via SMS OTP to', ar: 'تم إرسال رمز التحقق إلى الرقم' },
  'otp.demo_helper': { en: 'Default Demo OTP: 589204', ar: 'الرمز التجريبي الافتراضي: 589204' },
  'otp.resend_success': { en: 'New code dispatched successfully!', ar: 'تم إرسال رمز جديد بنجاح' },
  'otp.verify_btn': { en: 'Verify & Enter Dashboard', ar: 'تأكيد ودخول البوابة' },
  'otp.verifying': { en: 'Authenticating...', ar: 'جاري التحقق...' },

  // Auth: Registration Flow
  'reg.title': { en: 'Merchant Onboarding & Registration', ar: 'تسجيل منشأة جديدة' },
  'reg.step1': { en: '1. Identity', ar: '١. الهوية' },
  'reg.step2': { en: '2. Store Profile', ar: '٢. بيانات المتجر' },
  'reg.step3': { en: '3. Tax & Banking', ar: '٣. الضريبة والبنك' },

  // Auth: PIN Setup
  'pinsetup.title': { en: 'Set Merchant Security PIN', ar: 'تعيين الرمز السري للتاجر' },
  'pinsetup.sub': {
    en: 'Create a 4-digit PIN to authorize refunds and instant Sarie payouts',
    ar: 'عيّن رمزاً سرياً مكوناً من ٤ أرقام لتفويض عمليات الاسترداد والتسويات',
  },
  'pinsetup.confirm_title': { en: 'Confirm Merchant PIN', ar: 'تأكيد الرمز السري' },
  'pinsetup.confirm_sub': { en: 'Re-enter your 4-digit PIN', ar: 'أعد إدخال الرمز السري المكون من ٤ أرقام' },
  'pinsetup.save_btn': { en: 'Save PIN & Enter Dashboard', ar: 'حفظ الرمز والدخول إلى لوحة التحكم' },

  // Modals & Dialogs
  'modal.manager_pin_title': { en: 'Authorize Instant Settlement', ar: 'تأكيد التسوية الفورية عبر سريع' },
  'modal.manager_pin_sub': {
    en: 'Enter Manager Security PIN to dispatch Sarie instant payout',
    ar: 'أدخل رمز المدير السري لإتمام الصرف الفوري',
  },
  'modal.logout_title': { en: 'Log Out of Merchant Portal', ar: 'تسجيل الخروج من البوابة' },
  'modal.logout_confirm': {
    en: 'Are you sure you want to end your active merchant session?',
    ar: 'هل أنت متأكد من رغبتك في تسجيل الخروج وإنهاء الجلسة؟',
  },
  'modal.add_bank_title': { en: 'Add Saudi Bank Account', ar: 'إضافة حساب بنكي سعودي' },
  'modal.edit_profile_title': { en: 'Edit Merchant Profile', ar: 'تعديل الملف الشخصي' },

  // Saudi Banks
  'Al Rajhi Bank': { en: 'Al Rajhi Bank', ar: 'مصرف الراجحي' },
  'Saudi National Bank (SNB)': { en: 'Saudi National Bank (SNB)', ar: 'البنك الأهلي السعودي (SNB)' },
  'Riyad Bank': { en: 'Riyad Bank', ar: 'بنك الرياض' },
  'Alinma Bank': { en: 'Alinma Bank', ar: 'مصرف الإنماء' },
  'Saudi Awwal Bank (SAB)': { en: 'Saudi Awwal Bank (SAB)', ar: 'البنك السعودي الأول (SAB)' },
  'Arab National Bank (anb)': { en: 'Arab National Bank (anb)', ar: 'البنك العربي الوطني (anb)' },
  'Banque Saudi Fransi': { en: 'Banque Saudi Fransi', ar: 'البنك السعودي الفرنسي' },
  'Bank AlJazira': { en: 'Bank AlJazira', ar: 'بنك الجزيرة' },

  // Cities
  'Riyadh': { en: 'Riyadh', ar: 'الرياض' },
  'Jeddah': { en: 'Jeddah', ar: 'جدة' },
  'Dammam': { en: 'Dammam', ar: 'الدمام' },
  'Khobar': { en: 'Khobar', ar: 'الخبر' },
  'Makkah': { en: 'Makkah', ar: 'مكة المكرمة' },
  'Madinah': { en: 'Madinah', ar: 'المدينة المنورة' },

  // Business Categories
  'Grocery & Daily Essentials': { en: 'Grocery & Daily Essentials', ar: 'بقالة وتموينات' },
  'Food & Dining': { en: 'Food & Dining', ar: 'مطاعم ومقاهي' },
  'Shopping & Retail': { en: 'Shopping & Retail', ar: 'تجارة تجزئة وتسوق' },
  'Electronics & Digital': { en: 'Electronics & Digital', ar: 'إلكترونيات وأجهزة' },
  'Fuel & Automotive': { en: 'Fuel & Automotive', ar: 'محطات وقود وسيارات' },
  'Healthcare & Pharmacy': { en: 'Healthcare & Pharmacy', ar: 'صيدليات ورعاية صحية' },
  'Professional Services': { en: 'Professional Services', ar: 'خدمات مهنية وأعمال' },

  // Demo Names & Places
  'Starmart Supermarket': { en: 'Starmart Supermarket', ar: 'تموينات ستار مارت' },
  'Quantira Gourmet Cafe': { en: 'Quantira Gourmet Cafe', ar: 'مقهى كوانتيرا' },
  'Fahad Al-Harbi': { en: 'Fahad Al-Harbi', ar: 'فهد الحربي' },
  'Sara Al-Mansoor': { en: 'Sara Al-Mansoor', ar: 'سارة المنصور' },
  'Tariq Al-Otaibi': { en: 'Tariq Al-Otaibi', ar: 'طارق العتيبي' },
  'Mohammed Al-Ghamdi': { en: 'Mohammed Al-Ghamdi', ar: 'محمد الغامدي' },
  'Abdullah Al-Shehri': { en: 'Abdullah Al-Shehri', ar: 'عبدالله الشهري' },
  'Sara Al-Ghamdi': { en: 'Sara Al-Ghamdi', ar: 'سارة الغامدي' },
  'Al-Madinah Supermarket': { en: 'Al-Madinah Supermarket', ar: 'سوبرماركت المدينة' },
  'Riyadh Retail Cafe': { en: 'Riyadh Retail Cafe', ar: 'مقهى الرياض' },
  'GreenLeaf Markets LLC': { en: 'GreenLeaf Markets LLC', ar: 'أسواق الورقة الخضراء' },

  // Relative Dates
  'Today': { en: 'Today', ar: 'اليوم' },
  'TODAY': { en: 'TODAY', ar: 'اليوم' },
  'Yesterday': { en: 'Yesterday', ar: 'أمس' },
  'YESTERDAY': { en: 'YESTERDAY', ar: 'أمس' },
  'Just now': { en: 'Just now', ar: 'الآن' },
  'Active Now': { en: 'Active Now', ar: 'نشط الآن' },
  '2 days ago': { en: '2 days ago', ar: 'منذ يومين' },
  '3 days ago': { en: '3 days ago', ar: 'منذ ٣ أيام' },
};

export const translateText = (
  keyOrText: string,
  language: SupportedLanguage = 'English',
  defaultText?: string
): string => {
  if (!keyOrText) return defaultText || '';
  const isAr = language === 'العربية' || language === 'ar';

  // 1. Direct match by key
  const directMatch = TRANSLATIONS[keyOrText];
  if (directMatch) {
    return isAr ? directMatch.ar : directMatch.en;
  }

  // 2. Case-insensitive text match
  const trimmed = keyOrText.trim();
  const lowerKey = trimmed.toLowerCase();
  for (const [k, v] of Object.entries(TRANSLATIONS)) {
    if (k.toLowerCase() === lowerKey || v.en.toLowerCase() === lowerKey || v.ar === trimmed) {
      return isAr ? v.ar : v.en;
    }
  }

  // 3. Dynamic date string translations like "Today, 11:42 AM" or "Yesterday, 08:30 PM"
  if (trimmed.startsWith('Today, ') || trimmed.startsWith('Today ') || trimmed.startsWith('TODAY')) {
    const timePart = trimmed.replace(/^Today,?\s*/i, '');
    if (isAr) {
      const arTime = timePart
        .replace(/AM/gi, 'ص')
        .replace(/PM/gi, 'م')
        .replace(/\d/g, (d) => ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'][parseInt(d, 10)]);
      return `اليوم، ${arTime}`;
    }
    return `Today, ${timePart}`;
  }

  if (trimmed.startsWith('Yesterday, ') || trimmed.startsWith('Yesterday ') || trimmed.startsWith('YESTERDAY')) {
    const timePart = trimmed.replace(/^Yesterday,?\s*/i, '');
    if (isAr) {
      const arTime = timePart
        .replace(/AM/gi, 'ص')
        .replace(/PM/gi, 'م')
        .replace(/\d/g, (d) => ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'][parseInt(d, 10)]);
      return `أمس، ${arTime}`;
    }
    return `Yesterday, ${timePart}`;
  }

  return defaultText || keyOrText;
};

export const formatSaudiCurrency = (
  amount: number,
  language: SupportedLanguage = 'English'
): string => {
  const isAr = language === 'العربية' || language === 'ar';
  const formattedNum = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  if (isAr) {
    return `${toArabicNumerals(formattedNum)} ر.س`;
  }
  return `SAR ${formattedNum}`;
};

export const formatLocalizedNumber = (
  val: string | number,
  language: SupportedLanguage = 'English'
): string => {
  const isAr = language === 'العربية' || language === 'ar';
  if (isAr) {
    return toArabicNumerals(val);
  }
  return val.toString();
};

export const formatLocalizedDate = (
  date: Date,
  language: SupportedLanguage = 'English'
): string => {
  const isAr = language === 'العربية' || language === 'ar';
  if (isAr) {
    return new Intl.DateTimeFormat('ar-SA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const getLocalizedPaymentMethod = (
  method: string,
  language: SupportedLanguage = 'English'
): string => {
  const isAr = language === 'العربية' || language === 'ar';
  if (method === 'softpos_mada' || method.includes('mada')) {
    return isAr ? 'مدى اللاتلامسية' : 'mada Contactless';
  }
  if (method === 'softpos_applepay' || method.includes('apple')) {
    return isAr ? 'أبل باي' : 'Apple Pay';
  }
  if (method === 'softpos_visa' || method.includes('visa')) {
    return isAr ? 'فيزا اللاتلامسية' : 'VISA Contactless';
  }
  if (method === 'softpos_mastercard' || method.includes('mastercard')) {
    return isAr ? 'ماستركارد اللاتلامسية' : 'Mastercard Contactless';
  }
  if (method === 'zatca_qr' || method === 'online_qr' || method === 'pay_qr') {
    return isAr ? 'دفع إلكتروني (PAY QR)' : 'Online Pay QR';
  }
  if (method === 'cash') {
    return isAr ? 'دفع نقدي مباشر' : 'Cash Payment';
  }
  if (method === 'payment_link') {
    return isAr ? 'رابط دفع رقمي' : 'Digital Pay Link';
  }
  return translateText(method, language);
};
