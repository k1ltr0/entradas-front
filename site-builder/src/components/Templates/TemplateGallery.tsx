import React, { useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'event', name: 'Eventos' },
    { id: 'conference', name: 'Conferencias' },
    { id: 'concert', name: 'Conciertos' }
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="template-gallery-overlay">
      <div className="template-gallery">
        <div className="template-gallery-header">
          <h2>Elige una Plantilla</h2>
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
                  <p>{template.name}</p>
                </div>
              </div>
              <div className="template-info">
                <h3>{template.name}</h3>
                <p>{template.description}</p>
                <div className="template-meta">
                  <span className="template-category">{template.category}</span>
                  <span className="template-sections">{template.sections.length} secciones</span>
                </div>
                <button
                  className="select-template-button"
                  onClick={() => onSelectTemplate(template)}
                >
                  Usar Plantilla
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="template-gallery-footer">
          <button className="blank-template-button" onClick={() => {
            const blankTemplate: Template = {
              id: 'blank',
              name: 'Plantilla en Blanco',
              description: 'Comienza desde cero',
              category: 'custom',
              metadata: {
                title: 'Nueva Página',
                theme: 'light',
                primaryColor: '#ff6b6b',
                secondaryColor: '#4ecdc4'
              },
              sections: [],
              defaultData: {}
            };
            onSelectTemplate(blankTemplate);
          }}>
            Comenzar desde Cero
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
