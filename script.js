// JavaScript for Fund Operating Model Visualization

document.addEventListener('DOMContentLoaded', function() {
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
                    if (navMenu.classList.contains('active')) {
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
    
    // For touch devices
    if ('ontouchstart' in window) {
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
    }
    
    // Create SVG diagrams for workflow visualization
    createWorkflowDiagrams();
    
    // Create architecture diagram connections
    createArchitectureDiagrams();
});

// Function to create workflow diagrams
function createWorkflowDiagrams() {
    const diagramContainers = document.querySelectorAll('.diagram-container');
    
    diagramContainers.forEach(container => {
        // Add SVG background elements or connections as needed
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.zIndex = "1";
        
        // Add connection lines between hotspots
        const hotspots = container.querySelectorAll('.hotspot');
        if (hotspots.length > 1) {
            for (let i = 0; i < hotspots.length - 1; i++) {
                const hotspot1 = hotspots[i];
                const hotspot2 = hotspots[i + 1];
                
                const x1 = parseInt(hotspot1.style.left) + 15;
                const y1 = parseInt(hotspot1.style.top) + 15;
                const x2 = parseInt(hotspot2.style.left) + 15;
                const y2 = parseInt(hotspot2.style.top) + 15;
                
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", x1 + "%");
                line.setAttribute("y1", y1 + "%");
                line.setAttribute("x2", x2 + "%");
                line.setAttribute("y2", y2 + "%");
                line.setAttribute("stroke", "#009e49");
                line.setAttribute("stroke-width", "2");
                line.setAttribute("stroke-dasharray", "5,5");
                
                svg.appendChild(line);
            }
        }
        
        // Insert SVG before other elements
        container.insertBefore(svg, container.firstChild);
    });
}

// Function to create architecture diagram connections
function createArchitectureDiagrams() {
    const architectureLayers = document.querySelectorAll('.architecture-layer');
    
    // Add connecting lines between layers
    if (architectureLayers.length > 1) {
        for (let i = 0; i < architectureLayers.length - 1; i++) {
            const currentLayer = architectureLayers[i];
            const nextLayer = architectureLayers[i + 1];
            
            const currentComponents = currentLayer.querySelectorAll('.component');
            const nextComponents = nextLayer.querySelectorAll('.component');
            
            if (currentComponents.length > 0 && nextComponents.length > 0) {
                // Create SVG container for connections
                const connectionSvg = document.createElement('div');
                connectionSvg.classList.add('layer-connections');
                connectionSvg.style.position = 'relative';
                connectionSvg.style.height = '40px';
                connectionSvg.style.margin = '-20px 0';
                connectionSvg.style.zIndex = '1';
                
                // Insert connection container
                nextLayer.parentNode.insertBefore(connectionSvg, nextLayer);
                
                // Add visual indicator for connections
                const indicator = document.createElement('div');
                indicator.style.position = 'absolute';
                indicator.style.left = '50%';
                indicator.style.top = '50%';
                indicator.style.transform = 'translate(-50%, -50%)';
                indicator.style.width = '30px';
                indicator.style.height = '30px';
                indicator.style.borderRadius = '50%';
                indicator.style.backgroundColor = 'var(--uae-red)';
                indicator.style.display = 'flex';
                indicator.style.alignItems = 'center';
                indicator.style.justifyContent = 'center';
                indicator.style.color = 'white';
                indicator.style.fontSize = '20px';
                indicator.innerHTML = '<i class="fas fa-arrow-down"></i>';
                
                connectionSvg.appendChild(indicator);
            }
        }
    }
}
