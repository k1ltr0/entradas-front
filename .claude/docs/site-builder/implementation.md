# Site Builder Implementation

## Overview

A complete Shopify-like site builder for creating event microsites with:
- **Drag-and-drop interface** for section reordering
- **6 pre-built section types** (Hero, Pricing, Gallery, About, Schedule, Contact)
- **3 ready-to-use templates** (Basic Event, Conference, Concert)
- **Live preview mode** for real-time visualization
- **JSON-based configuration** with template/data separation
- **Export capabilities** (JSON and HTML)

## Architecture

### Project Structure

```
site-builder/
├── src/
│   ├── components/
│   │   ├── Builder/
│   │   │   ├── BuilderCanvas.tsx         # Main editing canvas with drag-and-drop
│   │   │   ├── BuilderSidebar.tsx        # Section library & property editor
│   │   │   └── BuilderTopBar.tsx         # Controls (save, preview, export)
│   │   ├── Sections/
│   │   │   ├── HeroSection.tsx           # Banner with title, CTA
│   │   │   ├── PricingSection.tsx        # Ticket pricing cards
│   │   │   ├── GallerySection.tsx        # Image gallery (grid/masonry/carousel)
│   │   │   ├── AboutSection.tsx          # About section with image
│   │   │   ├── ScheduleSection.tsx       # Event schedule/timeline
│   │   │   └── ContactSection.tsx        # Contact info with map
│   │   ├── Renderer/
│   │   │   ├── PageRenderer.tsx          # Renders complete page from JSON
│   │   │   └── SectionRenderer.tsx       # Renders individual sections
│   │   └── Templates/
│   │       └── TemplateGallery.tsx       # Template selection UI
│   ├── context/
│   │   └── BuilderContext.tsx            # State management (React Context)
│   ├── types/
│   │   ├── section.types.ts              # Section type definitions
│   │   ├── page.types.ts                 # Page configuration types
│   │   ├── template.types.ts             # Template types
│   │   └── builder.types.ts              # Builder state types
│   ├── utils/
│   │   ├── jsonParser.ts                 # JSON parsing & validation
│   │   └── sectionRegistry.ts            # Section registry management
│   ├── data/
│   │   ├── templates/                    # Template JSON files
│   │   │   ├── basic-event.json
│   │   │   ├── conference.json
│   │   │   └── concert.json
│   │   └── sections/
│   │       └── section-registry.json     # Section definitions
│   ├── SiteBuilder.tsx                   # Main component
│   └── index.ts                          # Public exports
└── README.md
```

### Technology Stack

- **React 19.1.1** - UI framework
- **TypeScript 5.9.2** - Type safety
- **@dnd-kit** - Drag-and-drop functionality
- **React Context** - State management
- **CSS Modules** - Scoped styling

## Key Features

### 1. Section Library

Six pre-built, fully responsive section components:

| Section | Purpose | Key Props |
|---------|---------|-----------|
| Hero | Main banner | title, subtitle, background, CTA |
| Pricing | Ticket sales | tickets array, columns, pricing |
| Gallery | Images | images array, layout (grid/masonry/carousel) |
| About | Event info | title, content (HTML), image |
| Schedule | Agenda | events array, layout (timeline/list) |
| Contact | Contact info | email, phone, address, map, socials |

### 2. Template System

Three pre-configured templates:

1. **Basic Event**: Simple 4-section layout (Hero → About → Pricing → Contact)
2. **Conference**: Professional 6-section layout with schedule
3. **Concert**: Vibrant festival layout with extensive gallery

Templates use **separation of concerns**:
- **Template JSON**: Defines structure (sections, order, props)
- **Data JSON**: Contains actual content

### 3. Builder Interface

#### TopBar
- Edit/Preview mode toggle
- Save button (with dirty state indicator)
- Publish button
- Export to JSON/HTML

#### Sidebar
- **Sections Tab**: Drag sections into canvas
- **Settings Tab**: Edit selected section properties
- Real-time property editing

#### Canvas
- Drag handles for section reordering
- Click-to-edit functionality
- Visual feedback (hover states, outlines)
- Preview mode (full-width, no editing UI)

### 4. State Management

Centralized state via React Context:

```typescript
interface BuilderState {
  page: PageConfig | null;
  selectedSectionId: string | null;
  isDirty: boolean;
  previewMode: boolean;
}
```

Actions:
- `SET_PAGE` - Load page configuration
- `ADD_SECTION` - Add new section
- `UPDATE_SECTION` - Modify section data
- `DELETE_SECTION` - Remove section
- `REORDER_SECTIONS` - Change section order
- `SELECT_SECTION` - Select for editing
- `UPDATE_METADATA` - Modify page settings
- `SET_PREVIEW_MODE` - Toggle preview
- `RESET` - Clear state

## JSON Configuration

### Template Structure

```json
{
  "id": "basic-event",
  "name": "Evento Básico",
  "category": "event",
  "metadata": {
    "title": "Mi Evento",
    "theme": "light",
    "primaryColor": "#ff6b6b",
    "secondaryColor": "#4ecdc4"
  },
  "sections": [
    {
      "id": "hero-1",
      "type": "hero",
      "order": 0,
      "props": { "layout": "centered" }
    }
  ],
  "defaultData": {
    "hero-1": {
      "title": "Welcome",
      "subtitle": "Event description"
    }
  }
}
```

### Page Configuration

```json
{
  "id": "page-123",
  "name": "My Event Page",
  "metadata": {
    "title": "Event 2025",
    "theme": "dark"
  },
  "sections": [
    {
      "id": "hero-1",
      "type": "hero",
      "order": 0,
      "data": {
        "title": "Event 2025",
        "subtitle": "Join us!"
      }
    }
  ],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

## Integration

### Dashboard Integration

The site builder is integrated into the dashboard at `/site-builder`:

1. **Route added** in `App.tsx`
2. **Sidebar link** with 🎨 icon
3. **Wrapper component** (`SiteBuilderWrapper.tsx`) handles callbacks

### Usage as Standalone Component

```tsx
import { SiteBuilder } from '../site-builder/src';

<SiteBuilder
  onSave={(page) => {
    // Save to backend
    await api.savePage(page);
  }}
  onPublish={(page) => {
    // Publish page
    await api.publishPage(page);
  }}
  initialPageId="event-123"
/>
```

## Drag-and-Drop Implementation

Uses `@dnd-kit` for accessibility and performance:

```tsx
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={sections}
    strategy={verticalListSortingStrategy}
  >
    {/* Sortable sections */}
  </SortableContext>
</DndContext>
```

Each section has:
- Drag handle (⋮⋮ icon)
- Visual feedback during drag
- Smooth reordering animation

## Extensibility

### Adding New Sections

1. **Create component** in `src/components/Sections/`
2. **Define type** in `src/types/section.types.ts`
3. **Register** in `section-registry.json`
4. **Update renderer** in `SectionRenderer.tsx`

Example:

```tsx
// 1. Create TestimonialSection.tsx
export interface TestimonialSectionProps extends BaseSectionProps {
  type: 'testimonial';
  data: {
    title: string;
    testimonials: Array<{
      name: string;
      text: string;
      avatar?: string;
    }>;
  };
}

// 2. Add to section.types.ts union
export type SectionProps = ... | TestimonialSectionProps;

// 3. Register in section-registry.json
{
  "type": "testimonial",
  "name": "Testimonios",
  "icon": "💬",
  "defaultData": { ... }
}

// 4. Add case in SectionRenderer
case 'testimonial':
  return <TestimonialSection ... />;
```

### Creating Templates

1. Create JSON in `src/data/templates/`
2. Import in `TemplateGallery.tsx`
3. Add to templates array

## Deployment Considerations

### localStorage Backup
- Auto-saves to `localStorage` with key `site-builder-{pageId}`
- Prevents data loss on accidental navigation

### API Integration
- `onSave` callback for backend persistence
- `onPublish` callback for deployment
- Export JSON for portability
- Export HTML for static hosting

### Performance
- Sections lazy-load on demand
- Preview mode renders without edit UI
- Drag-and-drop uses optimized sensors
- CSS Modules prevent style conflicts

## Future Enhancements

Potential additions:
- [ ] Custom CSS editor
- [ ] Media library for image management
- [ ] More section types (FAQ, Testimonials, Team, etc.)
- [ ] Theme builder (colors, fonts, spacing)
- [ ] Responsive preview (mobile/tablet/desktop)
- [ ] Undo/Redo functionality
- [ ] Section duplication
- [ ] Import/Export templates
- [ ] Collaboration features
- [ ] SEO settings panel
- [ ] Analytics integration

## Testing Recommendations

```bash
# Unit tests for utilities
npm test jsonParser.test.ts
npm test sectionRegistry.test.ts

# Component tests
npm test SectionRenderer.test.tsx
npm test BuilderContext.test.tsx

# E2E tests
npm test site-builder.e2e.test.ts
```

## Troubleshooting

### Common Issues

1. **Sections not dragging**: Check `@dnd-kit` installation
2. **TypeScript errors**: Ensure all type definitions are imported
3. **Styles not applying**: Verify CSS file imports
4. **localStorage full**: Implement cleanup for old saves

## Resources

- [React DnD Kit Docs](https://docs.dndkit.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Context API](https://react.dev/reference/react/createContext)
