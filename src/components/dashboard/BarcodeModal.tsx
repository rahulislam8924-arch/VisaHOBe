import React from 'react';

interface BarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pass: {
    id: string;
    title: string;
    issuer: string;
    codeType: 'barcode' | 'qrcode';
    codeValue: string;
    seatOrNumber?: string;
    extraDetails?: { label: string; value: string }[];
    bgColor?: string;
    icon?: string;
  } | null;
}

export const BarcodeModal: React.FC<BarcodeModalProps> = ({ isOpen, onClose, pass }) => {
  if (!isOpen || !pass) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl relative border border-black/10 flex flex-col items-center text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <use href="#close" />
          </svg>
        </button>

        {/* Pass Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="material-icons text-blue-600 text-xl">
            {pass.icon || 'confirmation_number'}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {pass.issuer}
          </span>
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-1">{pass.title}</h3>
        {pass.seatOrNumber && (
          <p className="text-sm font-medium text-neutral-600 mb-6">{pass.seatOrNumber}</p>
        )}

        {/* Barcode or QR Code Box */}
        <div className="w-full bg-white border border-neutral-200 rounded-2xl p-5 mb-6 flex flex-col items-center justify-center shadow-inner">
          {pass.codeType === 'barcode' ? (
            <div className="flex flex-col items-center w-full">
              {/* Simulated high fidelity SVG Barcode */}
              <div className="w-full h-20 flex items-stretch justify-center gap-[2.5px] px-2 overflow-hidden">
                {[
                  3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2,
                  1, 3, 2, 1, 4, 1, 2, 3, 2, 1, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2,
                ].map((width, idx) => (
                  <div
                    key={idx}
                    className="bg-black"
                    style={{
                      width: `${width * 2}px`,
                      opacity: idx % 2 === 0 ? 1 : 0,
                    }}
                  />
                ))}
              </div>
              <p className="mt-3 font-mono text-sm tracking-widest text-neutral-800 font-semibold">
                {pass.codeValue}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {/* SVG QR Code Simulation */}
              <svg className="w-44 h-44" viewBox="0 0 100 100">
                {/* QR Finder patterns */}
                <rect x="5" y="5" width="26" height="26" rx="2" fill="none" stroke="#000" strokeWidth="6" />
                <rect x="12" y="12" width="12" height="12" fill="#000" />

                <rect x="69" y="5" width="26" height="26" rx="2" fill="none" stroke="#000" strokeWidth="6" />
                <rect x="76" y="12" width="12" height="12" fill="#000" />

                <rect x="5" y="69" width="26" height="26" rx="2" fill="none" stroke="#000" strokeWidth="6" />
                <rect x="12" y="76" width="12" height="12" fill="#000" />

                {/* Data modules */}
                <rect x="36" y="8" width="5" height="5" fill="#000" />
                <rect x="46" y="8" width="5" height="5" fill="#000" />
                <rect x="56" y="8" width="5" height="5" fill="#000" />
                <rect x="36" y="18" width="5" height="5" fill="#000" />
                <rect x="51" y="18" width="5" height="5" fill="#000" />

                <rect x="8" y="36" width="5" height="5" fill="#000" />
                <rect x="18" y="46" width="5" height="5" fill="#000" />
                <rect x="23" y="36" width="5" height="5" fill="#000" />

                <rect x="36" y="36" width="7" height="7" fill="#000" />
                <rect x="48" y="36" width="7" height="7" fill="#000" />
                <rect x="60" y="36" width="7" height="7" fill="#000" />
                <rect x="36" y="48" width="7" height="7" fill="#000" />
                <rect x="48" y="48" width="7" height="7" fill="#000" />
                <rect x="60" y="48" width="7" height="7" fill="#000" />

                <rect x="69" y="46" width="6" height="6" fill="#000" />
                <rect x="82" y="38" width="6" height="6" fill="#000" />
                <rect x="76" y="58" width="6" height="6" fill="#000" />
                <rect x="88" y="52" width="6" height="6" fill="#000" />

                <rect x="36" y="69" width="6" height="6" fill="#000" />
                <rect x="48" y="75" width="6" height="6" fill="#000" />
                <rect x="60" y="82" width="6" height="6" fill="#000" />
                <rect x="75" y="75" width="6" height="6" fill="#000" />
                <rect x="85" y="85" width="6" height="6" fill="#000" />
              </svg>
              <p className="mt-3 font-mono text-xs tracking-wider text-neutral-600">
                {pass.codeValue}
              </p>
            </div>
          )}
        </div>

        {/* Extra Details */}
        {pass.extraDetails && pass.extraDetails.length > 0 && (
          <div className="w-full space-y-2 mb-6 border-t border-neutral-100 pt-4 text-left">
            {pass.extraDetails.map((detail, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-neutral-500">{detail.label}</span>
                <span className="font-semibold text-neutral-800">{detail.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="w-full flex items-center justify-center gap-1.5 text-xs text-neutral-500">
          <span className="material-icons text-sm text-green-600">verified</span>
          <span>Verified Consular Travel Pass • VisaHOBe</span>
        </div>
      </div>
    </div>
  );
};
