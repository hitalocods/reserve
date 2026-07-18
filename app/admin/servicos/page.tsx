"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Upload, Loader2, X, Clock, DollarSign } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  imageUrl: string | null;
  isActive: boolean;
}

export default function AdminServicosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "30",
    imageUrl: "",
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error("Erro ao buscar serviços:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingId(service.id);
      setFormData({
        name: service.name,
        description: service.description || "",
        price: service.price.toString(),
        duration: service.duration.toString(),
        imageUrl: service.imageUrl || "",
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", description: "", price: "", duration: "30", imageUrl: "" });
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
      setFormData((prev) => ({ ...prev, imageUrl: result.url }));
    } catch (err: any) {
      alert("Erro ao enviar imagem para Vercel Blob: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.duration) {
      alert("Por favor preencha nome, preço e duração");
      return;
    }

    try {
      setSubmitting(true);
      const url = editingId ? `/api/services/${editingId}` : "/api/services";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchServices();
      } else {
        const err = await res.json();
        alert("Erro ao salvar serviço: " + (err.error || "Tente novamente"));
      }
    } catch (err: any) {
      alert("Erro na conexão: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.ok) fetchServices();
    } catch (err) {
      console.error("Erro ao deletar serviço:", err);
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      await fetch(`/api/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !service.isActive }),
      });
      fetchServices();
    } catch (err) {
      console.error("Erro ao alterar status:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Serviços</h1>
          <p className="text-gray-600">Gerencie os serviços oferecidos pela barbearia</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Serviço
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-gray-100 text-gray-500">
          Nenhum serviço cadastrado. Clique em "Novo Serviço" para adicionar.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <span className="text-xl font-black text-black">R${service.price}</span>
                </div>
                {service.description && (
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{service.description}</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{service.duration} min</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(service)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      service.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {service.isActive ? "Ativo" : "Inativo"}
                  </button>
                  <button onClick={() => handleOpenModal(service)} className="p-1.5 text-gray-600 hover:text-black">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="p-1.5 text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingId ? "Editar Serviço" : "Novo Serviço"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome do Serviço</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  placeholder="Ex: Corte Clássico"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black resize-none h-20"
                  placeholder="Descrição detalhada do serviço"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                    placeholder="45.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duração (minutos)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                    placeholder="30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Imagem Ilustrativa (Vercel Blob)</label>
                <div className="flex items-center gap-3">
                  {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
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
                  {editingId ? "Salvar Alterações" : "Cadastrar Serviço"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
