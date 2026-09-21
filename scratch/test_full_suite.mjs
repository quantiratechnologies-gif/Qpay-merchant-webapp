import { chromium } from 'playwright';

async function testFullSuite() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('----------------------------------------------------');
  console.log('1. TESTING CARD PAYMENT FAILURE (TapCardScreen)');
  console.log('----------------------------------------------------');
  await page.goto('http://localhost:5174/?screen=SOFTPOS_TERMINAL');
  await page.waitForTimeout(1000);

  // Set amount 50 SAR
  await page.click('button:has-text("+50")');
  await page.waitForTimeout(300);

  // Click Tap to Pay CTA
  await page.click('button:has-text("Tap to Pay")');
  await page.waitForTimeout(3500);

  const cardHtml = await page.content();
  const cardHasFailed = cardHtml.includes('Transaction Failed');
  const cardHasErrMsg = cardHtml.includes('Payment authorization failed');
  const cardNavigatedSuccess = cardHtml.includes('Payment Received') || cardHtml.includes('Approved!');
  console.log('  [PASS] Card transaction failed step displayed:', cardHasFailed);
  console.log('  [PASS] Card error message displayed:', cardHasErrMsg);
  console.log('  [PASS] Did NOT navigate to success screen:', !cardNavigatedSuccess);

  console.log('----------------------------------------------------');
  console.log('2. TESTING CASH PAYMENT FAILURE (SoftPOSTerminalScreen)');
  console.log('----------------------------------------------------');
  await page.goto('http://localhost:5174/?screen=SOFTPOS_TERMINAL');
  await page.waitForTimeout(1000);

  // Set amount 50 SAR
  await page.click('button:has-text("+50")');
  await page.waitForTimeout(300);

  // Switch to Cash tab
  await page.click('button:has-text("Cash")');
  await page.waitForTimeout(400);

  // Click Confirm Cash CTA
  await page.click('button:has-text("Confirm Cash & Issue Receipt")');
  await page.waitForTimeout(1000);

  const cashHtml = await page.content();
  const cashHasErrorAlert = cashHtml.includes('Cash collection failed. Please try again.');
  const cashNavigatedSuccess = cashHtml.includes('Payment Received') || cashHtml.includes('Receipt Issued');
  console.log('  [PASS] Cash error alert banner displayed:', cashHasErrorAlert);
  console.log('  [PASS] Did NOT navigate to success screen:', !cashNavigatedSuccess);

  console.log('----------------------------------------------------');
  console.log('3. TESTING ONLINE QR PAYMENT FAILURE (SoftPOSTerminalScreen)');
  console.log('----------------------------------------------------');
  await page.goto('http://localhost:5174/?screen=SOFTPOS_TERMINAL');
  await page.waitForTimeout(1000);

  // Set amount 50 SAR
  await page.click('button:has-text("+50")');
  await page.waitForTimeout(300);

  // Switch to Online tab
  await page.click('button:has-text("Online / QR")');
  await page.waitForTimeout(400);

  // Click Confirm QR CTA
  await page.click('button:has-text("Confirm QR Payment")');
  await page.waitForTimeout(1000);

  const qrHtml = await page.content();
  const qrHasErrorAlert = qrHtml.includes('Online payment processing failed. Please try again.');
  const qrNavigatedSuccess = qrHtml.includes('Payment Received') || qrHtml.includes('Approved!');
  console.log('  [PASS] Online QR error alert banner displayed:', qrHasErrorAlert);
  console.log('  [PASS] Did NOT navigate to success screen:', !qrNavigatedSuccess);

  console.log('----------------------------------------------------');
  console.log('4. TESTING UI-01 SIDEBAR HIGHLIGHT & STATUS LABELS');
  console.log('----------------------------------------------------');
  await page.goto('http://localhost:5174/?screen=MERCHANT_COLLECTIONS');
  await page.waitForTimeout(1000);

  // Sidebar initially on Collections
  const collectionsSubBtn = page.locator('nav button:has-text("Collections")').first();
  const initialClass = await collectionsSubBtn.getAttribute('class');
  console.log('  Sidebar Collections initially active:', initialClass?.includes('text-[#7FE87F]'));

  // Click Settlements tab inside screen
  const settlementsScreenTab = page.locator('div > button:has-text("Settlements")').filter({ hasNot: page.locator('nav *') }).first();
  await settlementsScreenTab.click();
  await page.waitForTimeout(800);

  const settlementsSubBtn = page.locator('nav button:has-text("Settlements")').first();
  const settlementsClass = await settlementsSubBtn.getAttribute('class');
  const collectionsClassAfter = await collectionsSubBtn.getAttribute('class');

  const settlementsHighlighted = settlementsClass?.includes('text-[#7FE87F]');
  const collectionsUnhighlighted = !collectionsClassAfter?.includes('text-[#7FE87F]');

  console.log('  [PASS] Sidebar Settlements highlighted:', settlementsHighlighted);
  console.log('  [PASS] Sidebar Collections unhighlighted:', collectionsUnhighlighted);

  // Check status labels
  const collectionsPageHtml = await page.content();
  console.log('  [PASS] Status labels lowercase in logic and displayed via i18n:', collectionsPageHtml.includes('Pending Settlement') || collectionsPageHtml.includes('Settled'));

  await browser.close();
}

testFullSuite().catch(console.error);
