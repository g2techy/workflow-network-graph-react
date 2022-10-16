const loadWOrkflowJson = async (appData, wfFile) => {
  const wf = await import("../data/" + wfFile);
  if (wf && wf.workflow) {
    appData.workflows.push(wf.workflow);
  }
};

const getAppData = async () => {
  const appData = {
    appId: 103962,
    appName: "Data Asset Invnetory",
    workflows: [],
  };
  await loadWOrkflowJson(appData, "app-workflow-sample-1.json");
  await loadWOrkflowJson(appData, "app-workflow-sample-2.json");
  await loadWOrkflowJson(appData, "app-workflow-sample-3.json");
  return appData;
};

export const buildAppNode = (appData) => {
  return {
    id: appData.appId,
    label: appData.appName,
    type: "APP",
  };
};

const buildWrokflowNode = (workflow) => {
  return {
    id: workflow.workflowName,
    label: workflow.workflowName,
    shape: "triangle",
    size: 15,
    color: "maroon",
    type: "WF",
  };
};

const buildConsumerNode = (parentNodeId) => {
  return {
    id: parentNodeId + "-c",
    label: "Consumer(s)",
    shape: "hexagon",
    color: "violet",
    type: "CON",
    parentNodeId: parentNodeId,
  };
};

const buildPublisherNode = (parentNodeId) => {
  return {
    id: parentNodeId + "-p",
    label: "Publisher(s)",
    shape: "hexagon",
    color: "green",
    type: "PUB",
    parentNodeId: parentNodeId,
  };
};

const buildLeafAppNode = (appData) => {
  return {
    id: appData.appId,
    label: appData.appName,
    shape: "dot",
    size: 15,
    type: "LEAF",
  };
};

const buildWotkflowGraphData = (
  appData,
  workflow,
  addWorkflowNode,
  showConsumer = true,
  showPublisher = true
) => {
  const nodes = [];
  const edges = [];
  let parentNode = {};

  if (addWorkflowNode) {
    nodes.push(buildAppNode(appData));
    parentNode = buildWrokflowNode(workflow);
    nodes.push(parentNode);
    edges.push({
      from: appData.appId,
      to: workflow.workflowName,
    });
  }

  if (showConsumer && workflow.consumers) {
    const consumerNode = buildConsumerNode(parentNode.id);
    nodes.push(consumerNode);
    edges.push({ from: parentNode.id, to: consumerNode.id });
    workflow.consumers.forEach((c) => {
      const conAppNode = buildLeafAppNode(c);
      if (nodes.find((en) => en.id == conAppNode.id) == null) {
        nodes.push(conAppNode);
      }
      edges.push({
        from: consumerNode.id,
        to: conAppNode.id,
        dashes: true,
      });
    });
  }
  if (showPublisher && workflow.publishers) {
    const publisherNode = buildPublisherNode(parentNode.id);
    nodes.push(publisherNode);
    edges.push({ from: parentNode.id, to: publisherNode.id });
    workflow.publishers.forEach((p) => {
      const pubAppNode = buildLeafAppNode(p);
      if (nodes.find((en) => en.id == pubAppNode.id) == null) {
        nodes.push(pubAppNode);
      }
      edges.push({
        from: publisherNode.id,
        to: pubAppNode.id,
        dashes: true,
      });
    });
  }

  return { nodes, edges };
};

const buildAppGraphData = (appData) => {
  const nodes = [];
  const edges = [];

  nodes.push(buildAppNode(appData));

  appData.workflows.forEach((wf) => {
    let wfData = buildWotkflowGraphData(appData, wf, true);
    edges.push({
      from: appData.appId,
      to: wf.workflowName,
    });
    wfData.nodes.forEach((nd) => {
      if (nodes.find((en) => en.id == nd.id) == null) {
        nodes.push(nd);
      }
    });
    wfData.edges.forEach((eg) => {
      edges.push(eg);
    });
  });

  return { nodes, edges };
};

const useAppData = () => {
  return [getAppData, buildAppGraphData, buildWotkflowGraphData];
};

export default useAppData;
