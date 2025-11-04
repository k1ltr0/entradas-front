import React, { useState, useEffect } from 'react';
import { BuilderProvider, useBuilder } from './context/BuilderContext';
import { BuilderTopBar, BuilderSidebar, BuilderCanvas } from './components/Builder';
import TemplateGallery from './components/Templates/TemplateGallery';
import { JsonParser } from './utils';
import { Template, PageConfig } from './types';
import './SiteBuilder.css';

interface SiteBuilderContentProps {
  onSave?: (page: PageConfig) => void;
  onPublish?: (page: PageConfig) => void;
  initialPageId?: string;
}

const SiteBuilderContent: React.FC<SiteBuilderContentProps> = ({
  onSave,
  onPublish,
  initialPageId
}) => {
  const { state, setPage } = useBuilder();
  const [showTemplateGallery, setShowTemplateGallery] = useState(true);

  useEffect(() => {
    // Try to load a saved page from localStorage if initialPageId is provided
    if (initialPageId) {
      const savedPage = localStorage.getItem(`site-builder-${initialPageId}`);
      if (savedPage) {
        try {
          const page = JSON.parse(savedPage);
          setPage(page);
          setShowTemplateGallery(false);
        } catch (error) {
          console.error('Error loading saved page:', error);
        }
      }
    }
  }, [initialPageId, setPage]);

  const handleSelectTemplate = (template: Template) => {
    // Create a new page from the template
    const pageData = {
      pageId: `page-${Date.now()}`,
      metadata: template.metadata,
      sectionData: template.defaultData
    };

    const page = JsonParser.mergeTemplateWithData(template, pageData);
    setPage(page);
    setShowTemplateGallery(false);
  };

  if (showTemplateGallery || !state.page) {
    return (
      <TemplateGallery
        onSelectTemplate={handleSelectTemplate}
        onClose={() => {
          if (state.page) {
            setShowTemplateGallery(false);
          }
        }}
      />
    );
  }

  return (
    <div className="site-builder">
      <BuilderTopBar onSave={onSave} onPublish={onPublish} />
      <div className="site-builder-main">
        <BuilderSidebar />
        <BuilderCanvas />
      </div>
    </div>
  );
};

interface SiteBuilderProps {
  onSave?: (page: PageConfig) => void;
  onPublish?: (page: PageConfig) => void;
  initialPageId?: string;
}

const SiteBuilder: React.FC<SiteBuilderProps> = (props) => {
  return (
    <BuilderProvider>
      <SiteBuilderContent {...props} />
    </BuilderProvider>
  );
};

export default SiteBuilder;
