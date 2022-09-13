/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
import {toModulePlugin} from "@mapstore/utils/ModulePluginsUtils";
import {name} from "../../../config";

export default toModulePlugin(name, () => import(/* webpackChunkName: 'LongitudinalProfileModule' */ './LongitudinalProfileModule'));
