import { Layout, Menu } from "antd";
import React, { useState } from "react";
import "antd/dist/antd.css";
import {
  CalendarOutlined,
  DesktopOutlined,
  OrderedListOutlined,
  ReadOutlined,
  RetweetOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;

const Jobs = () => {
  return <div>Jobs</div>;
};
const Schedules = () => {
  return <div>Schedules</div>;
};
const Tasks = () => {
  return <div>Schedules</div>;
};

const menuItems = {
  Jobs: { component: Jobs, icon: RetweetOutlined },
  Schedules: { component: Schedules, icon: CalendarOutlined },
  Tasks: { component: Tasks, icon: OrderedListOutlined },
};

type KeyOfMenuItems = keyof typeof menuItems;

const MenuItems = Object.keys(menuItems).map((item) => {
  const Icon = menuItems[item as KeyOfMenuItems].icon;
  return (
    <Menu.Item key={item} icon={<Icon />}>
      {item}
    </Menu.Item>
  );
});

const App = () => {
  const [component, setComponent] = useState(menuItems.Jobs.component);

  return (
    <Layout className="layout">
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[Object.keys(menuItems)[0]]}
          onSelect={(e) => {
            console.log(e);
            const key = e.key as KeyOfMenuItems;
            setComponent(menuItems[key].component);
          }}
        >
          <>{MenuItems}</>
          {/* <Menu.Item key="jobs" icon={<RetweetOutlined />}>
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
          <Menu.Item key="7" icon={<SettingOutlined />}>
            Settings
          </Menu.Item> */}
        </Menu>
      </Header>
      <Content children={component}></Content>
    </Layout>
  );
};

export default App;
