"use client";

import { IconArrowUpRight, IconRefresh, IconSearch } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Problem = {
  platform: string;
  title: string;
  url: string;
  solvedAt: string;
};

type Platform = {
  platform: string;
  key: string;
  username: string;
  profileUrl: string;
  status: "ok" | "unavailable";
  solvedCount: number;
  rating?: number | null;
  rank?: string | null;
};

type CodingData = {
  summary: {
    totalProblemsSolved: number;
    totalActiveDays: number;
  };
  platforms: Platform[];
  solved: Problem[];
  heatmap: Record<string, number>;
  updatedAt: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function CodingPage() {
  const [data, setData] = useState<CodingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(() => {
    setIsLoading(true);
    fetch("/api/coding-stats")
      .then((res) => {
        if (!res.ok) throw new Error("Coding stats request failed");
        return res.json() as Promise<CodingData>;
      })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProblems = useMemo(() => {
    if (!data?.solved) return [];
    return data.solved
      .filter((p) => {
        const matchesPlatform =
          selectedPlatform === "All" || p.platform === selectedPlatform;
        const matchesSearch = p.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesPlatform && matchesSearch;
      })
      .sort((a, b) => b.solvedAt.localeCompare(a.solvedAt));
  }, [data, selectedPlatform, searchQuery]);

  return (
    <section className="coding-page py-16 md:py-28">
      {/* Header */}
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">05 / Problem solving</p>
          <h1 className="mb-0">
            Built by
            <br />
            <span className="hero-highlight">solving.</span>
          </h1>
        </div>
        <p className="blog-lede">
          One place for the problems, progress, and patterns collected across my
          coding profiles.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="coding-summary">
        <div>
          <b>{data?.summary?.totalProblemsSolved ?? 0}</b>
          <span>tracked solves</span>
        </div>
        <div>
          <b>
            {data?.platforms.filter((p) => p.status === "ok").length ?? 0}
            /4
          </b>
          <span>live platforms</span>
        </div>
        <div>
          <b>{data?.summary?.totalActiveDays ?? 0}</b>
          <span>active days</span>
        </div>
      </div>

      {/* Platform Cards Grid */}
      <div className="platform-grid">
        {data?.platforms.map((platform) => (
          <a
            className={`platform-card ${platform.status}`}
            href={platform.profileUrl}
            key={platform.platform}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{platform.platform}</span>
            <b>{platform.solvedCount}</b>
            <small>
              {platform.status === "ok"
                ? `@${platform.username}`
                : "API unavailable"}
            </small>
          </a>
        ))}
      </div>

      {/* Heatmap Section */}
      <section className="coding-panel">
        <div className="card-topline">
          <span>COMMON ACTIVITY / LAST 12 MONTHS</span>
          <span>
            {data ? `UPDATED ${formatDate(data.updatedAt)}` : "LOADING..."}
          </span>
        </div>
        <div className="heatmap-scroll">
          <div className="heatmap">
            {Array.from({ length: 364 }, (_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - (363 - index));

              const key = date.toISOString().slice(0, 10);
              const count = data?.heatmap?.[key] ?? 0;

              return (
                <span
                  className={`heat-level-${
                    count === 0 ? 0 : Math.min(4, Math.ceil((count / 3) * 4))
                  }`}
                  title={`${count} submissions on ${key}`}
                  key={key}
                  style={{
                    gridRow: date.getDay() + 1,
                    gridColumn: Math.floor(index / 7) + 1,
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="heatmap-legend">
          <span>LESS</span>
          <div className="heatmap-steps">
            <i className="heat-level-0" />
            <i className="heat-level-1" />
            <i className="heat-level-2" />
            <i className="heat-level-3" />
            <i className="heat-level-4" />
          </div>
          <span>MORE</span>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="coding-toolbar flex flex-wrap items-center justify-between gap-4 my-8">
        <div className="coding-filters flex items-center gap-2">
          {["All", "Codeforces"].map((platform) => (
            <button
              key={platform}
              className={selectedPlatform === platform ? "active" : ""}
              onClick={() => setSelectedPlatform(platform)}
              type="button"
            >
              {platform}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search problem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border text-sm bg-transparent"
            />
            <IconSearch
              size={16}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <button
            className="text-link flex items-center gap-1 text-sm cursor-pointer"
            onClick={fetchData}
            type="button"
          >
            <IconRefresh size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Problem Listing */}
      {isLoading ? (
        <p className="coding-empty">Fetching solved problems...</p>
      ) : filteredProblems.length === 0 ? (
        <p className="coding-empty">
          No public solved problems found for this filter.
        </p>
      ) : (
        <div className="problem-list">
          {filteredProblems.slice(0, 100).map((problem) => (
            <a
              className="problem-row"
              href={problem.url}
              key={`${problem.platform}-${problem.url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="problem-platform">{problem.platform}</span>
              <b>{problem.title}</b>
              <time>{formatDate(problem.solvedAt)}</time>
              <IconArrowUpRight size={17} />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
