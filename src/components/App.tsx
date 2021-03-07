import React, { useState } from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";
import { menuItems, MenuItemsKeys, Navbar } from "./Navbar";
import { GlobalState } from "./GlobalState";
import { SelectInfo } from "rc-menu/lib/interface";

const { Header, Content } = Layout;

const App = () => {
  const [component, setComponent] = useState(menuItems.Jobs.component);

  return (
    <GlobalState>
      <Layout className="layout" style={{ height: "100%" }}>
        <Header>
          <Navbar
            onSelect={(e: SelectInfo) => {
              const key = e.key as MenuItemsKeys;
              setComponent(menuItems[key].component);
            }}
          />
        </Header>
        <Content children={component} style={{ height: "100%" }}></Content>
      </Layout>
    </GlobalState>
  );
};

export default App;
