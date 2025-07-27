# 🔐 Hello Svelte

A modern, production-ready SvelteKit authentication template featuring JWT-based auth, beautiful UI components, and comprehensive user management. Built with **SvelteKit 2**, **Svelte 5**, and **Auth.js** for secure, scalable web applications.

## ✨ Features

### 🔑 Authentication & Security
- **JWT-based authentication** with Auth.js integration
- **Session management** with HTTP-only cookies
- **Automatic token refresh** and validation
- **Protected routes** with seamless redirects
- **API abuse prevention** with session-aware login blocking
- **Secure environment variable handling**

### 🎨 Modern UI & UX
- **shadcn-svelte** component library with beautiful, accessible components
- **Responsive design** optimized for all device sizes
- **Dark/light theme** support with automatic system detection
- **Smooth animations** and micro-interactions
- **Mobile-first approach** with touch-friendly interfaces

### 🌐 API & Data Management
- **Configurable API client** with runtime reconfiguration
- **TanStack Query** for efficient server state management
- **Automatic request/response interceptors**
- **Advanced data tables** with sorting, filtering, and pagination
- **CSV export functionality**
- **Real-time data synchronization**

### 📱 Advanced Form Handling
- **Superforms integration** with Zod validation
- **Type-safe form schemas**
- **Real-time validation** with beautiful error states
- **Complex form components** (date pickers, multi-select, etc.)
- **Responsive form layouts**

### 🌍 Internationalization
- **Multi-language support** (English, Indonesian, Japanese)
- **Type-safe translations** with Paraglide.js
- **Server-side language detection**
- **RTL language support** ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Package manager: npm, yarn, or pnpm

### Installation

```bash
# Clone Hello Svelte
git clone https://github.com/linkeunid/hello-svelte.git my-app
cd my-app

# Install dependencies
yarn install
# or
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Setup

Update `.env` with your configuration:

```bash
# AUTH.JS CONFIGURATION
AUTH_SECRET=your-super-secret-auth-key-here  # Generate with: openssl rand -base64 32

# API CONFIGURATION  
PUBLIC_API_BASE_URL=https://dummyjson.com
API_BASE_URL=https://dummyjson.com
API_TIMEOUT=10000
```

### Development

```bash
# Start development server
yarn dev
# or
npm run dev

# Open browser
open http://localhost:5173
```

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn-svelte components
│   │   ├── LoginForm.svelte
│   │   ├── UsersTable.svelte
│   │   └── ...
│   ├── api/                # API client and endpoints
│   │   ├── client.ts       # Axios configuration
│   │   ├── auth.ts         # Authentication API
│   │   └── users.ts        # User management API
│   ├── config/             # Application configuration
│   │   ├── api.ts          # API presets and settings
│   │   └── site.ts         # Site metadata
│   ├── server/             # Server-side logic
│   │   └── auth.ts         # Auth.js configuration
│   ├── stores/             # Svelte stores
│   └── utils/              # Utility functions
├── routes/                 # SvelteKit routes
│   ├── demo/              # Demo pages$$
│   ├── auth/              # Authentication pages
│   ├── users/             # User management
│   └── forms/             # Form examples
└── app.html               # HTML template
```

## 📄 Routes & Pages

This template includes the following routes and pages:

### Main Pages
- **`/`** - **Home Page**: Landing page with project overview and feature showcase
- **`/auth`** - **Authentication**: Login form, session management, and user profile display
- **`/users`** - **User Management**: Data table with user listings, search, and CSV export
- **`/forms`** - **Form Examples**: Advanced form components with validation and complex inputs

### Demo Pages
- **`/demo`** - **Demo Hub**: Showcase of various features and components
- **`/demo/paraglide`** - **Internationalization**: Multi-language support demonstration

### Features by Route

| Route             | Features                                              | Authentication Required                       |
| ----------------- | ----------------------------------------------------- | --------------------------------------------- |
| `/`               | Project overview, feature showcase, navigation        | ❌ No                                          |
| `/auth`           | Login form, session status, user profile, logout      | ❌ No (shows different content when logged in) |
| `/users`          | User data table, pagination, search, CSV export       | ❌ No (uses public API)                        |
| `/forms`          | Complex forms, validation, date pickers, multi-select | ❌ No                                          |
| `/demo`           | Component showcase, feature demonstrations            | ❌ No                                          |
| `/demo/paraglide` | Language switching, i18n examples                     | ❌ No                                          |

### Layout Structure
- **Root Layout** (`+layout.svelte`): Navigation, theme toggle, global components
- **Page Layouts**: Each route can have its own layout for specific needs
- **Error Pages**: Built-in error handling with user-friendly error pages

## 🔧 Configuration

### API Configuration

The template includes a flexible API configuration system:

```typescript
// Runtime API reconfiguration
import { reconfigureApiClient, apiPresets } from '$lib/config/api';

// Switch to different API
reconfigureApiClient(apiPresets.jsonplaceholder);

// Custom configuration
reconfigureApiClient({
  baseURL: 'https://api.myapp.com',
  timeout: 15000,
  headers: { 'X-Custom-Header': 'value' }
});
```

### Authentication Providers

Currently configured with DummyJSON API. Extend with additional providers:

```typescript
// src/lib/server/auth.ts
import GitHub from '@auth/sveltekit/providers/github';
import Google from '@auth/sveltekit/providers/google';

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    Credentials({ /* ... */ }),
    GitHub({ clientId: '...', clientSecret: '...' }),
    Google({ clientId: '...', clientSecret: '...' })
  ]
});
```

## 🎯 Usage Examples

### Session-Aware Components

```svelte
<!-- Any page component -->
<script lang="ts">
  import { page } from '$app/stores';
  
  const session = $derived($page.data.session);
</script>

{#if session?.user}
  <h1>Welcome back, {session.user.name}!</h1>
  <p>You are currently logged in.</p>
{:else}
  <p>Please log in to access personalized features.</p>
{/if}
```

### API Calls with Authentication

```typescript
// Automatic auth headers injection
import { api } from '$lib/api/client';

// Headers automatically include JWT token when session exists
const users = await api.get('/users'); // Get users list
const currentUser = await api.get('/auth/me'); // Get current user profile
const userById = await api.get('/users/1'); // Get specific user
```

### Form Validation

```svelte
<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod4 } from 'sveltekit-superforms/adapters';
  import { schema } from './schema'; // Form schema with Zod validation
  
  const form = superForm(defaultValues, {
    validators: zod4(schema),
    dataType: 'json',
    validationMethod: 'onblur'
  });
  
  const { form: formData, enhance, errors } = form;
</script>

<!-- Example from /forms page -->
<form method="POST" use:enhance>
  <input bind:value={$formData.name} />
  {#if $errors.name}<span class="error">{$errors.name}</span>{/if}
</form>
```

## 🧪 Testing

```bash
# Unit tests
yarn test
# or
npm run test

# E2E tests
yarn test:e2e
# or
npm run test:e2e

# Coverage report
yarn test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker

```bash
# Build image
docker build -t hello-svelte .

# Run container
docker run -p 3000:3000 hello-svelte
```

## 🔒 Security Considerations

- **Environment Variables**: Never commit secrets to version control
- **HTTPS Only**: Always use HTTPS in production
- **CSRF Protection**: Built-in with Auth.js
- **XSS Prevention**: Automatic escaping in Svelte
- **Session Security**: HTTP-only cookies with secure flags

## 🎨 Customization

### Theming

Customize colors and design tokens in:
- `tailwind.config.js` - Tailwind configuration
- `src/lib/config/site.ts` - Site metadata and branding
- `src/app.css` - Global styles and CSS variables

### Components

All UI components are fully customizable:
- Built with shadcn-svelte for consistency
- Tailwind classes for easy styling
- Accessible by default with ARIA support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SvelteKit](https://svelte.dev/) - The web framework
- [Auth.js](https://authjs.dev/) - Authentication library
- [shadcn-svelte](https://shadcn-svelte.com/) - UI components
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [DummyJSON](https://dummyjson.com/) - Mock API for development

## 📚 Documentation

For detailed documentation on specific features:

- [Authentication Guide](docs/authentication.md)
- [API Integration](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

## 💬 Support

- 📧 Email: hello@linkeun.com
- 🐛 Issues: [GitHub Issues](https://github.com/linkeunid/hello-svelte/issues)
- 🌐 Website: [linkeun.com](https://www.linkeun.com)

---

Built with ❤️ using SvelteKit and modern web technologies.