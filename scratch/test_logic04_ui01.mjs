import { chromium } from 'playwright';

async function testAll() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('=== TEST 1: CARD CHARGE FAILURE (SOFTPOS_TAP) ===');
  await page.goto('http://localhost:5174/?screen=SOFTPOS_TERMINAL');
  await page.waitForTimeout(1000);

  // Click quick add "+50"
  await page.click('button:has-text("+50")');
  await page.waitForTimeout(300);

  // Click Card charge CTA button (navigates to SOFTPOS_TAP)
  console.log('Clicking Card charge CTA...');
  await page.click('button:has-text("mada & EMV"), button:has-text("SoftPOS Tap")');
  await page.waitForTimeout(500);

  // Now on SOFTPOS_TAP: wait for payment flow to run (1200ms + 800ms + processCollection throw)
  console.log('Waiting for TapCardScreen authorization to fail...');
  await page.waitForTimeout(3500);

  const cardFailHeading = page.locator('text=Transaction Failed, text=فشلت العملية').first();
  const isCardFailVisible = await cardFailHeading.isVisible().catch(() => false);
  const cardFailErrorText = await page.locator('text=Payment authorization failed, text=تعذر إتمام عملية الدفع').first().textContent().catch(() => '');
  const urlAfterCard = page.url();
  console.log('Card Payment Failure Status:');
  console.log('  - Error heading visible:', isCardFailVisible ? 'YES (PASS)' : 'NO (FAIL)');
  console.log('  - Error message text:', cardFailErrorText.trim());
  console.log('  - Navigated to Success screen:', urlAfterCard.includes('SUCCESS') ? 'YES (BUG)' : 'NO (PASSED)');

  console.log('\n=== TEST 2: CASH CHARGE FAILURE ===');
  await page.goto('http://localhost:5174/?screen=SOFTPOS_TERMINAL');
  await page.waitForTimeout(1000);

  // Click quick add "+50"
  await page.click('button:has-text("+50")');
  await page.waitForTimeout(300);

  // Switch to Cash tab
  console.log('Switching to Cash tab...');
  await page.click('button:has-text("Cash"), button:has-text("نقدي")');
  await page.waitForTimeout(300);

  // Click Cash collect button (handleCashCharge)
  console.log('Clicking Cash collect button...');
  await page.click('button:has-text("Confirm Cash Collection"), button:has-text("تأكيد التحصيل وإصدار الفاتورة")');
  await page.waitForTimeout(800);

  const cashErrorAlert = page.locator('text=Cash collection failed, text=فشلت عملية التحصيل النقدي').first();
  const isCashErrorVisible = await cashErrorAlert.isVisible().catch(() => false);
  const cashErrorText = await cashErrorAlert.textContent().catch(() => '');
  console.log('Cash Charge Failure Status:');
  console.log('  - Error alert visible:', isCashErrorVisible ? 'YES (PASS)' : 'NO (FAIL)');
  console.log('  - Error message text:', cashErrorText.trim());
  console.log('  - Navigated to Success screen:', page.url().includes('SUCCESS') ? 'YES (BUG)' : 'NO (PASSED)');

  console.log('\n=== TEST 3: ONLINE QR CHARGE FAILURE ===');
  // Switch to Online tab
  console.log('Switching to Online Pay tab...');
  await page.click('button:has-text("Online Pay"), button:has-text("الدفع برمز QR")');
  await page.waitForTimeout(300);

  // Click Online charge button (handleOnlineCharge)
  console.log('Clicking Online Charge button...');
  await page.click('button:has-text("Generate & Settle Online Pay"), button:has-text("إصدار رمز QR وتسوية فورية")');
  await page.waitForTimeout(800);

  const qrErrorAlert = page.locator('text=Online payment processing failed, text=فشلت عملية الدفع الإلكتروني').first();
  const isQrErrorVisible = await qrErrorAlert.isVisible().catch(() => false);
  const qrErrorText = await qrErrorAlert.textContent().catch(() => '');
  console.log('Online QR Failure Status:');
  console.log('  - Error alert visible:', isQrErrorVisible ? 'YES (PASS)' : 'NO (FAIL)');
  console.log('  - Error message text:', qrErrorText.trim());
  console.log('  - Navigated to Success screen:', page.url().includes('SUCCESS') ? 'YES (BUG)' : 'NO (PASSED)');

  console.log('\n=== TEST 4: UI-01 SIDEBAR SETTLEMENTS HIGHLIGHT ===');
  await page.goto('http://localhost:5174/?screen=MERCHANT_COLLECTIONS');
  await page.waitForTimeout(1000);

  // Check initial Collections item in sidebar
  const sidebarCollections = page.locator('nav button:has-text("Collections"), nav button:has-text("التحصيلات")').first();
  const initialCollectionsClass = await sidebarCollections.getAttribute('class');
  console.log('Initial Sidebar Collections active:', initialCollectionsClass?.includes('text-[#7FE87F]') ? 'YES' : 'NO');

  // Click "Settlements" tab inside Collections screen (Dual Tab control)
  console.log('Clicking dual-tab "Settlements" tab inside Collections screen...');
  const screenSettlementsTab = page.locator('div:has-text("Collections") > button:has-text("Settlements"), button:has-text("Settlements")').filter({ hasNot: page.locator('nav *') }).first();
  await screenSettlementsTab.click();
  await page.waitForTimeout(600);

  // Check sidebar Settlements item
  const sidebarSettlements = page.locator('nav button:has-text("Settlements"), nav button:has-text("التسويات")').first();
  const settlementsClass = await sidebarSettlements.getAttribute('class');
  const collectionsClassAfter = await sidebarCollections.getAttribute('class');

  const isSettlementsActiveInSidebar = settlementsClass?.includes('text-[#7FE87F]');
  const isCollectionsActiveInSidebar = collectionsClassAfter?.includes('text-[#7FE87F]');

  console.log('After clicking Settlements tab:');
  console.log('  - Sidebar "Settlements" highlighted (green):', isSettlementsActiveInSidebar ? 'YES (PASS)' : 'NO (FAIL)');
  console.log('  - Sidebar "Collections" active:', isCollectionsActiveInSidebar ? 'YES (BUG)' : 'NO (PASSED)');

  await browser.close();
}

testAll().catch(console.error);
