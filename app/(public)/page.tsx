"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Instagram, MapPin, Phone, Scissors, Loader2, Sparkles, Clock, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [resServ, resBarb, resSet] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/barbers"),
          fetch("/api/settings"),
        ]);

        if (resServ.ok) setServices(await resServ.json());
        if (resBarb.ok) setBarbers(await resBarb.json());
        if (resSet.ok) setSettings(await resSet.json());
      } catch (err) {
        console.error("Erro ao carregar dados da página principal:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const logo = settings?.logoUrl || "/logo.jpg";
  const shopName = settings?.shopName || "Atlas Reserve";
  const whatsapp = settings?.whatsapp || "(11) 99999-9999";
  const address = settings?.address || "Rua Exemplo, 123 - Centro, São Paulo";
  const instagram = settings?.instagram || "@atlasreserve";

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 antialiased relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Background Fixed Glow Orbs */}
      <div className="pointer-events-none fixed -top-40 -left-40 w-[600px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none fixed top-1/3 -right-40 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full" />
      <div className="pointer-events-none fixed -bottom-40 left-1/3 w-[600px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full" />

      {/* Navigation */}
      <nav className="border-b border-neutral-800/80 sticky top-0 bg-[#09090b]/80 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt={shopName} className="h-10 w-auto rounded-xl object-contain border border-neutral-800 bg-black p-1 shadow-md" />
            <span className="text-xl font-black tracking-tight uppercase text-white">{shopName}</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-neutral-400">
            <a href="#servicos" className="hover:text-amber-400 transition-colors py-1">Serviços</a>
            <a href="#equipe" className="hover:text-amber-400 transition-colors py-1">Equipe</a>
            <a href="#contato" className="hover:text-amber-400 transition-colors py-1">Contato</a>
          </div>
          <Link
            href="/agendar"
            className="bg-gradient-to-r from-amber-500 to-amber-400 text-black px-6 py-2.5 rounded-full hover:opacity-90 transition-all duration-300 flex items-center gap-2 font-bold text-sm shadow-lg shadow-amber-500/15"
          >
            <Calendar className="w-4 h-4" />
            Agendar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 rounded-full text-xs font-bold text-amber-400 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Experiência Premium de Barbearia</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-6 uppercase text-white">
            Estilo que <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">dura</span>.
          </h1>
          <p className="text-neutral-400 text-lg mb-8 max-w-md font-medium leading-relaxed">
            {settings?.landingText || "Experiência premium de barbearia. Qualidade impecável e atendimento personalizado em um ambiente exclusivamente minimalista."}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/agendar"
              className="bg-white text-black px-8 py-4 rounded-full hover:bg-amber-400 transition-all duration-300 font-bold tracking-tight text-center flex-1 sm:flex-none shadow-xl"
            >
              Agendar Agora
            </Link>
            <a
              href={`https://wa.me/55${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-neutral-800 bg-neutral-900/60 text-white px-8 py-4 rounded-full hover:bg-neutral-800 transition-all duration-300 font-bold tracking-tight flex items-center justify-center gap-2 flex-1 sm:flex-none backdrop-blur-md"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              WhatsApp
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative px-4 sm:px-0"
        >
          <div className="absolute -top-4 -left-4 w-full h-full border border-amber-500/20 rounded-3xl -z-10 hidden sm:block"></div>
          <img
            src="/logo.jpg"
            alt={shopName}
            className="relative rounded-3xl shadow-2xl shadow-black/80 w-full object-cover aspect-square border border-neutral-800 bg-neutral-950 p-6"
          />
        </motion.div>
      </section>

      {/* Services */}
      <section id="servicos" className="bg-neutral-950/60 py-24 border-y border-neutral-800/80 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight uppercase mb-4 text-white">Nossos Serviços</h2>
            <p className="text-neutral-400 font-medium">Qualidade máxima e acabamento cirúrgico</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-neutral-900/60 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800/80 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold tracking-tight text-white">{service.name}</h3>
                      <span className="text-amber-400 font-black text-2xl">
                        R$ {Number(service.price).toFixed(2)}
                      </span>
                    </div>
                    {service.description && (
                      <p className="text-neutral-400 text-sm mb-6 leading-relaxed">{service.description}</p>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-neutral-500 font-semibold pt-4 border-t border-neutral-800/80 justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {service.duration} min
                    </span>
                    <Link href="/agendar" className="text-amber-400 font-bold hover:underline text-xs flex items-center gap-1">
                      Agendar &rarr;
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Team */}
      <section id="equipe" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight uppercase mb-4 text-white">Nossa Equipe</h2>
            <p className="text-neutral-400 font-medium">Mestres das tesouras e navalhas</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
              {barbers.map((barber, index) => (
                <motion.div
                  key={barber.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="relative inline-block mb-4 sm:mb-6">
                    <div className="absolute inset-0 border border-amber-500/40 rounded-full scale-0 group-hover:scale-105 transition-transform duration-300 -z-10"></div>
                    {barber.photoUrl ? (
                      <img
                        src={barber.photoUrl}
                        alt={barber.name}
                        className="w-28 h-28 sm:w-40 sm:h-40 rounded-full mx-auto object-cover border-2 border-neutral-800 group-hover:border-amber-400 transition-all duration-300 shadow-xl"
                      />
                    ) : (
                      <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full mx-auto bg-neutral-800 text-white flex items-center justify-center font-bold text-3xl border-2 border-neutral-700">
                        {barber.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-1 text-white">{barber.name}</h3>
                  <p className="text-neutral-400 text-xs sm:text-sm font-medium mb-4">{barber.specialty}</p>
                  <Link
                    href={`/agendar?barbeiro=${barber.slug}`}
                    className="inline-block border border-neutral-800 bg-neutral-900/60 px-5 py-2.5 rounded-full text-xs hover:border-amber-400 hover:text-amber-400 transition-all duration-300 font-bold backdrop-blur-md"
                  >
                    Agendar com {barber.name.split(" ")[0]}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contato" className="py-24 bg-neutral-950/60 border-t border-neutral-800/80 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-black tracking-tight uppercase mb-8 text-white">Entre em Contato</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-0.5 text-white">Endereço</h3>
                    <p className="text-neutral-400 font-medium">{address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-0.5 text-white">WhatsApp</h3>
                    <p className="text-neutral-400 font-medium">{whatsapp}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Instagram className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-0.5 text-white">Instagram</h3>
                    <p className="text-neutral-400 font-medium">{instagram}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-neutral-900/60 backdrop-blur-xl rounded-3xl h-80 flex flex-col items-center justify-center text-neutral-400 border border-neutral-800 shadow-xl p-6 text-center">
              <MapPin className="w-10 h-10 text-amber-400 mb-3 animate-bounce" />
              <p className="font-medium text-white mb-2">Visualizar no Google Maps</p>
              <p className="text-sm text-neutral-400 max-w-xs mb-4">{address}</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-white text-black font-bold text-xs rounded-full hover:bg-amber-400 transition-colors shadow-lg"
              >
                Abrir Mapa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-neutral-900 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt={shopName} className="h-10 w-auto rounded-xl object-contain border border-neutral-800 bg-black p-1" />
            <span className="text-xl font-black uppercase tracking-tight text-white">{shopName}</span>
          </div>
          <p className="text-neutral-500 text-xs font-medium">
            © 2026 {shopName}. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
