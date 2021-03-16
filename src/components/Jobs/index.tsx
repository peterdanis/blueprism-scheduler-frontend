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
  const [schedules, setSchedules] = useState([] as Schedule[]);
  const [runtimeResources, setRuntimeResources] = useState(
    [] as RuntimeResource[]
  );

  // const AddUserModalRef = useRef<{ showModal: () => void }>(null);
  // const DeleteUserModalRef = useRef<{ showModal: () => void }>(null);

  const loadData = () => {
    setIsLoadingJobs(true);
    setIsLoadingJobLogs(true);

    // Get job queue
    fetchApi("/api/jobs")
      .then((data) => {
        setIsLoadingJobs(false);
        setJobs(data);
      })
      .catch((error) => {
        openNotification("Error", error.message, "error");
        console.error(error);
      });

    // Get schedules
    const schedulesPromise = fetchApi("/api/schedules")
      .then((data) => {
        setSchedules(data);
      })
      .catch((error) => {
        openNotification("Error", error.message, "error");
        console.error(error);
      });

    // Get runtime resources
    const runtimeResourcesPromise = fetchApi("/api/runtimeResources")
      .then((data) => {
        setRuntimeResources(data);
      })
      .catch((error) => {
        openNotification("Error", error.message, "error");
        console.error(error);
      });

    // Load schedule and runtime resource data first
    Promise.all([schedulesPromise, runtimeResourcesPromise]).then(() => {
      // Get job log
      fetchApi("/api/jobLogs")
        .then((data) => {
          setIsLoadingJobLogs(false);
          setJobLogs(data);
        })
        .catch((error) => {
          openNotification("Error", error.message, "error");
          console.error(error);
        });
    });
  };

  useEffect(loadData, []);

  return (
    <>
      <Space direction="vertical" size="large">
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
              render={(status, record) => {
                let color: "success" | "default" | "error";
                switch (status) {
                  case "waiting":
                    color = "default";
                    break;
                  case "finished":
                    color = "success";
                    break;
                  case "running":
                    color = "success";
                    break;
                  case "failed":
                    color = "error";
                    break;

                  default:
                    color = "default";
                    break;
                }
                return (
                  <Tag color={color} key={`${record}-tag`}>
                    {status}
                  </Tag>
                );
              }}
            />
            <Column
              title="Machine"
              render={(record) => record.runtimeResource.friendlyName}
            />
            <Column title="Priority" dataIndex="priority" />
            <Column
              title="Add time"
              render={(record) =>
                record.addTime.replace("T", " ").replace(".000", "")
              }
            />
            <Column
              title="Start time"
              render={(record) => {
                if (record.startTime) {
                  return record.startTime.replace("T", " ").replace(".000", "");
                }
              }}
            />
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
            <Column
              title="Schedule"
              render={({ scheduleId }) =>
                schedules.filter((schedule) => schedule.id === scheduleId)[0]
                  .name
              }
            />
            <Column
              title="Status"
              dataIndex="status"
              render={(status, record) => {
                let color: "success" | "default" | "error" | "processing";
                switch (status) {
                  case "waiting":
                    color = "default";
                    break;
                  case "finished":
                    color = "success";
                    break;
                  case "running":
                    color = "processing";
                    break;
                  case "failed":
                    color = "error";
                    break;

                  default:
                    color = "default";
                    break;
                }
                return (
                  <Tag color={color} key={`${record}-tag`}>
                    {status}
                  </Tag>
                );
              }}
            />
            <Column
              title="Machine"
              render={({ runtimeResourceId }) =>
                runtimeResources.filter(
                  (runtimeResource) => runtimeResource.id === runtimeResourceId
                )[0].friendlyName
              }
            />
            <Column title="Priority" dataIndex="priority" />
            <Column title="Message" dataIndex="message" />
            <Column
              title="Add time"
              render={(record) =>
                record.addTime.replace("T", " ").replace(".000", "")
              }
            />
            <Column
              title="Start time"
              render={(record) =>
                record.startTime.replace("T", " ").replace(".000", "")
              }
            />
            <Column
              title="End time"
              render={(record) =>
                record.endTime.replace("T", " ").replace(".000", "")
              }
            />
          </ColumnGroup>
        </Table>
      </Space>
    </>
  );
};

export default Jobs;
