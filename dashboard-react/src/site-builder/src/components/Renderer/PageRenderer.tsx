import React from 'react';
import { PageConfig } from '../../types';
import SectionRenderer from './SectionRenderer';
import './PageRenderer.css';

interface PageRendererProps {
  page: PageConfig;
  isEditable?: boolean;
  onSectionEdit?: (sectionId: string) => void;
}

const PageRenderer: React.FC<PageRendererProps> = ({
  page,
  isEditable = false,
  onSectionEdit
}) => {
  const { metadata, sections } = page;

  // Apply theme styles
  const themeStyles: React.CSSProperties = {
    '--primary-color': metadata.primaryColor || '#ff6b6b',
    '--secondary-color': metadata.secondaryColor || '#4ecdc4',
    fontFamily: metadata.fontFamily || 'inherit'
  } as React.CSSProperties;

  // Sort sections by order and filter hidden sections in non-editable mode
  const sortedSections = [...sections]
    .sort((a, b) => a.order - b.order)
    .filter(section => isEditable || section.isVisible !== false);

  return (
    <div
      className={`page-renderer ${metadata.theme || 'light'}`}
      style={themeStyles}
    >
      {sortedSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          isEditable={isEditable}
          onEdit={onSectionEdit}
        />
      ))}
    </div>
  );
};

export default PageRenderer;
