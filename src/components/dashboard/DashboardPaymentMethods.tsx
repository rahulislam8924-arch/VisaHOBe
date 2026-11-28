import React, { useState } from 'react';
import { CardItem } from './AddCardModal';
import { useToast } from './PortalToast';

interface DashboardPaymentMethodsProps {
  cards: CardItem[];
  onOpenAddCard: () => void;
  onSetDefault: (id: string) => void;
  onRemoveCard: (id: string) => void;
  onRenameCard: (id: string, nickname: string) => void;
  /** Opens the payment history view that used to sit in the sidebar */
  onOpenTransactions?: () => void;
}

export const DashboardPaymentMethods: React.FC<DashboardPaymentMethodsProps> = ({
  cards,
  onOpenAddCard,
  onSetDefault,
  onRemoveCard,
  onRenameCard,
  onOpenTransactions,
}) => {
  const { notify } = useToast();
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editedNickname, setEditedNickname] = useState('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const handleStartEdit = (card: CardItem) => {
    setEditingCardId(card.id);
    setEditedNickname(card.nickname);
  };

  const handleSaveNickname = (card: CardItem) => {
    onRenameCard(card.id, editedNickname);
    setEditingCardId(null);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl animate-in fade-in duration-300">
      {/* Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h2 className="font-['Google_Sans',Roboto,sans-serif] text-3xl sm:text-4xl font-normal text-[#1f1f1f]">
            Payments
          </h2>
          <p className="text-sm text-[#444746] leading-relaxed max-w-xl">
            Cards saved to your VisaHOBe account are used to settle official embassy application
            fees, DS-160 MRV charges, and biometric appointments.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:self-auto">
          {onOpenTransactions && (
            <button
              type="button"
              onClick={onOpenTransactions}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white/70 px-4 py-2.5 text-sm font-medium text-[#0b57d0] ring-1 ring-black/[0.06] transition-colors hover:bg-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/60"
            >
              <span className="material-icons text-lg">receipt_long</span>
              <span>Payment history</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAddCard}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0b57d0] px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-[#0842a0] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/60"
          >
            <span className="material-icons text-lg">add</span>
            <span>Add consular payment card</span>
          </button>
        </div>
      </div>

      {/* Cards List in Material 3 container */}
      <div className="glass-flat glass-sheen rounded-[28px] p-6 sm:p-8 shadow-xs  space-y-6">
        <div className="space-y-4 divide-y divide-neutral-100">
          {cards.map((card, idx) => {
            const isEditing = editingCardId === card.id;
            return (
              <div
                key={card.id}
                className={`relative flex flex-wrap flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                  idx > 0 ? 'pt-6' : ''
                }`}
              >
                {/* Left Card Visual & Info */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  {/* Realistic Card Chip Graphic */}
                  <div
                    className={`w-16 h-10 rounded-xl bg-gradient-to-br ${card.bgGradient} p-2 flex flex-col justify-between text-white shadow-xs shrink-0 select-none`}
                  >
                    <span className="text-[10px] font-bold tracking-wider">{card.network}</span>
                    <span className="text-[8px] font-mono opacity-80">•••• {card.lastFour}</span>
                  </div>

                  <div className="min-w-0 space-y-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="text"
                          value={editedNickname}
                          onChange={(e) => setEditedNickname(e.target.value)}
                          className="px-3 py-1 rounded-lg border border-blue-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveNickname(card)}
                          className="text-xs bg-[#0b57d0] text-white px-2.5 py-1 rounded-full cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCardId(null)}
                          className="text-xs text-neutral-500 hover:text-black cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h4 className="font-['Google_Sans',Roboto,sans-serif] font-medium text-neutral-900 text-base">
                          {card.nickname}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(card)}
                          className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded-full cursor-pointer"
                          title="Edit nickname"
                        >
                          <span className="material-icons text-sm">edit</span>
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-[#444746] font-mono">
                      {card.network} •••• {card.lastFour} • Exp {card.expMonth}/{card.expYear}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      {card.isDefault ? (
                        <span className="text-[11px] font-medium text-[#0b57d0] bg-[#e8f0fe] px-2.5 py-0.5 rounded-full border border-[#c2e7ff] inline-flex items-center gap-1">
                          <span className="material-icons text-xs">verified</span>
                          Default for embassy visa fees
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSetDefault(card.id)}
                          className="text-[11px] font-medium text-[#0b57d0] hover:underline cursor-pointer"
                        >
                          Set as default for visa fees
                        </button>
                      )}

                      <span className="text-[11px] text-neutral-300">•</span>
                      <span className="text-[11px] text-neutral-500">Tokenized for consular checkouts</span>
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCardId(expandedCardId === card.id ? null : card.id)
                    }
                    aria-expanded={expandedCardId === card.id}
                    className="px-4 py-2 text-xs font-medium text-[#444746] hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                  >
                    {expandedCardId === card.id ? 'Hide details' : 'Details'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingRemoveId(card.id)}
                    className="px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>

                {expandedCardId === card.id && (
                  <div className="mt-3 w-full pt-3 border-t border-neutral-100 md:mt-1 md:w-80 md:rounded-2xl md:border md:border-black/[0.06] md:bg-white md:p-4 md:shadow-lg">
                    <dl className="space-y-1.5 text-xs">
                      <div className="flex justify-between gap-4">
                        <dt className="text-neutral-500">Cardholder</dt>
                        <dd className="font-medium text-neutral-800 text-right">
                          {card.cardholderName}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-neutral-500">Card number</dt>
                        <dd className="font-mono text-neutral-800">
                          {card.network} •••• {card.lastFour}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-neutral-500">Expires</dt>
                        <dd className="font-mono text-neutral-800">
                          {card.expMonth}/{card.expYear}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-neutral-500">Network token</dt>
                        <dd className="font-medium text-emerald-600 flex items-center gap-1">
                          <span className="material-icons text-xs">verified_user</span>
                          Active
                        </dd>
                      </div>
                    </dl>
                    <button
                      type="button"
                      onClick={() => {
                        const text = `${card.network} •••• ${card.lastFour}`;
                        if (navigator.clipboard?.writeText) {
                          navigator.clipboard.writeText(text).catch(() => {});
                        }
                        notify('Card reference copied');
                      }}
                      className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#0b57d0] hover:underline cursor-pointer"
                    >
                      <span className="material-icons text-xs">content_copy</span>
                      Copy card reference
                    </button>
                  </div>
                )}

                {pendingRemoveId === card.id && (
                  <div className="mt-3 flex flex-col items-start justify-between gap-2 rounded-2xl border border-red-200 bg-red-50/70 p-3 sm:flex-row sm:items-center">
                    <p className="text-xs text-red-800">
                      Remove {card.nickname}? It will no longer settle embassy fees.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPendingRemoveId(null)}
                        className="rounded-full px-3 py-1.5 text-xs font-medium text-[#444746] hover:bg-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onRemoveCard(card.id);
                          setPendingRemoveId(null);
                          setExpandedCardId(null);
                        }}
                        className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer"
                      >
                        Remove card
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info footer disclaimer */}
      <div className="p-4 rounded-2xl bg-white/70 border border-black/5 text-xs text-[#444746] leading-relaxed">
        <p>
          Official embassy visa payments are tokenized and processed via authorized consular
          gateways. For your security, your full card number and security code (CVV) are never
          stored unencrypted or shared with unauthorized entities.
        </p>
      </div>
    </div>
  );
};
