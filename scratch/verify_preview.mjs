import { chromium } from 'playwright';

async function verifyPreview() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('Navigating to preview server at http://localhost:4173/ ...');
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(1500);

  // 1. Check Login / MobileNumberScreen
  const htmlLogin = await page.content();
  const store1OnLogin = htmlLogin.includes('Store 1') || htmlLogin.includes('متجر ١');
  const demoFillOnLogin = htmlLogin.includes('handleDemoFill') || htmlLogin.includes('Demo Merchant') || htmlLogin.includes('بيانات تجريبية');

  console.log('MobileNumberScreen (Login):');
  console.log('  - "Store 1" demo button visible:', store1OnLogin ? 'FOUND (FAIL)' : 'NOT FOUND (PASS)');
  console.log('  - Demo fill button visible:', demoFillOnLogin ? 'FOUND (FAIL)' : 'NOT FOUND (PASS)');

  // 2. Check MerchantSetupScreen
  await page.goto('http://localhost:4173/?screen=MERCHANT_SETUP');
  await page.waitForTimeout(1500);
  const htmlSetup = await page.content();
  const store1OnSetup = htmlSetup.includes('Store 1') || htmlSetup.includes('متجر ١');
  const demoPillsOnSetup = htmlSetup.includes('Demo Merchant') || htmlSetup.includes('Fast-fill') || htmlSetup.includes('تعبئة تجريبية');

  console.log('MerchantSetupScreen:');
  console.log('  - "Store 1" demo button visible:', store1OnSetup ? 'FOUND (FAIL)' : 'NOT FOUND (PASS)');
  console.log('  - Demo preset pills visible:', demoPillsOnSetup ? 'FOUND (FAIL)' : 'NOT FOUND (PASS)');

  // 3. Check Collections Screen for mock data
  await page.goto('http://localhost:4173/?screen=MERCHANT_COLLECTIONS');
  await page.waitForTimeout(1500);
  const htmlCollections = await page.content();
  const hasTariq = htmlCollections.includes('Tariq') || htmlCollections.includes('طارق العتيبي');
  const collectionsTableRows = await page.locator('div[style*="grid-template-columns"]').count();

  console.log('MerchantCollectionsScreen in Production Preview:');
  console.log('  - Mock customer "Tariq" visible:', hasTariq ? 'FOUND (FAIL)' : 'NOT FOUND (PASS)');
  console.log('  - Initial collections empty state shown:', htmlCollections.includes('No transactions') || htmlCollections.includes('لا توجد عمليات') ? 'YES (PASS)' : 'NO');

  await browser.close();
}

verifyPreview().catch(console.error);
