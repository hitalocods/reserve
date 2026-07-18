"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar as CalendarIcon, Save, Plus, Trash2, Loader2, Check, AlertCircle, Sparkles, Moon, Sun } from "lucide-react";

interface BusinessHour {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface Barber {
  id: string;
  name: string;
}

interface BlockedDate {
  id: string;
  date: string;
  reason: string | null;
  barberId: string | null;
  barber?: { name: string } | null;
}

const WEEKDAYS = [
  { day: 1, name: "Segunda-feira", short: "Seg" },
  { day: 2, name: "Terça-feira", short: "Ter" },
  { day: 3, name: "Quarta-feira", short: "Qua" },
  { day: 4, name: "Quinta-feira", short: "Qui" },
  { day: 5, name: "Sexta-feira", short: "Sex" },
  { day: 6, name: "Sábado", short: "Sáb" },
  { day: 0, name: "Domingo", short: "Dom" },
];

export default function AdminHorariosPage() {
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Blocked Date Form
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [newBarberId, setNewBarberId] = useState("");
  const [addingBlocked, setAddingBlocked] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resHours, resBlocked, resBarbers] = await Promise.all([
        fetch("/api/business-hours"),
        fetch("/api/blocked-dates"),
        fetch("/api/barbers"),
      ]);

      if (resHours.ok) setHours(await resHours.json());
      if (resBlocked.ok) setBlockedDates(await resBlocked.json());
      if (resBarbers.ok) setBarbers(await resBarbers.json());
    } catch (err) {
      console.error("Erro ao carregar dados de horários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleClosed = (dayOfWeek: number) => {
    setHours((prev) =>
      prev.map((h) => (h.dayOfWeek === dayOfWeek ? { ...h, isClosed: !h.isClosed } : h))
    );
  };

  const handleTimeChange = (dayOfWeek: number, field: "openTime" | "closeTime", value: string) => {
    setHours((prev) =>
      prev.map((h) => (h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h))
    );
  };

  const handleSaveHours = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/business-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hours),
      });

      if (res.ok) {
        alert("Horários de funcionamento atualizados com sucesso!");
        fetchData();
      } else {
        alert("Erro ao salvar horários de funcionamento");
      }
    } catch (err: any) {
      alert("Erro de conexão: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) {
      alert("Por favor selecione a data para bloquear");
      return;
    }

    try {
      setAddingBlocked(true);
      const res = await fetch("/api/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newDate,
          reason: newReason || null,
          barberId: newBarberId || null,
        }),
      });

      if (res.ok) {
        setNewDate("");
        setNewReason("");
        setNewBarberId("");
        fetchData();
      } else {
        alert("Erro ao adicionar data bloqueada");
      }
    } catch (err: any) {
      alert("Erro na conexão: " + err.message);
    } finally {
      setAddingBlocked(false);
    }
  };

  const handleDeleteBlockedDate = async (id: string) => {
    if (!confirm("Remover esta data bloqueada?")) return;
    try {
      const res = await fetch(`/api/blocked-dates?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Erro ao excluir data bloqueada:", err);
    }
  };

  const applyPresetHours = (open: string, close: string) => {
    setHours((prev) =>
      prev.map((h) => (h.dayOfWeek !== 0 ? { ...h, openTime: open, closeTime: close, isClosed: false } : h))
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-3xl border border-gray-100 min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-amber-500" />
            Horários de Funcionamento
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Defina os horários disponíveis da barbearia para agendamentos dos clientes
          </p>
        </div>

        <button
          onClick={handleSaveHours}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold hover:bg-neutral-800 transition-all shadow-md active:scale-95 disabled:opacity-50 text-sm"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Salvando..." : "Salvar Horários"}
        </button>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5 rounded-3xl border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-black rounded-2xl shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">Configuração Rápida</h3>
            <p className="text-xs text-gray-600">Aplique horários padrão para toda a semana com um clique</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPresetHours("08:00", "19:00")}
            className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold hover:border-black transition-colors shadow-sm"
          >
            08:00 às 19:00
          </button>
          <button
            onClick={() => applyPresetHours("09:00", "20:00")}
            className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold hover:border-black transition-colors shadow-sm"
          >
            09:00 às 20:00
          </button>
        </div>
      </div>

      {/* Days Schedule Grid / Cards */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          Grade Semanal de Atendimento
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {WEEKDAYS.map((wk) => {
            const dayHour = hours.find((h) => h.dayOfWeek === wk.day) || {
              id: "",
              dayOfWeek: wk.day,
              openTime: "09:00",
              closeTime: "19:00",
              isClosed: wk.day === 0,
            };

            return (
              <div
                key={wk.day}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  dayHour.isClosed
                    ? "bg-gray-50/70 border-gray-200/80 opacity-75"
                    : "bg-white border-gray-200 hover:border-amber-400 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-gray-900">{wk.name}</span>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!dayHour.isClosed}
                      onChange={() => handleToggleClosed(wk.day)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {dayHour.isClosed ? (
                  <div className="py-2.5 px-3 rounded-xl bg-gray-200/50 text-gray-500 text-xs font-bold text-center uppercase tracking-wider">
                    Fechado / Folga
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                        Abertura
                      </label>
                      <input
                        type="time"
                        value={dayHour.openTime}
                        onChange={(e) => handleTimeChange(wk.day, "openTime", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white text-gray-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                        Fechamento
                      </label>
                      <input
                        type="time"
                        value={dayHour.closeTime}
                        onChange={(e) => handleTimeChange(wk.day, "closeTime", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white text-gray-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Blocked Dates Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-gray-900">Bloqueio de Datas & Feriados</h2>
          </div>
        </div>

        {/* Add Blocked Date Form */}
        <form onSubmit={handleAddBlockedDate} className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 sm:space-y-0 sm:flex sm:items-end sm:gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              Data a Bloquear
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold bg-white focus:outline-none focus:border-black"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              Motivo (opcional)
            </label>
            <input
              type="text"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="Ex: Feriado, Manutenção"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium bg-white focus:outline-none focus:border-black"
            />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              Barbeiro Específico (opcional)
            </label>
            <select
              value={newBarberId}
              onChange={(e) => setNewBarberId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-medium bg-white focus:outline-none focus:border-black"
            >
              <option value="">Toda a Barbearia</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={addingBlocked}
            className="w-full sm:w-auto bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-50"
          >
            {addingBlocked ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Bloquear Data
          </button>
        </form>

        {/* Blocked Dates List */}
        {blockedDates.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center font-medium">
            Nenhuma data bloqueada cadastrada.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {blockedDates.map((bd) => (
              <div
                key={bd.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100"
              >
                <div>
                  <div className="font-bold text-sm text-rose-950">
                    {new Date(bd.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  </div>
                  <div className="text-xs text-rose-700 font-medium">
                    {bd.reason || "Sem motivo informado"}
                    {bd.barber?.name ? ` (${bd.barber.name})` : " (Toda a Barbearia)"}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteBlockedDate(bd.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
