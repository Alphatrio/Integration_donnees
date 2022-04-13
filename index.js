"use strict";

// const express= require('express');

// import https from "https";
// import fs from "fs";
// import path from "path";
// import xlsx from "node-xlsx";


const axios = require('axios');
const express = require('express');
const request = require('request');
const fs = require('fs');
const XLSX = require('xlsx');
const puppeteer = require('puppeteer')

const app = express();
const PORT = process.env.PORT || 3000;



app.get('/', function(req, response){
	console.log('hello');
	response.send('bienvenue sur mon serveur');
})


app.get('/classementslycees', function(req, response){
<<<<<<< HEAD
	var dict = scrap();
	console.log(dict);
	//response.send("ola!");
=======
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

>>>>>>> 3fc75223e6a2fd9a6b44b09081b3ba235212608c
})


app.get('/aide_territoire', function(req, response){
	const data = {}
	axios
	  .get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=demographyref-france-pop-legale-region-millesime&rows=80')
	  .then(res => {
	    console.log(`statusCode: ${res.status}`)
<<<<<<< HEAD
	    console.log(res)
	    console.log(res['data']['records'])
=======
	    // console.log(res)
	    // console.log(res['data']['records'])


>>>>>>> 3fc75223e6a2fd9a6b44b09081b3ba235212608c
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



<<<<<<< HEAD
app.get('/chomage', function(req, response){ // NE FONCTIONNE QU'EN LOCAL
	response.send("hello chomage");
=======
app.get('/chomage', function(req, response){

>>>>>>> 3fc75223e6a2fd9a6b44b09081b3ba235212608c
	request('https://www.insee.fr/fr/statistiques/fichier/2012804/sl_etc_2021T4.xls', {encoding: null}, function(err, res, data) {
	    if(err || res.statusCode !== 200) return;
	    fs.writeFileSync('./data/chomage.xls', data);
	});

<<<<<<< HEAD
	const file = XLSX.readFile('./data/chomage.xlsx')
	//const file = XLSX.readFile('https://www.insee.fr/fr/statistiques/fichier/2012804/sl_etc_2021T4.xls') // NE FONCTIONNE PAS ---- comment récupérer le fichirer dirécement via url ? ----
=======
	const file = XLSX.readFile('./data/chomage.xls')
>>>>>>> 3fc75223e6a2fd9a6b44b09081b3ba235212608c

	const sheets = file.SheetNames //stocker le nom des feuilles
	console.log('Feuilles du fichier Excel source : ' + sheets); // afficher le nom des feuilles

	// const thirdSheet = file.Sheets[sheets[2]];
	// const ff23 = thirdSheet['FF23']; // lire une cellule spécifique
	// console.log(Object.values(ff23)[2] + ' %')

	const chom_regionsSheet = file.Sheets[sheets[2]];
	console.log("");
	console.log('Chômage par région (T4 2021) : ' + sheets);
	console.log("");

	var data = {};
	for(let i=5;i<24;i++) {
		data[chom_regionsSheet['A'+i]['v']] = {}; // pour chaque code de région..
		data[chom_regionsSheet['A'+i]['v']]['nom'] = chom_regionsSheet['B' + i]['v']; // ..on associe le nom de la région..
		data[chom_regionsSheet['A'+i]['v']]['taux_chomage'] = chom_regionsSheet['FF' + i]['v']; // ..et le taux de chômage du T4 2021

		//var regionColumn = chom_regionsSheet['B' + i];
		//var t4_2021Column = chom_regionsSheet['FF' + i];
		//console.log(Object.values(t4_2021Column));
		//console.log(Object.values(regionColumn)[1] + ' : ' + Object.values(t4_2021Column)[1] + ' %');
	 	//console.log(Object.values(t4_2021Column));

	}

	console.log(data);
<<<<<<< HEAD

	// https://www.insee.fr/fr/statistiques/fichier/2012804/sl_etc_2021T4.xls

=======
	response.send(data);
>>>>>>> 3fc75223e6a2fd9a6b44b09081b3ba235212608c
})







app.listen(PORT, function(){
	console.log('Hello :'+ PORT);
})
