import React from 'react';
import { HeroSectionProps } from '../../types';
import './HeroSection.css';

interface HeroSectionComponentProps {
  section: HeroSectionProps;
  isEditable?: boolean;
  onEdit?: (id: string) => void;
}

const HeroSection: React.FC<HeroSectionComponentProps> = ({
  section,
  isEditable = false,
  onEdit
}) => {
  const { data } = section;
  const layoutClass = `hero-layout-${data.layout || 'centered'}`;

  return (
    <section
      className={`hero-section ${layoutClass} ${data.overlay ? 'with-overlay' : ''}`}
      style={{
        backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : undefined,
      }}
      onClick={() => isEditable && onEdit && onEdit(section.id)}
    >
      <div className="hero-content">
        <h1 className="hero-title">{data.title}</h1>
        {data.subtitle && <p className="hero-subtitle">{data.subtitle}</p>}
        {data.ctaText && data.ctaLink && (
          <a href={data.ctaLink} className="hero-cta">
            {data.ctaText}
          </a>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
