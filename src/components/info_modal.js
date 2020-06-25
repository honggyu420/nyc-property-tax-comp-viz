import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import Legend from "./legend";
import "../App.css";

class InfoModal extends Component {
  render() {
    return (
      <>
        <Modal className="my-modal" show={this.props.show} onHide={this.props.handleClose}>
          <Modal.Header>
            <Modal.Title>Comparing The Effective Tax Rate Between Neighborhoods</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This visualization was created to compare different neighborhoods and their median effective tax rate (ETR)
            and median market price of <b>Tax Class 1</b> residential properties.
            <br></br>
            <br></br>
            minimum ETR: 0.18% in Red Hook
            <br></br>
            maximum ETR: 1.27% in Flatiron District
            <br></br>
            <br></br>
            All the calculated tax rates are assigned an index and mapped to eight different shades:
            <Legend color_mapping={this.props.color_mapping} />
            where the darker the shade, the higher the median ETR of the neighborhood. Select a neighborhood to see its
            name and the values I described here.
            <br></br>
            <br></br>
            <a href="https://github.com/honggyu420/nyc-prop-tax/blob/master/README.md">
              Here's how I sourced the data and performed calculation.
            </a>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default InfoModal;
