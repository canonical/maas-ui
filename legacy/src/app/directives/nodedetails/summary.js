import nodeDetailsSummaryTmpl from "../../partials/nodedetails/node-details-summary.html";

function nodeDetailsSummary() {
  return {
    restrict: "E",
    template: nodeDetailsSummaryTmpl
  };
}

export default nodeDetailsSummary;
