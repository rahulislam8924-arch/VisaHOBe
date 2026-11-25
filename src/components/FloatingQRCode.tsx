import React, { useState } from 'react';

interface FloatingQRCodeProps {
  onOpenDownloadModal: () => void;
}

export const FloatingQRCode: React.FC<FloatingQRCodeProps> = ({ onOpenDownloadModal }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className="fixed bottom-6 right-6 z-40 hidden sm:block select-none"
      aria-label="VisaHOBe App Download QR Code"
    >
      <div className="flex items-center gap-2">
        {/* The QR Card */}
        <div
          onClick={onOpenDownloadModal}
          className={`bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-black/5 p-3 flex items-center gap-3 cursor-pointer hover:shadow-[0_6px_22px_rgba(0,0,0,0.2)] hover:scale-[1.02] transition-all duration-300 ${
            isCollapsed ? 'opacity-0 scale-90 pointer-events-none translate-x-8' : 'opacity-100 scale-100'
          }`}
          title="Click to view full download QR Code"
        >
          {/* QR Asset with Google 4-Color Borders */}
          <div className="w-14 h-14 relative shrink-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 68.5 68"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="QR code linking to the VisaHOBe app download page"
            >
              <image href="/visahobe-app-qr.png" height="84%" width="84%" x="8%" y="8%" />
              {/* Top-Left Red */}
              <path
                fill="#EA4335"
                d="M26.5,3.5V0h-13C5.5,0,0,6.5,0,13v13.5h3.5V13c0-7.2,6.7-9.5,10-9.5H26.5z"
              />
              {/* Bottom-Left Blue */}
              <path
                fill="#4285F4"
                d="M26.5,64.5V68h-13C5.5,68,0,61.5,0,55V41.5h3.5V55c0,7.2,6.7,9.5,10,9.5H26.5z"
              />
              {/* Top-Right Yellow */}
              <path
                fill="#FBBC05"
                d="M42,3.5V0h13c8,0,13.5,6.5,13.5,13v13.5H65V13c0-7.2-6.7-9.5-10-9.5H42z"
              />
              {/* Bottom-Right Green */}
              <path
                fill="#34A853"
                d="M42,64.5V68h13c8,0,13.5-6.5,13.5-13V41.5H65V55c0,7.2-6.7,9.5-10,9.5H42z"
              />
            </svg>
          </div>

          <div className="text-left pr-2">
            <p className="text-[13px] font-medium text-[#202124] leading-snug">
              Scan for iOS<br />or Android
            </p>
          </div>
        </div>

        {/* Expand / Collapse Toggle Arrow */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 rounded-full bg-white shadow-md border border-neutral-200/80 hover:bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
          aria-label={isCollapsed ? 'Show QR Code' : 'Hide QR Code'}
        >
          <svg className="w-4 h-4 fill-current transition-transform duration-300" viewBox="0 0 24 24">
            {isCollapsed ? (
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            ) : (
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            )}
          </svg>
        </button>
      </div>
    </aside>
  );
};
