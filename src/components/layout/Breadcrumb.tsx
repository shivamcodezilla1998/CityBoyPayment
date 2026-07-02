import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex text-sm text-secondary ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
          </Link>
        </li>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              <ChevronRight className="w-4 h-4 text-tertiary" />
            </li>
            <li>
              {item.href ? (
                <Link to={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-primary font-medium">{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
