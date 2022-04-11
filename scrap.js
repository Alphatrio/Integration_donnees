const puppeteer = require('puppeteer');

(async () => {

    
    const allmovies = []
    for(let pagenb = 2;pagenb < 47; pagenb++){
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.goto(`https://www.letudiant.fr/palmares/classement-lycees/page-${pagenb}`);
        const movies = await page.evaluate(() => {
            let movies = [];
            let elements = document.querySelectorAll('.c-table--housemd > tbody:nth-child(2) > tr');
            for (ligne of elements) {

                movies.push({
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
            return movies;
        });
        allmovies.push(movies);
        browser.close();
        console.log("page" + pagenb)
    }
    console.log(allmovies);
	

	
})();


