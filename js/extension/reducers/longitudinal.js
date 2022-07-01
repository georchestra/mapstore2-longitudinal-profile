import {
    ADD_PROFILE_DATA,
    LOADING,
    TOGGLE_MODE,
    CHANGE_REFERENTIAL,
    CHANGE_DISTANCE,
    INITIALIZED, CHANGE_GEOMETRY, TEAR_DOWN,
    SETUP
} from "@js/extension/actions/longitude";

const DEFAULT_STATE = {
    initialized: false,
    infos: false,
    points: false,
    mode: false,
    loading: false,
    referential: false,
    distance: false,
    geometry: false
};

/**
 * Holds the state of longitudinal profile extension.
 * The shape of the state is the following:
 * ```
 * {
 *     loading: true | false // general loading flag
 *     points: [
 *         []
 *     ],
 *     infos: {},
 *     ...
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
    default:
        return state;
    }
}
