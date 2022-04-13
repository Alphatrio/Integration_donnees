function chomage(){
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
	return(data);
}

