export function numWithCommas(val, dollars = true) {
  if (!val) {
    return val;
  }

  let string = dollars ? "$" : "";

  return string + val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function FormatPriceAbbrev(val) {
  let abbrev_str = "";
  if (val === false || val === undefined) {
    abbrev_str = "$--";
  } else if (val === 0) {
    abbrev_str = "$0";
  } else if (val >= 1000000) {
    abbrev_str = "$" + parseFloat((val / 1000000).toFixed(2)).toString() + "M";
  } else if (val >= 10000) {
    abbrev_str = "$" + ~~(val / 1000) + "K";
  } else {
    abbrev_str = "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return abbrev_str;
}
