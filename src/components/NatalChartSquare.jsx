import React from 'react';

const defaultCss = `
/*
 *  {
    margin: 0px;
    padding: 0px;
}
*/
.chart-north {
    border: 1px solid #CCC;
    color: #333;
    float: left;
    font-family: Narrow;
    margin: 0px 3px 2px 0px;
    width: 100%;
    max-width: 331px;
    aspect-ratio: 1/1;
    height: auto;
    background: #fff;
    position: relative;
}
.chart-north polygon {
    fill: #FDFDFD;
    stroke: #000;
    stroke-width: 0.18;
}
.chart-north div {
    position: absolute;
}
.chart-north .sign {
    font-size: 12px;
    text-align: center;
    width: 10px;
    z-index: 2;
}
.chart-north .effects {
    display: none;
    font-size: 14px;
    line-height: 15px;
    text-align: center;
    width: 62px;
    z-index: 2;
}
.chart-north .houses polygon {
    cursor: pointer;
    opacity: 0;
}
.chart-north .planets {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    z-index: 0;
}
.chart-north .planets .planet {
    border: 1px solid transparent;
    border-radius: 50%;
    display: inline-block;
    margin: 0em 0.05em;
    padding: 0px 3px;
    position: relative; 
}
.chart-north .planets .planet .retrograde {
    font-size: 8px;
    top: 12px;
}
.chart-north .planets .planet .degree {
    font-size: 9px;
    top: 18px;
}
.chart-north .aspects, .chart-north .arudhas, .chart-north .lagnas, .chart-north .upagrahas {
    color: #888;
    display: table;
    font-size: 13px;
    text-align: center;
}
.chart-north .when-change-asc {
    display: none;
}
.chart-north svg {
    width: 100% !important;
    height: auto !important;
    max-width: 100% !important;
    display: block;
}

@media (max-width: 500px) {
  .chart-north {
    max-width: 98vw;
    font-size: 12px;
  }
  .chart-north .sign {
    font-size: 9px;
    width: 8px;
  }
  .chart-north .planets {
    font-size: 12px;
  }
  .chart-north .effects {
    font-size: 11px;
    width: 48px;
  }
  .chart-north .aspects, .chart-north .arudhas, .chart-north .lagnas, .chart-north .upagrahas {
    font-size: 10px;
  }
}
`;

export default function NatalChartSquare({ chartData }) {
  const chartViewRaw = chartData?.value?.chart?.chartView;
  if (!chartViewRaw) {
    return (
      <div className="flex flex-col justify-center items-center mt-8">
        <div className="text-gray-400">Нет данных для отображения карты</div>
      </div>
    );
  }

  // Проверяем, есть ли <style> в chartViewRaw
  const hasStyle = /<style[\s>]/.test(chartViewRaw);

  return (
    <div className="flex flex-col justify-center items-center mt-8 w-full px-2 sm:px-0">
      {!hasStyle && <style>{defaultCss}</style>}
      <div
        style={{
          width: '100%',
          maxWidth: 331,
          aspectRatio: '1/1',
          background: '#fff',
          position: 'relative',
          overflow: 'hidden',
          margin: '0 auto',
          height: 'auto',
        }}
        dangerouslySetInnerHTML={{ __html: chartViewRaw }}
      />
    </div>
  );
} 