"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Instagram, MapPin, Phone, Scissors } from "lucide-react";

// Mock data for now
const services = [
  {
    id: "1",
    name: "Corte Clássico",
    price: 45,
    duration: 30,
    description: "Corte tradicional com acabamento perfeito",
    imageUrl: "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=barbershop%20haircut%20in%20premium%20salon%20clean%20white%20black%20gold%20minimal&image_size=square",
  },
  {
    id: "2",
    name: "Barba Completa",
    price: 35,
    duration: 20,
    description: "Aparo, modelagem e hidratação",
    imageUrl: "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=premium%20beard%20trim%20barbershop%20clean%20white%20black%20gold&image_size=square",
  },
];

const barbers = [
  {
    id: "1",
    name: "João Silva",
    specialty: "Cortes Clássicos",
    photoUrl: "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=professional%20barber%20man%20portrait%20clean%20minimal&image_size=square",
    slug: "joao-silva",
  },
  {
    id: "2",
    name: "Pedro Santos",
    specialty: "Barbas Modernas",
    photoUrl: "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=professional%20barber%20man%20portrait%20modern%20style&image_size=square",
    slug: "pedro-santos",
  },
];

const gallery = [
  "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=barbershop%20interior%20modern%20premium%20clean%20white%20black%20gold&image_size=square",
  "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=barbershop%20chair%20premium%20minimalist%20design&image_size=square",
  "https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=barber%20tools%20premium%20aesthetic&image_size=square",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      {/* Navigation */}
      <nav className="border-b border-neutral-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Atlas Reserve" className="h-10 w-auto rounded-lg object-contain border border-neutral-800" />
            <span className="text-xl font-black tracking-tight uppercase">Atlas Reserve</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-neutral-600">
            <a href="#servicos" className="hover:text-black transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Serviços</a>
            <a href="#equipe" className="hover:text-black transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Equipe</a>
            <a href="#galeria" className="hover:text-black transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Galeria</a>
            <a href="#contato" className="hover:text-black transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Contato</a>
          </div>
          <Link
            href="/agendar"
            className="bg-black text-white px-6 py-2 border border-black rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 font-semibold text-sm"
          >
            <Calendar className="w-4 h-4" />
            Agendar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-black leading-none tracking-tighter mb-6 uppercase">
            Estilo que <span className="bg-black text-white px-3 py-1 inline-block rounded-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300">dura</span>.
          </h1>
          <p className="text-neutral-500 text-lg mb-8 max-w-md font-medium leading-relaxed">
            Experiência premium de barbearia. Qualidade impecável e atendimento personalizado em um ambiente exclusivamente minimalista.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/agendar"
              className="bg-black text-white px-8 py-3.5 border border-black rounded-full hover:bg-white hover:text-black transition-all duration-300 font-bold tracking-tight text-center flex-1 sm:flex-none"
            >
              Agendar Agora
            </Link>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-black px-8 py-3.5 rounded-full hover:bg-black hover:text-white transition-all duration-300 font-bold tracking-tight flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative px-4 sm:px-0"
        >
          <div className="absolute -top-4 -left-4 w-full h-full border-2 border-black rounded-3xl -z-10 hidden sm:block"></div>
          <img
            src="https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=premium%20barbershop%20hero%20image%20clean%20minimal%20white%20black%20gold&image_size=square"
            alt="Atlas Reserve"
            className="relative rounded-3xl shadow-xl w-full object-cover aspect-square hover:scale-[1.02] transition-transform duration-500 border border-neutral-100"
          />
        </motion.div>
      </section>

      {/* Services */}
      <section id="servicos" className="bg-neutral-50 py-20 border-y border-neutral-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight uppercase mb-4">Nossos Serviços</h2>
            <p className="text-neutral-500 font-medium">Qualidade máxima e acabamento cirúrgico</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 border border-neutral-100 hover:border-black hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold tracking-tight">{service.name}</h3>
                    <span className="text-black font-black text-xl">R${service.price}</span>
                  </div>
                  <p className="text-neutral-500 text-sm mb-6 leading-relaxed">{service.description}</p>
                </div>
                <div className="flex items-center text-sm text-neutral-400 font-semibold pt-4 border-t border-neutral-100">
                  <ClockIcon className="w-4 h-4 mr-1.5 text-neutral-400" />
                  {service.duration} minutos
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="equipe" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight uppercase mb-4">Nossa Equipe</h2>
            <p className="text-neutral-500 font-medium">Mestres das tesouras e navalhas</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
            {barbers.map((barber, index) => (
              <motion.div
                key={barber.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative inline-block mb-4 sm:mb-6">
                  <div className="absolute inset-0 border border-black rounded-full scale-0 group-hover:scale-105 transition-transform duration-300 -z-10"></div>
                  <img
                    src={barber.photoUrl}
                    alt={barber.name}
                    className="w-28 h-28 sm:w-40 sm:h-40 rounded-full mx-auto object-cover border border-neutral-200 grayscale group-hover:grayscale-0 hover:scale-[1.02] transition-all duration-300"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-1">{barber.name}</h3>
                <p className="text-neutral-500 text-xs sm:text-sm font-medium mb-4">{barber.specialty}</p>
                <Link
                  href={`/agendar?barbeiro=${barber.slug}`}
                  className="inline-block border border-black px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm hover:bg-black hover:text-white transition-all duration-300 font-bold"
                >
                  Agendar com {barber.name.split(" ")[0]}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="galeria" className="bg-neutral-50 py-20 border-y border-neutral-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight uppercase mb-4">Galeria</h2>
            <p className="text-neutral-500 font-medium">Nossa essência em detalhes</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {gallery.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={image}
                  alt={`Galeria ${index + 1}`}
                  className="rounded-2xl w-full aspect-square object-cover border border-neutral-200 grayscale hover:grayscale-0 hover:scale-[1.02] transition-all duration-500 cursor-pointer shadow-sm hover:shadow-md"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contato" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-black tracking-tight uppercase mb-8">Entre em Contato</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-0.5">Endereço</h3>
                    <p className="text-neutral-500 font-medium">Rua Exemplo, 123 - Centro, São Paulo</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-0.5">WhatsApp</h3>
                    <p className="text-neutral-500 font-medium">(11) 99999-9999</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Instagram className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-0.5">Instagram</h3>
                    <p className="text-neutral-500 font-medium">@barbeariapremium</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-neutral-900 rounded-2xl h-80 flex flex-col items-center justify-center text-neutral-400 border border-neutral-800 shadow-inner p-6 text-center">
              <MapPin className="w-10 h-10 text-white mb-3 animate-bounce" />
              <p className="font-medium text-white mb-2">Visualizar no Google Maps</p>
              <p className="text-sm text-neutral-500 max-w-xs mb-4">Rua Exemplo, 123 - Centro, São Paulo</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-white text-black font-semibold text-sm rounded-full hover:bg-neutral-200 transition-colors"
              >
                Abrir Mapa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Atlas Reserve" className="h-10 w-auto rounded-lg object-contain border border-neutral-800" />
            <span className="text-xl font-black uppercase tracking-tight">Atlas Reserve</span>
          </div>
          <p className="text-neutral-500 text-sm font-medium">
            © 2026 Atlas Reserve. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
