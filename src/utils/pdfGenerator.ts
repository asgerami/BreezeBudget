import jsPDF from "jspdf";
import { CostCalculation } from "../types";
import { generateCostProjections } from "./calculations";

export const generatePDFReport = async (
  calculation: CostCalculation
): Promise<void> => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;
  const pageHeight = pdf.internal.pageSize.getHeight();
  const bottomBarrier = pageHeight - 20; // 20mm bottom margin, like Word

  // Helper
  const addHeader = (text: string) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text(text, margin, y);
    y += 9;
    pdf.setDrawColor(200);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 5;
  };
  const addSubHeader = (text: string) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(text, margin, y);
    y += 7;
  };
  const addText = (text: string, fontSize = 11, bold = false) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(fontSize);
    pdf.text(text, margin, y);
    y += fontSize + 2;
  };
  const addTableRow = (
    cols: string[],
    colWidths: number[],
    fontSize = 10,
    bold = false
  ) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(fontSize);
    let x = margin;
    cols.forEach((col, i) => {
      pdf.text(col, x, y);
      x += colWidths[i];
    });
    y += fontSize + 2;
  };
  const checkPage = (needed = 15) => {
    if (y + needed > bottomBarrier) {
      pdf.addPage();
      y = margin;
    }
  };

  // Title & Date
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("AC Cost Analysis Report", margin, y);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(new Date().toLocaleDateString(), pageWidth - margin - 30, y);
  y += 14;
  pdf.setDrawColor(180);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Executive Summary
  addHeader("Executive Summary");
  const { results, inputs, weatherData } = calculation;
  addText(`Location: ${weatherData.location}`);
  addText(`Home Size: ${inputs.squareFootage.toLocaleString()} sq ft`);
  addText(
    `Current Conditions: ${weatherData.temperature}°F, ${weatherData.humidity}% humidity`
  );
  addText(
    `Selected Unit: ${inputs.selectedUnit?.brand} ${inputs.selectedUnit?.model} (SEER2 ${results.efficiencyRating})`
  );
  y += 4;

  // Key Metrics
  addHeader("Key Metrics");
  addTableRow(
    ["Metric", "Value"],
    [contentWidth * 0.5, contentWidth * 0.5],
    11,
    true
  );
  addTableRow(
    ["Daily Cost", formatCurrency(results.dailyCost)],
    [contentWidth * 0.5, contentWidth * 0.5]
  );
  addTableRow(
    ["Monthly Cost", formatCurrency(results.monthlyCost)],
    [contentWidth * 0.5, contentWidth * 0.5]
  );
  addTableRow(
    ["Annual Cost", formatCurrency(results.annualCost)],
    [contentWidth * 0.5, contentWidth * 0.5]
  );
  addTableRow(
    ["Energy Usage", `${results.energyUsage.toFixed(1)} kWh/day`],
    [contentWidth * 0.5, contentWidth * 0.5]
  );
  y += 6;

  // System Specs
  addHeader("System Specifications");
  addTableRow(
    ["Spec", "Value"],
    [contentWidth * 0.5, contentWidth * 0.5],
    11,
    true
  );
  addTableRow(
    ["Home Size", `${inputs.squareFootage.toLocaleString()} sq ft`],
    [contentWidth * 0.5, contentWidth * 0.5]
  );
  addTableRow(
    ["Thermostat", `${inputs.thermostatTemp}°F`],
    [contentWidth * 0.5, contentWidth * 0.5]
  );
  addTableRow(
    ["Insulation", capitalize(inputs.insulationQuality)],
    [contentWidth * 0.5, contentWidth * 0.5]
  );
  addTableRow(
    ["Operating Hours", `${inputs.operatingHours} hrs/day`],
    [contentWidth * 0.5, contentWidth * 0.5]
  );
  addTableRow(
    ["AC Unit", `${inputs.selectedUnit?.brand} ${inputs.selectedUnit?.model}`],
    [contentWidth * 0.5, contentWidth * 0.5]
  );
  addTableRow(
    ["Unit Price", formatCurrency(inputs.selectedUnit?.estimatedPrice || 0)],
    [contentWidth * 0.5, contentWidth * 0.5]
  );
  addTableRow(
    ["SEER2 Rating", results.efficiencyRating.toString()],
    [contentWidth * 0.5, contentWidth * 0.5]
  );
  addTableRow(
    [
      "BTU Capacity",
      `${Math.round(results.btuRequirement).toLocaleString()} BTU/hr`,
    ],
    [contentWidth * 0.5, contentWidth * 0.5]
  );
  y += 6;

  // Monthly Cost Table
  addHeader("Monthly Cost Projections");
  try {
    const projections = await generateCostProjections(inputs, weatherData);
    addTableRow(
      ["Month", "Cost"],
      [contentWidth * 0.5, contentWidth * 0.5],
      11,
      true
    );
    projections.forEach((p) => {
      checkPage();
      addTableRow(
        [p.month, formatCurrency(p.cost)],
        [contentWidth * 0.5, contentWidth * 0.5]
      );
    });
    y += 4;
  } catch (e) {
    addText("Monthly projections could not be generated.", 10, false);
    y += 4;
  }

  // Recommendations
  addHeader("Recommendations");
  const recommendations = [
    {
      priority: "HIGH",
      text: "Upgrade to SEER2 18+ for 20-30% energy savings",
    },
    {
      priority: "MEDIUM",
      text: "Improve home insulation to reduce cooling load",
    },
    {
      priority: "MEDIUM",
      text: "Install programmable thermostat for schedule optimization",
    },
    { priority: "LOW", text: "Regular maintenance maintains peak efficiency" },
  ];
  recommendations.forEach((rec) => {
    checkPage();
    addText(`• [${rec.priority}] ${rec.text}`, 10);
  });
  y += 6;

  // Footer
  checkPage(30); // Reserve more space for footer
  pdf.setDrawColor(180);
  pdf.line(margin, bottomBarrier, pageWidth - margin, bottomBarrier);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.text("Generated by AC Cost Calculator", margin, bottomBarrier + 6);
  pdf.text(
    `Report ID: ${calculation.id.slice(-8)} | ${new Date().toLocaleString()}`,
    margin,
    bottomBarrier + 12
  );
  pdf.text(
    "For questions, contact your HVAC professional.",
    margin,
    bottomBarrier + 18
  );

  // Page numbers
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      bottomBarrier + 6
    );
  }

  // Save
  const location = weatherData.location.replace(/[^a-zA-Z0-9]/g, "_");
  const date = new Date().toISOString().split("T")[0];
  const fileName = `AC_Analysis_${location}_${inputs.selectedUnit?.brand}_${date}.pdf`;
  pdf.save(fileName);
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
