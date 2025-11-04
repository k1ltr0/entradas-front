import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { PageRenderer } from '../Renderer';
import './BuilderCanvas.css';

const BuilderCanvas: React.FC = () => {
  const { state, selectSection } = useBuilder();
  const { page, previewMode } = state;

  if (!page) {
    return (
      <div className="builder-canvas empty">
        <div className="empty-state">
          <h2>No hay página cargada</h2>
          <p>Selecciona una plantilla para comenzar</p>
        </div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="builder-canvas preview-mode">
        <PageRenderer page={page} isEditable={false} />
      </div>
    );
  }

  return (
    <div className="builder-canvas">
      <div className="canvas-sections">
        {page.sections.length === 0 ? (
          <div className="empty-canvas">
            <p>Agrega secciones desde el panel lateral</p>
          </div>
        ) : (
          page.sections.map((section) => (
            <div key={section.id} className="canvas-section" onClick={() => selectSection(section.id)}>
              <PageRenderer
                page={{
                  id: 'temp',
                  name: 'temp',
                  metadata: { title: '' },
                  sections: [section],
                  createdAt: '',
                  updatedAt: ''
                }}
                isEditable={true}
                onSectionEdit={selectSection}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BuilderCanvas;
