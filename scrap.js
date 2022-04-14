const puppeteer = require('puppeteer')

module.exports = {
    scrap : async function (resolve){
                var allLycee = [];
                for(let pagenb = 1;pagenb <= 45; pagenb++){
                    const browser = await puppeteer.launch({
        				args: [
        				  '--no-sandbox',
        				  '--disable-setuid-sandbox',
        				],
        				headless:true
        			  });
                    const page = await browser.newPage();
                    if(pagenb == 1){
                        await page.goto(`https://www.letudiant.fr/palmares/classement-lycees/`);
                    }
                    else{
                        await page.goto(`https://www.letudiant.fr/palmares/classement-lycees/page-${pagenb}`);
                    }
                    const lycee = await page.evaluate(() => {
                        let lycee = [];
                        let elements = document.querySelectorAll('.c-table--housemd > tbody:nth-child(2) > tr');
                        for (ligne of elements) {

                            lycee.push({
                                lycee: ligne.querySelector('td > a').text,
                                note: ligne.querySelector('td:nth-child(1)')?.textContent,
                                2022: ligne.querySelector('td:nth-child(2)')?.textContent,
                                2021: ligne.querySelector('td:nth-child(3)')?.textContent,
                                dpt: ligne.querySelector('td:nth-child(5)')?.textContent,
                                ville: ligne.querySelector('td:nth-child(6)')?.textContent,
                                statut: ligne.querySelector('td:nth-child(7)')?.textContent,
                                presbac:  ligne.querySelector('td:nth-child(8)')?.textContent,
                                resbac: ligne.querySelector('td:nth-child(9)')?.textContent,
                                mensbac: ligne.querySelector('td:nth-child(10)')?.textContent
                            })
                        }
                        return lycee;
                    });
                    allLycee = [...allLycee, ...lycee];
                    //await browser.close();
                    console.log("page " + pagenb);
                }
                resolve(allLycee);
            }
        }
