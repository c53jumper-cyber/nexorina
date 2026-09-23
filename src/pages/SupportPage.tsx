import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Search,
  ChevronDown,
  PlusCircle,
  FileQuestion,
  Headphones,
  Check,
  Send,
} from 'lucide-react';
import { SUPPORT_FAQS, SUPPORT_TICKETS } from '../data/mockData';
import { SupportTicket } from '../types';
import { Modal } from '../components/common/Modal';

export const SupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(SUPPORT_TICKETS);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState<boolean>(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Mining Infrastructure');
  const [newMessage, setNewMessage] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreateTicket = () => {
    if (!newSubject) return;
    const newT: SupportTicket = {
      id: `TCK-2026-${Math.floor(100 + Math.random() * 900)}`,
      subject: newSubject,
      category: newCategory,
      status: 'Open',
      lastUpdated: 'Just now',
      messagesCount: 1,
    };
    setTickets([newT, ...tickets]);
    setIsNewTicketOpen(false);
    setNewSubject('');
    setNewMessage('');
    setNotice(`Support ticket ${newT.id} created successfully.`);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#0C1224] via-[#0E1020] to-[#0A0D17] p-6 lg:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
              <Headphones className="h-3.5 w-3.5" />
              <span>24/7 PROTOCOL ASSISTANCE & KNOWLEDGE MATRIX</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-display">
              Help Center & Support Desk
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Browse technical documentation, check frequently asked questions, or open a verified
              support ticket with the core engineering desk.
            </p>
          </div>

          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all self-start md:self-auto"
          >
            <PlusCircle className="h-4 w-4" /> Open New Ticket
          </button>
        </div>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300">
          <Check className="h-4 w-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Support Tickets Section */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-5 lg:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Active Support Inquiries</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tickets linked to your verified account</p>
          </div>
          <span className="text-xs font-mono text-indigo-400">{tickets.length} Registered Inquiries</span>
        </div>

        <div className="divide-y divide-white/[0.04] mt-2">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3">
                <span className="font-mono text-xs text-indigo-400 font-semibold">{t.id}</span>
                <div>
                  <div className="text-xs font-semibold text-white">{t.subject}</div>
                  <div className="text-[11px] text-slate-500 font-mono">Category: {t.category}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-[11px] font-mono text-slate-400">Updated: {t.lastUpdated}</span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                    t.status === 'Resolved'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : t.status === 'In Progress'
                      ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400'
                      : 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                  }`}
                >
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-5 lg:p-6">
        <div className="pb-4 border-b border-white/[0.07] mb-4">
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Frequently Asked Questions (FAQ)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Quick answers regarding platform operations</p>
        </div>

        <div className="space-y-3">
          {SUPPORT_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs font-semibold text-white hover:bg-white/[0.02]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 border-t border-white/[0.04] pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* New Support Ticket Modal */}
      <Modal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        title="Open Support Ticket"
        subtitle="Contact Nexorina platform technical dispatch"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Subject</label>
            <input
              type="text"
              placeholder="e.g. Miner B hashrate query"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-2 text-white"
            >
              <option className="bg-[#0E1322]">Mining Infrastructure</option>
              <option className="bg-[#0E1322]">User Campaigns</option>
              <option className="bg-[#0E1322]">Trader Directives</option>
              <option className="bg-[#0E1322]">Wallet & Transactions</option>
              <option className="bg-[#0E1322]">Security & Authentication</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Description / Inquiry Details</label>
            <textarea
              rows={4}
              placeholder="Provide relevant transaction hashes, miner IDs, or description..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
            <button
              onClick={() => setIsNewTicketOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTicket}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Send className="h-3.5 w-3.5" /> Submit Ticket
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
