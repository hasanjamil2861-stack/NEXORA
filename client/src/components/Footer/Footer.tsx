import {
  ArrowUpRight,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="nexora-footer">
      <div className="footer-top-line" />

      <div className="footer-container">
        {/* Brand and platform description */}
        <div className="footer-brand-section">
          <div className="footer-brand">
            <div className="footer-logo">
              <img
                src="/images/Logo.jpg"
                alt="NEXORA Logo"
              />
            </div>

            <div className="footer-brand-content">
              <h2>NEXORA</h2>
              <span>Business Management</span>
            </div>
          </div>

          <p className="footer-description">
            A modern business management platform built to
            help organizations manage their workforce,
            operations, projects, and business activities
            efficiently.
          </p>

          <div className="footer-security">
            <ShieldCheck size={17} />

            <span>
              Secure Business Management
            </span>
          </div>
        </div>

        {/* Main platform links */}
        <div className="footer-column">
          <h3>Platform</h3>

          <a href="/">
            Dashboard
            <ArrowUpRight size={14} />
          </a>

          <a href="/employees">
            Employees
            <ArrowUpRight size={14} />
          </a>

          <a href="/departments">
            Departments
            <ArrowUpRight size={14} />
          </a>

          <a href="/projects">
            Projects
            <ArrowUpRight size={14} />
          </a>

          <a href="/tasks">
            Tasks
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Business management links */}
        <div className="footer-column">
          <h3>Management</h3>

          <a href="/clients">
            Clients
            <ArrowUpRight size={14} />
          </a>

          <a href="/contracts">
            Contracts
            <ArrowUpRight size={14} />
          </a>

          <a href="/invoices">
            Invoices
            <ArrowUpRight size={14} />
          </a>

          <a href="/documents">
            Documents
            <ArrowUpRight size={14} />
          </a>

          <a href="/reports">
            Reports
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Contact information */}
        <div className="footer-column footer-contact-column">
          <h3>Contact</h3>

          <a href="mailto:contact@nexora.com">
            <Mail size={15} />

            <span>
              contact@nexora.com
            </span>
          </a>

          <a href="tel:+96100000000">
            <Phone size={15} />

            <span>
              +961 00 000 000
            </span>
          </a>

          <div className="footer-contact-item">
            <MapPin size={15} />

            <span>
              Beirut, Lebanon
            </span>
          </div>
        </div>
      </div>

      {/* Copyright and footer links */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>
            © {currentYear} NEXORA. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
          </div>

          <p className="footer-made-with">
            Built with
            <Heart
              size={13}
              fill="currentColor"
            />
            for better business.
          </p>
        </div>
      </div>
    </footer>
  )
}