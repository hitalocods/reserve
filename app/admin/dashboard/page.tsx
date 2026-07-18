import {
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
} from "lucide-react";

// Mock data
const stats = [
  { label: "Receita Hoje", value: "R$ 450", icon: DollarSign, color: "bg-blue-500" },
  { label: "Agendamentos Hoje", value: "8", icon: Calendar, color: "bg-gold" },
  { label: "Receita Semanal", value: "R$ 2.800", icon: TrendingUp, color: "bg-green-500" },
  { label: "Total Clientes", value: "156", icon: Users, color: "bg-purple-500" },
];

const recentAppointments = [
  { id: "1", customer: "Carlos Pereira", service: "Corte Clássico", barber: "João Silva", time: "09:30", status: "CONFIRMED" },
  { id: "2", customer: "Lucas Almeida", service: "Corte + Barba", barber: "Pedro Santos", time: "10:30", status: "PENDING" },
  { id: "3", customer: "Marcos Silva", service: "Barba Completa", barber: "João Silva", time: "11:30", status: "PENDING" },
  { id: "4", customer: "Felipe Costa", service: "Corte Clássico", barber: "Pedro Santos", time: "14:00", status: "CONFIRMED" },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral da barbearia</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => {
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
                <p className="text-2xl font-bold">{stat.value}</p>
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
              {recentAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-4">{appointment.customer}</td>
                  <td className="py-4">{appointment.service}</td>
                  <td className="py-4">{appointment.barber}</td>
                  <td className="py-4">{appointment.time}</td>
                  <td className="py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {appointment.status === "CONFIRMED" ? "Confirmado" : "Pendente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
