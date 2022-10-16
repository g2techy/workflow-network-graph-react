import React, { useMemo } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import VisNetworkReactComponent from "vis-network-react";

const graphOptions = {
  layout: {
    hierarchical: {
      direction: "UD",
      sortMethod: "directed",
    },
  },
  edges: {
    arrows: {
      to: { enabled: true, scaleFactor: 0.75, type: "arrow" },
    },
  },
  physics: true,
};

const GraphModel = ({
  open,
  setOpen,
  data,
  events = {},
  modelTitle,
  ...props
}) => {
  const allEvents = useMemo(() => {
    const localEvents = {};
    return { ...localEvents, ...events };
  }, [events]);

  const toggle = () => setOpen(false);

  return (
    <Modal
      isOpen={open}
      toggle={toggle}
      className="modal-dialog modal-fullscreen modal-dialog-scrollable"
    >
      <ModalHeader toggle={toggle} charCode="close">
        <h5 className="modal-title graph-title">
          <div className="text-center">Selected Node: {modelTitle}</div>
        </h5>
      </ModalHeader>
      <ModalBody>
        <VisNetworkReactComponent
          className="network"
          data={data}
          options={graphOptions}
          events={allEvents}
        />
      </ModalBody>
    </Modal>
  );
};

export default GraphModel;
