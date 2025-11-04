import React from 'react';
import { SectionProps } from '../../types';
import {
  HeroSection,
  PricingSection,
  GallerySection,
  AboutSection,
  ScheduleSection,
  ContactSection
} from '../Sections';

interface SectionRendererProps {
  section: SectionProps;
  isEditable?: boolean;
  onEdit?: (id: string) => void;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  isEditable = false,
  onEdit
}) => {
  const renderSection = () => {
    switch (section.type) {
      case 'hero':
        return <HeroSection section={section} isEditable={isEditable} onEdit={onEdit} />;
      case 'pricing':
        return <PricingSection section={section} isEditable={isEditable} onEdit={onEdit} />;
      case 'gallery':
        return <GallerySection section={section} isEditable={isEditable} onEdit={onEdit} />;
      case 'about':
        return <AboutSection section={section} isEditable={isEditable} onEdit={onEdit} />;
      case 'schedule':
        return <ScheduleSection section={section} isEditable={isEditable} onEdit={onEdit} />;
      case 'contact':
        return <ContactSection section={section} isEditable={isEditable} onEdit={onEdit} />;
      default:
        return (
          <div style={{ padding: '2rem', background: '#f5f5f5', textAlign: 'center' }}>
            <p>Unknown section type: {(section as any).type}</p>
          </div>
        );
    }
  };

  return (
    <div
      data-section-id={section.id}
      data-section-type={section.type}
      className={isEditable ? 'section-editable' : 'section-view'}
    >
      {renderSection()}
    </div>
  );
};

export default SectionRenderer;
