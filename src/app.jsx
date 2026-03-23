import React, { useMemo, useState } from 'react';

export default function App() {
const [inputs, setInputs] = useState({
topLevelPart: 'TOP-1001',
componentPart: 'COMP-2207',
sellPrice: 6023.4,
currentTotalCost: 2784.69,
currentComponentCost: 185.0,
newComponentCost: 245.0,
qtyPerAssembly: 1,
annualVolume: 100,
targetMarginPct: 53.8,
});

const setField = (field, value) => {
setInputs((prev) => ({ ...prev, [field]: value }));
};

const currency = (value) =>
new Intl.NumberFormat('en-GB', {
style: 'currency',
currency: 'GBP',
}).format(Number.isFinite(value) ? value : 0);

const pct = (value) => `${(Number.isFinite(value) ? value : 0).toFixed(1)}%`;

const results = useMemo(() => {
const sellPrice = Number(inputs.sellPrice) || 0;
const currentTotalCost = Number(inputs.currentTotalCost) || 0;
const currentComponentCost = Number(inputs.currentComponentCost) || 0;
const newComponentCost = Number(inputs.newComponentCost) || 0;
const qtyPerAssembly = Number(inputs.qtyPerAssembly) || 0;
const annualVolume = Number(inputs.annualVolume) || 0;
const targetMarginPct = (Number(inputs.targetMarginPct) || 0) / 100;

```
const componentIncreaseEach = newComponentCost - currentComponentCost;
const costIncreasePerTopLevel = componentIncreaseEach * qtyPerAssembly;
const newTotalCost = currentTotalCost + costIncreasePerTopLevel;

const currentProfitPerUnit = sellPrice - currentTotalCost;
const newProfitPerUnit = sellPrice - newTotalCost;

const currentMarginPct = (currentProfitPerUnit / sellPrice) * 100;
const newMarginPct = (newProfitPerUnit / sellPrice) * 100;

const annualProfitImpact = costIncreasePerTopLevel * annualVolume;
const requiredSellPrice = newTotalCost / (1 - targetMarginPct);

return {
  costIncreasePerTopLevel,
  newTotalCost,
  currentProfitPerUnit,
  newProfitPerUnit,
  currentMarginPct,
  newMarginPct,
  annualProfitImpact,
  requiredSellPrice,
};
```

}, [inputs]);

return (
<div style={{ fontFamily: 'Arial', padding: 20 }}> <h1>LeanProcure Margin Impact Calculator</h1>

```
  <h2>Inputs</h2>

  <div>
    <label>Sell Price: </label>
    <input type="number" value={inputs.sellPrice}
      onChange={(e) => setField('sellPrice', e.target.value)} />
  </div>

  <div>
    <label>Current Total Cost: </label>
    <input type="number" value={inputs.currentTotalCost}
      onChange={(e) => setField('currentTotalCost', e.target.value)} />
  </div>

  <div>
    <label>Current Component Cost: </label>
    <input type="number" value={inputs.currentComponentCost}
      onChange={(e) => setField('currentComponentCost', e.target.value)} />
  </div>

  <div>
    <label>New Component Cost: </label>
    <input type="number" value={inputs.newComponentCost}
      onChange={(e) => setField('newComponentCost', e.target.value)} />
  </div>

  <div>
    <label>Qty per Assembly: </label>
    <input type="number" value={inputs.qtyPerAssembly}
      onChange={(e) => setField('qtyPerAssembly', e.target.value)} />
  </div>

  <div>
    <label>Annual Volume: </label>
    <input type="number" value={inputs.annualVolume}
      onChange={(e) => setField('annualVolume', e.target.value)} />
  </div>

  <h2>Results</h2>

  <p>Current Profit / Unit: £{results.currentProfitPerUnit.toFixed(2)}</p>
  <p>New Profit / Unit: £{results.newProfitPerUnit.toFixed(2)}</p>
  <p>Current Margin: {results.currentMarginPct.toFixed(1)}%</p>
  <p>New Margin: {results.newMarginPct.toFixed(1)}%</p>
  <p>Cost Increase per Unit: £{results.costIncreasePerTopLevel.toFixed(2)}</p>
  <p>Annual Impact: £{results.annualProfitImpact.toFixed(2)}</p>
  <p>Required Sell Price: £{results.requiredSellPrice.toFixed(2)}</p>
</div>
```

);
}
