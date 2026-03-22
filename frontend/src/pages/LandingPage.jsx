import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineChartBar,
  HiOutlineGlobe,
  HiOutlineUpload,
  HiOutlineEye,
  HiOutlineDocumentReport,
} from 'react-icons/hi'

gsap.registerPlugin(ScrollTrigger)

const C = ({ maxW = 1100, children, style = {} }) => (
  <div style={{ maxWidth: maxW, margin: '0 auto', padding: '0 1.5rem', width: '100%', ...style }}>
    {children}
  </div>
)

const STATS = [
  { value: '87.2%', label: 'Accuracy', icon: '🎯' },
  { value: '<2s', label: 'Inference', icon: '⚡' },
  { value: '25k+', label: 'X-Rays Trained', icon: '🏥' },
  { value: '5', label: 'Conditions', icon: '🔬' },
]

const FEATURES = [
  { icon: HiOutlineShieldCheck, title: 'Clinical-Grade AI', desc: 'Validated against 25,000+ expert-labeled radiographs for reliable diagnostic support.', color: '#6366f1' },
  { icon: HiOutlineLightningBolt, title: 'Instant Results', desc: 'HistGradient Boosting delivers pathology reports in under 2 seconds.', color: '#f59e0b' },
  { icon: HiOutlineGlobe, title: 'Multi-Class Detection', desc: 'Detects Normal, COVID-19, Lung Opacity, Viral & Bacterial Pneumonia.', color: '#06b6d4' },
]

const STEPS = [
  { num: '01', icon: HiOutlineUpload, title: 'Upload', desc: 'Drop your chest X-ray in JPG or PNG format' },
  { num: '02', icon: HiOutlineEye, title: 'Analyze', desc: 'Our AI scans & classifies in real-time' },
  { num: '03', icon: HiOutlineDocumentReport, title: 'Report', desc: 'Get a detailed pathology breakdown' },
]

export default function LandingPage() {
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
      tl.from('.hero-badge', { y: -20, opacity: 0 })
        .from('.hero-title-line', { y: 60, opacity: 0, stagger: 0.15 }, '-=0.5')
        .from('.hero-desc', { y: 30, opacity: 0 }, '-=0.4')
        .from('.hero-btn', { y: 20, opacity: 0, stagger: 0.1 }, '-=0.3')
        .from('.hero-visual', { scale: 0.9, opacity: 0 }, '-=0.5')

      gsap.from('.stat-card', { y: 40, opacity: 0, stagger: 0.08, duration: 0.7, clearProps: 'all', scrollTrigger: { trigger: '.stats-grid', start: 'top 100%', once: true } })
      gsap.from('.feat-card', { y: 50, opacity: 0, stagger: 0.12, duration: 0.8, clearProps: 'all', scrollTrigger: { trigger: '.feat-grid', start: 'top 100%', once: true } })
      gsap.from('.step-item', { y: 30, opacity: 0, stagger: 0.15, duration: 0.7, clearProps: 'all', scrollTrigger: { trigger: '.steps-grid', start: 'top 100%', once: true } })
      gsap.from('.cta-box', { y: 50, opacity: 0, duration: 1, clearProps: 'all', scrollTrigger: { trigger: '.cta-box', start: 'top 100%', once: true } })

      gsap.to('.orb-a', { y: -25, x: 15, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to('.orb-b', { y: 20, x: -20, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const sectionStyle = { width: '100%', position: 'relative', zIndex: 1 }

  return (
    <div ref={pageRef} style={{ width: '100%', position: 'relative' }}>
      {/* Orbs */}
      <div className="orb-a" style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)', top: '-100px', right: '-100px', filter: 'blur(60px)' }} />
      <div className="orb-b" style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle, rgba(6,182,212,0.06), transparent 70%)', bottom: '200px', left: '-100px', filter: 'blur(60px)' }} />

      {/* ─── HERO ─── */}
      <section style={{ ...sectionStyle, padding: '9rem 0 5rem' }}>
        <C maxW={900} style={{ textAlign: 'center' }}>
          <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '9999px', marginBottom: '2rem', background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>AI-Powered Diagnostics — v2.0</span>
          </div>

          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            <span className="hero-title-line" style={{ display: 'block' }}>Chest X-Ray</span>
            <span className="hero-title-line text-gradient" style={{ display: 'block' }}>Intelligence</span>
          </h1>

          <p className="hero-desc" style={{ fontSize: '1.125rem', color: 'var(--text-soft)', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Upload a radiograph and our AI detects <strong>5 pathologies</strong> in under 2 seconds with <strong>87.2%</strong> validated accuracy.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link to="/predict">
              <button className="hero-btn btn-primary" style={{ fontSize: '1rem' }}>
                Start Analysis <HiOutlineArrowRight size={20} />
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="hero-btn btn-outline" style={{ fontSize: '1rem' }}>
                <HiOutlineChartBar size={20} style={{ color: 'var(--primary)' }} /> View Dashboard
              </button>
            </Link>
          </div>

          <div className="hero-visual" style={{ maxWidth: '520px', margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', flexShrink: 0, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
                <div className="animate-scan" style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', boxShadow: '0 0 8px var(--primary)', pointerEvents: 'none' }} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#34d399' }}>Ready to Scan</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Normal · COVID · Lung Opacity · Pneumonia</p>
              </div>
            </div>
          </div>
        </C>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ ...sectionStyle, padding: '4rem 0' }}>
        <C>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-card glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <p className="text-gradient" style={{ fontSize: '2.25rem', fontWeight: 900, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.375rem', color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </C>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ ...sectionStyle, padding: '6rem 0' }}>
        <C>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.75rem' }}>Why ChestXR</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900 }}>Built for <span className="text-gradient">accuracy</span></h2>
          </div>
          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feat-card glass-card" style={{ padding: '2.5rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', background: `${f.color}18` }}>
                  <f.icon size={26} style={{ color: f.color }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-soft)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </C>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ ...sectionStyle, padding: '6rem 0', background: 'var(--bg-soft)' }}>
        <C>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.75rem' }}>How it works</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900 }}>Three simple <span className="text-gradient">steps</span></h2>
          </div>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {STEPS.map((s, i) => (
              <div key={i} className="step-item glass-card" style={{ padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-8px', right: '8px', fontSize: '5rem', fontWeight: 900, lineHeight: 1, pointerEvents: 'none', userSelect: 'none', color: 'var(--primary)', opacity: 0.05 }}>{s.num}</div>
                <div style={{ width: '60px', height: '60px', borderRadius: '14px', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.1)' }}>
                  <s.icon size={26} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-soft)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </C>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ ...sectionStyle, padding: '6rem 0' }}>
        <C maxW={760}>
          <div className="cta-box glass-card gradient-border-top" style={{ padding: '4rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--primary), var(--accent))', opacity: 0.03 }} />
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1.25rem', position: 'relative', zIndex: 1 }}>Ready to analyze?</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-soft)', marginBottom: '2.5rem', maxWidth: '460px', margin: '0 auto 2.5rem', lineHeight: 1.7, position: 'relative', zIndex: 1 }}>
              Upload your chest X-ray and get instant AI-powered diagnostic insights.
            </p>
            <Link to="/predict" style={{ position: 'relative', zIndex: 1 }}>
              <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                Get Started Free <HiOutlineArrowRight size={22} />
              </button>
            </Link>
          </div>
        </C>
      </section>
    </div>
  )
}
