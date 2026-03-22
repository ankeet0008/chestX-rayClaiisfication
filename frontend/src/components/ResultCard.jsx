import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineChip,
  HiOutlineDownload,
} from 'react-icons/hi'

const getColor = (label) => {
  const norm = (label || '').toLowerCase();
  if (norm.includes('normal')) return { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' };
  if (norm.includes('covid') || norm.includes('virus') || norm.includes('viral')) return { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' };
  if (norm.includes('bact') || norm.includes('pneumonia')) return { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' };
  if (norm.includes('opacity')) return { bg: '#06b6d4', light: 'rgba(6, 182, 212, 0.1)' };
  
  return { bg: 'var(--color-primary)', light: 'rgba(139, 92, 246, 0.1)' };
}

export default function ResultCard({ result, imagePreview }) {
  const cardRef = useRef(null)
  
  useEffect(() => {
    if (result) {
      const ctx = gsap.context(() => {
        gsap.from(".reveal-result", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out"
        })
        
        // Progress bars animation
        gsap.from(".prob-bar", {
          width: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.5
        })
      }, cardRef)
      return () => ctx.revert()
    }
  }, [result])

  if (!result) return null

  const {
    prediction,
    confidence,
    all_predictions,
    model_loaded,
    note,
    inference_time_ms,
  } = result

  const mainColor = getColor(prediction)
  const isNormal = (prediction || '').toLowerCase().includes('normal')
  const confidencePct = (confidence * 100).toFixed(1)

  const sortedPredictions = Object.entries(all_predictions || {})
    .sort(([, a], [, b]) => b - a)

  return (
    <div ref={cardRef} className="w-full max-w-5xl mx-auto reveal-result">
      <div className="glass-panel rounded-[2.5rem] overflow-hidden border-2 border-white/5 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-2" style={{ background: mainColor.bg }} />
        
        <div className="p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Left: Radiographic Evidence */}
            <div className="reveal-result">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-6">
                 Radiographic Evidence
              </p>
              <div className="relative rounded-3xl overflow-hidden group shadow-2xl border-4 border-white/5">
                <img
                  src={imagePreview}
                  alt="Analyzed X-ray"
                  className="w-full h-auto object-contain bg-black max-h-[500px] transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                
                {/* HUD Overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                   <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                       Focal Analysis Active
                   </div>
                   <div 
                     className="px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 shadow-2xl"
                     style={{ backgroundColor: mainColor.bg }}
                   >
                     {isNormal ? <HiOutlineCheckCircle size={14} /> : <HiOutlineExclamationCircle size={14} />}
                     {prediction}
                   </div>
                </div>
              </div>
            </div>

            {/* Right: Pathological Analysis */}
            <div className="reveal-result space-y-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4">
                   Clinical Assessment
                </p>
                <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                  Target Pathology: <br />
                  <span style={{ color: mainColor.bg }}>{prediction}</span>
                </h2>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="px-4 py-2 glass-panel rounded-xl flex items-center gap-2 text-xs font-bold">
                    <HiOutlineClock className="text-primary" />
                    <span>{inference_time_ms?.toFixed(0) || '24'}ms Processed</span>
                  </div>
                  <div className="px-4 py-2 glass-panel rounded-xl flex items-center gap-2 text-xs font-bold">
                    <HiOutlineChip className="text-secondary" />
                    <span>{model_loaded ? 'HistGradBoost-V2' : 'Synthetic-Data Engine'}</span>
                  </div>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="p-8 glass-panel rounded-3xl border border-white/10 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-muted">Neural Confidence</span>
                  <span className="text-3xl font-black" style={{ color: mainColor.bg }}>{confidencePct}%</span>
                </div>
                <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden p-1 border border-white/5">
                  <div 
                    className="prob-bar h-full rounded-full shadow-[0_0_15px_var(--color-primary)]"
                    style={{ 
                      width: `${confidencePct}%`, 
                      background: mainColor.bg,
                      boxShadow: `0 0 20px ${mainColor.bg}60`
                    }}
                  />
                </div>
              </div>

              {/* Distribution */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-6">
                   Pathology Distribution
                </p>
                <div className="space-y-5">
                  {sortedPredictions.map(([label, prob], idx) => {
                    const color = getColor(label)
                    const pct = (prob * 100).toFixed(1)
                    const isTop = label === prediction

                    return (
                      <div key={label} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs uppercase tracking-widest font-black ${isTop ? 'text-primary' : 'text-muted'}`}>
                            {label}
                          </span>
                          <span className="text-xs font-black opacity-40">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                          <div 
                            className="prob-bar h-full rounded-full transition-all group-hover:scale-y-125 origin-left"
                            style={{ 
                              width: `${pct}%`, 
                              backgroundColor: isTop ? color.bg : 'var(--text-muted)',
                              opacity: isTop ? 1 : 0.3
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Download Actions */}
              <div className="pt-8 border-t border-white/5">
                 <button
                    onClick={() => {
                        const data = JSON.stringify(result, null, 2)
                        const blob = new Blob([data], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `report-${prediction}-${new Date().getTime()}.json`
                        a.click()
                    }}
                    className="w-full py-4 glass-panel rounded-2xl flex items-center justify-center gap-3 font-bold text-sm hover:bg-white/5 transition-all"
                 >
                   <HiOutlineDownload size={20} />
                   Archive Diagnostics Data
                 </button>
              </div>

              {note && (
                <div className="p-5 rounded-2xl bg-warning/5 border border-warning/20 flex gap-4">
                   <HiOutlineExclamationCircle className="text-warning flex-shrink-0" size={24} />
                   <div className="text-[10px] font-bold text-warning/80 leading-relaxed uppercase tracking-wider">
                      {note}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-center text-[10px] font-black text-muted uppercase tracking-[0.3em] mt-10 opacity-30">
         Automated Triage System • Non-Diagnostic Primary • Expert Review Recommended
      </p>
    </div>
  )
}
