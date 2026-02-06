import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { api } from '../utils/api';

export default function CreateArticle() {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const wordCount = formData.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 120) {
      toast.error(`Your article must have at least 120 words. Current count: ${wordCount}`);
      return;
    }

    setLoading(true);

    try {
      // Create article using real API
      await api.articles.create(formData);

      toast.success('Story shared successfully!');
      navigate('/articles');
    } catch (err) {
      toast.error(err.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Share Your Story
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            This is a safe space to share your thoughts, experiences, and feelings.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all bg-opacity-50"
                placeholder="Give your story a title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
              <textarea
                name="content"
                required
                rows="12"
                value={formData.content}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all bg-opacity-50 resize-y"
                placeholder="Write your thoughts here..."
              ></textarea>
              <p className="text-xs text-gray-400 mt-2 text-right">
                Please be mindful of our community guidelines.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/articles')}
                className="px-6 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold shadow-md transition-all transform hover:scale-[1.02] active:scale-95 ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  }`}
              >
                {loading ? 'Publishing...' : 'Publish Story'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
