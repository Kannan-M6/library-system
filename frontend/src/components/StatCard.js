import React from 'react';

/**
 * StatCard — used in LibrarianDashboard, StudentDashboard, TeacherDashboard.
 *
 * Accepts icon two ways:
 *   icon={BookOpen}            → component constructor (legacy dashboards)
 *   icon={<BookOpen size={20}/>} → pre-rendered JSX element (teacher dashboard)
 */
export default function StatCard({
  label, value, icon,
  accentColor, color,
  sub, trend, trendLabel,
  // legacy alias
  title,
}) {
  const displayLabel  = label  || title || '';
  const displayAccent = accentColor || color || '#c084fc';

  const IconBox = () => {
    if (!icon) return null;
    const boxStyle = {
      width:42, height:42, borderRadius:12, flexShrink:0,
      background:`${displayAccent}1a`, border:`1px solid ${displayAccent}33`,
      display:'flex', alignItems:'center', justifyContent:'center',
      marginLeft:'0.75rem',
    };
    // Already a rendered JSX element
    if (React.isValidElement(icon)) {
      return <div style={boxStyle}>{icon}</div>;
    }
    // Component constructor
    const Icon = icon;
    return (
      <div style={boxStyle}>
        <Icon size={20} color={displayAccent}/>
      </div>
    );
  };

  return (
    <div
      style={{
        background: 'rgba(15,23,42,0.55)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${displayAccent}28`,
        borderRadius: 16,
        padding: '1.25rem 1.4rem',
        transition: 'all 0.25s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${displayAccent}55`;
        e.currentTarget.style.transform   = 'translateY(-2px)';
        e.currentTarget.style.boxShadow   = `0 8px 28px ${displayAccent}1a`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${displayAccent}28`;
        e.currentTarget.style.transform   = 'translateY(0)';
        e.currentTarget.style.boxShadow   = 'none';
      }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{
            fontSize:'0.72rem', fontWeight:700,
            textTransform:'uppercase', letterSpacing:'0.08em',
            color:'#64748b', marginBottom:'0.4rem',
          }}>
            {displayLabel}
          </p>
          <p style={{
            fontSize:'1.65rem', fontWeight:800,
            fontFamily:"'Playfair Display',serif",
            color:'#f1f5f9', lineHeight:1.1,
          }}>
            {value}
          </p>
          {sub && (
            <p style={{ fontSize:'0.72rem', color:'#475569', marginTop:'0.3rem' }}>{sub}</p>
          )}
          {trend != null && (
            <p style={{ fontSize:'0.72rem', marginTop:'0.3rem',
              color: trend >= 0 ? '#86efac' : '#fca5a5' }}>
              {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% {trendLabel || ''}
            </p>
          )}
        </div>
        <IconBox />
      </div>
    </div>
  );
}
