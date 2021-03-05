import { Layout, Menu } from "antd";
import React from "react";
import "antd/dist/antd.css";
import {
  RetweetOutlined,
  ReadOutlined,
  CalendarOutlined,
  DesktopOutlined,
  TeamOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<RetweetOutlined />}>
            Jobs
          </Menu.Item>
          <Menu.Item key="2" icon={<CalendarOutlined />}>
            Schedules
          </Menu.Item>
          <Menu.Item key="3" icon={<OrderedListOutlined />}>
            Tasks
          </Menu.Item>
          <Menu.Item key="4" icon={<ReadOutlined />}>
            Logs
          </Menu.Item>
          <Menu.Item key="5" icon={<DesktopOutlined />}>
            Machines
          </Menu.Item>
          <Menu.Item key="6" icon={<TeamOutlined />}>
            Users
          </Menu.Item>
        </Menu>
      </Header>
      <Content></Content>
    </Layout>
  );
}

export default App;
