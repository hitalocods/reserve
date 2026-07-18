"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
  Loader2,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Receipt,
  X,
  Clock,
  User,
} from "lucide-react";

interface Appointment {
  id: string;
  customerId: string;
  customer?: { name: string; phone: string };
  barberId: string;
  barber?: { name: string };
  service?: { name: string; price: any };
  date: string;
  startTime: string;
  status: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"day" | "week" | "month" | "all" | "custom">("month");
  const [customDate, setCustomDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Expense Modal state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [savingExpense, setSavingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    category: "Geral",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resApps, resExp] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/expenses"),
      ]);

      if (resApps.ok) setAppointments(await resApps.json());
      if (resExp.ok) setExpenses(await resExp.json());
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter Data by Period
  const filterByPeriod = (dateStr: string) => {
    const itemDate = new Date(dateStr);
    const now = new Date();

    if (period === "custom" && customDate) {
      const selected = new Date(customDate + "T00:00:00");
      return (
        itemDate.getFullYear() === selected.getFullYear() &&
        itemDate.getMonth() === selected.getMonth() &&
        itemDate.getDate() === selected.getDate()
      );
    } else if (period === "day") {
      return itemDate.toDateString() === now.toDateString();
    } else if (period === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return itemDate >= oneWeekAgo && itemDate <= now;
    } else if (period === "month") {
      return (
        itemDate.getMonth() === now.getMonth() &&
        itemDate.getFullYear() === now.getFullYear()
      );
    }
    return true; // "all"
  };

  const filteredAppointments = appointments.filter((a) => filterByPeriod(a.date));
  const filteredExpenses = expenses.filter((e) => filterByPeriod(e.date));

  // Compute Metrics
  const grossRevenue = filteredAppointments.reduce((sum, a) => {
    return sum + (Number(a.service?.price) || 0);
  }, 0);

  const totalExpenses = filteredExpenses.reduce((sum, e) => {
    return sum + (Number(e.amount) || 0);
  }, 0);

  const netProfit = grossRevenue - totalExpenses;
  const totalBookings = filteredAppointments.length;
  const averageTicket = totalBookings > 0 ? grossRevenue / totalBookings : 0;

  // Revenue per Barber calculation
  const barberRevenueMap: { [barberName: string]: number } = {};
  filteredAppointments.forEach((a) => {
    const barberName = a.barber?.name || "Outro";
    const price = Number(a.service?.price) || 0;
    barberRevenueMap[barberName] = (barberRevenueMap[barberName] || 0) + price;
  });

  const barberRevenueList = Object.entries(barberRevenueMap).map(([name, total]) => ({
    name,
    total,
    percentage: grossRevenue > 0 ? Math.round((total / grossRevenue) * 100) : 0,
  }));

  // Handle Add Expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.description || !expenseForm.amount) return;

    try {
      setSavingExpense(true);
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseForm),
      });

      if (res.ok) {
        setIsExpenseModalOpen(false);
        setExpenseForm({ description: "", amount: "", category: "Geral" });
        fetchData();
      }
    } catch (err) {
      console.error("Erro ao adicionar despesa:", err);
    } finally {
      setSavingExpense(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Excluir esta despesa?")) return;
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Erro ao excluir despesa:", err);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Top Header & Period Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Dashboard Financeiro
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Acompanhe faturamento, despesas e desempenho da equipe
          </p>
        </div>

        {/* Period Selector Tabs & Custom Date Picker */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-gray-200/70 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setPeriod("day")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === "day" ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
              }`}
            >
              Diário
            </button>
            <button
              onClick={() => setPeriod("week")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === "week" ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setPeriod("month")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === "month" ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setPeriod("all")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === "all" ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
              }`}
            >
              Geral
            </button>
            <button
              onClick={() => setPeriod("custom")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === "custom" ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
              }`}
            >
              Data Específica
            </button>
          </div>

          {period === "custom" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-bold bg-white text-black shadow-sm focus:outline-none focus:border-black"
            />
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-16 bg-white rounded-3xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* Main Financial Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Card 1: Faturamento Bruto */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Faturamento Bruto
                </span>
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-gray-900">
                  R$ {grossRevenue.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400 font-medium mt-1">
                  {totalBookings} agendamento(s)
                </div>
              </div>
            </div>

            {/* Card 2: Despesas */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Despesas
                </span>
                <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-rose-600">
                  R$ {totalExpenses.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400 font-medium mt-1">
                  {filteredExpenses.length} despesa(s) registrada(s)
                </div>
              </div>
            </div>

            {/* Card 3: Lucro Líquido */}
            <div className="bg-black text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Lucro Líquido
                </span>
                <div className="p-2.5 rounded-2xl bg-neutral-800 text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  R$ {netProfit.toFixed(2)}
                </div>
                <div className="text-xs text-neutral-400 font-medium mt-1">
                  Bruto - Despesas
                </div>
              </div>
            </div>

            {/* Card 4: Ticket Médio */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Ticket Médio
                </span>
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-gray-900">
                  R$ {averageTicket.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400 font-medium mt-1">
                  Média por cliente
                </div>
              </div>
            </div>
          </div>

          {/* Barber Breakdown & Expense Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Faturamento por Barbeiro */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-bold text-gray-900">Faturamento por Barbeiro</h2>
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {period === "day" ? "Hoje" : period === "week" ? "Semana" : period === "month" ? "Este Mês" : "Geral"}
                </span>
              </div>

              {barberRevenueList.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">
                  Nenhum faturamento registrado no período.
                </p>
              ) : (
                <div className="space-y-4">
                  {barberRevenueList.map((item, index) => (
                    <div key={index} className="space-y-1.5">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-gray-800">{item.name}</span>
                        <span className="text-gray-900">
                          R$ {item.total.toFixed(2)}{" "}
                          <span className="text-xs text-gray-400 font-normal">
                            ({item.percentage}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-black h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Gerenciamento de Despesas */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-bold text-gray-900">Lançamento de Despesas</h2>
                </div>
                <button
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="flex items-center gap-1.5 bg-black text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Nova Despesa
                </button>
              </div>

              {filteredExpenses.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">
                  Nenhuma despesa lançada no período. Clique em "Nova Despesa" para cadastrar.
                </p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {filteredExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100/80 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-sm text-gray-900">{exp.description}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(exp.date).toLocaleDateString("pt-BR")} • {exp.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-rose-600 text-sm">
                          - R$ {Number(exp.amount).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Próximos Agendamentos (Tabela Otimizada para Mobile) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Agendamentos Recentes</h2>
              <span className="text-xs text-gray-400 font-semibold">
                Total: {filteredAppointments.length}
              </span>
            </div>

            {filteredAppointments.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">
                Nenhum agendamento encontrado para o período selecionado.
              </p>
            ) : (
              <div className="space-y-3 md:space-y-0 md:overflow-x-auto">
                {/* Desktop Table View */}
                <table className="hidden md:table w-full text-left">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-gray-100">
                      <th className="pb-3 font-semibold uppercase">Cliente</th>
                      <th className="pb-3 font-semibold uppercase">Serviço</th>
                      <th className="pb-3 font-semibold uppercase">Barbeiro</th>
                      <th className="pb-3 font-semibold uppercase">Data / Horário</th>
                      <th className="pb-3 font-semibold uppercase">Valor</th>
                      <th className="pb-3 font-semibold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {filteredAppointments.slice(0, 10).map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 font-bold text-gray-900">{a.customer?.name || "Cliente"}</td>
                        <td className="py-3.5 text-gray-600">{a.service?.name || "-"}</td>
                        <td className="py-3.5 text-gray-600">{a.barber?.name || "-"}</td>
                        <td className="py-3.5 font-semibold text-gray-900">
                          {new Date(a.date).toLocaleDateString("pt-BR")} às {a.startTime}
                        </td>
                        <td className="py-3.5 font-bold text-gray-900">
                          R$ {Number(a.service?.price || 0).toFixed(2)}
                        </td>
                        <td className="py-3.5">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            {a.status === "CONFIRMED" ? "Confirmado" : a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Cards View */}
                <div className="md:hidden space-y-3">
                  {filteredAppointments.slice(0, 10).map((a) => (
                    <div
                      key={a.id}
                      className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-gray-900 text-base">
                            {a.customer?.name || "Cliente"}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {a.service?.name} com {a.barber?.name}
                          </div>
                        </div>
                        <span className="text-sm font-black text-gray-900">
                          R$ {Number(a.service?.price || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200/60">
                        <div className="flex items-center gap-1 font-semibold text-gray-700">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(a.date).toLocaleDateString("pt-BR")} às {a.startTime}
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Confirmado
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal Lançar Despesa */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Lançar Nova Despesa</h2>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                  Descrição da Conta / Gasto
                </label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black"
                  placeholder="Ex: Aluguel, Produtos de Limpeza, Conta de Luz"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={expenseForm.amount}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, amount: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black"
                    placeholder="150.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Categoria
                  </label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, category: e.target.value })
                    }
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-black"
                  >
                    <option value="Geral">Geral</option>
                    <option value="Produtos">Produtos</option>
                    <option value="Contas Fixas">Contas Fixas</option>
                    <option value="Equipamentos">Equipamentos</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingExpense}
                  className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {savingExpense && <Loader2 className="w-4 h-4 animate-spin" />}
                  Salvar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
