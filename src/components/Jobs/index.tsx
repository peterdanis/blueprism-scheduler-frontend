import { Button, Space, Table, Tag } from "antd";
import Column from "antd/lib/table/Column";
import React, { useEffect, useRef, useState } from "react";
import fetchApi from "../../services/fetchApi";
import { idColumnWidth, tableSettings } from "../../utils/commonSettings";
import openNotification from "../../utils/notification";
import SearchBox from "../SearchBox";
import { StopOutlined } from "@ant-design/icons";
import ColumnGroup from "antd/lib/table/ColumnGroup";

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

type JobLog = Omit<Job, "schedule" | "runtimeResource"> & {
  jobId: number;
  scheduleId: number;
  runtimeResourceId: number;
};

const Jobs = () => {
  const [jobs, setJobs] = useState([] as Job[]);
  const [jobLogs, setJobLogs] = useState([] as JobLog[]);
  const [filteredJobs, setFilteredJobs] = useState([] as Job[]);
  const [filteredJobLogs, setFilteredJobLogs] = useState([] as JobLog[]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingJobLogs, setIsLoadingJobLogs] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(0);

  // const AddUserModalRef = useRef<{ showModal: () => void }>(null);
  // const DeleteUserModalRef = useRef<{ showModal: () => void }>(null);

  const loadData = () => {
    setIsLoadingJobs(true);
    fetchApi("/api/jobs")
      .then((data) => {
        setIsLoadingJobs(false);
        setJobs(data);
      })
      .catch((error) => {
        openNotification("Error", error.message, "error");
        console.error(error);
      });
    fetchApi("/api/jobLogs")
      .then((data) => {
        setIsLoadingJobLogs(false);
        setJobLogs(data);
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
          keys={[
            "schedule.id",
            "schedule.name",
            "runtimeResource.friendlyName",
            "status",
          ]}
          placeholder="Search by schedule, machine, status..."
          resultsSetter={setFilteredJobs}
        />
        <Table
          dataSource={filteredJobs}
          rowKey={(record: any) => record.id}
          loading={isLoadingJobs}
          {...tableSettings}
        >
          <ColumnGroup title="Job queue" align="left">
            <Column title="ID" dataIndex="id" width={idColumnWidth} />
            <Column
              title="Schedule"
              render={(record) => record.schedule.name}
            />
            <Column
              title="Status"
              dataIndex="status"
              render={(job) => {
                console.log(job);
                return (
                  <Tag color="red" key={Math.random()}>
                    {job}
                  </Tag>
                );
              }}
            />
            <Column
              title="Machine"
              render={(record) => record.runtimeResource.friendlyName}
            />
            <Column title="Priority" dataIndex="priority" />
            <Column title="Add time" dataIndex="addTime" />
            <Column title="Start time" dataIndex="startTime" />

            <Column
              title="Actions"
              dataIndex="actions"
              render={(_, record: Job) => (
                <>
                  <Space>
                    <Button
                      size="small"
                      type="primary"
                      danger
                      icon={<StopOutlined />}
                      onClick={(e) => {
                        setSelectedJobId(record.id);
                        // DeleteUserModalRef?.current?.showModal();
                      }}
                    />
                  </Space>
                </>
              )}
            />
          </ColumnGroup>
        </Table>
        <SearchBox
          list={jobLogs}
          keys={["jobId", "status"]}
          placeholder="Search by job ID, status"
          resultsSetter={setFilteredJobLogs}
        />
        <Table
          dataSource={filteredJobLogs}
          rowKey={(record: any) => record.id}
          loading={isLoadingJobLogs}
          {...tableSettings}
        >
          <ColumnGroup title="Job log" align="left">
            <Column title="Schedule" dataIndex="scheduleId" />
            <Column
              title="Status"
              dataIndex="status"
              render={(job) => {
                console.log(job);
                return (
                  <Tag color="red" key={Math.random()}>
                    {job}
                  </Tag>
                );
              }}
            />
            <Column title="Machine" dataIndex="runtimeResourceId" />
            <Column title="Priority" dataIndex="priority" />
            <Column title="message" dataIndex="message" />
            <Column title="Add time" dataIndex="addTime" />
            <Column title="Start time" dataIndex="startTime" />
            <Column title="End time" dataIndex="endTime" />
          </ColumnGroup>
        </Table>
      </Space>
    </>
  );
};

export default Jobs;
