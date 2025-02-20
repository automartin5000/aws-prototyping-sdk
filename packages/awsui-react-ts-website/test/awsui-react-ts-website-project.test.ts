/*********************************************************************************************************************
 Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License").
 You may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 ******************************************************************************************************************** */

import { synthSnapshot } from "projen/lib/util/synth";
import { AwsUiReactTsWebsiteProject } from "../src";

describe("AwsUiReactTsWebsiteProject Unit Tests", () => {
  it("Defaults", () => {
    const project = new AwsUiReactTsWebsiteProject({
      defaultReleaseBranch: "mainline",
      name: "Defaults",
      applicationName: "Defaults",
    });
    expect(synthSnapshot(project)).toMatchSnapshot();
  });

  it("Custom Options", () => {
    const project = new AwsUiReactTsWebsiteProject({
      defaultReleaseBranch: "mainline",
      name: "CustomOptions",
      applicationName: "CustomOptions",
      deps: ["aws-prototoyping-sdk"],
    });
    expect(synthSnapshot(project)).toMatchSnapshot();
  });
});
