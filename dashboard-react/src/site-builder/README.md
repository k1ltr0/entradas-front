# Site Builder

A Shopify-like site builder for creating event microsites with drag-and-drop functionality, pre-built templates, and live preview.

## Features

- 📦 **Section Library**: 6 pre-built sections (Hero, Pricing, Gallery, About, Schedule, Contact)
- 🎨 **Pre-built Templates**: 3 ready-to-use templates (Basic Event, Conference, Concert)
- 🔄 **Drag & Drop**: Reorder sections with intuitive drag-and-drop interface
- 👁️ **Live Preview**: Real-time preview mode
- 💾 **Export**: Export to JSON or HTML
- 📱 **Responsive**: Mobile-friendly sections and builder interface

## Installation

```bash
cd dashboard-react
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-icons --legacy-peer-deps
```

## Usage

### Standalone Component

```tsx
import { SiteBuilder } from '../site-builder/src';

function App() {
  const handleSave = (page) => {
    console.log('Saving page:', page);
    // Save to your backend
  };

  const handlePublish = (page) => {
    console.log('Publishing page:', page);
    // Publish to your platform
  };

  return (
    <SiteBuilder
      onSave={handleSave}
      onPublish={handlePublish}
      initialPageId="my-event-page"
    />
  );
}
```

### Dashboard Integration

Import and add as a route in your React Router setup:

```tsx
import { SiteBuilder } from '../../site-builder/src';

<Route path="/builder" element={<SiteBuilder />} />
```

## Project Structure

```
site-builder/
├── src/
│   ├── components/
│   │   ├── Builder/           # Builder UI components
│   │   ├── Sections/          # Section components
│   │   ├── Renderer/          # Page/Section renderers
│   │   └── Templates/         # Template gallery
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utilities (JSON parser, registry)
│   ├── data/                  # Templates and section definitions
│   ├── context/               # React context for state
│   └── SiteBuilder.tsx        # Main component
└── README.md
```

## Available Sections

1. **Hero**: Banner with title, subtitle, CTA button
2. **Pricing**: Ticket pricing cards
3. **Gallery**: Image gallery (grid/masonry/carousel)
4. **About**: About section with image
5. **Schedule**: Event schedule/agenda
6. **Contact**: Contact information with map

## JSON Configuration

### Template Structure

```json
{
  "id": "template-id",
  "name": "Template Name",
  "metadata": {
    "title": "Page Title",
    "theme": "light",
    "primaryColor": "#ff6b6b"
  },
  "sections": [
    {
      "id": "hero-1",
      "type": "hero",
      "order": 0
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

### Page Data Structure

```json
{
  "pageId": "my-event",
  "metadata": {
    "title": "My Event",
    "theme": "dark"
  },
  "sectionData": {
    "hero-1": {
      "title": "Custom Title"
    }
  }
}
```

## API

### SiteBuilder Props

| Prop | Type | Description |
|------|------|-------------|
| `onSave` | `(page: PageConfig) => void` | Callback when user saves |
| `onPublish` | `(page: PageConfig) => void` | Callback when user publishes |
| `initialPageId` | `string` | Load saved page from localStorage |

### PageRenderer Props

| Prop | Type | Description |
|------|------|-------------|
| `page` | `PageConfig` | Page configuration to render |
| `isEditable` | `boolean` | Enable edit mode |
| `onSectionEdit` | `(id: string) => void` | Section edit callback |

## Customization

### Adding New Sections

1. Create section component in `src/components/Sections/`
2. Add section type to `src/types/section.types.ts`
3. Register in `src/data/sections/section-registry.json`
4. Update `SectionRenderer` to include new section

### Creating Templates

1. Create JSON file in `src/data/templates/`
2. Import in `TemplateGallery.tsx`
3. Add to templates array

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
