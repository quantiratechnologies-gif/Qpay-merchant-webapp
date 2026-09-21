import { chromium } from 'playwright';

async function testCard() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto('http://localhost:5174/?screen=SOFTPOS_TERMINAL');
  await page.waitForTimeout(1000);

  // Quick add +50
  console.log('Clicking +50...');
  await page.click('button:has-text("+50")');
  await page.waitForTimeout(500);

  // Click Tap to Pay
  console.log('Clicking Tap to Pay button...');
  await page.click('button:has-text("Tap to Pay")');
  await page.waitForTimeout(500);

  console.log('Current URL:', page.url());

  // Wait 3.5s for authorization flow
  console.log('Waiting 3.5s...');
  await page.waitForTimeout(3500);

  await page.screenshot({ path: 'scratch/card_fail_screen.png' });
  const content = await page.content();
  console.log('Has "Transaction Failed":', content.includes('Transaction Failed'));
  console.log('Has "Payment authorization failed":', content.includes('Payment authorization failed'));
  console.log('Has "Failed":', content.includes('Failed'));

  await browser.close();
}

testCard().catch(console.error);
