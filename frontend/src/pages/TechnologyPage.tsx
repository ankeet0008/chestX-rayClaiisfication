import { useState } from 'react'

const faqs = [
  {
    btnText: 'How does ClinicalLens AI handle patient privacy?',
    content:
      'We are fully HIPAA and GDPR compliant. Our system uses "De-identification at the Edge," meaning all patient names, IDs, and birthdates are stripped from the metadata before the image ever leaves your local network. Only the pixel data is analyzed.',
  },
  {
    btnText: 'Is this intended to replace the radiologist?',
    content:
      'Absolutely not. ClinicalLens AI is a diagnostic support tool—a "second set of eyes." It is designed to flag potential abnormalities for clinician review, reducing diagnostic fatigue and helping prioritize urgent cases in a busy workflow.',
  },
  {
    btnText: 'What is the cost structure for medical institutions?',
    content:
      'We offer flexible pricing based on study volume. Options include a per-study fee for smaller clinics or enterprise-wide annual licenses for large hospital systems. Integration costs are typically waived for long-term partnerships.',
  },
]

export default function TechnologyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="bg-background">

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="pt-40 pb-28 md:pt-48 md:pb-36">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight mb-8 text-on-surface">
                Precision AI for <span className="text-primary">Diagnostic Clarity</span>
              </h1>
              <p className="text-on-surface-variant text-xl leading-relaxed max-w-2xl mb-10">
                Our proprietary neural networks analyze chest X-rays with
                clinical-grade accuracy, providing radiologists with a secondary
                "digital lens" to detect subtle abnormalities.
              </p>
              <div className="flex gap-4 flex-wrap">
                <span className="inline-flex items-center px-5 py-2.5 bg-secondary-container text-on-secondary-container rounded-full text-sm font-medium">
                  <span className="material-symbols-outlined mr-2 text-lg">verified_user</span>
                  FDA Cleared Class II
                </span>
                <span className="inline-flex items-center px-5 py-2.5 bg-secondary-container text-on-secondary-container rounded-full text-sm font-medium">
                  <span className="material-symbols-outlined mr-2 text-lg">security</span>
                  HIPAA Compliant
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-square bg-surface-dim rounded-2xl overflow-hidden cloud-shadow relative">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK8dVs4XW_7ReQhy0__WAMLLmlgCwOwmPJ0N4CdpOjp8Jb7rP1Ei4NW-fEOTufgVM6fF-zVZ50MhOwYPhcSube08KYrVIOb3dOTM4afrcrk4WLfHYKwqV3f3zHdqstB7XKnJAHzRAzrWivrAB9APuniUUwUeSAgUKlgHJzwnREKII5FCzwGAnoD73c3QKKXkpEjtLAe9bMzQFg5dO5pxVTIPWh2o5F9KyM5Dl5ncL6rLnvHNQHAdkR4Pw0QeanQcc5nU9XWKOI7wo"
                  alt="Modern medical diagnostic interface"
                />
                <div className="absolute inset-0 glass-panel opacity-40" />
                <div className="absolute top-5 right-5 bg-primary text-white p-3 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">analytics</span>
                  Live Analysis
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ WORKFLOW ════════════════════ */}
      <section className="bg-surface-container-low py-32">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-5">
              The ClinicalLens Workflow
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto text-lg">
              A seamless integration into existing hospital PACS networks,
              optimized for speed and clinical reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="bg-surface-container-lowest p-10 rounded-2xl cloud-shadow border-b-4 border-primary/20">
              <div className="w-14 h-14 bg-primary-fixed text-primary rounded-xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-2xl">upload_file</span>
              </div>
              <h3 className="font-headline text-xl font-bold mb-4">01. Secure Upload</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                DICOM images are encrypted and transmitted through our secure
                bridge. All Patient Health Information (PHI) is automatically
                de-identified at the source.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-container-lowest p-10 rounded-2xl cloud-shadow border-b-4 border-primary">
              <div className="w-14 h-14 bg-primary text-white rounded-xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-2xl">psychology</span>
              </div>
              <h3 className="font-headline text-xl font-bold mb-4">02. AI Analysis</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Our "Clinical Lens" neural network scans for 124 distinct
                findings, generating a probability heatmap and preliminary
                findings list in under 10 seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-container-lowest p-10 rounded-2xl cloud-shadow border-b-4 border-primary/20">
              <div className="w-14 h-14 bg-primary-fixed text-primary rounded-xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-2xl">description</span>
              </div>
              <h3 className="font-headline text-xl font-bold mb-4">03. Verified Report</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Findings are presented to the radiologist within their native
                viewer. The clinician reviews, edits, and signs off on the final
                diagnostic report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ BENTO TECH ════════════════════ */}
      <section className="py-32">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="mb-20">
            <span className="text-primary font-bold font-label uppercase text-xs tracking-widest mb-4 block">
              Core Technology
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">
              Deep Convolutional Neural Networks
            </h2>
            <p className="text-on-surface-variant leading-relaxed max-w-2xl text-lg">
              Our models are trained on over 2.5 million verified clinical cases
              from global teaching hospitals. Unlike generic AI, ClinicalLens is
              optimized specifically for the unique contrast and density profiles
              of digital radiography.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 bg-surface-container-high rounded-2xl p-10 flex gap-8 items-center">
              <div className="shrink-0 w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">speed</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-lg mb-2">Sub-10s Latency</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Edge-computing nodes ensure that AI insights appear the moment the
                  radiologist opens the study.
                </p>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-10 border border-outline-variant/20">
              <h4 className="font-headline font-bold text-lg mb-5">Accuracy</h4>
              <div className="text-5xl font-extrabold text-primary mb-3">99.2%</div>
              <p className="text-on-surface-variant text-xs">
                Sensitivity for pleural effusion detection in clinical trials.
              </p>
            </div>
            <div className="bg-primary text-white rounded-2xl p-10 flex flex-col justify-center">
              <span className="material-symbols-outlined text-4xl mb-5">security</span>
              <h4 className="font-headline font-bold text-lg mb-3">Zero-Trust</h4>
              <p className="text-primary-fixed text-xs opacity-80">
                Enterprise-grade security at every hop of the data journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ FAQ ════════════════════ */}
      <section id="faq" className="bg-surface-container-low py-32 scroll-mt-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-5">
              Frequently Asked Questions
            </h2>
            <p className="text-on-surface-variant text-lg">
              Everything you need to know about our technology and protocols.
            </p>
          </div>

          <div className="space-y-5">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-8 py-7 text-left flex justify-between items-center hover:bg-surface-container-low transition-colors"
                >
                  <span className="font-semibold text-on-surface pr-4">{faq.btnText}</span>
                  <span
                    className={`material-symbols-outlined transition-transform duration-300 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                <div
                  className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === idx ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-on-surface-variant text-sm leading-relaxed">{faq.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ CONTACT ════════════════════ */}
      <section className="py-32">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="bg-surface-container-lowest rounded-2xl p-14 md:p-16 cloud-shadow grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-headline text-3xl font-bold mb-6">Still have questions?</h2>
              <p className="text-on-surface-variant mb-10 leading-relaxed">
                Our clinical specialists and technical support team are available
                24/7 to assist with integration, training, or technical queries.
              </p>
              <div className="space-y-5">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <span className="font-medium text-sm">support@clinicallens.ai</span>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <span className="font-medium text-sm">+1 (800) CLINICAL</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-10 rounded-2xl">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-label">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-surface-container-highest border-none p-4 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                    placeholder="Dr. Sarah Johnson"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-label">
                    Institution
                  </label>
                  <input
                    className="w-full bg-surface-container-highest border-none p-4 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                    placeholder="Central General Hospital"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-label">
                    Message
                  </label>
                  <textarea
                    className="w-full bg-surface-container-highest border-none p-4 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                    placeholder="How can we help you?"
                    rows={4}
                  />
                </div>
                <button className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
