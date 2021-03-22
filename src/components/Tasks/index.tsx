import { Button, Space, Table } from "antd";
import Column from "antd/lib/table/Column";
import React, { useEffect, useRef, useState } from "react";
import fetchApi from "../../services/fetchApi";
import SearchBox from "../SearchBox";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { idColumnWidth, tableSettings } from "../../utils/commonSettings";
import { Task } from "../../utils/types";
import catchAndNotify from "../../utils/catchAndNotify";

const Tasks = () => {
  const [tasks, setTasks] = useState([] as Task[]);
  const [filteredTasks, setFilteredTasks] = useState([] as Task[]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(0);

  // const AddUserModalRef = useRef<{ showModal: () => void }>(null);
  // const DeleteUserModalRef = useRef<{ showModal: () => void }>(null);

  const loadData = () => {
    setIsLoading(true);
    fetchApi("/api/tasks")
      .then((data) => {
        setIsLoading(false);
        setTasks(data);
      })
      .catch(catchAndNotify);
  };

  useEffect(loadData, []);

  return (
    <>
      <Space direction="vertical" size="large">
        <Button
          type="primary"
          onClick={() => {
            // AddUserModalRef?.current?.showModal();
          }}
        >
          Add new task
        </Button>
        <SearchBox
          list={tasks}
          keys={["id", "name"]}
          placeholder="Search by ID or name"
          resultsSetter={setFilteredTasks}
        />
        <Table
          dataSource={filteredTasks}
          rowKey={(record) => record.id!}
          loading={isLoading}
          {...tableSettings}
        >
          <Column title="ID" dataIndex="id" width={idColumnWidth} />
          <Column title="Name" dataIndex="name" />
          <Column
            title="Actions"
            dataIndex="actions"
            render={(_, record: Task) => (
              <>
                <Space>
                  <Button
                    size="small"
                    type={"primary"}
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      setSelectedTask(record.id!);
                      // DeleteUserModalRef?.current?.showModal();
                    }}
                  />
                  <Button
                    size="small"
                    danger
                    type={"primary"}
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      setSelectedTask(record.id!);
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

export default Tasks;
