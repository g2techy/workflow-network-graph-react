import React, { useState, useEffect, useMemo } from "react";
import AppDetails from "./AppDetails";
import GraphModel from "./GraphModel";
import useAppData from "../../hooks/useAppData";

const emptyGraphData = { nodes: [], edges: [] };
const emptySelectedNode = { id: null, type: null };

const getGraphEdges = (allEdges, curretNodeId, direction) => {
  const edges = [];
  allEdges
    .filter(
      (ed) =>
        (direction === "P" && ed.to == curretNodeId) ||
        (direction === "C" && ed.from == curretNodeId)
    )
    .forEach((ed) => {
      getGraphEdges(
        allEdges,
        direction === "P" ? ed.from : ed.to,
        direction
      ).forEach((pe) => {
        edges.push(pe);
      });
      edges.push(ed);
    });
  return edges;
};

const getGraphEdgesByNodeId = (allEdges, nodeId) => {
  const edges = [];
  ["P", "C"].forEach((dir) => {
    getGraphEdges(allEdges, nodeId, dir).forEach((ed) => {
      edges.push(ed);
    });
  });
  return edges;
};

const getGraphDataForSelectedNode = (graphData, nodeId) => {
  const allEdges = getGraphEdgesByNodeId(graphData.edges, nodeId);
  const nodes = [];
  const edges = [];
  allEdges.forEach((ed) => {
    if (edges.find((ne) => ne.from == ed.from && ne.to == ed.to) == null) {
      edges.push(ed);
    }
    if (nodes.find((en) => en.id == ed.from) == null) {
      nodes.push(graphData.nodes.find((nd) => nd.id == ed.from));
    }
    if (nodes.find((en) => en.id == ed.to) == null) {
      nodes.push(graphData.nodes.find((nd) => nd.id == ed.to));
    }
  });
  return { nodes, edges };
};

const GraphMain = () => {
  const [appData, setAppData] = useState({});
  const [graphData, setGraphData] = useState(emptyGraphData);
  const [selectedNode, setSelectedNode] = useState(emptySelectedNode);
  const [getAppData, buildAppGraphData, buildWotkflowGraphData] = useAppData();
  const [isOpen, setOpen] = useState(false);
  const [appGraphData, setAppGraphData] = useState(null);

  useEffect(() => {
    getAppData().then((data) => {
      setAppData(data);
    });
  }, []);

  useEffect(() => {
    if (!selectedNode || selectedNode.id === null) {
      return;
    }
    let data = emptyGraphData;
    if (selectedNode.type === "APP") {
      data = buildAppGraphData(appData);
      setAppGraphData(data);
    } else if (selectedNode.type === "CON" || selectedNode.type === "PUB") {
      const nodeIdParts = selectedNode.id.split("-");
      data = buildWotkflowGraphData(
        appData,
        appData.workflows.find((n) => n.workflowName === nodeIdParts[0]),
        true,
        nodeIdParts[1] === "c",
        nodeIdParts[1] === "p"
      );
    } else if (selectedNode.type === "WF") {
      data = buildWotkflowGraphData(
        appData,
        appData.workflows.find((n) => n.workflowName === selectedNode.id),
        true
      );
    } else {
      let tempData = appGraphData;
      if (!tempData) {
        tempData = buildAppGraphData(appData);
        setAppGraphData(tempData);
      }
      data = getGraphDataForSelectedNode(tempData, selectedNode.id);
    }
    setGraphData(data);
  }, [selectedNode]);

  useEffect(() => {
    setOpen(selectedNode.id === null ? false : true);
  }, [graphData]);

  useEffect(() => {
    setSelectedNode(isOpen === false ? emptySelectedNode : selectedNode);
  }, [isOpen]);

  const graphEvents = {
    doubleClick: (params) => {
      const selNode = graphData.nodes.find((n) => n.id == params.nodes[0]);
      if (selNode && selectedNode.id !== selNode.id) {
        if (selNode.type) {
          drawGraph(selNode);
        }
      }
    },
  };

  const drawGraph = (selNode) => {
    setSelectedNode(selNode);
  };

  const modelTitle = useMemo(() => {
    if (!selectedNode || selectedNode.id === null) {
      return "";
    }
    let prefix;
    switch (selectedNode.type) {
      case "APP":
        prefix = "Application Name: ";
        break;
      case "WF":
        prefix = "Workflow Name: ";
        break;
      case "CON":
      case "PUB":
        prefix = `Workflow [${selectedNode.id.split("-")[0]}] => `;
        break;
      case "LEAF":
        prefix = "Application Name: ";
        break;
      default:
        prefix = "Unknown: ";
        break;
    }
    return prefix + selectedNode.label;
  }, [selectedNode]);

  return (
    <>
      <div className="row">
        <div className="col">
          <h1>Application Workflows</h1>
        </div>
      </div>
      <AppDetails appData={appData} drawGraph={drawGraph} />
      <GraphModel
        open={isOpen}
        setOpen={setOpen}
        data={graphData}
        events={graphEvents}
        modelTitle={modelTitle}
      />
    </>
  );
};

export default GraphMain;
