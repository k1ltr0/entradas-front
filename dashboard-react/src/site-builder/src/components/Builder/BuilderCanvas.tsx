import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useBuilder } from '../../context/BuilderContext';
import { PageRenderer } from '../Renderer';
import './BuilderCanvas.css';

const BuilderCanvas: React.FC = () => {
  const { t } = useTranslation();
  const { state, selectSection } = useBuilder();
  const { page, previewMode, selectedSectionId } = state;
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Scroll to selected section when it changes
  useEffect(() => {
    if (selectedSectionId && sectionRefs.current[selectedSectionId]) {
      const element = sectionRefs.current[selectedSectionId];
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [selectedSectionId]);

  if (!page) {
    return (
      <div className="builder-canvas empty">
        <div className="empty-state">
          <h2>{t('canvas.noPage')}</h2>
          <p>{t('canvas.selectTemplate')}</p>
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
            <p>{t('canvas.addSections')}</p>
          </div>
        ) : (
          page.sections.map((section) => {
            const isVisible = section.isVisible !== false;
            return (
              <div
                key={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                className={`canvas-section ${!isVisible ? 'hidden-section' : ''}`}
                onClick={() => selectSection(section.id)}
                style={{ opacity: isVisible ? 1 : 0.3 }}
              >
                {!isVisible && (
                  <div className="hidden-overlay">
                    <span>👁️‍🗨️ {t('canvas.hiddenSection')}</span>
                  </div>
                )}
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
            );
          })
        )}
      </div>
    </div>
  );
};

export default BuilderCanvas;
