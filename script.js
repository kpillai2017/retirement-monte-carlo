const N_SIMS = 1000, YEARS = 30;

// Market Assumptions (Updated for 2026 contexts)
const VAS_MU=0.080, VAS_SD=0.16, VAS_YIELD=0.042, FRANKING=0.75*(30/70); 
const VGS_MU=0.072, VGS_SD=0.17, VGS_YIELD=0.019;
const VAF_MU=0.038, VAF_SD=0.058;
const BILL_MU=0.041, BILL_SD=0.003; // iShares Core Cash ETF
const CPI_SD=0.015, CORR_EQ_BOND = 0.05;

let fanChart;

function balanceAllocations(changedId) {
    const ids = ['sl-vas', 'sl-vgs', 'sl-vaf'];
    const otherIds = ids.filter(id => id !== changedId);
    
    let valChanged = parseFloat(document.getElementById(changedId).value);
    let valOther1 = parseFloat(document.getElementById(otherIds[0]).value);
    let valOther2 = parseFloat(document.getElementById(otherIds[1]).value);

    let totalOthers = valOther1 + valOther2;
    let targetOthers = 100 - valChanged;

    if (totalOthers > 0) {
        let ratio1 = valOther1 / totalOthers;
        let ratio2 = valOther2 / totalOthers;
        document.getElementById(otherIds[0]).value = (targetOthers * ratio1).toFixed(0);
        document.getElementById(otherIds[1]).value = (targetOthers * ratio2).toFixed(0);
    } else {
        document.getElementById(otherIds[0]).value = (targetOthers / 2).toFixed(0);
        document.getElementById(otherIds[1]).value = (targetOthers / 2).toFixed(0);
    }
}

function randn() {
    let u=0, v=0;
    while(u===0) u=Math.random();
    while(v===0) v=Math.random();
    return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
}

function runSim(portTotal, bStart, bEnd, bN, spendStart, vasP, vgsP, vafP, floorLimit, ceilLimit, forceSOR, sStart, sDur, cpiMean) {
    let results = [];
    let ruinCount = 0;
    
    for(let s=0; s<N_SIMS; s++) {
        let currentSpend = spendStart;
        let billBuffer = spendStart * bStart;
        let invPortfolio = portTotal - billBuffer;
        let realPath = [], cumulativeCPI = 1.0, ruined = false;

        for(let y=0; y<YEARS; y++) {
            const z1=randn(), z2=randn(), z3=randn(), zB = CORR_EQ_BOND*z1 + Math.sqrt(1-CORR_EQ_BOND**2)*z2;
            const cpi = Math.max(0, cpiMean + CPI_SD * randn());
            cumulativeCPI *= (1 + cpi);
            
            let targetBufferYears = (y < bN) ? (bStart + (y * (bEnd - bStart) / bN)) : bEnd;
            const inSORR = forceSOR && (y >= (sStart - 1)) && (y < (sStart - 1 + sDur));

            let vRet = inSORR ? -0.15 : (VAS_MU + VAS_SD*z1);
            let gRet = inSORR ? -0.15 : (VGS_MU + VGS_SD*z1);
            let bRet = VAF_MU + VAF_SD*zB;
            let billRet = BILL_MU + BILL_SD*z3;

            invPortfolio += invPortfolio * ( (vasP*vRet) + (vgsP*gRet) + (vafP*bRet) );
            invPortfolio += invPortfolio * ( (vasP*VAS_YIELD*(1+FRANKING)) + (vgsP*VGS_YIELD) );
            billBuffer *= (1 + billRet);

            let annualDraw = currentSpend * cumulativeCPI;
            if (vRet < 0 || gRet < 0) {
                currentSpend = Math.max(floorLimit, currentSpend * 0.95);
            } else if (invPortfolio > portTotal * cumulativeCPI) {
                currentSpend = Math.min(ceilLimit, currentSpend * 1.05);
            }

            if (billBuffer >= annualDraw) {
                billBuffer -= annualDraw;
            } else {
                invPortfolio -= (annualDraw - billBuffer);
                billBuffer = 0;
            }

            let targetAmt = annualDraw * targetBufferYears;
            if (billBuffer < targetAmt && !inSORR && (vRet > 0)) {
                let refill = Math.min(invPortfolio * 0.1, targetAmt - billBuffer);
                invPortfolio -= refill;
                billBuffer += refill;
            }

            let total = invPortfolio + billBuffer;
            if (total <= 0) { ruined = true; total = 0; }
            realPath.push(total / cumulativeCPI); 
        }
        if(ruined) ruinCount++;
        results.push(realPath);
    }
    return {results, ruinRate: (ruinCount/N_SIMS)*100};
}

function update(e) {
    // 1. Dynamic Guardrail: Ceiling min must be Floor value
    const floorEl = document.getElementById('sl-floor');
    const ceilEl = document.getElementById('sl-ceil');
    
    ceilEl.min = floorEl.value; 
    if (parseFloat(ceilEl.value) < parseFloat(floorEl.value)) {
        ceilEl.value = floorEl.value;
    }
    if (e && e.target.classList.contains('alloc-sl')) {
        balanceAllocations(e.target.id);
    }

    // Toggle SOR Sliders
    const sorEnabled = document.getElementById('tg-sor').checked;
    const sorContainer = document.getElementById('sor-controls');
    const sorInputs = sorContainer.querySelectorAll('input');

    if (sorEnabled) {
        sorContainer.classList.remove('disabled-ctrl');
        sorInputs.forEach(i => i.disabled = false);
    } else {
        sorContainer.classList.add('disabled-ctrl');
        sorInputs.forEach(i => i.disabled = true);
    }

    const port = parseFloat(document.getElementById('sl-port').value);
    const bStart = parseFloat(document.getElementById('sl-buf-start').value);
    const bEnd = parseFloat(document.getElementById('sl-buf-end').value);
    const bN = parseInt(document.getElementById('sl-buf-n').value);
    const spend = parseFloat(document.getElementById('sl-spend').value);
    const floor = parseFloat(document.getElementById('sl-floor').value);
    const ceil = parseFloat(document.getElementById('sl-ceil').value);
    const vas = parseFloat(document.getElementById('sl-vas').value);
    const vgs = parseFloat(document.getElementById('sl-vgs').value);
    const vaf = parseFloat(document.getElementById('sl-vaf').value);
    const sor = document.getElementById('tg-sor').checked;
    const sStart = parseInt(document.getElementById('sl-sor-start').value);
    const sDur = parseInt(document.getElementById('sl-sor-dur').value);
    const cpi = parseFloat(document.getElementById('sl-cpi').value)/100;

    document.getElementById('vl-port').innerText = `$${(port/1e6).toFixed(2)}M`;
    document.getElementById('vl-buf-start').innerText = bStart.toFixed(1);
    document.getElementById('vl-buf-end').innerText = bEnd.toFixed(1);
    document.getElementById('vl-buf-n').innerText = bN + 'y';
    document.getElementById('vl-spend').innerText = `$${(spend/1000)}k`;
    document.getElementById('vl-floor').innerText = `$${(floor/1000)}k`;
    document.getElementById('vl-ceil').innerText = `$${(ceil/1000)}k`;
    document.getElementById('vl-sor-start').innerText = `Yr ${sStart}`;
    document.getElementById('vl-sor-dur').innerText = sDur + 'y';
    document.getElementById('vl-cpi').innerText = (cpi*100).toFixed(1) + '%';
    document.getElementById('vl-vas').innerText = vas + '%';
    document.getElementById('vl-vgs').innerText = vgs + '%';
    document.getElementById('vl-vaf').innerText = vaf + '%';
    document.getElementById('vl-total').innerText = (vas + vgs + vaf) + '%';

    const {results, ruinRate} = runSim(port, bStart, bEnd, bN, spend, vas/100, vgs/100, vaf/100, floor, ceil, sor, sStart, sDur, cpi);
    renderCharts(results, ruinRate);
}

function renderCharts(results, ruinRate) {
    const labels = Array.from({length:YEARS}, (_,i)=>i+1);
    const pct = (arr, p) => {
        const sorted = [...arr].sort((a,b)=>a-b);
        return sorted[Math.floor(p * (sorted.length-1))];
    };
    const p50 = labels.map(y => pct(results.map(r=>r[y-1]), 0.5));
    const p10 = labels.map(y => pct(results.map(r=>r[y-1]), 0.1));
    const p90 = labels.map(y => pct(results.map(r=>r[y-1]), 0.9));

    if(fanChart) fanChart.destroy();
    fanChart = new Chart(document.getElementById('c-fan'), {
        type:'line',
        data: {
            labels,
            datasets: [
                {label:'90th Percentile', data:p90, borderColor:'#1D9E75', fill:false, pointRadius:0},
                {label:'Median (Today\'s Value)', data:p50, borderColor:'#378ADD', fill:false, pointRadius:0, borderWidth: 3},
                {label:'10th Percentile', data:p10, borderColor:'#E24B4A', fill:false, pointRadius:0}
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, // CRITICAL FIX: Allows chart to fill container height
            scales: { 
                y: { 
                    beginAtZero: true,
                    ticks: { callback: v => '$'+(v/1e6).toFixed(1)+'M' } 
                } 
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    });

    document.getElementById('scenarios').innerHTML = `
        <div class="sc-card">
            <div class="sc-title">Real Outcomes</div>
            <div class="sc-row"><span>Risk of Ruin</span><span style="color:${ruinRate > 5 ? '#E24B4A':'#1D9E75'}; font-weight:bold">${ruinRate.toFixed(1)}%</span></div>
            <div class="sc-row"><span>Median End Value</span><span>$${(p50[29]/1e6).toFixed(2)}M</span></div>
        </div>
    `;
}

document.querySelectorAll('input').forEach(i => i.addEventListener('input', update));
update();
