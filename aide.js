function aide(){
    const data = {}
	axios
	  .get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=demographyref-france-pop-legale-region-millesime&rows=80')
	  .then(res => {
	    console.log(`statusCode: ${res.status}`)
	    // console.log(res)
	    // console.log(res['data']['records'])


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
	    return(data);
	  })
	  .catch(error => {
	    console.error(error)
	  })

}
