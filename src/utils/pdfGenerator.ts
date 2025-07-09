import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CostCalculation } from '../types';
import { generateCostProjections } from './calculations';

export const generatePDFReport = async (calculation: CostCalculation): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;

  // Color palette
  const colors = {
    primary: [59, 130, 246],      // Blue
    secondary: [34, 197, 94],     // Green
    accent: [147, 51, 234],       // Purple
    warning: [245, 158, 11],      // Orange
    danger: [239, 68, 68],        // Red
    gray: [107, 114, 128],        // Gray
    lightGray: [248, 250, 252],   // Light gray
    white: [255, 255, 255]
  };

  // Helper functions
  const setColor = (colorArray: number[], type: 'fill' | 'text' | 'draw' = 'fill') => {
    if (type === 'fill') pdf.setFillColor(...colorArray);
    else if (type === 'text') pdf.setTextColor(...colorArray);
    else if (type === 'draw') pdf.setDrawColor(...colorArray);
  };

  const addText = (text: string, x: number, y: number, options: any = {}) => {
    const fontSize = options.fontSize || 10;
    const maxWidth = options.maxWidth || contentWidth;
    const lineHeight = options.lineHeight || fontSize * 0.35;
    const color = options.color || colors.gray;
    
    pdf.setFontSize(fontSize);
    if (options.style) pdf.setFont('helvetica', options.style);
    setColor(color, 'text');
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    
    return y + (lines.length * lineHeight);
  };

  const checkNewPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  const addSection = (title: string, bgColor = colors.primary) => {
    checkNewPage(15);
    setColor(bgColor, 'fill');
    pdf.rect(margin, yPosition, contentWidth, 12, 'F');
    
    setColor(colors.white, 'text');
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin + 5, yPosition + 8);
    yPosition += 18;
  };

  const addCard = (content: () => void, height: number, bgColor = colors.lightGray) => {
    checkNewPage(height);
    setColor(bgColor, 'fill');
    setColor(colors.gray, 'draw');
    pdf.roundedRect(margin, yPosition, contentWidth, height, 3, 3, 'FD');
    
    const startY = yPosition;
    yPosition += 8;
    content();
    yPosition = startY + height + 5;
  };

  // Create a simple chart using ASCII-like visualization
  const createBarChart = (data: Array<{label: string, value: number, color?: number[]}>, title: string, maxValue?: number) => {
    const chartHeight = 60;
    const barHeight = 4;
    const maxVal = maxValue || Math.max(...data.map(d => d.value));
    
    addText(title, margin + 5, yPosition, { fontSize: 12, style: 'bold', color: colors.gray });
    yPosition += 8;
    
    data.forEach((item, index) => {
      const barWidth = (item.value / maxVal) * (contentWidth - 60);
      const barY = yPosition + (index * 8);
      
      // Bar background
      setColor(colors.lightGray, 'fill');
      pdf.rect(margin + 40, barY, contentWidth - 60, barHeight, 'F');
      
      // Bar fill
      setColor(item.color || colors.primary, 'fill');
      pdf.rect(margin + 40, barY, barWidth, barHeight, 'F');
      
      // Label and value
      addText(item.label, margin + 5, barY + 3, { fontSize: 8, color: colors.gray });
      addText(formatCurrency(item.value), margin + 45 + barWidth, barY + 3, { fontSize: 8, color: colors.gray });
    });
    
    yPosition += data.length * 8 + 10;
  };

  // Header with gradient effect (simulated)
  setColor(colors.primary, 'fill');
  pdf.rect(0, 0, pageWidth, 45, 'F');
  
  // Add subtle pattern
  setColor([79, 150, 255], 'fill');
  for (let i = 0; i < pageWidth; i += 10) {
    pdf.circle(i, 10, 1, 'F');
    pdf.circle(i + 5, 35, 0.5, 'F');
  }
  
  setColor(colors.white, 'text');
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AC COST ANALYSIS', margin, 25);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Professional Energy Assessment Report', margin, 35);
  
  // Date badge
  setColor(colors.secondary, 'fill');
  pdf.roundedRect(pageWidth - 60, 8, 50, 12, 2, 2, 'F');
  setColor(colors.white, 'text');
  pdf.setFontSize(8);
  pdf.text(new Date().toLocaleDateString(), pageWidth - 55, 16);
  
  yPosition = 55;

  // Executive Summary Card
  addCard(() => {
    addText('EXECUTIVE SUMMARY', margin + 5, yPosition, { 
      fontSize: 12, 
      style: 'bold', 
      color: colors.primary 
    });
    yPosition += 8;
    
    const { results, inputs, weatherData } = calculation;
    const summaryText = `Analysis for ${inputs.squareFootage.toLocaleString()} sq ft home in ${weatherData.location}. Current conditions: ${weatherData.temperature}°F, ${weatherData.humidity}% humidity. Selected unit: ${inputs.selectedUnit?.brand} ${inputs.selectedUnit?.model} (SEER2 ${results.efficiencyRating}).`;
    
    yPosition = addText(summaryText, margin + 5, yPosition, { 
      fontSize: 10, 
      lineHeight: 4,
      color: colors.gray 
    });
  }, 35);

  // Key Metrics Dashboard
  addSection('KEY PERFORMANCE METRICS', colors.secondary);
  
  const metricsData = [
    { label: 'Daily Cost', value: `${formatCurrency(calculation.results.dailyCost)}`, icon: '📅', color: colors.secondary },
    { label: 'Monthly Cost', value: `${formatCurrency(calculation.results.monthlyCost)}`, icon: '📊', color: colors.primary },
    { label: 'Annual Cost', value: `${formatCurrency(calculation.results.annualCost)}`, icon: '📈', color: colors.accent },
    { label: 'Energy Usage', value: `${calculation.results.energyUsage.toFixed(1)} kWh/day`, icon: '⚡', color: colors.warning }
  ];

  // Create metric cards in a 2x2 grid
  const cardWidth = (contentWidth - 10) / 2;
  const cardHeight = 25;
  
  metricsData.forEach((metric, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = margin + (col * (cardWidth + 10));
    const y = yPosition + (row * (cardHeight + 5));
    
    // Card background with gradient effect
    setColor(metric.color, 'fill');
    pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
    
    // Lighter overlay for depth
    setColor([...metric.color.slice(0, 2), metric.color[2] + 30], 'fill');
    pdf.roundedRect(x + 1, y + 1, cardWidth - 2, cardHeight - 2, 2, 2, 'F');
    
    // Content
    setColor(colors.white, 'text');
    pdf.setFontSize(16);
    pdf.text(metric.icon, x + 5, y + 12);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(metric.label, x + 15, y + 8);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(metric.value, x + 15, y + 18);
  });
  
  yPosition += (Math.ceil(metricsData.length / 2) * (cardHeight + 5)) + 10;

  // System Specifications with icons
  addSection('SYSTEM SPECIFICATIONS', colors.accent);
  
  const specs = [
    { icon: '🏠', label: 'Home Size', value: `${calculation.inputs.squareFootage.toLocaleString()} sq ft` },
    { icon: '🌡️', label: 'Thermostat', value: `${calculation.inputs.thermostatTemp}°F` },
    { icon: '🏗️', label: 'Insulation', value: calculation.inputs.insulationQuality.charAt(0).toUpperCase() + calculation.inputs.insulationQuality.slice(1) },
    { icon: '⏰', label: 'Operating Hours', value: `${calculation.inputs.operatingHours} hrs/day` },
    { icon: '❄️', label: 'AC Unit', value: `${calculation.inputs.selectedUnit?.brand} ${calculation.inputs.selectedUnit?.model}` },
    { icon: '💰', label: 'Unit Price', value: formatCurrency(calculation.inputs.selectedUnit?.estimatedPrice || 0) },
    { icon: '⚡', label: 'SEER2 Rating', value: calculation.results.efficiencyRating.toString() },
    { icon: '🔥', label: 'BTU Capacity', value: `${Math.round(calculation.results.btuRequirement).toLocaleString()} BTU/hr` }
  ];

  addCard(() => {
    specs.forEach((spec, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = margin + 5 + (col * (contentWidth / 2));
      const y = yPosition + (row * 8);
      
      addText(spec.icon, x, y + 3, { fontSize: 10 });
      addText(spec.label + ':', x + 8, y + 3, { fontSize: 9, style: 'bold', color: colors.gray });
      addText(spec.value, x + 60, y + 3, { fontSize: 9, color: colors.gray });
    });
    yPosition += Math.ceil(specs.length / 2) * 8;
  }, Math.ceil(specs.length / 2) * 8 + 10);

  // Monthly Projections with Visual Chart
  addSection('MONTHLY COST PROJECTIONS', colors.warning);
  
  try {
    const projections = await generateCostProjections(calculation.inputs, calculation.weatherData);
    
    // Create visual monthly chart
    const monthlyData = projections.map(p => ({
      label: p.month,
      value: p.cost,
      color: p.cost > 150 ? colors.danger : p.cost > 100 ? colors.warning : p.cost > 50 ? colors.primary : colors.secondary
    }));
    
    createBarChart(monthlyData, 'Monthly Cooling Costs', Math.max(...projections.map(p => p.cost)));
    
    // Summary statistics
    const annualTotal = projections.reduce((sum, p) => sum + p.cost, 0);
    const avgMonthly = annualTotal / 12;
    const peakMonth = projections.reduce((peak, current) => current.cost > peak.cost ? current : peak);
    const lowMonth = projections.reduce((low, current) => current.cost < low.cost ? current : low);
    
    addCard(() => {
      const summaryStats = [
        { label: 'Annual Total', value: formatCurrency(annualTotal), color: colors.accent },
        { label: 'Average Monthly', value: formatCurrency(avgMonthly), color: colors.primary },
        { label: 'Peak Month', value: `${peakMonth.month} (${formatCurrency(peakMonth.cost)})`, color: colors.danger },
        { label: 'Lowest Month', value: `${lowMonth.month} (${formatCurrency(lowMonth.cost)})`, color: colors.secondary }
      ];
      
      summaryStats.forEach((stat, index) => {
        const x = margin + 5 + (index % 2) * (contentWidth / 2);
        const y = yPosition + Math.floor(index / 2) * 8;
        
        setColor(stat.color, 'fill');
        pdf.circle(x, y + 2, 1.5, 'F');
        
        addText(stat.label + ':', x + 5, y + 3, { fontSize: 9, style: 'bold', color: colors.gray });
        addText(stat.value, x + 60, y + 3, { fontSize: 9, color: colors.gray });
      });
      yPosition += 16;
    }, 25);
    
  } catch (error) {
    console.error('Error generating projections for PDF:', error);
    addText('Monthly projections could not be generated at this time.', margin + 5, yPosition, { 
      fontSize: 10, 
      color: colors.danger 
    });
    yPosition += 15;
  }

  // Efficiency Analysis
  addSection('EFFICIENCY ANALYSIS', colors.secondary);
  
  const seerRatings = [
    { rating: 13, label: 'Minimum Standard', efficiency: 'Basic', color: colors.danger },
    { rating: 16, label: 'Good Efficiency', efficiency: 'Good', color: colors.warning },
    { rating: 18, label: 'High Efficiency', efficiency: 'High', color: colors.primary },
    { rating: 20, label: 'Premium Efficiency', efficiency: 'Excellent', color: colors.secondary }
  ];
  
  addCard(() => {
    addText('SEER2 Rating Comparison', margin + 5, yPosition, { 
      fontSize: 11, 
      style: 'bold', 
      color: colors.gray 
    });
    yPosition += 10;
    
    const currentRating = calculation.results.efficiencyRating;
    
    seerRatings.forEach((rating, index) => {
      const y = yPosition + (index * 8);
      const isCurrentRating = Math.abs(rating.rating - currentRating) < 1;
      
      // Highlight current rating
      if (isCurrentRating) {
        setColor([255, 255, 0, 0.3], 'fill');
        pdf.rect(margin + 3, y - 2, contentWidth - 6, 6, 'F');
      }
      
      setColor(rating.color, 'fill');
      pdf.circle(margin + 8, y + 1, 2, 'F');
      
      addText(`SEER2 ${rating.rating}`, margin + 15, y + 2, { 
        fontSize: 9, 
        style: isCurrentRating ? 'bold' : 'normal',
        color: colors.gray 
      });
      addText(rating.label, margin + 50, y + 2, { fontSize: 9, color: colors.gray });
      addText(rating.efficiency, margin + 120, y + 2, { fontSize: 9, color: rating.color });
      
      if (isCurrentRating) {
        addText('← YOUR UNIT', margin + 150, y + 2, { 
          fontSize: 8, 
          style: 'bold', 
          color: colors.primary 
        });
      }
    });
    yPosition += seerRatings.length * 8;
  }, seerRatings.length * 8 + 15);

  // Recommendations with priority indicators
  addSection('OPTIMIZATION RECOMMENDATIONS', colors.primary);
  
  const recommendations = [
    { 
      priority: 'HIGH', 
      text: 'Consider upgrading to SEER2 18+ for 20-30% energy savings',
      savings: '$200-400/year',
      color: colors.danger
    },
    { 
      priority: 'MEDIUM', 
      text: 'Improve home insulation to reduce cooling load',
      savings: '$150-300/year',
      color: colors.warning
    },
    { 
      priority: 'MEDIUM', 
      text: 'Install programmable thermostat for schedule optimization',
      savings: '$100-200/year',
      color: colors.warning
    },
    { 
      priority: 'LOW', 
      text: 'Regular maintenance maintains peak efficiency',
      savings: '$50-100/year',
      color: colors.secondary
    }
  ];

  addCard(() => {
    recommendations.forEach((rec, index) => {
      const y = yPosition + (index * 12);
      
      // Priority badge
      setColor(rec.color, 'fill');
      pdf.roundedRect(margin + 5, y - 1, 20, 6, 1, 1, 'F');
      setColor(colors.white, 'text');
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'bold');
      pdf.text(rec.priority, margin + 7, y + 2);
      
      // Recommendation text
      addText(rec.text, margin + 30, y + 2, { fontSize: 9, color: colors.gray });
      
      // Savings potential
      setColor(colors.secondary, 'text');
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(rec.savings, margin + 30, y + 8);
    });
    yPosition += recommendations.length * 12;
  }, recommendations.length * 12 + 5);

  // Professional footer with contact info
  checkNewPage(25);
  setColor(colors.lightGray, 'fill');
  pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F');
  
  setColor(colors.gray, 'text');
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Generated by AC Cost Calculator - Professional Energy Analysis Platform', margin, pageHeight - 18);
  pdf.text(`Report ID: ${calculation.id.slice(-8)} | Generated: ${new Date().toLocaleString()}`, margin, pageHeight - 12);
  pdf.text('For questions about this analysis, visit our support center or contact your HVAC professional.', margin, pageHeight - 6);
  
  // Add page numbers
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    setColor(colors.gray, 'text');
    pdf.setFontSize(8);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
  }

  // Save with descriptive filename
  const location = calculation.weatherData.location.replace(/[^a-zA-Z0-9]/g, '_');
  const date = new Date().toISOString().split('T')[0];
  const fileName = `AC_Analysis_${location}_${calculation.inputs.selectedUnit?.brand}_${date}.pdf`;
  
  pdf.save(fileName);
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};