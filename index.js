"use strict";

// const express= require('express');

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

app.listen(PORT, function(){
	console.log('Hello :'+ PORT);
})