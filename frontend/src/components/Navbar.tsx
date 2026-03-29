import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-[#f6fafe]/90 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 border-b border-outline-variant/10">
      <div className="flex justify-between items-center w-full px-8 md:px-12 py-5 max-w-screen-xl mx-auto">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-[#171c1f] font-headline"
        >
          ClinicalLens AI
        </Link>

        <div className="hidden md:flex gap-10 items-center">
          <Link
            to="/predict"
            className={`${
              isActive('/predict')
                ? 'text-[#005EB8] border-b-2 border-[#005EB8] pb-0.5'
                : 'text-[#424752] hover:text-[#005EB8]'
            } font-medium text-sm font-label transition-all duration-200`}
          >
            Analysis Portal
          </Link>
          <Link
            to="/dashboard"
            className={`${
              isActive('/dashboard')
                ? 'text-[#005EB8] border-b-2 border-[#005EB8] pb-0.5'
                : 'text-[#424752] hover:text-[#005EB8]'
            } font-medium text-sm font-label transition-all duration-200`}
          >
            Results Dashboard
          </Link>
          <Link
            to="/technology"
            className={`${
              isActive('/technology')
                ? 'text-[#005EB8] border-b-2 border-[#005EB8] pb-0.5'
                : 'text-[#424752] hover:text-[#005EB8]'
            } font-medium text-sm font-label transition-all duration-200`}
          >
            Technology
          </Link>
          <Link
            to="/technology#faq"
            className="text-[#424752] hover:text-[#005EB8] font-medium text-sm font-label transition-colors duration-200"
          >
            FAQ
          </Link>
        </div>

        <div className="flex gap-4">
          <button className="px-5 py-2.5 text-sm font-medium text-on-secondary-container hover:bg-[#e4e9ed] transition-colors rounded-xl">
            Clinician Login
          </button>
          <button className="px-5 py-2.5 text-sm font-medium bg-gradient-to-br from-primary to-primary-container text-white rounded-xl cloud-shadow active:scale-[0.99] transition-transform">
            Patient Portal
          </button>
        </div>
      </div>
    </nav>
  )
}
