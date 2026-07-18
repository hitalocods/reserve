"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User, Loader2, Calendar } from "lucide-react";

export default function BarberPage() {
  const params = useParams();
  const barberSlug = params.barberSlug as string;

  const [barber, setBarber] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBarberData() {
      try {
        setLoading(true);
        const resBarbers = await fetch("/api/barbers");
        if (resBarbers.ok) {
          const barbersList = await resBarbers.json();
          const found = barbersList.find((b: any) => b.slug === barberSlug);
          if (found) {
            setBarber(found);
            const resApps = await fetch(`/api/appointments?barberId=${found.id}`);
            if (resApps.ok) {
              setAppointments(await resApps.json());
            }
          }
        }
      } catch (err) {
        console.error("Erro ao carregar agenda do barbeiro:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBarberData();
  }, [barberSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Barbeiro não encontrado</h1>
          <Link href="/" className="text-black font-bold hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            {barber.photoUrl ? (
              <img
                src={barber.photoUrl}
                alt={barber.name}
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center font-bold text-2xl">
                {barber.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{barber.name}</h1>
              <p className="text-gray-600 font-medium">{barber.specialty}</p>
            </div>
          </div>
          <Link
            href={`/agendar?barbeiro=${barber.slug}`}
            className="hidden sm:flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-bold hover:bg-neutral-800 transition-colors shadow-sm text-sm"
          >
            <Calendar className="w-4 h-4" />
            Agendar com {barber.name.split(" ")[0]}
          </Link>
        </div>
      </header>

      {/* Today's Appointments */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold">Agenda em Tempo Real</h2>
            <p className="text-gray-500 text-sm">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium mb-4">Nenhum agendamento ativo para este barbeiro.</p>
            <Link
              href={`/agendar?barbeiro=${barber.slug}`}
              className="inline-block bg-black text-white px-6 py-2.5 rounded-full font-bold hover:bg-neutral-800 transition-colors text-sm"
            >
              Realizar Primeiro Agendamento
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-black font-bold">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{appointment.customer?.name}</h3>
                    <p className="text-gray-600 text-sm">{appointment.service?.name}</p>
                    {appointment.notes && (
                      <p className="text-gray-500 text-xs mt-1 italic">Obs: {appointment.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {appointment.startTime} - {appointment.endTime}
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                      appointment.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : appointment.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appointment.status === "CONFIRMED"
                      ? "Confirmado"
                      : appointment.status === "COMPLETED"
                      ? "Concluído"
                      : "Pendente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
