
import { compose, mapPropsStream, withHandlers } from 'recompose';
import {findLineFeature} from "@js/extension/utils/geojson";

/**
 * Enhancer for processing map configuration and layers object
 * Recognizes if the file dropped is a map or a layer
 * Flatten features and then selects first line feature to build profile out of it
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

