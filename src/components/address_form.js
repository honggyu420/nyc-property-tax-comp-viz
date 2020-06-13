import React, { Component } from 'react';
import '../App.css';
var geoclient_url = 'https://api.cityofnewyork.us/geoclient/v1/search.json?app_id=46a62e71&app_key=56af21338ab55af795b5bcc414b5e997&input='
var cors_anywhere = 'https://cors-anywhere.herokuapp.com/'
var property_tax_url = 'https://data.cityofnewyork.us/resource/8y4t-faws.json?'

class AddressForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        address: null,
        address_2: null,
        borough: null,
        zip: null
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({[event.target.name]: event.target.value});
    }

    async handleSubmit(event) {
      event.preventDefault();
      if (!this.state.address || (!this.state.borough && !this.state.zip)) {
        alert("need an address and either the borough or zip")
        return
      }
      
      let search_param = this.state.address
      if (this.state.zip) {
        search_param += ',' + this.state.zip
      }
      if (this.state.borough) {
        search_param += ',' + this.state.borough
      }
  
      let geoclient_json;
      let property_tax_json;
      console.log(cors_anywhere+geoclient_url+search_param);
      
      let fetched = await fetch(cors_anywhere+geoclient_url+search_param)
      let gc_json = await fetched.json()
    
      console.log('gc ', gc_json);
      geoclient_json = gc_json.results[0].response
      let bbl = geoclient_json.bbl
      let boro_num = bbl.slice(0,1)
      let block = +bbl.slice(1,6)
      let lot = +bbl.slice(6,11)
  
      search_param = 'boro=' + boro_num + '&block=' + block + '&lot=' + lot
      if (this.state.address_2) {
        search_param = 'boro=' + boro_num + '&housenum_lo=' + geoclient_json.giLowHouseNumber1 + '&street_name=' + geoclient_json.giStreetName1
        search_param += '&aptno=' + this.state.address_2
      }
      console.log(property_tax_url+search_param)
      fetched = await fetch(cors_anywhere+property_tax_url+search_param)
      let pt_json = await fetched.json()
      console.log(pt_json)
      property_tax_json = pt_json[0]
  
      let assessed_total_val = property_tax_json.curtxbtot
      let market_total_val = property_tax_json.curmkttot
      let tax_class = property_tax_json.curtaxclass
  
      let agg_query = '$select=count(*)&$where='
      agg_query += 'curtxbtot < ' + assessed_total_val
      agg_query += ' and curmkttot > ' + market_total_val
      agg_query += ' and curtaxclass = "' + tax_class + '"'
  
      let agg_search_url = cors_anywhere+property_tax_url+agg_query
      console.log(property_tax_url+agg_query);
      
      fetched = await fetch(agg_search_url)
      let agg_result = await fetched.json()
      agg_result = agg_result[0]
      console.log(agg_result);
      
      this.props.handleAddressSubmit(geoclient_json, property_tax_json, agg_result)
    }

    render() {
        return (
        <form onSubmit={this.handleSubmit} id="searchForm">
        <label>
          address: 
          <input type="text" name="address" onChange={this.handleChange}/>
        </label>
        <label>
          borough: 
          <select name="borough" onChange={this.handleChange}>
            <option value="">-select-</option>
            <option value="manhattan">Manhattan</option>
            <option value="bronx">Bronx</option>
            <option value="brooklyn">Brooklyn</option>
            <option value="queens">queens</option>
            <option value="staten island">Staten Island</option>
          </select>
        </label>
        <label>
          apt #: 
          <input type="text" name="address_2" placeholder="optional" onChange={this.handleChange}/>
        </label>
        <label>
          zip: 
          <input type="text" name="zip" placeholder="optional" onChange={this.handleChange}/>
        </label>
        <input type="submit" value="Submit"/>
        </form>
        )
    }
  }

  export default AddressForm;