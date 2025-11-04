import React from 'react';
import { AboutSectionProps } from '../../types';
import './AboutSection.css';

interface AboutSectionComponentProps {
  section: AboutSectionProps;
  isEditable?: boolean;
  onEdit?: (id: string) => void;
}

const AboutSection: React.FC<AboutSectionComponentProps> = ({
  section,
  isEditable = false,
  onEdit
}) => {
  const { data } = section;
  const imagePosition = data.imagePosition || 'left';

  return (
    <section
      className="about-section"
      onClick={() => isEditable && onEdit && onEdit(section.id)}
    >
      <div className={`about-container about-image-${imagePosition}`}>
        {data.image && (
          <div className="about-image-wrapper">
            <img
              src={data.image}
              alt={data.title}
              className="about-image"
            />
          </div>
        )}
        <div className="about-content">
          <h2 className="about-title">{data.title}</h2>
          <div
            className="about-text"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
