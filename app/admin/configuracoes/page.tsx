"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Upload } from "lucide-react";

export default function AdminConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [settings, setSettings] = useState({
    shopName: "Atlas Reserve",
    whatsapp: "(11) 99999-9999",
    instagram: "@atlasreserve",
    address: "Rua Exemplo, 123 - Centro, São Paulo",
    logoUrl: "/logo.jpg",
    primaryColor: "#000000",
    secondaryColor: "#D4AF37",
    landingText: "Experiência premium de barbearia.",
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({
          shopName: data.shopName || "Atlas Reserve",
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          address: data.address || "",
          logoUrl: data.logoUrl || "/logo.jpg",
          primaryColor: data.primaryColor || "#000000",
          secondaryColor: data.secondaryColor || "#D4AF37",
          landingText: data.landingText || "",
        });
      }
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setSettings((prev) => ({ ...prev, logoUrl: result.url }));
    } catch (err: any) {
      alert("Erro ao enviar logo para Vercel Blob: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        alert("Configurações salvas com sucesso no banco de dados!");
      } else {
        alert("Erro ao salvar configurações");
      }
    } catch (err: any) {
      alert("Erro de conexão: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-gray-600">Personalize as informações e marca da barbearia</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Informações Básicas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Barbearia</label>
              <input
                type="text"
                value={settings.shopName}
                onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp</label>
              <input
                type="tel"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram</label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Endereço Completo</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Identidade Visual & Logo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Identidade Visual & Logo</h2>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <label className="block text-sm font-medium mb-2">Logo Oficial (Vercel Blob)</label>
              <div className="flex items-center gap-4">
                <img src={settings.logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-contain border border-gray-200 bg-black p-1" />
                <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer text-sm font-medium text-gray-700 transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Enviando..." : "Alterar Logo"}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Texto Destaque (Hero)</label>
              <input
                type="text"
                value={settings.landingText}
                onChange={(e) => setSettings({ ...settings, landingText: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
