import React, { useState } from 'react';
import { DashboardLayout, DashboardTab } from './DashboardLayout';
import { DashboardHome } from './DashboardHome';
import { DashboardAgent } from './DashboardAgent';
import { DashboardApplications } from './DashboardApplications';
import { DashboardPayments } from './DashboardPayments';
import { DashboardTransactions } from './DashboardTransactions';
import { DashboardSettings } from './DashboardSettings';
import { AddCardModal } from './AddCardModal';
import { TransactionReceiptModal, TransactionData } from './TransactionReceiptModal';
import { SupportPanel } from './SupportPanel';
import { PortalErrorBoundary } from './PortalErrorBoundary';
import { ToastProvider, useToast } from './PortalToast';
import type { TabId } from './ApplicationDetail';
import { usePortalState } from '../../lib/portalStore';

interface GoogleWalletDashboardProps {
  onExit: () => void;
  initialTab?: DashboardTab;
}

const PortalBody: React.FC<GoogleWalletDashboardProps> = ({ onExit, initialTab = 'home' }) => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>(initialTab);
  const { state, actions } = usePortalState();
  const { notify } = useToast();

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportApplicationId, setSupportApplicationId] = useState<string | undefined>(undefined);
  const [openApplicationId, setOpenApplicationId] = useState<string | null>(null);
  const [openApplicationTab, setOpenApplicationTab] = useState<TabId>('overview');

  const openSupport = (applicationId?: string) => {
    setSupportApplicationId(applicationId);
    setSupportOpen(true);
  };

  const openApplication = (id: string, tab: TabId = 'overview') => {
    setOpenApplicationId(id);
    setOpenApplicationTab(tab);
    setCurrentTab('applications');
  };

  return (
    <>
      <DashboardLayout
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'applications') setOpenApplicationId(null);
          setCurrentTab(tab);
        }}
        onExitDashboard={onExit}
        profile={state.profile}
        notifications={state.notifications}
        onMarkAllNotificationsRead={actions.markAllNotificationsRead}
        onMarkNotificationRead={actions.markNotificationRead}
        onOpenNotificationApplication={(id) => openApplication(id)}
        onOpenSupport={() => openSupport()}
      >
        <PortalErrorBoundary>
        {currentTab === 'home' && (
          <DashboardHome
            state={state}
            onNavigateTab={setCurrentTab}
            onOpenApplication={openApplication}
            onOpenSupport={() => openSupport()}
            isDemoData={state.recordsSource === 'demo'}
            onDismissDemo={() => {
              actions.dismissDemoRecords();
              notify('Demo flag cleared — records kept', 'info');
            }}
            onClearDemoRecords={() => {
              actions.clearPortalRecords();
              notify('Demo records cleared', 'info');
            }}
          />
        )}

        {currentTab === 'agent' && (
          <DashboardAgent
            state={state}
            onCreateApplication={(input) => actions.createApplication(input)}
            onOpenApplication={(id) => openApplication(id, 'documents')}
            onOpenSupport={() => openSupport()}
          />
        )}

        {currentTab === 'applications' && (
          <DashboardApplications
            state={state}
            actions={actions}
            onOpenSupport={(applicationId) => openSupport(applicationId)}
            openApplicationId={openApplicationId}
            openApplicationTab={openApplicationTab}
            onOpenApplication={setOpenApplicationId}
            onStartApplication={() => setCurrentTab('agent')}
          />
        )}

        {currentTab === 'payments' && (
          <DashboardPayments
            state={state}
            actions={actions}
            onOpenAddCard={() => setIsAddCardOpen(true)}
            onOpenTransactions={() => setCurrentTab('transactions')}
            onOpenApplication={(id) => openApplication(id, 'payment')}
            onOpenSupport={() => openSupport()}
          />
        )}

        {currentTab === 'transactions' && (
          <DashboardTransactions
            transactions={state.transactions}
            onSelectTransaction={setSelectedTransaction}
          />
        )}

        {currentTab === 'settings' && (
          <DashboardSettings
            state={state}
            actions={actions}
            onOpenSupport={() => openSupport()}
            onResetPortalData={() => {
              actions.resetPortalData();
              notify('Demo records loaded');
            }}
            onClearPortalRecords={() => {
              actions.clearPortalRecords();
              notify('All records cleared', 'info');
            }}
          />
        )}
        </PortalErrorBoundary>
      </DashboardLayout>

      <TransactionReceiptModal
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
        profile={state.profile}
      />

      <AddCardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onAddCard={(card) => {
          actions.addCard(card);
          notify(`${card.network} •••• ${card.lastFour} added`);
        }}
      />

      <SupportPanel
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        state={state}
        actions={actions}
        applicationId={supportApplicationId}
      />
    </>
  );
};

export const GoogleWalletDashboard: React.FC<GoogleWalletDashboardProps> = (props) => (
  <ToastProvider>
    <PortalBody {...props} />
  </ToastProvider>
);
