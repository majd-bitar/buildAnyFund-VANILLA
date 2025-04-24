// Enhanced interactive elements for Fund Operating Model Visualization

// Create SVG diagrams for the workflow visualization
function createWorkflowSVG(containerId, steps) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.zIndex = "1";
  
  // Create connection lines between steps
  for (let i = 0; i < steps.length - 1; i++) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
    const startX = steps[i].x + "%";
    const startY = steps[i].y + "%";
    const endX = steps[i+1].x + "%";
    const endY = steps[i+1].y + "%";
    
    // Create curved path
    const path = `M ${startX} ${startY} C ${(parseInt(startX) + parseInt(endX))/2}% ${startY}, ${(parseInt(startX) + parseInt(endX))/2}% ${endY}, ${endX} ${endY}`;
    
    line.setAttribute("d", path);
    line.setAttribute("stroke", "#009e49");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke-dasharray", "5,5");
    line.setAttribute("marker-end", "url(#arrow)");
    
    svg.appendChild(line);
  }
  
  // Add arrow marker definition
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  marker.setAttribute("id", "arrow");
  marker.setAttribute("viewBox", "0 0 10 10");
  marker.setAttribute("refX", "5");
  marker.setAttribute("refY", "5");
  marker.setAttribute("markerWidth", "6");
  marker.setAttribute("markerHeight", "6");
  marker.setAttribute("orient", "auto-start-reverse");
  
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  arrow.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
  arrow.setAttribute("fill", "#009e49");
  
  marker.appendChild(arrow);
  defs.appendChild(marker);
  svg.appendChild(defs);
  
  container.insertBefore(svg, container.firstChild);
}

// Create architecture diagram with layers and connections
function createArchitectureSVG(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const layers = container.querySelectorAll('.architecture-layer');
  if (layers.length <= 1) return;
  
  // Create SVG for connections between layers
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.zIndex = "0";
  svg.style.pointerEvents = "none";
  
  // Add arrow marker definition
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  marker.setAttribute("id", "arch-arrow");
  marker.setAttribute("viewBox", "0 0 10 10");
  marker.setAttribute("refX", "5");
  marker.setAttribute("refY", "5");
  marker.setAttribute("markerWidth", "6");
  marker.setAttribute("markerHeight", "6");
  marker.setAttribute("orient", "auto-start-reverse");
  
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  arrow.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
  arrow.setAttribute("fill", "#ce1126");
  
  marker.appendChild(arrow);
  defs.appendChild(marker);
  svg.appendChild(defs);
  
  // Create connections between layers
  for (let i = 0; i < layers.length - 1; i++) {
    const currentLayer = layers[i];
    const nextLayer = layers[i + 1];
    
    const currentRect = currentLayer.getBoundingClientRect();
    const nextRect = nextLayer.getBoundingClientRect();
    
    const containerRect = container.getBoundingClientRect();
    
    // Calculate relative positions
    const startY = (currentRect.bottom - containerRect.top) / containerRect.height * 100;
    const endY = (nextRect.top - containerRect.top) / containerRect.height * 100;
    
    // Create multiple connection lines
    const numConnections = 3;
    const spacing = 100 / (numConnections + 1);
    
    for (let j = 1; j <= numConnections; j++) {
      const x = j * spacing;
      
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x + "%");
      line.setAttribute("y1", startY + "%");
      line.setAttribute("x2", x + "%");
      line.setAttribute("y2", endY + "%");
      line.setAttribute("stroke", "#ce1126");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("stroke-dasharray", "5,5");
      line.setAttribute("marker-end", "url(#arch-arrow)");
      
      svg.appendChild(line);
    }
  }
  
  container.insertBefore(svg, container.firstChild);
}

// Create interactive roadmap timeline
function enhanceRoadmapTimeline() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  
  const timelineItems = timeline.querySelectorAll('.timeline-item');
  
  // Add progress indicators
  const progressBar = document.createElement('div');
  progressBar.classList.add('timeline-progress');
  progressBar.style.position = 'absolute';
  progressBar.style.top = '0';
  progressBar.style.bottom = '0';
  progressBar.style.left = '50%';
  progressBar.style.width = '4px';
  progressBar.style.backgroundColor = '#e0e0e0';
  progressBar.style.transform = 'translateX(-50%)';
  progressBar.style.zIndex = '0';
  
  const progressFill = document.createElement('div');
  progressFill.classList.add('timeline-progress-fill');
  progressFill.style.position = 'absolute';
  progressFill.style.top = '0';
  progressFill.style.width = '100%';
  progressFill.style.backgroundColor = '#009e49';
  progressFill.style.height = '0%';
  progressFill.style.transition = 'height 1s ease';
  
  progressBar.appendChild(progressFill);
  timeline.insertBefore(progressBar, timeline.firstChild);
  
  // Add interactive hover effects
  timelineItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      const progress = ((index + 1) / timelineItems.length) * 100;
      progressFill.style.height = progress + '%';
      
      // Highlight current item
      timelineItems.forEach((otherItem, otherIndex) => {
        if (otherIndex <= index) {
          otherItem.classList.add('active');
        } else {
          otherItem.classList.remove('active');
        }
      });
    });
  });
  
  // Reset on mouseleave
  timeline.addEventListener('mouseleave', () => {
    progressFill.style.height = '0%';
    timelineItems.forEach(item => {
      item.classList.remove('active');
    });
  });
  
  // Add click functionality to show detailed view
  timelineItems.forEach(item => {
    item.addEventListener('click', () => {
      // Toggle expanded view
      item.classList.toggle('expanded');
      
      // Close other expanded items
      timelineItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('expanded');
        }
      });
    });
  });
}

// Create interactive business model comparison
function enhanceBusinessModel() {
  const pricingPlans = document.querySelectorAll('.pricing-plan');
  if (pricingPlans.length === 0) return;
  
  // Add feature comparison highlighting
  pricingPlans.forEach(plan => {
    const features = plan.querySelectorAll('.pricing-features li');
    
    features.forEach(feature => {
      feature.addEventListener('mouseenter', () => {
        // Find the same feature in other plans
        const featureText = feature.textContent.trim();
        
        pricingPlans.forEach(otherPlan => {
          const otherFeatures = otherPlan.querySelectorAll('.pricing-features li');
          
          otherFeatures.forEach(otherFeature => {
            const otherText = otherFeature.textContent.trim();
            
            if (otherText.includes(featureText.split(' ').slice(1).join(' '))) {
              otherFeature.classList.add('highlight');
            }
          });
        });
        
        feature.classList.add('highlight');
      });
      
      feature.addEventListener('mouseleave', () => {
        // Remove highlighting
        document.querySelectorAll('.pricing-features li.highlight').forEach(el => {
          el.classList.remove('highlight');
        });
      });
    });
  });
  
  // Add plan comparison functionality
  const comparePlansButton = document.createElement('button');
  comparePlansButton.textContent = 'Compare All Plans';
  comparePlansButton.classList.add('compare-plans-button');
  comparePlansButton.style.display = 'block';
  comparePlansButton.style.margin = '40px auto 0';
  comparePlansButton.style.padding = '10px 20px';
  comparePlansButton.style.backgroundColor = 'var(--uae-green)';
  comparePlansButton.style.color = 'white';
  comparePlansButton.style.border = 'none';
  comparePlansButton.style.borderRadius = '4px';
  comparePlansButton.style.cursor = 'pointer';
  
  const pricingTable = document.querySelector('.pricing-table');
  if (pricingTable) {
    pricingTable.parentNode.insertBefore(comparePlansButton, pricingTable.nextSibling);
    
    comparePlansButton.addEventListener('click', () => {
      // Toggle comparison view
      pricingTable.classList.toggle('comparison-view');
      
      if (pricingTable.classList.contains('comparison-view')) {
        comparePlansButton.textContent = 'Exit Comparison';
        
        // Create comparison table if it doesn't exist
        if (!document.querySelector('.comparison-table')) {
          createComparisonTable(pricingTable);
        } else {
          document.querySelector('.comparison-table').style.display = 'block';
        }
        
        pricingTable.style.display = 'none';
      } else {
        comparePlansButton.textContent = 'Compare All Plans';
        document.querySelector('.comparison-table').style.display = 'none';
        pricingTable.style.display = 'flex';
      }
    });
  }
}

// Create comparison table for business model
function createComparisonTable(pricingTable) {
  const plans = pricingTable.querySelectorAll('.pricing-plan');
  if (plans.length === 0) return;
  
  // Get all features from all plans
  const allFeatures = new Set();
  plans.forEach(plan => {
    const features = plan.querySelectorAll('.pricing-features li');
    features.forEach(feature => {
      // Extract feature name without the icon
      const featureText = feature.textContent.trim().replace(/^[^\w]+/, '').trim();
      allFeatures.add(featureText);
    });
  });
  
  // Create comparison table
  const comparisonTable = document.createElement('div');
  comparisonTable.classList.add('comparison-table');
  comparisonTable.style.width = '100%';
  comparisonTable.style.marginTop = '40px';
  comparisonTable.style.borderRadius = '8px';
  comparisonTable.style.overflow = 'hidden';
  comparisonTable.style.boxShadow = 'var(--box-shadow)';
  
  // Create table header
  const tableHeader = document.createElement('div');
  tableHeader.classList.add('comparison-header');
  tableHeader.style.display = 'flex';
  tableHeader.style.backgroundColor = 'var(--uae-red)';
  tableHeader.style.color = 'white';
  tableHeader.style.padding = '15px 0';
  
  // Add feature column header
  const featureHeader = document.createElement('div');
  featureHeader.classList.add('comparison-cell');
  featureHeader.style.flex = '1 1 40%';
  featureHeader.style.padding = '10px 20px';
  featureHeader.style.fontWeight = 'bold';
  featureHeader.textContent = 'Feature';
  tableHeader.appendChild(featureHeader);
  
  // Add plan column headers
  plans.forEach(plan => {
    const planName = plan.querySelector('.pricing-header h3').textContent;
    
    const planHeader = document.createElement('div');
    planHeader.classList.add('comparison-cell');
    planHeader.style.flex = `1 1 ${60 / plans.length}%`;
    planHeader.style.padding = '10px 20px';
    planHeader.style.fontWeight = 'bold';
    planHeader.style.textAlign = 'center';
    planHeader.textContent = planName;
    tableHeader.appendChild(planHeader);
  });
  
  comparisonTable.appendChild(tableHeader);
  
  // Create table rows for each feature
  allFeatures.forEach(feature => {
    const row = document.createElement('div');
    row.classList.add('comparison-row');
    row.style.display = 'flex';
    row.style.borderBottom = '1px solid var(--medium-gray)';
    row.style.backgroundColor = 'white';
    
    // Add feature name cell
    const featureCell = document.createElement('div');
    featureCell.classList.add('comparison-cell');
    featureCell.style.flex = '1 1 40%';
    featureCell.style.padding = '15px 20px';
    featureCell.textContent = feature;
    row.appendChild(featureCell);
    
    // Add plan cells
    plans.forEach(plan => {
      const planCell = document.createElement('div');
      planCell.classList.add('comparison-cell');
      planCell.style.flex = `1 1 ${60 / plans.length}%`;
      planCell.style.padding = '15px 20px';
      planCell.style.textAlign = 'center';
      
      // Check if plan has this feature
      const features = plan.querySelectorAll('.pricing-features li');
      let hasFeature = false;
      
      features.forEach(f => {
        const featureText = f.textContent.trim().replace(/^[^\w]+/, '').trim();
        if (featureText === feature) {
          hasFeature = f.querySelector('.fa-check') !== null;
        }
      });
      
      // Add check or x icon
      if (hasFeature) {
        planCell.innerHTML = '<i class="fas fa-check" style="color: var(--uae-green);"></i>';
      } else {
        planCell.innerHTML = '<i class="fas fa-times" style="color: var(--uae-red);"></i>';
      }
      
      row.appendChild(planCell);
    });
    
    comparisonTable.appendChild(row);
  });
  
  // Add to document
  pricingTable.parentNode.insertBefore(comparisonTable, pricingTable.nextSibling);
  comparisonTable.style.display = 'none'; // Hide initially
}

// Initialize all interactive elements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize existing interactive elements
  initializeBasicInteractions();
  
  // Add enhanced workflow diagrams
  const workflowSteps = [
    { x: 30, y: 20 },
    { x: 60, y: 50 },
    { x: 40, y: 80 },
    { x: 70, y: 30 }
  ];
  
  // Add workflow diagrams to each diagram container
  document.querySelectorAll('.diagram-container').forEach((container, index) => {
    container.id = `diagram-${index}`;
    createWorkflowSVG(`diagram-${index}`, workflowSteps);
  });
  
  // Add architecture diagram connections
  const architectureDiagram = document.querySelector('.architecture-diagram');
  if (architectureDiagram) {
    architectureDiagram.id = 'architecture-diagram';
    createArchitectureSVG('architecture-diagram');
  }
  
  // Enhance roadmap timeline
  enhanceRoadmapTimeline();
  
  // Enhance business model section
  enhanceBusinessModel();
  
  // Add touch device detection
  addTouchDeviceSupport();
});

// Initialize basic interactions
function initializeBasicInteractions() {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }
  
  // Smooth Scrolling for Navigation Links
  const navLinks = document.querySelectorAll('nav a, .footer-column a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId.startsWith('#') && targetId.length > 1) {
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
          }
        }
      }
    });
  });
  
  // Tab System
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      this.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const accordionItem = this.parentElement;
      
      // Toggle active class on clicked item
      accordionItem.classList.toggle('active');
      
      // Close other accordion items (optional)
      const allAccordionItems = document.querySelectorAll('.accordion-item');
      allAccordionItems.forEach(item => {
        if (item !== accordionItem) {
          item.classList.remove('active');
        }
      });
    });
  });
  
  // Interactive Components
  const components = document.querySelectorAll('.component');
  
  components.forEach(component => {
    component.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  });
  
  // Scroll Animation
  const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  
  function checkScroll() {
    fadeElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.9) {
        element.classList.add('visible');
      }
    });
  }
  
  // Check elements on initial load
  checkScroll();
  
  // Check elements on scroll
  window.addEventListener('scroll', checkScroll);
  
  // Hotspots and Tooltips
  const hotspots = document.querySelectorAll('.hotspot');
  
  hotspots.forEach(hotspot => {
    hotspot.addEventListener('mouseenter', function() {
      const tooltip = this.nextElementSibling;
      if (tooltip && tooltip.classList.contains('tooltip')) {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
      }
    });
    
    hotspot.addEventListener('mouseleave', function() {
      const tooltip = this.nextElementSibling;
      if (tooltip && tooltip.classList.contains('tooltip')) {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
      }
    });
  });
}

// Add touch device support
function addTouchDeviceSupport() {
  if ('ontouchstart' in window) {
    // Add touch support for hotspots
    const hotspots = document.querySelectorAll('.hotspot');
    
    hotspots.forEach(hotspot => {
      hotspot.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const tooltip = this.nextElementSibling;
        
        // Hide all other tooltips
        document.querySelectorAll('.tooltip').forEach(t => {
          if (t !== tooltip) {
            t.style.opacity = '0';
            t.style.visibility = 'hidden';
          }
        });
        
        // Toggle current tooltip
        if (tooltip && tooltip.classList.contains('tooltip')) {
          if (tooltip.style.visibility === 'visible') {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
          } else {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
          }
        }
      });
    });
    
    // Close tooltips when touching elsewhere
    document.addEventListener('touchstart', function(e) {
      if (!e.target.closest('.hotspot') && !e.target.closest('.tooltip')) {
        document.querySelectorAll('.tooltip').forEach(tooltip => {
          tooltip.style.opacity = '0';
          tooltip.style.visibility = 'hidden';
        });
      }
    });
    
    // Add touch-specific styles
    const style = document.createElement('style');
    style.textContent = `
      .hotspot {
        width: 40px !important;
        height: 40px !important;
      }
      
      .tooltip {
        padding: 20px !important;
      }
      
      .tab-button {
        padding: 15px 20px !important;
      }
      
      .accordion-header {
        padding: 25px 20px !important;
      }
      
      .component {
        padding: 25px !important;
      }
    `;
    
    document.head.appendChild(style);
  }
}
