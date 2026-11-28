import React, { useState } from 'react';
import { FAQ_DATA } from '../data/walletData';

export const FAQSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>(['what-is-visahobe']);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="faqs" className="scroll-mt-[140px] border-t border-black/5 py-16 sm:py-24">
      <div className="max-w-[880px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-semibold tracking-wider text-[#5f6368] uppercase mb-2">
            FAQs
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#202124] tracking-tight">
            Helpful information
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="glass-flat glass-sheen overflow-hidden rounded-2xl transition-all duration-200 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_20px_42px_-28px_rgba(32,33,36,0.4)]"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-medium text-[#202124]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-neutral-100' : 'bg-transparent'
                    }`}
                  >
                    <svg className="w-5 h-5 fill-current text-neutral-600" viewBox="0 0 24 24">
                      <use href="#expand-more" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-[#5f6368] text-base leading-relaxed border-t border-neutral-100">
                    <p className="whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
