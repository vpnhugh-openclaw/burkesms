import { Link, useLocation } from 'react-router-dom';
import { Upload, Send, BarChart3, Settings, ShieldCheck } from 'lucide-react';
import { sanitiseApiKey } from '@/services/httpsms';

const navItems = [
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/send', label: 'Send', icon: Send },
  { to: '/results', label: 'Results', icon: BarChart3 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const httpSmsConfigured = Boolean(sanitiseApiKey(localStorage.getItem('httpsms_api_key') ?? '') && (localStorage.getItem('httpsms_from_number') ?? '').trim());

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-[#d9e5e0] bg-[rgba(252,252,250,0.92)] backdrop-blur-xl">
        <div className="section-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-[#d4a017] bg-[#fcfcfa] shadow-sm">
              <img src="/burke-road-logo.jpg" alt="Burke Road Compounding Pharmacy logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <Link to="/upload" className="font-display text-2xl text-foreground sm:text-3xl">
                Burke Text Messager
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">Burke Road Compounding Pharmacy patient outreach and SMS workflow tracking.</p>
            </div>
          </div>

          <nav className="hidden flex-wrap items-center justify-end gap-2 md:flex">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'border-[#1f5d57] bg-[#1f5d57] text-white'
                      : 'border-[#d9e5e0] bg-white text-foreground hover:bg-[#f4f8f6]'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/settings"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname.startsWith('/settings')
                  ? 'border-[#1f5d57] bg-[#1f5d57] text-white'
                  : 'border-[#d9e5e0] bg-white text-foreground hover:bg-[#f4f8f6]'
              }`}
              aria-label="Open settings"
            >
              {httpSmsConfigured ? <ShieldCheck className="h-4 w-4 text-[#d4a017]" /> : <Settings className="h-4 w-4" />}
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="section-shell pb-28 pt-8 sm:pb-10 sm:pt-10">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#0b463d] bg-[#0b463d] md:hidden" aria-label="Primary">
        <div className="mx-auto flex max-w-5xl items-center justify-around px-2 py-2 shadow-[0_-10px_30px_rgba(11,70,61,0.22)]">
          {[...navItems, { to: '/settings', label: 'Settings', icon: httpSmsConfigured ? ShieldCheck : Settings }].map((item) => {
            const active = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full px-2 py-2 text-xs font-medium transition-colors ${
                  active ? 'bg-white/14 text-white' : 'text-[#dbe7e3]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className={`h-5 w-5 ${active ? 'text-[#f8f5ef]' : item.to === '/settings' && httpSmsConfigured ? 'text-[#d4a017]' : 'text-[#dbe7e3]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
