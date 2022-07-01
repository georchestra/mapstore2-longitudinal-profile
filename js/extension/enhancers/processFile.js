/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { get } from 'lodash';
import { compose, createEventHandler, mapPropsStream } from 'recompose';
import Rx from 'rxjs';

import { isAnnotation } from '@mapstore/utils/AnnotationsUtils';
import ConfigUtils from '@mapstore/utils/ConfigUtils';
import {
    MIME_LOOKUPS,
    readJson,
    recognizeExt
} from '@mapstore/utils/FileUtils';
import { geoJSONToLayer } from '@mapstore/utils/LayersUtils';


/**
 * Checks if the file is allowed. Returns a promise that does this check.
 */
const checkFileType = (file) => {
    return new Promise((resolve, reject) => {
        const ext = recognizeExt(file.name);
        const type = file.type || MIME_LOOKUPS[ext];
        if (type === 'application/json') {
            resolve(file);
        } else {
            reject(new Error("FILE_NOT_SUPPORTED"));
        }
    });
};
/**
 * Create a function that return a Promise for reading file. The Promise resolves with an array of (json)
 */
const readFile = () => (file) => {
    const ext = recognizeExt(file.name);
    const type = file.type || MIME_LOOKUPS[ext];
    const projectionDefs = ConfigUtils.getConfigProp('projectionDefs') || [];
    const supportedProjections = (projectionDefs.length && projectionDefs.map(({code})  => code) || []).concat(["EPSG:4326", "EPSG:3857", "EPSG:900913"]);
    if (type === 'application/json') {
        return readJson(file).then(f => {
            const projection = get(f, 'map.projection');
            if (projection) {
                if (supportedProjections.includes(projection)) {
                    return [{...f, "fileName": file.name}];
                }
                throw new Error("PROJECTION_NOT_SUPPORTED");
            }
            return [{...f, "fileName": file.name}];
        });
    }
    return null;
};

const isGeoJSON = json => json && json.features && json.features.length !== 0;
const isMap = json => json && json.version && json.map;

/**
 * Enhancers a component to process files on drop event.
 * Recognizes map files (JSON format) or vector data in various formats.
 * They are converted in JSON as a "files" property.
 */
export default compose(
    mapPropsStream(
        props$ => {
            const { handler: onDrop, stream: drop$ } = createEventHandler();
            const { handler: onWarnings, stream: warnings$} = createEventHandler();
            return props$.combineLatest(
                drop$.switchMap(
                    files => Rx.Observable.from(files)
                        .flatMap(checkFileType) // check file types are allowed
                        .flatMap(readFile(onWarnings)) // read files to convert to json
                        .reduce((result, jsonObjects) => ({ // divide files by type
                            layers: (result.layers || [])
                                .concat(
                                    jsonObjects.filter(json => isGeoJSON(json))
                                        .map(json => (isAnnotation(json) ?
                                            // annotation GeoJSON to layers
                                            { name: "Annotations", features: json?.features || [], filename: json.filename} :
                                            // other GeoJSON to layers
                                            {...geoJSONToLayer(json), filename: json.filename}))
                                ),
                            maps: (result.maps || [])
                                .concat(
                                    jsonObjects.filter(json => isMap(json))

                                )
                        }), {})
                        .map(filesMap => ({
                            loading: false,
                            files: filesMap
                        }))
                        .catch(error => Rx.Observable.of({error, loading: false}))
                        .startWith({ loading: true})
                )
                    .startWith({}),
                (p1, p2) => ({
                    ...p1,
                    ...p2,
                    onDrop
                })
            ).combineLatest(
                warnings$
                    .scan((warnings = [], warning) => ([...warnings, warning]), [])
                    .startWith(undefined),
                (p1, warnings) => ({
                    ...p1,
                    warnings
                })
            );
        }
    )
);
