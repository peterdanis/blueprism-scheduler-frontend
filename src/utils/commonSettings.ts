import { FormProps } from "antd";

export const idColumnWidth = "45px";
export const tableSettings = {
  sticky: true,
  bordered: true,
  size: "small" as "small" | "middle" | "large",
};
export const formSettings: Partial<FormProps> = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
  size: "small",
};
