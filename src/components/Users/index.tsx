import { Button, Space, Table } from "antd";
import Column from "antd/lib/table/Column";
import React, { useEffect, useRef, useState } from "react";
import fetchApi from "../../services/fetchApi";
import openNotification from "../../utils/notification";
import SearchBox from "../SearchBox";
import AddUserModal from "./AddUserModal";
import { DeleteOutlined } from "@ant-design/icons";
import DeleteModal from "../DeleteModal";

type User = {
  id: number;
  name: string;
};

const Users = () => {
  const [users, setUsers] = useState([] as User[]);
  const [filteredUsers, setFilteredUsers] = useState([] as User[]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(0);

  const AddUserModalRef = useRef<{ showModal: () => void }>(null);
  const DeleteUserModalRef = useRef<{ showModal: () => void }>(null);

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

  useEffect(loadData, []);

  return (
    <>
      <AddUserModal loadData={loadData} ref={AddUserModalRef} />
      <DeleteModal
        id={selectedUserId}
        route={"/api/users"}
        ref={DeleteUserModalRef}
        loadData={loadData}
      />
      <Space direction="vertical" size="large">
        <Button
          type="primary"
          onClick={() => {
            AddUserModalRef?.current?.showModal();
          }}
        >
          Add new user
        </Button>
        <SearchBox
          list={users}
          keys={["id", "name"]}
          placeholder="Search by ID or name"
          resultsSetter={setFilteredUsers}
        />
        <Table
          dataSource={filteredUsers}
          rowKey={(record: any) => record.id}
          loading={isLoading}
          size="middle"
          sticky={true}
        >
          <Column title="ID" dataIndex="id" />
          <Column title="Username" dataIndex="name" />
          <Column title="Password set" dataIndex="password" />
          <Column title="API key set" dataIndex="apiKey" />
          <Column
            title="Actions"
            dataIndex="actions"
            render={(_, record: User) => (
              <>
                <Space>
                  <Button size="small">Generate API key</Button>
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      setSelectedUserId(record.id);
                      DeleteUserModalRef?.current?.showModal();
                    }}
                  />
                </Space>
              </>
            )}
          />
        </Table>
      </Space>
    </>
  );
};

export default Users;
