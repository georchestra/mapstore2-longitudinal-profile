/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import {connect} from "react-redux";
import { createSelector } from 'reselect';
import {createPlugin} from "@mapstore/utils/PluginsUtils";

import { name } from '../../../config';

import Main from "@js/extension/components/Main";
import Menu from "@js/extension/components/Menu";
import GlobalSpinner from "@mapstore/components/misc/spinners/GlobalSpinner/GlobalSpinner";

import * as epics from '@js/extension/epics';

import {
    dataSourceMode, distanceSelector,
    infosSelector,
    isActiveMenu,
    isDockOpen, isInitialized,
    isParametersOpen, isSupportedLayer,
    pointsSelector, referentialSelector,
    projectionSelector,
    isMaximized, isLoading
} from "@js/extension/selectors";
import longitudinal from '@js/extension/reducers/longitudinal';

import {
    closeDock,
    setup,
    tearDown,
    toggleMode,
    changeReferential,
    changeDistance,
    changeGeometry,
    toggleMaximize,
    addMarker,
    hideMarker
} from "@js/extension/actions/longitudinal";
import { setControlProperty } from "@mapstore/actions/controls";
import { warning } from '@mapstore/actions/notifications';

import {exportCSV} from "@mapstore/actions/widgets";
import {boundingSidebarRectSelector, mapLayoutValuesSelector} from "@mapstore/selectors/maplayout";
import {currentLocaleSelector, currentMessagesSelector} from "@mapstore/selectors/locale";

import {getSelectedLayer} from "@mapstore/selectors/layers";
import '../assets/style.css';

const selector = (state) => ({
    initialized: isInitialized(state),
    size: 550,
    loading: isLoading(state),
    dataSourceMode: dataSourceMode(state),
    isParametersOpen: isParametersOpen(state),
    showDock: isDockOpen(state),
    infos: infosSelector(state),
    points: pointsSelector(state),
    projection: projectionSelector(state),
    referential: referentialSelector(state),
    distance: distanceSelector(state),
    dockStyle: mapLayoutValuesSelector(state, { height: true, right: true }, true),
    helpStyle: mapLayoutValuesSelector(state, { right: true }, false),
    selectedLayer: getSelectedLayer(state),
    isSupportedLayer: isSupportedLayer(state),
    messages: currentMessagesSelector(state),
    currentLocale: currentLocaleSelector(state),
    maximized: isMaximized(state),
    boundingRect: boundingSidebarRectSelector(state)
});

export const LongitudinalNav = connect((state) => ({
    nav: false,
    className: "square-button",
    menuIsActive: isActiveMenu(state),
    isActive: isActiveMenu(state),
    dataSourceMode: dataSourceMode(state),
    isParametersOpen: isParametersOpen(state),
    initialized: isInitialized(state)
}), {
    onActivateTool: setControlProperty.bind(this, "longitudinalProfile", "enabled", true),
    onToggleSourceMode: toggleMode,
    onToggleParameters: setControlProperty.bind(this, "longitudinalProfileParameters", "enabled", true, true)
})(Menu);

export default createPlugin(name, {
    component: connect(
        createSelector(
            [selector],
            (values) => ({
                ...values
            })),
        {
            onCloseDock: closeDock,
            onToggleParameters: setControlProperty.bind(this, "longitudinalProfileParameters", "enabled", true, true),
            onChangeReferential: changeReferential,
            onChangeDistance: changeDistance,
            onToggleSourceMode: toggleMode,
            changeGeometry: changeGeometry,
            toggleMaximize,
            setup,
            tearDown,
            exportCSV,
            warning,
            addMarker,
            hideMarker
        })(Main),
    containers: {
        SidebarMenu: {
            name: "LongitudinalProfile",
            tool: connect(() => ({
                bsStyle: 'tray',
                tooltipPosition: 'left',
                menuProps: {
                    noCaret: true
                }
            }))(LongitudinalNav),
            doNotHide: true,
            position: 1000
        },
        Toolbar: {
            name: "LongitudinalProfile",
            alwaysVisible: true,
            position: 1,
            tool: connect((state) => ({
                loading: isLoading(state)
            }))(GlobalSpinner)
        }
    },
    epics,
    reducers: { longitudinal }
});
