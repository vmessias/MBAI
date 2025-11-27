// visualizations.js
function showPersonas(step) {
  const container = d3.select("#viz-personas");
  if (container.empty()) return;
  const width = container.node().getBoundingClientRect().width;
  const height = container.node().getBoundingClientRect().height;

  // STEP 0: Mostrar TODOS juntos (Intro)
  if (step === 0) {
    container.html("");
    
    const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height);

    // Ajuste dinâmico para caberem 4 pessoas (divide espaço por 5 p/ margem)
    const totalPersonas = personasData.length;
    const personaWidth = width / (totalPersonas + 1);
    const centerY = height / 2;

    const personas = svg.selectAll(".persona-group")
      .data(personasData)
      .join("g")
      .attr("class", "persona-group")
      .attr("transform", (d, i) => `translate(${personaWidth * (i + 1)}, ${centerY})`)
      .style("opacity", 0);

    // Imagens menores para caber todos
    personas.append("image")
      .attr("xlink:href", d => d.image)
      .attr("x", -60)
      .attr("y", -60)
      .attr("width", 120)
      .attr("height", 120)
      .attr("clip-path", "circle(60px)");

    // Nomes
    personas.append("text")
      .attr("y", 85)
      .attr("text-anchor", "middle")
      .style("font-family", "'Libre Franklin', sans-serif")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("fill", "#333")
      .text(d => d.name.split(" ")[0]);

    // Animação de entrada
    personas.transition()
      .delay((d, i) => i * 150)
      .duration(600)
      .style("opacity", 1);

  } else {
    // STEP 1, 2, 3, 4: Destacar UM personagem específico
    // step 1 -> index 0 (Lucas)
    // step 2 -> index 1 (Marcus)
    // step 3 -> index 2 (David)
    // step 4 -> index 3 (Priya)
    
    const dataIndex = step - 1;
    
    // Proteção se o scroll for além dos dados existentes
    if (!personasData[dataIndex]) return;

    const targetPersona = personasData[dataIndex];

    container.html("");

    const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height);

    const centerX = width / 2;
    const centerY = height / 2;

    const personaGroup = svg.append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`)
      .style("opacity", 0);

    // Imagem GRANDE e infos detalhadas
    personaGroup.append("image")
      .attr("xlink:href", targetPersona.image)
      .attr("x", -120)
      .attr("y", -120)
      .attr("width", 240)
      .attr("height", 240)
      .attr("clip-path", "circle(120px)");

    personaGroup.append("text")
      .attr("y", 160)
      .attr("text-anchor", "middle")
      .style("font-family", "'Libre Franklin', sans-serif")
      .style("font-size", "32px")
      .style("font-weight", "700")
      .style("fill", targetPersona.color)
      .text(targetPersona.name);

    personaGroup.append("text")
      .attr("y", 195)
      .attr("text-anchor", "middle")
      .style("font-family", "'Libre Franklin', sans-serif")
      .style("font-size", "18px")
      .style("fill", "#666")
      .text(`${targetPersona.age} years old • ${targetPersona.origin}`);

    personaGroup.transition()
      .duration(600)
      .style("opacity", 1);
  }
}

// ==================== VISUALIZAÇÃO 2: GAP CHART ==================== //

function drawUnemploymentChart(step) {
    const container = d3.select("#viz-unemployment");
    if (container.empty()) return;

    const rect = container.node().getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const margin = { top: 120, right: 50, bottom: 50, left: 50 };

    // --- 1. SETUP (Roda uma vez) ---
    let svg = container.select("svg");
    
    if (svg.empty()) {
        svg = container.append("svg")
            .attr("width", width)
            .attr("height", height);

        // Escalas
        const x = d3.scaleLinear().domain([2019, 2025]).range([margin.left, width - margin.right]);
        const y = d3.scaleLinear().domain([0, 25]).range([height - margin.bottom, margin.top]);
        
        svg.node()._xScale = x;
        svg.node()._yScale = y;

        // Grid lines horizontais
        const yAxis = d3.axisLeft(y)
            .ticks(5)
            .tickSize(-(width - margin.left - margin.right))
            .tickFormat(d => d + "%");

        svg.append("g")
            .attr("class", "grid-group")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line")
                .attr("stroke", "#e5e5e5")
                .attr("stroke-dasharray", "2,2"));

        // Eixo X (Anos)
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom + 10})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(7).tickSize(0))
            .call(g => g.select(".domain").remove())
            .style("font-family", "var(--font-sans)")
            .style("font-size", "12px")
            .style("color", "#999");

        // Títulos
        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", margin.left)
            .attr("y", margin.top - 60)
            .style("font-size", "32px")
            .text("The Widening Gap");
            
        svg.append("text")
            .attr("class", "chart-subtitle")
            .attr("x", margin.left)
            .attr("y", margin.top - 30)
            .style("font-size", "16px")
            .style("fill", "#666")
            .text("Unemployment Rate: Youth vs. Established Workers");

        // Definição do ClipPath (Mascara para animação de revelar)
        svg.append("defs").append("clipPath")
            .attr("id", "reveal-clip")
            .append("rect")
            .attr("x", margin.left)
            .attr("y", 0)
            .attr("width", 0) // Começa fechado
            .attr("height", height);

        // Grupo Principal com Máscara
        const mainGroup = svg.append("g").attr("clip-path", "url(#reveal-clip)");
        
        // ÁREA DO GAP (Preenchimento entre as linhas)
        mainGroup.append("path").attr("class", "gap-area");
        
        // Linhas
        mainGroup.append("path").attr("class", "line-youth");
        mainGroup.append("path").attr("class", "line-adult");

        // Grupo de Anotações (Sem máscara, para aparecerem depois)
        svg.append("g").attr("class", "annotations-group").style("opacity", 0);
    }

    // Recupera escalas
    const x = svg.node()._xScale;
    const y = svg.node()._yScale;

    // Geradores
    const area = d3.area()
        .x(d => x(d.year))
        .y0(d => y(d.adult)) // Base: Adultos
        .y1(d => y(d.youth)) // Topo: Jovens
        .curve(d3.curveMonotoneX);

    const line = d3.line()
        .x(d => x(d.year))
        .curve(d3.curveMonotoneX);
    
    const t = d3.transition().duration(1000).ease(d3.easeCubicOut);

    svg.select(".gap-area")
        .datum(unemploymentData)
        .attr("fill", "rgba(201, 71, 71, 0.15)")
        .attr("d", area);

    svg.select(".line-youth")
        .datum(unemploymentData)
        .attr("fill", "none")
        .attr("stroke", "#c94747")
        .attr("stroke-width", 3)
        .attr("d", line.y(d => y(d.youth)));

    svg.select(".line-adult")
        .datum(unemploymentData)
        .attr("fill", "none")
        .attr("stroke", "#326891")
        .attr("stroke-width", 3)
        .attr("d", line.y(d => y(d.adult)));

    // LÓGICA DOS STEPS (Controla a Máscara e Anotações)
    
    const clipRect = svg.select("#reveal-clip rect");
    const annotations = svg.select(".annotations-group");

    if (step === 0) {
        clipRect.transition(t).attr("width", x(2019.5) - margin.left);
        annotations.transition(t).style("opacity", 0);
        
    } else if (step === 1) {
        clipRect.transition().duration(1500).ease(d3.easeLinear)
            .attr("width", width);
            
        annotations.transition(t).style("opacity", 0);

    } else if (step >= 2) {
        clipRect.attr("width", width);
        
        if (annotations.select("text").empty()) {
            // Label Youth
            annotations.append("text")
                .attr("class", "annotation-text")
                .attr("x", x(2025) + 10).attr("y", y(22.2))
                .style("fill", "#c94747")
                .text("Youth: 22.2%");

            // Label Adult
            annotations.append("text")
                .attr("class", "annotation-text")
                .attr("x", x(2025) + 10).attr("y", y(5.1))
                .style("fill", "#326891")
                .text("Adults: 5.1%");
                
            // Bolinhas finais
            annotations.append("circle").attr("cx", x(2025)).attr("cy", y(22.2)).attr("r", 5).attr("fill", "#c94747");
            annotations.append("circle").attr("cx", x(2025)).attr("cy", y(5.1)).attr("r", 5).attr("fill", "#326891");
        }
        annotations.transition(t).style("opacity", 1);
    }
}

// ==================== VISUALIZAÇÃO 3: OCCUPATIONS CHART (HORIZONTAL BARS - AUTO ANIMATE) ==================== //

function drawOccupationsChart(step) {
    const container = d3.select("#viz-occupations");
    if (container.empty()) return;

    const rect = container.node().getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const margin = { top: 120, right: 50, bottom: 40, left: 220 };

    let svg = container.select("svg");
    
    if (svg.empty()) {
        svg = container.append("svg")
            .attr("width", width)
            .attr("height", height);

        const x = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
        const y = d3.scaleBand()
            .domain(occupationsData.map(d => d.occupation))
            .range([margin.top, height - margin.bottom])
            .padding(0.5);

        svg.node()._xScale = x;
        svg.node()._yScale = y;

        // Título
        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", margin.left)
            .attr("y", margin.top - 70)
            .style("font-size", "32px")
            .style("font-weight", "700")
            .style("fill", "#111")
            .text("Top Occupations Replaced by AI");

        svg.append("text")
            .attr("x", margin.left)
            .attr("y", margin.top - 35)
            .style("font-size", "14px")
            .style("fill", "#666")
            .text("% Susceptibility to Automation in Durham Region");

        // Eixo X (Bottom)
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d => d + "%"))
            .style("font-size", "12px");

        // Grupos
        svg.append("g").attr("class", "bars-group");
        svg.append("g").attr("class", "labels-group");
        svg.append("g").attr("class", "values-group");

        // Inicia animação automática (não depende do scroll)
        animateOccupationsAuto(svg, x, y);
    }
}

function animateOccupationsAuto(svg, x, y) {
    const barsGroup = svg.select(".bars-group");
    const labelsGroup = svg.select(".labels-group");
    const valuesGroup = svg.select(".values-group");

    // Anima todas as barras uma após a outra
    occupationsData.forEach((d, i) => {
        const delay = i * 400;

        // Barra
        barsGroup.append("rect")
            .attr("class", "bar")
            .attr("x", x.range()[0])
            .attr("y", y(d.occupation))
            .attr("width", 0)
            .attr("height", y.bandwidth())
            .attr("fill", d.exposed ? "#c94747" : "#95a0a8")
            .transition()
            .delay(delay)
            .duration(800)
            .ease(d3.easeQuadOut)
            .attr("width", x(d.percentage) - x.range()[0]);

        // Label (Ocupação)
        labelsGroup.append("text")
            .attr("class", "label")
            .attr("x", x.range()[0] - 10)
            .attr("y", y(d.occupation) + y.bandwidth() / 2 + 5)
            .attr("text-anchor", "end")
            .style("font-size", "13px")
            .style("fill", "#333")
            .style("opacity", 0)
            .text(d.occupation)
            .transition()
            .delay(delay)
            .duration(600)
            .style("opacity", 1);

        // Valor (%)
        valuesGroup.append("text")
            .attr("class", "value")
            .attr("x", x(d.percentage) + 8)
            .attr("y", y(d.occupation) + y.bandwidth() / 2 + 5)
            .style("font-size", "12px")
            .style("font-weight", "600")
            .style("fill", "#666")
            .style("opacity", 0)
            .text(d.percentage + "%")
            .transition()
            .delay(delay + 300)
            .duration(600)
            .style("opacity", 1);
    });
}


// ==================== VISUALIZAÇÃO 4: AI JOBS BUBBLE CHART ==================== //
function drawAiJobsChart() {
    const container = d3.select("#viz-ai-jobs");
    if (container.empty()) return;

    const rect = container.node().getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    container.html(""); // Limpa antes de desenhar

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const pack = d3.pack()
        .size([width, height])
        .padding(10);

    const root = d3.hierarchy({ children: aiJobsData })
        .sum(d => d.jobs);

    const nodes = pack(root).leaves();

    const node = svg.selectAll(".bubble")
        .data(nodes)
        .join("g")
        .attr("class", "bubble")
        .attr("transform", `translate(${width / 2}, ${height / 2})`) // Começam no centro
        .style("opacity", 0);

    // Círculo da bolha
    node.append("circle")
        .attr("class", "bubble-circle")
        .attr("r", d => d.r)
        .attr("fill", "rgba(44, 83, 100, 0.7)"); // Tom de azul escuro

    // Label do Setor
    node.append("text")
        .attr("class", "bubble-label")
        .attr("dy", "-0.5em")
        .text(d => d.data.sector);

    // Label do Valor (Jobs)
    node.append("text")
        .attr("class", "bubble-value")
        .attr("dy", "1em")
        .text(d => d3.format(",")(d.data.jobs) + "%");
        
    // Animação de entrada
    node.transition()
        .delay((d, i) => i * 100)
        .duration(1500)
        .ease(d3.easeElasticOut.amplitude(1.5))
        .attr("transform", d => `translate(${d.x}, ${d.y})`)
        .style("opacity", 1);
}


// ==================== VISUALIZAÇÃO 5: SKILLS CLUSTER (Priya) ==================== //

function drawSkillsChart() {
    const container = d3.select("#viz-skills-cluster");
    if (container.empty()) return;
    
    // Evita desenho duplo
    if (!container.select("svg").empty()) return;

    const rect = container.node().getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Paleta de cores
    const colorScale = d3.scaleOrdinal()
        .domain(["Human", "Technical"])
        .range(["#b399e5", "#9b59b6"]);

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Processa os dados hierárquicos
    const root = d3.hierarchy(skillsData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    // Layout de Bolhas
    const pack = d3.pack()
        .size([width, height])
        .padding(2);

    const nodes = pack(root).descendants();

    // Filtra apenas os "leaf nodes" (as habilidades em si, não as categorias)
    const leaves = nodes.filter(d => !d.children);

    const node = svg.selectAll("g")
        .data(leaves)
        .join("g")
        .attr("transform", `translate(${width / 2},${height / 2}) scale(1.2)`);

    // Círculo
    node.append("circle")
        .attr("r", 0) // Animação de crescimento
        .attr("fill", d => colorScale(d.parent.data.name))
        .attr("fill-opacity", 0.7)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 50)
        .attr("r", d => d.r);

    // Texto
    node.append("text")
        .attr("dy", "0.3em")
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", d => Math.min(d.r / 3, 12) + "px") // Ajusta tamanho
        .style("fill", "white")
        .style("pointer-events", "none")
        .text(d => d.data.name)
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .delay(800)
        .style("opacity", 1);

    // Move para posição final
    node.transition()
        .duration(1000)
        .ease(d3.easeBackOut)
        .attr("transform", d => `translate(${d.x},${d.y})`);
}
