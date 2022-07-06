/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import { compose, mapPropsStream, withHandlers } from 'recompose';
import {findLineFeature} from "@js/extension/utils/geojson";

/**
 * Enhancer for processing json file with features
 * Flatten features and then selects first line feature to build longitudinal profile out of it
 */
export default compose(
    withHandlers({
        useFlattenFeatures: ({ onClose = () => {}, changeGeometry = () => {}, warning = () => {}}) =>
            (flattenFeatures, crs) => {
                const { feature, coordinates } = findLineFeature(flattenFeatures, crs);
                if (feature && coordinates) {
                    changeGeometry({
                        type: "LineString",
                        coordinates,
                        projection: 'EPSG:3857'
                    });
                    onClose();
                } else {
                    warning({
                        title: "notification.warning",
                        message: "longitudinal.warnings.noLineFeatureFound",
                        autoDismiss: 6,
                        position: "tc"
                    });
                }
            }
    }),
    mapPropsStream(props$ => props$.merge(
        props$
            .distinctUntilKeyChanged('flattenFeatures')
            .filter(({flattenFeatures}) => flattenFeatures)
            .do(({ flattenFeatures, crs, useFlattenFeatures = () => { }, warnings = []}) => useFlattenFeatures(flattenFeatures, crs, warnings))
            .ignoreElements()
    ))
);

