/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import React from 'react';

import DragZone from '@mapstore/components/import/dragZone/DragZone.jsx';
import Content from './import/Content';
import processFile from '@js/extension/enhancers/processFile';
import useFile from '@js/extension/enhancers/useFile';
import dropZoneHandlers from '@mapstore/components/import/dragZone/enhancers/dropZoneHandlers';
import { compose } from 'recompose';

export default compose(
    processFile,
    useFile,
    dropZoneHandlers
)(
    ({
        onClose = () => {},
        onDrop = () => {},
        onRef = () => {},
        show,
        ...props
    }) => <DragZone
        onClose={onClose}
        onDrop={onDrop}
        onRef={onRef}
    >
        <Content {...props} />
    </DragZone>);
