/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import {SET_CONTROL_PROPERTY} from "@mapstore/actions/controls";
import {CONTROL_DOCK_NAME} from "@js/extension/constants";

export const SETUP = "LONGITUDINAL:SETUP";
export const INITIALIZED = "LONGITUDINAL:INITIALIZED";
export const TEAR_DOWN = "LONGITUDINAL:TEAR_DOWN";
export const ADD_PROFILE_DATA = "LONGITUDINAL:ADD_PROFILE_DATA";
export const TOGGLE_MODE = "LONGITUDINAL:TOGGLE_MODE";
export const LOADING = "LONGITUDINAL:LOADING";
export const CHANGE_REFERENTIAL = "LONGITUDINAL:CHANGE_REFERENTIAL";
export const CHANGE_DISTANCE = "LONGITUDINAL:CHANGE_DISTANCE";
export const CHANGE_GEOMETRY = "LONGITUDINAL:CHANGE_GEOMETRY";
export const TOGGLE_MAXIMIZE = "LONGITUDINAL:TOGGLE_MAXIMIZE";
export const ADD_MARKER = "LONGITUDINAL:ADD_MARKER";
export const HIDE_MARKER = "LONGITUDINAL:HIDE_MARKER";

export const setup = (config) => ({
    type: SETUP,
    config
});

export const initialized = () => ({
    type: INITIALIZED
});

export const tearDown = () => ({
    type: TEAR_DOWN
});

export const openDock = () => ({
    type: SET_CONTROL_PROPERTY,
    control: CONTROL_DOCK_NAME,
    property: 'enabled',
    value: true
});

export const closeDock = () => ({
    type: SET_CONTROL_PROPERTY,
    control: CONTROL_DOCK_NAME,
    property: 'enabled',
    value: false
});

export const toggleMode = (mode) => ({
    type: TOGGLE_MODE,
    mode
});

export const addProfileData = (infos, points, projection) => ({
    type: ADD_PROFILE_DATA,
    infos,
    points,
    projection
});

export const loading = (state) => ({
    type: LOADING,
    state
});
export const changeReferential = (referential) => ({
    type: CHANGE_REFERENTIAL,
    referential
});
export const changeDistance = (distance) => ({
    type: CHANGE_DISTANCE,
    distance
});
export const changeGeometry = (geometry) => ({
    type: CHANGE_GEOMETRY,
    geometry
});
export const toggleMaximize = () => ({
    type: TOGGLE_MAXIMIZE
});
export const addMarker = (point) => ({
    type: ADD_MARKER,
    point
});
export const hideMarker = () => ({
    type: HIDE_MARKER
});
