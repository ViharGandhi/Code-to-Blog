import React, { useState, useEffect } from 'react';
import { Github, Loader2, Sparkles, Send, BookOpen, Twitter, Linkedin, Moon, Sun, Copy, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ContentTypeInfo = {
  blog: {
    icon: BookOpen,
    title: "Comprehensive Blog Post",
    description: "Transform your GitHub project into a technical deep-dive",
    features: [
      "Detailed project architecture",
      "Technical insights",
      "Code best practices",
      "Problem-solving narrative",
      "Future improvement roadmap"
    ],
    lightGradient: "from-green-400 to-emerald-600",
    darkGradient: "from-green-800 to-emerald-950"
  },
  twitter: {
    icon: Twitter,
    title: "Twitter Thread",
    description: "Craft a viral tech storytelling moment",
    features: [
      "Concise project summary",
      "Technical highlights",
      "Engaging code snippets",
      "Developer insights",
      "Community engagement"
    ],
    lightGradient: "from-sky-400 to-blue-600",
    darkGradient: "from-sky-800 to-blue-950"
  },
  linkedin: {
    icon: Linkedin,
    title: "LinkedIn Post",
    description: "Showcase your professional tech journey",
    features: [
      "Professional narrative",
      "Project achievements",
      "Industry impact",
      "Learning experiences",
      "Networking opportunity"
    ],
    lightGradient: "from-indigo-400 to-purple-600",
    darkGradient: "from-indigo-800 to-purple-950"
  }
};


const CodeToPublicApp = () => {
  const [githubLink, setGithubLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('blog');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  // Check for saved dark mode preference on initial load
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedBlog(null);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}blog-creation`, {
        url: githubLink,
      });
      
      if(response.status === 200){
        setGeneratedBlog(response.data);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBlog = () => {
    navigator.clipboard.writeText(generatedBlog);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const CurrentContentType = ContentTypeInfo[activeTab];

  // If blog is generated, render blog view
  if (generatedBlog) {
    return (
      <div className={`min-h-screen w-full ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} 
        flex justify-center p-4 transition-colors duration-300`}>
        <div className={`
          w-full max-w-4xl 
          ${isDarkMode 
            ? 'bg-gray-800 text-gray-100 shadow-2xl' 
            : 'bg-white text-gray-900 shadow-2xl'} 
          rounded-3xl p-8 md:p-12 relative`}>
          
          {/* Copy Button */}
          <button 
            onClick={handleCopyBlog}
            className={`absolute top-4 right-4 p-2 rounded-full 
              ${isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} 
              transition-all duration-300 flex items-center space-x-2`}
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span className="text-sm">Copy</span>
              </>
            )}
          </button>

          {/* Blog Content */}
          <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
            <article className="space-y-6">
              {/* Dynamically render blog content */}
              {generatedBlog.split('\n').map((paragraph, index) => (
                paragraph.trim() ? (
                  <p 
                    key={index} 
                    className={`
                      ${paragraph.startsWith('#') ? 'text-2xl font-bold mb-4' : ''}
                      ${paragraph.startsWith('##') ? 'text-xl font-semibold mb-3' : ''}
                      ${paragraph.startsWith('```') ? 'bg-gray-100 p-4 rounded-lg overflow-x-auto' : ''}
                    `}
                  >
                    {paragraph.replace(/^#+\s*/, '')}
                  </p>
                ) : null
              ))}
            </article>
          </div>

          {/* Back to Generator Button */}
          <button 
            onClick={() => setGeneratedBlog(null)}
            className={`mt-8 w-full py-3 rounded-xl 
              ${isDarkMode 
                ? 'bg-blue-800 text-white hover:bg-blue-700' 
                : 'bg-blue-500 text-white hover:bg-blue-600'} 
              transition-all duration-300`}
          >
            Generate Another Blog
          </button>
        </div>
      </div>
    );
  }

  // Original component remains the same
  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} 
    flex items-center justify-center p-4 transition-colors duration-300`}>
    {/* Theme Toggle Button */}
    <button 
      onClick={toggleDarkMode}
      className={`fixed top-4 right-4 z-50 p-2 rounded-full 
        ${isDarkMode 
          ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} 
        transition-all duration-300`}
    >
      {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>

    <div className={`w-full max-w-5xl 
      ${isDarkMode 
        ? 'bg-gray-800 text-gray-100 shadow-2xl' 
        : 'bg-white text-gray-900 shadow-2xl'} 
      rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 
      divide-y md:divide-y-0 md:divide-x 
      ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'} 
      transition-colors duration-300`}>
      
      {/* Left Column - Content Type Preview */}
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-8 flex flex-col justify-center`}>
        <div className="text-center mb-6">
          <div className={`mx-auto mb-4 w-16 h-16 bg-gradient-to-br 
            ${isDarkMode 
              ? CurrentContentType.darkGradient 
              : CurrentContentType.lightGradient} 
            rounded-full flex items-center justify-center`}>
            <CurrentContentType.icon className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {CurrentContentType.title}
          </h2>
        </div>

        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center mb-6`}>
          {CurrentContentType.description}
        </p>

        <ul className="space-y-3">
          {CurrentContentType.features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              <span className={`w-2 h-2 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-full`}></span>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Column - Input and Generation */}
      <div className="p-8 flex flex-col justify-center">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center space-x-3 mb-3">
            <Sparkles className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} w-8 h-8`} />
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Code-to-Public
            </h1>
          </div>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Transform your GitHub project into shareable content
          </p>
        </div>

        {/* Content Type Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          {Object.keys(ContentTypeInfo).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-all duration-300 
                flex items-center space-x-2
                ${activeTab === tab 
                  ? (isDarkMode 
                    ? 'bg-blue-800 text-white' 
                    : 'bg-blue-500 text-white')
                  : (isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}`}
            >
              {React.createElement(ContentTypeInfo[tab].icon, { className: "w-4 h-4" })}
              <span>{tab}</span>
            </button>
          ))}
        </div>

        {/* GitHub Link Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input 
              type="text" 
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              placeholder="Paste your GitHub repository link"
              className={`w-full px-4 py-3 
                ${isDarkMode 
                  ? 'bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-600' 
                  : 'bg-gray-100 text-gray-800 border-gray-300 focus:ring-blue-500'} 
                border rounded-xl 
                focus:outline-none focus:ring-2 
                transition-all duration-300`}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Github className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full flex items-center justify-center 
              ${isDarkMode 
                ? 'bg-blue-800 text-white hover:bg-blue-700' 
                : 'bg-blue-500 text-white hover:bg-blue-600'} 
              py-3 rounded-xl 
              transition-all duration-300 
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Send className="mr-2" />
            )}
            {isLoading ? 'Generating...' : `Generate ${activeTab} Content`}
          </button>
        </form>

        {/* GitHub Link */}
        {githubLink && (
          <div className="text-center mt-4">
            <a 
              href={githubLink}
              target="_blank" 
              rel="noopener noreferrer"
              className={`
                ${isDarkMode 
                  ? 'text-gray-400 hover:text-blue-400' 
                  : 'text-gray-500 hover:text-blue-500'} 
                transition-colors flex items-center justify-center space-x-2`}
            >
              <Github className="w-5 h-5" />
              <span>View Project on GitHub</span>
            </a>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};



export default CodeToPublicApp;
