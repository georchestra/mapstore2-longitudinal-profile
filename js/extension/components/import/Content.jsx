import React, { useCallback } from 'react';
import { Glyphicon, Alert } from 'react-bootstrap';

import HTML from "@mapstore/components/I18N/HTML";
import Button from "@mapstore/components/misc/Button";
import Message from "@mapstore/components/I18N/Message";
import LoadingContent from "@mapstore/components/import/dragZone/LoadingContent";

const DropZoneContent = ({openFileDialog}) =>
    (
        <div>
            <HTML msgId="longitudinal.dropZone.heading"/>
            {openFileDialog
                ?
                <Button bsStyle="primary" onClick={openFileDialog}><Message msgId="longitudinal.dropZone.selectFiles"/></Button>
                : null
            }
            <br/>
            <br/>
            <HTML msgId="longitudinal.dropZone.infoSupported"/>
        </div>
    );

const NormalContent = ({openFileDialog}) => {
    return (
        <>
            <div>
                <Glyphicon
                    glyph="upload"
                    style={{
                        fontSize: 80
                    }} />
            </div>
            <DropZoneContent openFileDialog={openFileDialog} />
        </>
    );
};

const ErrorContent = ({error, openFileDialog}) => {
    const errorMessages = {
        "FILE_NOT_SUPPORTED": <Message msgId="mapImport.errors.fileNotSupported" />,
        "PROJECTION_NOT_SUPPORTED": <Message msgId="mapImport.errors.projectionNotSupported" />
    };
    const toErrorMessage = useCallback(e =>
        e
            ? errorMessages[e.message]
        || errorMessages[e]
        || <span><Message msgId="mapImport.errors.unknownError" />:<Alert bsStyle="warning">{error.message}</Alert></span>
            : <Message msgId="mapImport.errors.unknownError" />, []);
    return (
        <>
            <div>
                <Glyphicon
                    glyph="exclamation-mark"
                    style={{
                        fontSize: 80
                    }}/>
            </div>
            <h5>
                {toErrorMessage(error)}
            </h5>
            <DropZoneContent openFileDialog={openFileDialog} />
        </>
    );
};


const ImportDialog = ({ openFileDialog, loading, error }) => {
    if (loading) {
        return (
            <LoadingContent />
        );
    }
    return (
        <div className="longitudinal-import">
            {
                error ? <ErrorContent error={error} openFileDialog={openFileDialog} /> : <NormalContent openFileDialog={openFileDialog} />
            }
        </div>

    );
};

export default ImportDialog;
