import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0F766E', '#0284C7', '#6366F1', '#F59E0B'];

interface MonthlyTrendItem {
  bulan: string;
  total_pendapatan: number;
}

interface RoomTypeDistributionItem {
  tipe: string;
  total_pendapatan: number;
}

interface RevenueChartProps {
  monthlyTrend?: MonthlyTrendItem[];
  roomTypeDistribution?: RoomTypeDistributionItem[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ monthlyTrend = [], roomTypeDistribution = [] }) => {
  const pieData = roomTypeDistribution.map((item) => ({
    name: item.tipe === 'desk' ? 'Flexi Desk' : item.tipe === 'meeting_room' ? 'Meeting Room' : 'Private Office',
    value: item.total_pendapatan || 0
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
      {/* Monthly Bar Chart */}
      <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-soft">
        <h4 className="text-sm font-bold text-slate-900 mb-1">Tren Pendapatan Bulanan (Rp)</h4>
        <p className="text-xs text-slate-500 mb-4">Grafik real-time transaksi yang terkonfirmasi & selesai</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="bulan" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `Rp ${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: any) => [`Rp ${(value || 0).toLocaleString('id-ID')}`, 'Pendapatan']}
                contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="total_pendapatan" fill="#0F766E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Room Distribution Pie Chart */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-soft">
        <h4 className="text-sm font-bold text-slate-900 mb-1">Distribusi Tipe Ruangan</h4>
        <p className="text-xs text-slate-500 mb-4">Porsi pendapatan berdasarkan jenis space</p>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData.length > 0 ? pieData : [{ name: 'Desk', value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => `Rp ${(v || 0).toLocaleString('id-ID')}`} />
              <Legend fontSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
