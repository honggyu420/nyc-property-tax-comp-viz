import React, { Component } from "react";
// import {Container, Row, Col} from 'react-bootstrap'
import "./App.css";
import Map from "./components/map";
import InfoModal from "./components/info_modal";
import { getNeighborhoodData } from "./helpers/neighborhood_data";
const enriched_neighborhood_data = getNeighborhoodData();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleClose() {
    this.setState({ show: false });
  }

  render() {
    let { show } = this.state;

    // show "about this" on first page load
    let visited = localStorage["alreadyVisited"];
    if (visited) {
      show = show || false;
    } else {
      show = show || true;
      localStorage["alreadyVisited"] = true;
    }
    return (
      <div className="App">
        <div className="sidebarStyle">
          <p>
            <b>NYC Property Tax Rate - Class 1</b>
          </p>
          <p>Select a neighborhood for more info.</p>
          <a href="#" onClick={this.handleShow}>
            ( What is this? )
          </a>
        </div>
        <Map dataset_name="tax-rate" data={enriched_neighborhood_data}></Map>
        <InfoModal show={show} handleClose={this.handleClose}></InfoModal>
      </div>
    );
  }
}

export default App;
