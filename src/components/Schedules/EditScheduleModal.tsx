import React, { forwardRef, useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import { Form, Input, Select } from "antd";
import fetchApi from "../../services/fetchApi";
import { FieldData } from "rc-field-form/lib/interface";
import notification from "../../utils/notification";
import { RuntimeResource, Schedule, Task } from "../../utils/types";
import getFormValue from "../../utils/getFormValue";
import { formSettings } from "../../utils/commonSettings";
import cronstrue from "cronstrue";
import { parseExpression } from "cron-parser";

type Props = {
  loadData: () => void;
  schedule: Schedule;
  machines: RuntimeResource[];
  tasks: Task[];
};

const EditScheduleModal = forwardRef(
  ({ loadData, schedule, machines, tasks }: Props, ref) => {
    const [formData, setFormData] = useState([] as FieldData[]);
    const [readableRule, setReadableRule] = useState("");
    const [nextIterations, setNextIterations] = useState([] as string[]);

    const getValue = getFormValue(formData);

    const onOkHandler = async () => {
      const data: Schedule = {
        name: getValue("name"),
        rule: getValue("rule"),
        validFrom: new Date("2020-12-31"),
        runtimeResource: {
          id: getValue("runtimeResourceId"),
        } as RuntimeResource,
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

    useEffect(() => {
      try {
        setReadableRule(cronstrue.toString(schedule.rule));
        const iterator = parseExpression(schedule.rule);
        const arr = [];
        for (let i = 0; i < 14; i++) {
          const next = iterator.next();
          arr.push(next.toString());
        }
        setNextIterations(arr);
      } catch (error) {
        setReadableRule("Wrong rule!");
      }
    }, [schedule]);

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
          okButtonDisabled={
            formData.filter((item) => item.errors?.length).length > 0
          }
        >
          <h3>Edit schedule</h3>
          <br />
          <Form
            fields={formData}
            onFieldsChange={(_, fields) => {
              setFormData(fields);
              try {
                setReadableRule(cronstrue.toString(getValue("rule")));
                const iterator = parseExpression(getValue("rule"));
                const arr = [];
                for (let i = 0; i < 14; i++) {
                  const next = iterator.next();
                  arr.push(next.toString());
                }
                setNextIterations(arr);
              } catch (error) {
                setReadableRule("Wrong rule!");
              }
            }}
            initialValues={Object.assign({}, schedule, {
              runtimeResourceId: schedule.runtimeResource?.id,
            })}
            {...formSettings}
          >
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
                { required: true, message: "Please enter runtime resource!" },
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
            <Form.Item
              label="Rule"
              name="rule"
              rules={[{ required: true, message: "Please enter rule!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Rule translation" style={{ marginTop: "-16px" }}>
              <span
                style={{
                  // fontSize: "12px",
                  // marginBottom: "-4px",
                  marginTop: "2px",
                }}
              >
                {readableRule}
              </span>
            </Form.Item>
            <Form.Item label="Next iterations" style={{ marginTop: "-16px" }}>
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
          </Form>
        </CustomModal>
      );
    }
  }
);

export default EditScheduleModal;
