import React, { forwardRef, useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import { Button, Col, Form, Input, Row, Select } from "antd";
import fetchApi from "../../services/fetchApi";
import { FieldData } from "rc-field-form/lib/interface";
import notification from "../../utils/notification";
import { RuntimeResource, Schedule, Task } from "../../utils/types";
import getFormValue from "../../utils/getFormValue";
import { formSettings } from "../../utils/commonSettings";
import cronstrue from "cronstrue";
import { parseExpression } from "cron-parser";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";

type Props = {
  loadData: () => void;
  schedule: Schedule;
  machines: RuntimeResource[];
  tasks: Task[];
};

const EditScheduleModal = forwardRef(
  ({ loadData, schedule, machines, tasks }: Props, ref) => {
    const [readableRule, setReadableRule] = useState("");
    const [nextIterations, setNextIterations] = useState([] as string[]);
    const [form] = useForm();
    const [hasError, setHasError] = useState(false);

    const onOkHandler = async () => {
      const data: Schedule = {
        name: form.getFieldValue("name"),
        rule: form.getFieldValue("rule"),
        validFrom: new Date("2020-12-31"),
        runtimeResource: {
          id: form.getFieldValue("runtimeResourceId"),
        } as RuntimeResource,
      };
      const result = await fetchApi(
        `/api/schedules/${schedule.id}`,
        "PATCH",
        data
      );
      if (result) {
        notification("Schedule updated", undefined, "success", 6);
        loadData();
      }
    };

    const onCancelHandler = () => {
      form.setFieldsValue(
        Object.assign({}, schedule, {
          runtimeResourceId: schedule.runtimeResource?.id,
          tasks: schedule.scheduleTask?.map((task) => task.task),
        })
      );
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
      if (schedule) {
        form.setFieldsValue(
          Object.assign({}, schedule, {
            runtimeResourceId: schedule.runtimeResource?.id,
            tasks: schedule.scheduleTask?.map((task) => task.task),
          })
        );
        updateRuleDetails(schedule.rule);
      }
    }, [schedule, form]);

    if (!schedule) {
      return null;
    } else {
      return (
        <CustomModal
          okFn={onOkHandler}
          cancelFn={onCancelHandler}
          okButtonName="Save"
          cancelButtonName="Cancel"
          ref={ref}
          width={1000}
          okButtonDisabled={hasError}
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
                    { required: true, message: "Please enter schedule name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Machine"
                  name="runtimeResourceId"
                  rules={[
                    {
                      required: true,
                      message: "Please enter runtime resource!",
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
  }
);

export default EditScheduleModal;
