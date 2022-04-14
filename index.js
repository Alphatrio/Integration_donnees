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
