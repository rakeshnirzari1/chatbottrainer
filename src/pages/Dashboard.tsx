import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Bot, Globe, Zap, Copy, CheckCircle, Loader2, MessageSquare,
  Settings, Trash2, ExternalLink, Play, AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { supabase } from '../lib/supabase';
import { isAdmin } from '../lib/admin';

interface ChatbotProject {
  id: string;
  name: string;
  website_url: string;
  status: 'pending' | 'crawling' | 'training' | 'ready' | 'error';
  model: string;
  created_at: string;
  embed_code: string | null;
  error_message: string | null;
}

interface TestMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [projects, setProjects] = useState<ChatbotProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ChatbotProject | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  const [newProject, setNewProject] = useState({
    name: '',
    website_url: '',
    model: 'gpt-3.5-turbo',
    max_pages: 50
  });

  const [openaiKey, setOpenaiKey] = useState('');
  const [testMessages, setTestMessages] = useState<TestMessage[]>([]);
  const [testInput, setTestInput] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    checkAdmin();
    loadProjects();

    const interval = setInterval(loadProjects, 5000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const checkAdmin = async () => {
    const adminStatus = await isAdmin();
    setIsAdminUser(adminStatus);
  };

  const loadProjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chatbot_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !openaiKey) {
      alert('Please provide your OpenAI API key');
      return;
    }

    try {
      const { data: project, error } = await supabase
        .from('chatbot_projects')
        .insert({
          user_id: user.id,
          name: newProject.name,
          website_url: newProject.website_url,
          model: newProject.model,
          max_pages: newProject.max_pages,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setShowCreateModal(false);
      setNewProject({ name: '', website_url: '', model: 'gpt-3.5-turbo', max_pages: 50 });

      await handleTrainChatbot(project.id);

      await loadProjects();
    } catch (error: any) {
      console.error('Error creating project:', error);
      alert(error.message || 'Failed to create project');
    }
  };

  const handleTrainChatbot = async (projectId: string) => {
    if (!openaiKey) {
      alert('Please provide your OpenAI API key');
      return;
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const crawlResponse = await fetch(`${supabaseUrl}/functions/v1/crawl-and-train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ project_id: projectId })
      });

      if (!crawlResponse.ok) {
        const error = await crawlResponse.json();
        throw new Error(error.error || 'Crawling failed');
      }

      const embedResponse = await fetch(`${supabaseUrl}/functions/v1/generate-embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          project_id: projectId,
          openai_api_key: openaiKey
        })
      });

      if (!embedResponse.ok) {
        const error = await embedResponse.json();
        throw new Error(error.error || 'Embedding generation failed');
      }

      await loadProjects();
      alert('Chatbot trained successfully!');
    } catch (error: any) {
      console.error('Training error:', error);
      alert(error.message || 'Training failed');

      await supabase
        .from('chatbot_projects')
        .update({
          status: 'error',
          error_message: error.message
        })
        .eq('id', projectId);
    }
  };

  const handleTestChatbot = (project: ChatbotProject) => {
    setSelectedProject(project);
    setTestMessages([]);
    setShowTestModal(true);
  };

  const handleSendTestMessage = async () => {
    if (!testInput.trim() || !selectedProject || !openaiKey) return;

    const userMessage = testInput.trim();
    setTestInput('');
    setTestMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTesting(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      const response = await fetch(`${supabaseUrl}/functions/v1/chatbot-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project_id: selectedProject.id,
          message: userMessage,
          openai_api_key: openaiKey
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const data = await response.json();
      setTestMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }]);
    } catch (error: any) {
      console.error('Test error:', error);
      setTestMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}`
      }]);
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyEmbed = (projectId: string, embedCode: string) => {
    navigator.clipboard.writeText(embedCode);
    setCopiedId(projectId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this chatbot? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('chatbot_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const getStatusBadge = (status: ChatbotProject['status']) => {
    const styles = {
      pending: 'bg-gray-100 text-gray-700',
      crawling: 'bg-blue-100 text-blue-700',
      training: 'bg-purple-100 text-purple-700',
      ready: 'bg-green-100 text-green-700',
      error: 'bg-red-100 text-red-700'
    };

    const labels = {
      pending: 'Pending',
      crawling: 'Crawling...',
      training: 'Training...',
      ready: 'Ready',
      error: 'Error'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onGetStarted={() => setShowCreateModal(true)}
        isAdminUser={isAdminUser}
      />

      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Chatbots</h1>
            <p className="text-gray-600 mt-2">Create and manage AI chatbots for your websites</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Chatbot
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No chatbots yet</h3>
            <p className="text-gray-600 mb-6">Create your first chatbot to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Your First Chatbot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <a
                        href={project.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" />
                        {new URL(project.website_url).hostname}
                      </a>
                    </div>
                  </div>
                  {getStatusBadge(project.status)}
                </div>

                {project.error_message && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-700">{project.error_message}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {project.status === 'ready' && (
                    <>
                      <button
                        onClick={() => handleTestChatbot(project)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Test Chatbot
                      </button>

                      {project.embed_code && (
                        <button
                          onClick={() => handleCopyEmbed(project.id, project.embed_code!)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                          {copiedId === project.id ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy Embed Code
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}

                  {project.status === 'error' && (
                    <button
                      onClick={() => handleTrainChatbot(project.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Zap className="w-4 h-4" />
                      Retry Training
                    </button>
                  )}

                  {(project.status === 'crawling' || project.status === 'training') && (
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </div>
                  )}

                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Chatbot</h2>

            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chatbot Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="My Support Bot"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={newProject.website_url}
                  onChange={(e) => setNewProject({ ...newProject, website_url: e.target.value })}
                  placeholder="https://example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll crawl this website to train your chatbot
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Your API key is used securely and never stored
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Model
                  </label>
                  <select
                    value={newProject.model}
                    onChange={(e) => setNewProject({ ...newProject, model: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast & Affordable)</option>
                    <option value="gpt-4">GPT-4 (Most Accurate)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo (Balanced)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Pages
                  </label>
                  <input
                    type="number"
                    value={newProject.max_pages}
                    onChange={(e) => setNewProject({ ...newProject, max_pages: parseInt(e.target.value) })}
                    min="10"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Create & Train Chatbot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTestModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full h-[600px] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Test: {selectedProject.name}
                </h2>
                <button
                  onClick={() => setShowTestModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {testMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Start a conversation to test your chatbot</p>
                </div>
              ) : (
                testMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isTesting && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendTestMessage()}
                  placeholder="Ask a question..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isTesting}
                />
                <button
                  onClick={handleSendTestMessage}
                  disabled={isTesting || !testInput.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
