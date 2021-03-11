import openNotification from "../utils/notification";
import { Button, Modal } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";

type Props = {
  children?: React.ReactNode | React.ReactNode[];
  okFn: Function;
  cancelFn?: Function;
  okButtonName?: string;
  cancelButtonName?: string;
};

const CustomModal = forwardRef((props: Props, ref) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isOkLoading, setOkLoading] = useState(false);
  const [isCancelLoading, setCancelLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      setModalVisible(true);
    },
  }));

  const handleOk = () => {
    setOkLoading(true);
    const result = props.okFn();
    if (
      typeof result.then === "function" &&
      typeof result.catch === "function"
    ) {
      console.log("here");
      result
        .then(() => {
          setOkLoading(false);
          setModalVisible(false);
        })
        .catch((error: Error) => {
          openNotification("Error", error.message, "error");
          console.error(error);
        });
    } else {
      setOkLoading(false);
      setModalVisible(false);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      if (typeof props.cancelFn === "function") {
        await props.cancelFn();
      }
    } catch (error) {
      openNotification("Error", error.message, "error");
      console.error(error);
    }
    setCancelLoading(false);
    setModalVisible(false);
  };
  return (
    <Modal
      title="Basic Modal"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button
          key="back"
          loading={isCancelLoading}
          onClick={handleCancel}
          disabled={isOkLoading}
        >
          {props.cancelButtonName || "Cancel"}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isOkLoading}
          onClick={handleOk}
          disabled={isCancelLoading}
        >
          {props.okButtonName || "Ok"}
        </Button>,
      ]}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
});

export default CustomModal;
