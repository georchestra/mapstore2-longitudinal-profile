import React from 'react';
import { Glyphicon } from 'react-bootstrap';

import HTML from "@mapstore/components/I18N/HTML";
import Button from "@mapstore/components/misc/Button";
import Message from "@mapstore/components/I18N/Message";
import LoadingContent from "@mapstore/components/import/dragZone/LoadingContent";
import ErrorContent from "@mapstore/components/import/dragZone/ErrorContent";


const ImportDialog = ({ openFileDialog, loading, error }) => {
    if (loading) {
        return (
            <LoadingContent />
        );
    }
    if (error) {
        return (
            <ErrorContent />
        );
    }
    return (
        <div className="longitudinal-import">
            <div>
                <Glyphicon
                    glyph="upload"
                    style={{
                        fontSize: 80
                    }} />
            </div>
            <div>
                <HTML msgId="longitudinal.dropZone.heading" />
                {openFileDialog
                    ? <Button bsStyle="primary" onClick={openFileDialog}><Message msgId="longitudinal.dropZone.selectFiles" /></Button>
                    : null
                }
                <br />
                <br />
                <HTML msgId="longitudinal.dropZone.infoSupported" />
            </div>
        </div>

    );
};

export default ImportDialog;
