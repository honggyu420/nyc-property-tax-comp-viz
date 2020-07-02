import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import Legend from "./legend";
import "../App.css";

const color_mapping = [
  [0, "#FAD5B8"],
  [1, "#F3AF92"],
  [2, "#E38A70"],
  [3, "#CD6952"],
  [4, "#B14A39"],
  [5, "#912E24"],
  [6, "#6F1613"],
  [7, "#4B0302"],
];

class InfoModal extends Component {
  render() {
    return (
      <>
        <Modal className="my-modal" show={this.props.show} onHide={this.props.handleClose}>
          <Modal.Header>
            <Modal.Title>Comparing The Effective Tax Rate Between Neighborhoods</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This visualization was created to compare different neighborhoods and their median effective tax
            rate (ETR) and median market price of <b>Tax Class 1</b> residential properties.
            <br></br>
            <br></br>
            All the calculated tax rates are assigned an index and mapped to eight different shades:
            <Legend color_mapping={color_mapping} />
            The darker the shade, the higher the median ETR of the neighborhood. Select a neighborhood to see
            the name and attributes.
            <br></br>
            <br></br>
            If you are using a mouse/trackpad, you can click a neighborhood to persist a popup to allow for
            comparisons. You can scroll in on the map if the first popup is blocking the neighborhood you want
            to compare with.
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
