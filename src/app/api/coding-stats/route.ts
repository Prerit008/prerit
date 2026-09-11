import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { codingProfileKey } from "../../../../data.json";
const PROFILE_KEY = codingProfileKey;
const CODOLIO_API = `https://api.codolio.com/profile?userKey=${PROFILE_KEY}`;

const PLATFORM_URLS: Record<string, (handle: string) => string> = {
  leetcode: (h) => `https://leetcode.com/u/${h}/`,
  codeforces: (h) => `https://codeforces.com/profile/${h}`,
  geeksforgeeks: (h) => `https://www.geeksforgeeks.org/user/${h}/`,
  codechef: (h) => `https://www.codechef.com/users/${h}`,
};

const PLATFORM_NAMES: Record<string, string> = {
  leetcode: "LeetCode",
  codeforces: "Codeforces",
  geeksforgeeks: "GeeksforGeeks",
  codechef: "CodeChef",
};

type SolvedProblem = {
  platform: string;
  title: string;
  url: string;
  solvedAt: string;
};

/**
 * Fetches solved problems directly from Codeforces official public REST API
 */
async function getCodeforcesProblems(handle: string): Promise<SolvedProblem[]> {
  try {
    const res = await fetch(
      `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) return [];

    const data = await res.json();
    if (data.status !== "OK") return [];

    const seen = new Set<string>();
    const solved: SolvedProblem[] = [];

    for (const sub of data.result) {
      if (sub.verdict === "OK" && sub.problem?.name) {
        const key = `${sub.problem.contestId}-${sub.problem.index}`;
        if (!seen.has(key)) {
          seen.add(key);
          solved.push({
            platform: "Codeforces",
            title: sub.problem.name,
            url: `https://codeforces.com/problemset/problem/${sub.problem.contestId}/${sub.problem.index}`,
            solvedAt: new Date(sub.creationTimeSeconds * 1000).toISOString(),
          });
        }
      }
    }
    return solved;
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    // 1. Fetch main Codolio profile data
    const response = await fetch(CODOLIO_API, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Codolio API HTTP Error: ${response.status}`);
    }

    const payload = await response.json();
    if (
      !payload.status?.success ||
      !payload.data?.platformProfiles?.platformProfiles
    ) {
      throw new Error("Invalid response format from Codolio API");
    }

    const rawProfiles = payload.data.platformProfiles.platformProfiles;
    const aggregatedHeatmap: Record<string, number> = {};
    let totalProblemsSolved = 0;

    let cfHandle = PROFILE_KEY;

    interface PlatformProfile {
      platform: string;
      userStats?: {
        handle?: string;
        currentRating?: number | null;
        maxRating?: number | null;
        rank?: string | null;
        contestBadgeName?: string | null;
      };
      totalQuestionStats?: { totalQuestionCounts?: number };
      dailyActivityStatsResponse?: {
        submissionCalendar?: Record<string, number>;
      };
    }

    const platforms = rawProfiles.map((p: PlatformProfile) => {
      const platformKey = p.platform.toLowerCase();
      const displayName = PLATFORM_NAMES[platformKey] ?? p.platform;
      const handle = p.userStats?.handle ?? PROFILE_KEY;

      if (platformKey === "codeforces") {
        cfHandle = handle;
      }

      const profileUrl = PLATFORM_URLS[platformKey]
        ? PLATFORM_URLS[platformKey](handle)
        : `https://codolio.com/profile/${PROFILE_KEY}`;

      const solvedCount = p.totalQuestionStats?.totalQuestionCounts ?? 0;
      totalProblemsSolved += solvedCount;

      const subCalendar =
        p.dailyActivityStatsResponse?.submissionCalendar ?? {};
      const platformHeatmap: Record<string, number> = {};

      for (const [timestampStr, count] of Object.entries(subCalendar)) {
        const cnt = count as number;
        if (cnt <= 0) continue;

        const timestampNum = Number(timestampStr);
        if (Number.isNaN(timestampNum)) continue;

        const dateStr = new Date(timestampNum * 1000)
          .toISOString()
          .slice(0, 10);
        platformHeatmap[dateStr] = (platformHeatmap[dateStr] ?? 0) + cnt;
        aggregatedHeatmap[dateStr] = (aggregatedHeatmap[dateStr] ?? 0) + cnt;
      }

      return {
        platform: displayName,
        key: platformKey,
        username: handle,
        profileUrl,
        status: "ok",
        solvedCount,
        rating: p.userStats?.currentRating ?? null,
        maxRating: p.userStats?.maxRating ?? null,
        rank: p.userStats?.rank ?? null,
        badge: p.userStats?.contestBadgeName ?? null,
      };
    });

    // 2. Fetch problem list for Codeforces
    const cfSolvedProblems = await getCodeforcesProblems(cfHandle);

    return NextResponse.json({
      summary: {
        totalProblemsSolved,
        totalActiveDays: Object.keys(aggregatedHeatmap).length,
      },
      platforms,
      solved: cfSolvedProblems,
      heatmap: aggregatedHeatmap,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to fetch aggregated coding profiles",
        message: errorMessage,
        updatedAt: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
