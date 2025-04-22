import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EmissionData {
  transport: number;
  energy: number;
  food: number;
  shopping: number;
}

const Dashboard = () => {
  const [emissions] = useState<EmissionData>({
    transport: 2.5,
    energy: 1.8,
    food: 1.2,
    shopping: 0.8,
  });

  const chartData = {
    labels: ['Transport', 'Energy', 'Food', 'Shopping'],
    datasets: [
      {
        data: Object.values(emissions),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const totalEmissions = Object.values(emissions).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Carbon Footprint Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Emissions Breakdown
            </h2>
            <div className="w-full max-w-md mx-auto">
              <Doughnut data={chartData} />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Summary
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Total Emissions</p>
                <p className="text-3xl font-bold text-primary-600">
                  {totalEmissions.toFixed(1)} tonnes CO2e
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(emissions).map(([category, value]) => (
                  <div key={category} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 capitalize">{category}</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {value.toFixed(1)} tonnes
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 