import Rx from 'rxjs';
import turfCenter from '@turf/center';

import {SET_CONTROL_PROPERTY, setControlProperty} from "@mapstore/actions/controls";
import {
    configSelector,
    dataSourceMode,
    geometrySelector,
    isDockOpen
} from "@js/extension/selectors";
import {
    CONTROL_DOCK_NAME,
    CONTROL_NAME,
    CONTROL_PROPERTIES_NAME, LONGITUDINAL_OWNER,
    LONGITUDINAL_VECTOR_LAYER_ID
} from "@js/extension/constants";
import {changeDrawingStatus, END_DRAWING} from "@mapstore/actions/draw";
import {
    addProfileData, changeDistance, changeReferential, initialized,
    loading,
    openDock, SETUP,
    TEAR_DOWN,
    TOGGLE_MODE,
    CHANGE_GEOMETRY, CHANGE_DISTANCE, CHANGE_REFERENTIAL, changeGeometry
} from "@js/extension/actions/longitude";
import executeProcess, {makeOutputsExtractor} from "@mapstore/observables/wps/execute";
import {profileEnLong} from "@js/extension/observables/wps/profile";
import {wrapStartStop} from "@mapstore/observables/epics";
import {error} from "@mapstore/actions/notifications";
import {UPDATE_MAP_LAYOUT, updateDockPanelsList, updateMapLayout} from "@mapstore/actions/maplayout";
import {highlightStyleSelector, mapInfoEnabledSelector} from "@mapstore/selectors/mapInfo";
import {toggleMapInfoState} from "@mapstore/actions/mapInfo";
import {changeMapView, registerEventListener, unRegisterEventListener} from "@mapstore/actions/map";
import {get, omit} from "lodash";
import {removeAdditionalLayer, updateAdditionalLayer} from "@mapstore/actions/additionallayers";
import {styleFeatures} from "@js/extension/utils/geojson";
import {reprojectGeoJson} from "@mapstore/utils/CoordinatesUtils";
import {mapSelector} from "@mapstore/selectors/map";

const OFFSET = 550;

const DEACTIVATE_ACTIONS = [
    changeDrawingStatus("stop"),
    changeDrawingStatus("clean", '', CONTROL_NAME)
];

const deactivate = () => Rx.Observable.from(DEACTIVATE_ACTIONS);

export const setupLongitudinalExtension = (action$) =>
    action$.ofType(SETUP)
        .switchMap(({config: { referentiels, distances, defaultDistance, defaultReferentiel }}) => {
            return Rx.Observable.of(
                updateDockPanelsList(CONTROL_DOCK_NAME, "add", "right"),
                changeReferential(defaultReferentiel ?? referentiels[0].layerName),
                changeDistance(defaultDistance ?? distances[0]),
                updateAdditionalLayer(
                    LONGITUDINAL_VECTOR_LAYER_ID,
                    LONGITUDINAL_OWNER,
                    'overlay',
                    {
                        id: LONGITUDINAL_VECTOR_LAYER_ID,
                        features: [],
                        type: "vector",
                        name: "selectedLine",
                        visibility: true
                    }),
                initialized()
            );
        })
        .catch((e) => {
            console.log(e); // eslint-disable-line no-console
            return Rx.Observable.of(error({ title: "Error", message: "Unable to setup longitudinal profile extension" }));
        });

export const cleanOnTearDown = (action$) =>
    action$.ofType(TEAR_DOWN)
        .switchMap(() => {
            return Rx.Observable.of(
                setControlProperty(CONTROL_NAME, 'enabled', false),
                setControlProperty(CONTROL_NAME, 'dataSourceMode', false),
                setControlProperty(CONTROL_DOCK_NAME, 'enabled', false),
                setControlProperty(CONTROL_PROPERTIES_NAME, 'enabled', false),
                updateDockPanelsList(CONTROL_NAME, "remove", "right"),
                removeAdditionalLayer({id: LONGITUDINAL_VECTOR_LAYER_ID, owner: LONGITUDINAL_OWNER})
            );
        });

export const onDrawActivated = (action$, store) =>
    action$.ofType(TOGGLE_MODE)
        .switchMap(()=> {
            const state = store.getState();
            const mode = dataSourceMode(state);
            switch (mode) {
            case "draw":
                const startDrawingAction = changeDrawingStatus('start', "LineString", CONTROL_NAME, [], { stopAfterDrawing: true });
                return action$.ofType(END_DRAWING).flatMap(
                    ({ geometry }) => {
                        return Rx.Observable.of(changeGeometry(geometry))
                            .merge(
                                Rx.Observable.of(startDrawingAction).delay(200) // reactivate drawing
                            );
                    })
                    .startWith(startDrawingAction)
                    .takeUntil(action$.filter(({ type }) =>
                        type === TOGGLE_MODE && dataSourceMode(store.getState()) !== 'draw'
                    ))
                    .concat(deactivate());
            case "select":
                return Rx.Observable.from([
                    ...(get(store.getState(), 'draw.drawOwner', '') === CONTROL_NAME ? DEACTIVATE_ACTIONS : []),
                    registerEventListener('click', CONTROL_NAME),
                    ...(mapInfoEnabledSelector(state) ? [toggleMapInfoState()] : [])
                ]);
            default:
                return Rx.Observable.from([
                    ...(get(store.getState(), 'draw.drawOwner', '') === CONTROL_NAME ? DEACTIVATE_ACTIONS : []),
                    unRegisterEventListener('click', CONTROL_NAME)
                ]);
            }
        });

export const onChartPropsChange = (action$, store) =>
    action$.ofType(CHANGE_GEOMETRY, CHANGE_DISTANCE, CHANGE_REFERENTIAL)
        .filter(() => {
            const state = store.getState();
            return !!geometrySelector(state);
        })
        .switchMap(() => {
            const state = store.getState();
            const geometry = geometrySelector(state);
            const identifier = configSelector(state)?.identifier;
            const wpsurl = configSelector(state)?.wpsurl;
            const referentiel = configSelector(state)?.referential;
            const distance = configSelector(state)?.distance;
            return executeProcess(wpsurl, profileEnLong({identifier, geometry, distance, referentiel }),
                {outputsExtractor: makeOutputsExtractor()})
                .switchMap((result) => {
                    const feature = {
                        type: 'Feature',
                        geometry
                    };
                    const map = mapSelector(state);
                    const center = turfCenter(reprojectGeoJson(feature, geometry.projection, 'EPSG:4326')).geometry.coordinates;
                    const { infos, points } = result?.profile ?? {};
                    const styledFeatures = styleFeatures([feature], omit(highlightStyleSelector(state), ["radius"]));
                    const features = styledFeatures && geometry.projection ? styledFeatures.map( f => reprojectGeoJson(
                        f,
                        geometry.projection
                    )) : styledFeatures;
                    return infos && points ? Rx.Observable.from([
                        updateAdditionalLayer(
                            LONGITUDINAL_VECTOR_LAYER_ID,
                            LONGITUDINAL_OWNER,
                            'overlay',
                            {
                                id: LONGITUDINAL_VECTOR_LAYER_ID,
                                features,
                                type: "vector",
                                name: "selectedLine",
                                visibility: true
                            }),
                        changeMapView({x: center[0], y: center[1]}, map.zoom, map.bbox, map.size, null, map.projection),
                        addProfileData(infos, points)
                    ]) : Rx.Observable.empty();
                })
                .catch(e => {
                    console.log("Error while obtaining data for longitudinal profile"); // eslint-disable-line no-console
                    console.log(e); // eslint-disable-line no-console
                    return Rx.Observable.empty();
                })
                .let(wrapStartStop(
                    [loading(true), ...(!isDockOpen(state) ? [openDock()] : [])],
                    loading(false),
                    () => Rx.Observable.of(error({
                        title: "notification.error",
                        message: "error loading data for longitudinal profile",
                        autoDismiss: 6,
                        position: "tc"
                    }))
                ));
        });

/**
 * Cleanup geometry when dock is closed
 * @param action$
 * @returns {*}
 */
export const onDockClosed = (action$) =>
    action$.ofType(SET_CONTROL_PROPERTY)
        .filter(({control, property, value}) => control === CONTROL_DOCK_NAME && property === 'enabled' && value === false)
        .switchMap(() => {
            return Rx.Observable.from([
                changeGeometry(false),
                removeAdditionalLayer({id: LONGITUDINAL_VECTOR_LAYER_ID, owner: LONGITUDINAL_OWNER})
            ]);
        });

/**
 * Re-trigger an update map layout with the margin to adjust map layout and show navigation toolbar. This
 * also keep the zoom to extent offsets aligned with the current visibile window, so when zoom the longitudinal panel
 * is considered as a right offset and it will not cover the zoomed features.
 */
export const longitudinalMapLayout = (action$, store) =>
    action$.ofType(UPDATE_MAP_LAYOUT)
        .filter(({source}) => isDockOpen(store.getState()) &&  source !== CONTROL_NAME)
        .map(({layout}) => {
            const action = updateMapLayout({
                ...layout,
                right: OFFSET + (layout?.boundingSidebarRect?.right ?? 0),
                boundingMapRect: {
                    ...(layout.boundingMapRect || {}),
                    right: OFFSET + (layout?.boundingSidebarRect?.right ?? 0)
                },
                rightPanel: true
            });
            return { ...action, source: CONTROL_NAME }; // add an argument to avoid infinite loop.
        });
