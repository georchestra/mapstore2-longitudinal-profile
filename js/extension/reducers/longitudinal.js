/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import {
    ADD_PROFILE_DATA,
    LOADING,
    TOGGLE_MODE,
    CHANGE_REFERENTIAL,
    CHANGE_DISTANCE,
    INITIALIZED, CHANGE_GEOMETRY, TEAR_DOWN,
    SETUP, TOGGLE_MAXIMIZE
} from "@js/extension/actions/longitudinal";

const DEFAULT_STATE = {
    initialized: false,
    loading: false,
    mode: false,
    referential: false,
    distance: false,
    geometry: false,
    infos: false,
    points: false,
    maximized: false
};

/**
 * Holds the state of longitudinal profile extension.
 * The shape of the state is the following:
 * ```
 * {
 *     initialized: true | false // flag to check whether extension is initialized successfully
 *     loading: true | false // general loading flag
 *     mode: "draw" | "select" | "import" | false // active tool
 *     referential: string | false // currently active referential (layer) used to obtain data for building of a profile
 *     distance: number | false // currently active distance (resolution) used as a setting in data requests
 *     geometry: object // geometry object, it is used as parameter in data requests and to render line on the map
 *     points: [
 *         []
 *     ] // array of data points, part of the response from WPS process, used to build chart
 *     infos: {} // object with stats info for the last data request, used to build stats tab,
 *     maximized: true | false // flag to determine whether chart is maximized or not
 * }
 * ```
 *
 * @param {object} state the application state
 * @param {object} action a redux action
 */
export default function longitudinal(state = DEFAULT_STATE, action) {
    const type = action.type;
    switch (type) {
    case INITIALIZED:
        return {
            ...state,
            initialized: true
        };
    case SETUP:
        return {
            ...state,
            config: action.config
        };
    case TEAR_DOWN:
        return DEFAULT_STATE;
    case LOADING:
        return {
            ...state,
            loading: action.state
        };
    case ADD_PROFILE_DATA:
        const {infos, points} = action;
        return {
            ...state,
            infos,
            points
        };
    case TOGGLE_MODE:
        return {
            ...state,
            mode: state.mode !== action.mode ? action.mode : false
        };
    case CHANGE_REFERENTIAL:
        return {
            ...state,
            config: {
                ...state.config,
                referential: action.referential
            }
        };
    case CHANGE_DISTANCE:
        return {
            ...state,
            config: {
                ...state.config,
                distance: action.distance
            }
        };
    case CHANGE_GEOMETRY:
        return {
            ...state,
            geometry: action.geometry
        };
    case TOGGLE_MAXIMIZE:
        return {
            ...state,
            maximized: !state.maximized
        };
    default:
        return state;
    }
}
