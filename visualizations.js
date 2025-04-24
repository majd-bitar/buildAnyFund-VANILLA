// Enhanced visualization components using D3.js

// Import D3.js library in the HTML file:
// <script src="https://d3js.org/d3.v7.min.js"></script>

// Fund Structure Flow Diagram
function createFundStructureFlowDiagram() {
  // Data for the fund structure flow
  const flowData = [
    { id: "user", label: "Fund Manager", x: 100, y: 100 },
    { id: "platform", label: "BuildAnyFund Platform", x: 300, y: 100 },
    { id: "jurisdiction", label: "Jurisdiction Selection", x: 500, y: 50 },
    { id: "documents", label: "Legal Documents", x: 500, y: 150 },
    { id: "regulatory", label: "Regulatory Filing", x: 700, y: 50 },
    { id: "banking", label: "Banking Setup", x: 700, y: 150 },
    { id: "fund", label: "Operational Fund", x: 900, y: 100 }
  ];

  // Connection paths between nodes
  const connections = [
    { source: "user", target: "platform" },
    { source: "platform", target: "jurisdiction" },
    { source: "platform", target: "documents" },
    { source: "jurisdiction", target: "regulatory" },
    { source: "documents", target: "regulatory" },
    { source: "documents", target: "banking" },
    { source: "regulatory", target: "fund" },
    { source: "banking", target: "fund" }
  ];

  // Create SVG container
  const svg = d3.select("#fund-structure-flow")
  .append("svg")
  .attr("viewBox", "0 0 800 600")
  .attr("preserveAspectRatio", "xMidYMid meet")
  .style("width", "100%")
  .style("height", "auto")
  .attr("viewBox", "0 0 1000 200");

  // Create connections
  const linkGenerator = d3.linkHorizontal()
    .x(d => d.x)
    .y(d => d.y);

  svg.selectAll("path")
    .data(connections)
    .enter()
    .append("path")
    .attr("d", d => {
      const source = flowData.find(node => node.id === d.source);
      const target = flowData.find(node => node.id === d.target);
      return linkGenerator({ source, target });
    })
    .attr("fill", "none")
    .attr("stroke", "#009e49")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5,5")
    .attr("marker-end", "url(#arrowhead)");

  // Add arrow marker definition
  svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#009e49");

  // Create nodes
  const nodes = svg.selectAll("g")
    .data(flowData)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x}, ${d.y})`)
    .attr("class", "flow-node");

  // Add node circles
  nodes.append("circle")
    .attr("r", 30)
    .attr("fill", "#ffffff")
    .attr("stroke", "#ce1126")
    .attr("stroke-width", 2)
    .attr("class", "node-circle");

  // Add node icons (using Font Awesome classes)
  nodes.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .attr("class", "fa")
    .attr("font-size", "20px")
    .attr("fill", "#ce1126")
    .text(d => {
      switch(d.id) {
        case "user": return "\uf007"; // user icon
        case "platform": return "\uf085"; // cogs icon
        case "jurisdiction": return "\uf0ac"; // globe icon
        case "documents": return "\uf15c"; // file icon
        case "regulatory": return "\uf19c"; // bank/institution icon
        case "banking": return "\uf155"; // dollar icon
        case "fund": return "\uf200"; // chart icon
        default: return "\uf111"; // circle icon
      }
    });

  // Add node labels
  nodes.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", 50)
    .attr("fill", "#333333")
    .attr("font-weight", "bold")
    .attr("font-size", "12px")
    .text(d => d.label);

  // Add hover effects
  nodes.on("mouseover", function() {
    d3.select(this).select("circle")
      .transition()
      .duration(300)
      .attr("r", 35)
      .attr("fill", "#f5f5f5");
  }).on("mouseout", function() {
    d3.select(this).select("circle")
      .transition()
      .duration(300)
      .attr("r", 30)
      .attr("fill", "#ffffff");
  });
}

// Jurisdiction Comparison Radar Chart
function createJurisdictionRadarChart() {
  const container = d3.select("#jurisdiction-radar");
  container.selectAll("*").remove();

  // 1) Measure container and set size (use heightFactor < 1 to shrink)
  const fullWidth   = container.node().clientWidth;
  const heightFactor = 0.6;             // ← shrink chart height to 60% of width
  const fullHeight  = fullWidth * heightFactor;
  const margin = { top: 30, right: 30, bottom: 30, left: 30 };
  const width  = fullWidth  - margin.left - margin.right;
  const height = fullHeight - margin.top  - margin.bottom;
  const radius = Math.min(width, height) / 2;

  // 2) Data & config
  const jurisdictions = [
    { name: "DIFC",   metrics: [0.95,0.85,0.70,0.90,0.85] },
    { name: "ADGM",   metrics: [0.95,0.90,0.65,0.80,0.90] },
    { name: "Cayman", metrics: [0.90,0.75,0.60,0.95,0.80] }
  ];
  const axes       = ["Tax Efficiency","Regulatory Speed","Setup Cost","Investor Familiarity","Legal Framework"];
  const angleSlice = (Math.PI * 2) / axes.length;
  const color = d3.scaleOrdinal()
                  .domain(jurisdictions.map(d=>d.name))
                  .range(["#ce1126","#009e49","#0066cc"]);

  // 3) Build SVG
  const svg = container
    .append("svg")
      .attr("viewBox", `0 0 ${fullWidth} ${fullHeight}`)
      .attr("preserveAspectRatio","xMidYMid meet")
      .style("width","100%").style("height","auto")
    .append("g")
      .attr("transform", `translate(${margin.left + width/2},${margin.top + height/2})`);

  // 4) Draw circular grid
  const levels = 5;
  for(let lvl=1; lvl<=levels; lvl++){
    svg.append("circle")
       .attr("r", radius * (lvl/levels))
       .style("fill","none")
       .style("stroke","#ddd");
  }

  // 5) Draw axes & labels
  axes.forEach((axis,i) => {
    const angle = angleSlice*i - Math.PI/2;
    const x2 = Math.cos(angle)*radius;
    const y2 = Math.sin(angle)*radius;

    svg.append("line")
       .attr("x1",0).attr("y1",0).attr("x2",x2).attr("y2",y2)
       .style("stroke","#ddd");

    svg.append("text")
       .attr("x", Math.cos(angle)*(radius+10))
       .attr("y", Math.sin(angle)*(radius+10))
       .attr("text-anchor","middle")
       .attr("font-size","11px")
       .attr("fill","#333")
       .text(axis);
  });

  // 6) Plot each jurisdiction
  const radarLine = d3.lineRadial()
    .radius(d=>d.value*radius)
    .angle((d,i)=>i*angleSlice)
    .curve(d3.curveLinearClosed);

  jurisdictions.forEach((jur,i) => {
    const data = jur.metrics.map((v,idx)=>({axis:axes[idx],value:v}));

    // area
    svg.append("path")
      .datum(data)
      .attr("d", radarLine)
      .style("fill", color(jur.name))
      .style("fill-opacity", 0.3)
      .style("stroke", color(jur.name))
      .style("stroke-width", 2);

    // data circles
    svg.selectAll(`.radar-circle-${i}`)
      .data(data)
      .enter().append("circle")
        .attr("class",`radar-circle-${i}`)
        .attr("cx", d => Math.cos(angleSlice*data.indexOf(d)-Math.PI/2)*d.value*radius)
        .attr("cy", d => Math.sin(angleSlice*data.indexOf(d)-Math.PI/2)*d.value*radius)
        .attr("r", 4)
        .style("fill", color(jur.name))
        .style("fill-opacity", 0.8);
  });

  // 7) Legend
  const legend = svg.append("g")
    .attr("transform", `translate(${-width/2+10},${-height/2+10})`);
  jurisdictions.forEach((jur,i) => {
    const g = legend.append("g")
      .attr("transform", `translate(0,${i*18})`);
    g.append("rect").attr("width",12).attr("height",12).style("fill", color(jur.name));
    g.append("text")
      .attr("x",16).attr("y",10)
      .attr("font-size","12px")
      .attr("fill","#333")
      .text(jur.name);
  });
}


// Technical Architecture Visualization
function createArchitectureVisualization() {
  // 1️⃣ Data for each layer
  const layers = [
    {
      name: "User Interaction Layer",
      color: "#009e49",
      components: [
        { name: "Web Portal", icon: "\uf109" },
        { name: "Mobile App", icon: "\uf10b" },
        { name: "KYC/AML", icon: "\uf2c2" },
        { name: "eSignatures", icon: "\uf040" }
      ]
    },
    {
      name: "Core Application Layer",
      color: "#ce1126",
      components: [
        { name: "Fund Structuring Engine", icon: "\uf085" },
        { name: "Database", icon: "\uf1c0" }
      ]
    },
    {
      name: "Backend & APIs",
      color: "#0066cc",
      components: [
        { name: "Node.js/Python", icon: "\uf121" },
        { name: "UAE Banking APIs", icon: "\uf19c" },
        { name: "Regulatory APIs", icon: "\uf0e8" }
      ]
    },
    {
      name: "Infrastructure & Security",
      color: "#663399",
      components: [
        { name: "Cloud Hosting", icon: "\uf0c2" },
        { name: "CI/CD", icon: "\uf021" }
      ]
    },
  ];

  // 2️⃣ Compute responsive dimensions
  const container  = document.getElementById("architecture-visualization");
  const width      = container.clientWidth;
  const height     = width * (400 / 800); // keep original 800×600 ratio
  const margin     = 50;
  const layerH     = 80;
  const layerSpace = 40;
  const chartW     = width - margin * 2;
  const centerX    = width / 2;

  // 3️⃣ Create SVG
  const svg = d3.select(container)
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width",  "100%")
      .style("height", "auto");

  // 4️⃣ Arrowhead marker
  svg.append("defs")
    .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#333333");

  // 5️⃣ Draw each layer bar + label
  const layerG = svg.selectAll(".layer")
    .data(layers)
    .enter()
    .append("g")
      .attr("class", "layer")
      .attr(
        "transform",
        (d,i) => `translate(${margin}, ${margin + i*(layerH+layerSpace)})`
      );

  layerG.append("rect")
    .attr("width",  chartW)
    .attr("height", layerH)
    .attr("rx", 8).attr("ry", 8)
    .attr("fill", d => d.color)
    .attr("opacity", 0.2)
    .attr("stroke", d => d.color)
    .attr("stroke-width", 2);

  layerG.append("text")
    .attr("x", 10)
    .attr("y", 30)
    .attr("fill", d => d.color)
    .attr("font-weight", "bold")
    .attr("font-size", "16px")
    .text(d => d.name);

  // 6️⃣ Place icons evenly on each layer
  layers.forEach((layer, li) => {
    const slots = layer.components.length + 1;
    const slotW = chartW / slots;

    layer.components.forEach((comp, ci) => {
      const cx = margin + (ci + 1) * slotW;
      const cy = margin + li*(layerH+layerSpace) + layerH/2;

      const g = svg.append("g")
        .attr("class", "component")
        .attr("transform", `translate(${cx}, ${cy})`);

      g.append("circle")
        .attr("r", 25)
        .attr("fill", "#fff")
        .attr("stroke", layer.color)
        .attr("stroke-width", 2);

      g.append("text")
        .attr("class", "fa")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .attr("font-size", "16px")
        .attr("fill", layer.color)
        .text(comp.icon);

      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 45)
        .attr("font-size", "12px")
        .attr("fill", "#333")
        .text(comp.name);
    });
  });

  // 7️⃣ Draw a single arrow from center of each layer to the next
  layers.forEach((_, i) => {
    if (i === layers.length - 1) return; // no arrow after final layer

    const y1 = margin + i*(layerH+layerSpace) + layerH;
    const y2 = margin + (i+1)*(layerH+layerSpace);

    svg.append("line")
      .attr("x1", centerX)
      .attr("y1", y1)
      .attr("x2", centerX)
      .attr("y2", y2)
      .attr("stroke", "#333333")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "5,5")
      .attr("marker-end", "url(#arrow)");
  });
}


// Implementation Roadmap Timeline Visualization
function createRoadmapVisualization() {
  // Data for roadmap milestones
  const milestones = [
    { 
      phase: "MVP (Basic Doc Automation)", 
      duration: "3 Months", 
      features: ["Core document templates", "Basic user interface", "eSignature integration"],
      icon: "\uf15b" // document icon
    },
    { 
      phase: "Regulatory API Integration", 
      duration: "6 Months", 
      features: ["API connections to regulators", "Automated submission workflows", "Status tracking"],
      icon: "\uf0e8" // sitemap icon
    },
    { 
      phase: "Banking & Custody APIs", 
      duration: "9 Months", 
      features: ["UAE bank API connections", "Multicurrency account setup", "Transaction monitoring"],
      icon: "\uf19c" // bank icon
    },
    { 
      phase: "AI Tax & Compliance Engine", 
      duration: "12 Months", 
      features: ["Real-time tax jurisdiction comparison", "Automated FATCA/CRS reporting", "Continuous AML monitoring"],
      icon: "\uf200" // chart icon
    }
  ];

  // Create SVG container
  const svg = d3.select("#roadmap-visualization")
    .append("svg")
      .attr("viewBox", "0 0 800 300")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "auto");

  // Timeline configuration
  const timelineY   = 150;
  const nodeRadius  = 30;
  const nodeSpacing = 200;

  // Draw main timeline line (solid)
  svg.append("line")
    .attr("x1", 50)
    .attr("y1", timelineY)
    .attr("x2", 750)
    .attr("y2", timelineY)
    .attr("stroke", "#009e49")
    .attr("stroke-width", 4);

  // Create milestone nodes
  const milestoneGroups = svg.selectAll(".milestone")
    .data(milestones)
    .enter()
    .append("g")
      .attr("class", "milestone")
      .attr("transform", (d, i) => `translate(${100 + i * nodeSpacing}, ${timelineY})`);

  // Add milestone circles
  milestoneGroups.append("circle")
    .attr("r", nodeRadius)
    .attr("fill", "#ffffff")
    .attr("stroke", "#ce1126")
    .attr("stroke-width", 3);

  // Add milestone icons
  milestoneGroups.append("text")
    .attr("class", "fa")
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .attr("font-size", "20px")
    .attr("fill", "#ce1126")
    .text(d => d.icon);

  // Add milestone phase labels (above)
  milestoneGroups.append("text")
    .attr("text-anchor", "middle")
    .attr("y", -50)
    .attr("font-weight", "bold")
    .attr("font-size", "14px")
    .attr("fill", "#333333")
    .text(d => d.phase);

  // Add milestone duration labels (below)
  milestoneGroups.append("text")
    .attr("text-anchor", "middle")
    .attr("y", 50)
    .attr("font-size", "14px")
    .attr("fill", "#009e49")
    .attr("font-weight", "bold")
    .text(d => d.duration);

  // Add feature lists (below duration)
  milestoneGroups.each(function(d) {
    const group = d3.select(this);
    d.features.forEach((feature, j) => {
      group.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 70 + j * 20)
        .attr("font-size", "12px")
        .attr("fill", "#666666")
        .text(feature);
    });
  });

  // Add hover effects on the milestone circles
  milestoneGroups.on("mouseover", function() {
    d3.select(this).select("circle")
      .transition()
      .duration(300)
      .attr("r", nodeRadius + 5)
      .attr("fill", "#f5f5f5");
  }).on("mouseout", function() {
    d3.select(this).select("circle")
      .transition()
      .duration(300)
      .attr("r", nodeRadius)
      .attr("fill", "#ffffff");
  });

  // Add progress indicator (solid line)
  const progressLine = svg.append("line")
    .attr("x1", 50)
    .attr("y1", timelineY)
    .attr("x2", 50)
    .attr("y2", timelineY)
    .attr("stroke", "#009e49")
    .attr("stroke-width", 4);
    // no stroke-dasharray here → fully solid

  // Animate progress line
  progressLine.transition()
    .duration(2000)
    .attr("x2", 750)
    .on("end", function() {
      d3.select(this)
        .transition()
        .duration(2000)
        .attr("x2", 50)
        .on("end", function() {
          d3.select(this)
            .transition()
            .duration(2000)
            .attr("x2", 300); // Set to current progress point
        });
    });
}


function createBusinessModelVisualization() {
  // 1. grab & clear your container
  const container = document.getElementById("business-model-visualization");
  d3.select(container).selectAll("*").remove();

  // 2. dimensions
  const fullWidth    = container.clientWidth;
  const tierCount    = 3;
  const margin       = { top: 50, right: 20, bottom: 50, left: 20 };
  const gutter       = 40;
  const tierWidth    = 220;
  const tierHeight   = 450;
  const startX       = margin.left + (fullWidth - margin.left - margin.right - tierCount * tierWidth - (tierCount-1)*gutter)/2;
  const svgHeight    = margin.top + tierHeight + margin.bottom;

  // 3. SVG
  const svg = d3.select(container)
    .append("svg")
      .attr("viewBox", `0 0 ${fullWidth} ${svgHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width","100%")
      .style("height","auto");

  // 4. data
  const pricingTiers = [
    { name:"Basic",      price:"$X,XXX",   description:"Document automation only",
      features:[
        {name:"AI-generated legal documents", included:true},
        {name:"Customizable templates",        included:true},
        {name:"eSignature integration",        included:true},
        {name:"Regulatory filing",             included:false},
        {name:"Banking integration",           included:false},
        {name:"Investor dashboard",            included:false}
      ],
      color:"#ce1126"
    },
    { name:"Pro",        price:"$XX,XXX", description:"Full fund setup + regulatory filing",
      features:[
        {name:"All Basic features",         included:true},
        {name:"AI jurisdiction selection",  included:true},
        {name:"Regulatory API integration", included:true},
        {name:"Banking account setup",      included:true},
        {name:"Investor dashboard",         included:true},
        {name:"White labeling",             included:false}
      ],
      color:"#009e49", highlighted:true
    },
    { name:"Enterprise", price:"Custom",  description:"White label for institutions",
      features:[
        {name:"All Pro features",         included:true},
        {name:"White labeling",           included:true},
        {name:"Custom integrations",      included:true},
        {name:"Dedicated support",        included:true},
        {name:"SLA guarantees",           included:true},
        {name:"On-premise option",        included:true}
      ],
      color:"#0066cc"
    }
  ];

  // 5. text-wrapping helper
  function wrap(textSelection, maxWidth) {
    textSelection.each(function() {
      const text = d3.select(this),
            words = text.text().split(/\s+/).reverse();
      let word, line = [], lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          x = text.attr("x"),
          dy = parseFloat(text.attr("dy") || 0),
          tspan = text.text(null)
                      .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > maxWidth) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
                      .attr("x", x)
                      .attr("y", y)
                      .attr("dy", ++lineNumber * lineHeight + dy + "em")
                      .text(word);
        }
      }
    });
  }

  // 6. build each tier group
  const tierGs = svg.selectAll(".tier")
    .data(pricingTiers)
    .enter().append("g")
      .attr("class","tier")
      .attr("transform",(d,i)=>`translate(${startX + i*(tierWidth+gutter)},${margin.top})`);

  // 7. card back + header
  tierGs.append("rect")
    .attr("width", tierWidth)
    .attr("height", tierHeight)
    .attr("rx", 8).attr("ry", 8)
    .attr("fill","#fff")
    .attr("stroke", d=>d.color)
    .attr("stroke-width", d=>d.highlighted?3:2);

  tierGs.append("rect")
    .attr("width", tierWidth)
    .attr("height", 80)
    .attr("rx", 8).attr("ry", 8)
    .attr("fill", d=>d.color);

  // 8. name, price, description
  tierGs.append("text")
    .attr("x", tierWidth/2).attr("y", 30)
    .attr("text-anchor","middle")
    .attr("font-size","18px")
    .attr("font-weight","bold")
    .attr("fill","#fff")
    .text(d=>d.name);

  tierGs.append("text")
    .attr("x", tierWidth/2).attr("y", 60)
    .attr("text-anchor","middle")
    .attr("font-size","24px")
    .attr("font-weight","bold")
    .attr("fill","#fff")
    .text(d=>d.price);

  tierGs.append("text")
    .attr("x", tierWidth/2).attr("y",100)
    .attr("text-anchor","middle")
    .attr("font-size","14px")
    .attr("fill","#666")
    .text(d=>d.description)
    .call(wrap, tierWidth - 40);

  // 9. feature list
  const featureY0 = 130, featGap = 30;
  pricingTiers.forEach((tier, ti) => {
    const g = tierGs.filter((d,i)=>i===ti);
    tier.features.forEach((feat, fi) => {
      const fg = g.append("g")
                  .attr("transform",`translate(20,${featureY0 + fi*featGap})`);
      fg.append("text")
        .attr("class","fa")
        .attr("font-size","16px")
        .attr("fill", feat.included? tier.color:"#999")
        .text(feat.included? "\uf00c":"\uf00d");
      fg.append("text")
        .attr("x",30).attr("y",5)
        .attr("font-size","14px")
        .attr("fill","#333")
        .text(feat.name)
        .call(wrap, tierWidth - 60);
    });
  });

  // 10. CTA button
  tierGs.append("rect")
    .attr("x",20)
    .attr("y", tierHeight - 80)
    .attr("width", tierWidth - 40)
    .attr("height", 40)
    .attr("rx",20).attr("ry",20)
    .attr("fill", d=>d.color)
    .style("cursor","pointer");

  tierGs.append("text")
    .attr("x", tierWidth/2)
    .attr("y", tierHeight - 55)
    .attr("text-anchor","middle")
    .attr("font-size","14px")
    .attr("font-weight","bold")
    .attr("fill","#fff")
    .style("cursor","pointer")
    .text(d=>d.name==="Enterprise"?"Contact Us":"Get Started");
}



// Initialize all visualizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  createFundStructureFlowDiagram();
  createJurisdictionRadarChart();
  createArchitectureVisualization();
  createRoadmapVisualization();
  createBusinessModelVisualization();
});
