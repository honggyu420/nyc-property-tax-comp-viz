import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "../App.css";
import { FormatPriceAbbrev, numWithCommas } from "../helpers/helpers";
import { getNeighborhoodData } from "../helpers/neighborhood_data";
const enriched_neighborhood_data = getNeighborhoodData();

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

// restrict touchscreen users from having two popups
window.addEventListener(
  "touchstart",
  () => {
    window.USER_IS_TOUCHING = true;
  },
  false
);

// 8 buckets
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

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: this.props.dataset_name,
      show: false,
      lng: -73.8907,
      lat: 40.7351,
      zoom: 10.35,
      bounds: [
        [-74.357224, 40.495717], // southwest
        [-73.400462, 41.022003], // northeast
      ],
      remove_layers: [
        "road",
        "aeroway",
        "road",
        "airport",
        "poi",
        "place-city-lg-n",
        "place-city-lg-s",
        "place-city-md-n",
        "place-city-md-s",
        "place-city-sm",
        "place-town",
        "place-village",
        "place-suburb",
        "place-hamlet",
      ],
      allowed_layers: [
        "road-motorway",
        "road-street",
        "road-primary",
        "road-secondary-tertiary",
        "road-label-large",
      ],
    };
  }

  getMapLayers(dataset) {
    let layers = [];
    if (dataset === "tax-rate") {
      layers = [
        {
          id: dataset + "-polygons",
          type: "fill",
          source: dataset,
          paint: {
            "fill-color": {
              property: "etr_index",
              stops: color_mapping,
            },
            "fill-opacity": 0.6,
          },
          filter: ["==", "$type", "Polygon"],
        },
        {
          id: dataset + "-polygon-lines",
          type: "line",
          source: dataset,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#000000",
            "line-width": 0.3,
          },
        },
      ];
    } else if (dataset === "census-tract") {
    }
    return layers;
  }

  getPopupHtml(properties, dataset) {
    let html = "";
    if (dataset === "tax-rate") {
      let { Name, med_etr, med_mkt_val, property_count, income } = properties;
      html += `<b>${Name}</b><br>`;

      if (property_count < 10) {
        html += `There are less than ten<br>Class 1 properties here.`;
      } else {
        let med_etr_formatted = (med_etr * 100).toFixed(2) + "%";
        let med_mkt_val_formatted = FormatPriceAbbrev(med_mkt_val);
        let income_formatted = FormatPriceAbbrev(income);
        let tax_bill = numWithCommas(med_mkt_val * med_etr);
        html += `Median ETR: <b>${med_etr_formatted}</b><br>`;
        html += `Median price: ${med_mkt_val_formatted}<br>`;
        html += `➥Tax Bill: ${tax_bill}<br>`;
        html += `income: ${income_formatted}<br>`;
        html += `property_count: ${property_count}<br>`;
      }
    }

    return html;
  }

  componentDidMount() {
    const { remove_layers, allowed_layers, dataset } = this.state;
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/dark-v9",
      center: [this.state.lng, this.state.lat],
      zoom: 0,
      maxBounds: this.state.bounds,
    });

    map.on("move", () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });

    map.on("load", () => {
      let layers = map.getStyle().layers;
      let filterable_layers = layers.filter((style) => {
        return remove_layers.reduce((accum, val) => accum || style.id.indexOf(val) > -1, false);
      });

      for (let layer of filterable_layers) {
        if (allowed_layers.indexOf(layer.id) < 0) {
          map.removeLayer(layer.id);
        }
      }

      map.addSource(dataset, {
        type: "geojson",
        data: this.props.data,
      });

      let new_layers = this.getMapLayers(dataset);
      // adding neighborhood polygon layer

      for (let layer of new_layers) {
        map.addLayer(layer);
      }
    });

    var popup_1 = new mapboxgl.Popup({
      className: "mapbox-popup",
      closeOnClick: false,
    });
    var popup_2 = new mapboxgl.Popup({
      className: "mapbox-popup",
      closeOnClick: false,
    });
    var popup_1_open = false;

    const showPopup = (e) => {
      let html = this.getPopupHtml(e.features[0].properties, dataset);
      if (!popup_1_open || window.USER_IS_TOUCHING) {
        popup_1.setLngLat(e.lngLat).setHTML(html).addTo(map);
      } else {
        popup_2.setLngLat(e.lngLat).setHTML(html).addTo(map);
      }
    };

    const closePopup = () => {
      if (popup_1_open) {
        // popup_1.remove();
        popup_2.remove();
      } else {
        popup_1.remove();
      }
    };

    popup_1.on("close", () => {
      popup_1_open = false;
    });

    map.on("click", dataset + "-polygons", (e) => {
      showPopup(e);
      popup_1_open = true;
    });
    // Show popup on hover over neighborhood polygons
    map.on("mousemove", dataset + "-polygons", showPopup);

    // remove popup
    map.on("mouseleave", dataset + "-polygons", closePopup);
  }

  render() {
    return (
      <div>
        <div ref={(el) => (this.mapContainer = el)} className="mapContainer" />
      </div>
    );
  }
}

export default Map;
