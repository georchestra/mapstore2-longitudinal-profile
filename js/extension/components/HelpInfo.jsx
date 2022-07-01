import React from 'react';
import classnames from 'classnames';
import HTML from '@mapstore/components/I18N/HTML';
import {getLayerTitle} from "@mapstore/utils/LayersUtils";

export const HelpInfo = ({dataSourceMode, style, messages, selectedLayer, isSupportedLayer, currentLocale}) => {
    if (dataSourceMode && dataSourceMode !== 'import') {
        let layerTitle = messages?.longitudinal?.help?.noLayer;
        if (selectedLayer) {
            layerTitle = isSupportedLayer ? getLayerTitle(selectedLayer, currentLocale) : messages?.longitudinal?.help?.notSupportedLayer;
        }

        return (
            <div style={style} className={classnames({
                'longitude-help': true
            })}>
                <HTML msgId={`longitudinal.help.${dataSourceMode}`}
                    msgParams={{layerName: layerTitle}}/>
            </div>
        );
    }
    return null;

};
