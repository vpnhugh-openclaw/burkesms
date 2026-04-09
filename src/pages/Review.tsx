import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/store/app-store';

export default function ReviewPage() {
  const navigate = useNavigate();
  const { recipients, toggleRecipient, selectFirst, selectAllValid, clearSelection, settings } = useAppStore();
  const [search, setSearch] = useState('');
  const [hideTexted, setHideTexted] = useState(true);
  const [hideInvalid, setHideInvalid] = useState(true);
  const [hideDuplicates, setHideDuplicates] = useState(false);

  const selectedCount = recipients.filter(r => r.isSelected).length;

  const filtered = useMemo(() => {
    return recipients.filter(r => {
      if (hideTexted && r.isAlreadyTexted) return false;
      if (hideInvalid && !r.isValidMobile) return false;
      if (hideDuplicates && r.isDuplicate) return false;
      if (search) {
        const q = search.toLowerCase();
        return r.firstName.toLowerCase().includes(q) || r.lastName.toLowerCase().includes(q) || r.mobileDisplay.includes(q);
      }
      return true;
    });
  }, [recipients, search, hideTexted, hideInvalid, hideDuplicates]);

  useEffect(() => {
    if (recipients.length === 0) navigate('/upload');
  }, [recipients.length, navigate]);

  if (recipients.length === 0) return null;

  return (
    <div className="space-y-6">
      <section className="max-w-4xl space-y-4">
        <p className="frost-pill">Review queue</p>
        <h1>Choose the right patients before anything gets sent.</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Filter the queue, remove edge cases, and keep the batch manageable before moving into message prep.
        </p>
      </section>

      <div data-testid="review-selection-summary" className="frost-panel flex flex-wrap items-center gap-3 p-4">
        <span className="text-sm font-medium">Selected <strong className="text-[#1f5d57]">{selectedCount}</strong></span>
        <span className="text-sm text-muted-foreground">· Valid {recipients.filter(r => r.isValidMobile && !r.isAlreadyTexted).length}</span>
        <span className="text-sm text-muted-foreground">· Already Texted {recipients.filter(r => r.isAlreadyTexted).length}</span>
        <span className="text-sm text-muted-foreground">· Invalid {recipients.filter(r => !r.isValidMobile).length}</span>
        <span className="text-sm text-muted-foreground">· Duplicates {recipients.filter(r => r.isDuplicate).length}</span>
      </div>

      <div className="flex flex-wrap gap-2 text-card-foreground">
        <Button variant="outline" size="sm" className="rounded-full border-[#d9e5e0] bg-[#fcfcfa] hover:bg-[#f4f8f6]" onClick={() => selectFirst(25)}>First 25</Button>
        <Button variant="outline" size="sm" className="rounded-full border-[#d9e5e0] bg-[#fcfcfa] hover:bg-[#f4f8f6]" onClick={() => selectFirst(50)}>First 50</Button>
        <Button data-testid="review-select-all" variant="outline" size="sm" className="rounded-full border-[#d9e5e0] bg-success" onClick={() => selectAllValid()}>All valid</Button>
        <Button variant="outline" size="sm" className="rounded-full border-[#d9e5e0] bg-[#fcfcfa] hover:bg-[#f4f8f6]" onClick={() => clearSelection()}>Clear</Button>
      </div>

      {selectedCount > settings.batchSoftCap && (
        <div className="rounded-xl border border-[#d4a017]/20 bg-[#f8f1d9] p-3 text-sm text-[#7a5a16]">
          Large batch selected. Batches over {settings.batchSoftCap} are harder to manage in one session.
        </div>
      )}

      <div className="frost-panel flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search name or number…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <label className="flex cursor-pointer items-center gap-1.5 text-sm">
          <Checkbox checked={hideTexted} onCheckedChange={v => setHideTexted(!!v)} /> Hide texted
        </label>
        <label className="flex cursor-pointer items-center gap-1.5 text-sm">
          <Checkbox checked={hideInvalid} onCheckedChange={v => setHideInvalid(!!v)} /> Hide invalid
        </label>
        <label className="flex cursor-pointer items-center gap-1.5 text-sm">
          <Checkbox checked={hideDuplicates} onCheckedChange={v => setHideDuplicates(!!v)} /> Hide duplicates
        </label>
      </div>

      <div className="table-shell">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#d9e5e0] bg-[#f4f8f6]">
              <th className="w-10 px-3 py-2"></th>
              <th className="px-3 py-2 text-left font-medium">Row</th>
              <th className="px-3 py-2 text-left font-medium">First Name</th>
              <th className="px-3 py-2 text-left font-medium">Last Name</th>
              <th className="px-3 py-2 text-left font-medium">Mobile</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const disabled = r.isAlreadyTexted || !r.isValidMobile || r.isSuppressed;
              return (
                <tr key={r.id} data-testid="review-patient-row" className={`border-b border-[#eef3f0] last:border-0 ${disabled ? 'opacity-50' : ''}`}>
                  <td className="px-3 py-2">
                    <Checkbox checked={r.isSelected} disabled={disabled} onCheckedChange={() => toggleRecipient(r.id)} />
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{r.originalRowNumber}</td>
                  <td className="px-3 py-2">{r.firstName}</td>
                  <td className="px-3 py-2">{r.lastName}</td>
                  <td className="px-3 py-2 font-mono text-sm">{r.mobileDisplay}</td>
                  <td className="px-3 py-2">
                    {r.isAlreadyTexted && <span className="frost-pill text-muted-foreground">Already Texted</span>}
                    {!r.isValidMobile && !r.isAlreadyTexted && <span className="frost-pill bg-[#fff1f0] text-[#b42318]">Invalid</span>}
                    {r.isDuplicate && r.isValidMobile && <span className="frost-pill bg-[#f8f1d9] text-[#9b6829]">Duplicate</span>}
                    {r.isValidMobile && !r.isAlreadyTexted && !r.isDuplicate && <span className="frost-pill bg-[#eaf5f1] text-[#1d7a43]">Valid</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">No patients match your filters</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button data-testid="review-continue-button" disabled={selectedCount === 0} onClick={() => navigate('/message')}>
          Continue with {selectedCount} patient{selectedCount !== 1 ? 's' : ''} <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
