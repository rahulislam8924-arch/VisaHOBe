import React, { useEffect, useRef, useState } from 'react';
import type { PortalNotification } from '../../lib/portalTypes';
import { formatDateTime } from '../../lib/portalTypes';

interface NotificationsBellProps {
  notifications: PortalNotification[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
  onOpenApplication: (applicationId: string) => void;
  onOpenSupport: () => void;
}

const KIND_ICON: Record<string, string> = {
  application: 'description',
  document: 'folder',
  approval: 'fact_check',
  payment: 'payments',
  appointment: 'event',
  support: 'support_agent',
  system: 'info',
};

export const NotificationsBell: React.FC<NotificationsBellProps> = ({
  notifications,
  onMarkAllRead,
  onMarkRead,
  onOpenApplication,
  onOpenSupport,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-full p-2.5 text-[#444746] transition-colors hover:bg-[#001d35]/5 hover:text-[#1f1f1f] cursor-pointer"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        title="Notifications"
      >
        <span className="material-icons text-xl">notifications</span>
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c5221f] px-1 text-[9px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="glass-panel absolute right-0 z-[65] mt-2 w-[22rem] max-w-[90vw] overflow-hidden rounded-2xl text-left">
          <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-2.5">
            <p className="text-sm font-semibold text-[#1f1f1f]">Notifications</p>
            <button
              type="button"
              onClick={onMarkAllRead}
              disabled={unread === 0}
              className="text-[11px] font-semibold text-[#0b57d0] hover:underline disabled:opacity-40 cursor-pointer"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-[#5f6368]">No notifications yet</p>
            ) : (
              notifications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onMarkRead(item.id);
                    if (item.kind === 'support') {
                      onOpenSupport();
                    } else if (item.applicationId) {
                      onOpenApplication(item.applicationId);
                    }
                    setOpen(false);
                  }}
                  className={`flex w-full items-start gap-2.5 border-b border-black/[0.04] px-4 py-2.5 text-left transition-colors hover:bg-neutral-50 cursor-pointer ${
                    item.read ? '' : 'bg-[#f4f8ff]'
                  }`}
                >
                  <span className="material-icons mt-0.5 text-base text-[#0b57d0]">
                    {KIND_ICON[item.kind] ?? 'notifications'}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[12px] font-semibold text-[#1f1f1f]">
                        {item.title}
                      </span>
                      {!item.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b57d0]" />}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-[#5f6368]">
                      {item.body}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-[#9aa0a6]">
                      {formatDateTime(item.at)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="bg-white/70 px-4 py-2 text-[10.5px] leading-relaxed text-[#5f6368]">
            E-mail, SMS and WhatsApp delivery are prepared but disabled in preview mode — nothing
            leaves the browser.
          </div>
        </div>
      )}
    </div>
  );
};
