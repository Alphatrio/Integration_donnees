"use strict";

// const express= require('express');

// import https from "https";
// import fs from "fs";
// import path from "path";
// import xlsx from "node-xlsx";

import XLSX from "xlsx";
import fetch from "node-fetch";
import express from 'express';
import axios from 'axios';
import puppeteer  from 'puppeteer';
import scrap from 'scrap.js';
const app = express();
const PORT = process.env.PORT || 3000;



app.get('/', function(request, response){
	console.log('hello')
	response.send('bienvenue sur mon serveur');
})


app.get('/classementslycees', function(request, response){
	(async () => {

        
        var allmovies = [];

        for(let pagenb = 1;pagenb <= 3; pagenb++){
            const browser = await puppeteer.launch({headless: true});
            const page = await browser.newPage();
            if(pagenb == 1){
                await page.goto(`https://www.letudiant.fr/palmares/classement-lycees/`);
            }
            else{
                await page.goto(`https://www.letudiant.fr/palmares/classement-lycees/page-${pagenb}`);
            }
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
            allmovies = allmovies.concat(movies);
            await browser.close();
            console.log("page " + pagenb);
        }
        console.log(allmovies);
        return(allmovies)
        
    })();
})


app.get('/aide_territoire', function(request, response){
	response.send('hello')
	const data = {}
	axios
	  .get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=demographyref-france-pop-legale-region-millesime&rows=80')
	  .then(res => {
	    console.log(`statusCode: ${res.status}`)
	    console.log(res)
	    console.log(res['data']['records'])
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
	  })
	  .catch(error => {
	    console.error(error)
	  })

	// const api_response = fetch('https://aides-territoires.beta.gouv.fr/api/aids/');
	// // const api_data = await api_response.json();

	// console.log(api_response);
})



app.get('/chomage', function(request, response){ // NE FONCTIONNE QU'EN LOCAL
	response.send("hello chomage");


	const file = XLSX.readFile('./data/chomage.xlsx')
	//const file = XLSX.readFile('https://www.insee.fr/fr/statistiques/fichier/2012804/sl_etc_2021T4.xls') // NE FONCTIONNE PAS ---- comment récupérer le fichirer dirécement via url ? ----

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

	// https://www.insee.fr/fr/statistiques/fichier/2012804/sl_etc_2021T4.xls

})







app.listen(PORT, function(){
	console.log('Hello :'+ PORT);
})
