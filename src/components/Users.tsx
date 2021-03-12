import { Button, Table } from "antd";
import Column from "antd/lib/table/Column";
import React, { useEffect, useRef, useState } from "react";
import fetchApi from "../services/fetchApi";
import openNotification from "../utils/notification";
import CustomModal from "./CustomModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const modalRef = useRef<{ showModal: () => void }>(null);

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

  const addNewUser = async () => {
    const data = { name: "testUser 10", password: "abcd" };
    const result = await fetchApi("/api/users", "POST", data);
    if (result) {
      openNotification("User created", undefined, "success", 6);
      loadData();
    }
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
        okFn={addNewUser}
        okButtonName="Create"
        cancelButtonName="Cancel"
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
