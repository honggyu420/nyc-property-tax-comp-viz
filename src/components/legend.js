import React, { Component } from "react";
import "../App.css";

class Legend extends Component {
  getLegendBlocks() {
    let blocks = [];
    for (let color of this.props.color_mapping) {
      blocks.push(
        <div
          className="legend-block"
          style={{
            backgroundColor: color[1],
          }}
        ></div>
      );
    }

    return blocks;
  }

  render() {
    return <div>{this.getLegendBlocks()}</div>;
  }
}
export default Legend;
