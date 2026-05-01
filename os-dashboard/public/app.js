const STATES = ['IDLE', 'RESEARCH', 'PLANNING', 'IMPLEMENTATION', 'QUALITY_REVIEW'];
const TRANSITIONS = [
    { from: 'IDLE', to: 'RESEARCH' },
    { from: 'RESEARCH', to: 'PLANNING' },
    { from: 'PLANNING', to: 'IMPLEMENTATION' },
    { from: 'IMPLEMENTATION', to: 'QUALITY_REVIEW' },
    { from: 'QUALITY_REVIEW', to: 'IDLE' },
    { from: 'QUALITY_REVIEW', to: 'IMPLEMENTATION' },
];

async function updateTopology() {
    const stateRes = await fetch('/api/state');
    const stateData = await stateRes.json();
    const currentState = stateData.state_machine.current_state;
    const sessionGraph = stateData.session_graph || [];

    const completedStates = new Set();
    sessionGraph.forEach(entry => {
        // Logic to determine if a state was completed based on event
        if (entry.event === 'EVENT_RESEARCH_COMPLETE') completedStates.add('RESEARCH');
        if (entry.event === 'EVENT_PLAN_APPROVED') completedStates.add('PLANNING');
        if (entry.event === 'EVENT_IMPL_COMPLETE') completedStates.add('IMPLEMENTATION');
        if (entry.event === 'EVENT_GATE_PASSED') completedStates.add('QUALITY_REVIEW');
    });

    renderGraph(currentState, completedStates, stateData);
}

function renderGraph(activeState, completedStates, fullStateData) {
    const svg = document.getElementById('topology-svg');
    if (!svg) return;

    const width = 800;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 150;

    const nodePositions = {};
    STATES.forEach((state, i) => {
        const angle = (i / STATES.length) * 2 * Math.PI;
        nodePositions[state] = {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    });

    let html = `<<defsdefs>
        <<markermarker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <<polygonpolygon points="0 0, 10 3.5, 0 7" fill="#333" />
        </marker>
    </defs>`;

    // Draw Edges
    TRANSITIONS.forEach(trans => {
        const start = nodePositions[trans.from];
        const end = nodePositions[trans.to];
        const isActive = (trans.from === activeState);
        html += `<<lineline x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}"
                 class="edge ${isActive ? 'active' : ''}" />`;
    });

    // Draw Nodes
    STATES.forEach(state => {
        const pos = nodePositions[state];
        const isActive = (state === activeState);
        const isCompleted = completedStates.has(state);
        html += `
            <<gg class="node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
               onclick="showTrace('${state}')">
                <<circlecircle cx="${pos.x}" cy="${pos.y}" r="40" />
                <<texttext x="${pos.x}" y="${pos.y + 5}">${state}</text>
            </g>`;
    });

    svg.innerHTML = html;
}

function showTrace(state) {
    const panel = document.getElementById('trace-panel');
    const title = document.getElementById('trace-title');
    const details = document.getElementById('trace-details');

    panel.classList.add('open');
    title.textContent = `State: ${state}`;

    // Fetch latest data from state for this specific node
    fetch('/api/state').then(res => res.json()).then(data => {
        const relatedEvents = data.session_graph.filter(e =>
            e.event.includes(state) ||
            (state === 'IDLE' && e.event === 'EVENT_GATE_PASSED')
        );

        if (relatedEvents.length === 0) {
            details.innerHTML = '<<pp>No recorded traces for this state in current session.</p>';
            return;
        }

        details.innerHTML = relatedEvents.map(e => `
            <<divdiv class="trace-detail">
                <<spanspan class="trace-label">Timestamp</span>
                <<spanspan class="trace-value">${e.timestamp}</span>
                <<spanspan class="trace-label">Event</span>
                <<spanspan class="trace-value">${e.event}</span>
                <<spanspan class="trace-label">Details</span>
                <<spanspan class="trace-value">${e.description}</span>
            </div>
        `).join('');
    });
}

function closeTrace() {
    document.getElementById('trace-panel').classList.remove('open');
}

// Initial load and periodic update
updateTopology();
setInterval(updateTopology, 5000);
