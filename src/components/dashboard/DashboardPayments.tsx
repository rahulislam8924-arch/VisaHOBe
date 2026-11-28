import React, { useMemo, useState } from 'react';
import type { PortalActions, PortalState } from '../../lib/portalStore';
import { formatMoney, totalFees, type VisaApplication } from '../../lib/portalTypes';
import { formatUsd } from '../../lib/portalMetrics';
import { useToast } from './PortalToast';
import {
  EmptyState,
  InfoRow,
  Modal,
  ghostButton,
  primaryButton,
  secondaryButton,
} from './portalUi';

interface DashboardPaymentsProps {
  state: PortalState;
  actions: PortalActions;
  onOpenAddCard: () => void;
  onOpenTransactions: () => void;
  onOpenApplication: (id: string) => void;
  onOpenSupport: () => void;
}

export const DashboardPayments: React.FC<DashboardPaymentsProps> = ({
  state,
  actions,
  onOpenAddCard,
  onOpenTransactions,
  onOpenApplication,
  onOpenSupport,
}) => {
  const { notify } = useToast();
  const [invoice, setInvoice] = useState<VisaApplication | null>(null);
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);

  const totals = useMemo(() => {
    const sum = state.applications.reduce(
      (acc, app) => ({
        agency: acc.agency + app.fees.agency,
        government: acc.government + app.fees.government,
        embassy: acc.embassy + app.fees.embassy,
        additional: acc.additional + app.fees.additional,
        total: acc.total + totalFees(app.fees),
      }),
      { agency: 0, government: 0, embassy: 0, additional: 0, total: 0 }
    );
    const paid = state.transactions
      .filter((tx) => tx.status !== 'Declined')
      .reduce((value, tx) => value + Math.abs(tx.amount), 0);
    return { ...sum, paid, outstanding: Math.max(0, sum.total - paid) };
  }, [state.applications, state.transactions]);

  const applicationPaid = (app: VisaApplication) => {
    const share =
      totals.total === 0 ? 0 : (totalFees(app.fees) / totals.total) * totals.paid;
    return Math.min(totalFees(app.fees), Math.round(share * 100) / 100);
  };

  return (
    <div className="max-w-5xl space-y-5 animate-in fade-in text-left duration-300">
      <div className="flex flex-col justify-between gap-3 pb-1 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <h2 className="font-['Google_Sans',Roboto,sans-serif] text-3xl font-normal text-[#1f1f1f] sm:text-4xl">
            Payments
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-[#444746]">
            Fee estimates, invoices and settlement for your applications. The payment gateway is
            prepared but disabled in preview mode — no real charge is ever made.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={secondaryButton} onClick={onOpenTransactions}>
            <span className="material-icons text-sm">receipt_long</span>
            Payment history
          </button>
          <button type="button" className={primaryButton} onClick={onOpenAddCard}>
            <span className="material-icons text-sm">add</span>
            Add card
          </button>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {[
          { label: 'Total estimated', value: formatUsd(totals.total), icon: 'request_quote' },
          { label: 'Agency service fees', value: formatUsd(totals.agency), icon: 'badge' },
          { label: 'Government & embassy', value: formatUsd(totals.government + totals.embassy), icon: 'account_balance' },
          { label: 'Outstanding', value: formatUsd(totals.outstanding), icon: 'pending_actions' },
        ].map((tile) => (
          <div key={tile.label} className="glass-flat glass-sheen rounded-2xl p-3.5 shadow-xs">
            <span className="material-icons text-lg text-[#0b57d0]">{tile.icon}</span>
            <p className="mt-1 text-lg font-semibold text-[#1f1f1f]">{tile.value}</p>
            <p className="text-[11px] text-[#5f6368]">{tile.label}</p>
          </div>
        ))}
      </div>

      {/* Invoices */}
      <section className="glass-flat glass-sheen space-y-3 rounded-[28px] p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
              Invoices by application
            </h3>
            <p className="text-[11px] text-[#5f6368]">
              Agency fee + government fee + visa centre fee + additional services
            </p>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[10.5px] font-medium text-[#5f6368] ring-1 ring-black/[0.06]">
            {state.applications.length} invoice{state.applications.length === 1 ? '' : 's'}
          </span>
        </div>

        {state.applications.length === 0 ? (
          <EmptyState
            icon="request_quote"
            title="No invoices yet"
            body="An invoice estimate is created automatically when the AI agent prepares an application."
          />
        ) : (
          <div className="divide-y divide-neutral-100">
            {state.applications.map((app) => {
              const total = totalFees(app.fees);
              const paid = applicationPaid(app);
              return (
                <div
                  key={app.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-neutral-900">
                      {app.destination} · {app.visaType}
                    </p>
                    <p className="text-[10.5px] text-[#5f6368]">
                      <span className="font-mono">{app.id}</span> · agency{' '}
                      {formatMoney(app.fees.agency)} · government {formatMoney(app.fees.government)} ·
                      centre {formatMoney(app.fees.embassy)} · extras{' '}
                      {formatMoney(app.fees.additional)}
                    </p>
                    <p className="text-[10.5px] text-[#5f6368]">
                      Paid {formatMoney(paid)} · outstanding {formatMoney(Math.max(0, total - paid))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-900">
                      {formatMoney(total)}
                    </span>
                    <button type="button" className={ghostButton} onClick={() => setInvoice(app)}>
                      Invoice
                    </button>
                    <button
                      type="button"
                      className={ghostButton}
                      onClick={() => onOpenApplication(app.id)}
                    >
                      Open
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Cards + refund */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <section className="glass-flat glass-sheen space-y-3 rounded-[28px] p-5 shadow-xs lg:col-span-7">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
              Saved cards ({state.cards.length})
            </h3>
            <button type="button" className={secondaryButton} onClick={onOpenAddCard}>
              Add card
            </button>
          </div>

          {state.cards.length === 0 ? (
            <EmptyState
              icon="credit_card"
              title="No payment card saved"
              body="Add a card to settle embassy fees in one step."
              action={
                <button type="button" className={primaryButton} onClick={onOpenAddCard}>
                  Add your first card
                </button>
              }
            />
          ) : (
            <div className="space-y-2">
              {state.cards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-2xl border border-neutral-200 bg-white/70 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-11 items-center justify-center rounded-md bg-gradient-to-br ${card.bgGradient} text-[8px] font-bold text-white`}
                      >
                        {card.network}
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-neutral-900">
                          {card.nickname} · •••• {card.lastFour}
                        </p>
                        <p className="text-[10.5px] text-[#5f6368]">
                          {card.cardholderName} · exp {card.expMonth}/{card.expYear}
                          {card.isDefault ? ' · default for visa fees' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!card.isDefault && (
                        <button
                          type="button"
                          className={ghostButton}
                          onClick={() => {
                            actions.setDefaultCard(card.id);
                            notify('Default card updated');
                          }}
                        >
                          Make default
                        </button>
                      )}
                      <button
                        type="button"
                        className="rounded-full px-3 py-1.5 text-[11px] font-medium text-[#c5221f] transition-colors hover:bg-[#fce8e6] cursor-pointer"
                        onClick={() => setPendingRemove(card.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {pendingRemove === card.id && (
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#c5221f]/25 bg-[#fce8e6]/60 p-2.5">
                      <p className="text-[11px] text-[#8c1d18]">
                        Remove this card? It will no longer settle embassy fees.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className={ghostButton}
                          onClick={() => setPendingRemove(null)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="rounded-full bg-[#c5221f] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#a51d1a] cursor-pointer"
                          onClick={() => {
                            actions.removeCard(card.id);
                            setPendingRemove(null);
                            notify('Payment card removed');
                          }}
                        >
                          Remove card
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="glass-flat glass-sheen space-y-2 rounded-[28px] p-5 shadow-xs lg:col-span-5">
          <h3 className="font-['Google_Sans',Roboto,sans-serif] text-lg font-medium text-[#1f1f1f]">
            Refunds & receipts
          </h3>
          <InfoRow label="Paid to date" value={formatUsd(totals.paid)} />
          <InfoRow label="Receipts on file" value={String(state.transactions.length)} />
          <InfoRow label="Outstanding" value={formatUsd(totals.outstanding)} />
          <p className="text-[11px] leading-relaxed text-[#5f6368]">
            Refunds are handled through a support request: no refund is processed automatically and
            no money moves in preview mode.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              className={secondaryButton}
              onClick={() => {
                if (state.requests.some((request) => request.type === 'refund')) {
                  onOpenSupport();
                  return;
                }
                actions.createSupportTicket(
                  'Payment or refund',
                  'I would like to request a refund review for my consular fees. This is a preview request — no refund is processed.'
                );
                notify('Refund review requested — tracked as a support ticket');
                onOpenSupport();
              }}
            >
              Request refund review
            </button>
            <button type="button" className={ghostButton} onClick={onOpenTransactions}>
              View receipts
            </button>
          </div>
        </section>
      </div>

      {/* Invoice preview modal */}
      <Modal
        open={Boolean(invoice)}
        onClose={() => setInvoice(null)}
        title="Invoice preview"
        size="md"
        subtitle="Preview only — not a tax document and no payment has been taken"
        footer={
          <>
            <button type="button" className={ghostButton} onClick={() => setInvoice(null)}>
              Close
            </button>
            <button
              type="button"
              className={primaryButton}
              onClick={() => {
                notify('Payment gateway disabled in preview mode — no charge made', 'info');
              }}
            >
              <span className="material-icons text-sm">lock</span>
              Pay (disabled)
            </button>
          </>
        }
      >
        {invoice && (
          <div className="space-y-2">
            <InfoRow label="Invoice" value={`INV-${invoice.id}`} mono />
            <InfoRow label="Application" value={invoice.id} mono />
            <InfoRow label="Applicant" value={invoice.applicant.fullName} />
            <InfoRow label="Destination" value={invoice.destination} />
            <InfoRow label="Visa type" value={invoice.visaType} />
            <div className="my-2 border-t border-neutral-200" />
            <InfoRow label="Agency service fee" value={formatMoney(invoice.fees.agency)} />
            <InfoRow label="Government visa fee" value={formatMoney(invoice.fees.government)} />
            <InfoRow label="Embassy / visa centre fee" value={formatMoney(invoice.fees.embassy)} />
            <InfoRow label="Additional services" value={formatMoney(invoice.fees.additional)} />
            <div className="mt-1 flex justify-between border-t border-neutral-200 pt-2 text-sm font-semibold">
              <span>Total</span>
              <span>{formatMoney(totalFees(invoice.fees))}</span>
            </div>
            <p className="pt-2 text-[10.5px] leading-relaxed text-[#5f6368]">
              Fees are configured estimates. Government and embassy charges can change before an
              authorised submission.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
