import { useState, useEffect } from 'react';
import { Trash2, Mail, Clock, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { contactApi, type AdminContactMessage } from '../../services/adminApi';



export default function ContactPanel() {
  const [items, setItems]     = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = async () => {
    try { const data = await contactApi.getAll(); setItems(data); }
    catch { toast.error('Failed to load messages'); }
    finally { setLoading(false); }
  };
  // Fetch on mount: state is only set after the request resolves.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const toggleExpand = async (msg: AdminContactMessage) => {
    if (expanded === msg.contactMessageId) { setExpanded(null); return; }
    setExpanded(msg.contactMessageId);
    if (!msg.read) {
      try { await contactApi.markRead(msg.contactMessageId); setItems(p => p.map(m => m.contactMessageId === msg.contactMessageId ? { ...m, read: true } : m)); }
      catch { /* silent */ }
    }
  };

  const handleDelete = async (id: number) => {
    const tid = toast.loading('Deleting...');
    try { await contactApi.delete(id); toast.success('Deleted', { id: tid }); setDeleteId(null); if (expanded === id) setExpanded(null); await load(); }
    catch { toast.error('Delete failed', { id: tid }); }
  };

  const unread = items.filter(m => !m.read).length;
  const formatDate = (d: string | Date) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <p className="text-[#8892A4] text-sm">{items.length} message{items.length !== 1 ? 's' : ''}</p>
        {unread > 0 && <span className="px-2.5 py-0.5 bg-[#1A56FF] text-white text-xs font-bold rounded-full">{unread} unread</span>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={28} className="text-[#1A56FF] animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-[#8892A4] text-sm bg-white rounded-2xl border border-[#E6EAF4]">
          <Mail size={32} className="mx-auto mb-3 text-[#C0C8D8]" />
          No messages yet.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map(msg => {
            const isOpen = expanded === msg.contactMessageId;
            return (
              <div key={msg.contactMessageId} className={`bg-white rounded-2xl border transition-colors ${isOpen ? 'border-[#1A56FF]/30 shadow-sm' : 'border-[#E6EAF4]'}`}>
                <div className="flex items-center gap-3 px-5 py-4 cursor-pointer" onClick={() => toggleExpand(msg)}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${msg.read ? 'bg-transparent' : 'bg-[#1A56FF]'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm truncate ${msg.read ? 'text-[#8892A4]' : 'text-[#0A0A0F] font-semibold'}`}>{msg.name}</p>
                      <span className="text-[#C0C8D8] text-xs shrink-0">•</span>
                      <p className="text-[#8892A4] text-xs truncate">{msg.email}</p>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${msg.read ? 'text-[#C0C8D8]' : 'text-[#8892A4]'}`}>{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {deleteId === msg.contactMessageId ? (
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleDelete(msg.contactMessageId)} className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-100">Del</button>
                        <button onClick={() => setDeleteId(null)} className="px-2 py-1 text-[#8892A4] rounded-lg text-xs">✕</button>
                      </div>
                    ) : (
                      <button onClick={e => { e.stopPropagation(); setDeleteId(msg.contactMessageId); }} className="p-1.5 text-[#8892A4] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                    {isOpen ? <ChevronUp size={14} className="text-[#8892A4]" /> : <ChevronDown size={14} className="text-[#8892A4]" />}
                  </div>
                </div>
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-[#F4F6FF]">
                    <p className="text-[#0A0A0F] text-sm leading-relaxed mt-4 whitespace-pre-wrap">{msg.message}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F4F6FF]">
                      <div className="flex items-center gap-1.5 text-[#8892A4] text-xs">
                        <Clock size={12} />
                        {formatDate(msg.createdAt ?? '')}
                      </div>
                      <a href={`mailto:${msg.email}?subject=Re: Your message`} className="flex items-center gap-1.5 text-xs font-semibold text-[#1A56FF] hover:text-[#0D2DB4] transition-colors">
                        <Mail size={13} /> Reply via Email
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
