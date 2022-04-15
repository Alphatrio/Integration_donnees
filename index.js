"use strict";

// const express= require('express');

// import https from "https";
// import fs from "fs";
// import path from "path";
// import xlsx from "node-xlsx";

// import fetch from 'node-fetch';
// import axios from 'axios';
// import express from 'express';


const axios = require('axios')
const express = require('express')
const request = require('request')
const fs = require('fs')
const XLSX = require('xlsx');
const puppeteer = require('puppeteer')
const scrap = require('./scrap')
const aide = require('./aide')
const chomage = require('./chomage')
const dep_reg = require('./dep_reg')
const reg_code = require('./reg_code')

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

try {
  if (!fs.existsSync('./data/lycee.json')) {
  	scrap.scrap(function(data){
  		const return_json = JSON.stringify(data);

			// write JSON string to a file
			fs.writeFile('./data/lycee.json', return_json, (err) => {
			    if (err) {
			        throw err;
			    }
			    console.log("JSON data is saved.");
			});
  	})
  }
} catch(err) {
  console.error(err)
}

try {
  if (!fs.existsSync('./data/dep_reg.json')) {
  	dep_reg.dep_reg(function(data){
  		const return_json = JSON.stringify(data);

			// write JSON string to a file
			fs.writeFile('./data/dep_reg.json', return_json, (err) => {
			    if (err) {
			        throw err;
			    }
			    console.log("JSON data is saved.");
			});
  	})
  }
} catch(err) {
  console.error(err)
}

try {
  if (!fs.existsSync('./data/reg_code.json')) {
  	reg_code.reg_code(function(data){
  		const return_json = JSON.stringify(data);

			// write JSON string to a file
			fs.writeFile('./data/reg_code.json', return_json, (err) => {
			    if (err) {
			        throw err;
			    }
			    console.log("JSON data is saved.");
			});
  	})
  }
} catch(err) {
  console.error(err)
}


app.get('/', function(req, response){
	console.log('hello');
	response.send('bienvenue sur mon serveur');
})



app.get('/dep_reg', function(req, response){
	fs.readFile('./data/dep_reg.json', 'utf-8', (err, data) => {
	    if (err) {
	        throw err;
	    }
	    // parse JSON object
	    const dep_reg = JSON.parse(data.toString());

	    // print JSON object
	    response.send(dep_reg);
	});




	});


	app.get('/reg_code', function(req, response){
		fs.readFile('./data/reg_code.json', 'utf-8', (err, data) => {
		    if (err) {
		        throw err;
		    }
		    // parse JSON object
		    const reg_code = JSON.parse(data.toString());

		    // print JSON object
		    response.send(reg_code);
		});




		});

var get_file = function (filename) {
	return new Promise((resolve, reject) => {
		fs.readFile('./data/'+filename+'.json', 'utf-8', (err, data) => {
			if (err) {
				reject(err)
				return
			}
			// parse JSON object
			let reg_code = JSON.parse(data.toString());

			resolve(reg_code)
		});
	});
}

var get_aide = function() {
	return new Promise((resolve, reject) => {
		aide.aide_async(function(data) { resolve(data)});
	});
}
var get_data = function (typedata) {
	
	if(typedata=='chomage')
	{
		return chomage.chomage();
	}
	return '';
}

var get_avg = function(array) {
	let somme = 0;

	if(array.length == 0) return 0;

	for(let i=0; i<array.length; i++){
		somme += array[i];
	}


	return somme / array.length;
}

app.get('/join_2', function(req, response){
	
	Promise.all([get_file('dep_reg'), 
                get_file('reg_code'), 
                get_file('lycee'),
                get_data('chomage'), 
                get_aide()
            ]).then((values) => {

		let dep_reg = values[0];
		let reg_code = values[1];
		let lycee = values[2];
		let chomage = values[3];
		let pop = values[4];


		let reg_pop = {};
		for(let item of pop)
		{
			let code = parseInt(item.reg_code);
			reg_pop[code] = item.pop_total;
		}

		let lycee_upd = {};
		for(let item of lycee)
		{
			let dpt = parseInt(item.dpt);
			let note = item.note;

			if(!(dpt in lycee_upd)) lycee_upd[dpt] = [];

			lycee_upd[dpt].push(parseFloat(note));
		}


		for(let i in lycee_upd)
		{
			lycee_upd[i] = get_avg(lycee_upd[i]);
		}


		/* Préparer un object clé valeur de reg et dep */
		let dep_reg_item = {};
		for(let i in dep_reg)
		{
			dep_reg_item[dep_reg[i].region] = dep_reg[i].departement;
			
		}
		console.log(dep_reg_item);
		/* Préparer un object clé valeur de reg_code et chomage */

		let chomage_item = {};
		for(let i in chomage)
		{
			chomage_item[parseInt(chomage[i].reg_code)] = chomage[i].taux_chomage;
			
		}
		/* Corriger le code , si la reg existe dans reg de l'objet dep donc on récupère le code_reg,chomage,et pop */

		for(let i in reg_code)
		{
			if(reg_code[i].code != undefined)
				reg_code[i].code = reg_code[i].code.replace('\n', '');
			
			reg_code[i].departement = reg_code[i].region in dep_reg_item ? dep_reg_item[reg_code[i].region] : '';
			
			reg_code[i].moyenne = i in lycee_upd ? lycee_upd[i] : 0;

			reg_code[i].chomage = reg_code[i].code in chomage_item ? chomage[i].taux_chomage : '';
			
			reg_code[i].population = reg_code[i].code in reg_pop ? reg_pop[reg_code[i].code] : 0;

		}
		

		response.send(reg_code);
	});



	//let all_data = {'dep_reg':dep_reg, 'reg_code':reg_code};
	

});

app.get('/classementslycees', function(req, response){
	fs.readFile('./data/lycee.json', 'utf-8', (err, data) => {
	    if (err) {
	        throw err;
	    }
	    // parse JSON object
	    const allLycee = JSON.parse(data.toString());

	    // print JSON object
	    response.send(allLycee);
	});
})


app.get('/aide_territoire', function(req, response){
	aide.aide_async(function(data) {response.send(data)});
})



app.get('/chomage', function(req, response){
	response.send(chomage.chomage());
})

app.get('/join', function(req, response){
    var chomage_data = chomage.chomage();
    Promise.all([aide.aide_sync()]).then((values) => {
          console.log(values[0]);
          let aide_territoire_data = [];
            values[0].data['records'].forEach(element =>{
                    let temp_dic = {}
                    temp_dic['reg_code'] = element['fields']['reg_code']
                    temp_dic['reg_name'] = element['fields']['reg_name'];
                    temp_dic['date'] = element['fields']['start_year'];
                    temp_dic['pop_total'] = element['fields']['reg_pop_tot'];
                    aide_territoire_data.push(temp_dic)
                });

          var classementLycee_data = JSON.parse(fs.readFileSync('./data/lycee.json').toString());
					var dep_reg = JSON.parse(fs.readFileSync('./data/dep_reg.json').toString());
					var reg_code = JSON.parse(fs.readFileSync('./data/reg_code.json').toString());


          // console.log('AIDETERRITOIRE')
          // console.log(aide_territoire_data[0]);
          // console.log('chomage')
          // console.log(chomage_data)
          // console.log('ALLLYCEE')
          // console.log(classementLycee_data[0])
});

})



app.listen(PORT, function(){
	console.log('Hello :'+ PORT);
})
