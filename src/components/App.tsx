import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";
import { Navbar } from "./Navbar";
import { GlobalState } from "./GlobalState";
import Jobs from "./Jobs";
import Schedules from "./Schedules";
import Tasks from "./Tasks";
import Logs from "./Logs";
import Machines from "./Machines";
import Users from "./Users";
import Settings from "./Settings";

const { Header, Content } = Layout;

const App = () => {
  const [key, setKey] = useState("jobs");
  const [component, setComponent] = useState(<Jobs />);

  useEffect(() => {
    console.log("useEffect");
    switch (key) {
      case "Jobs":
        setComponent(<Jobs />);
        break;
      case "Tasks":
        setComponent(<Tasks />);
        break;
      case "Users":
        setComponent(<Users />);
        break;
      default:
        break;
    }
  }, [key]);

  return (
    <GlobalState>
      <Layout className="layout" style={{ height: "100%" }}>
        <Header>
          <Navbar
            onSelect={(e) => {
              setKey(e.key as string);
            }}
          />
        </Header>
        <Content style={{ height: "100%", margin: "24px" }}>
          {component}
        </Content>
      </Layout>
    </GlobalState>
  );
};

export default App;
