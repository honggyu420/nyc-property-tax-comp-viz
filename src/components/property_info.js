import React, { Component } from 'react';
import '../App.css';

class PropertyInfo extends Component {
  propertyInfo(property_tax_info) {
    let infos = []
    if (property_tax_info) {
      let info_labels = ['housenum_lo', 'housenum_hi', 'street_name', 'aptno', 'boro', 'zip_code', 'curtaxclass', 'owner']
      for (let label of info_labels) {
        if (property_tax_info[label] !== undefined && property_tax_info[label] !== '') {
          infos.push(<h4>{label}: {property_tax_info[label]}</h4>)
        }
      }
    }
    
    return infos
  }

  render() {
    return <div>{this.propertyInfo(this.props.property_tax_data)}</div>
  }
}

export default PropertyInfo