import React from 'react';
import { SiteBuilder, PageConfig } from '../site-builder/src';

const SiteBuilderWrapper: React.FC = () => {
  const handleSave = (page: PageConfig) => {
    console.log('Saving page:', page);
    // TODO: Implement API call to save page
    // Example: await fetch('/api/pages', { method: 'POST', body: JSON.stringify(page) })
  };

  const handlePublish = (page: PageConfig) => {
    console.log('Publishing page:', page);
    // TODO: Implement API call to publish page
    // Example: await fetch('/api/pages/publish', { method: 'POST', body: JSON.stringify(page) })
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SiteBuilder
        onSave={handleSave}
        onPublish={handlePublish}
      />
    </div>
  );
};

export default SiteBuilderWrapper;
