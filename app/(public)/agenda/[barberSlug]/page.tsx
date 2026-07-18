"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";

// Mock data
const barbers = [
  {
    id: "1",
    name: "João Silva",
    slug: "joao-silva",
    specialty: "Cortes Clássicos",
    photoUrl: "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=professional%20barber%20man%20portrait%20clean%20minimal&image_size=square",
    color: "#D4AF37",
  },
  {
    id: "2",
    name: "Pedro Santos",
    slug: "pedro-santos",
    specialty: "Barbas Modernas",
    photoUrl: "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=professional%20barber%20man%20portrait%20modern%20style&image_size=square",
    color: "#333333",
  },
];

const mockAppointments = [
  {
    id: "1",
    customerName: "Carlos Pereira",
    customerPhone: "(11) 98765-4321",
    serviceName: "Corte Clássico",
    time: "09:30",
    status: "CONFIRMED",
    notes: "",
  },
  {
    id: "2",
    customerName: "Lucas Almeida",
    customerPhone: "(11) 91234-5678",
    serviceName: "Corte + Barba",
    time: "10:30",
    status: "PENDING",
    notes: "Prefere laterais mais curtos",
  },
  {
    id: "3",
    customerName: "Marcos Silva",
    customerPhone: "(11) 99876-5432",
    serviceName: "Barba Completa",
    time: "11:30",
    status: "PENDING",
    notes: "",
  },
];

export default function BarberPage() {
  const params = useParams();
  const barberSlug = params.barberSlug as string;
  const barber = barbers.find((b) => b.slug === barberSlug);

  if (!barber) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Barbeiro não encontrado</h1>
          <Link href="/" className="text-gold hover:underline">
            Voltar para home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center gap-6">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <img
            src={barber.photoUrl}
            alt={barber.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{barber.name}</h1>
            <p className="text-gray-600">{barber.specialty}</p>
          </div>
        </div>
      </header>

      {/* Today's Appointments */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold">Agenda de Hoje</h2>
            <p className="text-gray-500 text-sm">{new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>

        <div className="space-y-4">
          {mockAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: barber.color }}
                  >
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{appointment.customerName}</h3>
                    <p className="text-gray-600 text-sm">{appointment.serviceName}</p>
                    {appointment.notes && <p className="text-gray-500 text-xs mt-1 italic">Obs: {appointment.notes}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {appointment.time}
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                    appointment.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {appointment.status === "CONFIRMED" ? "Confirmado" : "Pendente"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockAppointments.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">Nenhum agendamento para hoje.</p>
          </div>
        )}
      </main>
    </div>
  );
}
