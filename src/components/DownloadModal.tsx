import React, { useEffect } from 'react';
import { iconButtonClass, cn } from './ui';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-black/5 flex flex-col items-center text-center transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={cn(iconButtonClass(), 'absolute right-3 top-3')}
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <use href="#close" />
          </svg>
        </button>

        {/* VisaHOBe Icon */}
        <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-2xl bg-[#e8f0fe] p-2 border border-[#d2e3fc]">
          <span className="material-icons text-[#0b57d0] text-3xl">verified_user</span>
        </div>

        <h3 id="download-modal-title" className="text-2xl font-bold text-[#202124] mb-2">
          Get VisaHOBe App
        </h3>
        <p className="text-sm text-[#5f6368] mb-6 max-w-xs leading-relaxed">
          Scan the QR code with your phone camera to download the VisaHOBe App for Android or iOS.
          Organize e-Visas, track passport returns, and receive real-time embassy milestone updates.
        </p>

        {/* QR Code Container */}
        <div className="relative p-3 bg-white rounded-2xl border-2 border-neutral-100 shadow-inner mb-6">
          <div className="w-48 h-48 relative">
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
        </div>

        {/* App Store Links */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <a
            href="https://play.google.com/store/search?q=VisaHOBe&c=apps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#202124] hover:bg-black text-white text-xs font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <use href="#google-play" />
            </svg>
            <span>Google Play</span>
          </a>

          <a
            href="https://apps.apple.com/us/search?term=VisaHOBe"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            <span className="material-icons text-base">phone_iphone</span>
            <span>App Store (iOS)</span>
          </a>
        </div>

        <p className="mt-4 text-[11px] text-neutral-400">
          VisaHOBe PTE. LTD. • Independent global visa assistance & application support portal.
        </p>
      </div>
    </div>
  );
};
