import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="bg-background">

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative overflow-hidden pt-40 pb-32 md:pt-48 md:pb-40">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left copy */}
          <div className="lg:col-span-6 space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary-container text-on-secondary-fixed-variant rounded-full text-xs font-semibold tracking-wide uppercase">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              FDA Cleared Class II Software
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tight text-on-surface leading-[1.08]">
              Precision Vision for{' '}
              <span className="text-primary">Diagnostic</span> Radiology.
            </h1>

            <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed">
              Chest XR provides high-precision diagnostic assistance for
              chest X-rays, reducing interpretation time and increasing detection
              accuracy through advanced neural networks.
            </p>

            <div className="flex flex-wrap gap-5 pt-2">
              <Link
                to="/predict"
                className="gradient-primary text-white px-8 py-4 rounded-xl font-bold text-lg cloud-shadow hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                Start Clinical Analysis
              </Link>
              <Link
                to="/technology"
                className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-container-high transition-all"
              >
                View Technology Whitepaper
              </Link>
            </div>
          </div>

          {/* Right hero image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-surface-dim p-4 group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO7IcV5ww6kwrvEeNxHgDdAsVYHy6KUtLxJdjRlRfvSAzW4Xyv94vLkqtbEGvXK44LCspxJp-blv6lFIeDjhZRYCgUjF7AztLvXEBIQd7zRHrcCSTifsSq1RIOwGSmFx_WnyCqSgRcCUZ7FIRNOGe49MNrT5n5tY0lK7Ni2JFnja7i-tAiV3sFldjoPDiGJdqBJOI7insjREwZi23eyass7MdBq1KaMQBWBvvQSDYEtGZWpRs5Quy29eyBzt0w-RaAsk1IHYUdEkE"
                alt="Radiologist in a dimly lit clinical setting"
                className="rounded-xl w-full aspect-[4/3] object-cover"
              />

              {/* Glassmorphism HUD */}
              <div className="absolute bottom-10 right-10 left-10 diagnostic-overlay p-6 rounded-xl border border-white/20 cloud-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                      <span className="material-symbols-outlined">analytics</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                        Analysis Engine
                      </p>
                      <p className="text-sm font-semibold">Active Scanning...</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-xs font-bold">
                    Potential Findings (2)
                  </div>
                </div>
                <div className="h-1 w-full bg-outline-variant/30 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ BENTO BENEFITS ════════════════════ */}
      <section className="bg-surface-container-low py-32">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-5">
              Diagnostic Excellence.
            </h2>
            <p className="text-on-surface-variant text-lg max-w-2xl">
              Engineered for the demands of high-volume clinical environments
              without compromising on precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 99.2 % */}
            <div className="md:col-span-2 bg-surface-container-lowest p-12 rounded-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-primary text-4xl mb-6 block">target</span>
                <h3 className="text-2xl font-bold font-headline mb-5">
                  99.2% Detection Accuracy
                </h3>
                <p className="text-on-surface-variant max-w-md leading-relaxed">
                  Our proprietary neural architecture has been trained on over 5
                  million validated clinical images, achieving gold-standard
                  performance across 14 distinct lung pathologies.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCWSLLs2KqfuCxJUiJlGR8aLAM2y1BmSVhGQktWJoaSZrcK-hUo3BMt20xa5LtVtG-QFYxljEKZg2tfotMkaSXfsVXxh6c9rH8uqftvriYXdZctJvOhEl-cqhb-7pcKS653tFryyT8vqn2JKID-V9cPTD6iltvb-DdpGXfoWDxuskmtgGTTxRZcKzqqP4P4fbfuNeS3uM7Tyx8I_5vxgHQse0k64jlSJgm0MqZ_d6P11RDmhgIbJlLbkYfm7Z7FYyTNSMlLJ4Qr0E"
                  className="object-cover h-full w-full"
                  alt=""
                />
              </div>
            </div>

            {/* Security */}
            <div className="bg-primary text-white p-12 rounded-2xl flex flex-col justify-between min-h-[320px]">
              <div>
                <span
                  className="material-symbols-outlined text-4xl mb-6 block"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  security
                </span>
                <h3 className="text-2xl font-bold font-headline mb-5">
                  Enterprise Security
                </h3>
              </div>
              <p className="opacity-80 leading-relaxed text-sm">
                Fully HIPAA and GDPR compliant. End-to-end encryption for all
                patient metadata and imaging files with zero-knowledge
                architecture.
              </p>
            </div>

            {/* Rapid Triage */}
            <div className="bg-surface-container-high p-12 rounded-2xl">
              <span className="material-symbols-outlined text-secondary text-4xl mb-6 block">speed</span>
              <h3 className="text-2xl font-bold font-headline mb-5">Rapid Triage</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                Interpretations delivered in under 12 seconds. Prioritize
                critical "STAT" cases automatically in the clinician worklist.
              </p>
            </div>

            {/* PACS Integration */}
            <div className="md:col-span-2 bg-surface-container-lowest p-12 rounded-2xl border border-outline-variant/10">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold font-headline mb-5">
                    Native PACS Integration
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed text-sm">
                    Chest XR integrates directly with your existing DICOM
                    viewers and hospital information systems. No disruptive
                    workflow changes required.
                  </p>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {['DICOM', 'HL7', 'FHIR', 'CLOUD'].map((t) => (
                    <div
                      key={t}
                      className="bg-background p-5 rounded-lg flex items-center justify-center font-bold text-outline text-xs"
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ CTA ════════════════════ */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-10 bg-surface-container-highest rounded-2xl p-16 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
          <h2 className="text-4xl font-bold font-headline">
            Ready to elevate your clinical precision?
          </h2>
          <p className="text-xl text-on-surface-variant">
            Join 500+ medical facilities worldwide using Chest XR for
            smarter diagnostics.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button className="gradient-primary text-white px-10 py-5 rounded-xl font-bold text-lg cloud-shadow hover:scale-105 transition-all">
              Request Clinical Demo
            </button>
            <button className="bg-white text-primary px-10 py-5 rounded-xl font-bold text-lg border border-primary/10 hover:bg-surface-container-low transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
