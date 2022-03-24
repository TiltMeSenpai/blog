const puppeteer = require('puppeteer');

(async () => {
  try{
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--headless']});
    const page = await browser.newPage();
    await page.goto(`file://${__dirname}/dist/resume/index.html`, {waitUntil: 'networkidle2'});
    await page.pdf({path: `${__dirname}/dist/static/resume.pdf`});
    await browser.close();
  }
  catch(err){
    console.log(err)
    process.exit(-1)
  }
})();
