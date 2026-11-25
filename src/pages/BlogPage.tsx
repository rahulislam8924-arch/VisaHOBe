import React, { useState, useMemo } from 'react';
import { BLOG_POSTS, BlogPost } from '../data/visahobeData';
import { Button, FilterChip, SearchInput } from '../components/ui';

interface BlogPageProps {
  onBookConsultation: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBookConsultation }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const categories = ['all', 'Document Guides', 'Embassy Tips', 'Work & Overseas', 'Refusal Analysis'];

  const filtered = useMemo(() => {
    return BLOG_POSTS.filter((p) => {
      const query = search.toLowerCase().trim();
      const matchesSearch =
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left space-y-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 shadow-2xs">
          <span className="material-icons text-blue-600 text-sm">menu_book</span>
          <span className="text-xs font-semibold text-[#1f1f1f] tracking-wide">
            Visa Guides, Checklists & Consular Research Desk
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#202124] tracking-tight">
          Visa Guides & Insights
        </h1>
        <p className="text-base sm:text-lg text-[#5f6368] leading-relaxed">
          Expert articles on bank statement assessment, avoiding DS-160 mistakes, Schengen travel
          itineraries, UKVI genuine visitor tests, and safe overseas employment procedures.
        </p>
      </div>

      {/* Search and category filters */}
      <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search guides, clauses, checklists…"
          label="Article search"
          className="sm:w-80"
        />

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {categories.map((cat) => (
            <FilterChip
              key={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All guides' : cat}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Articles Grid with Editorial Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <article
            key={post.id}
            onClick={() => setActiveArticle(post)}
            className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c2d7f5] hover:shadow-[0_18px_40px_-30px_rgba(60,64,67,0.6)]"
          >
            {/* Editorial Image Header */}
            {post.imageUrl && (
              <div className="w-full h-44 overflow-hidden relative bg-neutral-100">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-[#001d35] px-2.5 py-1 rounded-full shadow-2xs">
                  {post.category}
                </span>
                <span className="absolute bottom-3 left-3 text-xs text-white/95 font-medium flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  <span className="material-icons text-xs">schedule</span>
                  <span>{post.readTime}</span>
                </span>
              </div>
            )}

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs text-[#5f6368] leading-relaxed line-clamp-3">
                  {post.summary}
                </p>

                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Key Points:
                  </p>
                  <ul className="space-y-1 text-xs text-neutral-600">
                    {post.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="material-icons text-blue-500 text-xs mt-0.5">check</span>
                        <span className="line-clamp-1">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-neutral-500">
                <span className="truncate max-w-[140px]">{post.author}</span>
                <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-1 shrink-0">
                  <span>Read Guide</span>
                  <span className="material-icons text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-black/10 max-h-[90vh] overflow-y-auto space-y-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full cursor-pointer"
              aria-label="Close article"
            >
              <span className="material-icons text-xl">close</span>
            </button>

            {/* Modal Image Banner */}
            {activeArticle.imageUrl && (
              <div className="w-full h-48 rounded-2xl overflow-hidden relative">
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                  {activeArticle.category}
                </span>
              </div>
            )}

            <div className="space-y-2 pr-8">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                {activeArticle.category} • {activeArticle.readTime}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] leading-tight">
                {activeArticle.title}
              </h2>
              <p className="text-xs text-neutral-500">
                Published by {activeArticle.author} • {activeArticle.date}
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="p-4 rounded-2xl bg-[#e8f0fe] border border-[#d2e3fc] space-y-2">
              <p className="text-xs font-bold text-[#001d35] uppercase tracking-wider">
                Summary & Key Takeaways
              </p>
              <ul className="space-y-1.5 text-xs text-[#001d35]">
                {activeArticle.keyTakeaways.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="material-icons text-blue-600 text-sm mt-0.5">verified</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Body */}
            <div className="text-sm text-[#3c4043] leading-relaxed whitespace-pre-line space-y-4">
              {activeArticle.content}
            </div>

            {/* Footer */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100">
              <p className="text-xs text-neutral-500 max-w-sm">
                Visa guidelines change frequently. Always confirm your file with current official embassy circulars.
              </p>
              <Button
                variant="primary"
                size="md"
                leadingIcon="calendar_month"
                onClick={() => {
                  setActiveArticle(null);
                  onBookConsultation();
                }}
                className="w-full sm:w-auto"
              >
                Book a Consultation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
