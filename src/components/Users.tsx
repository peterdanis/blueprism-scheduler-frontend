import { Button, Table } from "antd";
import Column from "antd/lib/table/Column";
import React, { useEffect, useRef, useState } from "react";
import fetchApi from "../services/fetchApi";
import openNotification from "../utils/notification";
import CustomModal from "./CustomModal";
import { promisify } from "util";

const addNewUser = async () => {
  const data = { name: "testUser 5" /* password: "abcd" */ };
  await fetchApi("/api/users", "POST", data);
};

const testFn = async () => {
  return new Promise((resolve, reject) => {
    console.log("before");
    setTimeout(() => {
      console.log("after");
      resolve("value");
    }, 3000);
  });
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const modalRef = useRef<{ showModal: () => void }>(null);

  useEffect(() => {
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
  }, []);

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
        okFn={testFn}
        cancelFn={testFn}
        okButtonName="1"
        cancelButtonName="2"
        ref={modalRef}
      />
      <Table
        dataSource={users}
        rowKey={(record: any) => record.id}
        loading={isLoading}
        size="middle"
      >
        <Column title="ID" dataIndex="id" />
        <Column title="Name" dataIndex="name" />
        <Column title="Password set" dataIndex="password" />
        <Column title="API key set" dataIndex="apiKey" />
      </Table>
    </>
  );
};

export default Users;
