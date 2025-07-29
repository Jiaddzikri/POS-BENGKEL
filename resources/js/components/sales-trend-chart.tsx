import { AnalyticsSalesTrend } from '@/types';
import { BarElement, CategoryScale, ChartData, Chart as ChartJS, ChartOptions, Legend, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import { Activity } from 'lucide-react';
import { Bar } from 'react-chartjs-2';

interface SalesTrendChartProps {
  getSalesTrend: AnalyticsSalesTrend;
}

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend);

export default function SalesTrendChart({ getSalesTrend }: SalesTrendChartProps) {
  const chartData: ChartData<'bar'> = {
    labels: getSalesTrend.labels,
    datasets: [
      {
        label: 'Penjualan Hari Ini',
        data: getSalesTrend.value,
        backgroundColor: 'rgb(79,57,246)',
        borderColor: 'rgb(79,57,246)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mb-8 rounded-lg border">
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Analisis Tren Penjualan</h3>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span className="text-sm">Penjualan per Jam</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex h-80 items-end justify-between space-x-2">
          <Bar options={options} data={chartData} />
        </div>
        <div className="mt-4 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
            <span className="text-sm">Penjualan Hari Ini</span>
          </div>
        </div>
      </div>
    </div>
  );
}
