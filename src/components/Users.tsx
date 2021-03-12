import { Button, Form, Input, Table } from "antd";
import Column from "antd/lib/table/Column";
import React, { useEffect, useRef, useState } from "react";
import fetchApi from "../services/fetchApi";
import openNotification from "../utils/notification";
import CustomModal from "./CustomModal";
import { FieldData } from "rc-field-form/lib/interface";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState([] as FieldData[]);
  const [isLoading, setIsLoading] = useState(true);

  const modalRef = useRef<{ showModal: () => void }>(null);

  const getFormValue = (fieldName: string) =>
    formData.filter((item) => {
      const a = item.name as string[];
      return a[0] === fieldName;
    })[0]?.value;

  const loadData = () => {
    setIsLoading(true);
    fetchApi("/api/users")
      .then((data) => {
        setIsLoading(false);
        setUsers(
          data.map((user: any) => {
            if (user && user.password) {
              user.password = "yes";
            }
            if (user && user.apiKey) {
              user.apiKey = "yes";
            }
            return user;
          })
        );
      })
      .catch((error) => {
        openNotification("Error", error.message, "error");
        console.error(error);
      });
  };

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
      openNotification("User created", undefined, "success", 6);
      loadData();
    }
  };

  const onCancelHandler = () => {
    setFormData([]);
  };

  useEffect(loadData, []);

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          modalRef?.current?.showModal();
        }}
      >
        Add new user
      </Button>
      <CustomModal
        okFn={onOkHandler}
        cancelFn={onCancelHandler}
        okButtonName="Add"
        cancelButtonName="Cancel"
        ref={modalRef}
        okButtonDisabled={
          formData.filter((item) => item.errors?.length).length > 0
        }
      >
        <h3>Add new user</h3>
        <br />
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          fields={formData}
          onFieldsChange={(_, fields) => {
            setFormData(fields);
          }}
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
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </CustomModal>
      <Table
        dataSource={users}
        rowKey={(record: any) => record.id}
        loading={isLoading}
        size="middle"
      >
        <Column title="ID" dataIndex="id" />
        <Column title="Username" dataIndex="name" />
        <Column title="Password set" dataIndex="password" />
        <Column title="API key set" dataIndex="apiKey" />
      </Table>
    </>
  );
};

export default Users;
