"use client";

import { useEffect, useState } from "react";
import { Plus, ExternalLink, Trash2, Edit2, Upload, Loader2, X } from "lucide-react";
import Link from "next/link";

interface Barber {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  phone: string | null;
  photoUrl: string | null;
  isActive: boolean;
}

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
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", specialty: "", phone: "", photoUrl: "" });
    }
    setIsModalOpen(true);
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
      if (res.ok) {
        fetchBarbers();
      }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Barbeiros</h1>
          <p className="text-gray-600">Gerencie a equipe e links de agendamento</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
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
          Nenhum barbeiro cadastrado no banco de dados. Clique em "Novo Barbeiro" para adicionar.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-4 font-medium">Barbeiro</th>
                  <th className="px-6 py-4 font-medium">Especialidade</th>
                  <th className="px-6 py-4 font-medium">Telefone</th>
                  <th className="px-6 py-4 font-medium">Link Exclusivo</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {barbers.map((barber) => (
                  <tr key={barber.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      {barber.photoUrl ? (
                        <img src={barber.photoUrl} alt={barber.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                          {barber.name.charAt(0)}
                        </div>
                      )}
                      <span>{barber.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{barber.specialty}</td>
                    <td className="px-6 py-4 text-gray-600">{barber.phone || "-"}</td>
                    <td className="px-6 py-4">
                      <Link href={`/agenda/${barber.slug}`} target="_blank" className="text-black font-semibold hover:underline inline-flex items-center gap-1">
                        /agenda/{barber.slug}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(barber)}
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          barber.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {barber.isActive ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleOpenModal(barber)} className="p-1.5 text-gray-600 hover:text-black transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(barber.id)} className="p-1.5 text-red-500 hover:text-red-700 transition-colors">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingId ? "Editar Barbeiro" : "Novo Barbeiro"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Foto do Barbeiro (Vercel Blob)</label>
                <div className="flex items-center gap-3">
                  {formData.photoUrl && (
                    <img src={formData.photoUrl} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer text-sm font-medium text-gray-700 transition-colors">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? "Enviando para Vercel Blob..." : "Escolher Imagem"}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-5 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
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
