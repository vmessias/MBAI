// Helpers
function toNumber(d, field) {
  d[field] = +d[field];
}

function clearAndSvg(id, width, height, margin) {
  const sel = d3.select(id).html('');
  const svg = sel.append('svg')
    .attr('width', width)
    .attr('height', height);
  svg.margin = margin;
  return svg;
}

/* 1. Scatter: população x total_current_revenue */

d3.csv('data/bubble_chart.csv').then(data => {
    data.forEach(d => {
        toNumber(d, 'population');
        toNumber(d, 'total_current_revenue');
    });
    
    const width = 520;
    const height = 380;
    const m = { top: 10, right: 10, bottom: 25  , left: 40 };
    
    const svg = clearAndSvg('#viz-funding-scatter', width, height, m);
    
    const x = d3.scaleLog()
    .domain(d3.extent(data, d => d.population))
    .nice()
    .range([m.left, width - m.right]);
    
    const y = d3.scaleLog()
    .domain(d3.extent(data, d => d.total_current_revenue))
    .nice()
    .range([height - m.bottom, m.top]);
    
    const color = d3.scaleOrdinal()
    .domain([...new Set(data.map(d => d.Region))])
    .range(['#1C3F76', '#4DB6AC', '#F39C12', '#8E44AD', '#C0392B']);
    
    svg.append('g')
    .attr('transform', `translate(0,${height - m.bottom})`)
    .call(d3.axisBottom(x).ticks(5, '~s'));
    
    svg.append('g')
    .attr('transform', `translate(${m.left},0)`)
    .call(d3.axisLeft(y).ticks(5, '~s'));
    
    svg.append('g')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', d => x(d.population))
    .attr('cy', d => y(d.total_current_revenue))
    .attr('r', 4)
    .attr('fill', d => color(d.Region))
    .attr('fill-opacity', 0.7);
        

    

    // pontos
    const points = svg.append('g')
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => x(d.population))
      .attr('cy', d => y(d.total_current_revenue))
      .attr('r', 4)
      .attr('fill', d => color(d.Region))
      .attr('fill-opacity', 0.7);

    // label só para Toronto (qualquer nome que contenha "toronto")
    const torontoPoint = data.find(
      d => d.city && d.city.toLowerCase().includes('toronto')
    );

    if (torontoPoint) {
      svg.append('text')
        .attr('x', x(torontoPoint.population) + 6)
        .attr('y', y(torontoPoint.total_current_revenue) - 6)
        .attr('font-size', 8)
        .attr('fill', '#1C3F76')
        .text('Toronto');
    }
    
});


/* 2. Barras verticais: revenue_per_capita (Top 15) */

d3.csv('data/region_per_capita.csv').then(data => {
  data.forEach(d => { toNumber(d, 'revenue_per_capita'); });

  // ordena do maior para o menor e pega top 15
  data.sort((a, b) => d3.descending(a.revenue_per_capita, b.revenue_per_capita));
  const topN = data.slice(0, 15);

  const width = 520;
  const height = 260;
  const m = { top: 10, right: 20, bottom: 80, left: 55 };

  const svg = clearAndSvg('#viz-revenue-ranking', width, height, m);

  const x = d3.scaleBand()
    .domain(topN.map(d => d.city))
    .range([m.left, width - m.right])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(topN, d => d.revenue_per_capita)]).nice()
    .range([height - m.bottom, m.top]);

  svg.append('g')
    .attr('transform', `translate(0,${height - m.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
      .attr('transform', 'rotate(35)')
      .style('text-anchor', 'start')
      .attr('dx', '0.5em')
      .attr('dy', '0.35em');

  svg.append('g')
    .attr('transform', `translate(${m.left},0)`)
    .call(d3.axisLeft(y).ticks(5, '~s'));

  const mainBlue = '#1C3F76';
  const grey = '#D0D6E8';

  svg.append('g')
    .selectAll('rect')
    .data(topN)
    .join('rect')
    .attr('x', d => x(d.city))
    .attr('y', d => y(d.revenue_per_capita))
    .attr('width', x.bandwidth())
    .attr('height', d => (height - m.bottom) - y(d.revenue_per_capita))
    .attr('fill', (d, i) => i === 0 ? mainBlue : grey);
    
    
    const max = topN[0];
    const min = topN[topN.length - 1];
    const fmt = d3.format('.0f');

    // rótulo do maior
    svg.append('text')
      .attr('x', x(max.city) + x.bandwidth() / 2)
      .attr('y', y(max.revenue_per_capita) - 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', '#1C3F76')
      .text(fmt(max.revenue_per_capita));

    // rótulo do menor
    svg.append('text')
      .attr('x', x(min.city) + x.bandwidth() / 2)
      .attr('y', y(min.revenue_per_capita) - 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', '#4B5267')
      .text(fmt(min.revenue_per_capita));

});


/* 3. Linhas indexadas: trend_TRIPLE_1999 + legenda */

d3.csv('data/trend_TRIPLE_1999.csv').then(data => {
  data.forEach(d => {
    toNumber(d, 'year');
    toNumber(d, 'Revenue Index');
    toNumber(d, 'Circulation Index');
    toNumber(d, 'Population Index');
  });

  const width = 520;
  const height = 260;
  const m = { top: 10, right: 140, bottom: 40, left: 0 };

  const svg = clearAndSvg('#viz-index-lines', width, height, m);

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([m.left, width - m.right]);

  const y = d3.scaleLinear()
    .domain([
      d3.min(data, d => Math.min(d['Revenue Index'], d['Circulation Index'], d['Population Index'])),
      d3.max(data, d => Math.max(d['Revenue Index'], d['Circulation Index'], d['Population Index']))
    ]).nice()
    .range([height - m.bottom, m.top]);

  const makeLine = field => d3.line()
    .x(d => x(d.year))
    .y(d => y(d[field]));

  const series = [
    { key: 'Revenue Index', color: '#1C3F76', label: 'Revenue' },
    { key: 'Circulation Index', color: '#C0392B', label: 'Circulation' },
    { key: 'Population Index', color: '#7F8C8D', label: 'Population' }
  ];

  svg.append('g')
    .attr('transform', `translate(0,${height - m.bottom})`)
    .call(d3.axisBottom(x).ticks(6).tickFormat(d3.format('d')));

  svg.append('g')
    .attr('transform', `translate(${m.left},0)`)
    .call(d3.axisLeft(y).ticks(5));

  series.forEach(s => {
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', s.color)
      .attr('stroke-width', 2)
      .attr('d', makeLine(s.key));
  });
    const lastYear = d3.max(data, d => d.year);

    series.forEach(s => {
      const last = data.find(d => d.year === lastYear);
      if (!last) return;

      svg.append('text')
        .attr('x', x(lastYear) + 4)
        .attr('y', y(last[s.key]) + 4)
        .attr('font-size', 10)
        .attr('fill', s.color)
        .text(last[s.key].toFixed(0));
    });

  // legenda
  const legend = svg.append('g')
    .attr('transform', `translate(${width - m.right + 20}, ${m.top + 5})`);

  series.forEach((s, i) => {
    const g = legend.append('g')
      .attr('transform', `translate(0, ${i * 18})`);
    g.append('line')
      .attr('x1', 0).attr('x2', 20)
      .attr('y1', 6).attr('y2', 6)
      .attr('stroke', s.color)
      .attr('stroke-width', 2);
    g.append('text')
      .attr('x', 26).attr('y', 9)
      .attr('font-size', 10)
      .attr('fill', '#4B5267')
      .text(s.label);
      
      
      
  });
    
});


/* 4. Metrics gap: Mean / Median, ordenado + linhas + cores */

d3.csv('data/metrics_gap_table.csv').then(data => {
  data.forEach(d => {
    toNumber(d, 'Median_Value');
    toNumber(d, 'Mean_Value');
    d.ratio = d.Median_Value === 0 ? null : d.Mean_Value / d.Median_Value;
  });

  const filtered = data.filter(d => d.ratio != null);

  // ordena do maior para o menor
  const sorted = filtered.sort((a, b) => d3.descending(a.ratio, b.ratio));

  const width = 520;
  const height = 280; // um pouco mais alto
  const m = { top: 20, right: 60, bottom: 20, left: 250}; // top maior pra não cortar o 1º label

  const svg = clearAndSvg('#viz-metrics-gap', width, height, m);

  const x = d3.scaleLog()
    .domain([1, d3.max(sorted, d => d.ratio)]).nice()
    .range([m.left, width - m.right]);

  const y = d3.scaleBand()
    .domain(sorted.map(d => d.Metric_Name))
    .range([m.top, height - m.bottom])
    .padding(0.35);

  svg.append('g')
    .attr('transform', `translate(0,${height - m.bottom})`)
    .call(d3.axisBottom(x).ticks(5, '~g'));

  svg.append('g')
    .attr('transform', `translate(${m.left},0)`)
    .call(d3.axisLeft(y));

  // linhas sutis do eixo Y até a bolinha
  svg.append('g')
    .selectAll('line')
    .data(sorted)
    .join('line')
    .attr('x1', m.left)
    .attr('x2', d => x(d.ratio))
    .attr('y1', d => y(d.Metric_Name) + y.bandwidth() / 2)
    .attr('y2', d => y(d.Metric_Name) + y.bandwidth() / 2)
    .attr('stroke', '#E0E3EF')
    .attr('stroke-width', 1);

  // função de cor por limiar
  const colorByRatio = r =>
    r > 10 ? '#C0392B' :      // vermelho
    r > 5  ? '#F4B400' :      // amarelo
             '#2E7D32';       // verde

  // pontos
  svg.append('g')
    .selectAll('circle')
    .data(sorted)
    .join('circle')
    .attr('cx', d => x(d.ratio))
    .attr('cy', d => y(d.Metric_Name) + y.bandwidth() / 2)
    .attr('r', 4)
    .attr('fill', d => colorByRatio(d.ratio));

  // labels "×" à direita
  svg.append('g')
    .selectAll('text')
    .data(sorted)
    .join('text')
    .attr('x', d => x(d.ratio) + 6)
    .attr('y', d => y(d.Metric_Name) + y.bandwidth() / 2 + 3)
    .attr('font-size', 10)
    .attr('fill', '#4B5267')
    .text(d => d.ratio.toFixed(1) + '×');
});
