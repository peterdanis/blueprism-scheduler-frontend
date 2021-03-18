import React, { forwardRef, useState } from "react";
import CustomModal from "../CustomModal";
import { Form, Input } from "antd";
import fetchApi from "../../services/fetchApi";
import { FieldData } from "rc-field-form/lib/interface";
import notification from "../../utils/notification";
import { formSettings } from "../../utils/commonSettings";

type Props = {
  loadData: () => void;
};

const AddUserModal = forwardRef((props: Props, ref) => {
  const [formData, setFormData] = useState([] as FieldData[]);

  const getFormValue = (fieldName: string) =>
    formData.filter((item) => {
      const a = item.name as string[];
      return a[0] === fieldName;
    })[0]?.value;

  const onOkHandler = async () => {
    if (getFormValue("password") !== getFormValue("confirmPassword")) {
      throw new Error("Passwords do not match!");
    }
    const data = {
      name: getFormValue("username"),
      password: getFormValue("password"),
    };
    const result = await fetchApi("/api/users", "POST", data);
    setFormData([]);
    if (result) {
      notification("User created", undefined, "success", 6);
      props.loadData();
    }
  };

  const onCancelHandler = () => {
    setFormData([]);
  };

  return (
    <CustomModal
      okFn={onOkHandler}
      cancelFn={onCancelHandler}
      okButtonName="Add"
      cancelButtonName="Cancel"
      ref={ref}
      okButtonDisabled={
        formData.filter((item) => item.errors?.length).length > 0
      }
    >
      <h3>Add new user</h3>
      <br />
      <Form
        fields={formData}
        onFieldsChange={(_, fields) => {
          setFormData(fields);
        }}
        {...formSettings}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,}$/,
              message:
                "Minimum password length is 5 and it must contain at least one upper case English letter, one lower case English letter, one digit!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          dependencies={["password"]}
          name="confirmPassword"
          rules={[
            {
              required: getFormValue("password") || false,
              message: "The two passwords that you entered do not match!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </CustomModal>
  );
});

export default AddUserModal;
