const puppeteer = require('puppeteer')

module.exports = {
    dep_reg : async function (resolve){
      const browser = await puppeteer.launch({headless: true});

      const page = await browser.newPage();

      await page.goto('https://fr.wikipedia.org/wiki/Liste_des_d%C3%A9partements_fran%C3%A7ais');
      await page.waitForSelector('table.wikitable:nth-child(19)')

      const deps_regs = await page.evaluate(() => {

        let deps_regs = [];
        let elements = document.querySelectorAll('table.wikitable:nth-child(19) > tbody:nth-child(2) > tr');
        for (ligne of elements) {

          deps_regs.push({
            code: ligne.querySelector('td:nth-child(1)')?.textContent,
            departement: ligne.querySelector('td:nth-child(2) > a')?.textContent,
            region: ligne.querySelector('td:nth-child(10)')?.textContent
          })

        }
        return deps_regs;
      });
      //console.log(deps_regs);
      resolve(deps_regs);
      await browser.close();
            }
        }
