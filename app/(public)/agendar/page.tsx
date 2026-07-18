"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  imageUrl: string | null;
}

interface BarberItem {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  photoUrl: string | null;
  color: string;
  workDays: string[];
  startTime: string;
  endTime: string;
}

function generateTimeSlots(startTime: string, endTime: string, duration: number) {
  const slots = [];
  let [startHour, startMinute] = (startTime || "09:00").split(":").map(Number);
  let [endHour, endMinute] = (endTime || "19:00").split(":").map(Number);

  let totalStartMinutes = startHour * 60 + startMinute;
  const totalEndMinutes = endHour * 60 + endMinute - duration;

  while (totalStartMinutes <= totalEndMinutes) {
    const hour = Math.floor(totalStartMinutes / 60).toString().padStart(2, "0");
    const minute = (totalStartMinutes % 60).toString().padStart(2, "0");
    slots.push(`${hour}:${minute}`);
    totalStartMinutes += duration;
  }

  return slots;
}

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [barbers, setBarbers] = useState<BarberItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<BarberItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoadingData(true);
        const [resServ, resBarb] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/barbers"),
        ]);
        if (resServ.ok && resBarb.ok) {
          const dataServ = await resServ.json();
          const dataBarb = await resBarb.json();
          setServices(dataServ);
          setBarbers(dataBarb);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do banco:", err);
      } finally {
        setLoadingData(false);
      }
    }
    loadInitialData();
  }, []);

  const handleNextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime || !customerName || !customerPhone) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId: selectedBarber.id,
          serviceId: selectedService.id,
          customerName,
          customerPhone,
          date: selectedDate,
          startTime: selectedTime,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Erro ao realizar agendamento: " + (err.error || "Tente novamente"));
        return;
      }

      setSuccess(true);

      // Optionally open WhatsApp
      const message = encodeURIComponent(
        `Olá! Agendei pelo site Atlas Reserve:\n\n` +
        `Nome: ${customerName}\n` +
        `Telefone: ${customerPhone}\n` +
        `Serviço: ${selectedService.name}\n` +
        `Barbeiro: ${selectedBarber.name}\n` +
        `Data: ${selectedDate}\n` +
        `Horário: ${selectedTime}\n\n` +
        `Confirmação enviada pelo sistema.`
      );
      window.open(`https://wa.me/5511999999999?text=${message}`, "_blank");
    } catch (err: any) {
      alert("Erro de conexão: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const dates = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-neutral-50 rounded-3xl p-8 border border-neutral-100 shadow-lg">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Agendamento Confirmado!</h1>
          <p className="text-neutral-500 mb-6 font-medium">
            Seu agendamento foi registrado com sucesso no banco de dados.
          </p>
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 text-left space-y-2 text-sm mb-8">
            <p><strong>Cliente:</strong> {customerName}</p>
            <p><strong>Barbeiro:</strong> {selectedBarber?.name}</p>
            <p><strong>Serviço:</strong> {selectedService?.name}</p>
            <p><strong>Data/Hora:</strong> {selectedDate} às {selectedTime}</p>
          </div>
          <Link
            href="/"
            className="inline-block w-full bg-black text-white py-3.5 rounded-full font-bold hover:bg-neutral-800 transition-colors"
          >
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Voltar para Home
        </Link>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-12 max-w-lg mx-auto">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300 ${
                  num < step
                    ? "bg-black text-white"
                    : num === step
                    ? "bg-black text-white ring-2 ring-offset-2 ring-black"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {num < step ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : num}
              </div>
              {num < 5 && (
                <div
                  className={`flex-1 h-[2px] mx-1 sm:mx-2 transition-all duration-300 ${
                    num < step ? "bg-black" : "bg-neutral-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && (
              <Step1
                services={services}
                selectedService={selectedService}
                onSelect={setSelectedService}
                onNext={handleNextStep}
              />
            )}
            {step === 2 && (
              <Step2
                barbers={barbers}
                selectedBarber={selectedBarber}
                onSelect={setSelectedBarber}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
              />
            )}
            {step === 3 && (
              <Step3
                dates={dates}
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
              />
            )}
            {step === 4 && selectedBarber && selectedService && (
              <Step4
                barber={selectedBarber}
                service={selectedService}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelect={setSelectedTime}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
              />
            )}
            {step === 5 && (
              <Step5
                customerName={customerName}
                customerPhone={customerPhone}
                onNameChange={setCustomerName}
                onPhoneChange={setCustomerPhone}
                onSubmit={handleSubmit}
                onPrev={handlePrevStep}
                submitting={submitting}
                booking={{
                  service: selectedService!,
                  barber: selectedBarber!,
                  date: selectedDate!,
                  time: selectedTime!,
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Step1({
  services,
  selectedService,
  onSelect,
  onNext,
}: {
  services: ServiceItem[];
  selectedService: ServiceItem | null;
  onSelect: (service: ServiceItem) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Escolha o Serviço</h2>
      <div className="grid gap-4 mb-8">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={`flex items-center gap-4 p-5 border-2 rounded-2xl text-left transition-all ${
              selectedService?.id === service.id
                ? "border-black bg-neutral-50 shadow-sm"
                : "border-neutral-200 hover:border-neutral-400"
            }`}
          >
            <div className="flex-1">
              <h3 className="font-bold text-lg tracking-tight">{service.name}</h3>
              <p className="text-neutral-500 text-sm font-medium">{service.duration} minutos</p>
            </div>
            <div className="text-black font-black text-xl">R${service.price}</div>
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!selectedService}
        className="w-full bg-black text-white py-4 rounded-full font-bold border border-black hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-30 disabled:hover:bg-black disabled:hover:text-white disabled:cursor-not-allowed"
      >
        Próximo Passo
      </button>
    </div>
  );
}

function Step2({
  barbers,
  selectedBarber,
  onSelect,
  onNext,
  onPrev,
}: {
  barbers: BarberItem[];
  selectedBarber: BarberItem | null;
  onSelect: (barber: BarberItem) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div>
      <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Escolha o Barbeiro</h2>
      <div className="grid gap-4 mb-8">
        {barbers.map((barber) => (
          <button
            key={barber.id}
            onClick={() => onSelect(barber)}
            className={`flex items-center gap-4 p-4 border-2 rounded-2xl text-left transition-all ${
              selectedBarber?.id === barber.id
                ? "border-black bg-neutral-50 shadow-sm"
                : "border-neutral-200 hover:border-neutral-400"
            }`}
          >
            {barber.photoUrl ? (
              <img
                src={barber.photoUrl}
                alt={barber.name}
                className="w-16 h-16 rounded-full object-cover border border-neutral-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl">
                {barber.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-lg tracking-tight">{barber.name}</h3>
              <p className="text-neutral-500 text-sm font-medium">{barber.specialty}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={onPrev}
          className="flex-1 border-2 border-black py-4 rounded-full font-bold hover:bg-neutral-50 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!selectedBarber}
          className="flex-1 bg-black text-white py-4 rounded-full font-bold border border-black hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-30 disabled:hover:bg-black disabled:hover:text-white disabled:cursor-not-allowed"
        >
          Próximo Passo
        </button>
      </div>
    </div>
  );
}

function Step3({
  dates,
  selectedDate,
  onSelect,
  onNext,
  onPrev,
}: {
  dates: string[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return {
      weekday: dayNames[date.getDay()],
      day: date.getDate().toString().padStart(2, "0"),
      month: monthNames[date.getMonth()],
    };
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-6">Escolha a Data</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-8">
        {dates.map((date) => {
          const { weekday, day, month } = formatDate(date);
          return (
            <button
              key={date}
              onClick={() => onSelect(date)}
              className={`p-2 sm:p-3 border-2 rounded-xl text-center transition-all ${
                selectedDate === date
                  ? "border-black bg-black text-white shadow-sm"
                  : "border-neutral-200 hover:border-neutral-400 bg-white text-neutral-900"
              }`}
            >
              <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${selectedDate === date ? "text-neutral-300" : "text-neutral-400"}`}>{weekday}</div>
              <div className="text-base sm:text-xl font-black my-0.5">{day}</div>
              <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${selectedDate === date ? "text-neutral-300" : "text-neutral-400"}`}>{month}</div>
            </button>
          );
        })}
      </div>
      <div className="flex gap-4">
        <button
          onClick={onPrev}
          className="flex-1 border-2 border-black py-3.5 rounded-full font-bold hover:bg-neutral-50 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!selectedDate}
          className="flex-1 bg-black text-white py-3.5 rounded-full font-bold border border-black hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-30 disabled:hover:bg-black disabled:hover:text-white disabled:cursor-not-allowed"
        >
          Próximo Passo
        </button>
      </div>
    </div>
  );
}

function Step4({
  barber,
  service,
  selectedDate,
  selectedTime,
  onSelect,
  onNext,
  onPrev,
}: {
  barber: BarberItem;
  service: ServiceItem;
  selectedDate: string | null;
  selectedTime: string | null;
  onSelect: (time: string) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const timeSlots = generateTimeSlots(barber.startTime, barber.endTime, service.duration);

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-6">Escolha o Horário</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-8">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => onSelect(time)}
            className={`py-2.5 px-2 sm:py-3 sm:px-4 border-2 rounded-xl text-center text-xs sm:text-sm font-bold transition-all ${
              selectedTime === time
                ? "border-black bg-black text-white shadow-sm"
                : "border-neutral-200 hover:border-neutral-400 text-neutral-800 bg-white"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={onPrev}
          className="flex-1 border-2 border-black py-3.5 rounded-full font-bold hover:bg-neutral-50 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!selectedTime}
          className="flex-1 bg-black text-white py-3.5 rounded-full font-bold border border-black hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-30 disabled:hover:bg-black disabled:hover:text-white disabled:cursor-not-allowed"
        >
          Próximo Passo
        </button>
      </div>
    </div>
  );
}

function Step5({
  customerName,
  customerPhone,
  onNameChange,
  onPhoneChange,
  onSubmit,
  onPrev,
  submitting,
  booking,
}: {
  customerName: string;
  customerPhone: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onSubmit: () => void;
  onPrev: () => void;
  submitting: boolean;
  booking: { service: ServiceItem; barber: BarberItem; date: string; time: string };
}) {
  return (
    <div>
      <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Seus Dados</h2>

      <div className="bg-neutral-50 rounded-2xl p-6 mb-8 border border-neutral-100">
        <h3 className="font-bold text-lg tracking-tight mb-4 uppercase">Resumo do Agendamento</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500 font-medium">Serviço</span>
            <span className="font-bold">{booking.service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 font-medium">Barbeiro</span>
            <span className="font-bold">{booking.barber.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 font-medium">Data</span>
            <span className="font-bold">{booking.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 font-medium">Horário</span>
            <span className="font-bold">{booking.time}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-neutral-200">
            <span className="font-black uppercase tracking-wider text-neutral-500">Total</span>
            <span className="font-black text-black text-xl">R${booking.service.price}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">Nome Completo</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Seu nome completo"
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-black font-medium transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">Telefone / WhatsApp</label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="(11) 99999-9999"
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-black font-medium transition-all"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPrev}
          className="flex-1 border-2 border-black py-4 rounded-full font-bold hover:bg-neutral-50 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={onSubmit}
          disabled={!customerName || !customerPhone || submitting}
          className="flex-1 bg-black text-white border border-black py-4 rounded-full font-bold disabled:opacity-30 flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all duration-300"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? "Finalizando..." : "Confirmar Agendamento"}
        </button>
      </div>
    </div>
  );
}
