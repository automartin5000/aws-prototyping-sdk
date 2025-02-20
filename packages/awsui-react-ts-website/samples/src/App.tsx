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

import AppLayout, { AppLayoutProps } from "@awsui/components-react/app-layout";
import { createContext, useCallback, useMemo, useState } from "react";
import { BreadcrumbGroup, BreadcrumbGroupProps, SideNavigation, SideNavigationProps, TopNavigation } from "@awsui/components-react";
import {
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import { CancelableEventHandler } from "@awsui/components-react/internal/events";
import Home from "./Home";
import Auth from "./Auth";
import Config from "./config.json";

/**
 * Define your nav items here.
 */
const NAVIGATION_ITEMS: SideNavigationProps.Item[] = [
  {text: "home", type: "link", href:"/"}
];

/**
 * Context for updating/retrieving the AppLayout.
 */
export const AppLayoutContext = createContext({
  appLayoutProps: {},
  setAppLayoutProps: (_: AppLayoutProps) => {}
});

/**
 * Finfs a Nav Item matching the provided href.
 * 
 * @param href href to search for
 * @param root root nav items to begin search
 * @returns a nav item matching href or undefined.
 */
const findNavItem = (href: string, root?: SideNavigationProps.Item[]): SideNavigationProps.Item | undefined =>
  root?.find((i: any) => i?.href === href) || root?.map((i: any) => findNavItem(href, i?.items))?.find((i: any) => i?.href === href);

/**
 * Defines the App layout and contains logic for routing.
 */
const App: React.FC = () => {
  const navigate = useNavigate();
  const [activeHref, setActiveHref] = useState("/");
  const [activeBreadcrumbs, setActiveBreadcrumbs] = useState<BreadcrumbGroupProps.Item[]>([{text: "/", href: "/"}]);
  const [appLayoutProps, setAppLayoutProps] = useState<AppLayoutProps>({});

  const setAppLayoutPropsSafe = useCallback((props: AppLayoutProps) => {
    JSON.stringify(appLayoutProps) !== JSON.stringify(props) && setAppLayoutProps(props);
  }, [appLayoutProps]);

  const onNavigate = useMemo((): CancelableEventHandler<BreadcrumbGroupProps.ClickDetail | SideNavigationProps.FollowDetail> => (e) => {
    e.preventDefault();
    setAppLayoutProps({});
    setActiveHref(e.detail.href);

    const segments = ['/', ...e.detail.href.split("/").filter(segment => segment !== '')];
    setActiveBreadcrumbs(segments
      .map((segment, i) => {
        const href = segments.slice(0, i+1).join('/').replace('//', '/');
        return {
          href,
          text: segment,
        };
      })
      .filter((item: any) => findNavItem(item?.href, NAVIGATION_ITEMS))
    );
    navigate(e.detail.href);     
  }, [navigate, setAppLayoutProps, setActiveBreadcrumbs]);

  return (
    <Auth>
      <TopNavigation
        key={"header"}
        i18nStrings={{overflowMenuTitleText: "Header", overflowMenuTriggerText: "Header"}}
        identity={{title: Config.applicationName, href:"", logo: { src: "logo512.png" }}}/>
      <AppLayout
        headerSelector="header"
        breadcrumbs={<BreadcrumbGroup
          onFollow={onNavigate}
          items={activeBreadcrumbs}/>}
        toolsHide
        navigation={
          <SideNavigation
            header={{text: Config.applicationName, href: "/"}}
            activeHref={activeHref}
            onFollow={onNavigate}
            items={NAVIGATION_ITEMS}
          />}
        content={
          <AppLayoutContext.Provider value={{ appLayoutProps, setAppLayoutProps: setAppLayoutPropsSafe }}>
            <Routes>
              { /* Define all your routes here */ }
              <Route path="/" element={<Home/>}/>
            </Routes>
          </AppLayoutContext.Provider>
        }
        {...appLayoutProps}
      />
    </Auth>
  );
};

export default App;