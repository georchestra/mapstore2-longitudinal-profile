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

export const addProfileData = (infos, points) => ({
    type: ADD_PROFILE_DATA,
    infos,
    points
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
