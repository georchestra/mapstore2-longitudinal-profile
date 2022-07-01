import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Row, Col, Nav, NavItem, Glyphicon, ButtonGroup, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from "react-select";

import Message from "@mapstore/components/I18N/Message";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
import tooltip from "@mapstore/components/misc/enhancers/tooltip";
import Chart from "@js/extension/components/Chart";
import Button from "@mapstore/components/misc/Button";

const NavItemT = tooltip(NavItem);

const ChartData = ({ points, messages, ...props }) => {
    const data = points.map((point) => ({
        distance: point[0],
        x: point[1],
        y: point[2],
        altitude: point[3],
        incline: point[4]
    }));

    const series = [{dataKey: "altitude", color: `#078aa3`}];
    const xAxis = {dataKey: "distance", show: false, showgrid: true};
    const options = {
        xAxisAngle: 0,
        yAxis: true,
        yAxisLabel: messages.longitudinal.elevation,
        legend: false,
        tooltip: false,
        cartesian: true,
        width: 520,
        height: 400,
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

    return (<div className="longitudinal-container">
        <Chart {...options} data={data} series={series} xAxis={xAxis} />
        {
            data.length ? (
                <ButtonGroup>
                    <Button bsStyle="primary" onClick={() => props.exportCSV({data, title: 'Test'})} className="export">
                        <Glyphicon glyph="download"/> <Message msgId="widgets.widget.menu.downloadData" />
                    </Button>
                </ButtonGroup>
            ) : null
        }

    </div>);
};
const Information = ({infos, messages}) => {
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

    return (<div className="longitudinal-container">
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
