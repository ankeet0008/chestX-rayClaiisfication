import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { 
  HiOutlineArrowRight, 
  HiOutlineShieldCheck, 
  HiOutlineLightningBolt, 
  HiOutlineChartBar, 
  HiOutlineCloudUpload,
  HiOutlineStatusOnline,
  HiOutlineUserGroup
} from 'react-icons/hi'
import { FaLungs, FaHeartbeat } from 'react-icons/fa'

/* ─── Data ────────────────────────────────────────────────── */
const STATS = [
  { value: '87.2%', label: 'Avg Accuracy', sub: 'Validated' },
  { value: '<2s', label: 'Inference', sub: 'Per Scan' },
  { value: '25k+', label: 'Training Set', sub: 'High Res' },
  { value: '5', label: 'Pathologies', sub: 'Detected' },
]

const FEATURES = [
  {
    icon: HiOutlineShieldCheck,
    title: 'Certified Integrity',
    desc: 'Our models are validated against 25,000+ expert-labeled radiographic examinations for unmatched diagnostic precision.',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Instant Execution',
    desc: 'Proprietary Gradient Boosting architecture delivers detailed pathology reports in under 2 seconds.',
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Clinical Support',
    desc: 'Designed as a 2nd-opinion tool for over-burdened radiology departments globally.',
  },
]

export default function LandingPage() {
  const heroRef = useRef(null)
  const orbsRef = useRef([])
  const contentRef = useRef(null)

  useEffect(() => {
    // Initial reveal
    const ctx = gsap.context(() => {
      // 1. Text reveals
      gsap.from(".reveal-item", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.5
      })

      // 2. Stats reveal
      gsap.from(".stat-card", {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 1.5
      })

      // 3. Orbs floating
      orbsRef.current.forEach((orb, i) => {
        gsap.to(orb, {
          x: "random(-40, 40)",
          y: "random(-40, 40)",
          duration: "random(4, 8)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.5
        })
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef} className="relative bg-primary overflow-hidden min-h-screen">
      {/* ─── Premium Background Elements ─── */}
      <div className="mesh-bg opacity-40" />
      
      {/* Floating Medical Orbs */}
      {[0, 1, 2].map(i => (
        <div 
          key={i}
          ref={el => orbsRef.current[i] = el}
          className="floating-orb"
          style={{
            width: i === 0 ? '500px' : '300px',
            height: i === 0 ? '500px' : '300px',
            background: i === 0 ? 'var(--color-primary)' : i === 1 ? 'var(--color-accent)' : 'var(--color-secondary)',
            top: i === 0 ? '-10%' : i === 1 ? '40%' : '70%',
            left: i === 0 ? '60%' : i === 1 ? '-10%' : '50%',
            filter: 'blur(120px)',
            opacity: 0.2
          }}
        />
      ))}

      {/* ─── Hero Content ─── */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="reveal-item inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-primary-light mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-light pulse-primary" />
            V2.0 Core Engine Live
          </div>

          {/* Main Heading */}
          <h1 className="reveal-item text-4xl md:text-7xl font-extrabold leading-[1.1] mb-8">
            Diagnostic Accuracy <br />
            <span className="text-gradient">Redefined by AI</span>
          </h1>

          {/* Subtext */}
          <p className="reveal-item text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-12 font-medium">
            Deploying high-precision Gradient Boosting to detect 5 critical pathologies in seconds. Validated accuracy of 87.2% across diverse datasets.
          </p>

          {/* Buttons */}
          <div className="reveal-item flex flex-col sm:flex-row gap-5 items-center justify-center">
            <Link to="/predict">
              <button className="glow-hover px-10 py-5 bg-primary text-white font-bold rounded-2xl flex items-center gap-3 group transition-all">
                <FaLungs className="text-xl group-hover:rotate-12 transition-transform" />
                Analyze New X-Ray
                <HiOutlineArrowRight size={20} />
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="px-10 py-5 glass-panel text-primary font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
                <HiOutlineChartBar size={22} className="text-secondary" />
                Access Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {STATS.map((stat, i) => (
            <div key={i} className="stat-card glass-panel p-8 rounded-3xl text-center relative group">
              <div className="absolute inset-0 bg-gradient-mesh opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl" />
              <h3 className="text-4xl font-black text-gradient mb-2">{stat.value}</h3>
              <p className="text-sm font-bold text-primary opacity-80">{stat.label}</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider mt-2">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Features Section ─── */}
      <section className="relative z-10 py-32 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <div className="reveal-item w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                  <FaHeartbeat size={32} className="text-primary" />
                </div>
                <h2 className="reveal-item text-3xl font-bold mb-6">Expertise built into every prediction.</h2>
                <p className="reveal-item text-secondary font-medium leading-relaxed">
                  Our system combines classic radiologic pathology markers with state-of-the-art machine learning models to provide consistent diagnostic support.
                </p>
                
                <div className="reveal-item mt-10 p-6 glass-panel rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center font-bold text-primary">HR</div>
                  <div>
                    <p className="text-sm font-bold">Scientific precision</p>
                    <p className="text-xs text-muted">Model version: HistGradBoost-V2</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                {FEATURES.map((feature, i) => (
                  <div key={i} className="reveal-item glass-panel p-10 rounded-3xl glow-hover group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors">
                      <feature.icon size={28} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-sm text-secondary font-medium leading-[1.8]">
                      {feature.desc}
                    </p>
                  </div>
                ))}
                
                {/* Visual Placeholder for Scan */}
                <div className="reveal-item glass-panel p-2 rounded-3xl overflow-hidden min-h-[200px] relative">
                   <div className="absolute inset-0 bg-secondary opacity-10 animate-pulse" />
                   <div className="absolute inset-x-0 h-[1px] bg-primary/30 top-1/2 shadow-[0_0_15px_var(--color-primary)] animate-[scan-line_4s_infinite_linear]" />
                   <div className="absolute inset-0 flex items-center justify-center flex-col p-8 text-center">
                      <HiOutlineStatusOnline size={40} className="text-primary opacity-40 mb-3" />
                      <p className="text-xs font-bold text-muted uppercase tracking-widest">Live Analysis Pipeline Active</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-20 relative px-4">
        <div className="max-w-4xl mx-auto glass-panel p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-5" />
          <h2 className="text-3xl md:text-5xl font-extrabold mb-8 italic">Trust but verify.</h2>
          <p className="text-lg text-secondary mb-10 max-w-xl mx-auto font-medium">
            Join the research community in testing the future of automated triage. Your feedback drives our continuous retraining cycle.
          </p>
          <Link to="/predict">
            <button className="px-12 py-5 bg-primary text-white font-black rounded-2xl text-lg hover:scale-105 active:scale-95 transition-all">
              Initialize Diagnostics
            </button>
          </Link>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-10 text-center opacity-40 text-xs font-bold uppercase tracking-widest">
        &copy; 2026 ChestXR AI System • v2.05-Stable
      </footer>
    </div>
  )
}
