import React, { useState } from 'react';

export default function ArticleCard({ article, onLike, userId, likeLoading }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLiked = userId && article.likes?.includes(userId);
  const wordCount = article.content.trim().split(/\s+/).length;

  return (
    <div className="bg-[#0b141a] dark:bg-[#15202b] border border-[#2d333b] hover:border-[#444c56] transition-all rounded-xl overflow-hidden shadow-lg group">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img
              src={article.author?.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(article.author?.username || 'user')}`}
              alt={article.author?.username}
              className="w-10 h-10 rounded-full border-2 border-indigo-500/30 p-0.5"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0b141a] rounded-full"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-100 group-hover:text-indigo-400 transition-colors">
                {article.author?.username || 'Anonymous'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono uppercase tracking-wider">
                Author
              </span>
            </div>
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Just now'}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-100 mb-3 leading-tight tracking-tight">
          {article.title}
        </h3>

        <div className="text-gray-300 leading-relaxed mb-6 font-light transition-all duration-300">
          {article.content.length > 300 ? (
            <div className="relative">
              <p className={isExpanded ? '' : 'line-clamp-4'}>
                {article.content}
              </p>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm flex items-center gap-1 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <span>Show less</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                  </>
                ) : (
                  <>
                    <span>Read full story</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </>
                )}
              </button>
            </div>
          ) : (
            <p>{article.content}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#2d333b]">
          <div className="flex gap-4">
            <button
              onClick={() => onLike(article._id)}
              disabled={likeLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all transform active:scale-95 ${isLiked
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-transparent'
                }`}
            >
              <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{article.likes?.length || 0}</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-800/50 text-gray-400 border border-transparent">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>{Math.ceil(wordCount / 200)} min read</span>
            </div>
          </div>

          <button className="text-gray-500 hover:text-indigo-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
