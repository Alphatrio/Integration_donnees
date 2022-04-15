const XLSX = require('xlsx');

module.exports = {
	chomage : function (){
		const file = XLSX.readFile('./data/chomage.xls')
		const sheets = file.SheetNames //stocker le nom des feuilles
		console.log('Feuilles du fichier Excel source : ' + sheets); // afficher le nom des feuilles

		const chom_regionsSheet = file.Sheets[sheets[2]];
		console.log("");
		console.log('Chômage par région (T4 2021) : ' + sheets);
		console.log("");

		var data = [];
		for(let i=5;i<24;i++) {
			let temp_dic = {}
			temp_dic['reg_code'] = chom_regionsSheet['A'+i]['v']; // pour chaque code de région..
			temp_dic['nom'] = chom_regionsSheet['B' + i]['v']; // ..on associe le nom de la région..
			temp_dic['taux_chomage'] = chom_regionsSheet['FF' + i]['v']; // ..et le taux de chômage du T4 2021
			data.push(temp_dic);

		}

		// console.log(data);
		return(data);	
	}
};
