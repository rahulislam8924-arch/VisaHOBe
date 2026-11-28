import React, { useState } from 'react';
import { DashboardLayout, DashboardTab } from './DashboardLayout';
import { DashboardHome } from './DashboardHome';
import { DashboardPaymentMethods } from './DashboardPaymentMethods';
import { DashboardPasses } from './DashboardPasses';
import { DashboardTransactions } from './DashboardTransactions';
import { DashboardSettings } from './DashboardSettings';
import { DashboardAgent } from './DashboardAgent';
import { BarcodeModal } from './BarcodeModal';
import { TransactionReceiptModal, TransactionData } from './TransactionReceiptModal';
import { AddCardModal } from './AddCardModal';
import { ToastProvider, useToast } from './PortalToast';
import { usePortalState } from '../../lib/portalStore';
import type { DashboardPassItem } from '../../data/dashboardMockData';

interface GoogleWalletDashboardProps {
  onExit: () => void;
  initialTab?: DashboardTab;
}

const PortalBody: React.FC<GoogleWalletDashboardProps> = ({ onExit, initialTab = 'home' }) => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>(initialTab);
  const { state, actions } = usePortalState();
  const { notify } = useToast();

  const { cards, passes, transactions, profile, preferences } = state;

  // Modals state
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState<DashboardPassItem | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);

  return (
    <>
      <DashboardLayout
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onExitDashboard={onExit}
        profile={profile}
      >
        {currentTab === 'home' && (
          <DashboardHome
            cards={cards}
            passes={passes}
            transactions={transactions}
            onNavigateTab={setCurrentTab}
            onOpenAddCard={() => setIsAddCardOpen(true)}
            onSelectPass={setSelectedPass}
            onSelectTransaction={setSelectedTransaction}
          />
        )}

        {currentTab === 'agent' && (
          <DashboardAgent
            passes={passes}
            transactions={transactions}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'paymentmethods' && (
          <DashboardPaymentMethods
            cards={cards}
            onOpenAddCard={() => setIsAddCardOpen(true)}
            onSetDefault={(id) => {
              actions.setDefaultCard(id);
              notify('Default consular card updated');
            }}
            onRemoveCard={(id) => {
              actions.removeCard(id);
              notify('Payment card removed');
            }}
            onRenameCard={(id, nickname) => {
              actions.renameCard(id, nickname);
              notify('Card nickname saved');
            }}
            onOpenTransactions={() => setCurrentTab('transactions')}
          />
        )}

        {currentTab === 'passes' && <DashboardPasses passes={passes} onSelectPass={setSelectedPass} />}

        {currentTab === 'transactions' && (
          <DashboardTransactions
            transactions={transactions}
            onSelectTransaction={setSelectedTransaction}
          />
        )}

        {currentTab === 'settings' && (
          <DashboardSettings
            profile={profile}
            preferences={preferences}
            onUpdateProfile={actions.updateProfile}
            onUpdatePreference={actions.updatePreference}
            onResetPortalData={() => {
              actions.resetPortalData();
              notify('Portal data reset to the sample file');
            }}
          />
        )}
      </DashboardLayout>

      {/* Barcode / QR Code Modal */}
      <BarcodeModal
        isOpen={Boolean(selectedPass)}
        onClose={() => setSelectedPass(null)}
        pass={selectedPass}
      />

      {/* Transaction Details Modal */}
      <TransactionReceiptModal
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
        profile={profile}
      />

      {/* Add Payment Method Modal */}
      <AddCardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onAddCard={(card) => {
          actions.addCard(card);
          notify(`${card.network} •••• ${card.lastFour} added to your account`);
        }}
      />
    </>
  );
};

export const GoogleWalletDashboard: React.FC<GoogleWalletDashboardProps> = (props) => (
  <ToastProvider>
    <PortalBody {...props} />
  </ToastProvider>
);
