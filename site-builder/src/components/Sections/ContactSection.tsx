import React from 'react';
import { ContactSectionProps } from '../../types';
import './ContactSection.css';

interface ContactSectionComponentProps {
  section: ContactSectionProps;
  isEditable?: boolean;
  onEdit?: (id: string) => void;
}

const ContactSection: React.FC<ContactSectionComponentProps> = ({
  section,
  isEditable = false,
  onEdit
}) => {
  const { data } = section;

  return (
    <section
      className="contact-section"
      onClick={() => isEditable && onEdit && onEdit(section.id)}
    >
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title">{data.title}</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            {data.email && (
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <h3>Email</h3>
                  <a href={`mailto:${data.email}`}>{data.email}</a>
                </div>
              </div>
            )}

            {data.phone && (
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <h3>Teléfono</h3>
                  <a href={`tel:${data.phone}`}>{data.phone}</a>
                </div>
              </div>
            )}

            {data.address && (
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h3>Dirección</h3>
                  <p>{data.address}</p>
                </div>
              </div>
            )}

            {data.socialLinks && data.socialLinks.length > 0 && (
              <div className="contact-social">
                <h3>Síguenos</h3>
                <div className="social-links">
                  {data.socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {data.mapUrl && (
            <div className="contact-map">
              <iframe
                src={data.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de ubicación"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
