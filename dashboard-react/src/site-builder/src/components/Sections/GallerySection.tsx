import React from 'react';
import { GallerySectionProps } from '../../types';
import './GallerySection.css';

interface GallerySectionComponentProps {
  section: GallerySectionProps;
  isEditable?: boolean;
  onEdit?: (id: string) => void;
}

const GallerySection: React.FC<GallerySectionComponentProps> = ({
  section,
  isEditable = false,
  onEdit
}) => {
  const { data } = section;
  const layout = data.layout || 'grid';
  const columns = data.columns || 3;

  return (
    <section
      className="gallery-section"
      onClick={() => isEditable && onEdit && onEdit(section.id)}
    >
      <div className="gallery-container">
        {data.title && (
          <div className="gallery-header">
            <h2 className="gallery-title">{data.title}</h2>
          </div>
        )}

        <div className={`gallery-${layout} gallery-columns-${columns}`}>
          {data.images.map((image) => (
            <div key={image.id} className="gallery-item">
              <img
                src={image.url}
                alt={image.alt}
                className="gallery-image"
              />
              {image.caption && (
                <p className="gallery-caption">{image.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
