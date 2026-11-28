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
import { AddCardModal, CardItem } from './AddCardModal';
import {
  INITIAL_CARDS,
  INITIAL_PASSES,
  INITIAL_TRANSACTIONS,
  DashboardPassItem,
} from '../../data/dashboardMockData';

interface GoogleWalletDashboardProps {
  onExit: () => void;
  initialTab?: DashboardTab;
}

export const GoogleWalletDashboard: React.FC<GoogleWalletDashboardProps> = ({
  onExit,
  initialTab = 'home',
}) => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>(initialTab);

  // Live state
  const [cards, setCards] = useState<CardItem[]>(INITIAL_CARDS);
  const [passes] = useState<DashboardPassItem[]>(INITIAL_PASSES);
  const [transactions] = useState<TransactionData[]>(INITIAL_TRANSACTIONS);

  // Modals state
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState<DashboardPassItem | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);

  const handleAddCard = (newCard: CardItem) => {
    if (newCard.isDefault) {
      setCards((prev) => [
        newCard,
        ...prev.map((c) => ({ ...c, isDefault: false })),
      ]);
    } else {
      setCards((prev) => [...prev, newCard]);
    }
  };

  const handleSetDefault = (id: string) => {
    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        isDefault: c.id === id,
      }))
    );
  };

  const handleRemoveCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleRenameCard = (id: string, nickname: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, nickname: nickname.trim() || c.nickname } : c))
    );
  };

  return (
    <>
      <DashboardLayout
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onExitDashboard={onExit}
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
            onSetDefault={handleSetDefault}
            onRemoveCard={handleRemoveCard}
            onRenameCard={handleRenameCard}
            onOpenTransactions={() => setCurrentTab('transactions')}
          />
        )}

        {currentTab === 'passes' && (
          <DashboardPasses
            passes={passes}
            onSelectPass={setSelectedPass}
          />
        )}

        {currentTab === 'transactions' && (
          <DashboardTransactions
            transactions={transactions}
            onSelectTransaction={setSelectedTransaction}
          />
        )}

        {currentTab === 'settings' && <DashboardSettings />}
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
      />

      {/* Add Payment Method Modal */}
      <AddCardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onAddCard={handleAddCard}
      />
    </>
  );
};
