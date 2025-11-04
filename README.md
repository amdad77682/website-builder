# Website Builder

A modern, full-stack website builder built with Next.js and Supabase. Create and manage pages with customizable blocks including text, video, gallery, and split-view layouts.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [How to Run](#how-to-run)
- [Environment Variables](#environment-variables)
- [Packages Overview](#packages-overview)
- [Deployment](#deployment)

## Technologies Used

- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand 5.0.8
- **Data Fetching**: SWR 2.3.6
- **UI Components**: Ant Design 5.27.6
- **Icons**: Lucide React 0.548.0
- **HTTP Client**: Axios 1.13.1

## Project Structure

```
website-builder/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── pages/                # Pages API endpoints
│   │   │   ├── [id]/             # Dynamic page routes
│   │   │   └── route.ts          # GET, POST /api/pages
│   │   ├── header-menus/         # Header menu API endpoints
│   │   │   ├── [id]/             # Dynamic header routes
│   │   │   └── route.ts          # GET, POST /api/header-menus
│   │   └── page-blocks/          # Blocks API endpoints
│   │       ├── [id]/             # Dynamic block routes
│   │       ├── reorder/          # Reorder blocks endpoint
│   │       └── route.ts          # GET, POST /api/page-blocks
│   ├── page/                     # Page routes
│   │   └── [id]/                 # Dynamic page view
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── lib/                          # Utility libraries
│   ├── api.ts                    # Axios instance configuration
│   └── supabase.ts               # Supabase client setup
├── modules/                      # React components
│   ├── header/                   # Header component
│   ├── sidebar/                  # Sidebar navigation
│   ├── pages/                    # Page-related components
│   │   └── blocks/               # Block components
│   │       ├── Blocks.tsx        # Block list component
│   │       ├── TextBlock.tsx     # Text block component
│   │       ├── VideoBlock.tsx    # Video block component
│   │       ├── Gallary.tsx       # Gallery block component
│   │       ├── SplitView.tsx     # Split view block component
│   │       └── common/          # Shared block utilities
│   ├── interfaces/               # TypeScript interfaces
│   └── contants/                 # Constants and configurations
├── services/                     # API service functions
│   ├── pageService.ts            # Pages API service
│   ├── headerService.ts          # Header API service
│   └── blocksService.ts          # Blocks API service
├── store/                        # Zustand state management
│   ├── blocks.ts                 # Blocks store
│   └── header.ts                # Header store
└── public/                       # Static assets
```

## Database Schema

The project uses Supabase (PostgreSQL) with the following tables:

### `pages`

Stores website pages.

| Column        | Type      | Description                  |
| ------------- | --------- | ---------------------------- |
| `id`          | uuid      | Primary key                  |
| `site_id`     | integer   | Foreign key to site          |
| `slug`        | text      | URL-friendly page identifier |
| `title`       | text      | Page title                   |
| `order_index` | integer   | Order for page display       |
| `created_at`  | timestamp | Auto-generated timestamp     |
| `updated_at`  | timestamp | Auto-generated timestamp     |

### `header_menus`

Stores header menu configurations.

| Column           | Type      | Description                   |
| ---------------- | --------- | ----------------------------- |
| `id`             | uuid      | Primary key                   |
| `site_id`        | integer   | Foreign key to site           |
| `displayed_name` | text      | Header display name           |
| `font_color`     | text      | Header font color (hex)       |
| `backdrop_color` | text      | Header background color (hex) |
| `items`          | jsonb     | Menu items array              |
| `created_at`     | timestamp | Auto-generated timestamp      |
| `updated_at`     | timestamp | Auto-generated timestamp      |

### `blocks`

Stores page content blocks.

| Column        | Type      | Description                                   |
| ------------- | --------- | --------------------------------------------- |
| `id`          | uuid      | Primary key                                   |
| `page_id`     | uuid      | Foreign key to pages                          |
| `type`        | text      | Block type (text, video, gallery, split-view) |
| `config`      | jsonb     | Block configuration data                      |
| `order_index` | integer   | Order for block display                       |
| `created_at`  | timestamp | Auto-generated timestamp                      |
| `updated_at`  | timestamp | Auto-generated timestamp                      |

## API Endpoints

### Pages API

#### `GET /api/pages`

Get all pages.

**Response**: `200 OK`

```json
[
  {
    "id": "uuid",
    "site_id": 1,
    "slug": "home",
    "title": "Home Page",
    "order_index": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### `POST /api/pages`

Create a new page.

**Request Body**:

```json
{
  "site_id": 1,
  "slug": "about",
  "title": "About Page",
  "order_index": 1
}
```

**Response**: `201 Created`

```json
{
  "id": "uuid",
  "site_id": 1,
  "slug": "about",
  "title": "About Page",
  "order_index": 1
}
```

#### `GET /api/pages/[id]`

Get a single page by ID.

**Response**: `200 OK`

```json
{
  "id": "uuid",
  "site_id": 1,
  "slug": "home",
  "title": "Home Page",
  "order_index": 0
}
```

#### `PUT /api/pages/[id]`

Update a page (full replacement).

**Request Body**:

```json
{
  "site_id": 1,
  "slug": "updated-slug",
  "title": "Updated Title",
  "order_index": 0
}
```

**Response**: `200 OK`

#### `PATCH /api/pages/[id]`

Update a page (partial update).

**Request Body**:

```json
{
  "title": "New Title"
}
```

**Response**: `200 OK`

#### `DELETE /api/pages/[id]`

Delete a page.

**Response**: `204 No Content`

---

### Header Menus API

#### `GET /api/header-menus?site_id=1`

Get all header menus (optionally filtered by site_id).

**Query Parameters**:

- `site_id` (optional): Filter by site ID

**Response**: `200 OK`

```json
[
  {
    "id": "uuid",
    "site_id": 1,
    "displayed_name": "My Website",
    "font_color": "#FFFFFF",
    "backdrop_color": "#000000",
    "items": []
  }
]
```

#### `POST /api/header-menus`

Create a new header menu.

**Request Body**:

```json
{
  "site_id": 1,
  "displayed_name": "My Website",
  "font_color": "#FFFFFF",
  "backdrop_color": "#000000",
  "items": []
}
```

**Response**: `201 Created`

#### `GET /api/header-menus/[id]`

Get a single header menu by ID.

**Response**: `200 OK`

#### `PUT /api/header-menus/[id]`

Update a header menu (full replacement).

**Request Body**:

```json
{
  "site_id": 1,
  "displayed_name": "Updated Name",
  "font_color": "#000000",
  "backdrop_color": "#FFFFFF",
  "items": []
}
```

**Response**: `200 OK`

#### `PATCH /api/header-menus/[id]`

Update a header menu (partial update).

**Request Body**:

```json
{
  "displayed_name": "New Name"
}
```

**Response**: `200 OK`

#### `DELETE /api/header-menus/[id]`

Delete a header menu.

**Response**: `204 No Content`

---

### Page Blocks API

#### `GET /api/page-blocks?page_id=uuid`

Get all blocks (optionally filtered by page_id).

**Query Parameters**:

- `page_id` (optional): Filter by page ID

**Response**: `200 OK`

```json
[
  {
    "id": "uuid",
    "page_id": "uuid",
    "type": "text",
    "config": {
      "text": "Hello World"
    },
    "order_index": 0
  }
]
```

#### `POST /api/page-blocks`

Create a new block (order_index is auto-calculated).

**Request Body**:

```json
{
  "page_id": "uuid",
  "type": "text",
  "config": {
    "text": "Hello World"
  }
}
```

**Response**: `201 Created`

#### `GET /api/page-blocks/[id]`

Get a single block by ID.

**Response**: `200 OK`

#### `PUT /api/page-blocks/[id]`

Update a block (full replacement).

**Request Body**:

```json
{
  "page_id": "uuid",
  "type": "text",
  "config": {
    "text": "Updated Text"
  },
  "order_index": 0
}
```

**Response**: `200 OK`

#### `PATCH /api/page-blocks/[id]`

Update a block (partial update).

**Request Body**:

```json
{
  "config": {
    "text": "New Text"
  }
}
```

**Response**: `200 OK`

#### `DELETE /api/page-blocks/[id]`

Delete a block.

**Response**: `204 No Content`

#### `PATCH /api/page-blocks/reorder`

Reorder multiple blocks.

**Request Body**:

```json
{
  "page_id": "uuid",
  "updates": [
    {
      "id": 1,
      "order_index": 0
    },
    {
      "id": 2,
      "order_index": 1
    }
  ]
}
```

**Response**: `200 OK`

```json
[
  {
    "id": 1,
    "page_id": "uuid",
    "type": "text",
    "order_index": 0
  },
  {
    "id": 2,
    "page_id": "uuid",
    "type": "video",
    "order_index": 1
  }
]
```

## How to Run

### Prerequisites

- Node.js 20+ installed
- npm, yarn, pnpm, or bun package manager
- Supabase account and project

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd website-builder
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Environment Variables Explanation

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (public, safe for client-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side only, bypasses RLS)

⚠️ **Important**: Never commit the `.env.local` file or expose `SUPABASE_SERVICE_ROLE_KEY` to the client.

## Packages Overview

### Dependencies

| Package                 | Version | Purpose                                     |
| ----------------------- | ------- | ------------------------------------------- |
| `next`                  | 16.0.1  | React framework with App Router             |
| `react`                 | 19.2.0  | UI library                                  |
| `react-dom`             | 19.2.0  | React DOM rendering                         |
| `typescript`            | 5       | Type safety                                 |
| `@supabase/supabase-js` | 2.77.0  | Supabase client for database operations     |
| `axios`                 | 1.13.1  | HTTP client for API requests                |
| `swr`                   | 2.3.6   | Data fetching with caching and revalidation |
| `zustand`               | 5.0.8   | Lightweight state management                |
| `antd`                  | 5.27.6  | UI component library                        |
| `lucide-react`          | 0.548.0 | Icon library                                |
| `tailwindcss`           | 4       | Utility-first CSS framework                 |
| `@tailwindcss/postcss`  | 4       | PostCSS plugin for Tailwind                 |

### Dev Dependencies

| Package                            | Version | Purpose                        |
| ---------------------------------- | ------- | ------------------------------ |
| `@types/node`                      | 20      | Node.js type definitions       |
| `@types/react`                     | 19      | React type definitions         |
| `@types/react-dom`                 | 19      | React DOM type definitions     |
| `eslint`                           | 9       | Code linting                   |
| `eslint-config-next`               | 16.0.1  | Next.js ESLint configuration   |
| `prettier-plugin-organize-imports` | 4.3.0   | Organize imports with Prettier |

## Deployment

### Vercel Deployment

The project is configured for deployment on Vercel.

**Deployment URL**: https://website-builder-navy-nine.vercel.app/page/6

### Deployment Steps

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

### Environment Variables for Production

Make sure to set the same environment variables in your Vercel project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Features

- ✅ Create and manage multiple pages
- ✅ Customizable header with display name, font color, and background color
- ✅ Multiple block types:
  - Text blocks with rich text editor
  - Video blocks with play/pause functionality
  - Gallery blocks for image displays
  - Split-view blocks combining text and media
- ✅ Drag-and-drop block reordering
- ✅ Real-time updates with SWR
- ✅ Responsive design with Tailwind CSS
- ✅ Type-safe development with TypeScript

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]
