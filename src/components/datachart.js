import React, { Component } from 'react';
import {Container, Row, Col} from 'react-bootstrap'
import '../App.css';

class DataChart extends Component {

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
    
  statGrid(property_tax_info) {
    let time_keys = {
      'py' : '2019 Final Assessment',
      'ten': 'Tentative Assessment Roll (Jan)',
      'cbn': 'Change By Notice period (May)',
      'fin': 'Final Assessment Roll (May)',
      'cur': 'Current Assessment'
    }

    let value_keys = {
      'mktland'  : 'Market Land Val.',
      'mkttot'   : 'Market Total Val.',
      'actland'  : 'Assessed Land Val.',
      'acttot'   : 'Assessed Total Val.',
      'actextot' : 'Assessed Exemption',
      'trnland'  : 'Trans. Land Val.',
      'trntot'   : 'Trans. Total Val.',
      'trnextot' : 'Trans. Total Exemption',
      'txbtot'   : 'Taxable Assessed',
      'trbextot' : 'Taxable Exemption',
      'taxclass' : 'Tax Class',
      'taxrate' : 'Tax Rate of Class'
    }

    let rows = []
    let header_column = []
    header_column.push(<Col> </Col>)
    for (let key in time_keys) {
      header_column.push(<Col>{time_keys[key]}</Col>)
    }

    rows.push(<Row>{header_column}</Row>)
    console.log(property_tax_info);
    
    for (let value_code in value_keys) {
      let cols = []
      cols.push(<Col>{value_keys[value_code]}</Col>)
      for (let time_code in time_keys) {
        let val = property_tax_info[time_code+value_code]
        if (value_code === 'taxrate' && property_tax_info[time_code+'taxclass'].indexOf('1') > -1) {
          val = '21.167%'
        } else if (value_code === 'taxrate' && property_tax_info[time_code+'taxclass'].indexOf('2') > -1) {
          val = '12.473%'
        }
        if (val === undefined) {
          cols.push(<Col>N/A</Col>)
        } else if (value_code === 'taxclass' || value_code === 'taxrate') {
          cols.push(<Col>{val}</Col>)
        } else {
          cols.push(<Col>{this.numWithCommas(val)}</Col>)
        }
      }

      rows.push(<Row>{cols}</Row>)
    }
    return <Container fluid>{rows}</Container>
  }

  render() {
    let dataChart = <br></br>
    if (this.props.property_tax_data) {
        dataChart = this.statGrid(this.props.property_tax_data)   
    }
    
    return <div>{dataChart}</div>
  }
}

  export default DataChart;