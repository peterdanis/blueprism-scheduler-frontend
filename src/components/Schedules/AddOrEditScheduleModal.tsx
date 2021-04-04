import React, { forwardRef, useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import fetchApi from "../../services/fetchApi";
import notification from "../../utils/notification";
import { RuntimeResource, Schedule, Task } from "../../utils/types";
import { formSettings } from "../../utils/commonSettings";
import cronstrue from "cronstrue";
import { parseExpression } from "cron-parser";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";

type Props = {
  loadData: () => void;
  schedule: Schedule | undefined;
  machines: RuntimeResource[];
  tasks: Task[];
};

const AddOrEditScheduleModal = forwardRef(
  ({ loadData, schedule, machines, tasks }: Props, ref) => {
    const [readableRule, setReadableRule] = useState("");
    const [nextIterations, setNextIterations] = useState([] as string[]);
    const [form] = useForm();
    const [hasError, setHasError] = useState(false);

    const onOkHandler = async () => {
      let result;
      const data: Schedule = {
        name: form.getFieldValue("name"),
        rule: form.getFieldValue("rule"),
        validFrom: new Date("2020-12-31"),
        runtimeResource: {
          id: form.getFieldValue("runtimeResourceId"),
        } as RuntimeResource,
      };
      if (schedule) {
        result = await fetchApi(`/api/schedules/${schedule.id}`, "PATCH", data);
      } else {
        result = await fetchApi("/api/schedules/", "POST", data);
      }
      if (result) {
        notification("Schedule updated", undefined, "success", 6);
        loadData();
      }
    };

    const updateRuleDetails = (value: string): void => {
      try {
        setReadableRule(cronstrue.toString(value));
        const iterator = parseExpression(value);
        const arr = [];
        for (let i = 0; i < 14; i++) {
          const next = iterator.next();
          arr.push(next.toString().replace(/\(.*\)/, ""));
        }
        setNextIterations(arr);
      } catch (error) {
        setReadableRule("Wrong rule!");
        setNextIterations([]);
      }
    };

    useEffect(() => {
      form.resetFields();
      let initialValues: Schedule;
      if (schedule) {
        initialValues = schedule;
      } else {
        initialValues = {
          name: "",
          rule: "0 16 * * *",
          validFrom: new Date(),
          validUntil: new Date("9999-12-31T00:00:00"),
          priority: 50,
        };
      }
      form.setFieldsValue(
        Object.assign({}, initialValues, {
          runtimeResourceId: initialValues.runtimeResource?.id,
          tasks: initialValues.scheduleTask?.map((task) => task.task),
          _validFrom: moment(initialValues.validFrom),
          _validUntil: moment(initialValues.validUntil),
        })
      );
      updateRuleDetails(initialValues.rule);
    }, [schedule, form]);

    return (
      <CustomModal
        okFn={onOkHandler}
        okButtonName={schedule ? "Save" : "Create"}
        cancelButtonName="Cancel"
        ref={ref}
        width={1000}
        okButtonDisabled={hasError}
        key="AddOrEditScheduleModal"
      >
        <h3>Edit schedule</h3>
        <br />
        <Form
          form={form}
          onFieldsChange={(_, fields) => {
            setHasError(
              form.getFieldsError().filter((field) => field.errors.length > 0)
                .length > 0
            );
            if (_.map((field: any) => field.name[0]).includes("rule")) {
              updateRuleDetails(form.getFieldValue("rule"));
            }
          }}
          {...formSettings}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter schedule name" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Priority"
                name="priority"
                rules={[
                  { required: true, message: "Please specify priority" },
                  {
                    pattern: /^\d{1,}$/,
                    message: "Must be a number!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Valid from"
                name="_validFrom"
                rules={[{ required: true, message: "Please enter start date" }]}
              >
                <DatePicker showTime />
              </Form.Item>{" "}
              <Form.Item
                label="Valid until"
                name="_validUntil"
                rules={[{ required: true, message: "Please enter end date" }]}
              >
                <DatePicker showTime />
              </Form.Item>
              <Form.Item
                label="Machine"
                name="runtimeResourceId"
                rules={[
                  {
                    required: true,
                    message: "Please select runtime resource",
                  },
                ]}
              >
                <Select>
                  {machines.map((machine) => {
                    if (machine.id) {
                      return (
                        <Select.Option value={machine.id} key={machine.id}>
                          {machine.friendlyName}
                        </Select.Option>
                      );
                    }
                    return null;
                  })}
                </Select>
              </Form.Item>
              <Form.Item label="Tasks">
                <Form.List name="tasks">
                  {(fields, { add, remove }) => {
                    return (
                      <>
                        {fields.map((field) => (
                          <Form.Item
                            key={field.key}
                            name={[field.name, "name"]}
                          >
                            <Select>
                              {tasks.map((task) => {
                                if (task.id) {
                                  return (
                                    <Select.Option
                                      value={task.id}
                                      key={task.id}
                                    >
                                      {task.name}
                                    </Select.Option>
                                  );
                                }
                                return null;
                              })}
                            </Select>
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add task
                          </Button>
                        </Form.Item>
                      </>
                    );
                  }}
                </Form.List>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Rule"
                name="rule"
                rules={[{ required: true, message: "Please enter rule!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Rule translation">
                <p
                  style={{
                    marginTop: "2px",
                    marginBottom: "0px",
                  }}
                >
                  {readableRule}
                </p>
              </Form.Item>
              <Form.Item
                label="Next iterations"
                // style={{ marginTop: "-16px" }}
              >
                {nextIterations.map((value) => (
                  <p
                    style={{
                      // fontSize: "12px",
                      marginBottom: "-2px",
                      marginTop: "2px",
                    }}
                  >
                    {value}
                  </p>
                ))}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </CustomModal>
    );
  }
);

export default AddOrEditScheduleModal;