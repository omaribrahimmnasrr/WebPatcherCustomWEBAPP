

//====================================================================================
//====================================================================================
//===================================================================================

// merged-vulnerable.js
// --------------------
// Merged: original safe functionality + deliberate XSS sinks for testing.
// WARNING: intentionally insecure bits are marked VULN-x. Use only on localhost/test lab.

// ---------- Helper: escapeHtml (for safe fixes / comparison) ----------
function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// ---------- Original API Functions (unchanged logic) ----------
async function testAPI() {
    try {
        const response = await fetch('/api/hello');
        const data = await response.json();
        alert(`Server Response: ${data.message}\nTimestamp: ${data.timestamp}`);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to server. Make sure the server is running.');
    }
}

async function fetchData() {
    const responseBox = document.getElementById('api-response');
    responseBox.textContent = 'Loading...';

    try {
        const response = await fetch('/api/hello');
        const data = await response.json();

        // original: safe display
        responseBox.textContent = JSON.stringify(data, null, 2);

        // NOTE: VULN-10: also inject server HTML response unsafely if element exists
        // (deliberate test sink). Server must provide /api/unsafe-html for this to be useful.
        const vulnFetch = document.getElementById('vuln-fetch');
        if (vulnFetch) {
            // intentionally vulnerable for testing: injects server HTML
            fetch('/api/unsafe-html')
              .then(r => r.text())
              .then(html => { vulnFetch.innerHTML = html; })
              .catch(()=>{});
        }

    } catch (error) {
        console.error('Error:', error);
        responseBox.textContent = 'Error: Failed to fetch data from server';
    }
}

// ---------- Original Contact Form Handler (keeps logic) ----------
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const responseBox = document.getElementById('form-response');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                message: formData.get('message')
            };

            // Debug: Log the data being sent
            console.log('Form data being sent:', data);

            // Clear previous response
            responseBox.textContent = 'Sending request...';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    // original safe display
                    responseBox.textContent = result.message;
                    responseBox.style.color = '#00b894';
                    responseBox.style.borderColor = '#00b894';
                    contactForm.reset();

                    // VULN-11: if a vulnerable display element exists, also inject result.message unsafely
                    // (keeps original behavior + testing sink)
                    const vulnAfter = document.getElementById('vuln-after-contact');
                    if (vulnAfter) vulnAfter.innerHTML = result.message; // VULN: innerHTML
                } else {
                    responseBox.textContent = result.error || 'An error occurred';
                    responseBox.style.color = '#e17055';
                    responseBox.style.borderColor = '#e17055';
                }
            } catch (error) {
                console.error('Error:', error);
                responseBox.textContent = 'Error: Failed to send message. Please try again.';
                responseBox.style.color = '#e17055';
                responseBox.style.borderColor = '#e17055';
            }
        });
    }
});

// ---------- Smooth scrolling (original) ----------
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});

// ---------- Button loading + click animations (original) ----------
function addButtonLoading(button) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;

    return function() {
        button.textContent = originalText;
        button.disabled = false;
    };
}

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    });
});

// ---------- Form validation enhancement (original) ----------
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#e17055';
            } else {
                this.style.borderColor = '#e9ecef';
            }
        });

        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(225, 112, 85)') {
                this.style.borderColor = '#e9ecef';
            }
        });
    });
});

// ---------- ========== DELIBERATE VULNERABLE SINKS (XSS lab) ========== ----------
// These are added on top of the original behavior. Elements are optional and must be present
// in the page for the sink to be active. IDs used: vuln-reflected, vuln-hash, vuln-list,
// vuln-docwrite, vuln-link, vuln-iframe, vuln-btn, vuln-eval, vuln-timeout, vuln-fetch,
// vuln-template, vuln-storage, vuln-after-contact

document.addEventListener('DOMContentLoaded', () => {

  // VULN-1: reflected XSS via URL parameter 'name'
  (function reflectedInnerHTML() {
    const name = (new URLSearchParams(location.search)).get('name');
    const out = document.getElementById('vuln-reflected');
    if (out && name !== null) {
      // VULN: unescaped innerHTML
      out.innerHTML = `<div>Reflected: ${name}</div>`;
    }
  })();

  // VULN-2: fragment/hash DOM XSS — writes location.hash
  (function hashXSS() {
    const frag = location.hash.substring(1);
    const out = document.getElementById('vuln-hash');
    if (out && frag) {
      out.innerHTML = frag; // VULN
    }
  })();

  // VULN-3: insertAdjacentHTML using 'item' param
  (function listInsert() {
    const list = document.getElementById('vuln-list');
    const userItem = (new URLSearchParams(location.search)).get('item');
    if (list && userItem !== null) {
      list.insertAdjacentHTML('beforeend', `<li>${userItem}</li>`); // VULN
    }
  })();

  // VULN-4: document.write via 'write' param (only active on page load)
  (function docWrite() {
    const w = (new URLSearchParams(location.search)).get('write');
    if (w) {
      // NOTE: document.write will overwrite document if run after load in some browsers.
      // This is intentionally dangerous for testing only.
      try { document.write(w); } catch(e) {}
    }
  })();

  // VULN-5: set href directly (javascript: scheme)
  (function linkHref() {
    const l = document.getElementById('vuln-link');
    const link = (new URLSearchParams(location.search)).get('link');
    if (l && link) {
      l.href = link; // VULN: attacker can set javascript: payload
      l.textContent = "VULN: click me";
    }
  })();

  // VULN-6: iframe srcdoc injection via 'iframeDoc' param
  (function iframeSrcdoc() {
    const f = document.getElementById('vuln-iframe');
    const doc = (new URLSearchParams(location.search)).get('iframeDoc');
    if (f && doc) {
      f.srcdoc = doc; // VULN
    }
  })();

  // VULN-7: setAttribute onclick from 'onclickCode'
  (function setAttributeOnclick() {
    const btn = document.getElementById('vuln-btn');
    const code = (new URLSearchParams(location.search)).get('onclickCode');
    if (btn && code) {
      btn.setAttribute('onclick', code); // VULN
    }
  })();

  // VULN-8: eval / new Function via 'eval' param
  (function evalDanger() {
    const script = (new URLSearchParams(location.search)).get('eval');
    const out = document.getElementById('vuln-eval');
    if (script && out) {
      try {
        // intentionally dangerous for testing
        eval(script); // VULN
        // (new Function(script))();
      } catch(e) {
        out.textContent = 'eval error';
      }
    }
  })();

  // VULN-9: setTimeout with string via 'timeout' param
  (function timeoutString() {
    const code = (new URLSearchParams(location.search)).get('timeout');
    const out = document.getElementById('vuln-timeout');
    if (code && out) {
      // runs attacker string after 1s
      try { setTimeout(code, 1000); } catch(e) { out.textContent = 'timeout error'; }
    }
  })();

  // VULN-10: fetch inject already handled inside fetchData() above — this is here as fallback
  // (fetchData sets vuln-fetch to server HTML). No extra code needed.

  // VULN-11: template render injection (title param)
  (function templateRender() {
    const title = (new URLSearchParams(location.search)).get('title');
    const container = document.getElementById('vuln-template');
    if (container && title !== null) {
      const tpl = `<article class="card"><h2>${title}</h2><p>Content</p></article>`; // VULN
      container.innerHTML = tpl;
    }
  })();

  // VULN-12: cookie/localStorage injection
  (function storageInject() {
    const out = document.getElementById('vuln-storage');
    if (out) {
      const cookieVal = (document.cookie || '').split('=')[1] || '';
      const ls = localStorage.getItem('userContent') || '';
      out.innerHTML = cookieVal + ls; // VULN
    }
  })();

}); // end DOMContentLoaded for vuln sinks

// ---------- ========== ENHANCED INTERACTIVITY ========== ----------
// Additional JavaScript to ensure every element is properly linked

document.addEventListener('DOMContentLoaded', function() {
    
    // Add click handlers for all buttons that don't have onclick
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        if (!button.getAttribute('onclick') && !button.hasAttribute('data-handled')) {
            button.addEventListener('click', function() {
                console.log(`Button clicked: ${button.textContent}`);
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                this.style.backgroundColor = '#1e6bb8';
                
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.backgroundColor = '';
                }, 150);
                
                // Show alert for unhandled buttons
                if (!button.classList.contains('btn-primary') && !button.classList.contains('btn-secondary')) {
                    alert(`Button "${button.textContent}" clicked! Add functionality as needed.`);
                }
            });
            button.setAttribute('data-handled', 'true');
        }
    });

    // Enhanced form input interactions
    const allInputs = document.querySelectorAll('input, textarea');
    allInputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
            this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#e9ecef';
            this.style.boxShadow = 'none';
        });
        
        // Add input validation feedback
        input.addEventListener('input', function() {
            // Basic input validation feedback
            if (this.hasAttribute('required') && this.value.trim()) {
                this.style.borderColor = '#00b894';
            }
        });
    });

    // Add hover effects for all interactive elements
    const interactiveElements = document.querySelectorAll('button, input, textarea, a, .box');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (!this.style.transition) {
                this.style.transition = 'all 0.2s ease';
            }
        });
    });

    // Create dynamic content for demonstration
    createDemoContent();
    
    // Add keyboard navigation
    addKeyboardNavigation();
    
    // Monitor URL changes for real-time vulnerability testing
    monitorURLChanges();
    
    // Add interactive vulnerability demos
    createVulnerabilityDemos();
});

// Function to create dynamic demo content
function createDemoContent() {
    const demoSection = document.createElement('section');
    demoSection.className = 'box';
    demoSection.innerHTML = `
        <h2>Interactive Demo Controls</h2>
        <div style="margin-bottom: 16px;">
            <button class="btn" onclick="addRandomItem()">Add Random List Item</button>
            <button class="btn" onclick="clearAllVulnElements()">Clear All Vulnerable Elements</button>
            <button class="btn" onclick="showURLParams()">Show Current URL Parameters</button>
        </div>
        <div id="demo-controls-response" style="padding: 12px; border: 1px solid #eee; border-radius: 6px; margin-top: 12px; min-height: 40px; font-family: monospace; font-size: 12px;">
            Demo controls ready. Use buttons above to test functionality.
        </div>
    `;
    
    // Insert after the last section
    const lastSection = document.querySelector('section:last-of-type');
    lastSection.parentNode.insertBefore(demoSection, lastSection.nextSibling);
}

// Add random item to vulnerable list
function addRandomItem() {
    const list = document.getElementById('vuln-list');
    if (list) {
        const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];
        const randomItem = items[Math.floor(Math.random() * items.length)];
        list.insertAdjacentHTML('beforeend', `<li>Random: ${randomItem}</li>`);
        
        const response = document.getElementById('demo-controls-response');
        if (response) {
            response.textContent = `Added random item: ${randomItem}`;
        }
    }
}

// Clear all vulnerable elements
function clearAllVulnElements() {
    const vulnElements = [
        'vuln-reflected', 'vuln-hash', 'vuln-eval', 'vuln-timeout',
        'vuln-fetch', 'vuln-template', 'vuln-storage', 'vuln-after-contact'
    ];
    
    vulnElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '';
        }
    });
    
    const list = document.getElementById('vuln-list');
    if (list) {
        list.innerHTML = '';
    }
    
    const response = document.getElementById('demo-controls-response');
    if (response) {
        response.textContent = 'All vulnerable elements cleared.';
    }
}

// Show current URL parameters
function showURLParams() {
    const params = new URLSearchParams(location.search);
    const hash = location.hash;
    
    let paramText = 'URL Parameters:\n';
    for (const [key, value] of params) {
        paramText += `${key}: ${value}\n`;
    }
    
    if (hash) {
        paramText += `\nHash: ${hash}`;
    }
    
    const response = document.getElementById('demo-controls-response');
    if (response) {
        response.textContent = paramText || 'No URL parameters found.';
    } else {
        console.log(paramText);
    }
}

// Add keyboard navigation
function addKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Alt + 1: Focus first button
        if (e.altKey && e.key === '1') {
            e.preventDefault();
            const firstButton = document.querySelector('.btn');
            if (firstButton) firstButton.focus();
        }
        
        // Alt + 2: Focus contact form
        if (e.altKey && e.key === '2') {
            e.preventDefault();
            const nameInput = document.querySelector('input[name="name"]');
            if (nameInput) nameInput.focus();
        }
        
        // Alt + 3: Show help
        if (e.altKey && e.key === '3') {
            e.preventDefault();
            showKeyboardHelp();
        }
        
        // Escape: Clear all vulnerable elements
        if (e.key === 'Escape') {
            clearAllVulnElements();
        }
    });
}

// Show keyboard help
function showKeyboardHelp() {
    const helpText = `
Keyboard Shortcuts:
Alt + 1: Focus first button
Alt + 2: Focus contact form
Alt + 3: Show this help
Escape: Clear vulnerable elements

Vulnerability Testing URLs:
?name=<script>alert('XSS')</script>
?item=<img src=x onerror=alert('XSS')>
?link=javascript:alert('XSS')
?onclickCode=alert('XSS')
?eval=alert('XSS')
?timeout=alert('XSS')
?title=<script>alert('XSS')</script>
#<script>alert('XSS')</script>
    `.trim();
    
    const response = document.getElementById('demo-controls-response');
    if (response) {
        response.textContent = helpText;
    } else {
        alert(helpText);
    }
}

// Monitor URL changes for real-time testing
function monitorURLChanges() {
    let lastURL = location.href;
    
    setInterval(() => {
        if (location.href !== lastURL) {
            lastURL = location.href;
            console.log('URL changed:', location.href);
            
            // Re-run vulnerability checks
            setTimeout(() => {
                // Re-trigger all vulnerability functions
                triggerVulnerabilityChecks();
            }, 100);
        }
    }, 500);
}

// Re-trigger vulnerability checks
function triggerVulnerabilityChecks() {
    // VULN-1: reflected XSS
    const name = (new URLSearchParams(location.search)).get('name');
    const reflected = document.getElementById('vuln-reflected');
    if (reflected && name !== null) {
        reflected.innerHTML = `<div>Reflected: ${name}</div>`;
    }
    
    // VULN-2: hash XSS
    const frag = location.hash.substring(1);
    const hash = document.getElementById('vuln-hash');
    if (hash && frag) {
        hash.innerHTML = frag;
    }
    
    // VULN-3: list insertion
    const list = document.getElementById('vuln-list');
    const userItem = (new URLSearchParams(location.search)).get('item');
    if (list && userItem !== null && !list.querySelector(`li:contains("${userItem}")`)) {
        list.insertAdjacentHTML('beforeend', `<li>${userItem}</li>`);
    }
    
    // VULN-11: template render
    const title = (new URLSearchParams(location.search)).get('title');
    const template = document.getElementById('vuln-template');
    if (template && title !== null) {
        template.innerHTML = `<article class="card"><h2>${title}</h2><p>Content</p></article>`;
    }
}

// Create interactive vulnerability demos
function createVulnerabilityDemos() {
    const demoSection = document.createElement('section');
    demoSection.className = 'box';
    demoSection.innerHTML = `
        <h2>Quick Vulnerability Tests</h2>
        <p>Click these buttons to quickly test different vulnerability types:</p>
        <div style="margin: 16px 0; display: flex; flex-wrap: wrap; gap: 8px;">
            <button class="btn" onclick="testReflectedXSS()">Test Reflected XSS</button>
            <button class="btn" onclick="testHashXSS()">Test Hash XSS</button>
            <button class="btn" onclick="testListInjection()">Test List Injection</button>
            <button class="btn" onclick="testTemplateInjection()">Test Template Injection</button>
            <button class="btn" onclick="testLinkInjection()">Test Link Injection</button>
            <button class="btn" onclick="testEvalInjection()">Test Eval Injection</button>
            <button class="btn" onclick="testTimeoutInjection()">Test Timeout Injection</button>
        </div>
        <div id="vuln-test-response" style="padding: 12px; border: 1px solid #eee; border-radius: 6px; margin-top: 12px; min-height: 40px; font-family: monospace; font-size: 12px;">
            Click buttons above to test vulnerabilities. Check browser console for results.
        </div>
    `;
    
    // Insert after the demo controls section
    const lastSection = document.querySelector('section:last-of-type');
    lastSection.parentNode.insertBefore(demoSection, lastSection.nextSibling);
}

// Vulnerability test functions
function testReflectedXSS() {
    const url = new URL(location.href);
    url.searchParams.set('name', '<script>alert("Reflected XSS Test")</script>');
    location.href = url.toString();
}

function testHashXSS() {
    location.hash = '<script>alert("Hash XSS Test")</script>';
}

function testListInjection() {
    const url = new URL(location.href);
    url.searchParams.set('item', '<img src=x onerror=alert("List Injection Test")>');
    location.href = url.toString();
}

function testTemplateInjection() {
    const url = new URL(location.href);
    url.searchParams.set('title', '<script>alert("Template Injection Test")</script>');
    location.href = url.toString();
}

function testLinkInjection() {
    const url = new URL(location.href);
    url.searchParams.set('link', 'javascript:alert("Link Injection Test")');
    location.href = url.toString();
}

function testEvalInjection() {
    const url = new URL(location.href);
    url.searchParams.set('eval', 'alert("Eval Injection Test")');
    location.href = url.toString();
}

function testTimeoutInjection() {
    const url = new URL(location.href);
    url.searchParams.set('timeout', 'alert("Timeout Injection Test")');
    location.href = url.toString();
}

// Add window resize handler for responsive testing
window.addEventListener('resize', function() {
    console.log(`Window resized to: ${window.innerWidth}x${window.innerHeight}`);
});

// Add page visibility change handler
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Add scroll handler for dynamic content loading
window.addEventListener('scroll', function() {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercent > 80) {
        // Could add lazy loading or dynamic content here
        console.log('Near bottom of page');
    }
});

// Export functions for global access
window.addRandomItem = addRandomItem;
window.clearAllVulnElements = clearAllVulnElements;
window.showURLParams = showURLParams;
window.showKeyboardHelp = showKeyboardHelp;
window.testReflectedXSS = testReflectedXSS;
window.testHashXSS = testHashXSS;
window.testListInjection = testListInjection;
window.testTemplateInjection = testTemplateInjection;
window.testLinkInjection = testLinkInjection;
window.testEvalInjection = testEvalInjection;
window.testTimeoutInjection = testTimeoutInjection;