import React, { forwardRef, useState } from "react";
import CustomModal from "../CustomModal";
import { Form, Input } from "antd";
import fetchApi from "../../services/fetchApi";
import { FieldData } from "rc-field-form/lib/interface";
import notification from "../../utils/notification";
import { Schedule } from ".";

type Props = {
  loadData: () => void;
  id: number;
};

const EditScheduleModal = forwardRef(({ loadData, id }: Props, ref) => {
  const [formData, setFormData] = useState([] as FieldData[]);

  const getFormValue = (fieldName: string) =>
    formData.filter((item) => {
      const a = item.name as string[];
      return a[0] === fieldName;
    })[0]?.value;

  const onOkHandler = async () => {
    const data: Schedule = {
      name: getFormValue("name"),
      rule: getFormValue("rule"),
      validFrom: new Date("2020-12-31"),
      runtimeResourceId: getFormValue("machine"),
    };
    const result = await fetchApi(`/api/schedules${id}`, "PATCH", data);
    setFormData([]);
    if (result) {
      notification("Schedule updated", undefined, "success", 6);
      loadData();
    }
  };

  const onCancelHandler = () => {
    setFormData([]);
  };

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
          console.log(fields);
          setFormData(fields);
        }}
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
});

export default EditScheduleModal;
