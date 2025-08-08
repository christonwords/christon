import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../lib/config';

export function AiDevPanel() {
  const enabled = siteConfig.features.aiDevEnabled;
  const [logs, setLogs] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const originalErrorRef = useRef<((...data: any[]) => void) | null>(null);

  useEffect(() => {
    if (!enabled) return;
    function onError(event: ErrorEvent) {
      setLogs((l) => [String(event.message), ...l].slice(0, 20));
    }
    window.addEventListener('error', onError);
    originalErrorRef.current = console.error;
    console.error = (...args: any[]) => {
      setLogs((l) => [args.map(String).join(' '), ...l].slice(0, 20));
      originalErrorRef.current?.(...args);
    };
    return () => {
      window.removeEventListener('error', onError);
      if (originalErrorRef.current) console.error = originalErrorRef.current;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="card p-3">
      <div className="flex items-center justify-between">
        <div className="heading text-sm">AI Dev Assistant</div>
        <button className="btn btn-primary py-1 px-2 text-xs" onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</button>
      </div>
      {open && (
        <div className="mt-3 text-xs space-y-2">
          <div className="subtle">Recent errors/logs:</div>
          <ul className="list-disc list-inside space-y-1 max-h-48 overflow-auto">
            {logs.map((l, i) => <li key={i} className="text-zinc-300">{l}</li>)}
          </ul>
          <div className="subtle">Tip: Open console for more details. This panel can be extended to run on-device LLM suggestions.</div>
        </div>
      )}
    </div>
  );
}