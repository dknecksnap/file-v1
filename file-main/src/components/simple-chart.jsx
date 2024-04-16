import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'chart.js/auto';

// Register the required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SimpleHistoricalChart = ({ baseCurrency, comparisonCurrencies }) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      // Define the start date for the last 5 years
      const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().split('T')[0];

      try {
        // Fetch the historical rates for each comparison currency
        const promises = comparisonCurrencies.map(currency =>
          fetch(`https://api.frankfurter.app/${startDate}..?from=${baseCurrency}&to=${currency}`)
        );
        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map(res => res.json()));

        // Prepare the datasets for the chart
        const datasets = data.map((dataset, index) => {
          const labels = Object.keys(dataset.rates);
          const values = labels.map(date => {
            const rateForDate = dataset.rates[date];
            return rateForDate && rateForDate[comparisonCurrencies[index]] ? rateForDate[comparisonCurrencies[index]] : null;
          });

          return {
            label: `Historical ${baseCurrency} Exchange Rate for ${comparisonCurrencies[index]}`,
            data: values,
            fill: false,
            borderColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`, // Random color for each dataset
            tension: 0.1
          };
        });

        // Set the chart data with the labels and datasets
        setChartData({
          labels: Object.keys(data[0].rates), // Use the dates from the first dataset as the labels
          datasets
        });
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (comparisonCurrencies.length > 0) {
      fetchHistoricalData();
    }
  }, [baseCurrency, comparisonCurrencies]);

  return (
    <div>
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <Line data={chartData} options={{
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }} />
      )}
    </div>
  );
};

export default SimpleHistoricalChart;
