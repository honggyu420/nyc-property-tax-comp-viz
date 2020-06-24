import React, { Component } from "react";
import "../App.css";
import { numWithCommas } from "../helpers/helpers";

class AggregateReport extends Component {
  aggComparisonReport(agg_result) {
    let agg_report = [];

    if (agg_result) {
      agg_report.push(
        <h4>
          Compared to this property, there are <b>{numWithCommas(agg_result.count, false)}</b> properties of the same
          class that migher market value and lower effective tax rates.
        </h4>
      );
    }

    return agg_report;
  }

  render() {
    return <div>{this.aggComparisonReport(this.props.agg_result)}</div>;
  }
}

export default AggregateReport;
