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
const app = express();
const PORT = process.env.PORT || 3000;



app.get('/', function(request, response){
	response.send('bienvenue sur mon serveur');
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

	for(let i=5;i<24;i++) {
	 const regionColumn = chom_regionsSheet['B' + i];
	 const t4_2021Column = chom_regionsSheet['FF' + i];
	 //console.log(Object.values(t4_2021Column));
	 console.log(Object.values(regionColumn)[2] + ' : ' + Object.values(t4_2021Column)[2] + ' %');

	}



	// https://www.insee.fr/fr/statistiques/fichier/2012804/sl_etc_2021T4.xls

})







app.listen(PORT, function(){
	console.log('Hello :'+ PORT);
})
