/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import React, {useState, useMemo, useEffect} from "react";
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {ButtonGroup, Col, Glyphicon, Nav, NavItem, Row} from 'react-bootstrap';

import Message from "@mapstore/components/I18N/Message";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
import tooltip from "@mapstore/components/misc/enhancers/tooltip";
import Chart from "@js/extension/components/Chart";
import Button from "@mapstore/components/misc/Button";
import Toolbar from "@mapstore/components/misc/toolbar/Toolbar";
import ContainerDimensions from 'react-container-dimensions';
import {Properties} from "@js/extension/components/Properties";
import LoadingView from "@mapstore/components/misc/LoadingView";
import {reproject} from "@mapstore/utils/CoordinatesUtils";

const NavItemT = tooltip(NavItem);

const ChartData = ({ points, messages, loading, maximized, toggleMaximize, boundingRect, dockStyle, referentiels, referential, addMarker, hideMarker, ...props }) => {
    const data = useMemo(() => points ? points.map((point) => ({
        distance: point[0],
        x: point[1],
        y: point[2],
        altitude: point[3],
        incline: point[4]
    })) : [], [points]);
    const [marker, setMarker] = useState([]);

    useEffect(() => {
        if (marker.length) {
            const point = reproject(marker, referentiels.find(el => el.layerName).projection, 'EPSG:4326');
            addMarker({lng: point.y, lat: point.x, projection: 'EPSG:4326'});
        } else {
            hideMarker();
        }
    }, [marker]);


    const series = [{dataKey: "altitude", color: `#078aa3`}];
    const xAxis = {dataKey: "distance", show: false, showgrid: true};
    const options = {
        xAxisAngle: 0,
        yAxis: true,
        yAxisLabel: messages.longitudinal.elevation,
        legend: false,
        tooltip: false,
        cartesian: true,
        popup: false,
        xAxisOpts: {
            hide: false,
            format: '.2s',
            tickSuffix: ' m'
        },
        yAxisOpts: {
            tickSuffix: ' m'
        },
        xAxisLabel: messages.longitudinal.distance
    };

    const content = loading
        ? <LoadingView />
        : (
            <div className="longitudinal-container" onMouseOut={() => marker.length && setMarker([])}>
                <Toolbar
                    btnGroupProps={{
                        className: "chart-toolbar"
                    }}
                    btnDefaultProps={{
                        className: 'no-border',
                        bsSize: 'xs',
                        bsStyle: 'link'
                    }}
                    buttons={[
                        {
                            glyph: maximized ? 'resize-small' : 'resize-full',
                            target: 'icons',
                            tooltipId: `widgets.widget.menu.${maximized ? 'minimize' : 'maximize'}`,
                            tooltipPosition: 'left',
                            visible: true,
                            onClick: () => toggleMaximize()
                        }
                    ]}
                >
                </Toolbar>
                <ContainerDimensions>
                    {({ width, height }) => (
                        <div onMouseOut={() => marker.length && setMarker([])}>
                            <Chart
                                onHover={(info) => {
                                    const idx = info.points[0].pointIndex;
                                    const point = data[idx];
                                    setMarker([ point.x, point.y]);
                                }}
                                {...options}
                                height={maximized ? height - 115 : 400}
                                width={maximized ? width - (dockStyle?.right ?? 0) - (dockStyle?.left ?? 0) : 520 }
                                data={data} series={series} xAxis={xAxis} />
                        </div>

                    )}
                </ContainerDimensions>
                {
                    data.length ? (
                        <ButtonGroup>
                            <Button bsStyle="primary" onClick={() => props.exportCSV({data, title: 'Test'})} className="export">
                                <Glyphicon glyph="download"/> <Message msgId="widgets.widget.menu.downloadData" />
                            </Button>
                        </ButtonGroup>
                    ) : null
                }
            </div>
        );

    if (maximized) {
        return ReactDOM.createPortal(
            content,
            document.getElementById('dock-chart-portal'));
    }
    return content;
};
const Information = ({infos, messages, loading}) => {
    const infoConfig = [
        {
            glyph: '1-layer',
            prop: 'referentiel'
        },
        {
            glyph: 'line',
            prop: 'distance',
            round: true,
            suffix: ' m'
        },
        {
            glyph: 'chevron-up',
            prop: 'denivelepositif',
            suffix: ' m'
        },
        {
            glyph: 'chevron-down',
            prop: 'denivelenegatif',
            suffix: ' m'
        },
        {
            glyph: 'cog',
            prop: 'processedpoints',
            suffix: ` ${messages.longitudinal.points ?? 'points'}`
        }
    ];

    return loading ? <LoadingView /> : (<div className="longitudinal-container">
        {
            infoConfig.map((conf) => (
                <div className="stats-entry" key={conf.prop}>
                    <Glyphicon glyph={conf.glyph} />
                    <span className="stats-value">
                        {
                            [
                                ...[conf.round ? [Math.round(infos[conf.prop])] : [infos[conf.prop]]],
                                ...[conf.suffix ? [conf.suffix] : []]
                            ]
                        }
                    </span>
                </div>))
        }
    </div>);
};

const tabs = [
    {
        id: 'chart',
        titleId: 'longitudinal.chart',
        tooltipId: 'longitudinal.chart',
        glyph: 'stats',
        visible: true,
        Component: ChartData
    },
    {
        id: 'infos',
        titleId: 'longitudinal.infos',
        tooltipId: 'longitudinal.infos',
        glyph: 'info-sign',
        visible: true,
        Component: Information
    },
    {
        id: 'style',
        titleId: 'longitudinal.preferences',
        tooltipId: 'longitudinal.preferences',
        glyph: 'cog',
        visible: true,
        Component: Properties
    }
];

const Dock = ({showDock, onCloseDock, ...props}) => {

    const [activeTab, onSetTab] = useState('chart');

    return showDock ? (
        <ResponsivePanel
            dock
            containerId="longitudinal-profile-container"
            containerClassName={props.maximized ? "maximized" : null}
            containerStyle={props.dockStyle}
            bsStyle="primary"
            position="right"
            title={<Message key="title" msgId="longitudinal.title"/>}
            glyph={<div className="longitudinal-icon" />}
            size={props.size}
            open={showDock}
            onClose={onCloseDock}
            style={props.dockStyle}
            siblings={
                <div id="dock-chart-portal"
                    className={props.maximized ? "visible" : ""}
                    style={{
                        transform: `translateX(${(props.dockStyle?.right ?? 0)}px)`,
                        height: props.dockStyle?.height
                    }}>
                </div>
            }
            header={[
                <Row key="longitudinal-dock-navbar" className="ms-row-tab">
                    <Col xs={12}>
                        <Nav bsStyle="tabs" activeKey={activeTab} justified>
                            {tabs.map(tab =>
                                <NavItemT
                                    key={'ms-tab-settings' + tab.id}
                                    tooltip={<Message msgId={tab.tooltipId}/> }
                                    eventKey={tab.id}
                                    onClick={() => {
                                        onSetTab(tab.id);
                                        if (tab.onClick) { tab.onClick(); }
                                    }}>
                                    <Glyphicon glyph={tab.glyph}/>
                                </NavItemT>
                            )}
                        </Nav>
                    </Col>
                </Row>
            ]}
        >
            {tabs.filter(tab => tab.id && tab.id === activeTab).filter(tab => tab.Component).map(tab => (
                <tab.Component {...props} key={'ms-tab-settings-body-' + tab.id} />
            ))}
        </ResponsivePanel>
    ) : null;
};

Dock.propTypes = {
    size: PropTypes.number
};

export default Dock;
