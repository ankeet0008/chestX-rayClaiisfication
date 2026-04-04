import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)
CustomEase.create("sunrise", "M0,0 C0.08,0.82 0.18,1 1,1")

/* ─── Decorative SVG Grid ───────────────────────────────────────── */
function GridLines() {
  return (
    <svg
      className="grid-lines absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0 }}
    >
      <defs>
        <pattern id="hero-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#0A3D2B" strokeWidth="0.4" strokeOpacity="0.08" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-grid)" />
      {/* Accent cross lines */}
      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#22C55E" strokeWidth="0.3" strokeOpacity="0.06" />
      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#22C55E" strokeWidth="0.3" strokeOpacity="0.06" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Landing Page — Cinematic Hero
   ═══════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const tapLabelRef = useRef<HTMLSpanElement>(null)
  const breathingTween = useRef<gsap.core.Tween | null>(null)
  const [revealed, setRevealed] = useState(false)

  /* ─── Phase 1: Sunrise entrance ────────────────────────────── */
  useEffect(() => {
    const navbar = document.getElementById('main-navbar')

    const ctx = gsap.context(() => {
      /* Hide navbar */
      if (navbar) gsap.set(navbar, { y: '-100%', opacity: 0 })

      /* Set everything invisible */
      gsap.set('.hero-eyebrow', { opacity: 0, y: -10 })
      gsap.set('.precision-inner', { x: '105%' })
      gsap.set('.is-care-inner', { x: '-105%' })
      gsap.set('.hero-bottom-block', { y: 40, opacity: 0 })
      gsap.set('.grid-lines', { opacity: 0 })

      /* Initial states for entrance */
      gsap.set(pillRef.current, { 
        y: '110vh', 
        opacity: 0, 
        scale: 1,
        boxShadow: '0 30px 80px rgba(0,0,0,0.12)' 
      })
      gsap.set(tapLabelRef.current, { opacity: 0 })
      
      const tl = gsap.timeline()

      /* Pill rises - custom ease + overshoot */
      tl.to(pillRef.current, { opacity: 1, duration: 0.6 }, 0)
      tl.to(pillRef.current, { y: -15, duration: 1.6, ease: 'sunrise' }, 0)
      tl.to(pillRef.current, { 
        y: 0, 
        duration: 0.4, 
        ease: 'elastic.out(1, 0.6)', 
        onComplete: () => {
          breathingTween.current = gsap.to(pillRef.current, {
            y: -10, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1
          })
        }
      }, 1.6)

      /* Tap reveal label (delayed 2.2s total) */
      tl.to(tapLabelRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        onComplete: () => {
          gsap.to(tapLabelRef.current, { opacity: 0.4, duration: 1, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        }
      }, 2.2)

    }, heroRef)

    return () => {
      ctx.revert()
      if (breathingTween.current) breathingTween.current.kill()
      /* Restore navbar on unmount */
      if (navbar) gsap.set(navbar, { y: '0%', opacity: 1 })
    }
  }, [])

  /* ─── Phase 2: Pill click ───────────────────────────────────── */
  const handleReveal = () => {
    if (revealed) return
    setRevealed(true)

    const navbar = document.getElementById('main-navbar')

    /* Kill breathing */
    if (breathingTween.current) {
      breathingTween.current.kill()
      gsap.to(pillRef.current, { y: 0, duration: 0.4, ease: 'power2.out' })
    }

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    tl
      /* 1 — Tactile micro-scale */
      .to(pillRef.current, {
        scale: 1.04,
        duration: 0.35,
        ease: 'power2.out',
      })
      .to(pillRef.current, {
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      })

      /* 2 — Fade out tap label */
      .to(
        tapLabelRef.current,
        { opacity: 0, y: 10, duration: 0.25, ease: 'power2.in' },
        0,
      )

      /* 3 — "Precision" slides from LEFT through the pill */
      .to(
        '.precision-inner',
        { x: '0%', duration: 1.0, ease: 'expo.out' },
        0.3,
      )

      /* 4 — "is Care" slides from RIGHT through the pill */
      .to(
        '.is-care-inner',
        { x: '0%', duration: 1.0, ease: 'expo.out' },
        0.3,
      )

      /* 5 — Navbar slides down */
      .to(
        navbar,
        { y: '0%', opacity: 1, duration: 0.9, ease: 'expo.out' },
        0.65,
      )

      /* 6 — Eyebrow label fades in */
      .to(
        '.hero-eyebrow',
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        0.7,
      )

      /* 7 — SVG grid ghosts in */
      .to('.grid-lines', { opacity: 1, duration: 1.2 }, 0.5)

      /* 8 — Bottom block (subtext + CTAs) rises */
      .to(
        '.hero-bottom-block',
        { y: 0, opacity: 1, duration: 1.0, ease: 'expo.out' },
        0.85,
      )
  }

  /* ─── Bento / Trust bar scroll animations ───────────────────── */
  const bentoRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.trust-item', { opacity: 0, y: 20 }, {
        opacity: 0.5, y: 0, duration: 0.5, stagger: 0.1,
        scrollTrigger: { trigger: trustRef.current, start: 'top 80%' },
      })
      gsap.fromTo('.bento-card', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: bentoRef.current, start: 'top 75%' },
      })
      gsap.fromTo(ctaRef.current, { opacity: 0, scale: 0.95 }, {
        opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef}>

      {/* ══════════════════════════════════════════════════════════
          CINEMATIC HERO
          ══════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
        style={{ backgroundColor: '#F5F2E8', transition: 'background-color 0s' }}
      >
        
        {/* Decorative grid */}
        <GridLines />

        {/* Ambient gradient blobs */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#22C55E]/[0.04] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#0A3D2B]/[0.03] blur-[100px] pointer-events-none" />

        {/* Eyebrow */}
        <span
          className="hero-eyebrow absolute top-[18%] text-[11px] font-bold tracking-[0.25em] uppercase text-[#0A3D2B]/70 z-10"
          style={{ fontFamily: 'Manrope, sans-serif' }}
        >
          AI-Enhanced Radiography
        </span>

        {/* ─── Headline Row ─── */}
        <div className="relative z-10 flex items-center justify-center gap-4 md:gap-6 px-6">

          {/* LEFT: "Precision" — clipped container */}
          <div className="overflow-hidden">
            <span
              className="precision-inner block text-[#1a1a17] whitespace-nowrap"
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(2.5rem, 8vw, 7.5rem)',
                letterSpacing: '-3px',
                lineHeight: 1,
              }}
            >
              Precision
            </span>
          </div>

          {/* CENTER: Hero Capsule / Pill Image */}
          <div
            ref={pillRef}
            onClick={handleReveal}
            className="relative flex-shrink-0 cursor-pointer group"
            style={{
              width: 'clamp(140px, 16vw, 220px)',
              height: 'clamp(210px, 24vw, 320px)',
              borderRadius: '999px',
              overflow: 'hidden',
              opacity: 0,
              boxShadow: '0 20px 60px -12px rgba(10, 61, 43, 0.25)',
            }}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvPHGNanuDUWBU7iU3fGWL8AX865z7JN8ZqD__AF6KZQZRBX1F8ZzFOC8ckb0VH5pIhRNMVR5uNq1lGhA1TZFce2HKIhcEAAq5XBMPTWxHIpDt_eXdEHvUZ7Q0j9APqU-DJOQMa7Iff3Ma5Bq_-Jtaj9D6ZAz5QAVmRNWWaY3xkris8J4Msir7rwAtkqjji-NVEr9IPPbJXLPWbg3W0YfS8Sha-qp8kVDN5vACbdCbpYvXmAWK6GQyHTSXwo3jYE_Nb252VKE9RA0"
              alt="Clinician reviewing chest x-ray with patient"
            />
            {/* Hover ring */}
            <div
              className="absolute inset-0 rounded-full border-2 border-[#22C55E]/0 group-hover:border-[#22C55E]/40 transition-all duration-500"
              style={{ borderRadius: '999px' }}
            />
          </div>

          {/* RIGHT: "is Care" — clipped container */}
          <div className="overflow-hidden">
            <span
              className="is-care-inner block text-[#1a1a17] whitespace-nowrap"
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(2.5rem, 8vw, 7.5rem)',
                letterSpacing: '-3px',
                lineHeight: 1,
              }}
            >
              is Care
            </span>
          </div>
        </div>

        {/* Tap to reveal label */}
        <span
          ref={tapLabelRef}
          className="absolute z-20 text-[10px] font-bold tracking-[0.3em] uppercase text-[#0A3D2B]/50"
          style={{
            bottom: 'clamp(18%, 22%, 28%)',
            opacity: 0,
            transform: 'translateY(8px)',
            fontFamily: 'Manrope, sans-serif',
          }}
        >
          {!revealed && '● Tap to reveal'}
        </span>

        {/* ─── Bottom Block (subtext + CTAs) ─── */}
        <div className="hero-bottom-block absolute bottom-[8%] left-0 right-0 flex flex-col items-center gap-8 px-8 z-10">
          <p
            className="max-w-xl text-center text-lg md:text-xl text-[#1a1a17]/70 leading-relaxed font-medium"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Harnessing state-of-the-art XR imaging and predictive diagnostics to
            empower clinicians with unparalleled clarity in thoracic health.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Link
              to="/predict"
              className="px-10 py-4 rounded-full font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              style={{
                background: '#22C55E',
                color: '#0A3D2B',
                fontFamily: 'Manrope, sans-serif',
              }}
            >
              Request Pilot
            </Link>
            <Link
              to="/technology"
              className="group flex items-center gap-2 font-bold text-base"
              style={{ color: '#0A3D2B', fontFamily: 'Manrope, sans-serif' }}
            >
              Learn More
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRUST BAR
          ══════════════════════════════════════════════════════════ */}
      <section ref={trustRef} className="bg-surface-container-low py-16">
        <div className="max-w-screen-2xl mx-auto px-8">
          <p className="text-center font-label text-xs font-semibold tracking-widest text-on-surface/40 uppercase mb-10">
            Trusted by Leading Medical Institutions & Compliant with Global Standards
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 grayscale hover:grayscale-0 transition-all duration-500">
            {[
              { icon: 'medical_services', label: 'Mayo Clinic' },
              { icon: 'verified_user', label: 'FDA CLEARED' },
              { icon: 'shield', label: 'HIPAA COMPLIANT' },
              { icon: 'apartment', label: 'Johns Hopkins' },
              { icon: 'health_metrics', label: 'NHS Trust' },
            ].map((p) => (
              <div key={p.label} className="trust-item h-8 md:h-10 flex items-center gap-2 font-headline font-bold text-xl">
                <span className="material-symbols-outlined text-3xl">{p.icon}</span>
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BENTO FEATURES
          ══════════════════════════════════════════════════════════ */}
      <section className="py-32 px-8 max-w-screen-2xl mx-auto">
        <div ref={bentoRef} className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
          <div className="bento-card md:col-span-7 bg-surface-container rounded-2xl p-12 flex flex-col justify-end relative overflow-hidden group">
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwSR_UWK2BnlNSZEN4gkQYeR4wd6BOK-i5oPb8W0UQ9olF4sRaImNdi25IjMSxkXHdZ6l1aObx_RT3Z6rUqq8BTvrQa98G7mA5s8fqYYuK3pG07zT_n0udfEmiha7GsBmBxW7GX07ti2pAR_sBzbcIJc-1_mOU8_3TdTnY2U3lF0L6NvuceomPZ6nvlyki9jYL_rV8SgV2z4oaZnaM6brxJrA7CEeUmGk87fC2e1pNRjVyAL7iXv7Ju3gdr3DPKCRNJyqQpibLjQI"
                alt=""
              />
            </div>
            <div className="relative z-10">
              <h3 className="font-headline text-5xl font-bold text-primary mb-6">Sub-millimeter Precision</h3>
              <p className="text-xl text-on-surface-variant max-w-md">
                Our neural networks detect anomalies that remain invisible to the naked eye, reducing misdiagnosis rates by up to 42%.
              </p>
            </div>
          </div>
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="bento-card h-1/2 bg-primary text-on-primary rounded-2xl p-12 flex flex-col justify-between">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
              <div>
                <h3 className="font-headline text-3xl font-bold mb-4">Instant Analysis</h3>
                <p className="text-on-primary/80">Get comprehensive diagnostic reports in under 30 seconds, optimized for emergency room workflows.</p>
              </div>
            </div>
            <div className="bento-card h-1/2 bg-surface-container-high rounded-2xl p-12 flex flex-col justify-between">
              <span className="material-symbols-outlined text-5xl text-primary">diversity_3</span>
              <div>
                <h3 className="font-headline text-3xl font-bold text-on-surface mb-4">Bias-Free Logic</h3>
                <p className="text-on-surface-variant">Trained on the world's most diverse radiological dataset to ensure equitable diagnostic accuracy for all demographics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA
          ══════════════════════════════════════════════════════════ */}
      <section className="max-w-screen-xl mx-auto px-8 mb-32">
        <div ref={ctaRef} className="bg-primary text-on-primary rounded-2xl p-16 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl -ml-48 -mb-48" />
          <h2 className="font-headline text-5xl md:text-7xl font-extrabold mb-8 relative z-10">
            Ready to redefine thoracic diagnostics?
          </h2>
          <p className="text-xl md:text-2xl text-on-primary/90 mb-12 max-w-3xl mx-auto relative z-10">
            Join 500+ clinical centers transforming patient outcomes with Chest XR's precision imaging suite.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <Link to="/predict" className="px-12 py-6 bg-surface text-primary font-bold text-xl rounded-full hover:bg-surface-container-lowest transition-all">
              Schedule a Demo
            </Link>
            <Link to="/technology" className="px-12 py-6 border-2 border-on-primary text-on-primary font-bold text-xl rounded-full hover:bg-on-primary hover:text-primary transition-all">
              View Case Studies
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
