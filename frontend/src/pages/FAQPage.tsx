import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const faqData = [
  {
    category: 'Clinical Accuracy',
    icon: 'analytics',
    id: 'accuracy',
    items: [
      {
        q: 'How does Chest XR validate its diagnostic sensitivity?',
        a: 'Our models are trained on a diversified dataset of over 2.4 million curated chest radiographs. Each release undergoes peer-reviewed clinical validation studies against gold-standard radiologist interpretations, consistently achieving an AUC (Area Under Curve) of 0.94+ for critical findings like pneumothorax and pleural effusion.',
      },
      {
        q: 'Does the AI account for patient positioning and hardware?',
        a: 'Yes. Our preprocessing pipeline automatically detects and adjusts for common positional variations (AP vs PA projections) and normalizes for differences in X-ray hardware manufacturers, ensuring consistent diagnostic output across clinical settings.',
      },
    ],
  },
  {
    category: 'PACS Integration',
    icon: 'settings_input_component',
    id: 'integration',
    items: [
      {
        q: 'Which PACS providers are currently supported?',
        a: 'Chest XR supports standard DICOM protocols and is compatible with major PACS vendors including GE Centricity, Philips IntelliSpace, Sectra, and Fujifilm Synapse. Our cloud-native API and on-premise gateway ensure seamless workflow integration within 48 hours of deployment.',
      },
      {
        q: 'What are the bandwidth requirements for real-time analysis?',
        a: 'Our optimized image pipeline requires as little as 2 Mbps for real-time analysis. We support adaptive compression algorithms that maintain diagnostic quality while minimizing bandwidth usage, making it suitable for both urban and rural clinical settings.',
      },
    ],
  },
  {
    category: 'Data Security',
    icon: 'security',
    id: 'security',
    items: [
      {
        q: 'How is HIPAA compliance maintained during data transfer?',
        a: 'All data is encrypted in transit using TLS 1.3 and at rest with AES-256. We utilize a secure PHI-anonymization gateway that strips all identifying patient data before it leaves your internal hospital network, ensuring only de-identified pixel data is analyzed by the AI engine.',
      },
    ],
  },
]

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>('accuracy-0')
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-hero-badge', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2 })
      gsap.fromTo('.faq-hero-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' })
      gsap.fromTo('.faq-hero-desc', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.5 })
      gsap.fromTo('.faq-search', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.6 })

      gsap.fromTo('.faq-category', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.2,
        scrollTrigger: { trigger: '.faq-content', start: 'top 80%' }
      })

      gsap.fromTo('.faq-cta', { opacity: 0, scale: 0.95 }, {
        opacity: 1, scale: 1, duration: 0.7,
        scrollTrigger: { trigger: '.faq-cta', start: 'top 85%' }
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const toggleItem = (key: string) => {
    setOpenItem(openItem === key ? null : key)
  }

  return (
    <div ref={pageRef} className="bg-surface min-h-screen">
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">

        {/* ─── Hero ─── */}
        <section className="mb-24">
          <div className="max-w-3xl">
            <span className="faq-hero-badge inline-block py-1 px-4 mb-6 rounded-full bg-surface-container text-primary font-bold text-sm tracking-widest uppercase">
              Support Center
            </span>
            <h1 className="faq-hero-title text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface mb-8 leading-[0.9] font-headline">
              Questions. <br />
              <span className="text-primary">Clarified.</span>
            </h1>
            <p className="faq-hero-desc text-xl text-on-surface-variant leading-relaxed font-medium">
              Detailed technical and clinical documentation designed for practitioners, radiologists, and IT administrators.
            </p>
          </div>
        </section>

        {/* ─── Search ─── */}
        <section className="faq-search mb-16">
          <div className="bg-surface-container-low p-4 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center shadow-sm">
            <div className="relative w-full flex-grow group">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                search
              </span>
              <input
                className="w-full bg-surface-container-highest border-none rounded-full py-5 pl-16 pr-8 text-lg placeholder:text-on-surface-variant/50 transition-all"
                placeholder="Search for accuracy, HIPAA, PACS integration..."
                type="text"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
              <button className="whitespace-nowrap px-6 py-4 rounded-full bg-primary text-on-primary font-bold shadow-md">All Topics</button>
              <button className="whitespace-nowrap px-6 py-4 rounded-full bg-surface-container-high text-on-surface-variant font-semibold hover:bg-surface-container-highest transition-colors">Clinical Accuracy</button>
              <button className="whitespace-nowrap px-6 py-4 rounded-full bg-surface-container-high text-on-surface-variant font-semibold hover:bg-surface-container-highest transition-colors">Security</button>
              <button className="whitespace-nowrap px-6 py-4 rounded-full bg-surface-container-high text-on-surface-variant font-semibold hover:bg-surface-container-highest transition-colors">Deployment</button>
            </div>
          </div>
        </section>

        {/* ─── FAQ Content ─── */}
        <div className="faq-content grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Sidebar */}
          <aside className="lg:col-span-3 hidden lg:block">
            <nav className="sticky top-32 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/40 mb-6 px-4 font-label">Categories</h3>
              {faqData.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant font-medium"
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
                  {cat.category}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main FAQ */}
          <div className="lg:col-span-9 space-y-16">
            {faqData.map((cat) => (
              <section key={cat.id} id={cat.id} className="faq-category">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
                  </div>
                  <h2 className="text-3xl font-bold font-headline">{cat.category}</h2>
                </div>
                <div className="space-y-4">
                  {cat.items.map((item, idx) => {
                    const key = `${cat.id}-${idx}`
                    const isOpen = openItem === key
                    return (
                      <div key={key} className="bg-surface-container-low rounded-2xl overflow-hidden">
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between p-8 text-left hover:bg-surface-container transition-colors"
                        >
                          <span className="text-xl font-semibold pr-8">{item.q}</span>
                          <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-8 px-8' : 'max-h-0'}`}>
                          <p className="text-on-surface-variant leading-relaxed">{item.a}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* ─── CTA ─── */}
        <section className="mt-32">
          <div className="faq-cta relative bg-inverse-surface rounded-2xl p-12 overflow-hidden flex flex-col md:flex-row items-center gap-12">
            <div className="relative z-10 md:w-1/2">
              <h2 className="text-4xl font-bold text-inverse-on-surface mb-6 font-headline">Need more specialized assistance?</h2>
              <p className="text-lg text-inverse-on-surface/70 mb-8">
                Our technical solutions architects are available for a 1-on-1 walkthrough of the architecture and security whitepapers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/predict" className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold hover:scale-[0.97] transition-transform">
                  Schedule Tech Review
                </Link>
                <button className="border border-outline-variant/30 text-inverse-on-surface px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
                  Download Whitepaper
                </button>
              </div>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-96 w-full">
              <img
                alt="Server room"
                className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-40 mix-blend-overlay"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6TW6xJ7uG5Bcvf1Ks-VQfVWgBApINl7HuYWCEF0gEJ04xx3m-GNPvmn7CvKUMKEjeBJL5urg_susoTuw6TaohVlq1_PHcuOh-84pP6pR1OUqXOTvESjdDZU7ReI4LuQ20y1A5LG1zspYeON6ud55yvL2573WPQ9YG2gs7y5EboClCn4mApUxxzcW9_HCZou-5LKaQeHR7QFIQkDgtj0dnPwYLb7-wxpnaPelRjF15WBRX-s8HSMXCzjACOXGtTIwN7g2y-wl_nvc"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-transparent to-transparent" />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
