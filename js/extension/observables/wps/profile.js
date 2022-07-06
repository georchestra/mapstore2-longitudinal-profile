/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import {executeProcessXML} from "@mapstore/observables/wps/execute";
import {
    complexData,
    literalData,
    processData,
    processParameter, rawDataOutput, responseForm
} from "@mapstore/observables/wps/common";

const prepareGeometry = (geometry) => {
    return `<![CDATA[LINESTRING(${geometry.coordinates.map((point) => `${point[0]} ${point[1]}`).join(',')})]]>`;
};

const getCRS = (geometry) => geometry.projection;

/**
 * Construct payload for request to obtain longitudinal profile data
 * @param {string} downloadOptions options object
 * @param {string} downloadOptions.identifier identifier of the process
 * @param {string} downloadOptions.geometry geometry object to get line points from
 * @param {string} downloadOptions.distance resolution of the requested data
 * @param {string} downloadOptions.referentiel layer name
 */
export const profileEnLong = ({identifier, geometry, distance, referentiel}) => executeProcessXML(
    identifier,
    [
        processParameter('geometrie', processData(complexData(prepareGeometry(geometry), "application/wkt"))),
        processParameter('crs', processData(literalData(getCRS(geometry)))),
        processParameter('distance', processData(literalData(distance))),
        processParameter('referentiel', processData(literalData(referentiel)))
    ],
    responseForm(rawDataOutput('result'))
);
