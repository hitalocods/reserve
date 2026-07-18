import { Search, Filter } from "lucide-react";

// Mock data
const appointments = [
  { id: "1", customerName: "Carlos Pereira", customerPhone: "(11) 98765-4321", serviceName: "Corte Clássico", barberName: "João Silva", date: "2026-07-17", time: "09:30", status: "CONFIRMED", notes: "" },
  { id: "2", customerName: "Lucas Almeida", customerPhone: "(11) 91234-5678", serviceName: "Corte + Barba", barberName: "Pedro Santos", date: "2026-07-17", time: "10:30", status: "PENDING", notes: "Prefere laterais mais curtos" },
  { id: "3", customerName: "Marcos Silva", customerPhone: "(11) 99876-5432", serviceName: "Barba Completa", barberName: "João Silva", date: "2026-07-17", time: "11:30", status: "PENDING", notes: "" },
];

export default function AdminAgendaPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agenda</h1>
          <p className="text-gray-600">Gerencie todos os agendamentos</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:border-gray-300">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Serviço</th>
                <th className="px-6 py-4 font-medium">Barbeiro</th>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Horário</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4">{appointment.customerName}</td>
                  <td className="px-6 py-4">{appointment.serviceName}</td>
                  <td className="px-6 py-4">{appointment.barberName}</td>
                  <td className="px-6 py-4">{appointment.date}</td>
                  <td className="px-6 py-4">{appointment.time}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                      appointment.status === "COMPLETED" ? "bg-blue-100 text-blue-700" :
                      appointment.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {appointment.status === "CONFIRMED" ? "Confirmado" :
                       appointment.status === "COMPLETED" ? "Concluído" :
                       appointment.status === "CANCELLED" ? "Cancelado" : "Pendente"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-sm text-black font-semibold hover:underline mr-3">Editar</button>
                    <button className="text-sm text-red-500 hover:underline">Cancelar</button>
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
