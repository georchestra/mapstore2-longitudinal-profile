import {reprojectGeoJson} from "@mapstore/utils/CoordinatesUtils";

/**
 * Utility function to traverse through json input recursively and build a flat array of features
 * @param json
 * @param features
 * @returns {*[]|*}
 */
export const flattenImportedFeatures = (json, features = undefined) => {
    let flatten = [];
    if (typeof features !== 'undefined') {
        flatten = features;
    }
    if (json?.layers && Array.isArray(json.layers)) {
        return json.layers.forEach(l => flattenImportedFeatures(l, flatten));
    }
    if (json?.map && json.map?.layers) {
        flattenImportedFeatures(json.map?.layers, flatten);
    }
    if (Array.isArray(json)) {
        json.forEach(el => flattenImportedFeatures(el, flatten));
    }
    if (json?.features && Array.isArray(json.features)) {
        json.features.forEach(feature => flattenImportedFeatures(feature, flatten));
    }
    if (json?.type === 'Feature') {
        flatten.push(json);
    }
    return flatten;
};

/**
 * Finds first line feature in array of features and reprojects geometry for further use in WPS request
 * @param collection
 * @returns {{feature: *, coordinates: *, reprojected: (*)}|{feature: undefined, coordinates: undefined, reprojected: undefined}}
 */
export const findLineFeature = (collection) => {
    const feature = collection.find((f) => ["LineString", "MultiLineString"].includes(f?.geometry?.type));
    if (feature) {
        const reprojected = reprojectGeoJson(feature, "EPSG:4326", "EPSG:3857");
        const coordinates = reprojected.geometry.type === "MultiLineString" ? reprojected.geometry.coordinates[0] : reprojected.geometry.coordinates;
        return { feature, reprojected, coordinates };
    }
    return { feature: undefined, reprojected: undefined, coordinates: undefined };
};

/**
 * Applies style to the features list
 * @param features
 * @param style
 * @returns {*}
 */
export const styleFeatures = (features, style) => {
    return features.map((feature) => {
        return {
            ...feature,
            style
        };
    });
};
