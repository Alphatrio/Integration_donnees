"use strict";

// const express= require('express');

// import https from "https";
// import fs from "fs";
// import path from "path";
// import xlsx from "node-xlsx";


const axios = require('axios')
const express = require('express')
const request = require('request')
const fs = require('fs')
const XLSX = require('xlsx');
const puppeteer = require('puppeteer')

const app = express();
const PORT = process.env.PORT || 3000;



app.get('/', function(req, response){
	console.log('hello');
	response.send('bienvenue sur mon serveur');
})

app.get('/dep_reg', function(req, response){
	console.log('Guten tag');

	(async () =>{
		console.log('Guten tag 2');
		const browser = await puppeteer.launch({headless: true});
		console.log('Guten tag 3');
		const page = await browser.newPage();
		console.log('Guten tag 4');
		await page.goto('https://www.regions-departements-france.fr/');
		console.log('Guten tag 5');
		const deps_regs = await page.evaluate(() => {
			let deps_regs = [];
			let elements = document.querySelectorAll('body > div:nth-child(1) > main:nth-child(2) > article:nth-child(1) > section:nth-child(6) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(4) > tr');
			for (ligne in elements){
				deps_regs.push({
					id: ligne.querySelector('th:nth-child(1)')?.textContent,
					departement: ligne.querySelector('td:nth-child(2)')?.textContent,
					region: ligne.querySelector('td:nth-child(3)')?.textContent
				})

			}
			return deps_regs;
		})
		console.log(deps_regs);
		response.send(deps_regs);
		await browser.close();


	})();


	});




app.get('/classementslycees', function(req, response){
	(async () => {

        var allLycee = [];


        for(let pagenb = 1;pagenb <= 3; pagenb++){
            console.log('Hello')
            const browser = await puppeteer.launch({headless: true});
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
            allLycee = allLycee.concat(lycee);
            //await browser.close();
            console.log("page " + pagenb);
        }
        response.send(allLycee);
    })();

})


app.get('/aide_territoire', function(req, response){
	const data = {}
	axios
	  .get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=demographyref-france-pop-legale-region-millesime&rows=80')
	  .then(res => {
	    console.log(`statusCode: ${res.status}`)
	    // console.log(res)
	    // console.log(res['data']['records'])


	    res['data']['records'].forEach(element =>{
	    				if (element['fields']['reg_code'] in data) {
						    if('date' in data[element['fields']['reg_code']]){
						    	if(element['fields']['start_year'] > data[element['fields']['reg_code']]['date']){
						    		data[element['fields']['reg_code']]['date'] = element['fields']['start_year'];
						    		data[element['fields']['reg_code']]['pop_total'] = element['fields']['reg_pop_tot'];
						    	}
						    }
						  }else{
						  	data[element['fields']['reg_code']] = {}
						  	data[element['fields']['reg_code']]['date'] = element['fields']['start_year'];
						    data[element['fields']['reg_code']]['pop_total'] = element['fields']['reg_pop_tot'];
						    data[element['fields']['reg_code']]['reg_name'] = element['fields']['reg_name'];
						  }
						})

	    	// console.log(element['fields']['reg_name']));
	    console.log(data)
	    response.send(data);
	  })
	  .catch(error => {
	    console.error(error)
	  })

})



app.get('/chomage', function(req, response){

	request('https://www.insee.fr/fr/statistiques/fichier/2012804/sl_etc_2021T4.xls', {encoding: null}, function(err, res, data) {
	    if(err || res.statusCode !== 200) return;
	    fs.writeFileSync('./data/chomage.xls', data);
	});

	const file = XLSX.readFile('./data/chomage.xls')

	const sheets = file.SheetNames //stocker le nom des feuilles
	console.log('Feuilles du fichier Excel source : ' + sheets); // afficher le nom des feuilles

	const chom_regionsSheet = file.Sheets[sheets[2]];
	console.log("");
	console.log('Chômage par région (T4 2021) : ' + sheets);
	console.log("");

	var data = {};
	for(let i=5;i<24;i++) {
		data[chom_regionsSheet['A'+i]['v']] = {}; // pour chaque code de région..
		data[chom_regionsSheet['A'+i]['v']]['nom'] = chom_regionsSheet['B' + i]['v']; // ..on associe le nom de la région..
		data[chom_regionsSheet['A'+i]['v']]['taux_chomage'] = chom_regionsSheet['FF' + i]['v']; // ..et le taux de chômage du T4 2021

	}

	console.log(data);
	response.send(data);
})







app.listen(PORT, function(){
	console.log('Hello :'+ PORT);
})
