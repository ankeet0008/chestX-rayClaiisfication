import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const bentoRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2 })
      gsap.fromTo('.hero-title-1', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' })
      gsap.fromTo('.hero-capsule', { opacity: 0, scale: 0.8, rotate: -10 }, { opacity: 1, scale: 1, rotate: -4, duration: 1, delay: 0.5, ease: 'back.out(1.7)' })
      gsap.fromTo('.hero-title-2', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' })
      gsap.fromTo('.hero-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.8 })
      gsap.fromTo('.hero-btns', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 1 })

      // Trust bar
      gsap.fromTo('.trust-item', { opacity: 0, y: 20 }, {
        opacity: 0.5, y: 0, duration: 0.5, stagger: 0.1,
        scrollTrigger: { trigger: trustRef.current, start: 'top 80%' }
      })

      // Bento grid
      gsap.fromTo('.bento-card', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: bentoRef.current, start: 'top 75%' }
      })

      // CTA
      gsap.fromTo(ctaRef.current, { opacity: 0, scale: 0.95 }, {
        opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' }
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef} className="bg-background">

      {/* ════════════ HERO ════════════ */}
      <section className="max-w-screen-2xl mx-auto px-8 pt-44 pb-32">
        <div className="flex flex-col items-center text-center">
          <span className="hero-badge font-label text-xs font-bold tracking-[0.2em] uppercase text-primary mb-8">
            AI-Enhanced Radiography
          </span>

          <div className="hero-text-mask mb-12">
            <h1 className="hero-title-1 font-headline text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] font-extrabold tracking-tight text-on-surface">
              Precision
            </h1>

            {/* Signature Hero Capsule */}
            <div className="hero-capsule w-48 h-72 md:w-64 md:h-96 rounded-full overflow-hidden rotate-[-4deg] border-[12px] border-surface-container shadow-xl">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvPHGNanuDUWBU7iU3fGWL8AX865z7JN8ZqD__AF6KZQZRBX1F8ZzFOC8ckb0VH5pIhRNMVR5uNq1lGhA1TZFce2HKIhcEAAq5XBMPTWxHIpDt_eXdEHvUZ7Q0j9APqU-DJOQMa7Iff3Ma5Bq_-Jtaj9D6ZAz5QAVmRNWWaY3xkris8J4Msir7rwAtkqjji-NVEr9IPPbJXLPWbg3W0YfS8Sha-qp8kVDN5vACbdCbpYvXmAWK6GQyHTSXwo3jYE_Nb252VKE9RA0"
                alt="Clinician showing digital chest x-ray to a patient"
              />
            </div>

            <h1 className="hero-title-2 font-headline text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] font-extrabold tracking-tight text-on-surface">
              is Care
            </h1>
          </div>

          <p className="hero-desc max-w-2xl text-xl md:text-2xl text-on-surface-variant font-medium mb-12 leading-relaxed">
            Harnessing state-of-the-art XR imaging and predictive diagnostics to empower clinicians with unparalleled clarity in thoracic health.
          </p>

          <div className="hero-btns flex flex-col sm:flex-row items-center gap-8">
            <Link
              to="/predict"
              className="px-10 py-5 bg-primary-container text-on-primary-container font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Request Pilot
            </Link>
            <Link
              to="/technology"
              className="group flex items-center gap-2 font-headline font-bold text-lg text-primary"
            >
              Learn More
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════ TRUST BAR ════════════ */}
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

      {/* ════════════ BENTO FEATURES ════════════ */}
      <section className="py-32 px-8 max-w-screen-2xl mx-auto">
        <div ref={bentoRef} className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
          {/* Sub-millimeter Precision */}
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

          {/* Right column */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Instant Analysis */}
            <div className="bento-card h-1/2 bg-primary text-on-primary rounded-2xl p-12 flex flex-col justify-between">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
              <div>
                <h3 className="font-headline text-3xl font-bold mb-4">Instant Analysis</h3>
                <p className="text-on-primary/80">Get comprehensive diagnostic reports in under 30 seconds, optimized for emergency room workflows.</p>
              </div>
            </div>

            {/* Bias-Free Logic */}
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

      {/* ════════════ CTA ════════════ */}
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
