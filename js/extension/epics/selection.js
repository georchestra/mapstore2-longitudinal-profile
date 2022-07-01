import Rx from 'rxjs';

import {CLICK_ON_MAP} from "@mapstore/actions/map";
import {isListeningClick, isSupportedLayer} from "@js/extension/selectors";
import {getSelectedLayer} from "@mapstore/selectors/layers";
import {buildIdentifyRequest} from "@mapstore/utils/MapInfoUtils";
import {warning} from "@mapstore/actions/notifications";
import {mapSelector} from "@mapstore/selectors/map";
import {getFeatureInfo} from "@mapstore/api/identify";
import {changeGeometry} from "@js/extension/actions/longitude";
import {currentMessagesSelector} from "@mapstore/selectors/locale";

export const clickToProfile = (action$, {getState}) =>
    action$
        .ofType(CLICK_ON_MAP)
        .filter(() => isListeningClick(getState()))
        .switchMap(({point}) => {
            const state = getState();
            const map = mapSelector(state);
            const layer = getSelectedLayer(state);
            if (!layer) {
                return Rx.Observable.of(warning({
                    title: "notification.warning",
                    message: currentMessagesSelector(state)?.longitudinal.warnings.noLayerSelected,
                    autoDismiss: 10,
                    position: "tc"
                }));
            }
            if (!isSupportedLayer(state)) {
                return Rx.Observable.of(warning({
                    title: "notification.warning",
                    message: currentMessagesSelector(state)?.longitudinal.warnings.layerNotSupported,
                    autoDismiss: 10,
                    position: "tc"
                }));
            }

            let {
                url,
                request
            } = buildIdentifyRequest(layer, {format: 'application/json', map, point});

            const basePath = url;
            const param = {...request};
            return getFeatureInfo(basePath, param, layer, {attachJSON: true})
                .map(data => {
                    const stringFeature = (data?.features ?? []).find((f) => ["LineString", "MultiLineString"].includes(f?.geometry?.type));
                    if (stringFeature) {
                        return changeGeometry({
                            type: "LineString",
                            coordinates: stringFeature.geometry.coordinates[0],
                            projection: data.featuresCrs
                        });
                    }
                    return warning({
                        title: "notification.warning",
                        message: currentMessagesSelector(state)?.longitudinal.warnings.noFeatureInPoint,
                        autoDismiss: 10,
                        position: "tc"
                    });
                })
                .catch(e => {
                    console.log("Error while obtaining data for longitudinal profile"); // eslint-disable-line no-console
                    console.log(e); // eslint-disable-line no-console
                    return Rx.Observable.empty();
                });
        });
