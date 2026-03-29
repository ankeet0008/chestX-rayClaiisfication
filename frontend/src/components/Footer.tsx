import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#f0f4f8] dark:bg-slate-900 border-t border-[#c2c6d4]/10">
      <div className="w-full px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-screen-2xl mx-auto">
        <div className="space-y-4">
          <div className="text-lg font-bold text-[#424752] dark:text-slate-300 font-headline">Chest XR Diagnostics</div>
          <p className="text-[#424752] dark:text-slate-400 font-body text-xs leading-relaxed max-w-sm">
            © 2024 Chest XR Diagnostics. FDA Cleared Class II Software. AI models are intended as diagnostic aids and should be reviewed by qualified medical professionals.
          </p>
        </div>
        
        <div className="flex flex-col md:items-end justify-between">
          <div className="flex gap-6 mb-8 font-label text-sm flex-wrap md:justify-end">
            <Link to="/disclaimer" className="text-[#424752] dark:text-slate-400 hover:text-[#005EB8] transition-colors">Medical Disclaimer</Link>
            <Link to="/privacy" className="text-[#424752] dark:text-slate-400 hover:text-[#005EB8] transition-colors">Privacy Policy</Link>
            <Link to="/compliance" className="text-[#424752] dark:text-slate-400 hover:text-[#005EB8] transition-colors">HIPAA Compliance</Link>
            <Link to="/support" className="text-[#424752] dark:text-slate-400 hover:text-[#005EB8] transition-colors">Contact Support</Link>
          </div>
          
          <div className="flex gap-4 opacity-50">
            <span className="material-symbols-outlined text-[#424752]">shield_with_heart</span>
            <span className="material-symbols-outlined text-[#424752]">medical_services</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
