import { Plus } from "lucide-react";

// Mock data
const services = [
  { id: "1", name: "Corte Clássico", description: "Corte tradicional com acabamento perfeito", price: 45, duration: 30, isActive: true },
  { id: "2", name: "Barba Completa", description: "Aparo, modelagem e hidratação", price: 35, duration: 20, isActive: true },
  { id: "3", name: "Corte + Barba", description: "Combo completo com desconto", price: 70, duration: 50, isActive: true },
];

export default function AdminServicosPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Serviços</h1>
          <p className="text-gray-600">Gerencie os serviços oferecidos</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800">
          <Plus className="w-5 h-5" />
          Novo Serviço
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Serviço</th>
                <th className="px-6 py-4 font-medium">Descrição</th>
                <th className="px-6 py-4 font-medium">Preço</th>
                <th className="px-6 py-4 font-medium">Duração</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{service.name}</td>
                  <td className="px-6 py-4 text-gray-600">{service.description}</td>
                  <td className="px-6 py-4 font-black text-black">R${service.price}</td>
                  <td className="px-6 py-4">{service.duration} min</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${service.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {service.isActive ? "Ativo" : "Inativo"}
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
