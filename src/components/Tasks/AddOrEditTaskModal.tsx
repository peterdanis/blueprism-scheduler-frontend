import React, { forwardRef, useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import fetchApi from "../../services/fetchApi";
import notification from "../../utils/notification";
import { RuntimeResource, Schedule, Task } from "../../utils/types";
import { filterInSelect, formSettings } from "../../utils/commonSettings";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";

type Props = {
  loadData: () => void;
  task: Task | undefined;
};

const AddOrEditTaskModal = forwardRef(({ loadData, task }: Props, ref) => {
  const [form] = useForm();
  const [hasError, setHasError] = useState(false);

  const onOkHandler = async () => {
    let result;
    const data: Task = {
      name: form.getFieldValue("name"),
      process: form.getFieldValue("process"),
    };
    if (task) {
      result = await fetchApi(`/api/tasks/${task.id}`, "PATCH", data);
    } else {
      result = await fetchApi("/api/tasks/", "POST", data);
    }
    if (result) {
      notification(
        `Task ${task ? "updated" : "created"}`,
        undefined,
        "success",
        6
      );
      loadData();
    }
  };

  useEffect(() => {
    form.resetFields();
    let initialValues: Task;
    if (task) {
      initialValues = task;
    } else {
      initialValues = {
        name: "",
        process: "",
      };
    }
    form.setFieldsValue(initialValues);
  }, [task, form]);

  return (
    <CustomModal
      okFn={onOkHandler}
      okButtonName={task ? "Save" : "Create"}
      cancelButtonName="Cancel"
      ref={ref}
      okButtonDisabled={hasError}
      key="AddOrEditTaskModal"
    >
      <h3>Edit task</h3>
      <br />
      <Form
        form={form}
        onFieldsChange={(_, fields) => {
          setHasError(
            form.getFieldsError().filter((field) => field.errors.length > 0)
              .length > 0
          );
        }}
        {...formSettings}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter schedule name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Process name"
          name="process"
          rules={[
            {
              required: true,
              message: "Please enter process name",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </CustomModal>
  );
});

export default AddOrEditTaskModal;
