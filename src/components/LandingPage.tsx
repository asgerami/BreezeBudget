import React from "react";
import {
  ArrowRight,
  Zap,
  MapPin,
  Download,
  BarChart3,
  CheckCircle,
  Shield,
  Clock,
  AirVent,
  ChevronRight,
  CloudSun,
  Wind
} from "lucide-react";
import { motion } from "framer-motion";
import { Globe } from "./Globe";

interface LandingPageProps {
  onStartAnalysis: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis }) => {
  const features = [
    {
      icon: MapPin,
      title: "Local Precision",
      description: "Powered by hyper-local weather data and precise regional electricity rates.",
    },
    {
      icon: BarChart3,
      title: "Visual Clarity",
      description: "Interactive heatmaps and charts that make cost analysis instantly understandable.",
    },
    {
      icon: Zap,
      title: "Real-Time Engine",
      description: "Instantaneous calculations as you tweak your parameters. No waiting.",
    },
    {
      icon: Download,
      title: "Export & Share",
      description: "Generate professional PDF reports to share with clients or contractors.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500/30 overflow-hidden relative">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Navbar Option */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl text-black shadow-[0_0_20px_rgba(45,212,191,0.25)]">
            <AirVent className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            BreezeBudget
          </span>
        </div>
        <button
          onClick={onStartAnalysis}
          className="text-sm font-medium text-slate-900 bg-white/10 hover:bg-white/20 border border-slate-200 px-5 py-2.5 rounded-full transition-all flex items-center gap-2 group"
        >
          Try Demo
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </nav>

      <main className="relative z-10 pb-24">
        {/* Hero Section */}
        <section className="pt-24 pb-12 md:pt-36 md:pb-24 px-4 overflow-hidden">
          <div className="max-w-5xl mx-auto text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-gradient-to-b from-teal-500/10 via-transparent to-transparent blur-3xl rounded-full -z-10" />

            {/* Floating AC Unit Accents */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="hidden md:flex absolute top-10 left-10 w-16 h-16 bg-white border border-slate-200 rounded-2xl backdrop-blur-md items-center justify-center text-teal-500/50 shadow-lg shadow-teal-500/10"
            >
              <AirVent className="w-8 h-8" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
              className="hidden md:flex absolute bottom-20 right-10 w-20 h-20 bg-white border border-slate-200 rounded-2xl backdrop-blur-md items-center justify-center text-blue-500/40 shadow-lg shadow-blue-500/10"
            >
              <Wind className="w-10 h-10" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.1] pb-2 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600"
            >
              Stop guessing your <br className="hidden md:block" /> cooling energy costs.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
            >
              Get precise, personalized cost projections for any AC unit using real weather data and your home's unique specifications.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={onStartAnalysis}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white shadow-lg shadow-teal-500/20 hover:bg-teal-700 font-semibold rounded-full hover:bg-white transition-all overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Analysis
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>

            {/* Stats/Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500 font-medium"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500/70" /> No signup required
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-500/70" /> Results in ~2 minutes
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-500/70" /> Local calculation
              </div>
            </motion.div>
          </div>

          {/* New Global Weather Engine Feature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-24 max-w-5xl mx-auto px-4 sm:px-0"
          >
            <div className="relative rounded-3xl border border-slate-200 bg-white backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:gap-8 items-center">
              <div className="p-8 md:p-12 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300 mb-6">
                  <CloudSun className="w-3.5 h-3.5" />
                  <span>Real-Time Weather Intelligence</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
                  Driven by your <br /><span className="text-teal-400">local weather data.</span>
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  We don't use generic national averages. BreezeBudget connects directly to real-time meteorological databases to pull precise temperature and humidity profiles for your exact ZIP code.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <div className="text-slate-900 text-sm font-medium">Hyper-local precision</div>
                      <div className="text-slate-500 text-xs">Based on exact coordinates</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                      <Wind className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-slate-900 text-sm font-medium">Real-world conditions</div>
                      <div className="text-slate-500 text-xs">Accounting for regional climates</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] flex items-center justify-center opacity-80 mix-blend-multiply scale-110 translate-x-12">
                <Globe />
              </div>
            </div>
          </motion.div>

          {/* Static Mockup Dashboard */}
          <div className="mt-20 md:mt-28 max-w-5xl mx-auto px-4 sm:px-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-left pointer-events-none">
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  Cost & Usage Analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Monthly Cost Projection */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="bg-slate-50 border border-slate-100 rounded-xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      <span className="font-semibold text-slate-700 text-sm">Monthly Cost Projection</span>
                    </div>

                    <div className="flex justify-center mb-4">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <div className="w-6 h-3 border-2 border-blue-500 bg-blue-100 rounded-[2px]" />
                        Monthly Cost ($)
                      </div>
                    </div>

                    <div className="h-40 w-full border-l border-b border-slate-200 relative mt-6 ml-8 mr-4 mb-2">
                      {/* Y-axis Labels */}
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-400 -translate-x-full pr-2 text-right w-10">
                        <span>$250</span><span>$200</span><span>$150</span><span>$100</span><span>$50</span><span className="translate-y-1.5">$0</span>
                      </div>

                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex flex-col justify-between -z-10">
                        {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-slate-100" />)}
                      </div>

                      {/* Line & Dots */}
                      <div className="absolute inset-0 z-10 mx-2">
                        <motion.svg
                          className="absolute inset-0 h-full w-full overflow-visible"
                          preserveAspectRatio="none"
                          viewBox="0 0 100 100"
                          initial={{ clipPath: "inset(0 100% 0 0)" }}
                          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                        >
                          <path
                            d="M 0 15 L 9.09 35 L 18.18 45 L 27.27 88 L 36.36 93 L 45.45 93 L 54.54 93 L 63.63 93 L 72.72 88 L 81.81 60 L 90.9 35 L 100 15"
                            fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round"
                          />
                        </motion.svg>
                        <div className="absolute inset-0 h-full w-full">
                          {[15, 35, 45, 88, 93, 93, 93, 93, 88, 60, 35, 15].map((y, i) => (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: 0.5 + (i * 0.05) }}
                              key={i}
                              className="absolute w-[7px] h-[7px] bg-white border-2 border-blue-500 rounded-full -ml-[3.5px] -mt-[3.5px] shadow-sm"
                              style={{ top: `${y}%`, left: `${(i * 100) / 11}%` }}
                            />
                          ))}
                        </div>

                        {/* X-axis Labels */}
                        <div className="absolute inset-x-0 h-full w-full">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                            <div key={m} className="absolute font-medium text-[9px] text-slate-400 -ml-3 w-6 text-center" style={{ top: '100%', left: `${(i * 100) / 11}%`, marginTop: '8px' }}>
                              {m}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Monthly Energy Usage */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-slate-50 border border-slate-100 rounded-xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-slate-700 text-sm">Monthly Energy Usage</span>
                    </div>

                    <div className="flex justify-center mb-4">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <div className="w-6 h-3 bg-emerald-400 rounded-[2px]" />
                        Monthly Energy Usage (kWh)
                      </div>
                    </div>

                    <div className="h-40 w-full flex items-end gap-1.5 sm:gap-2 border-l border-b border-slate-200 px-2 relative mt-6 ml-10 mr-2">
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-400 -translate-x-full pr-2 text-right w-14">
                        <span>2500 kWh</span><span>2000 kWh</span><span>1500 kWh</span><span>1000 kWh</span><span>500 kWh</span><span className="translate-y-1.5">0 kWh</span>
                      </div>
                      <div className="absolute inset-0 flex flex-col justify-between -z-10">
                        {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-slate-100" />)}
                      </div>

                      {[90, 80, 83, 40, 35, 32, 35, 38, 40, 50, 75, 95].map((h, i) => {
                        const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
                        return (
                          <div key={i} className="flex-1 h-full flex flex-col justify-end relative group">
                            <motion.div
                              initial={{ height: 0 }}
                              whileInView={{ height: `${h}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.4 + (i * 0.05), ease: "easeOut" }}
                              className="w-full bg-emerald-400 group-hover:bg-emerald-500 transition-colors rounded-t-sm shadow-sm"
                            />
                            <div className="absolute -bottom-6 text-[9px] font-medium text-slate-400 text-center w-full">{m}</div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>

                {/* SEER2 Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-slate-700 text-sm">SEER2 Rating Cost Comparison (Annual)</span>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                      <div className="w-6 h-3 bg-purple-500 rounded-[2px]" />
                      Annual Cost ($)
                    </div>
                  </div>

                  <div className="h-48 w-full flex items-end gap-2 sm:gap-4 border-l border-b border-slate-200 px-2 sm:px-4 relative pt-4 ml-8 mr-4 mb-4">
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-400 -translate-x-full pr-2 w-12 text-right">
                      <span>$2000</span><span>$1600</span><span>$1200</span><span>$800</span><span>$400</span><span className="translate-y-1.5">$0</span>
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-between -z-10 pt-4">
                      {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-slate-100" />)}
                    </div>

                    {[95, 88, 80, 73, 68, 62, 58, 55, 52].map((h, i) => (
                      <div key={i} className="flex-1 h-full flex flex-col justify-end group relative">
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.6 + (i * 0.1), type: "spring", bounce: 0.3 }}
                          className="w-full bg-purple-500 group-hover:bg-purple-600 rounded-t-[3px] transition-colors shadow-sm"
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 1.2 + (i * 0.1) }}
                          className="absolute -bottom-6 pt-1 text-[9px] font-medium text-slate-400 text-center w-full max-w-[50px] left-1/2 -translate-x-1/2"
                        >
                          SEER2 {i + 13}
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Footer Section (Tip + Stats) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  {/* Tip Box */}
                  <div className="bg-blue-50/50 border border-blue-100 text-blue-800 p-4 rounded-xl text-sm leading-relaxed mb-6">
                    <span className="font-bold">Tip:</span> Higher SEER2 ratings mean better energy efficiency and lower operating costs. While higher-rated units cost more upfront, they can save money in the long run through reduced energy bills.
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1">Peak Month</div>
                      <div className="text-xl font-bold text-blue-900">Jan</div>
                    </div>
                    <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-green-500 mb-1">Lowest Month</div>
                      <div className="text-xl font-bold text-green-900">May</div>
                    </div>
                    <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-purple-500 mb-1">Annual Total</div>
                      <div className="text-xl font-bold text-purple-900">$1,542</div>
                    </div>
                    <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">Avg. Monthly</div>
                      <div className="text-xl font-bold text-orange-900">$128</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="py-24 px-4 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900">Precision Engineering</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">Built for homeowners and contractors who demand accuracy and clarity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="group relative bg-white border border-slate-200 p-8 rounded-3xl hover:bg-slate-50 transition-all duration-300 overflow-hidden hover:border-slate-200"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mb-6 text-slate-600 group-hover:text-teal-400 transition-colors group-hover:scale-110 duration-300 shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-slate-900 tracking-tight">{feature.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;

