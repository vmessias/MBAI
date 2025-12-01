async function loadData() {
  const [annual, funding, cost, systems, segTrends] = await Promise.all([
    d3.csv("data/dash_annual_system.csv", d3.autoType),
    d3.csv("data/dash_funding_illusion.csv", d3.autoType),
    d3.csv("data/dash_cost_per_visit.csv", d3.autoType),
    d3.csv("data/dash_systems_latest.csv", d3.autoType),
    d3.csv("data/dash_segment_trends.csv", d3.autoType)
  ]);
  return { annual, funding, cost, systems, segTrends };
}

function initFilters(systems, state) {
  state.selectedCity = null;
  state.selectedSegment = "All";
}

function renderPhysicalDigital(annual, state) {
  const data = annual;
}

function renderFundingIllusion(funding, state) {
}

function renderCostIndex(cost, state) {

}

function renderScatterSystems(systems, state) {

}

function renderSegmentTrends(segTrends, state) {
}

document.addEventListener("DOMContentLoaded", async () => {
  const state = {};
  const { annual, funding, cost, systems, segTrends } = await loadData();

  initFilters(systems, state);
  renderPhysicalDigital(annual, state);
  renderFundingIllusion(funding, state);
  renderCostIndex(cost, state);
  renderScatterSystems(systems, state);
  renderSegmentTrends(segTrends, state);
});
