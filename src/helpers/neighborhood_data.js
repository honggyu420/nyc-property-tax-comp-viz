const neighborhood_data = require("../data/neighborhoods_reddit.json");
const neighborhood_tax_data = require("../data/neighborhoods_med_tax.json");
const ct_income_data = require("../data/census_tracts_with_hood_and_income.json");

const calculateETRIndex = (properties) => {
  // max etr of .128 would put the data into 8 buckets for color mapping
  let etr_index = Math.ceil(properties.med_etr * 10000);
  etr_index = Math.floor(etr_index / 12) - 1;
  if (etr_index > 7) {
    etr_index = 7;
  }
  if (properties.property_count < 10) {
    etr_index = null;
  }

  return etr_index;
};

const calculateTaxIncomeIndex = (properties) => {
  let index = null;
  let { med_mkt_val, med_etr, income } = properties;
  if (income) {
    let tax_bill = med_etr * med_mkt_val;
    let tax_income_ratio = tax_bill / income;
    index = tax_income_ratio * 10;
    index = Math.floor(index);
  }

  return index;
};

const calculateIncomeForHoods = (census_tracts) => {
  let income_val = null;
  if (census_tracts && census_tracts.length) {
    // let income_sum = census_tracts.reduce(
    //   (accum, ct) => (ct.properties.median_income ? accum + ct.properties.median_income : accum),
    //   0
    // );
    // income_val = income_sum / census_tracts.length;
    // income_val = income_sum / census_tracts.length;

    let income_max = census_tracts.reduce(
      (accum, ct) => (ct.properties.median_income > accum ? ct.properties.median_income : accum),
      0
    );
    income_val = income_max;
  }
  return income_val;
};

const preprocessNeighborhood = (neighborhood_data, neighborhood_tax_data) => {
  let enriched_neighborhood_data = { ...neighborhood_data };

  let min = 999999999;
  let max = -99999999999;

  enriched_neighborhood_data.features.map((feature) => {
    let tax_data = neighborhood_tax_data.filter((n) => n.neighborhood === feature.properties.Name);
    let census_tracts = ct_income_data.filter((n) => n.properties.matched_hood === feature.properties.Name);
    feature.properties.income = calculateIncomeForHoods(census_tracts);

    if (tax_data && tax_data.length) {
      tax_data = tax_data[0];
      feature.properties = { ...feature.properties, ...tax_data };
      feature.properties.etr_index = calculateETRIndex(feature.properties);
      //   feature.properties.etr_index = calculateTaxIncomeIndex(feature.properties);
      if (feature.properties.etr_index && feature.properties.etr_index > max) {
        max = feature.properties.etr_index;
      } else if (feature.properties.etr_index && feature.properties.etr_index < min) {
        min = feature.properties.etr_index;
      }
    } else {
      feature = false;
    }

    return feature;
  });
  console.log(min, max);
  // filter out staten island
  enriched_neighborhood_data.features = enriched_neighborhood_data.features.filter((feature) => {
    return feature.properties.property_count;
  });

  return enriched_neighborhood_data;
};

export const getNeighborhoodData = () => {
  return preprocessNeighborhood(neighborhood_data, neighborhood_tax_data);
};
