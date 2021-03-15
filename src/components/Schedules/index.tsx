import { Button, Space, Table, Tag } from "antd";
import Column from "antd/lib/table/Column";
import React, { useEffect, useRef, useState } from "react";
import fetchApi from "../../services/fetchApi";
import { idColumnWidth, tableSettings } from "../../utils/commonSettings";
import openNotification from "../../utils/notification";
import SearchBox from "../SearchBox";

type Schedule = {
  id: number;
  name: string;
};

type RuntimeResource = {
  id: number;
  friendlyName: string;
};

const Schedules = () => {
  const [schedules, setSchedules] = useState([] as Schedule[]);
  const [filteredSchedules, setFilteredSchedules] = useState([] as Schedule[]);
  const [isLoading, setIsLoading] = useState(true);
  // const [selectedJobId, setSelectedJobId] = useState(0);

  // const AddUserModalRef = useRef<{ showModal: () => void }>(null);
  // const DeleteUserModalRef = useRef<{ showModal: () => void }>(null);

  const loadData = () => {
    setIsLoading(true);
    fetchApi("/api/schedules")
      .then((data) => {
        setIsLoading(false);
        setSchedules(data);
      })
      .catch((error) => {
        openNotification("Error", error.message, "error");
        console.error(error);
      });
  };

  useEffect(loadData, []);

  return (
    <>
      {/* <AddUserModal loadData={loadData} ref={AddUserModalRef} />
      <DeleteModal
        id={selectedJobId}
        route={"/api/users"}
        ref={DeleteUserModalRef}
        loadData={loadData}
      /> */}
      <Space direction="vertical" size="large">
        {/* <Button
          type="primary"
          onClick={() => {
            AddUserModalRef?.current?.showModal();
          }}
        >
          Add new user
        </Button> */}
        <SearchBox
          list={schedules}
          keys={["id", "name", "runtimeResource.friendlyName"]}
          placeholder="Search by ID, name, machine..."
          resultsSetter={setFilteredSchedules}
        />
        <Table
          dataSource={filteredSchedules}
          rowKey={(record: any) => record.id}
          loading={isLoading}
          {...tableSettings}
        >
          <Column title="ID" dataIndex="id" width={idColumnWidth} />
          <Column title="Name" dataIndex="name" />
          <Column title="Priority" dataIndex="priority" />
          <Column
            title="Machine"
            render={(record) => record.runtimeResource.friendlyName}
          />

          {/* <Column
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
                      setSelectedJobId(record.id);
                      DeleteUserModalRef?.current?.showModal();
                    }}
                  />
                </Space>
              </>
            )}
          /> */}
        </Table>
      </Space>
    </>
  );
};

export default Schedules;
