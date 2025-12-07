import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  to?: string;
}

export function Logo({ className = '', to = '/' }: LogoProps) {
  return (
    <Link to={to} className={`flex items-center hover:opacity-90 transition ${className}`}>
      <img
        src="/final_dashbot_logo1.png"
        alt="DashBot - Teach Your Website to Talk"
        className="h-10 md:h-12 w-auto"
      />
    </Link>
  );
}
