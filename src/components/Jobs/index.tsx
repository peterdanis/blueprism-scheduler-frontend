import { Button, Space, Table } from "antd";
import Column from "antd/lib/table/Column";
import React, { useEffect, useRef, useState } from "react";
import fetchApi from "../../services/fetchApi";
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

type Job = {
  id: number;
  schedule: Schedule;
  runtimeResource: RuntimeResource;
  status: string;
};

type JobLog = {
  id: number;
  scheduleId: number;
  runtimeResourceId: number;
  status: string;
};

const Jobs = () => {
  const [jobs, setJobs] = useState([] as Job[]);
  const [filteredJobs, setFilteredJobs] = useState([] as Job[]);
  const [isLoading, setIsLoading] = useState(true);
  // const [selectedJobId, setSelectedJobId] = useState(0);

  // const AddUserModalRef = useRef<{ showModal: () => void }>(null);
  // const DeleteUserModalRef = useRef<{ showModal: () => void }>(null);

  const loadData = () => {
    setIsLoading(true);
    fetchApi("/api/jobs")
      .then((data) => {
        setIsLoading(false);
        setJobs(data);
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
          list={jobs}
          keys={["id", "name"]}
          placeholder="Search by ID or name"
          resultsSetter={setFilteredJobs}
        />
        <Table
          dataSource={filteredJobs}
          rowKey={(record: any) => record.id}
          loading={isLoading}
          size="middle"
          sticky={true}
        >
          <Column title="ID" dataIndex="id" />
          <Column title="Priority" dataIndex="priority" />
          <Column title="Machine" dataIndex="runtimeResource.friendlyName" />
          <Column title="Schedule" dataIndex="schedule.name" />
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

export default Jobs;
