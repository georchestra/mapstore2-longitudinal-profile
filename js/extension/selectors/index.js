/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import {CONTROL_DOCK_NAME, CONTROL_NAME, CONTROL_PROPERTIES_NAME} from "@js/extension/constants";
import {getSelectedLayer} from "@mapstore/selectors/layers";
import {mapSelector} from "@mapstore/selectors/map";
import {get} from "lodash";

export const isInitialized = (state) => state?.longitudinal?.initialized;
export const isLoading = (state) => state?.longitudinal?.loading;

export const dataSourceMode = (state) => state?.longitudinal?.mode;
export const geometrySelector = (state) => state?.longitudinal?.geometry;

export const isActive = (state) => state?.controls[CONTROL_NAME]?.enabled;
export const isParametersOpen = (state) => state?.controls[CONTROL_PROPERTIES_NAME]?.enabled;
export const isDockOpen = (state) => state?.controls[CONTROL_DOCK_NAME]?.enabled;

export const isActiveMenu = (state) => isParametersOpen(state) || dataSourceMode(state);

export const infosSelector = (state) => state?.longitudinal?.infos;
export const pointsSelector = (state) => state?.longitudinal?.points;
export const configSelector = (state) => state?.longitudinal?.config;
export const referentialSelector = (state) => configSelector(state)?.referential;
export const distanceSelector = (state) => configSelector(state)?.distance;

export const isSupportedLayer = (state) => {
    const selectedLayer = getSelectedLayer(state);
    const layerType = selectedLayer?.type;
    return ['wms', 'wfs', 'vector'].includes(layerType)
        && (layerType === 'wms' ? selectedLayer?.search?.type === 'wfs' : true)
        && selectedLayer.visibility;
};

export const isListeningClick = (state) => !!(get(mapSelector(state), 'eventListeners.click', []).find((el) => el === CONTROL_NAME));

export const isMaximized = (state) => state?.longitudinal?.maximized;

