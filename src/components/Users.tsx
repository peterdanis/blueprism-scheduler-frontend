import { Button, Table } from "antd";
import Column from "antd/lib/table/Column";
import React, { useEffect, useState } from "react";
import fetchApi from "../services/fetchApi";
import openNotification from "../utils/notification";

const addNewUser = async () => {
  const data = { name: "testUser 3" /* password: "abcd" */ };
  await fetchApi("/api/users", "POST", data);
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/api/users")
      .then((data) => {
        setLoading(false);
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
      <div id="userTableContainer" style={{ height: "100%", padding: "24px" }}>
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={addNewUser}
        >
          Add new user
        </Button>
        <Table
          dataSource={users}
          rowKey={(record: any) => record.id}
          loading={loading}
          size="middle"
        >
          <Column title="ID" dataIndex="id" />
          <Column title="Name" dataIndex="name" />
          <Column title="Password set" dataIndex="password" />
          <Column title="API key set" dataIndex="apiKey" />
        </Table>
      </div>
    </>
  );
};

export default Users;
