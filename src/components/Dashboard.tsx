import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, Target, Users, TrendingUp, ClipboardCheck, ClipboardX, UserCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Sale, Guest, Appointment } from '../lib/supabase';

const getWeekOfMonth = (date: Date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0=Sun, 1=Mon, ...
  const offsetDate = date.getDate() + firstDayOfWeek - 1;
  return Math.floor(offsetDate / 7) + 1;
};


const Dashboard = () => {
  const [salesGoal, setSalesGoal] = useState(25000);
  const [sales, setSales] = useState<Sale[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [presentationCount, setPresentationCount] = useState(0);


  useEffect(() => {
    const fetchDashboardData = async () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*');

      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .gte('created_at', firstDay);

      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .gte('created_at', firstDay);

      if (salesError) console.error('Error fetching sales data:', salesError);
      if (guestsError) console.error('Error fetching guests data:', guestsError);
      if (appointmentsError) console.error('Error fetching appointments data:', appointmentsError);

      if (salesData) {
        setSales(salesData);
        const total = salesData.reduce((acc, sale) => sale.made_purchase ? acc + sale.purchase_amount : acc, 0);
        setTotalSales(total);

        const purchases = salesData.filter(s => s.made_purchase).length;
        setSalesCount(purchases);

        const presentations = salesData.filter(s => s.attended_presentation).length;
        setPresentationCount(presentations);
      }
      if (guestsData) {
          setGuests(guestsData);
      }
      if(appointmentsData) {
          setAppointments(appointmentsData);
      }
    };

    fetchDashboardData();
  }, []);

  const weeklySalesData = sales.reduce((acc, sale) => {
    if (sale.made_purchase && sale.purchase_date) {
        const saleDate = new Date(sale.purchase_date);
        const week = getWeekOfMonth(saleDate);
        const weekKey = `Week ${week}`;

        if (!acc[weekKey]) {
            acc[weekKey] = { name: weekKey, sales: 0 };
        }
        acc[weekKey].sales += sale.purchase_amount;
    }
    return acc;
}, {} as Record<string, {name: string, sales: number}>)

  const salesData = Object.values(weeklySalesData);

  const couplesAttendedThisMonth = guests.length;

  const presentationsScheduled = appointments.filter(a => a.title.toLowerCase().includes('presentation')).length;
  const presentationsAttended = presentationCount;
  const presentationsNoShow = appointments.filter(a => a.status === 'no-show').length;

  const conversionRate = presentationsAttended > 0 ? (salesCount / presentationsAttended) * 100 : 0;
  const attendanceRate = presentationsScheduled > 0 ? (presentationsAttended / presentationsScheduled) * 100 : 0;


  const progressData = salesData.map((d, i) => ({
      day: d.name,
      progress: (d.sales / salesGoal) * 100
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Sales Dashboard</h2>
        <div className="flex items-center gap-4">
          <label htmlFor="salesGoal" className="text-lg font-medium text-gray-700">
            Monthly Sales Goal:
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              id="salesGoal"
              value={salesGoal}
              onChange={(e) => setSalesGoal(Number(e.target.value))}
              className="pl-10 w-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">${totalSales.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Goal Completion</p>
            <p className="text-2xl font-bold text-gray-900">{((totalSales / salesGoal) * 100).toFixed(1)}%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Couples This Month</p>
            <p className="text-2xl font-bold text-gray-900">{couplesAttendedThisMonth}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <TrendingUp className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Sales Conversion</p>
            <p className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* New Row of KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="bg-sky-100 p-3 rounded-full">
                <ClipboardCheck className="w-8 h-8 text-sky-600" />
            </div>
            <div>
                <p className="text-gray-600 text-sm font-medium">Presentations Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{presentationsScheduled}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full">
                <UserCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
                <p className="text-gray-600 text-sm font-medium">Presentations Attended</p>
                <p className="text-2xl font-bold text-gray-900">{presentationsAttended}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="bg-rose-100 p-3 rounded-full">
                <ClipboardX className="w-8 h-8 text-rose-600" />
            </div>
            <div>
                <p className="text-gray-600 text-sm font-medium">No-Shows</p>
                <p className="text-2xl font-bold text-gray-900">{presentationsNoShow}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="bg-fuchsia-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-fuchsia-600" />
            </div>
            <div>
                <p className="text-gray-600 text-sm font-medium">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{attendanceRate.toFixed(1)}%</p>
            </div>
        </div>
      </div>


      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-96">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Weekly Sales Performance</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`}/>
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-96">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Goal Progress</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`}/>
              <Legend />
              <Line type="monotone" dataKey="progress" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
