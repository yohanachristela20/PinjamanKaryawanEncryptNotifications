import React from 'react';
// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

// ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const PolarAreaComponent = ({chartData}) => {
  const data = {
    labels: chartData.labels,
    datasets: [
        {
        label: 'Divisi',
        data: chartData.series[0],
        backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(220, 255, 64, 0.5)',
            'rgba(37, 185, 253, 0.5)',
            'rgba(80, 255, 64, 0.5)',
            'rgba(255, 64, 239, 0.5)',
        ],
        borderWidth: 1,
        },
    ],
  };
  

  return (
    <div className="chart-container" style={{ margin: '0 auto', width: '330px'  }}>
        <PolarArea data={data} />
    </div>
    );
};



export default PolarAreaComponent;
