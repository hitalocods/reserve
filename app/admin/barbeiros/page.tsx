import { Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

// Mock data
const barbers = [
  { id: "1", name: "João Silva", slug: "joao-silva", specialty: "Cortes Clássicos", phone: "(11) 91234-5678", isActive: true },
  { id: "2", name: "Pedro Santos", slug: "pedro-santos", specialty: "Barbas Modernas", phone: "(11) 99876-5432", isActive: true },
];

export default function AdminBarbeirosPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Barbeiros</h1>
          <p className="text-gray-600">Gerencie os barbeiros da equipe</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800">
          <Plus className="w-5 h-5" />
          Novo Barbeiro
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">Especialidade</th>
                <th className="px-6 py-4 font-medium">Telefone</th>
                <th className="px-6 py-4 font-medium">Link Exclusivo</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {barbers.map((barber) => (
                <tr key={barber.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{barber.name}</td>
                  <td className="px-6 py-4 text-gray-600">{barber.specialty}</td>
                  <td className="px-6 py-4">{barber.phone}</td>
                  <td className="px-6 py-4">
                    <Link href={`/agenda/${barber.slug}`} target="_blank" className="text-black font-semibold hover:underline inline-flex items-center gap-1">
                      /agenda/{barber.slug}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${barber.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {barber.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-sm text-black font-semibold hover:underline mr-3">Editar</button>
                    <button className="text-sm text-red-500 hover:underline">Excluir</button>
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
