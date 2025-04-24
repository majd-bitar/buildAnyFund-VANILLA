// Hero visualization with animated particles
function createHeroVisualization() {
  const container = document.getElementById('hero-visualization');
  // clear any prior SVG
  d3.select(container).selectAll('*').remove();

  // 1) measure container and set height to keep aspect ratio
  const width = container.clientWidth;
  const height = width * 0.6;

  // 2) responsive SVG
  const svg = d3.select(container)
    .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('height','auto');

  // 3) background gradient
  const defs = svg.append('defs');
  const grad = defs.append('linearGradient')
    .attr('id','hero-gradient')
    .attr('x1','0%').attr('y1','0%')
    .attr('x2','100%').attr('y2','100%');
  grad.append('stop').attr('offset','0%').attr('stop-color','#ce1126').attr('stop-opacity',0.2);
  grad.append('stop').attr('offset','100%').attr('stop-color','#009e49').attr('stop-opacity',0.2);
  svg.append('rect')
    .attr('width',width).attr('height',height)
    .attr('fill','url(#hero-gradient)');

  // center point
  const cx = width/2, cy = height/2;

  // central fund icon
  svg.append('circle')
    .attr('cx',cx).attr('cy',cy).attr('r',50)
    .attr('fill','#fff').attr('stroke','#ce1126').attr('stroke-width',3);
  svg.append('text')
    .attr('x',cx).attr('y',cy)
    .attr('text-anchor','middle').attr('dominant-baseline','central')
    .attr('font-family','FontAwesome').attr('font-size','40px').attr('fill','#ce1126')
    .text('\uf200');

  // 4) orbiting elements
  const orbitRadius = Math.min(width, height)*0.35;
  const items = [
    { icon:'\uf0ac', label:'UAE-Based',     color:'#ce1126' },
    { icon:'\uf19c', label:'Regulatory',    color:'#009e49' },
    { icon:'\uf085', label:'AI-Powered',    color:'#ce1126' },
    { icon:'\uf15c', label:'Docs',          color:'#009e49' },
    { icon:'\uf155', label:'Banking',       color:'#ce1126' },
    { icon:'\uf0e8', label:'API',           color:'#009e49' }
  ];

  // constant duration so spacing never changes
  const ORBIT_DURATION = 20000;

  items.forEach((d,i) => {
    // evenly spaced initial angles
    const angle0 = (2*Math.PI/ items.length) * i;

    const g = svg.append('g')
      .attr('transform', `translate(${cx + orbitRadius*Math.cos(angle0)},${cy + orbitRadius*Math.sin(angle0)})`);

    // circle
    g.append('circle')
      .attr('r',30)
      .attr('fill','#fff')
      .attr('stroke',d.color)
      .attr('stroke-width',2);

    // icon (bigger)
    g.append('text')
      .attr('text-anchor','middle')
      .attr('dominant-baseline','central')
      .attr('font-family','FontAwesome')
      .attr('font-size','24px')
      .attr('fill',d.color)
      .text(d.icon);

    // label (bigger)
    const LABEL_OFFSET = 45;
    g.append('text')
      .attr('x', LABEL_OFFSET * Math.cos(angle0))
      .attr('y', LABEL_OFFSET * Math.sin(angle0) + 4)
      .attr('text-anchor', Math.cos(angle0)>0 ? 'start' : 'end')
      .attr('font-size','16px')
      .attr('fill',d.color)
      .text(d.label);

    // orbit animation (same speed for all)
    (function repeat() {
      g.transition()
        .duration(ORBIT_DURATION)
        .attrTween('transform', () => {
          return t => {
            const ang = angle0 + t * 2 * Math.PI;
            const x = cx + orbitRadius * Math.cos(ang);
            const y = cy + orbitRadius * Math.sin(ang);
            return `translate(${x},${y})`;
          };
        })
        .on('end', repeat);
    })();
  });

  // 5) particles (unchanged)
  const particleCount = 50;
  const particles = d3.range(particleCount).map(() => ({
    x: Math.random()*width,
    y: Math.random()*height,
    r: Math.random()*3+1,
    vx: (Math.random()-0.5)*2,
    vy: (Math.random()-0.5)*2,
    color: Math.random()>0.5 ? '#ce1126' : '#009e49'
  }));
  const pg = svg.append('g').attr('class','particles');
  pg.selectAll('circle')
    .data(particles).enter()
    .append('circle')
      .attr('r',d=>d.r)
      .attr('cx',d=>d.x)
      .attr('cy',d=>d.y)
      .attr('fill',d=>d.color)
      .attr('opacity',0.5);
  function animateParticles() {
    pg.selectAll('circle')
      .data(particles)
      .transition()
      .duration(2000)
      .attr('cx', d => {
        d.x = (d.x + d.vx*20 + width) % width;
        return d.x;
      })
      .attr('cy', d => {
        d.y = (d.y + d.vy*20 + height) % height;
        return d.y;
      })
      .on('end', animateParticles);
  }
  animateParticles();
}



function createPlatformOverviewVisualization() {
  const container = document.getElementById("platform-overview-visualization");

  // logical coordinate system
  const W0 = 1000, H0 = 500;

  // responsive SVG
  const svg = d3.select(container)
    .append("svg")
      .attr("viewBox", `0 0 ${W0} ${H0}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width",  "100%")
      .style("height", "auto");

  // on narrow screens only draw titles
  const isMobile = window.innerWidth < 768;

  // relative feature positions (percentages of W0/H0)
  const features = [
    { icon: "\uf0ac", title: "UAE-Based Platform",   desc: "Hosted in UAE (Dubai/ADGM/DIFC)…", color:"#ce1126", x:0.25*W0, y:0.30*H0 },
    { icon: "\uf007", title: "Target Users",          desc: "Fund managers, HNWIs…",          color:"#009e49", x:0.50*W0, y:0.30*H0 },
    { icon: "\uf085", title: "AI-Powered",            desc: "AI for jurisdiction…",           color:"#ce1126", x:0.75*W0, y:0.30*H0 },
    { icon: "\uf15c", title: "Document Automation",   desc: "AI-generated legal docs…",       color:"#009e49", x:0.25*W0, y:0.70*H0 },
    { icon: "\uf19c", title: "Regulatory Filing",     desc: "Direct API to regulators",       color:"#ce1126", x:0.50*W0, y:0.70*H0 },
    { icon: "\uf155", title: "Banking Integration",   desc: "Automated account setup…",       color:"#009e49", x:0.75*W0, y:0.70*H0 }
  ];

  // draw groups
  const grp = svg.selectAll(".feature")
    .data(features)
    .enter()
    .append("g")
      .attr("class","feature")
      .attr("transform", d => `translate(${d.x},${d.y})`);

  // circle + icon
  grp.append("circle")
      .attr("r", 40)
      .attr("fill","#fff")
      .attr("stroke", d=>d.color)
      .attr("stroke-width",3);

  grp.append("text")
      .attr("class","fa")
      .attr("text-anchor","middle")
      .attr("dominant-baseline","central")
      .attr("font-size","25px")
      .attr("fill",d=>d.color)
      .text(d=>d.icon);

  // title
  grp.append("text")
      .attr("text-anchor","middle")
      .attr("y",60)
      .attr("font-size","16px")
      .attr("font-weight","bold")
      .attr("fill","#333")
      .text(d=>d.title);

  // optional description
  if (!isMobile) {
    grp.append("text")
      .attr("text-anchor","middle")
      .attr("y",85)
      .attr("font-size","12px")
      .attr("fill","#666")
      .each(function(d) {
        const textEl = d3.select(this),
              words = d.desc.split(" "),
              lineH = 14,
              maxChars = 30;
        let line="", lineNum=0;
        words.forEach((w,i)=>{
          const test = line + w + " ";
          if (test.length>maxChars && i>0) {
            textEl.append("tspan")
                  .attr("x",0).attr("y",85+lineNum*lineH)
                  .text(line.trim());
            line = w+" ";
            lineNum++;
          } else {
            line = test;
          }
        });
        textEl.append("tspan")
              .attr("x",0).attr("y",85+lineNum*lineH)
              .text(line.trim());
      });
  }

  // connector + moving‐dot animation
  const lineGen = d3.line()
    .x(d=>d.x).y(d=>d.y)
    .curve(d3.curveCardinal);

  // index pairs
  const pairs = [
    [0,1],[1,2],
    [3,4],[4,5],
    [0,3],[1,4],[2,5]
  ];

  pairs.forEach(([i,j])=>{
    const s=features[i], t=features[j];
    const path = svg.append("path")
      .datum([s,t])
      .attr("d", lineGen)
      .attr("fill","none")
      .attr("stroke","#ddd")
      .attr("stroke-width",2)
      .attr("stroke-dasharray","5,5");

    const dot = svg.append("circle")
      .attr("r",4)
      .attr("fill",s.color);

    (function animateDot(){
      const L=path.node().getTotalLength();
      dot.transition().duration(3000)
        .attrTween("transform", ()=>t0=>{
          const p=path.node().getPointAtLength(t0*L);
          return `translate(${p.x},${p.y})`;
        })
        .on("end", animateDot);
    })();
  });

  // hover effect
  grp.on("mouseover", function(){
    d3.select(this).select("circle")
      .transition().duration(300)
      .attr("r",45)
      .attr("fill","#f5f5f5");
  }).on("mouseout", function(){
    d3.select(this).select("circle")
      .transition().duration(300)
      .attr("r",40)
      .attr("fill","#fff");
  });

  // continuous pulse
  grp.each(function(_,i){
    const c = d3.select(this).select("circle");
    function pulse(){
      c.transition().duration(1500)
         .attr("r",45).attr("stroke-width",4).attr("stroke-opacity",0.8)
       .transition().duration(1500)
         .attr("r",40).attr("stroke-width",3).attr("stroke-opacity",1)
       .on("end", pulse);
    }
    setTimeout(pulse, i*300);
  });
}


// Initialize all visualizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create hero and platform overview visualizations
  createHeroVisualization();
  createPlatformOverviewVisualization();
  
  // Create the D3.js visualizations from visualizations.js
  //createFundStructureFlowDiagram();
  //createJurisdictionRadarChart();
  //createArchitectureVisualization();
  //createRoadmapVisualization();
  //createBusinessModelVisualization();
  
  // Add scroll animations
  const sections = document.querySelectorAll('section');
  
  function checkScroll() {
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const sectionBottom = section.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      
      if (sectionTop < windowHeight * 0.75 && sectionBottom > 0) {
        section.classList.add('active');
        
        // Add animation classes to elements within active sections
        const fadeElements = section.querySelectorAll('.fade-in');
        fadeElements.forEach((el, i) => {
          setTimeout(() => {
            el.style.opacity = 1;
          }, i * 200);
        });
        
        const slideLeftElements = section.querySelectorAll('.slide-in-left');
        slideLeftElements.forEach((el, i) => {
          setTimeout(() => {
            el.style.transform = 'translateX(0)';
            el.style.opacity = 1;
          }, i * 200);
        });
        
        const slideRightElements = section.querySelectorAll('.slide-in-right');
        slideRightElements.forEach((el, i) => {
          setTimeout(() => {
            el.style.transform = 'translateX(0)';
            el.style.opacity = 1;
          }, i * 200);
        });
      }
    });
  }
  
  // Check scroll position on page load
  checkScroll();
  
  // Check scroll position on scroll
  window.addEventListener('scroll', checkScroll);
});
