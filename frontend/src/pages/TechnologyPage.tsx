import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function TechnologyPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero
      gsap.fromTo('.tech-hero-badge', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2 })
      gsap.fromTo('.tech-hero-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' })
      gsap.fromTo('.tech-hero-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.5 })
      gsap.fromTo('.tech-hero-img', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.9, delay: 0.6, ease: 'power2.out' })
      gsap.fromTo('.tech-accuracy-card', { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.9, ease: 'back.out(1.5)' })

      // Neural Engine
      gsap.fromTo('.neural-card', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.15,
        scrollTrigger: { trigger: '.neural-section', start: 'top 75%' }
      })

      // Compliance
      gsap.fromTo('.compliance-card', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.12,
        scrollTrigger: { trigger: '.compliance-section', start: 'top 75%' }
      })

      // Tech Stack
      gsap.fromTo('.stack-card', { opacity: 0, y: 30, scale: 0.95 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.tech-stack-section', start: 'top 80%' }
      })

      // Privacy
      gsap.fromTo('.privacy-item', { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.2,
        scrollTrigger: { trigger: '.privacy-section', start: 'top 75%' }
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} className="bg-surface">
      {/* ════════════ HERO ════════════ */}
      <section className="px-8 py-16 md:py-24 max-w-7xl mx-auto pt-32 flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2">
          <span className="tech-hero-badge inline-block px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label text-sm font-bold tracking-widest mb-6">
            OUR CORE PHILOSOPHY
          </span>
          <h1 className="tech-hero-title text-6xl md:text-7xl lg:text-8xl font-headline font-extrabold tracking-tighter text-on-surface mb-8 leading-[0.9]">
            Precision is Care
          </h1>
          <p className="tech-hero-desc text-xl text-on-surface-variant leading-relaxed max-w-xl mb-12">
            In medical diagnostics, a single pixel represents a patient's story. Our technology is designed not just to detect, but to support clinicians with unprecedented accuracy and human empathy.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/predict" className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity">
              Explore Engine
            </Link>
            <Link to="/technology#privacy" className="flex items-center gap-3 text-primary font-bold px-6 py-4">
              Compliance Specs <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative">
          <div className="tech-hero-img hero-capsule-mask h-[600px] w-full shadow-2xl relative z-10">
            <img
              alt="Radiologist analyzing a chest x-ray"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb2vOXMQVu68XQEj-BWlFK9aSkb4dG1xB62kaxwOUb2qQ-Y-DrzFO5ixodhT9ONOcFJvgdWTz3fov5kZ9AiQtpXYXAZc6cIGj8mbk9XAA7-u_ol-3ou71lio8kurw38XS4a896SROW3rfoOx3hK1AMZOoFeodswekRMwSaN_6Qix_Xf7r3Cqx5YXSumcrVs2enTQ6dH4AInVlOYQNE28IH4WLVdTOWZEo77zssrP-x3wKSksb2WdJqkJnBmye8v9N83lwg1too4go"
            />
          </div>
          <div className="tech-accuracy-card absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 bg-surface-container-highest/90 p-8 rounded-3xl z-20 max-w-sm shadow-2xl border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>query_stats</span>
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">Empirical Performance</p>
                <p className="text-[10px] text-on-surface-variant tracking-[0.2em] font-bold uppercase mt-1">Sklearn • Test Split</p>
              </div>
            </div>
            
            <div className="flex gap-8 border-t border-outline-variant/20 pt-5">
              <div>
                <p className="text-4xl font-headline font-extrabold text-primary mb-1">92.4%</p>
                <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">Validation Acc</p>
              </div>
              <div className="w-px bg-outline-variant/20"></div>
              <div>
                <p className="text-4xl font-headline font-extrabold text-primary mb-1">0.91</p>
                <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">F1 Score (Macro)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ NEURAL SYNTHESIS ENGINE ════════════ */}
      <section className="neural-section bg-surface-container-low py-32 px-8 rounded-2xl mx-4 md:mx-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">Neural Synthesis Engine</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
              Our proprietary architecture goes beyond simple pattern matching to understand the volumetric context of pulmonary health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[700px]">
            {/* Deep Volumetric Analysis */}
            <div className="neural-card md:col-span-7 bg-surface-container-lowest p-12 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <div className="text-primary mb-8">
                  <span className="material-symbols-outlined text-5xl">neurology</span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-4">Deep Volumetric Analysis</h3>
                <p className="text-on-surface-variant text-lg max-w-md">
                  Our AI interprets 2D imagery by synthesizing 3D structures, identifying anomalies that standard models overlook.
                </p>
              </div>
              <div className="mt-8 relative z-10">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>Real-time shadow subtraction</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>Vascular segment isolation</span>
                  </li>
                </ul>
              </div>
              <div className="absolute right-[-10%] bottom-[-10%] w-3/4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[30rem]">grain</span>
              </div>
            </div>

            {/* Right column */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="neural-card bg-primary text-on-primary p-8 rounded-2xl h-1/2 flex flex-col justify-end">
                <span className="material-symbols-outlined text-4xl mb-6">speed</span>
                <h3 className="text-2xl font-headline font-bold mb-2">12-Second Processing</h3>
                <p className="text-on-primary/80">From image upload to preliminary analysis in under 15 seconds, accelerating clinical decision-making.</p>
              </div>
              <div className="neural-card bg-surface-container p-8 rounded-2xl h-1/2 flex flex-col justify-end">
                <span className="material-symbols-outlined text-4xl mb-6 text-primary">diversity_2</span>
                <h3 className="text-2xl font-headline font-bold mb-2">Bias Neutrality</h3>
                <p className="text-on-surface-variant">Trained on diverse global datasets to ensure equitable performance across all demographics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ ENGINEERING STACK & AESTHETICS ════════════ */}
      <section className="tech-stack-section py-32 px-8 max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label text-sm font-bold tracking-widest mb-4">
            UNDER THE HOOD
          </span>
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">Built for Performance & Beauty</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed">
            Our platform merges bleeding-edge machine learning with a cinematic user experience. We utilize highly-specialized libraries to maintain fluid motion, pixel-perfect aesthetics, and rapid inference delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: 'animation',
              title: 'GSAP Animation',
              desc: 'Cinematic micro-interactions, scroll-triggered timelines, and physics-based sequencing to bring the interface to life.',
            },
            {
              icon: 'palette',
              title: 'Tailwind CSS V4',
              desc: 'Robust token-based design system managing harmonious color palettes (HSL), deep dark modes, and crisp typography.',
            },
            {
              icon: 'view_quilt',
              title: 'React 19 & Vite',
              desc: 'Blazing fast frontend performance with modern functional components, state management, and optimized asset delivery.',
            },
            {
              icon: 'memory',
              title: 'FastAPI & Sklearn',
              desc: 'High-throughput async Python backend serving HistGradientBoosting and RandomForest classification models instantly.',
            }
          ].map((stack, idx) => (
            <div key={idx} className="stack-card bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 hover:bg-surface-container-highest transition-colors group relative overflow-hidden">
              <div className="text-primary mb-6 transition-transform group-hover:scale-110 group-hover:text-primary-container-highest origin-left duration-300">
                <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>{stack.icon}</span>
              </div>
              <h4 className="text-xl font-headline font-bold mb-3">{stack.title}</h4>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                {stack.desc}
              </p>
              <div className="absolute right-[-20%] bottom-[-20%] opacity-0 group-hover:opacity-5 transition-opacity duration-500 text-primary pointer-events-none">
                 <span className="material-symbols-outlined text-[15rem] leading-none">{stack.icon}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ COMPLIANCE ════════════ */}
      <section className="compliance-section py-32 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-5xl font-headline font-bold mb-8">Trust by Design, Security by Default</h2>
            <p className="text-lg text-on-surface-variant mb-12">
              We maintain the highest standards of regulatory compliance and data protection.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="compliance-card p-6 border border-outline-variant/15 rounded-2xl">
                <div className="w-14 h-14 bg-surface-container flex items-center justify-center rounded-lg mb-4 text-primary">
                  <span className="material-symbols-outlined text-3xl">security</span>
                </div>
                <h4 className="font-bold mb-2">HIPAA Compliant</h4>
                <p className="text-sm text-on-surface-variant">End-to-end encryption for all PHI in transit and at rest.</p>
              </div>
              <div className="compliance-card p-6 border border-outline-variant/15 rounded-2xl">
                <div className="w-14 h-14 bg-surface-container flex items-center justify-center rounded-lg mb-4 text-primary">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <h4 className="font-bold mb-2">FDA Cleared</h4>
                <p className="text-sm text-on-surface-variant">Class II Medical Device clearance for triage and notification.</p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="compliance-card bg-surface-container rounded-2xl overflow-hidden h-48">
                <img alt="Server room" className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAASippwao1c2ln1n6kVwPuLSlB1TWWt4pU7tBacEGNyMomXGmHOVUMr9aMrUiZSJfws6l7-88cDO91eaXygIAOZSik26zlE5PUFPKpgzWTCRmONUspkQAQBptRiMmmopFmI5G68fhPIrwNdXKhRANYLWvpkwlflZWXLQlw8g6p0dhA_qoKW-_Ry3M5W5JjO0NyHBWzaJTjLH6KJYLtRVtT_fpinyCbcl5i3Jz5XoOdP3cWncHrBci6CzQioWg9lOLuupgK9rgQUHc"
                />
              </div>
              <div className="compliance-card bg-primary-container p-6 rounded-2xl h-64 flex flex-col justify-between">
                <span className="text-on-primary-container font-bold text-sm tracking-widest font-label">ENCRYPTION</span>
                <p className="text-on-primary-container text-2xl font-headline font-bold">AES-256 Military Grade Protection</p>
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="compliance-card bg-on-surface p-6 rounded-2xl h-64 flex flex-col justify-between text-surface">
                <span className="text-surface/50 font-bold text-sm tracking-widest font-label">ISO 27001</span>
                <p className="text-2xl font-headline font-bold">International standards for data management.</p>
              </div>
              <div className="compliance-card bg-surface-container rounded-2xl overflow-hidden h-48">
                <img alt="Biometric security" className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7OtL013Al0c9TdP9EdtCG5CtepSIzBDil0itFAnSw49fETVpZuh4u60OkSulpiWDeuZHutOP-kOTuRB5GaZ8TpilsYSkdu_aR05HDsqcPvW6GaaFXhS8B6XSmn94nJE0QRPwsnU1SmWpJjn3VndQUqZ7__kFSaM-Leqxj7V-wEj9nUolyT6zd8odxFOg_qC-pI8SpoLqv6MgN7kas6K1t4Qp88Uty-GmFcf3LDGbxPlq87lyIRFgqelk-CPKUpy7BSq-qLyHeDAY"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ PRIVACY ════════════ */}
      <section id="privacy" className="privacy-section bg-on-surface text-surface py-32 rounded-b-[3rem]">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-headline font-bold mb-6">Uncompromising Privacy Protocols</h2>
            <p className="text-surface/70 text-lg">We don't just protect data; we respect the individuals behind it.</p>
          </div>
          <div className="space-y-12">
            {[
              { num: '01', title: 'Anonymization at Source', desc: 'Before any scan reaches our neural network, our local gateway strips all identifying metadata. The analysis is performed on pure clinical pixels, never tied to a name until it returns to your internal hospital system.' },
              { num: '02', title: 'Zero-Persistence Policy', desc: 'Once a report is successfully generated and delivered, the pixel data is purged from our active memory within 60 seconds. We provide intelligence, we do not store your intellectual property.' },
              { num: '03', title: 'Audit Trail Sovereignty', desc: 'Our platform provides a comprehensive, tamper-proof blockchain ledger of every analysis, ensuring full accountability for hospital administrators and compliance officers.' },
            ].map((p) => (
              <div key={p.num} className="privacy-item flex flex-col md:flex-row gap-12 items-start group">
                <div className="text-primary text-4xl font-headline font-bold shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                  {p.num}
                </div>
                <div>
                  <h4 className="text-2xl font-headline font-bold mb-4">{p.title}</h4>
                  <p className="text-surface/60 text-lg leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CTA ════════════ */}
      <section className="py-32 px-8 text-center max-w-4xl mx-auto">
        <h2 className="text-5xl font-headline font-extrabold mb-8 tracking-tight">Ready to elevate your diagnostics?</h2>
        <p className="text-xl text-on-surface-variant mb-12">Join over 150 leading medical institutions leveraging Chest XR's precision-first technology.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/predict" className="bg-primary text-on-primary px-12 py-5 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all">
            Schedule a Technical Demo
          </Link>
          <Link to="/faq" className="bg-surface-container text-on-surface px-12 py-5 rounded-full font-bold text-lg hover:bg-surface-container-high transition-all">
            Review API Docs
          </Link>
        </div>
      </section>
    </div>
  )
}
