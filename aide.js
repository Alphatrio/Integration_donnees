const axios = require('axios');



module.exports = {
	aide_async : async function (resolve){

		axiosCall(function(data){
				resolve(data);
			});
	},
	aide_sync : function (){
		return axios
		  .get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=demographyref-france-pop-legale-region-millesime&rows=80')
	}
};


async function axiosCall(resolve){
	await axios
		  .get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=demographyref-france-pop-legale-region-millesime&rows=80')
		  .then(res => {
		    let data = [];
			res.data['records'].forEach(element =>{
			    	let temp_dic = {}
			    	temp_dic['reg_code'] = element['fields']['reg_code']
			    	temp_dic['reg_name'] = element['fields']['reg_name'];
			    	temp_dic['date'] = element['fields']['start_year'];
			    	temp_dic['pop_total'] = element['fields']['reg_pop_tot'];
			    	data.push(temp_dic)

		    	});
		    	resolve(data);
			  });
}
