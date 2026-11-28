import React from 'react';
import { iconButtonClass, cn } from '../ui';
import { useToast } from './PortalToast';

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

/** Stable FNV-1a hash so the same pass always renders the same code */
const hashString = (value: string) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const makeRandom = (seedValue: number) => {
  let seed = seedValue || 1;
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
};

/** Bar widths derived from the application / appointment code itself */
const buildBars = (value: string) => {
  const random = makeRandom(hashString(value || 'visahobe'));
  return Array.from({ length: 52 }, (_, index) => ({
    width: 1 + Math.floor(random() * 3),
    visible: index % 2 === 0,
  }));
};

const QR_SIZE = 21;

const isFinder = (x: number, y: number) =>
  (x < 7 && y < 7) || (x >= QR_SIZE - 7 && y < 7) || (x < 7 && y >= QR_SIZE - 7);

/** Deterministic 21x21 data grid derived from the pass code */
const buildQrModules = (value: string) => {
  const random = makeRandom(hashString(value || 'visahobe'));
  const modules: { x: number; y: number }[] = [];
  for (let y = 0; y < QR_SIZE; y += 1) {
    for (let x = 0; x < QR_SIZE; x += 1) {
      if (isFinder(x, y)) continue;
      const roll = random();
      // keep the timing rows/cols readable
      if (y === 6 || x === 6) {
        if ((x + y) % 2 === 0) modules.push({ x, y });
        continue;
      }
      if (roll > 0.62) modules.push({ x, y });
    }
  }
  return modules;
};

const FinderPattern: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x} y={y} width="7" height="7" fill="#000" />
    <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
    <rect x={x + 2} y={y + 2} width="3" height="3" fill="#000" />
  </g>
);

export const BarcodeModal: React.FC<BarcodeModalProps> = ({ isOpen, onClose, pass }) => {
  const { notify } = useToast();

  if (!isOpen || !pass) return null;

  const bars = buildBars(pass.codeValue);
  const qrModules = buildQrModules(pass.codeValue);

  const copyCode = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(pass.codeValue).catch(() => {});
    }
    notify('Consular code copied');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="glass-panel relative flex w-full max-w-sm flex-col items-center overflow-hidden rounded-[28px] p-6 text-center sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={cn(iconButtonClass(), 'absolute right-3 top-3')}
          aria-label="Close"
        >
          <span className="material-icons text-xl">close</span>
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
        <div className="w-full bg-white border border-neutral-200 rounded-2xl p-5 mb-4 flex flex-col items-center justify-center shadow-inner">
          {pass.codeType === 'barcode' ? (
            <div className="flex flex-col items-center w-full">
              <div
                className="w-full h-20 flex items-stretch justify-center gap-[2px] px-2 overflow-hidden"
                role="img"
                aria-label={`Barcode ${pass.codeValue}`}
              >
                {bars.map((bar, idx) => (
                  <div
                    key={idx}
                    className={bar.visible ? 'bg-black' : 'bg-transparent'}
                    style={{ width: `${bar.width * 2}px` }}
                  />
                ))}
              </div>
              <p className="mt-3 font-mono text-sm tracking-widest text-neutral-800 font-semibold">
                {pass.codeValue}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-44 h-44"
                viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
                role="img"
                aria-label={`QR code ${pass.codeValue}`}
                shapeRendering="crispEdges"
              >
                <rect x="0" y="0" width={QR_SIZE} height={QR_SIZE} fill="#fff" />
                <FinderPattern x={0} y={0} />
                <FinderPattern x={QR_SIZE - 7} y={0} />
                <FinderPattern x={0} y={QR_SIZE - 7} />
                {qrModules.map((module, index) => (
                  <rect
                    key={index}
                    x={module.x}
                    y={module.y}
                    width="1"
                    height="1"
                    fill="#000"
                  />
                ))}
              </svg>
              <p className="mt-3 font-mono text-xs tracking-wider text-neutral-600">
                {pass.codeValue}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={copyCode}
          className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-[#0b57d0] ring-1 ring-black/[0.06] transition-colors hover:bg-white cursor-pointer"
        >
          <span className="material-icons text-sm">content_copy</span>
          <span>Copy reference code</span>
        </button>

        {/* Extra Details */}
        {pass.extraDetails && pass.extraDetails.length > 0 && (
          <div className="w-full space-y-2 mb-6 border-t border-neutral-100 pt-4 text-left">
            {pass.extraDetails.map((detail, i) => (
              <div key={i} className="flex justify-between text-xs gap-4">
                <span className="text-neutral-500">{detail.label}</span>
                <span className="font-semibold text-neutral-800 text-right">{detail.value}</span>
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
