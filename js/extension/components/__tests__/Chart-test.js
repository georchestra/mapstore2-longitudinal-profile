// @todo Unfortunately these tests can't be processed. For some reason they fails due to syntax of try..catch statement
// inside of the "preProcessValues" function used by "toPlotly" adapter in WidgetChart.jsx of MapStore upstream
//
// import React from 'react';
// import ReactDOM from "react-dom";
// import expect from "expect";
// import {DATASET_1} from "@mapstore/components/charts/__tests__/sample_data";
// import Chart from "@js/extension/components/Chart";
//
// describe('Chart', () => {
//     beforeEach((done) => {
//         document.body.innerHTML = '<div id="container"></div>';
//         setTimeout(done);
//     });
//     afterEach((done) => {
//         ReactDOM.unmountComponentAtNode(document.getElementById("container"));
//         document.body.innerHTML = '';
//         setTimeout(done);
//     });
//
//     it('rendering line', (done) => {
//         const check = ({ data, layout }, graphDiv) => {
//             expect(graphDiv).toExist();
//             expect(layout.showLegend).toBeFalsy();
//             expect(layout.autosize).toBeFalsy();
//             expect(layout.automargin).toBeFalsy();
//             expect(layout.hovermode).toBe('x unified');
//             expect(data.length).toEqual(1);
//             // use yAxis dataKey as default label
//             expect(data[0].name).toEqual(DATASET_1.series[0].dataKey);
//             // data values mapped
//             data[0].y.map((v, i) => expect(v).toBe(DATASET_1.data[i][DATASET_1.series[0].dataKey]));
//             // data labels mapped
//             data[0].x.map((v, i) => expect(v).toBe(DATASET_1.data[i][DATASET_1.xAxis.dataKey]));
//             done();
//         };
//         ReactDOM.render(<Chart onInitialized={check} {...DATASET_1} type="line" yAxisLabel="Test1" xAxisLabel="Test2" />, document.getElementById("container"));
//     });
// });
