"use client";

import Link from "next/link";
import { ArrowRight, Zap, TrendingUp, Users, Shield, DollarSign, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { stiffness: 100, damping: 12 }
  },
};


// --- COMPONENTS (Customized for React/Tailwind) ---

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-[#1e88e5]">
          Vera CRM
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-gray-600 hover:text-[#1565c0] transition duration-200">Features</Link>
          <Link href="#why-choose" className="text-gray-600 hover:text-[#1565c0] transition duration-200">Why Us?</Link>
          <Link href="#pricing" className="text-gray-600 hover:text-[#1565c0] transition duration-200">Pricing</Link>
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-[#1e88e5] hover:text-[#1565c0] transition duration-200">Sign In</Link>
          <Link href="/login">
            <button className="bg-[#1e88e5] text-white px-5 py-2 rounded-full font-medium hover:bg-[#1565c0] shadow-lg transition duration-300 transform hover:scale-105">
              Get Started Free
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
        </button>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-xl py-4 z-40 flex flex-col items-center space-y-4">
          <Link href="#features" className="text-gray-600 hover:text-[#1565c0]" onClick={() => setIsOpen(false)}>Features</Link>
          <Link href="#why-choose" className="text-gray-600 hover:text-[#1565c0]" onClick={() => setIsOpen(false)}>Why Us?</Link>
          <Link href="#pricing" className="text-gray-600 hover:text-[#1565c0]" onClick={() => setIsOpen(false)}>Pricing</Link>
          <Link href="/login" className="text-[#1e88e5]" onClick={() => setIsOpen(false)}>Sign In</Link>
          <Link href="/signup" onClick={() => setIsOpen(false)}>
            <button className="bg-[#1e88e5] text-white px-5 py-2 rounded-full font-medium">Get Started Free</button>
          </Link>
        </div>
      )}
    </header>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <motion.div variants={itemVariants} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border border-gray-100">
    <Icon className="w-8 h-8 text-[#1e88e5] mb-4" />
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

// --- MAIN PAGE COMPONENT ---

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />

      {/* 1 Hero Section */}
      <section className="pt-36 pb-20 bg-gradient-to-br from-[#e3f2fd] to-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-[#1565c0]">
              Convert Leads. Close Faster.
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-gray-600">
              Vera CRM empowers your sales team with <span className="text-xxl font-semibold">AI-driven insights</span>, 
              <span className="text-xxl font-semibold">automated workflows</span>, 
              and <span className="text-xxl font-semibold">a unified view of every customer relationship</span>.
            </motion.p>
            <motion.div variants={itemVariants} className="inline-block">
              <Link href="/signup">
                <button className="bg-[#1e88e5] text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-[#1565c0] shadow-2xl shadow-[#1e88e5]/50 transition duration-300 transform hover:scale-105 flex items-center mx-auto">
                  Start Your 14-Day Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          </motion.div>
          {/*  */}
        </div>
      </section>

      {/* 2 Core CRM Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-3">Core CRM Power</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            These essential features are built into Vera to give you an unfair advantage in the market.
          </p>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <FeatureCard 
              icon={Zap} 
              title="Automated Workflows" 
              description="Eliminate repetitive tasks. Automatically assign leads, send follow-up emails, and update records." 
            />
            <FeatureCard 
              icon={TrendingUp} 
              title="Predictive Forecasting" 
              description="Use machine learning to accurately predict future sales, helping you allocate resources effectively." 
            />
            <FeatureCard 
              icon={Users} 
              title="360° Customer View" 
              description="Every interaction, email, call, and note is logged in one place for complete visibility." 
            />
          </motion.div>
        </div>
      </section>

      {/* 3 Why Choose Vera? */}
      <section id="why-choose" className="py-20 bg-[#f4f7ff]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-3">Why Choose Vera?</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our commitment is to simplicity, security, and superior performance.
          </p>

          <motion.div 
            className="grid md:grid-cols-2 gap-8 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-6">
              {[
                { icon: Shield, title: "Enterprise-Grade Security", desc: "Your customer data is protected by industry-leading encryption and strict compliance standards." },
                { icon: DollarSign, title: "Transparent Pricing", desc: "No hidden fees, no surprise costs. Pay only for the features and users you need." },
                { icon: CheckCircle, title: "Seamless Integration", desc: "Connect Vera with your existing tools like Gmail, Slack, and accounting software instantly." },
              ].map((item, index) => (
                <div key={index} className="flex items-start p-4 bg-white rounded-lg shadow-md border-l-4 border-[#1e88e5]">
                  <item.icon className="w-6 h-6 text-[#1e88e5] mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="hidden md:block">
              {/*  */}
              <div className="bg-[#1e88e5]/10 p-8 rounded-2xl shadow-inner text-center">
                  <h3 className="text-2xl font-bold text-[#1e88e5]">Focus on Growth</h3>
                  <p className="text-gray-700 mt-2">Let Vera handle the complexity while you focus on closing deals and building relationships.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="py-20 text-center bg-[#1e88e5]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-3">Ready to See Results?</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Stop losing leads to outdated spreadsheets. Start your digital transformation today.
          </p>
          <Link href="/signup">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#1e88e5] px-10 py-4 rounded-full font-extrabold text-lg shadow-xl hover:bg-gray-100 transition duration-300"
            >
              Claim Your Free Trial
            </motion.button>
          </Link>
        </div>
      </section>

      {/* 5. Contact & Footer */}
      <footer className="py-12 bg-gray-800 text-white">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
          {/* Logo & Info */}
          <div>
            <h3 className="text-xl font-extrabold text-[#1e88e5] mb-4">Vera CRM</h3>
            <p className="text-sm text-gray-400">Transforming customer relationships through simplicity and intelligence.</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>23521076@gm.uit.edu.vn.com</li>
              <li>23521266@gm.uit.edu.vn.com</li>
              <li>+84 703 4350 34</li>
              <li>+84 932 5323 30</li>
              <li>Ho Chi Minh City, Vietnam</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#features" className="hover:text-[#1e88e5]">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-[#1e88e5]">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-[#1e88e5]">Sign In</Link></li>
            </ul>
          </div>
          
          {/* Developer Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Developer</h4>
            <p className="text-sm text-gray-400">Developed by: Le Tu Nhan, Nguyen Thanh Quan</p>
            <p className="text-sm text-gray-400">Role: UIT-Student</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="container mx-auto px-6 mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Vera CRM — All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Homepage;