import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-surface-container w-full py-16 px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-screen-2xl mx-auto">
        <div>
          <span className="text-lg font-bold text-on-surface font-headline mb-6 block">Chest XR</span>
          <p className="text-on-surface/60 text-sm leading-relaxed">
            Advancing the standard of care through editorial precision and human-centric artificial intelligence in radiology.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-on-surface mb-6">Clinical Resources</h4>
          <ul className="space-y-4">
            <li><Link to="/technology" className="text-on-surface/60 text-sm hover:text-primary transition-colors">Clinical Advisory Board</Link></li>
            <li><Link to="/technology" className="text-on-surface/60 text-sm hover:text-primary transition-colors">HIPAA Compliance</Link></li>
            <li><Link to="/faq" className="text-on-surface/60 text-sm hover:text-primary transition-colors">Contact Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-on-surface mb-6">Legal</h4>
          <ul className="space-y-4">
            <li><Link to="/technology" className="text-on-surface/60 text-sm hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/technology" className="text-on-surface/60 text-sm hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-on-surface mb-6">Connect</h4>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:scale-110 transition-transform" href="#">
              <span className="material-symbols-outlined text-xl">share</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:scale-110 transition-transform" href="#">
              <span className="material-symbols-outlined text-xl">mail</span>
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-8 mt-16 pt-8 border-t border-on-surface/10 text-center">
        <p className="text-on-surface/60 text-sm">
          © 2024 Chest XR Clinical. All rights reserved. Professional Use Only.
        </p>
      </div>
    </footer>
  )
}
