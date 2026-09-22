"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Code2,
  Server,
  Layers,
  CheckCircle2,
  ArrowRight,
  Globe,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Lock,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoginModal } from "@/components/common/login-modal";
import { ContactForm } from "@/components/common/contact-form";

export default function HomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Client Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Top Banner - Compliance & Trust */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              <strong>Legal Entity:</strong> Md Rushd Al Amin &bull; Official Category:{" "}
              <span className="text-white font-medium">IT Services & Software Development</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Support: contact@vitamin2001.in</span>
            <span className="hidden md:inline">&bull;</span>
            <span className="hidden md:inline">Berhampore, WB, India</span>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/30">
              V
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              vitamin2001<span className="text-blue-600">.in</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-blue-600 transition">
              Services
            </a>
            <a href="#solutions" className="hover:text-blue-600 transition">
              Architecture
            </a>
            <Link href="/about" className="hover:text-blue-600 transition">
              About Us
            </Link>
            <a href="#contact" className="hover:text-blue-600 transition">
              Contact
            </a>
          </nav>

          {/* Actions: Client Login */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-sm transition gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Client Login</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3"
            >
              <Lock className="w-3.5 h-3.5 mr-1" />
              Login
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 text-sm font-medium">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-blue-600"
            >
              Services
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-blue-600"
            >
              Architecture
            </a>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-blue-600"
            >
              About Us
            </Link>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-blue-600"
            >
              Contact
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-blue-50/50 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-800 border border-blue-200 mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>IT Services & Custom Software Solutions</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Custom Web Applications & Modern{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              SaaS Solutions
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            We architect and build tailored React and Next.js platforms, multi-tenant digital portals, and
            scalable backend infrastructure for emerging companies and enterprise clients.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#contact">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/20 text-base gap-2">
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-100 text-base rounded-xl font-medium gap-2"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Client Portal Login</span>
            </Button>
          </div>

          {/* Trust points bar */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Next.js & React Full-Stack</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Multi-Tenant Isolation</span>
            </div>
            {/* <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>INR (₹) & USD ($) Billing</span>
            </div> */}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 px-3 py-1 font-semibold text-xs">
              What We Deliver
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              End-to-End IT Services & Development
            </h2>
            <p className="text-base text-slate-600">
              We specialize in custom web applications, multi-tenant digital systems, and full-stack software development tailored to your enterprise goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:shadow-lg hover:border-blue-200 transition duration-200 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Custom Web Applications
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tailored high-performance web applications built with React 19, Next.js 16, TypeScript, and modern styling libraries.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Responsive, mobile-first design systems</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>High speed server-side rendering (SSR)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Interactive dashboards and reporting</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <a href="#contact" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 gap-1">
                  Discuss your project <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Service 2 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:shadow-lg hover:border-blue-200 transition duration-200 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Server className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Full-Stack Development
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Complete architectural coverage spanning high-throughput backend APIs, relational database schemas, and cloud deployment pipelines.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>NestJS & Fastify REST / Swagger APIs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>PostgreSQL, MySQL & Prisma ORM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Cloud object storage & transactional email</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <a href="#contact" className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 gap-1">
                  Explore full-stack plans <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Service 3 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:shadow-lg hover:border-blue-200 transition duration-200 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Websites & SaaS Platforms
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Multi-tenant Software-as-a-Service platforms featuring automated tenant subdomain provisioning and isolated client consoles.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Dedicated subdomain routing (client.vitamin2001.in)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Multi-tenant RBAC & team invitation workflows</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>PayU billing & subscription lifecycle</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <a href="#contact" className="inline-flex items-center text-xs font-semibold text-purple-600 hover:text-purple-700 gap-1">
                  Provision a tenant <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions & Engagement Model Section */}
      <section id="solutions" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Delivery Process */}
            <div className="space-y-6">
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 font-semibold text-xs">
                Digital Delivery Workflow
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Transparent Execution from Concept to Subdomain Launch
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                As a specialized digital IT service enterprise, all deliverables are provisioned electronically.
                Clients receive access to staging environments, private code repositories, and isolated production subdomains.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Scope Definition & Quotation</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Detailed consultation to specify requirements, timeline, deliverables, and customized pricing in INR or USD.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Milestone-Based Engineering</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Continuous development with weekly preview builds, rigorous testing, and code audits.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Subdomain Provisioning & Handover</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Instant or scheduled electronic delivery of credentials, domain routing, and platform admin access.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Refund Highlight Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Custom Pricing Model</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Transparent, Custom Quotations
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tailored estimates based on scope, feature modules, and hosting scale.
                </p>
              </div>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Accepted Currencies</span>
                  <span className="font-semibold text-slate-900">INR (₹) and USD ($)</span>
                </div>
                {/* <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Payment Processor</span>
                  <span className="font-semibold text-blue-600">PayU Payment Gateway</span>
                </div> */}
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Delivery Timeline</span>
                  <span className="font-semibold text-slate-900">Per Agreed SOW / Milestone</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">SaaS Refund Window</span>
                  <span className="font-semibold text-emerald-600">7-Day Pro-Rated Guarantee</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 space-y-2">
                <p className="font-medium text-slate-900">Need a project estimate?</p>
                <p>
                  Submit your specifications via our contact form below to receive a comprehensive proposal
                  and custom quote within 24 hours.
                </p>
              </div>

              <a href="#contact" className="block">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold">
                  Request Custom Quote
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Entity Verification / PayU Compliance Box */}
      {/* <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Merchant Information</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Md Rushd Al Amin &bull; Operating as vitamin2001.in
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                  Official provider of IT Services, custom web applications, and multi-tenant software platforms.
                  All transactions on this site are processed securely through certified gateways in compliance with Reserve Bank of India (RBI) guidelines.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link href="/about">
                  <Button variant="outline" size="sm" className="bg-white text-slate-700 border-slate-300">
                    About Us
                  </Button>
                </Link>
                <Link href="/privacy-policy">
                  <Button variant="outline" size="sm" className="bg-white text-slate-700 border-slate-300">
                    Privacy Policy
                  </Button>
                </Link>
                <Link href="/refund">
                  <Button variant="outline" size="sm" className="bg-white text-slate-700 border-slate-300">
                    Refund Policy
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 font-semibold text-xs">
                Get In Touch
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Let&apos;s Build Your Next Web Application
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you need a custom React portal, full-stack API architecture, or a dedicated tenant subdomain,
                we are ready to assist.
              </p>

              <div className="space-y-4 pt-2 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Official Email</p>
                    <a href="mailto:contact@vitamin2001.in" className="text-blue-600 hover:underline">
                      contact@vitamin2001.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Registered Office Address</p>
                    <p className="text-slate-600 text-xs sm:text-sm">
                      134/1 Abdus Samad Road, Berhampore{"\n"}
                      WB - 742101, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Business Hours</p>
                    <p className="text-slate-600 text-xs sm:text-sm">
                      Monday &ndash; Saturday &bull; 9:30 AM &ndash; 6:30 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Send an Inquiry</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the details below and we will get back to you with a proposal or answer within 24 hours.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Column Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Col 1: Brand & Bio */}
            <div className="space-y-4 md:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  V
                </div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  vitamin2001<span className="text-blue-600">.in</span>
                </span>
              </Link>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-performance custom web applications, SaaS platform development, and secure multi-tenant architecture.
              </p>
              <p className="text-[11px] text-slate-500">
                Operated by <strong>Md Rushd Al Amin</strong>
              </p>
            </div>

            {/* Col 2: Company */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Company
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link href="/about" className="hover:text-blue-600 transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="#services" className="hover:text-blue-600 transition">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#solutions" className="hover:text-blue-600 transition">
                    Architecture & Delivery
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-blue-600 transition">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal & Gateway Policies */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Legal & Policies
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link href="/privacy-policy" className="hover:text-blue-600 transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-blue-600 transition">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-return" className="hover:text-blue-600 transition">
                    Shipping & Delivery Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="hover:text-blue-600 transition">
                    Cancellation & Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & Merchant Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Merchant Info
              </h4>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p>
                  <strong>Legal Name:</strong> Md Rushd Al Amin
                </p>
                <p>
                  <strong>Category:</strong> IT Services & Software Development
                </p>
                <p className="whitespace-pre-line">
                  <strong>Address:</strong>{"\n"}134/1 Abdus Samad Road, Berhampore, WB - 742101, India
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:contact@vitamin2001.in" className="text-blue-600 hover:underline">
                    contact@vitamin2001.in
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} vitamin2001.in. All rights reserved. Registered under Md Rushd Al Amin.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-slate-400 hover:text-slate-600">
                Platform Admin
              </Link>
              <Link href="/admin/tenants" className="text-slate-400 hover:text-slate-600">
                Tenant Registry
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
