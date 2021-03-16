import React, { forwardRef, useState } from "react";
import CustomModal from "./CustomModal";
import fetchApi from "../services/fetchApi";
import notification from "../utils/notification";

type Props = {
  id: number;
  route: string;
  loadData: () => void;
};

const DeleteModal = forwardRef(({ id, route, loadData }: Props, ref) => {
  const onOkHandler = async () => {
    const url = `${route}/${id}`;
    const result = await fetchApi(url, "DELETE", { id });
    if (result) {
      notification("Deleted", undefined, "success", 6);
      loadData();
    }
  };

  return (
    <CustomModal
      okFn={onOkHandler}
      okButtonName="Delete"
      cancelButtonName="Cancel"
      ref={ref}
      danger={true}
    >
      <h3>Delete</h3>
    </CustomModal>
  );
});

export default DeleteModal;