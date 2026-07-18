export default function AdminConfiguracoesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-gray-600">Personalize as informações da barbearia</p>
      </div>

      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Informações Básicas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Barbearia</label>
              <input type="text" defaultValue="Barbearia Premium" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp</label>
              <input type="tel" defaultValue="(11) 99999-9999" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram</label>
              <input type="text" defaultValue="@barbeariapremium" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Endereço</label>
              <input type="text" defaultValue="Rua Exemplo, 123 - Centro, São Paulo" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Cores */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Identidade Visual</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Cor Principal</label>
              <div className="flex items-center gap-3">
                <input type="color" defaultValue="#000000" className="w-12 h-12 rounded-lg cursor-pointer" />
                <span className="text-gray-600">#000000</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cor Secundária</label>
              <div className="flex items-center gap-3">
                <input type="color" defaultValue="#D4AF37" className="w-12 h-12 rounded-lg cursor-pointer" />
                <span className="text-gray-600">#D4AF37</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
