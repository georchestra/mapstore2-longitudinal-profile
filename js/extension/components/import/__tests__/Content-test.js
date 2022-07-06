/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
import React from 'react';
import expect from 'expect';
import ReactDOM from "react-dom";
import ImportDialog from "@js/extension/components/import/Content";

describe('ImportDialog', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('test render ImportDialog component', () => {
        ReactDOM.render(<ImportDialog openFileDialog={() => {}}/>, document.getElementById("container"));
        const elements = document.getElementsByClassName('longitudinal-import');
        expect(elements.length).toBe(1);
    });

    it('test render ImportDialog component - loading state', () => {
        ReactDOM.render(<ImportDialog openFileDialog={() => {}} loading/>, document.getElementById("container"));
        const elements = document.getElementsByClassName('mapstore-medium-size-loader');
        expect(elements.length).toBe(1);
    });

    it('test render ImportDialog component - error state', () => {
        ReactDOM.render(<ImportDialog openFileDialog={() => {}} error={{message: "Some error"}}/>, document.getElementById("container"));
        const glyphs = document.getElementsByClassName('glyphicon-exclamation-mark');
        const alerts = document.getElementsByClassName('alert-warning');
        expect(glyphs.length).toBe(1);
        expect(alerts.length).toBe(1);
    });

});
