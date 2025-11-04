# Site Builder - Usage Guide

## Getting Started

### Accessing the Site Builder

1. Navigate to the dashboard at `/dashboard`
2. Click **"Site Builder"** (🎨) in the sidebar under "Content" section
3. You'll be presented with the template gallery

### Selecting a Template

Choose from three pre-built templates:

1. **Evento Básico** (Basic Event)
   - Simple 4-section layout
   - Best for: Small events, workshops, meetups
   - Sections: Hero, About, Pricing, Contact

2. **Conferencia** (Conference)
   - Professional 6-section layout
   - Best for: Conferences, seminars, business events
   - Sections: Hero, About, Schedule, Pricing, Gallery, Contact

3. **Concierto** (Concert)
   - Vibrant festival layout
   - Best for: Music festivals, concerts, entertainment events
   - Sections: Hero, About, Schedule, Pricing, Gallery, Contact

4. **Comenzar desde Cero** (Start from Scratch)
   - Empty canvas
   - Build your own custom layout

## Using the Builder Interface

### Top Bar

The top bar contains all main controls:

- **Edit/Preview Toggle**
  - **Edit mode** (✏️): Modify sections, drag-and-drop enabled
  - **Preview mode** (👁️): See how your page looks to visitors

- **Export Buttons**
  - **JSON**: Download page configuration
  - **HTML**: Download static HTML file

- **Save Button** (💾)
  - Saves current state
  - Shows `*` when there are unsaved changes
  - Auto-saves to localStorage

- **Publish Button** (🚀)
  - Publishes the page
  - Makes it live for visitors

### Left Sidebar

Two tabs for different functions:

#### 📦 Sections Tab

Add new sections to your page:

1. **Hero** (🎯): Main banner with title and call-to-action
2. **Precios** (💳): Ticket pricing cards
3. **Galería** (🖼️): Image gallery
4. **Acerca de** (ℹ️): About/information section
5. **Agenda** (📅): Event schedule
6. **Contacto** (📧): Contact information

**To add a section:**
- Click on any section type
- It will be added to the bottom of your page

#### ⚙️ Settings Tab

When a section is selected:
- Edit all section properties
- Modify text, images, colors
- Configure section-specific options

### Main Canvas

The central editing area:

#### Edit Mode
- **Drag Handle** (⋮⋮): Click and drag to reorder sections
- **Click Section**: Select a section to edit its properties
- **Visual Feedback**: Sections highlight on hover
- **Edit Indicator**: "Click to edit" appears on hover

#### Preview Mode
- Full-width display
- No editing controls
- See exactly how visitors will see your page

## Editing Sections

### Hero Section

Main banner for your event:

**Editable Properties:**
- **Title**: Main heading (large text)
- **Subtitle**: Supporting text
- **Background Image**: URL to background image
- **CTA Text**: Call-to-action button text
- **CTA Link**: Where the button links (e.g., `#pricing-1`)
- **Layout**: centered, left, or right alignment
- **Overlay**: Dark overlay on background (improves text readability)

**Tips:**
- Use high-resolution images (1920x1080 or larger)
- Enable overlay for better text contrast
- Link CTA to your pricing section for conversions

### Pricing Section

Display ticket options:

**Editable Properties:**
- **Title**: Section heading
- **Description**: Optional subtitle
- **Tickets**: Array of ticket options
  - Name, price, currency
  - Description
  - Features list
  - Availability status
- **Columns**: 2, 3, or 4 column layout

**Tips:**
- Highlight best value with features
- Mark sold-out tickets as unavailable
- Use 3 columns for optimal display

### Gallery Section

Showcase event photos:

**Editable Properties:**
- **Title**: Optional section heading
- **Images**: Array of images
  - URL, alt text, caption
- **Layout**: grid, masonry, or carousel
- **Columns**: 2, 3, or 4 columns (grid/masonry only)

**Tips:**
- Use consistent aspect ratios for grid layout
- Masonry works well with varied sizes
- Carousel is great for mobile

### About Section

Event description and details:

**Editable Properties:**
- **Title**: Section heading
- **Content**: HTML content (paragraphs, lists, etc.)
- **Image**: Supporting image URL
- **Image Position**: left or right

**Tips:**
- Use HTML for formatting: `<p>`, `<h3>`, `<ul>`, `<li>`
- Keep paragraphs concise
- Choose high-quality images

### Schedule Section

Event timeline/agenda:

**Editable Properties:**
- **Title**: Section heading
- **Events**: Array of schedule items
  - Time, title, description
  - Speaker, location
- **Layout**: timeline or list

**Tips:**
- Use timeline for formal events
- List layout for festivals/multiple stages
- Include all relevant details

### Contact Section

Contact information:

**Editable Properties:**
- **Title**: Section heading
- **Email**: Contact email
- **Phone**: Contact phone
- **Address**: Physical address
- **Map URL**: Google Maps embed URL
- **Social Links**: Array of social media links

**Tips:**
- Add all available contact methods
- Use Google Maps embed for accurate location
- Include all relevant social platforms

## Workflow Examples

### Creating a Basic Event Page

1. **Select "Evento Básico" template**
2. **Edit Hero Section**
   - Update title and subtitle
   - Add event background image
   - Set CTA to "Comprar entradas"
3. **Edit About Section**
   - Write event description
   - Add event image
4. **Edit Pricing Section**
   - Add ticket types with prices
   - List features for each tier
5. **Edit Contact Section**
   - Add email and phone
   - Include venue address
   - Add social media links
6. **Preview** your page
7. **Save** and **Publish**

### Creating a Conference Site

1. **Select "Conferencia" template**
2. **Customize Hero**
   - Conference name and tagline
   - Professional background image
3. **Update Schedule**
   - Add all sessions with times
   - Include speaker names
   - Specify locations/rooms
4. **Configure Pricing**
   - Standard and Premium passes
   - List benefits for each tier
5. **Add Gallery**
   - Previous year photos
   - Venue images
6. **Complete Contact**
   - Conference venue details
   - Organizer contact info
7. **Preview and Publish**

## Keyboard Shortcuts

- `Ctrl/Cmd + S`: Save
- `Ctrl/Cmd + P`: Toggle Preview
- `Esc`: Deselect section

## Best Practices

### Content
- ✅ Keep titles concise and impactful
- ✅ Use high-quality images
- ✅ Write clear, benefit-focused descriptions
- ✅ Include all relevant event details
- ✅ Proofread all text

### Design
- ✅ Maintain consistent color scheme
- ✅ Use readable fonts and sizes
- ✅ Ensure good contrast for accessibility
- ✅ Test on mobile devices (use preview)
- ✅ Limit to 5-7 sections for optimal load time

### SEO
- ✅ Include relevant keywords in titles
- ✅ Add descriptive alt text for images
- ✅ Use proper heading hierarchy
- ✅ Keep page title under 60 characters

## Troubleshooting

### My changes aren't saving
- Check for the `*` indicator showing unsaved changes
- Click the Save button explicitly
- Check browser console for errors

### Images not displaying
- Verify image URLs are correct and accessible
- Use HTTPS URLs when possible
- Check image file formats (JPG, PNG, WebP)

### Sections not reordering
- Ensure you're in Edit mode (not Preview)
- Click and hold the drag handle (⋮⋮)
- Drag vertically to desired position

### Lost my work
- Check localStorage auto-save
- Look for `site-builder-{pageId}` in browser storage
- The builder auto-saves periodically

## Export and Backup

### Exporting Your Page

**JSON Export:**
- Complete page configuration
- Can be imported later
- Useful for backups and version control

**HTML Export:**
- Static HTML file
- Host anywhere
- Includes inline styles (limited)

### Backup Strategy

1. **Regular Saves**: Save frequently while editing
2. **JSON Exports**: Export after major changes
3. **Version Control**: Keep multiple versions
4. **Cloud Storage**: Store exports in Google Drive/Dropbox

## Next Steps

After building your site:
1. **Test thoroughly** in preview mode
2. **Check mobile responsiveness**
3. **Verify all links work**
4. **Proofread content**
5. **Get feedback** from team members
6. **Publish** when ready
7. **Share** your event page URL

## Support

For issues or questions:
- Check this documentation
- Review the implementation guide
- Check browser console for errors
- Contact your development team
