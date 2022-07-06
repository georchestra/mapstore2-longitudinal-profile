/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import SettingsPanel from "@mapstore/plugins/settings/SettingsPanel";
import Dialog from "@mapstore/components/misc/Dialog";
import Message from "@mapstore/plugins/locale/Message";
import {Properties} from "@js/extension/components/Properties";

const Panel = ({ isParametersOpen, ...props }) => {
    const settings =
        (<SettingsPanel key="LongitudinalSettingsPanel" role="body" style={props.style}>
            <Properties {...props} />
        </SettingsPanel>);

    return (<Dialog id={props.id} style={{...props.panelStyle, display: isParametersOpen ? 'block' : 'none'}} className={props.panelClassName} draggable={false} modal>
        <span role="header">
            <span className="settings-panel-title"><Message msgId="settings"/></span>
            <button onClick={props.onToggleParameters} className="settings-panel-close close">{props.closeGlyph ? <Glyphicon glyph={props.closeGlyph}/> : <span>×</span>}</button>
        </span>
        {settings}
    </Dialog>);
};

export default Panel;
