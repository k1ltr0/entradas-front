import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Template } from '../../types';
import basicEventTemplate from '../../data/templates/basic-event.json';
import conferenceTemplate from '../../data/templates/conference.json';
import concertTemplate from '../../data/templates/concert.json';
import './TemplateGallery.css';

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

const templates: Template[] = [
  basicEventTemplate as Template,
  conferenceTemplate as Template,
  concertTemplate as Template
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  onClose
}) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: t('templates.categories.all') },
    { id: 'event', name: t('templates.categories.events') },
    { id: 'conference', name: t('templates.categories.conferences') },
    { id: 'concert', name: t('templates.categories.concerts') }
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="template-gallery-overlay">
      <div className="template-gallery">
        <div className="template-gallery-header">
          <h2>{t('templates.title')}</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="template-categories">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-button ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="template-grid">
          {filteredTemplates.map(template => (
            <div key={template.id} className="template-card">
              <div className="template-preview">
                <div className="template-preview-placeholder">
                  <span className="template-icon">📄</span>
                  <p>{t(`templates.${template.id}.name`)}</p>
                </div>
              </div>
              <div className="template-info">
                <h3>{t(`templates.${template.id}.name`)}</h3>
                <p>{t(`templates.${template.id}.description`)}</p>
                <div className="template-meta">
                  <span className="template-category">{template.category}</span>
                  <span className="template-sections">{template.sections.length} {t('templates.sectionsCount')}</span>
                </div>
                <button
                  className="select-template-button"
                  onClick={() => onSelectTemplate(template)}
                >
                  {t('templates.useTemplate')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="template-gallery-footer">
          <button className="blank-template-button" onClick={() => {
            const blankTemplate: Template = {
              id: 'blank',
              name: t('templates.blankName'),
              description: t('templates.blankDescription'),
              category: 'custom',
              metadata: {
                title: t('templates.newPage'),
                theme: 'light',
                primaryColor: '#ff6b6b',
                secondaryColor: '#4ecdc4'
              },
              sections: [],
              defaultData: {}
            };
            onSelectTemplate(blankTemplate);
          }}>
            {t('templates.startBlank')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
