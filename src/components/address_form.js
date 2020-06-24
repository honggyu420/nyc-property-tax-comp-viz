import React, { Component } from "react";
import "../App.css";
const { REACT_APP_GEOCLIENT_ID, REACT_APP_GEOCLIENT_KEY } = process.env;
var geoclient_url = `https://api.cityofnewyork.us/geoclient/v1/search.json?app_id=${REACT_APP_GEOCLIENT_ID}&app_key=${REACT_APP_GEOCLIENT_KEY}&input=`;
var cors_anywhere = "https://cors-anywhere.herokuapp.com/";
var property_tax_url = "https://data.cityofnewyork.us/resource/8y4t-faws.json?";

class AddressForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      address_2: null,
      borough: null,
      zip: null,
      bbl: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleSubmit(event) {
    let { bbl, address, borough, zip } = this.state;
    event.preventDefault();
    if (!bbl && (!address || (!borough && !zip))) {
      alert("need an address and either the borough or zip");
      return;
    }

    let search_param = "";
    if (bbl) {
      search_param = bbl;
    } else {
      search_param = address;
      if (zip) {
        search_param += "," + this.state.zip;
      }
      if (borough) {
        search_param += "," + this.state.borough;
      }
    }

    let geoclient_json;
    let property_tax_json;
    let agg_result;
    let message;

    console.log(geoclient_url + search_param);

    this.props.showLoading();

    let fetched = await fetch(cors_anywhere + geoclient_url + search_param);
    let gc_json = await fetched.json();

    if (!gc_json.results || !gc_json.results.length) {
      message = "Building not found.";
    } else {
      geoclient_json = gc_json.results[0].response;
      bbl = bbl ? bbl : geoclient_json.bbl;
      let boro_num = bbl.slice(0, 1);
      // let block = +bbl.slice(1,6)
      // let lot = +bbl.slice(6,11)

      // search_param = 'boro=' + boro_num + '&block=' + block + '&lot=' + lot
      search_param = "year=2021&parid=" + bbl;
      if (this.state.address_2) {
        let street_name = geoclient_json.boePreferredStreetName
          ? geoclient_json.boePreferredStreetName
          : geoclient_json.giStreetName1;
        street_name = street_name.replace(/\s\s+/g, " ");

        let house_number = geoclient_json.houseNumber ? geoclient_json.houseNumber : geoclient_json.giLowHouseNumber1;
        console.log(house_number);

        search_param = "boro=" + boro_num + "&housenum_lo=" + house_number + "&street_name=" + street_name;
        search_param += "&aptno=" + this.state.address_2.toUpperCase();
      }
      console.log(property_tax_url + search_param);
      fetched = await fetch(cors_anywhere + property_tax_url + search_param);
      let pt_json = await fetched.json();

      if (!pt_json || !pt_json.length) {
        message = "Tax assessment on property was not found.";
      } else {
        property_tax_json = pt_json[0];
        // if (pt_json.length > 1) {
        //   property_tax_json = pt_json[1]
        // }

        let assessed_total_val = property_tax_json.curtxbtot;
        let market_total_val = property_tax_json.curmkttot;
        let tax_class = property_tax_json.curtaxclass;

        let agg_query = "$select=count(*)&$where=";
        agg_query += "curtxbtot < " + assessed_total_val;
        agg_query += " and curmkttot > " + market_total_val;
        agg_query += ' and curtaxclass = "' + tax_class + '"';
        agg_query += ' and year = "2021"';
        let agg_search_url = cors_anywhere + property_tax_url + agg_query;
        console.log(property_tax_url + agg_query);

        fetched = await fetch(agg_search_url);
        agg_result = await fetched.json();
        agg_result = agg_result[0];
      }
    }

    this.props.handleAddressSubmit(geoclient_json, property_tax_json, agg_result, message);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} id="searchForm">
        <label>
          address:
          <input type="text" name="address" onChange={this.handleChange} />
        </label>
        <label>
          apt #:
          <input type="text" name="address_2" placeholder="optional" onChange={this.handleChange} />
        </label>
        <br></br>
        <label>
          zip:
          <input type="text" name="zip" onChange={this.handleChange} />
        </label>
        <b> or </b>
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
        <input type="submit" value="Submit" />
        <br></br>
        <b> or </b>
        <label>
          bbl:
          <input type="text" name="bbl" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default AddressForm;
