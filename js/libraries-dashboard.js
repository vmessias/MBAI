/* ========= LIBRARIES DASHBOARD - D3 IMPLEMENTATION ========= */

const COLORS = {
  orange: '#F97316',
  red: '#EF4444',
  blue: '#2980b9',
  gray: '#7f8c8d',
  lightGray: '#95a5a6',
  yellow: '#FACC15',
  segments: {
    'Urban System': '#34495e',
    'Vulnerable': '#f1c40f',
    'Insolvent': '#c0392b',
    'Wealthy Outliers': '#2ecc71'
  }
};

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

/* VIEW 1: Scatter - Funding vs Population */
function renderScatterSystems(systems, state) {
  const container = d3.select("#viz-funding-scatter");
  container.selectAll("*").remove();

  const margin = { top: 20, right: 40, bottom: 50, left: 70 };
  const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = container.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleLog()
    .domain([d3.min(systems, d => d.population), d3.max(systems, d => d.population)])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(systems, d => d.exp_per_capita)])
    .range([height, 0]);

  const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(systems, d => d.muni_dependency)])
    .range([2, 12]);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(5, ",.0f"))
    .style("color", "#9CA3AF");

  svg.append("g")
    .call(d3.axisLeft(yScale).ticks(6).tickFormat(d => `$${d}`))
    .style("color", "#9CA3AF");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .style("text-anchor", "middle")
    .style("fill", "#D1D5DB")
    .style("font-size", "12px")
    .text("Population (log scale)");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .style("text-anchor", "middle")
    .style("fill", "#D1D5DB")
    .style("font-size", "12px")
    .text("Expenditure per Capita ($)");

  const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("background", "rgba(15,23,42,0.95)")
    .style("color", "#E5E7EB")
    .style("padding", "8px 12px")
    .style("border-radius", "6px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("border", "1px solid rgba(148,163,184,0.6)")
    .style("z-index", 1000);

  svg.selectAll("circle")
    .data(systems)
    .join("circle")
    .attr("cx", d => xScale(d.population))
    .attr("cy", d => yScale(d.exp_per_capita))
    .attr("r", d => sizeScale(d.muni_dependency))
    .attr("fill", d => COLORS.segments[d.segment] || COLORS.gray)
    .attr("opacity", 0.7)
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.5)
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`
        <strong>${d.city}</strong><br/>
        Population: ${d.population.toLocaleString()}<br/>
        Exp/capita: $${d.exp_per_capita.toFixed(2)}<br/>
        Segment: ${d.segment}
      `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", 0);
    });
    
  
  const legend = svg.append("g")
    .attr("transform", `translate(${width - 140}, 10)`) 
    .style("font-size", "11px");

  const categories = Object.keys(COLORS.segments);

  categories.forEach((cat, i) => {
    const row = legend.append("g")
      .attr("transform", `translate(0, ${i * 18})`); 

    row.append("circle")
      .attr("r", 4)
      .attr("fill", COLORS.segments[cat])
      .attr("opacity", 0.8);

    row.append("text")
      .attr("x", 10)
      .attr("y", 4)
      .style("fill", "#9CA3AF")
      .text(cat);
  });

}

/* VIEW 2: Line - Funding Illusion */
function renderFundingIllusion(funding, state) {
  const container = d3.select("#viz-revenue-ranking");
  container.selectAll("*").remove();

  const margin = { top: 20, right: 60, bottom: 50, left: 70 };
  const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = container.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(funding, d => d.year))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([25, 70])
    .range([height, 0]);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.format("d")))
    .style("color", "#9CA3AF");

  svg.append("g")
    .call(d3.axisLeft(yScale).ticks(6).tickFormat(d => `$${d}`))
    .style("color", "#9CA3AF");

  const area = d3.area()
    .x(d => xScale(d.year))
    .y0(d => yScale(d.real_per_capita))
    .y1(d => yScale(d.nominal_per_capita));

  svg.append("path")
    .datum(funding)
    .attr("fill", COLORS.lightGray)
    .attr("opacity", 0.15)
    .attr("d", area);

  const nominalLine = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.nominal_per_capita));

  const realLine = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.real_per_capita));

  svg.append("path")
    .datum(funding)
    .attr("fill", "none")
    .attr("stroke", COLORS.lightGray)
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5,5")
    .attr("d", nominalLine);

  svg.append("path")
    .datum(funding)
    .attr("fill", "none")
    .attr("stroke", COLORS.red)
    .attr("stroke-width", 3)
    .attr("d", realLine);

  const lastPoint = funding[funding.length - 1];
  svg.append("text")
    .attr("x", xScale(lastPoint.year) + 5)
    .attr("y", yScale(lastPoint.nominal_per_capita))
    .attr("fill", COLORS.lightGray)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text(`$${lastPoint.nominal_per_capita.toFixed(0)}`);

  svg.append("text")
    .attr("x", xScale(lastPoint.year) + 5)
    .attr("y", yScale(lastPoint.real_per_capita))
    .attr("fill", COLORS.red)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text(`$${lastPoint.real_per_capita.toFixed(0)}`);
}

/* VIEW 3: Line - Cost Index */
function renderCostIndex(cost, state) {
  const container = d3.select("#viz-index-lines");
  container.selectAll("*").remove();

  const margin = { top: 20, right: 60, bottom: 50, left: 70 };
  const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = container.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(cost, d => d.year))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(cost, d => d.cost_index_2002_100) * 1.1])
    .range([height, 0]);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.format("d")))
    .style("color", "#9CA3AF");

  svg.append("g")
    .call(d3.axisLeft(yScale).ticks(6))
    .style("color", "#9CA3AF");

  svg.append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", yScale(100))
    .attr("y2", yScale(100))
    .attr("stroke", COLORS.gray)
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "4,4")
    .attr("opacity", 0.6);

  const line = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.cost_index_2002_100));

  svg.append("path")
    .datum(cost)
    .attr("fill", "none")
    .attr("stroke", COLORS.orange)
    .attr("stroke-width", 3)
    .attr("d", line);

  svg.selectAll("circle")
    .data(cost)
    .join("circle")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.cost_index_2002_100))
    .attr("r", 4)
    .attr("fill", COLORS.orange);

  const lastPoint = cost[cost.length - 1];
  
  // Ajuste: Anotação do pico COVID
  const peak = cost.reduce((a, b) => a.cost_index_2002_100 > b.cost_index_2002_100 ? a : b);
  svg.append("text")
    .attr("x", xScale(peak.year) -10)
    .attr("y", yScale(peak.cost_index_2002_100))
    .attr("fill", COLORS.red)
    .attr("text-anchor", "end") 
    .style("font-size", "11px")
    .style("font-weight", "bold")
    .text(`COVID Shock: ${peak.cost_index_2002_100.toFixed(0)}`);

  svg.append("text")
    .attr("x", xScale(lastPoint.year) + 5)
    .attr("y", yScale(lastPoint.cost_index_2002_100))
    .attr("fill", COLORS.orange)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text(`${lastPoint.cost_index_2002_100.toFixed(0)}`);
}

/* VIEW 4: Segment trends - COM LEGENDA FIXA */
function renderSegmentTrends(segTrends, state) {
  const container = d3.select("#viz-metrics-gap");
  container.selectAll("*").remove();

  const margin = { top: 40, right: 40, bottom: 50, left: 70 };
  const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = container.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const segments = Array.from(new Set(segTrends.map(d => d.segment)));

  const xScale = d3.scaleLinear()
    .domain(d3.extent(segTrends, d => d.year))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(segTrends, d => d.real_exp_per_capita)])
    .range([height, 0]);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.format("d")))
    .style("color", "#9CA3AF");

  svg.append("g")
    .call(d3.axisLeft(yScale).ticks(6).tickFormat(d => `$${d}`))
    .style("color", "#9CA3AF");

  const line = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.real_exp_per_capita));

  segments.forEach(segment => {
    const segmentData = segTrends.filter(d => d.segment === segment);
    
    svg.append("path")
      .datum(segmentData)
      .attr("fill", "none")
      .attr("stroke", COLORS.segments[segment] || COLORS.gray)
      .attr("stroke-width", 2.5)
      .attr("d", line);
  });

  // LEGENDA FIXA NO TOPO
  const legend = svg.append("g")
    .attr("transform", `translate(0, -25)`); 

  segments.forEach((cat, i) => {
    const col = legend.append("g")
      .attr("transform", `translate(${i * 130}, 0)`); 

    col.append("circle")
      .attr("r", 4)
      .attr("fill", COLORS.segments[cat]);

    col.append("text")
      .attr("x", 8)
      .attr("y", 4)
      .style("fill", "#D1D5DB")
      .style("font-size", "10px")
      .style("font-weight", "600")
      .text(cat.toUpperCase());
  });
}


document.addEventListener("DOMContentLoaded", async () => {
  const state = {};
  const { annual, funding, cost, systems, segTrends } = await loadData();

  initFilters(systems, state);
  renderScatterSystems(systems, state);
  renderFundingIllusion(funding, state);
  renderCostIndex(cost, state);
  renderSegmentTrends(segTrends, state);
});
