import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeatureCard from "../components/Home/FeatureCard";
import PartnerLogo from "../components/Home/PartnerLogo";
import ServiceCard from "../components/Home/ServiceCard";
import EnergyTooltip from "../components/Home/EnergyTooltip";
import StatCard from "../components/Home/StatCard";
import TestimonialCard from "../components/Home/TestimonialCard";
import MobileMenu from "../components/MobileMenu";
import {
  features,
  partners,
  services,
  energyTooltips,
  testimonials,
} from "../data/homeData";

const Home: React.FC = () => {
  const [logoScale, setLogoScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight;
      const scrollProgress = Math.min(scrollPosition / heroHeight, 1);
      const newScale = 1 - scrollProgress * 0.5; // Scale from 1 to 0.5
      setLogoScale(Math.max(newScale, 0.5));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white">
      {/* Mobile Menu */}
      <MobileMenu />
      {/* Hero Section with Video Background */}
      <section className="relative h-screen min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-visible pb-32 md:pb-40">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="/media/modern-home-solar-installation-drone.webm"
            type="video/webm"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div
            className="mb-6 flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `scale(${logoScale})` }}
          >
            <img
              src="/media/mark.svg"
              alt="Mayer"
              className="w-16 h-16 md:w-20 md:h-20"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4 md:mb-6 drop-shadow-2xl tracking-tight px-4">
            Your Partner in energy efficiency
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-8 md:mb-10 max-w-3xl mx-auto font-light drop-shadow-lg px-4">
            Better living starts with smart home upgrades.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Link to="/register" className="btn-primary px-8 py-3 text-base">
              Order now
            </Link>
            <button className="btn-secondary px-8 py-3 text-base">
              Book appointment
            </button>
          </div>
        </div>

        {/* Feature Cards - Overlapping at bottom - Hidden on mobile */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-20 transform translate-y-2/3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards - Mobile version (not overlapping) */}
      <section className="block md:hidden py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Spacer for overlapping cards - desktop only */}
      <div className="hidden md:block pt-48 md:pt-56 bg-white"></div>

      {/* Trust Logos Section - Animated Horizontal Scroll */}
      <section className="container max-w-6xl mx-auto py-12 overflow-hidden">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#fff] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#fff] to-transparent z-10 pointer-events-none" />
          <div className="flex items-center gap-16 animate-scroll">
            {partners.map((partner, index) => (
              <PartnerLogo key={index} {...partner} />
            ))}
            {partners.map((partner, index) => (
              <PartnerLogo key={`duplicate-${index}`} {...partner} />
            ))}
          </div>
        </div>
      </section>

      {/* Three Cards Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Energy Savings Section with Interactive Tooltips */}
      <section
        className="max-w-[95%] rounded-lg mx-auto relative min-h-[400px] md:min-h-[70vh] bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "url(/media/section-3-bg.webp)",
        }}
      >
        <div className="relative z-10 max-w-xl px-6 sm:px-8 md:pl-12 lg:pl-16 pt-8 md:pt-16 pb-8">
          <p className="text-white/80 font-normal mb-3 text-xs tracking-wider">
            — Efficiency From Every Angle
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-3 md:mb-4 tracking-tight leading-tight">
            Pinpoint exactly where you're losing energy
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/90 mb-4 md:mb-6 font-light">
            and take control of your savings
          </p>
          <button className="px-5 py-2 bg-white text-gray-900 font-medium rounded text-sm hover:bg-gray-100 transition-all">
            Book appointment
          </button>
        </div>

        <div className="absolute -bottom-20 right-[5%] md:right-[16%] w-[50%] md:w-[45%] lg:w-[40%] hidden sm:block">
          <div className="relative">
            <img
              src="/media/sustainable.png"
              alt="Sustainable Home Energy"
              className="w-full h-auto"
            />
            {energyTooltips.map((tooltip, index) => (
              <EnergyTooltip key={index} {...tooltip} />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section
        className="max-w-[95%] flex flex-col rounded-lg mx-auto relative min-h-[400px] md:min-h-[80vh] bg-cover bg-center mt-12 md:mt-20 items-center justify-center py-12 md:py-16"
        style={{
          backgroundImage: "url(/media/section-4.webp)",
        }}
      >
        <div className="max-w-7xl flex flex-col h-full mx-auto px-6 sm:px-8 lg:px-12 items-center justify-center">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-4 md:mb-6 px-4">
              Systems That Deliver For decades
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-4xl mx-auto px-4 leading-relaxed">
              Installing solar means you immediately reduce your electricity
              bills and boost your home's value. Your system powers most of your
              energy needs while cutting your carbon footprint at the same time.
              It's built for independence — no more surprise rate hikes, and no
              need to depend entirely on the grid.
            </p>
          </div>
          <StatCard />
        </div>
      </section>

      {/* Testimonials Section - Horizontal Scroll */}
      <section className="py-12 md:py-20 bg-gray-50 overflow-hidden">
        <div className="relative">
          {/* Fade overlay on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

          {/* Scrolling container */}
          <div className="flex gap-4 md:gap-6 animate-scroll-slow">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
            {/* Duplicate set for seamless loop */}
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={`duplicate-${index}`} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-12 md:py-20 lg:py-32 bg-cover bg-center"
        style={{
          backgroundImage: "url(/media/cta-bg.webp)",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white mb-3 md:mb-4 px-4">
              Discover your savings potential
            </h2>
            <p className="text-base md:text-lg text-white/90">
              It starts with your home.
            </p>
          </div>

          <form className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <input
                type="text"
                placeholder="* Name"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm md:text-base"
              />
              <input
                type="email"
                placeholder="* Email Address"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm md:text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <input
                type="tel"
                placeholder="* Phone Number"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm md:text-base"
              />
              <input
                type="text"
                placeholder="Last Month Electric Bill $"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm md:text-base"
              />
            </div>

            <input
              type="text"
              placeholder="* Home Address"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm md:text-base"
            />

            <button
              type="submit"
              className="w-full py-3 bg-white text-gray-900 font-medium rounded hover:bg-gray-100 transition-all text-sm md:text-base"
            >
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left side - Contact Info */}
            <div className="space-y-4 md:space-y-6">
              <div className="mb-4 md:mb-6">
                <img
                  src="/media/mayer-logo.svg"
                  alt="Mayer"
                  className="h-6 md:h-8"
                />
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm md:text-base text-gray-700">
                  800 Jupiter Rd Suite 175, Plano, TX 75074
                </p>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:info@mayerorder.com"
                  className="text-sm md:text-base text-gray-700 hover:text-gray-900 break-all"
                >
                  info@mayerorder.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:972-265-9850"
                  className="text-sm md:text-base text-gray-700 hover:text-gray-900"
                >
                  972-265-9850
                </a>
              </div>
            </div>

            {/* Right side - Map */}
            <div className="h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3347.9871896956877!2d-96.73157!3d33.01234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c1f3a3e3e3e3e%3A0x3e3e3e3e3e3e3e3e!2s800%20Jupiter%20Rd%20Suite%20175%2C%20Plano%2C%20TX%2075074!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mayer Location"
              ></iframe>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
