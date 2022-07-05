import React, { useEffect } from "react";

import {HelpInfo} from "@js/extension/components/HelpInfo";
import Dock from "@js/extension/components/Dock";
import ImportDialog from "@js/extension/components/Import";
import SettingsPanel from "@js/extension/components/SettingsPanel";

const Extension = ({initialized, dataSourceMode, tearDown, setup, onToggleSourceMode, ...props}) => {
    useEffect(() => {
        setup(props.pluginCfg);
        return () => {
            tearDown();
        };
    }, []);

    return initialized ? [
        <HelpInfo style={props.helpStyle} key="help" dataSourceMode={dataSourceMode} {...props} />,
        <Dock key="profile-data" {...props} />,
        <ImportDialog show={dataSourceMode === 'import'} onClose={() => onToggleSourceMode("import")} {...props} />,
        <SettingsPanel {...props} panelStyle={{width: '330px'}} />
    ] : false;
};

export default Extension;
