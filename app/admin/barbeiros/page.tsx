"use client";

import { useEffect, useState } from "react";
import { Plus, ExternalLink, Trash2, Edit2, Upload, Loader2, X, Clock, Calendar } from "lucide-react";
import Link from "next/link";

interface Barber {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  phone: string | null;
  photoUrl: string | null;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  workDays: string[];
  isActive: boolean;
}

const WEEKDAYS = [
  { id: "1", label: "Seg" },
  { id: "2", label: "Ter" },
  { id: "3", label: "Qua" },
  { id: "4", label: "Qui" },
  { id: "5", label: "Sex" },
  { id: "6", label: "Sáb" },
  { id: "0", label: "Dom" },
];

export default function AdminBarbeirosPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    photoUrl: "",
    startTime: "09:00",
    endTime: "19:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    workDays: ["1", "2", "3", "4", "5", "6"],
  });

  const fetchBarbers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/barbers");
      if (res.ok) {
        const data = await res.json();
        setBarbers(data);
      }
    } catch (err) {
      console.error("Erro ao buscar barbeiros:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const handleOpenModal = (barber?: Barber) => {
    if (barber) {
      setEditingId(barber.id);
      setFormData({
        name: barber.name,
        specialty: barber.specialty,
        phone: barber.phone || "",
        photoUrl: barber.photoUrl || "",
        startTime: barber.startTime || "09:00",
        endTime: barber.endTime || "19:00",
        breakStart: barber.breakStart || "12:00",
        breakEnd: barber.breakEnd || "13:00",
        workDays: barber.workDays && barber.workDays.length > 0 ? barber.workDays : ["1", "2", "3", "4", "5", "6"],
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        specialty: "",
        phone: "",
        photoUrl: "",
        startTime: "09:00",
        endTime: "19:00",
        breakStart: "12:00",
        breakEnd: "13:00",
        workDays: ["1", "2", "3", "4", "5", "6"],
      });
    }
    setIsModalOpen(true);
  };

  const handleDayToggle = (dayId: string) => {
    setFormData((prev) => {
      const exists = prev.workDays.includes(dayId);
      if (exists) {
        return { ...prev, workDays: prev.workDays.filter((d) => d !== dayId) };
      } else {
        return { ...prev, workDays: [...prev.workDays, dayId] };
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Falha no upload");

      const result = await res.json();
      setFormData((prev) => ({ ...prev, photoUrl: result.url }));
    } catch (err: any) {
      alert("Erro ao enviar imagem para Vercel Blob: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.specialty) {
      alert("Por favor preencha nome e especialidade");
      return;
    }

    try {
      setSubmitting(true);
      const url = editingId ? `/api/barbers/${editingId}` : "/api/barbers";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchBarbers();
      } else {
        const err = await res.json();
        alert("Erro ao salvar barbeiro: " + (err.error || "Tente novamente"));
      }
    } catch (err: any) {
      alert("Erro na conexão: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este barbeiro?")) return;
    try {
      const res = await fetch(`/api/barbers/${id}`, { method: "DELETE" });
      if (res.ok) fetchBarbers();
    } catch (err) {
      console.error("Erro ao deletar barbeiro:", err);
    }
  };

  const toggleActive = async (barber: Barber) => {
    try {
      await fetch(`/api/barbers/${barber.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !barber.isActive }),
      });
      fetchBarbers();
    } catch (err) {
      console.error("Erro ao alterar status:", err);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Barbeiros & Horários</h1>
          <p className="text-gray-600 text-sm">Gerencie horários, dias de atendimento e bloqueios</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm text-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Barbeiro
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : barbers.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-gray-100 text-gray-500">
          Nenhum barbeiro cadastrado. Clique em "Novo Barbeiro" para adicionar.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Barbeiro</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Horários</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Dias de Trabalho</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Link Exclusivo</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {barbers.map((barber) => (
                  <tr key={barber.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        {barber.photoUrl ? (
                          <img src={barber.photoUrl} alt={barber.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                            {barber.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900">{barber.name}</div>
                          <div className="text-xs text-gray-500">{barber.specialty}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{barber.startTime || "09:00"} - {barber.endTime || "19:00"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {WEEKDAYS.map((day) => {
                          const isWorking = barber.workDays?.includes(day.id);
                          return (
                            <span
                              key={day.id}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isWorking ? "bg-black text-white" : "bg-gray-100 text-gray-400 line-through"
                              }`}
                            >
                              {day.label}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/agenda/${barber.slug}`} target="_blank" className="text-black font-semibold hover:underline inline-flex items-center gap-1 text-xs">
                        /agenda/{barber.slug}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(barber)}
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          barber.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {barber.isActive ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenModal(barber)} className="p-1.5 text-gray-600 hover:text-black transition-colors rounded-lg hover:bg-gray-100">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(barber.id)} className="p-1.5 text-red-500 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold">{editingId ? "Editar Barbeiro & Horários" : "Novo Barbeiro"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm"
                  placeholder="Ex: João Silva"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Especialidade</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm"
                  placeholder="Ex: Cortes Clássicos e Barba"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm"
                  placeholder="(11) 99999-9999"
                />
              </div>

              {/* Horários de Trabalho */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Horário de Atendimento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">Início</span>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                    />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">Término</span>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Dias da Semana (Bloqueio Recorrente) */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Dias de Atendimento (Desmarque para Bloquear o Dia)
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {WEEKDAYS.map((day) => {
                    const isSelected = formData.workDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => handleDayToggle(day.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-black text-white shadow-sm"
                            : "bg-white text-gray-400 border border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Foto do Barbeiro (Vercel Blob)</label>
                <div className="flex items-center gap-3">
                  {formData.photoUrl && (
                    <img src={formData.photoUrl} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer text-sm font-medium text-gray-700 transition-colors">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? "Enviando..." : "Escolher Foto"}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Salvar Alterações" : "Cadastrar Barbeiro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
