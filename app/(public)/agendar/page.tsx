"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Calendar, Clock, User, ShieldCheck, Sparkles } from "lucide-react";
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

interface BusinessHour {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface BlockedDateItem {
  id: string;
  date: string;
  barberId: string | null;
  reason: string | null;
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
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDateItem[]>([]);
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
        const [resServ, resBarb, resHours, resBlocked] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/barbers"),
          fetch("/api/business-hours"),
          fetch("/api/blocked-dates"),
        ]);

        if (resServ.ok) setServices(await resServ.json());
        if (resBarb.ok) setBarbers(await resBarb.json());
        if (resHours.ok) setBusinessHours(await resHours.json());
        if (resBlocked.ok) setBlockedDates(await resBlocked.json());
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoadingData(false);
      }
    }
    loadInitialData();
  }, []);

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleSelectBarber = (barber: BarberItem) => {
    setSelectedBarber(barber);
    setStep(3);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep(4);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setStep(5);
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
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white py-16 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full" />
        <div className="pointer-events-none absolute top-1/2 -right-40 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center bg-neutral-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-neutral-800 shadow-2xl relative z-10"
        >
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-amber-300 text-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-white">Agendamento Confirmado!</h1>
          <p className="text-neutral-400 mb-6 font-medium text-sm">
            Seu agendamento foi registrado com sucesso. Nos vemos em breve!
          </p>

          <div className="bg-neutral-950/80 p-5 rounded-2xl border border-neutral-800 text-left space-y-3 text-sm mb-8">
            <div className="flex justify-between border-b border-neutral-800/80 pb-2">
              <span className="text-neutral-400">Cliente</span>
              <span className="font-bold text-white">{customerName}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800/80 pb-2">
              <span className="text-neutral-400">Barbeiro</span>
              <span className="font-bold text-white">{selectedBarber?.name}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800/80 pb-2">
              <span className="text-neutral-400">Serviço</span>
              <span className="font-bold text-white">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Data & Hora</span>
              <span className="font-bold text-amber-400">{selectedDate} às {selectedTime}</span>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block w-full bg-white text-black py-4 rounded-full font-bold hover:bg-amber-400 transition-all duration-300 shadow-lg"
          >
            Voltar para a Página Inicial
          </Link>
        </motion.div>
      </div>
    );
  }

  const stepsLabels = ["Serviço", "Barbeiro", "Data", "Horário", "Confirmação"];

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 py-10 px-4 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Background Fixed Glow Lights */}
      <div className="pointer-events-none fixed -top-40 -left-40 w-[500px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full" />
      <div className="pointer-events-none fixed top-1/3 -right-40 w-[500px] h-[500px] bg-amber-500/5 blur-[140px] rounded-full" />
      <div className="pointer-events-none fixed -bottom-40 left-1/3 w-[500px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header Back Button */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors bg-neutral-900/60 border border-neutral-800 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atlas Reserve</span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 rounded-3xl p-5 mb-8 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Passo {step} de 5
            </span>
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
              {stepsLabels[step - 1]}
            </span>
          </div>
          <div className="w-full bg-neutral-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-neutral-800">
            <motion.div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full shadow-sm"
              initial={{ width: `${((step - 1) / 5) * 100}%` }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Container Card */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <Step1
                  services={services}
                  selectedService={selectedService}
                  onSelect={handleSelectService}
                />
              )}
              {step === 2 && (
                <Step2
                  barbers={barbers}
                  selectedBarber={selectedBarber}
                  onSelect={handleSelectBarber}
                  onPrev={handlePrevStep}
                />
              )}
              {step === 3 && (
                <Step3
                  dates={dates}
                  selectedBarber={selectedBarber}
                  selectedDate={selectedDate}
                  businessHours={businessHours}
                  blockedDates={blockedDates}
                  onSelect={handleSelectDate}
                  onPrev={handlePrevStep}
                />
              )}
              {step === 4 && selectedBarber && selectedService && (
                <Step4
                  barber={selectedBarber}
                  service={selectedService}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  businessHours={businessHours}
                  onSelect={handleSelectTime}
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
    </div>
  );
}

function Step1({
  services,
  selectedService,
  onSelect,
}: {
  services: ServiceItem[];
  selectedService: ServiceItem | null;
  onSelect: (service: ServiceItem) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2 text-white">
        Escolha o Serviço
      </h2>
      <p className="text-neutral-400 text-sm font-medium mb-6">
        Clique para selecionar e avançar automaticamente
      </p>

      <div className="grid gap-3.5">
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id;
          return (
            <motion.button
              key={service.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(service)}
              className={`flex items-center justify-between p-5 rounded-2xl text-left border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-amber-400/90 bg-amber-500/10 shadow-[0_0_25px_rgba(212,175,55,0.15)] ring-1 ring-amber-400/50"
                  : "border-neutral-800 bg-neutral-950/60 hover:border-amber-500/50 hover:bg-neutral-900"
              }`}
            >
              <div className="flex-1 pr-4">
                <h3 className="font-bold text-lg text-white tracking-tight">{service.name}</h3>
                <p className="text-neutral-400 text-xs font-medium mt-1">
                  Duração aproximada: {service.duration} min
                </p>
              </div>
              <div className="text-amber-400 font-black text-xl whitespace-nowrap">
                R$ {Number(service.price).toFixed(2)}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function Step2({
  barbers,
  selectedBarber,
  onSelect,
  onPrev,
}: {
  barbers: BarberItem[];
  selectedBarber: BarberItem | null;
  onSelect: (barber: BarberItem) => void;
  onPrev: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2 text-white">
        Escolha o Barbeiro
      </h2>
      <p className="text-neutral-400 text-sm font-medium mb-6">
        Clique no profissional de sua preferência
      </p>

      <div className="grid gap-3.5 mb-6">
        {barbers.map((barber) => {
          const isSelected = selectedBarber?.id === barber.id;
          return (
            <motion.button
              key={barber.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(barber)}
              className={`flex items-center gap-4 p-4 rounded-2xl text-left border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-amber-400/90 bg-amber-500/10 shadow-[0_0_25px_rgba(212,175,55,0.15)] ring-1 ring-amber-400/50"
                  : "border-neutral-800 bg-neutral-950/60 hover:border-amber-500/50 hover:bg-neutral-900"
              }`}
            >
              {barber.photoUrl ? (
                <img
                  src={barber.photoUrl}
                  alt={barber.name}
                  className="w-14 h-14 rounded-full object-cover border border-neutral-700"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-xl border border-neutral-700">
                  {barber.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg text-white tracking-tight">{barber.name}</h3>
                <p className="text-neutral-400 text-xs font-medium">{barber.specialty}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={onPrev}
        className="w-full border border-neutral-800 bg-neutral-950 text-neutral-300 py-3.5 rounded-full font-bold hover:bg-neutral-800 transition-colors text-sm"
      >
        Voltar para Serviços
      </button>
    </div>
  );
}

function Step3({
  dates,
  selectedBarber,
  selectedDate,
  businessHours,
  blockedDates,
  onSelect,
  onPrev,
}: {
  dates: string[];
  selectedBarber: BarberItem | null;
  selectedDate: string | null;
  businessHours: BusinessHour[];
  blockedDates: BlockedDateItem[];
  onSelect: (date: string) => void;
  onPrev: () => void;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return {
      weekdayNum: date.getDay(),
      weekday: dayNames[date.getDay()],
      day: date.getDate().toString().padStart(2, "0"),
      month: monthNames[date.getMonth()],
    };
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2 text-white">
        Escolha a Data
      </h2>
      <p className="text-neutral-400 text-sm font-medium mb-6">
        Selecione o dia desejado para ver os horários
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5 mb-6">
        {dates.map((date) => {
          const { weekdayNum, weekday, day, month } = formatDate(date);
          const isBarberWorking = selectedBarber?.workDays
            ? selectedBarber.workDays.includes(weekdayNum.toString())
            : true;

          const shopDayHour = businessHours.find((h) => h.dayOfWeek === weekdayNum);
          const isShopClosed = shopDayHour ? shopDayHour.isClosed : false;

          const isBlocked = blockedDates.some((bd) => {
            const bdDateStr = new Date(bd.date).toISOString().split("T")[0];
            const matchesDate = bdDateStr === date;
            const matchesBarber = !bd.barberId || bd.barberId === selectedBarber?.id;
            return matchesDate && matchesBarber;
          });

          const isAvailable = isBarberWorking && !isShopClosed && !isBlocked;
          const isSelected = selectedDate === date;

          return (
            <motion.button
              key={date}
              disabled={!isAvailable}
              whileHover={isAvailable ? { scale: 1.05 } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
              onClick={() => isAvailable && onSelect(date)}
              className={`p-3 rounded-2xl text-center transition-all border cursor-pointer ${
                !isAvailable
                  ? "opacity-25 border-neutral-800/40 bg-neutral-950/30 cursor-not-allowed"
                  : isSelected
                  ? "border-amber-400 bg-amber-500/20 text-white shadow-[0_0_20px_rgba(212,175,55,0.2)] ring-1 ring-amber-400/50"
                  : "border-neutral-800 bg-neutral-950/60 hover:border-amber-500/50 text-neutral-300"
              }`}
            >
              <div className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-amber-400" : "text-neutral-500"}`}>
                {weekday}
              </div>
              <div className="text-lg font-black my-0.5 text-white">{day}</div>
              <div className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-amber-300" : "text-neutral-500"}`}>
                {isAvailable ? month : "Folga"}
              </div>
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={onPrev}
        className="w-full border border-neutral-800 bg-neutral-950 text-neutral-300 py-3.5 rounded-full font-bold hover:bg-neutral-800 transition-colors text-sm"
      >
        Voltar para Barbeiros
      </button>
    </div>
  );
}

function Step4({
  barber,
  service,
  selectedDate,
  selectedTime,
  businessHours,
  onSelect,
  onPrev,
}: {
  barber: BarberItem;
  service: ServiceItem;
  selectedDate: string | null;
  selectedTime: string | null;
  businessHours: BusinessHour[];
  onSelect: (time: string) => void;
  onPrev: () => void;
}) {
  let startTime = barber.startTime || "09:00";
  let endTime = barber.endTime || "19:00";

  if (selectedDate && businessHours.length > 0) {
    const dateObj = new Date(selectedDate + "T00:00:00");
    const shopDay = businessHours.find((h) => h.dayOfWeek === dateObj.getDay());
    if (shopDay && !shopDay.isClosed) {
      if (shopDay.openTime > startTime) startTime = shopDay.openTime;
      if (shopDay.closeTime < endTime) endTime = shopDay.closeTime;
    }
  }

  const timeSlots = generateTimeSlots(startTime, endTime, service.duration);

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2 text-white">
        Escolha o Horário
      </h2>
      <p className="text-neutral-400 text-sm font-medium mb-6">
        Clique no horário para prosseguir para a confirmação
      </p>

      {timeSlots.length === 0 ? (
        <p className="text-center py-8 text-neutral-500 text-sm font-medium">
          Nenhum horário disponível para esta data.
        </p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 mb-6">
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <motion.button
                key={time}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(time)}
                className={`py-3 px-2 rounded-xl text-center text-xs font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? "border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] ring-1 ring-amber-400/50"
                    : "border-neutral-800 bg-neutral-950/60 hover:border-amber-500/50 text-neutral-300"
                }`}
              >
                {time}
              </motion.button>
            );
          })}
        </div>
      )}

      <button
        onClick={onPrev}
        className="w-full border border-neutral-800 bg-neutral-950 text-neutral-300 py-3.5 rounded-full font-bold hover:bg-neutral-800 transition-colors text-sm"
      >
        Voltar para Datas
      </button>
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
      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2 text-white">
        Seus Dados
      </h2>
      <p className="text-neutral-400 text-sm font-medium mb-6">
        Informe seus dados para confirmar o agendamento
      </p>

      {/* Summary Box */}
      <div className="bg-neutral-950/80 rounded-2xl p-5 mb-6 border border-neutral-800 space-y-3 text-sm">
        <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 mb-2">
          Resumo da Reserva
        </h3>
        <div className="flex justify-between border-b border-neutral-800/80 pb-2">
          <span className="text-neutral-400">Serviço</span>
          <span className="font-bold text-white">{booking.service.name}</span>
        </div>
        <div className="flex justify-between border-b border-neutral-800/80 pb-2">
          <span className="text-neutral-400">Barbeiro</span>
          <span className="font-bold text-white">{booking.barber.name}</span>
        </div>
        <div className="flex justify-between border-b border-neutral-800/80 pb-2">
          <span className="text-neutral-400">Data</span>
          <span className="font-bold text-white">{booking.date}</span>
        </div>
        <div className="flex justify-between border-b border-neutral-800/80 pb-2">
          <span className="text-neutral-400">Horário</span>
          <span className="font-bold text-white">{booking.time}</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="font-bold uppercase tracking-wider text-neutral-400">Total</span>
          <span className="font-black text-amber-400 text-xl">
            R$ {Number(booking.service.price).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Digite seu nome completo"
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 text-sm font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
            Telefone / WhatsApp
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="(11) 99999-9999"
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="flex-1 border border-neutral-800 bg-neutral-950 text-neutral-300 py-4 rounded-full font-bold hover:bg-neutral-800 transition-colors text-sm"
        >
          Voltar
        </button>
        <button
          onClick={onSubmit}
          disabled={!customerName || !customerPhone || submitting}
          className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 text-black py-4 rounded-full font-bold disabled:opacity-20 flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-amber-500/20 text-sm"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? "Finalizando..." : "Confirmar Agendamento"}
        </button>
      </div>
    </div>
  );
}
