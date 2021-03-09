import { Button, Table } from "antd";
import Column from "antd/lib/table/Column";
import React, { useEffect, useState } from "react";

const onClickHandler = (e: React.MouseEvent) => {
  console.log(e);
};

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: string) => <a onClick={onClickHandler}>{text}</a>,
  },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
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
      });
  }, []);

  return (
    <>
      <div id="userTableContainer" style={{ height: "100%", padding: "24px" }}>
        <Button type="primary" style={{ marginBottom: 16 }}>
          Add new user
        </Button>
        <Table
          dataSource={users}
          // style={{ height: "100%" }}
          rowKey={(record: any) => record.id}
          loading={loading}
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
