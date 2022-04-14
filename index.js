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
const scrap = require('scrap.js')
const aide = require('aide.js')

const app = express();
const PORT = process.env.PORT || 3000;


try {
  if (!fs.existsSync('./data/chomage.xls')) {
  	console.log('XLS DOWNLOAD')
    request('https://www.insee.fr/fr/statistiques/fichier/2012804/sl_etc_2021T4.xls', {encoding: null}, function(err, res, data) {
	    if(err || res.statusCode !== 200) return;
	    fs.writeFileSync('./data/chomage.xls', data);
	});
  }
} catch(err) {
  console.error(err)
}


app.get('/', function(req, response){
	console.log('hello');
	response.send('bienvenue sur mon serveur');
})

<<<<<<< HEAD

app.get('/classementslycees', function(req, response){
	(async () => {
        var allLycee = [];
        for(let pagenb = 1;pagenb <= 3; pagenb++){
            console.log('Hello')
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
	    				if (element['fields']['reg_name'] in data) {
						    if('date' in data[element['fields']['reg_name']]){
						    	if(element['fields']['start_year'] > data[element['fields']['reg_name']]['date']){
						    		data[element['fields']['reg_name']]['date'] = element['fields']['start_year'];
						    		data[element['fields']['reg_name']]['pop_total'] = element['fields']['reg_pop_tot'];
						    	}
						    }
						  }else{
						  	data[element['fields']['reg_name']] = {}
						  	data[element['fields']['reg_name']]['date'] = element['fields']['start_year'];
						    data[element['fields']['reg_name']]['pop_total'] = element['fields']['reg_pop_tot'];
						    data[element['fields']['reg_name']]['reg_code'] = element['fields']['reg_code'];
						  }
						})

	    	// console.log(element['fields']['reg_name']));
	    console.log(data)
	    response.send(data);
	  })
	  .catch(error => {
	    console.error(error)
	  })

	// const api_response = fetch('https://aides-territoires.beta.gouv.fr/api/aids/');
	// // const api_data = await api_response.json();

	// console.log(api_response);
})



app.get('/chomage', function(req, response){

	request('https://www.insee.fr/fr/statistiques/fichier/2012804/sl_etc_2021T4.xls', {encoding: null}, function(err, res, data) {
	    if(err || res.statusCode !== 200) return;
	    fs.writeFileSync('./data/chomage.xls', data);
	});

	const file = XLSX.readFile('./data/chomage.xls')
=======
app.get('/dep_reg', function(req, response){
	console.log('Guten tag');

	(async () =>{
		console.log('Guten tag 2');
		const browser = await puppeteer.launch({headless: true});
		console.log('Guten tag 3');
		const page = await browser.newPage();
		console.log('Guten tag 4');
		await page.goto('https://fr.wikipedia.org/wiki/Liste_des_d%C3%A9partements_fran%C3%A7ais');
		await page.waitForSelector('table.wikitable:nth-child(19)')
		console.log('Guten tag 5');
		const deps_regs = await page.evaluate(() => {
			console.log('Guten tag 6');
			let deps_regs = [];
			let elements = document.querySelectorAll('table.wikitable:nth-child(19) > tbody:nth-child(2) > tr');
			for (ligne of elements) {

				deps_regs.push({
					id: ligne.querySelector('th:nth-child(1)')?.textContent,
					departement: ligne.querySelector('td:nth-child(2) > a')?.textContent,
					region: ligne.querySelector('td:nth-child(10)')?.textContent
				})

			}
			return deps_regs;
		});
		console.log(deps_regs);
		response.send(deps_regs);
		await browser.close();
	})();


	});

>>>>>>> f552ecb7780c584f21953ede0a2a54a24783bed7



app.get('/classementslycees', function(req, response){

	response.send(scrap());

<<<<<<< HEAD
	console.log(data);
	response.send(data);
=======
})


app.get('/aide_territoire', function(req, response){
	response.send(aide());
>>>>>>> f552ecb7780c584f21953ede0a2a54a24783bed7
})



app.get('/chomage', function(req, response){
	response.send(chomage());
})

app.get('/join', function(req, response){
	var scrap = scrap();
	var aide = aide();
	var chomage = chomage();
	
})


app.listen(PORT, function(){
	console.log('Hello :'+ PORT);
})
