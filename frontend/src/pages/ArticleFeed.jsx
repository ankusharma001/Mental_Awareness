import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import ArticleCard from '../components/ArticleCard';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function ArticleFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(null);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    // Fetch articles from real API
    api.articles.getAll()
      .then(data => setArticles(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (articleId) => {
    setLikeLoading(articleId);
    try {
      const updatedLikes = await api.articles.like(articleId);
      if (Array.isArray(updatedLikes)) {
        setArticles(articles => articles.map(a => a._id === articleId ? {
          ...a,
          likes: updatedLikes
        } : a));
      } else {
        toast.error('Unexpected response from server');
      }
    } catch (err) {
      toast.error('Like action failed');
    } finally {
      setLikeLoading(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Community Voices
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Share your story, find support</p>
        </div>
        <Link
          to="/create-article"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transform active:scale-95 transition-all text-sm"
        >
          Share Story
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No stories shared yet.</p>
          <Link to="/create-article" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Be the first to share
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map(article => (
            <ArticleCard
              key={article._id}
              article={article}
              userId={userId}
              onLike={handleLike}
              likeLoading={likeLoading === article._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
