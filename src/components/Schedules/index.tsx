import { Button, Space, Table } from "antd";
import Column from "antd/lib/table/Column";
import React, { useEffect, useRef, useState } from "react";
import fetchApi from "../../services/fetchApi";
import { idColumnWidth, tableSettings } from "../../utils/commonSettings";
import SearchBox from "../SearchBox";
import {
  DeleteOutlined,
  EditOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import EditScheduleModal from "./EditScheduleModal";
import { RuntimeResource, Schedule, Task } from "../../utils/types";
import catchAndNotify from "../../utils/catchAndNotify";

const Schedules = () => {
  const [schedules, setSchedules] = useState([] as Schedule[]);
  const [machines, setMachines] = useState([] as RuntimeResource[]);
  const [tasks, setTasks] = useState([] as Task[]);

  const [filteredSchedules, setFilteredSchedules] = useState([] as Schedule[]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(
    (undefined as unknown) as Schedule
  );

  const editScheduleModalRef = useRef<{ showModal: () => void }>(null);
  // const DeleteUserModalRef = useRef<{ showModal: () => void }>(null);

  const loadData = () => {
    setIsLoading(true);
    fetchApi("/api/schedules")
      .then((data) => {
        setIsLoading(false);
        setSchedules(data);
      })
      .catch(catchAndNotify);
  };

  const findSchedule = (id: number): Schedule =>
    schedules.filter((_schedule) => _schedule.id === id)[0];

  useEffect(loadData, []);

  return (
    <>
      <EditScheduleModal
        loadData={loadData}
        schedule={selectedSchedule}
        machines={machines}
        tasks={tasks}
        ref={editScheduleModalRef}
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
          rowKey={(record) => record.id!}
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
                      setSelectedSchedule(findSchedule(record.id!));
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
                      setSelectedSchedule(findSchedule(record.id!));
                      setTimeout(() => {
                        editScheduleModalRef?.current?.showModal();
                      }, 0);
                    }}
                  />
                  <Button
                    size="small"
                    danger
                    type={"primary"}
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      setSelectedSchedule(findSchedule(record.id!));
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
