const ct_income_data = require("../data/census_tracts_with_hood_and_income.json");
const census_tract_geojson = require("../data/2010 Census Tracts.json");

const normalizerGenerator = (min, max, buckets) => {
  return (val) => Math.round((buckets - 1) * ((val - min) / (max - min)) + 1);
};

const preprocessCensusTractData = (census_tract_geojson, ct_income_data) => {
  let enriched_census_tract_geojson = { ...census_tract_geojson };

  // filter out staten island
  enriched_census_tract_geojson.features = enriched_census_tract_geojson.features.filter(
    feature.properties.boro_code !== "5"
  );

  let min = ct_income_data.features.reduce(
    (accum, val) => (val.properties.median_income > accum ? val.properties.median_income : accum),
    -999999999999
  );
  let max = ct_income_data.features.reduce(
    (accum, val) => (val.properties.median_income < accum ? val.properties.median_income : accum),
    999999999999
  );
  const normalizeIncome = normalizerGenerator(min, max, 8);

  enriched_census_tract_geojson.features.map((feature) => {
    let income_data = ct_income_data.filter(
      (n) =>
        n.properties.ctlabel === feature.properties.ctlabel &&
        n.properties.boro_code === feature.properties.boro_code
    );

    if (income_data && income_data.length && income_data[0].properties.median_income) {
      feature.properties.income_index = normalizeIncome(income_data[0].properties.median_income);
    } else {
      feature = false;
    }

    return feature;
  });

  return enriched_neighborhood_data;
};

export const getCensusTractData = () => {
  return preprocessCensusTractData(census_tract_geojson, ct_income_data);
};
