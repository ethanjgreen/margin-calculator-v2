import React, { useMemo, useState } from 'react';

function NumberInput({ label, value, onChange, prefix, suffix, step = '0.01' }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <div className="relative">
        {prefix ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {prefix}
          </span>
        ) : null}
        <input
          type="number"
          step={step}
          value={value ?? ''}
          onChange={onChange}
          className={`w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 ${
            prefix ? 'pl-8' : ''
          } ${suffix ? 'pr-10' : ''}`}
        />
        {suffix ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <input
        type="text"
        value={value ?? ''}
        onChange={onChange}
        className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
      />
    </label>
  );
}

function MetricCard({ title, value, subtext, tone = 'neutral' }) {
  const toneMap = {
    positive: 'from-emerald-500/20 to-emerald-400/5 border-emerald-500/30',
    warning: 'from-amber-500/20 to-amber-400/5 border-amber-500/30',
    info: 'from-cyan-500/20 to-cyan-400/5 border-cyan-500/30',
    neutral: 'from-slate-700/40 to-slate-800/20 border-slate-700/60',
  };

  return (
    <div className={`rounded-3xl border bg-gradient-to-br p-5 shadow-lg ${toneMap[tone]}`}>
      <div className="text-sm text-slate-300">{title}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
        {value}
      </div>
      {subtext ? <div className="mt-2 text-sm text-slate-400">{subtext}</div> : null}
    </div>
  );
}

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
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const currency = (value) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 2,
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

    const componentIncreaseEach = newComponentCost - currentComponentCost;
    const costIncreasePerTopLevel = componentIncreaseEach * qtyPerAssembly;
    const newTotalCost = currentTotalCost + costIncreasePerTopLevel;

    const currentProfitPerUnit = sellPrice - currentTotalCost;
    const newProfitPerUnit = sellPrice - newTotalCost;

    const currentMarginPct =
      sellPrice > 0 ? (currentProfitPerUnit / sellPrice) * 100 : 0;
    const newMarginPct =
      sellPrice > 0 ? (newProfitPerUnit / sellPrice) * 100 : 0;
    const marginPointChange = newMarginPct - currentMarginPct;

    const annualProfitImpact = costIncreasePerTopLevel * annualVolume;
    const requiredSellPrice =
      targetMarginPct < 1 ? newTotalCost / (1 - targetMarginPct) : 0;
    const sellPriceIncreaseNeeded = requiredSellPrice - sellPrice;

    const fixedCostExcludingThisComponent =
      currentTotalCost - currentComponentCost * qtyPerAssembly;

    const maxAcceptableTotalCost = sellPrice * (1 - targetMarginPct);
    const maxAcceptableComponentCost =
      qtyPerAssembly > 0
        ? (maxAcceptableTotalCost - fixedCostExcludingThisComponent) / qtyPerAssembly
        : 0;

    return {
      componentIncreaseEach,
      costIncreasePerTopLevel,
      newTotalCost,
      currentProfitPerUnit,
      newProfitPerUnit,
      currentMarginPct,
      newMarginPct,
      marginPointChange,
      annualProfitImpact,
      requiredSellPrice,
      sellPriceIncreaseNeeded,
      maxAcceptableComponentCost,
    };
  }, [inputs]);

  const rows = [
    ['Top-level sell price', inputs.sellPrice],
    ['Current total cost', -(Number(inputs.currentTotalCost) || 0)],
    ['Current profit per unit', results.currentProfitPerUnit],
    ['Component increase impact', -results.costIncreasePerTopLevel],
    ['New total cost', -results.newTotalCost],
    ['New profit per unit', results.newProfitPerUnit],
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="overflow-hidden rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl">
          <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.10),_transparent_28%)] px-6 py-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  LeanProcure
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Top-Level Margin Impact Calculator
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                  Built for procurement decisions. See exactly how a component price
                  increase affects top-level profit, margin erosion, annual impact, and
                  the sell price required to recover target margin.
                </p>
              </div>

              <div className="grid gap-3 rounded-3xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300 shadow-xl md:min-w-[290px]">
                <div className="flex items-center justify-between gap-4">
                  <span>Top level</span>
                  <span className="font-semibold text-white">{inputs.topLevelPart}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Component</span>
                  <span className="font-semibold text-white">{inputs.componentPart}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Current margin</span>
                  <span className="font-semibold text-emerald-300">
                    {pct(results.currentMarginPct)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>New margin</span>
                  <span className="font-semibold text-amber-300">
                    {pct(results.newMarginPct)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-[1.05fr,0.95fr] md:p-8">
            <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Inputs</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Enter current top-level economics and the revised component price.
                  </p>
                </div>
                <div className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                  Lean costing
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  label="Top-level part number"
                  value={inputs.topLevelPart}
                  onChange={(e) => setField('topLevelPart', e.target.value)}
                />
                <TextInput
                  label="Component part number"
                  value={inputs.componentPart}
                  onChange={(e) => setField('componentPart', e.target.value)}
                />
                <NumberInput
                  label="Top-level sell price"
                  value={inputs.sellPrice}
                  onChange={(e) => setField('sellPrice', e.target.value)}
                  prefix="£"
                />
                <NumberInput
                  label="Current total top-level cost"
                  value={inputs.currentTotalCost}
                  onChange={(e) => setField('currentTotalCost', e.target.value)}
                  prefix="£"
                />
                <NumberInput
                  label="Current component unit cost"
                  value={inputs.currentComponentCost}
                  onChange={(e) => setField('currentComponentCost', e.target.value)}
                  prefix="£"
                />
                <NumberInput
                  label="New component unit cost"
                  value={inputs.newComponentCost}
                  onChange={(e) => setField('newComponentCost', e.target.value)}
                  prefix="£"
                />
                <NumberInput
                  label="Quantity per assembly"
                  value={inputs.qtyPerAssembly}
                  onChange={(e) => setField('qtyPerAssembly', e.target.value)}
                  step="1"
                />
                <NumberInput
                  label="Annual volume"
                  value={inputs.annualVolume}
                  onChange={(e) => setField('annualVolume', e.target.value)}
                  step="1"
                />
                <NumberInput
                  label="Target margin"
                  value={inputs.targetMarginPct}
                  onChange={(e) => setField('targetMarginPct', e.target.value)}
                  suffix="%"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <MetricCard
                  title="Current profit per unit"
                  value={currency(results.currentProfitPerUnit)}
                  subtext={`Current margin ${pct(results.currentMarginPct)}`}
                  tone="positive"
                />
                <MetricCard
                  title="New profit per unit"
                  value={currency(results.newProfitPerUnit)}
                  subtext={`New margin ${pct(results.newMarginPct)}`}
                  tone="warning"
                />
                <MetricCard
                  title="Cost increase per top level"
                  value={currency(results.costIncreasePerTopLevel)}
                  subtext={`${inputs.qtyPerAssembly} × ${currency(
                    results.componentIncreaseEach
                  )} increase`}
                  tone="info"
                />
                <MetricCard
                  title="Annual profit impact"
                  value={currency(results.annualProfitImpact)}
                  subtext={`${inputs.annualVolume} units per year`}
                  tone="neutral"
                />
              </div>

              <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white">Recovery summary</h2>
                <div className="mt-4 grid gap-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <span>Margin change</span>
                    <span className="font-semibold text-amber-300">
                      {results.marginPointChange.toFixed(1)} pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <span>New total cost</span>
                    <span className="font-semibold text-white">
                      {currency(results.newTotalCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <span>Sell price needed to recover target margin</span>
                    <span className="font-semibold text-cyan-300">
                      {currency(results.requiredSellPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <span>Required sell price increase</span>
                    <span className="font-semibold text-cyan-300">
                      {currency(results.sellPriceIncreaseNeeded)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <span>Max acceptable component cost</span>
                    <span className="font-semibold text-emerald-300">
                      {currency(results.maxAcceptableComponentCost)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white">Impact bridge</h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800">
                  <table className="min-w-full divide-y divide-slate-800 text-sm">
                    <thead className="bg-slate-950/80">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">
                          Line item
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-slate-400">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                      {rows.map(([label, value]) => (
                        <tr key={label}>
                          <td className="px-4 py-3 text-slate-300">{label}</td>
                          <td
                            className={`px-4 py-3 text-right font-semibold ${
                              value >= 0 ? 'text-emerald-300' : 'text-rose-300'
                            }`}
                          >
                            {currency(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
