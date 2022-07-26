/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import {DropdownButton, Glyphicon, MenuItem, NavDropdown} from 'react-bootstrap';
import Message from '@mapstore/components/I18N/Message';
import tooltip from "@mapstore/components/misc/enhancers/tooltip";

const TNavDropdown = tooltip(NavDropdown);
const TDropdownButton = tooltip(DropdownButton);

/**
 * A DropDown menu for user details:
 */
function UserMenu(props) {
    const {initialized, dataSourceMode, isParametersOpen, onActivateTool, onToggleSourceMode} = props;
    let DropDown = props.nav ? TNavDropdown : TDropdownButton;

    const onToggleTool = useCallback((toolName) => () => {
        onActivateTool();
        onToggleSourceMode(toolName);
    }, []);

    return initialized ? (
        <React.Fragment>
            <DropDown
                id="longitudinal"
                className={props.className}
                pullRight
                bsStyle={props.menuIsActive ? "primary" : "tray"}
                title={[<div className="longitudinal-icon" />, <Message msgId="longitudinal.title" />]}
                tooltipId="longitudinal.title"
                tooltipPosition={props.tooltipPosition}
                {...props.menuProps}
            >
                <MenuItem active={dataSourceMode === 'draw'} key="draw" onClick={onToggleTool('draw')}>
                    <Glyphicon glyph="pencil"/><Message msgId="longitudinal.draw"/>
                </MenuItem>
                <MenuItem active={dataSourceMode === 'import'} key="import" onClick={onToggleTool('import')}>
                    <Glyphicon glyph="upload"/> <Message msgId="longitudinal.import"/>
                </MenuItem>
                <MenuItem active={dataSourceMode === 'select'} key="select" onClick={onToggleTool('select')}>
                    <Glyphicon glyph="1-layer"/> <Message msgId="longitudinal.select"/>
                </MenuItem>
                <MenuItem key="divider" divider/>
                <MenuItem active={isParametersOpen} key="parameters" onClick={props.onToggleParameters}>
                    <Glyphicon glyph="cog"/> <Message msgId="longitudinal.parameters"/>
                </MenuItem>
            </DropDown>
        </React.Fragment>
    ) : false;
}

UserMenu.propTypes = {
    // PROPS
    initialized: PropTypes.bool,
    className: PropTypes.string,
    hidden: PropTypes.bool,
    bsStyle: PropTypes.string,
    tooltipPosition: PropTypes.string,
    nav: PropTypes.bool,
    menuProps: PropTypes.object,
    menuIsActive: PropTypes.bool,
    dataSourceMode: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    isParametersOpen: PropTypes.bool,
    // CALLBACKS
    onActivateTool: PropTypes.func,
    onToggleSourceMode: PropTypes.func,
    onToggleParameters: PropTypes.func
};

UserMenu.defaultProps = {
    tooltipPosition: 'bottom',
    onActivateTool: () => {},
    onToggleSourceMode: () => {},
    onToggleParameters: () => {},
    bsStyle: "primary",
    className: "longitudinal-menu",
    menuIsActive: false,
    menuProps: {
        noCaret: true
    },
    toolsCfg: [{
        buttonSize: "small",
        includeCloseButton: false,
        useModal: false,
        closeGlyph: "1-close"
    }, {
        buttonSize: "small",
        includeCloseButton: false,
        useModal: false,
        closeGlyph: "1-close"
    }, {
        buttonSize: "small",
        includeCloseButton: false,
        useModal: false,
        closeGlyph: "1-close"
    }],
    renderButtonText: false,
    hidden: false
};

export default UserMenu;
