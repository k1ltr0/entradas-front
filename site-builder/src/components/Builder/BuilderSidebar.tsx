import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilder } from '../../context/BuilderContext';
import { SectionRegistry } from '../../utils';
import { SectionProps } from '../../types';
import './BuilderSidebar.css';

interface SortableLayerItemProps {
  section: SectionProps;
  index: number;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
}

const SortableLayerItem: React.FC<SortableLayerItemProps> = ({
  section,
  index,
  onSelect,
  onDelete,
  isSelected
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`layer-item ${isSelected ? 'selected' : ''}`}
    >
      <div className="layer-drag-handle" {...attributes} {...listeners}>
        <span>⋮⋮</span>
      </div>
      <div className="layer-content" onClick={() => onSelect(section.id)}>
        <span className="layer-index">{index + 1}</span>
        <span className="layer-type">{section.type}</span>
      </div>
      <button
        className="layer-delete"
        onClick={(e) => {
          e.stopPropagation();
          if (confirm('¿Eliminar esta sección?')) {
            onDelete(section.id);
          }
        }}
      >
        🗑️
      </button>
    </div>
  );
};

const BuilderSidebar: React.FC = () => {
  const { state, addSection, updateSection, deleteSection, selectSection, reorderSections } = useBuilder();
  const { page, selectedSectionId } = state;
  const [activeTab, setActiveTab] = useState<'sections' | 'layers' | 'settings'>('sections');

  const sections = SectionRegistry.getAllSections();
  const selectedSection = page?.sections.find(s => s.id === selectedSectionId);

  const handleAddSection = (type: any) => {
    const newSection = SectionRegistry.createSection(type);
    addSection(newSection);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && page) {
      const oldIndex = page.sections.findIndex((s) => s.id === active.id);
      const newIndex = page.sections.findIndex((s) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderSections(oldIndex, newIndex);
      }
    }
  };

  const handleUpdateSectionData = (field: string, value: any) => {
    if (!selectedSectionId) return;
    updateSection(selectedSectionId, {
      data: {
        ...selectedSection?.data,
        [field]: value
      }
    } as Partial<SectionProps>);
  };

  const renderSectionEditor = () => {
    if (!selectedSection) {
      return (
        <div className="no-selection">
          <p>Selecciona una sección para editarla</p>
        </div>
      );
    }

    const { data } = selectedSection;

    return (
      <div className="section-editor">
        <div className="editor-header">
          <h3>{selectedSection.type}</h3>
          <button
            className="delete-button"
            onClick={() => {
              if (confirm('¿Eliminar esta sección?')) {
                deleteSection(selectedSection.id);
              }
            }}
          >
            🗑️
          </button>
        </div>

        <div className="editor-fields">
          {Object.entries(data).map(([key, value]) => {
            if (typeof value === 'string') {
              return (
                <div key={key} className="editor-field">
                  <label>{key}</label>
                  {key === 'content' || value.length > 100 ? (
                    <textarea
                      value={value}
                      onChange={(e) => handleUpdateSectionData(key, e.target.value)}
                      rows={4}
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleUpdateSectionData(key, e.target.value)}
                    />
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>

        <div className="editor-actions">
          <button onClick={() => selectSection(null)}>Cerrar</button>
        </div>
      </div>
    );
  };

  return (
    <div className="builder-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`tab-button ${activeTab === 'sections' ? 'active' : ''}`}
          onClick={() => setActiveTab('sections')}
        >
          📦 Secciones
        </button>
        <button
          className={`tab-button ${activeTab === 'layers' ? 'active' : ''}`}
          onClick={() => setActiveTab('layers')}
        >
          📑 Capas
        </button>
        <button
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Configuración
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'sections' && !selectedSection && (
          <div className="section-library">
            <h3>Agregar Sección</h3>
            <div className="section-list">
              {sections.map((section) => (
                <div
                  key={section.type}
                  className="section-item"
                  onClick={() => handleAddSection(section.type)}
                >
                  <span className="section-icon">{section.icon}</span>
                  <div className="section-details">
                    <h4>{section.name}</h4>
                    <p>{section.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sections' && selectedSection && renderSectionEditor()}

        {activeTab === 'layers' && (
          <div className="layers-panel">
            <h3>Capas de Secciones</h3>
            {page && page.sections.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={page.sections.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="layers-list">
                    {page.sections.map((section, index) => (
                      <SortableLayerItem
                        key={section.id}
                        section={section}
                        index={index}
                        onSelect={selectSection}
                        onDelete={deleteSection}
                        isSelected={section.id === selectedSectionId}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="empty-layers">
                <p>No hay secciones en la página</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="page-settings">
            <h3>Configuración de Página</h3>
            {page && (
              <div className="settings-fields">
                <div className="editor-field">
                  <label>Título</label>
                  <input
                    type="text"
                    value={page.metadata.title}
                    onChange={(e) => {
                      updateSection(page.id, {
                        data: { ...page.metadata, title: e.target.value }
                      } as any);
                    }}
                  />
                </div>
                <p className="settings-note">
                  Más opciones de configuración próximamente...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuilderSidebar;
