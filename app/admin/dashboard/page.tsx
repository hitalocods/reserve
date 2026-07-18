"use client";

import { useEffect, useState } from "react";
import { DollarSign, Calendar, TrendingUp, Users, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayRevenue: 0,
    todayCount: 0,
    totalCustomers: 0,
    weeklyRevenue: 0,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);

        // Compute metrics
        const todayStr = new Date().toISOString().split("T")[0];
        const todayApps = data.filter((a: any) => a.date.startsWith(todayStr));

        const todayRevenue = todayApps.reduce(
          (sum: number, a: any) => sum + (Number(a.service?.price) || 0),
          0
        );

        const totalRev = data.reduce(
          (sum: number, a: any) => sum + (Number(a.service?.price) || 0),
          0
        );

        // Unique customers
        const uniqueCustomers = new Set(data.map((a: any) => a.customerId)).size;

        setStats({
          todayRevenue,
          todayCount: todayApps.length,
          weeklyRevenue: totalRev,
          totalCustomers: uniqueCustomers,
        });
      }
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statsCards = [
    { label: "Receita Hoje", value: `R$ ${stats.todayRevenue.toFixed(2)}`, icon: DollarSign, color: "bg-blue-500" },
    { label: "Agendamentos Hoje", value: stats.todayCount.toString(), icon: Calendar, color: "bg-amber-500" },
    { label: "Receita Acumulada", value: `R$ ${stats.weeklyRevenue.toFixed(2)}`, icon: TrendingUp, color: "bg-green-500" },
    { label: "Clientes Atendidos", value: stats.totalCustomers.toString(), icon: Users, color: "bg-purple-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema com dados reais do Neon DB</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Próximos Agendamentos</h2>
            </div>
            {appointments.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum agendamento realizado ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                      <th className="pb-4 font-medium">Cliente</th>
                      <th className="pb-4 font-medium">Serviço</th>
                      <th className="pb-4 font-medium">Barbeiro</th>
                      <th className="pb-4 font-medium">Horário</th>
                      <th className="pb-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 5).map((appointment) => (
                      <tr key={appointment.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-4 font-medium">{appointment.customer?.name}</td>
                        <td className="py-4 text-gray-600">{appointment.service?.name}</td>
                        <td className="py-4 text-gray-600">{appointment.barber?.name}</td>
                        <td className="py-4 font-semibold">{appointment.startTime}</td>
                        <td className="py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              appointment.status === "CONFIRMED"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {appointment.status === "CONFIRMED" ? "Confirmado" : "Pendente"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
