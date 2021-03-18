import React, { forwardRef, useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import { Form, Input } from "antd";
import fetchApi from "../../services/fetchApi";
import { FieldData } from "rc-field-form/lib/interface";
import notification from "../../utils/notification";
import { RuntimeResource, Schedule, Task } from "../../utils/types";
import getFormValue from "../../utils/getFormValue";

type Props = {
  loadData: () => void;
  schedule: Schedule;
  machines: RuntimeResource[];
  tasks: Task[];
};

const EditScheduleModal = forwardRef(({ loadData, schedule }: Props, ref) => {
  const [formData, setFormData] = useState([] as FieldData[]);

  const getValue = getFormValue(formData);

  const onOkHandler = async () => {
    const data: Schedule = {
      name: getValue("name"),
      rule: getValue("rule"),
      validFrom: new Date("2020-12-31"),
      runtimeResourceId: getValue("machine"),
    };
    const result = await fetchApi(
      `/api/schedules/${schedule.id}`,
      "PATCH",
      data
    );
    setFormData([]);
    if (result) {
      notification("Schedule updated", undefined, "success", 6);
      loadData();
    }
  };

  const onCancelHandler = () => {
    setFormData([]);
  };

  if (!schedule) {
    return null;
  } else {
    return (
      <CustomModal
        okFn={onOkHandler}
        cancelFn={onCancelHandler}
        okButtonName="Edit"
        cancelButtonName="Cancel"
        ref={ref}
        okButtonDisabled={
          formData.filter((item) => item.errors?.length).length > 0
        }
      >
        <h3>Edit schedule</h3>
        <br />
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          fields={formData}
          onFieldsChange={(_, fields) => {
            setFormData(fields);
          }}
          initialValues={schedule}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter schedule name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Rule"
            name="rule"
            rules={[{ required: true, message: "Please enter rule!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Machine"
            name="runtimeResourceId"
            rules={[
              { required: true, message: "Please enter runtime resource!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </CustomModal>
    );
  }
});

export default EditScheduleModal;
