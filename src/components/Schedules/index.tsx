import { Button, Space, Table } from "antd";
import Column from "antd/lib/table/Column";
import React, { useEffect, useRef, useState } from "react";
import fetchApi from "../../services/fetchApi";
import { idColumnWidth, tableSettings } from "../../utils/commonSettings";
import openNotification from "../../utils/notification";
import SearchBox from "../SearchBox";
import {
  DeleteOutlined,
  EditOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import EditScheduleModal from "./EditScheduleModal";

type ScheduleTask = {};

type OnError = {
  action: "email";
  emailTo?: string;
  emailCc?: string;
};

export type Schedule = {
  id?: number;
  force?: boolean;
  name: string;
  hardForceTime?: number;
  hardTimeout?: number;
  onError?: OnError;
  priority?: number;
  rule: string;
  softForceTime?: number;
  softTimeout?: number;
  validFrom: Date;
  validUntil?: Date;
  waitTime?: number;
  scheduleTask?: ScheduleTask[];
  runtimeResource?: RuntimeResource;
  runtimeResourceId: number;
};

type RuntimeResource = {
  id: number;
  friendlyName: string;
};

const Schedules = () => {
  const [schedules, setSchedules] = useState([] as Schedule[]);
  const [filteredSchedules, setFilteredSchedules] = useState([] as Schedule[]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(0);
  const [showingModal, setShowingModal] = useState(false);

  const editScheduleModalRef = useRef<{ showModal: () => void }>(null);
  // const DeleteUserModalRef = useRef<{ showModal: () => void }>(null);

  const loadData = () => {
    setIsLoading(true);
    fetchApi("/api/schedules")
      .then((data) => {
        setIsLoading(false);
        setSchedules(data);
        setShowingModal(false);
      })
      .catch((error) => {
        openNotification("Error", error.message, "error");
        console.error(error);
      });
  };

  useEffect(loadData, []);

  return (
    <>
      <EditScheduleModal
        loadData={loadData}
        id={selectedSchedule}
        ref={editScheduleModalRef}
        fetchData={showingModal}
      />
      {/* <DeleteModal
        id={selectedJobId}
        route={"/api/users"}
        ref={DeleteUserModalRef}
        loadData={loadData}
      /> */}
      <Space direction="vertical" size="large">
        <Button
          type="primary"
          onClick={() => {
            // AddUserModalRef?.current?.showModal();
          }}
        >
          Add new schedule
        </Button>
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
          <Column
            title="Machine"
            render={(record) => record.runtimeResource.friendlyName}
          />
          <Column title="Priority" dataIndex="priority" />
          <Column title="Valid from" dataIndex="validFrom" />
          <Column title="Valid until" dataIndex="validUntil" />

          <Column
            title="Actions"
            dataIndex="actions"
            render={(_, record: Schedule) => (
              <>
                <Space>
                  <Button
                    size="small"
                    type={"primary"}
                    icon={<CaretRightOutlined />}
                    onClick={(e) => {
                      setSelectedSchedule(record.id!);
                      // DeleteUserModalRef?.current?.showModal();
                    }}
                  >
                    Run
                  </Button>
                  <Button
                    size="small"
                    type={"primary"}
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      setSelectedSchedule(record.id!);
                      setShowingModal(true);
                      editScheduleModalRef?.current?.showModal();
                    }}
                  />
                  <Button
                    size="small"
                    danger
                    type={"primary"}
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      setSelectedSchedule(record.id!);
                      // DeleteUserModalRef?.current?.showModal();
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

export default Schedules;
