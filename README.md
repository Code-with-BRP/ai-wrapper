# AI-CHAT 🤖💬

A modern, responsive React-based chat application that connects with OpenRouter to chat with various AI models including OpenAI, Anthropic, Google, DeepSeek, Mistral, and Grok.

![AI-CHAT Preview](https://via.placeholder.com/800x400/0ea5e9/ffffff?text=AI-CHAT+Preview)

## ✨ Features

- 🎯 **Multiple AI Models** - Chat with OpenAI GPT, Claude, Gemini, DeepSeek, Mistral, and Grok
- 🔐 **Secure API Key Management** - Store and validate your OpenRouter API key locally
- 💰 **Credit Monitoring** - View your OpenRouter account balance and usage
- 🎨 **Modern UI/UX** - Clean, responsive design with dark/light theme support
- 📱 **Mobile Responsive** - Works perfectly on desktop and mobile devices
- 💬 **Real-time Streaming** - See AI responses as they're generated
- 🎛️ **Default Model Settings** - Set your preferred AI model to load automatically
- 🔒 **Privacy First** - All data stored locally, no external tracking
- ✨ **Markdown Support** - Render code blocks, lists, and formatting in AI responses
- 🗑️ **Smart Chat Management** - Clear conversations with confirmation dialogs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- OpenRouter API Key ([Get one here](https://openrouter.ai/keys))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-chat.git
cd ai-chat
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

5. **Add your API Key**
- Click on the user avatar in the top-right corner
- Select "API Key Settings"
- Enter your OpenRouter API key
- Choose a default AI model (optional)
- Click "Validate & Save"

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Tailwind CSS v4** - Modern utility-first CSS framework  
- **Vite** - Lightning fast build tool
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Modern icon library
- **next-themes** - Seamless dark/light theme switching
- **React Markdown** - Render markdown with syntax highlighting

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── ChatMessage.tsx   # Message display with markdown
│   ├── ChatInput.tsx     # Message input with auto-resize
│   ├── ModelSelector.tsx # AI model selection dropdown
│   ├── APIKeyDialog.tsx  # API key management dialog
│   ├── UserAvatar.tsx    # User profile with status indicator
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useChat.ts       # Chat state management
│   ├── useApiKey.ts     # API key validation & storage
│   └── useModels.ts     # Model fetching & filtering
├── services/            # API integrations
│   └── openrouter.ts    # OpenRouter API client
├── lib/                 # Utilities
│   └── utils.ts         # Helper functions
└── types/               # TypeScript definitions
    └── index.ts         # Global type definitions
```

## 🎛️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code analysis |

## 🔧 Configuration

### Supported AI Models

The application supports models from these providers:
- **OpenAI** - GPT-4, GPT-3.5 Turbo, etc.
- **Anthropic** - Claude 3.5 Sonnet, Claude 3 Opus, etc.
- **Google** - Gemini Pro, Gemini Flash, etc.  
- **DeepSeek** - DeepSeek Chat, DeepSeek Coder, etc.
- **Mistral** - Mistral Large, Mistral Medium, etc.
- **Grok (xAI)** - Grok models

### Environment Variables

No environment variables needed! All configuration is handled through the UI.

## 🚢 Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

### Deploy to GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add deploy script to package.json:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```
3. Build and deploy: `npm run build && npm run deploy`

## 🔒 Privacy & Security

- **Local Storage Only** - API keys and settings stored in browser's local storage
- **No Data Collection** - No analytics, tracking, or data sent to third parties
- **Secure API Calls** - Direct HTTPS calls to OpenRouter, no intermediary servers
- **Client-Side Only** - Pure frontend application with no backend dependencies

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai) for providing unified AI model access
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for the styling system
- [Lucide](https://lucide.dev) for the icon set

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/ai-chat/issues) page
2. Create a new issue with detailed information
3. Include screenshots and error messages if applicable

---

<div align="center">
  <strong>⭐ Star this repository if you find it helpful! ⭐</strong>
</div>