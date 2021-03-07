import React, { useState } from "react";
import { Menu } from "antd";
import {
  CalendarOutlined,
  DesktopOutlined,
  OrderedListOutlined,
  ReadOutlined,
  RetweetOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Jobs from "./Jobs";
import Schedules from "./Schedules";
import Tasks from "./Tasks";
import { SelectInfo } from "rc-menu/lib/interface";
import Logs from "./Logs";
import Machines from "./Machines";
import Users from "./Users";
import Settings from "./Settings";

export const menuItems = {
  Jobs: { component: Jobs, icon: RetweetOutlined },
  Schedules: { component: Schedules, icon: CalendarOutlined },
  Tasks: { component: Tasks, icon: OrderedListOutlined },
  Logs: { component: Logs, icon: ReadOutlined },
  Machines: { component: Machines, icon: DesktopOutlined },
  Users: { component: Users, icon: TeamOutlined },
  Settings: { component: Settings, icon: SettingOutlined },
};

export type MenuItemsKeys = keyof typeof menuItems;

const MenuItems = Object.keys(menuItems).map((item) => {
  const Icon = menuItems[item as MenuItemsKeys].icon;
  return (
    <Menu.Item key={item} icon={<Icon />}>
      {item}
    </Menu.Item>
  );
});

type Props = { onSelect: (e: SelectInfo) => void };

export const Navbar = (props: Props) => {
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={[Object.keys(menuItems)[0]]}
      onSelect={props.onSelect}
    >
      <>{MenuItems}</>
    </Menu>
  );
};
