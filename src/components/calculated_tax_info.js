import React, { Component } from 'react';
import '../App.css';

class CalculatedTaxInfo extends Component {
  numWithCommas(x, dollars=true) {
    if (!x) {
      return x
    }

    let num = ''
    if (dollars) {
      num += '$'
    }

    return num + x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  calculateTaxBill(property_tax_info) {
    if (!property_tax_info) {
      return ''
    }

    let calculated_tax_results = []
    
    let tax_class = property_tax_info.curtaxclass
    let market_val = property_tax_info.curmkttot

    // pick trans total exemption and trans total val if tax class 2 (condo building with more than 10 units)
    let use_trans = tax_class === '2' && property_tax_info.curtrntot && property_tax_info.curtrntot !== '0'
    let assessed_total_val = use_trans? property_tax_info.curtrntot: property_tax_info.curtxbtot
    let assessed_exemption = use_trans? property_tax_info.curtrnextot: property_tax_info.curactextot

    if (tax_class.indexOf('1') > -1 || tax_class.indexOf('2') > -1) {
      let class_1_tax_rate = 0.21167
      let class_2_tax_rate = 0.12473

      let estimated_tax_bill = assessed_total_val
      let calculated_string = this.numWithCommas(assessed_total_val)

      if (assessed_exemption !== '0') {
        calculated_string = '(' + calculated_string + ' - ' + this.numWithCommas(assessed_exemption) + ')'
        estimated_tax_bill -= assessed_exemption
      }

      let tax_rate = class_1_tax_rate;
      if (tax_class.indexOf('2') > -1) {
        tax_rate = class_2_tax_rate;
      }

      estimated_tax_bill = (estimated_tax_bill * tax_rate).toFixed(2)
      calculated_string += ' x ' + (tax_rate*100).toFixed(3) + '% = ' + this.numWithCommas(estimated_tax_bill.toString())

      calculated_tax_results.push(<h4>estimated 2020 tax bill: <b>{calculated_string}</b></h4>)

      let tax_rate_against_market_val = ((estimated_tax_bill / market_val) * 100).toFixed(2)
      calculated_tax_results.push(<h4>effective tax rate: <b>{tax_rate_against_market_val}%</b>.</h4>)
    }
  
    return calculated_tax_results
  }

  render() {
    return <div>{this.calculateTaxBill(this.props.property_tax_data)}</div>
  }
}

export default CalculatedTaxInfo;