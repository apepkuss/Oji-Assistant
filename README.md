# Oji Assistant

A modern, responsive AI chat application built with React and Chakra UI. Oji provides an intuitive interface for AI conversations with support for both streaming and non-streaming responses.

## Prerequisites

- Node.js 16+
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/apepkuss/Oji-Assistant.git
cd Oji-Assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the application

```bash
npm run build
```

### 4. Run the application

For development:

```bash
npm run dev
```

For production preview:

```bash
npm run preview
```

The application will be available at `http://localhost:5173` (dev) or `http://localhost:4173` (preview).

## Configuration

1. Click the settings icon (⚙️) in the sidebar
2. Navigate to the **Server** tab
3. Configure your AI service endpoint:
   - **Base URL**: Set your AI service endpoint (default: `http://localhost:9068/v1`)
   - **Streaming**: Enable/disable real-time response streaming
