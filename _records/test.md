---
id: 1234
layout: record
title: TIGER/Line Shapefile, 2019, 2010 nation, U.S., 2010 Census 5-Digit ZIP Code Tabulation Area (ZCTA5) National
format: CSV
language: English
coverage: North America
data_provider: data.gov
date: 2022-11-01
authors: 
type: spatial
license: "No license information was provided. If this work was prepared by an officer or employee of the United States government as part of that person's official duties it is considered a U.S. Government Work."
description: "The TIGER/Line shapefiles and related database files (.dbf) are an extract of selected geographic and cartographic information from the U.S. Census Bureau's Master Address File / Topologically Integrated Geographic Encoding and Referencing (MAF/TIGER) Database (MTDB). The MTDB represents a seamless national file with no overlaps or gaps between parts, however, each TIGER/Line shapefile is designed to stand alone as an independent data set, or they can be combined to cover the entire nation.


ZIP Code Tabulation Areas (ZCTAs) are approximate area representations of U.S. Postal Service (USPS) ZIP Code service areas that the Census Bureau creates to present statistical data for each decennial census. The Census Bureau delineates ZCTA boundaries for the United States, Puerto Rico, American Samoa, Guam, the Commonwealth of the Northern Mariana Islands, and the U.S. Virgin Islands once each decade following the decennial census. Data users should not use ZCTAs to identify the official USPS ZIP Code for mail delivery. The USPS makes periodic changes to ZIP Codes to support more efficient mail delivery.


The Census Bureau uses tabulation blocks as the basis for defining each ZCTA. Tabulation blocks are assigned to a ZCTA based on the most frequently occurring ZIP Code for the addresses contained within that block. The most frequently occurring ZIP Code also becomes the five-digit numeric code of the ZCTA. These codes may contain leading zeros.


Blocks that do not contain addresses but are surrounded by a single ZCTA (enclaves) are assigned to the surrounding ZCTA. Because the Census Bureau only uses the most frequently occurring ZIP Code to assign blocks, a ZCTA may not exist for every USPS ZIP Code. Some ZIP Codes may not have a matching ZCTA because too few addresses were associated with the specific ZIP Code or the ZIP Code was not the most frequently occurring ZIP Code within any of the blocks where it exists.


The ZCTA boundaries in this release are those delineated following the 2010 Census."
record_url: https://catalog.data.gov/dataset/tiger-line-shapefile-2019-2010-nation-u-s-2010-census-5-digit-zip-code-tabulation-area-zcta5-na
urls:
    - https://catalog.data.gov/dataset/tiger-line-shapefile-2019-2010-nation-u-s-2010-census-5-digit-zip-code-tabulation-area-zcta5-na/resource/3be718cb-78d3-4ca2-adb5-ac9563350d85
    - https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html
    - https://catalog.data.gov/dataset/tiger-line-shapefile-2019-2010-nation-u-s-2010-census-5-digit-zip-code-tabulation-area-zcta5-na/resource/37e51a05-a138-44d2-9e91-93f93be96333
    - https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/PUMA_TAD_TAZ_UGA_ZCTA/MapServer
external_js:
    - https://unpkg.com/leaflet@1.9.3/dist/leaflet.js
stylesheets:
    - https://unpkg.com/leaflet@1.9.3/dist/leaflet.css
---

<div id="map" style="height: 180px;"></div>

<script>
let map = L.map('map').setView([51.505, -0.09], 13);
var wmLayer = L.tileLayer.wms('https://tigerweb.geo.census.gov/arcgis/services/TIGERweb/tigerWMS_Current/MapServer/WMSServer?request=GetCapabilities', {
    layers: 'ACS 2022'
}).addTo(map);
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);
</script>