const puppeteer = require('puppeteer')

module.exports = {
    reg_code : async function (resolve){
      const browser = await puppeteer.launch({headless: true});

      const page = await browser.newPage();

      await page.goto('https://fr.wikipedia.org/wiki/R%C3%A9gion_fran%C3%A7aise');
      await page.waitForSelector('table.wikitable:nth-child(20) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2)')

      const regs_codes = await page.evaluate(() => {

        let regs_codes = [];
        let elements = document.querySelectorAll('table.wikitable:nth-child(20) > tbody:nth-child(2) > tr')
        for (ligne of elements) {

          regs_codes.push({
            region: ligne.querySelector('td:nth-child(2) > a')?.textContent,
            code: ligne.querySelector('td:nth-child(9)')?.textContent
          })

        }

        let elements2 = document.querySelectorAll('table.wikitable:nth-child(22) > tbody:nth-child(2) > tr')
        for (ligne2 of elements2) {

          regs_codes.push({
            region: ligne2.querySelector('td:nth-child(2) > a')?.textContent,
            code: ligne2.querySelector('td:nth-child(9)')?.textContent
          })

        }
        return regs_codes;
      });
      //console.log(deps_regs);
      resolve(regs_codes);
      await browser.close();
            }
        }
