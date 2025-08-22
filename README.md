# 🤖 SamvadGPT - Advanced AI Assistant

A production-ready, full-stack AI assistant web application built with Next.js 14, React 18, TypeScript, and Google Gemini AI. SamvadGPT features a modern chat interface, voice input/output capabilities, multi-language support (English, Hindi, Hinglish), and robust architecture.

## ✨ Features

### 🎯 Core Features
- **Real-time Chat Interface** - Smooth messaging with typing indicators and message status
- **Google Gemini AI Integration** - Streaming responses with context-aware conversations
- **Multi-language Support** - English, Hindi, and Hinglish conversation capabilities
- **Voice Integration** - Speech-to-text input and text-to-speech output
- **Dark/Light Theme** - Toggle between themes with system preference detection
- **Responsive Design** - Mobile-first approach with optimized UX across all devices

### 🚀 Advanced Features
- **Conversation Management** - Create, delete, and organize multiple chat sessions
- **Message Persistence** - Local storage with optional database integration
- **Export Functionality** - Download chat history in JSON or text format
- **Rate Limiting** - Built-in API protection and usage monitoring
- **Real-time Streaming** - Server-sent events for live AI responses
- **Voice Commands** - Web Speech API integration for hands-free interaction

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **State Management**: Zustand with persistence
- **AI Integration**: Google Gemini API
- **Voice**: Web Speech API
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://aistudio.google.com/))

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | ✅ | - |
| `NEXT_PUBLIC_APP_URL` | Application URL | ❌ | `http://localhost:3000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | ❌ | `100` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | ❌ | `900000` (15 min) |

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Navigate to "Get API Key" section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## 📱 Usage

### Basic Chat
1. Type your message in the input field
2. Press Enter or click Send
3. Watch the AI respond in real-time

### Voice Input
1. Enable voice in settings
2. Click the microphone button
3. Speak your message
4. The text will appear in the input field

### Conversation Management
- Click "New Chat" to start a fresh conversation
- Use the sidebar to navigate between conversations
- Delete conversations with the trash icon
- Export your chat history using the download button

## 🚀 Deployment

The application is deployed on Netlify. For deployment instructions, please refer to the Netlify documentation.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google/) for the powerful AI capabilities
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

**Made with ❤️ using Next.js, React, and Google Gemini AI**
