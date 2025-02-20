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

import * as fs from "fs";
import * as path from "path";
import { SampleDir } from "projen";
import {
  ReactTypeScriptProject,
  ReactTypeScriptProjectOptions,
} from "projen/lib/web";

/**
 * Configuration options for the AwsUiReactTsWebsiteProject.
 */
export interface AwsUiReactTsWebsiteProjectOptions
  extends ReactTypeScriptProjectOptions {
  /**
   * Name of the application name.
   *
   * @default "Sample App"
   */
  readonly applicationName?: string;
  /**
   * Public directory.
   *
   * @default "public"
   */
  readonly publicDir?: string;
}

/**
 * Synthesizes a AWS UI React Typescript Website Project.
 *
 * @pjid awsui-react-ts-website
 */
export class AwsUiReactTsWebsiteProject extends ReactTypeScriptProject {
  public readonly applicationName: string;
  public readonly publicDir: string;

  constructor(options: AwsUiReactTsWebsiteProjectOptions) {
    super({
      ...options,
      defaultReleaseBranch: options.defaultReleaseBranch,
      name: options.name,
      sampleCode: false,
      readme: {
        contents: fs
          .readFileSync(path.resolve(__dirname, "../README.md"))
          .toString(),
      },
      gitignore: ["runtime-config.json"],
    });

    this.addDevDeps("@babel/plugin-proposal-private-property-in-object");
    this.addDeps(
      "@awsui/global-styles",
      "@awsui/components-react",
      "@awsui/collection-hooks",
      "react-router-dom",
      "aws-amplify",
      "@aws-amplify/ui-react"
    );

    this.applicationName = options.applicationName ?? "Sample App";
    this.publicDir = options.publicDir ?? "public";
    const srcDir = path.resolve(__dirname, "../samples/src");
    new SampleDir(this, this.srcdir, {
      files: {
        ...Object.fromEntries(
          fs
            .readdirSync(srcDir)
            .filter((f) => f !== "config.json")
            .map((name) => [
              name,
              fs.readFileSync(`${srcDir}/${name}`).toString(),
            ])
        ),
        "config.json": JSON.stringify(
          {
            applicationName: this.applicationName,
          },
          undefined,
          2
        ),
      },
    });

    const publicDir = path.resolve(__dirname, "../samples/public");
    new SampleDir(this, this.publicDir, {
      sourceDir: publicDir,
      files: {
        // override index.html to pass through applicationName
        "index.html": fs
          .readFileSync(`${publicDir}/index.html`)
          .toString()
          .replace("<title></title>", `<title>${this.applicationName}</title>`),
      },
    });
  }
}
