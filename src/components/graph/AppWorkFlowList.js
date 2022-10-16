import React from "react";

const DispalyWorkflowRow = ({ rowIdx, workflow, drawGraph }) => {
  return (
    <tr>
      <td>{rowIdx}</td>
      <td>{workflow.workflowName}</td>
      <td>
        <a
          href="#"
          onClick={() => drawGraph({ id: workflow.workflowName, type: "WF" })}
        >
          Click
        </a>
      </td>
    </tr>
  );
};

const AppWorkFlowList = ({ workflows, drawGraph, ...props }) => {
  return (
    <div className="row">
      <div className="col">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Workflow Name</th>
              <th scope="col">Graph</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((wf, idx) => (
              <DispalyWorkflowRow
                key={idx}
                rowIdx={idx + 1}
                workflow={wf}
                drawGraph={drawGraph}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppWorkFlowList;
