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



app.get('/', function(req, response){
	console.log('hello');
	response.send('bienvenue sur mon serveur');
})


app.get('/classementslycees', function(req, response){
	response.send(scrap());
})


app.get('/aide_territoire', function(req, response){
	response.send(aide());
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
