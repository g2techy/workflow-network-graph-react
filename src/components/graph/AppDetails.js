import React from "react";
import AppWorkFlowList from "./AppWorkFlowList";
import { buildAppNode } from "../../hooks/useAppData";

const AppDetails = ({ appData, drawGraph, ...props }) => {
  return (
    <>
      <div className="row">
        <div className="col-1">{appData.appId}</div>
        <div className="col-2">{appData.appName}</div>
        <div className="col-1">
          <a href="#" onClick={() => drawGraph(buildAppNode(appData))}>
            Graph
          </a>
        </div>
      </div>
      <hr />
      <AppWorkFlowList
        workflows={appData.workflows || []}
        drawGraph={drawGraph}
      />
    </>
  );
};

export default AppDetails;
