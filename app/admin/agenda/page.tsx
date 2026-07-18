"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, CheckCircle, XCircle, Trash2 } from "lucide-react";

interface Appointment {
  id: string;
  customer: { name: string; phone: string };
  barber: { name: string };
  service: { name: string; price: any };
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string | null;
}

export default function AdminAgendaPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchAppointments();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este agendamento?")) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      if (res.ok) fetchAppointments();
    } catch (err) {
      console.error("Erro ao deletar agendamento:", err);
    }
  };

  const filteredAppointments = appointments.filter(
    (app) =>
      app.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      app.barber.name.toLowerCase().includes(search.toLowerCase()) ||
      app.service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agenda em Tempo Real</h1>
          <p className="text-gray-600">Gerencie todos os agendamentos registrados no Neon DB</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, barbeiro ou serviço..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black w-64 md:w-80 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-gray-100 text-gray-500">
          Nenhum agendamento encontrado no banco de dados.
        </div>
      ) : (
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
                {filteredAppointments.map((app) => (
                  <tr key={app.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      <div>{app.customer.name}</div>
                      <div className="text-xs text-gray-400">{app.customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{app.service.name}</td>
                    <td className="px-6 py-4 text-gray-700">{app.barber.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(app.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {app.startTime} - {app.endTime}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : app.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-700"
                            : app.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {app.status === "CONFIRMED"
                          ? "Confirmado"
                          : app.status === "COMPLETED"
                          ? "Concluído"
                          : app.status === "CANCELLED"
                          ? "Cancelado"
                          : "Pendente"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {app.status !== "COMPLETED" && (
                          <button
                            onClick={() => updateStatus(app.id, "COMPLETED")}
                            title="Marcar como Concluído"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {app.status !== "CANCELLED" && (
                          <button
                            onClick={() => updateStatus(app.id, "CANCELLED")}
                            title="Cancelar Agendamento"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(app.id)}
                          title="Excluir"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
