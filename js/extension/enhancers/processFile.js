/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import {get} from 'lodash';
import proj4 from 'proj4';
import { compose, createEventHandler, mapPropsStream } from 'recompose';
import Rx from 'rxjs';

import {
    MIME_LOOKUPS,
    readJson,
    recognizeExt
} from '@mapstore/utils/FileUtils';
import {flattenImportedFeatures} from "@js/extension/utils/geojson";
import {parseURN} from "@mapstore/utils/CoordinatesUtils";


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
    if (type === 'application/json') {
        return readJson(file).then(f => {
            const projection = get(f, 'map.projection') ?? parseURN(get(f, 'crs'));
            if (projection) {
                const supportedProjection = proj4.defs(projection);
                if (supportedProjection) {
                    return [{...f, "fileName": file.name}];
                }
                throw new Error("PROJECTION_NOT_SUPPORTED");
            }
            return [{...f, "fileName": file.name}];
        });
    }
    return null;
};

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
                        .map(res => {
                            return ({
                                loading: false,
                                flattenFeatures: flattenImportedFeatures(res),
                                crs: res[0]?.crs?.properties?.name ?? 'EPSG:4326'
                            });
                        })
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
