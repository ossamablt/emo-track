"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PenLine, Search } from "lucide-react";
import { JournalEntry } from "@/lib/types";
import { getEntries, deleteEntry } from "@/lib/storage";
import EntryCard from "@/components/EntryCard";

export default function HistoryPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEntries(getEntries());
  }, []);

  if (!mounted) return null;

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setEntries(getEntries());
  };

  const filtered = entries.filter(
    (e) =>
      e.text.toLowerCase().includes(search.toLowerCase()) ||
      e.dominantEmotion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">History</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} total
          </p>
        </div>
        <Link
          href="/journal"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/20"
        >
          <PenLine className="w-4 h-4" />
          New Entry
        </Link>
      </div>

      {entries.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries or emotions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          />
        </div>
      )}

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center">
          <p className="text-4xl mb-3">📖</p>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No entries yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Your journal entries will appear here
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No entries match &ldquo;{search}&rdquo;
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
