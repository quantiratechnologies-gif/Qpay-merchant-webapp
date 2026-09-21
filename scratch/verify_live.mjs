import { chromium } from 'playwright';

async function verifyLive() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('Navigating to live Vercel URL https://qpay-merchant-webapp.vercel.app ...');
  await page.goto('https://qpay-merchant-webapp.vercel.app');
  await page.waitForTimeout(2500);

  const title = await page.title();
  const url = page.url();
  console.log('Page Title:', title);
  console.log('Current URL:', url);

  const html = await page.content();
  console.log('Rendered Screen Info:');
  if (html.includes('Missing required Supabase environment variables')) {
    console.log('  -> Status: Missing Supabase Env variables');
  } else if (html.includes('Log In') || html.includes('Enter your mobile number') || html.includes('سجل الدخول')) {
    console.log('  -> Status: Login Screen (MobileNumberScreen) rendered cleanly');
  } else if (html.includes('لوحة التحكم الرئيسية') || html.includes('Overview') || html.includes('SoftPOS')) {
    console.log('  -> Status: Merchant Dashboard rendered cleanly');
  } else {
    console.log('  -> Status: Other view rendered');
  }

  // Check if old Store 1 demo button is present
  console.log('Store 1 Demo Button on live:', html.includes('Store 1') ? 'PRESENT' : 'REMOVED (SECURE)');
  console.log('Mock customer "Tariq" on live:', html.includes('Tariq') ? 'PRESENT' : 'REMOVED (CLEAN)');

  await page.screenshot({ path: 'scratch/live_vercel_check.png' });
  await browser.close();
}

verifyLive().catch(console.error);
