"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, CheckCircle, XCircle, Trash2, Calendar, Clock, User } from "lucide-react";

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
    <div className="space-y-6 pb-10">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Agenda em Tempo Real
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Gerencie todos os agendamentos registrados
          </p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, barbeiro..."
            className="w-full sm:w-72 pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-black bg-white shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-3xl border border-gray-100 min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-gray-100 text-gray-500 font-medium text-sm">
          Nenhum agendamento encontrado.
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-4 sm:p-6">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-semibold uppercase">Cliente</th>
                  <th className="pb-3 font-semibold uppercase">Serviço</th>
                  <th className="pb-3 font-semibold uppercase">Barbeiro</th>
                  <th className="pb-3 font-semibold uppercase">Data</th>
                  <th className="pb-3 font-semibold uppercase">Horário</th>
                  <th className="pb-3 font-semibold uppercase">Status</th>
                  <th className="pb-3 font-semibold uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 font-bold text-gray-900">
                      <div>{app.customer.name}</div>
                      <div className="text-xs text-gray-400 font-normal">{app.customer.phone}</div>
                    </td>
                    <td className="py-3.5 text-gray-700 font-medium">{app.service.name}</td>
                    <td className="py-3.5 text-gray-700 font-medium">{app.barber.name}</td>
                    <td className="py-3.5 text-gray-600 font-medium">
                      {new Date(app.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3.5 font-black text-gray-900">
                      {app.startTime} - {app.endTime}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          app.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-700"
                            : app.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-700"
                            : app.status === "CANCELLED"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
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
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        {app.status !== "COMPLETED" && (
                          <button
                            onClick={() => updateStatus(app.id, "COMPLETED")}
                            title="Marcar como Concluído"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {app.status !== "CANCELLED" && (
                          <button
                            onClick={() => updateStatus(app.id, "CANCELLED")}
                            title="Cancelar Agendamento"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(app.id)}
                          title="Excluir"
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
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

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {filteredAppointments.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3 shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{app.customer.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">{app.customer.phone}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      app.status === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-700"
                        : app.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700"
                        : app.status === "CANCELLED"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
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
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200/70 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Serviço:</span>
                    <span className="font-bold text-gray-900">{app.service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Barbeiro:</span>
                    <span className="font-bold text-gray-900">{app.barber.name}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-100">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> Data & Hora:
                    </span>
                    <span className="font-black text-gray-900">
                      {new Date(app.date).toLocaleDateString("pt-BR")} às {app.startTime}
                    </span>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex justify-end gap-2 pt-1">
                  {app.status !== "COMPLETED" && (
                    <button
                      onClick={() => updateStatus(app.id, "COMPLETED")}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-blue-100 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Concluir
                    </button>
                  )}
                  {app.status !== "CANCELLED" && (
                    <button
                      onClick={() => updateStatus(app.id, "CANCELLED")}
                      className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-amber-100 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancelar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-1.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
