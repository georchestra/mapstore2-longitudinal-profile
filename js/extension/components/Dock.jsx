import React, { useState } from "react";
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Row, Col, Nav, NavItem, Glyphicon, ButtonGroup, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from "react-select";

import Message from "@mapstore/components/I18N/Message";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
import tooltip from "@mapstore/components/misc/enhancers/tooltip";
import Chart from "@js/extension/components/Chart";
import Button from "@mapstore/components/misc/Button";
import Loader from "@mapstore/components/misc/Loader";
import Toolbar from "@mapstore/components/misc/toolbar/Toolbar";
import ContainerDimensions from 'react-container-dimensions';

const NavItemT = tooltip(NavItem);

const ChartData = ({ points, messages, loading, maximized, toggleMaximize, boundingRect, dockStyle, ...props }) => {
    const data = points ? points.map((point) => ({
        distance: point[0],
        x: point[1],
        y: point[2],
        altitude: point[3],
        incline: point[4]
    })) : [];

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
        ? <div className="longitudinal-container"><div className="loading"><Loader size={176} /></div></div>
        : (
            <div className="longitudinal-container">
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
                            tooltipPosition: 'right',
                            visible: true,
                            onClick: () => toggleMaximize()
                        }
                    ]}
                >
                </Toolbar>
                <ContainerDimensions>
                    {({ width, height }) => (
                        <Chart
                            {...options}
                            height={maximized ? height - 115 : 400}
                            width={maximized ? width - (dockStyle?.right ?? 0) - (dockStyle?.left ?? 0) : 520 }
                            data={data} series={series} xAxis={xAxis} />
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

    return loading ? <div className=" loading"><Loader size={176} /></div> : (<div className="longitudinal-container">
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
const Properties = ({ onChangeReferential, onChangeDistance, distance, referential, pluginCfg: { distances, referentiels } }) => {
    return (
        <div className="longitudinal-container">
            <FormGroup bsSize="small">
                <ControlLabel><Message msgId="longitudinal.settings.referential" /></ControlLabel>
                <Select
                    id="referential"
                    value={referential}
                    clearable={false}
                    options={referentiels.map(r => ({ value: r.layerName, label: r.title}))}
                    onChange={(selected) => onChangeReferential(selected?.value)}
                />
            </FormGroup>
            <FormGroup bsSize="small">
                <ControlLabel><Message msgId="longitudinal.settings.distance" /></ControlLabel>
                <Select
                    id="distance"
                    value={distance}
                    clearable={false}
                    options={distances.map(r => ({ value: r, label: r}))}
                    onChange={(selected) => onChangeDistance(selected?.value)}
                />
            </FormGroup>
        </div>
    );
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
