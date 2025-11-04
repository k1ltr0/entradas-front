import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBuilder } from '../../context/BuilderContext';
import { JsonParser } from '../../utils';
import { LanguageSwitcher } from '../LanguageSwitcher';
import './BuilderTopBar.css';

interface BuilderTopBarProps {
  onSave?: (page: any) => void;
  onPublish?: (page: any) => void;
}

const BuilderTopBar: React.FC<BuilderTopBarProps> = ({ onSave, onPublish }) => {
  const { t } = useTranslation();
  const { state, setPreviewMode } = useBuilder();
  const { page, isDirty, previewMode } = state;

  const handleSave = () => {
    if (page && onSave) {
      onSave(page);
      // Save to localStorage as backup
      localStorage.setItem(`site-builder-${page.id}`, JSON.stringify(page));
      alert(t('builder.saveSuccess'));
    }
  };

  const handlePublish = () => {
    if (page && onPublish) {
      onPublish(page);
      alert(t('builder.publishSuccess'));
    }
  };

  const handleExportJSON = () => {
    if (!page) return;
    const json = JsonParser.exportPageConfig(page);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page.id}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    if (!page) return;
    const html = JsonParser.exportToHTML(page);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="builder-topbar">
      <div className="topbar-left">
        <h1 className="builder-title">{t('builder.title')}</h1>
        {page && (
          <span className="page-name">{page.name}</span>
        )}
        <LanguageSwitcher />
      </div>

      <div className="topbar-center">
        <button
          className={`topbar-button ${!previewMode ? 'active' : ''}`}
          onClick={() => setPreviewMode(false)}
        >
          ✏️ {t('builder.edit')}
        </button>
        <button
          className={`topbar-button ${previewMode ? 'active' : ''}`}
          onClick={() => setPreviewMode(true)}
        >
          👁️ {t('builder.preview')}
        </button>
      </div>

      <div className="topbar-right">
        <div className="button-group">
          <button
            className="topbar-button secondary"
            onClick={handleExportJSON}
            disabled={!page}
            title={t('builder.exportJsonTooltip')}
          >
            📥 {t('builder.exportJson')}
          </button>
          <button
            className="topbar-button secondary"
            onClick={handleExportHTML}
            disabled={!page}
            title={t('builder.exportHtmlTooltip')}
          >
            📥 {t('builder.exportHtml')}
          </button>
        </div>

        <button
          className="topbar-button primary"
          onClick={handleSave}
          disabled={!page || !isDirty}
        >
          💾 {t('builder.save')} {isDirty && '*'}
        </button>

        <button
          className="topbar-button success"
          onClick={handlePublish}
          disabled={!page}
        >
          🚀 {t('builder.publish')}
        </button>
      </div>
    </div>
  );
};

export default BuilderTopBar;
