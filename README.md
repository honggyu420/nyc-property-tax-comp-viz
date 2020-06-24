## NYC Property Tax Comparison Tool ([View it here](https://honggyu420.github.io/nyc-prop-tax/))

![alt text](https://github.com/honggyu420/nyc-prop-tax/blob/master/images/example.png)

This React app includes a visualization that maps the median assessed market value of [Class 1](https://www1.nyc.gov/site/finance/taxes/property-bills-and-payments.page) homes, the median effective tax rate, and the calculated tax bill using those values for each neighborhood in New York City. On the map, the "redness" of the neighborhood polygon correlates to the effective tax rate value.

## How the data was gathered

• Every year, New York City makes available tax assessment for each property on its five boroughs that can be found [here](https://www1.nyc.gov/site/finance/taxes/property-assessments.page).

• A geojson of neighborhood polygons was converted from [this comprehensive map](https://www.google.com/maps/d/u/1/viewer?hl=en&ll=40.70476551690573%2C-73.97829884999997&z=10&mid=1_gsxJNfmcGZI4ZL_7LnEHj72YpvgNq-w) that collaborators created on Google Maps.

• Each of the properties can be uniquely identified with a combination of borough, block, and lot (BBL) that the tax assessment dataset provides. The [Geoclient API](https://developer.cityofnewyork.us/api/geoclient-api) was then used to query each BBL to acquire the longitude and latitude for each property.

• I loaded all this data onto PostgreSQL and exported the neighborhood-based aggregate results that are available on the data directory of this repo. The ETL process of this data will be available as another repo soon.

## Effective Tax Rate

Effective tax rate (ETR) is the percent of market value of the home that the landowner will pay the city (tax bill divided by market price). This value is not provided on the tax assessment dataset, but can be calculated with the values provided.

On the visualization, the effective tax rate takes the exemptions into consideration.

It is debated that New York City's property tax system is amongst the most antiquated and complicated tax system in the nation, so it did not make my job easy here. I'm currently limiting the visualization to only show data on class 1 properties which is relatively simpler to work with. Here's how the city does it:

> 1. The city's Department of Finance assesses a market price for a property.
> 2. That value is used to derive an assessment value which is USUALLY 6% of the market price. I used the vague word "derive" intentionally.
> 3. If the property has exemptions, the exemption amount is subtracted from the assessment value.
> 4. It then applies the actual tax rate of the tax class that the property class belongs to. For class 1, It's 21.34%. This is the tax bill.
> 5. If the property has abatements, the abatement amount is subtracted from the tax bill. Now we finally have the final tax bill that the landowner pays.
