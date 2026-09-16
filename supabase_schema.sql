-- ==============================================================================
-- QPAY SAUDI REAL-TIME FINTECH SUPABASE SCHEMA
-- Enables Row Level Security (RLS), Realtime replication, and Seed Data
-- ==============================================================================

-- 1. Create Profiles Table (Users & Merchants)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mobile TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'merchant', 'admin')),
    full_name TEXT NOT NULL,
    business_name TEXT,
    cr_number TEXT,
    vat_number TEXT,
    national_id TEXT,
    is_kyc_verified BOOLEAN DEFAULT TRUE,
    avatar_initials TEXT,
    upi_id TEXT UNIQUE,
    settlement_bank TEXT DEFAULT 'Al Rajhi Bank',
    settlement_iban TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Bank Accounts Table
CREATE TABLE IF NOT EXISTS public.bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    account_number_masked TEXT NOT NULL,
    iban TEXT,
    account_type TEXT DEFAULT 'Current Account',
    balance NUMERIC(15, 2) DEFAULT 0.00,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Transactions & Merchant Collections Ledger
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_ref TEXT UNIQUE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    receiver_name TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    vat_amount NUMERIC(15, 2) DEFAULT 0.00,
    net_amount NUMERIC(15, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('mada', 'visa', 'mastercard', 'apple_pay', 'stc_pay', 'sarie_instant')),
    status TEXT NOT NULL DEFAULT 'settled' CHECK (status IN ('settled', 'refunded', 'pending')),
    card_last4 TEXT DEFAULT '9082',
    zatca_qr_code TEXT,
    category TEXT DEFAULT 'Retail / POS',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Merchant Settlements Table
CREATE TABLE IF NOT EXISTS public.merchant_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    settlement_batch_id TEXT UNIQUE NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    bank_name TEXT NOT NULL,
    iban_masked TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'settled' CHECK (status IN ('settled', 'processing', 'failed')),
    rail TEXT DEFAULT 'Sarie Instant',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create App Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('success', 'info', 'alert')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ENABLE SUPABASE REALTIME
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.merchant_settlements;

-- ==============================================================================
-- ENABLE RLS & PERMISSIVE POLICIES (For universal seamless multi-app demo)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public read bank_accounts" ON public.bank_accounts FOR SELECT USING (true);
CREATE POLICY "Allow public insert bank_accounts" ON public.bank_accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bank_accounts" ON public.bank_accounts FOR UPDATE USING (true);

CREATE POLICY "Allow public read transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert transactions" ON public.transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update transactions" ON public.transactions FOR UPDATE USING (true);

CREATE POLICY "Allow public read settlements" ON public.merchant_settlements FOR SELECT USING (true);
CREATE POLICY "Allow public insert settlements" ON public.merchant_settlements FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update notifications" ON public.notifications FOR UPDATE USING (true);

-- ==============================================================================
-- SEED INITIAL DATA (SAUDI FINTECH REALISTIC DATA)
-- ==============================================================================

-- 1. Insert Merchant & User Profiles
INSERT INTO public.profiles (id, mobile, role, full_name, business_name, cr_number, vat_number, national_id, is_kyc_verified, avatar_initials, upi_id, settlement_bank, settlement_iban)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', '0501234567', 'merchant', 'Fahad Al-Otaibi', 'Quantira Gourmet Cafe', '1010789234', '310984729100003', '1089234812', true, 'QG', 'quantira@sarie', 'Al Rajhi Bank', 'SA44 8000 0456 6080 1012 3456'),
  ('a0000000-0000-0000-0000-000000000002', '0559876543', 'customer', 'Sara Al-Ghamdi', NULL, NULL, NULL, '1076294819', true, 'SG', 'sara@sarie', 'SNB AlAhli', 'SA03 1000 0012 3456 7890 1234'),
  ('a0000000-0000-0000-0000-000000000003', '0561122334', 'customer', 'Mohammed Al-Shehri', NULL, NULL, NULL, '1092847192', true, 'MS', 'mohammed@sarie', 'Riyad Bank', 'SA22 2000 0001 2345 6789 0123')
ON CONFLICT (mobile) DO NOTHING;

-- 2. Insert Bank Accounts
INSERT INTO public.bank_accounts (user_id, bank_name, account_number_masked, iban, account_type, balance, is_primary)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Al Rajhi Bank', '•••• 4521', 'SA44 8000 0456 6080 1012 3456', 'Corporate Business Account', 84920.50, true),
  ('a0000000-0000-0000-0000-000000000002', 'SNB AlAhli', '•••• 7812', 'SA03 1000 0012 3456 7890 1234', 'Salary Current Account', 12450.00, true),
  ('a0000000-0000-0000-0000-000000000003', 'Riyad Bank', '•••• 9023', 'SA22 2000 0001 2345 6789 0123', 'Savings Account', 4890.00, true)
ON CONFLICT DO NOTHING;

-- 3. Insert Realistic Saudi Transactions (mada, Apple Pay, Sarie)
INSERT INTO public.transactions (order_ref, sender_id, sender_name, receiver_id, receiver_name, amount, vat_amount, net_amount, payment_method, status, card_last4, category)
VALUES
  ('SAR-8921-QR', 'a0000000-0000-0000-0000-000000000002', 'Sara Al-Ghamdi', 'a0000000-0000-0000-0000-000000000001', 'Quantira Gourmet Cafe', 145.00, 18.91, 126.09, 'apple_pay', 'settled', '8819', 'Dining & Cafes'),
  ('SAR-8922-POS', 'a0000000-0000-0000-0000-000000000003', 'Mohammed Al-Shehri', 'a0000000-0000-0000-0000-000000000001', 'Quantira Gourmet Cafe', 48.00, 6.26, 41.74, 'mada', 'settled', '4021', 'Beverages & Coffee'),
  ('SAR-8923-TAP', NULL, 'Customer (mada NFC)', 'a0000000-0000-0000-0000-000000000001', 'Quantira Gourmet Cafe', 320.00, 41.74, 278.26, 'mada', 'settled', '1920', 'Catering Orders'),
  ('SAR-8924-SRI', 'a0000000-0000-0000-0000-000000000002', 'Sara Al-Ghamdi', 'a0000000-0000-0000-0000-000000000001', 'Quantira Gourmet Cafe', 75.50, 9.85, 65.65, 'sarie_instant', 'settled', '0000', 'Direct Sarie Instant')
ON CONFLICT (order_ref) DO NOTHING;
