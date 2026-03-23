import React, { useMemo, useState } from 'react';

export default function App() {
  const [inputs, setInputs] = useState({
    sellPrice: 100,
    unitCost: 45,
    shippingCost: 5,
    packagingCost: 2,
    marketplaceFeePct: 12,
    paymentFeePct: 2.9,
    paymentFixedFee: 0.3,
    discountPct: 0,
    vatPct: 20,
    includeVATInSellPrice: true,
    overheadPerUnit: 3,
    adCostPerUnit: 4,
    returnsAllowancePct: 1.5,
    taxPct: 0,
    units: 100,
  });

  const setField = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const currency = (value) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0);

  const pct = (value) =>
    `${(Number.isFinite(value) ? value : 0).toFixed(1)}%`;

  const results = useMemo(() => {
    const sellPrice = Number(inputs.sellPrice) || 0;
    const unitCost = Number(inputs.unitCost) || 0;
    const shippingCost = Number(inputs.shippingCost) || 0;
    const packagingCost = Number(inputs.packagingCost) || 0;
    const marketplaceFeePct = (Number(inputs.marketplaceFeePct) || 0) / 100;
    const paymentFeePct = (Number(inputs.paymentFeePct) || 0) / 100;
    const paymentFixedFee = Number(inputs.paymentFixedFee) || 0;
    const discountPct = (Number(inputs.discountPct) || 0) / 100;
    const vatPct = (Number(inputs.vatPct) || 0) / 100;
    const overheadPerUnit = Number(inputs.overheadPerUnit) || 0;
    const adCostPerUnit = Number(inputs.adCostPerUnit) || 0;
    const returnsAllowancePct =
      (Number(inputs.returnsAllowancePct) || 0) / 100;
    const taxPct = (Number(inputs.taxPct) || 0) / 100;
    const units = Number(inputs.units) || 0;

    const discountedSellPrice = sellPrice * (1 - discountPct);

    const netSellPriceExVAT = inputs.includeVATInSellPrice
      ? discountedSellPrice / (1 + vatPct)
      : discountedSellPrice;

    const vatAmount = inputs.includeVATInSellPrice
      ? discountedSellPrice - netSellPriceExVAT
      : netSellPriceExVAT * vatPct;

    const marketplaceFee = discountedSellPrice * marketplaceFeePct;
    const paymentFee =
      discountedSellPrice * paymentFeePct + paymentFixedFee;
    const returnsAllowance =
      discountedSellPrice * returnsAllowancePct;

    const totalVariableCosts =
      unitCost +
      shippingCost +
      packagingCost +
      marketplaceFee +
      paymentFee +
      overheadPerUnit +
      adCostPerUnit +
      returnsAllowance;

    const contributionPerUnit =
      netSellPriceExVAT - totalVariableCosts;

    const grossProfitPerUnit =
      netSellPriceExVAT -
      (unitCost + shippingCost + packagingCost);

    const grossMarginPct =
      netSellPriceExVAT > 0
        ? (grossProfitPerUnit / netSellPriceExVAT) * 100
        : 0;

    const netMarginPct =
      netSellPriceExVAT > 0
        ? (contributionPerUnit / netSellPriceExVAT) * 100
        : 0;

    const profitAfterTaxPerUnit =
      contributionPerUnit * (1 - taxPct);

    const revenueTotal = netSellPriceExVAT * units;
    const totalProfit = contributionPerUnit * units;
    const totalProfitAfterTax =
      profitAfterTaxPerUnit * units;

    const breakEvenSellPriceExVATDenominator =
      1 -
      marketplaceFeePct -
      paymentFeePct -
      returnsAllowancePct;

    const breakEvenSellPriceExVAT =
      breakEvenSellPriceExVATDenominator > 0
        ? (unitCost +
            shippingCost +
            packagingCost +
            overheadPerUnit +
            adCostPerUnit +
            paymentFixedFee) /
          breakEvenSellPriceExVATDenominator
        : 0;

    const breakEvenSellPriceIncVAT =
      inputs.includeVATInSellPrice
        ? breakEvenSellPriceExVAT * (1 + vatPct)
        : breakEvenSellPriceExVAT;

    return {
      discountedSellPrice,
      netSellPriceExVAT,
      vatAmount,
      marketplaceFee,
      paymentFee,
      returnsAllowance,
      totalVariableCosts,
      grossProfitPerUnit,
      grossMarginPct,
      contributionPerUnit,
      netMarginPct,
      profitAfterTaxPerUnit,
      revenueTotal,
      totalProfit,
      totalProfitAfterTax,
      breakEvenSellPriceIncVAT,
    };
  }, [inputs]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Product Margin Calculator</h1>

      <div>
        <label>Selling Price: </label>
        <input
          type="number"
          value={inputs.sellPrice}
          onChange={(e) =>
            setField("sellPrice", e.target.value)
          }
        />
      </div>

      <div>
        <label>Unit Cost: </label>
        <input
          type="number"
          value={inputs.unitCost}
          onChange={(e) =>
            setField("unitCost", e.target.value)
          }
        />
      </div>

      <div>
        <label>Shipping: </label>
        <input
          type="number"
          value={inputs.shippingCost}
          onChange={(e) =>
            setField("shippingCost", e.target.value)
          }
        />
      </div>

      <h2>Results</h2>
      <p>Net Profit / Unit: {currency(results.contributionPerUnit)}</p>
      <p>Net Margin: {pct(results.netMarginPct)}</p>
      <p>Total Profit: {currency(results.totalProfit)}</p>
      <p>Break-even Price: {currency(results.breakEvenSellPriceIncVAT)}</p>
    </div>
  );
}
