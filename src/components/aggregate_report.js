import React, { Component } from 'react';
import '../App.css';

class AggregateReport extends Component {
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

  aggComparisonReport(agg_result) {
    let agg_report = []

    if (agg_result) {
      agg_report.push(<h4>Compared to this property, there are <b>{this.numWithCommas(agg_result.count, false)}</b> properties of the same class that have lower effective tax rates.</h4>)
    }
    
    return agg_report
  }

  render() {
    return <div>{this.aggComparisonReport(this.props.agg_result)}</div>
  }
}

export default AggregateReport