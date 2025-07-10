import React from 'react';

export default function NatalChartSquare({ chartData }) {
  if (!chartData || !chartData.value || !chartData.value.chart) {
    return (
      <div className="flex flex-col justify-center items-center mt-8">
        <div className="text-gray-400">Нет данных для отображения карты</div>
      </div>
    );
  }

  const chart = chartData.value.chart;
  let chartView = null;
  let chartCss = null;
  try {
    chartView = JSON.parse(chart.chartView);
    chartCss = chartView.css;
  } catch (e) {
    chartView = { html: '', css: '' };
    chartCss = '';
  }

  return (
    <div className="flex flex-col justify-center items-center mt-8 w-full">
      {/* Вставка CSS для карты */}
      {chartCss && <style>{chartCss}</style>}
      {/* Вставка HTML/SVG карты */}
      <div
        className="w-full flex justify-center"
        style={{ maxWidth: 360, minHeight: 360 }}
        dangerouslySetInnerHTML={{ __html: chartView.html }}
      />
    </div>
  );
} 