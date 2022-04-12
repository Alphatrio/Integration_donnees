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
const scrap =  require('./scrap.js')

const app = express();
const PORT = process.env.PORT || 3000;



app.get('/', function(request, response){
	console.log('hello');
	response.send('bienvenue sur mon serveur');
})


app.get('/classementslycees', function(req, response){
	var dict = scrap();
	console.log(dict);
	//response.send("ola!");
})


app.get('/aide_territoire', function(req, response){
	response.send('hello')
	const data = {}
	axios
	  .get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=demographyref-france-pop-legale-region-millesime&rows=80')
	  .then(res => {
	    console.log(`statusCode: ${res.status}`)
	    console.log(res)
	    console.log(res['data']['records'])
	    

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
	  })
	  .catch(error => {
	    console.error(error)
	  })

})



app.get('/chomage', function(req, response){ 
	response.send("hello chomage");
	request('https://www.insee.fr/fr/statistiques/fichier/2012804/sl_etc_2021T4.xls', {encoding: null}, function(err, res, data) {
	    if(err || res.statusCode !== 200) return;
	    fs.writeFileSync('./data/chomage.xls', data);
	});

	const file = XLSX.readFile('./data/chomage.xlsx')

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
})







app.listen(PORT, function(){
	console.log('Hello :'+ PORT);
})
