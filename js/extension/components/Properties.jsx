import React from "react";
import Message from "@mapstore/components/I18N/Message";
import { FormGroup, ControlLabel } from 'react-bootstrap';
import Select from "react-select";


export const Properties = ({
    onChangeReferential,
    onChangeDistance,
    distance,
    referential,
    pluginCfg: {distances, referentiels}
}) => {
    return (
        <div className="longitudinal-container">
            <FormGroup bsSize="small">
                <ControlLabel><Message msgId="longitudinal.settings.referential"/></ControlLabel>
                <Select
                    id="referential"
                    value={referential}
                    clearable={false}
                    options={referentiels.map(r => ({value: r.layerName, label: r.title}))}
                    onChange={(selected) => onChangeReferential(selected?.value)}
                />
            </FormGroup>
            <FormGroup bsSize="small">
                <ControlLabel><Message msgId="longitudinal.settings.distance"/></ControlLabel>
                <Select
                    id="distance"
                    value={distance}
                    clearable={false}
                    options={distances.map(r => ({value: r, label: r}))}
                    onChange={(selected) => onChangeDistance(selected?.value)}
                />
            </FormGroup>
        </div>
    );
};
