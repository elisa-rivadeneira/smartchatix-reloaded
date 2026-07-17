import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  title?: string;
  grayBackground?: boolean;
  children?: React.ReactNode;
}

export default function Breadcrumb({ items, title, grayBackground = false, children }: BreadcrumbProps) {
  const outerStyle: React.CSSProperties = {
    background: 'white',
    borderBottom: children ? 'none' : '1px solid #e5e7eb',
    padding: children ? '0 32px' : '12px 0'
  };

  const innerContainerStyle: React.CSSProperties = {
    maxWidth: children ? 'none' : '1200px',
    margin: '0 auto',
    padding: children ? '0' : '0 24px'
  };

  const breadcrumbStyle: React.CSSProperties = {
    background: grayBackground ? '#f9fafb' : 'transparent',
    margin: grayBackground ? '0 -24px' : '0',
    padding: grayBackground ? '14px 24px' : '0',
    borderBottom: grayBackground ? '1px solid #e5e7eb' : 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px'
  };

  const linkStyle: React.CSSProperties = {
    color: '#6b7280',
    textDecoration: 'none',
    transition: 'color 0.2s'
  };

  const separatorStyle: React.CSSProperties = {
    color: '#d1d5db'
  };

  const currentStyle: React.CSSProperties = {
    color: '#1a202c',
    fontWeight: '500'
  };

  if (children) {
    return (
      <>
        <div style={{
          background: grayBackground ? '#f9fafb' : 'white',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px'
          }}>
            {items.map((item, index) => (
              <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {index > 0 && <span style={separatorStyle}>›</span>}
                {item.href ? (
                  <Link href={item.href} style={linkStyle}>
                    {item.label}
                  </Link>
                ) : (
                  <span style={currentStyle}>{item.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>
        <div style={{
          borderBottom: '1px solid #e5e7eb',
          background: grayBackground ? '#f9fafb' : 'white'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px'
          }}>
            {children}
          </div>
        </div>
      </>
    );
  }

  return (
    <div style={outerStyle}>
      <div style={innerContainerStyle}>
        <div style={breadcrumbStyle}>
          {items.map((item, index) => (
            <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {index > 0 && <span style={separatorStyle}>›</span>}
              {item.href ? (
                <Link href={item.href} style={linkStyle}>
                  {item.label}
                </Link>
              ) : (
                <span style={currentStyle}>{item.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
