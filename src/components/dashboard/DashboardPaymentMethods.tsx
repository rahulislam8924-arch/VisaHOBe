import React, { useState } from 'react';
import { CardItem } from './AddCardModal';

interface DashboardPaymentMethodsProps {
  cards: CardItem[];
  onOpenAddCard: () => void;
  onSetDefault: (id: string) => void;
  onRemoveCard: (id: string) => void;
  onRenameCard: (id: string, nickname: string) => void;
}

export const DashboardPaymentMethods: React.FC<DashboardPaymentMethodsProps> = ({
  cards,
  onOpenAddCard,
  onSetDefault,
  onRemoveCard,
  onRenameCard,
}) => {
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editedNickname, setEditedNickname] = useState('');

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
            Consular Payment Methods
          </h2>
          <p className="text-sm text-[#444746] leading-relaxed max-w-xl">
            Cards saved to your VisaHOBe account are used to settle official embassy application
            fees, DS-160 MRV charges, and biometric appointments.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddCard}
          className="self-start sm:self-auto bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-xs active:scale-[0.98] inline-flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span className="material-icons text-lg">add</span>
          <span>Add consular payment card</span>
        </button>
      </div>

      {/* Cards List in Material 3 container */}
      <div className="glass-flat glass-sheen rounded-[28px] p-6 sm:p-8 shadow-xs  space-y-6">
        <div className="space-y-4 divide-y divide-neutral-100">
          {cards.map((card, idx) => {
            const isEditing = editingCardId === card.id;
            return (
              <div
                key={card.id}
                className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
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
                      alert(
                        `Cardholder: ${card.cardholderName}\nNumber: •••• ${card.lastFour}\nExp: ${card.expMonth}/${card.expYear}\nSecurity: Verified for consular payment processing.`
                      )
                    }
                    className="px-4 py-2 text-xs font-medium text-[#444746] hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          `Remove ${card.nickname}? This card will no longer be available for visa fee settlement.`
                        )
                      ) {
                        onRemoveCard(card.id);
                      }
                    }}
                    className="px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
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
