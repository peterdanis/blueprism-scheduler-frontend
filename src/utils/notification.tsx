import { notification } from "antd";

const openNotification = (
  title: string,
  message: string,
  kind: "info" | "warning" | "error" = "info"
) => {
  notification[kind]({
    message: title,
    description: message,
    onClick: () => {
      console.log("Notification Clicked!");
    },
  });
};

export default openNotification;
