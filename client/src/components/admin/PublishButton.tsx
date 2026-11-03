import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ExternalLink, Loader2, Rocket, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { publishApi, type PublishStatus } from '../../services/adminApi';

// Edits show to visitors right away, but search engines and link previews read the prerendered
// pages. Publishing rebuilds those pages from the current content and deploys them (~2 minutes).

const POLL_MS = 5000;
const POLL_LIMIT = 60; // about five minutes

const ago = (iso?: string) => {
  if (!iso) return '';
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  return h < 24 ? `${h} h ago` : `${Math.round(h / 24)} d ago`;
};

const running = (s: PublishStatus | null) => !!s && s.status !== 'completed' && s.status !== 'none';

interface Poller {
  setStatus: (s: PublishStatus | null) => void;
  timer: { current: ReturnType<typeof setTimeout> | undefined };
  /** Checks made since the last publish; 0 means just showing the last result, no toast. */
  polls: { current: number };
}

/** Checks the latest run and keeps checking every few seconds while one is running. */
const poll = (p: Poller) => {
  publishApi
    .status()
    .then((s) => {
      p.setStatus(s);
      if (running(s) && p.polls.current++ < POLL_LIMIT) {
        p.timer.current = setTimeout(() => poll(p), POLL_MS);
      } else if (s.status === 'completed' && p.polls.current > 0) {
        if (s.conclusion === 'success') toast.success('Site published');
        else toast.error('Publishing failed. Open the log for details.');
      }
    })
    .catch(() => p.setStatus(null)); // Not set up yet, or offline: the button still works.
};

export default function PublishButton() {
  const [status, setStatus] = useState<PublishStatus | null>(null);
  const [starting, setStarting] = useState(false);
  const polls = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    poll({ setStatus, timer, polls });
    return () => clearTimeout(timer.current);
  }, []);

  const publish = async () => {
    setStarting(true);
    try {
      const res = await publishApi.start();
      toast.success(res.message);
      // GitHub takes a few seconds to list the new run.
      setStatus({ status: 'queued' });
      polls.current = 1;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => poll({ setStatus, timer, polls }), POLL_MS);
    } catch (e) {
      toast.error((e as Error).message || 'Could not start publishing');
    } finally {
      setStarting(false);
    }
  };

  const busy = starting || running(status);

  return (
    <div className="flex items-center gap-3">
      {status && status.status !== 'none' && (
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#8892A4]">
          {busy ? (
            <>
              <Loader2 size={13} className="animate-spin text-[#1A56FF]" /> Publishing…
            </>
          ) : status.conclusion === 'success' ? (
            <>
              <CheckCircle2 size={13} className="text-emerald-500" /> Published {ago(status.updatedAt)}
            </>
          ) : (
            <>
              <XCircle size={13} className="text-red-500" /> Last publish failed
            </>
          )}
          {status.url && (
            <a href={status.url} target="_blank" rel="noreferrer" className="hover:text-[#0A0A0F]" aria-label="Open the deploy log">
              <ExternalLink size={12} />
            </a>
          )}
        </span>
      )}
      <button
        onClick={publish}
        disabled={busy}
        title="Rebuild the site from the current content so search engines and link previews see your latest edits"
        className="flex items-center gap-2 bg-[#0A0A0F] hover:bg-[#1E2235] disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
      >
        {busy ? <Loader2 size={15} className="animate-spin" /> : <Rocket size={15} />}
        Publish site
      </button>
    </div>
  );
}
