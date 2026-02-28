// lib/github.ts

// Prioritize server-side env vars first, then client-side
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || process.env.NEXT_PUBLIC_GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

// Tipe Data TypeScript
export type ContributionDay = {
  contributionCount: number;
  date: string;
};

export type Week = {
  contributionDays: ContributionDay[];
};

export type GitHubStats = {
  total: number;
  thisWeek: number;
  bestDay: number;
  average: string;
  weeks: Week[];
};

export async function getGitHubContributions(): Promise<GitHubStats | null> {
  // Check if credentials are available
  if (!GITHUB_USERNAME || !GITHUB_TOKEN) {
    console.warn("GitHub credentials not found. Please set GITHUB_USERNAME and GITHUB_TOKEN in .env.local");
    return null;
  }

  const query = `
    query($userName: String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { userName: GITHUB_USERNAME },
      }),
      // CACHING (ISR): Revalidate setiap 3600 detik (1 jam)
      // Ini mencegah kamu terkena rate limit dari GitHub dan membuat load web super cepat!
      next: { revalidate: 3600 }, 
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("GitHub API Error:", res.status, errorText);
      throw new Error(`GitHub API returned ${res.status}`);
    }

    const json = await res.json();
    
    // Check for GraphQL errors
    if (json.errors) {
      console.error("GitHub GraphQL Errors:", json.errors);
      throw new Error("GitHub GraphQL query failed");
    }

    if (!json.data?.user?.contributionsCollection?.contributionCalendar) {
      console.error("Invalid GitHub API response structure");
      return null;
    }

    const calendar = json.data.user.contributionsCollection.contributionCalendar;

    // --- LOGIKA MENGHITUNG STATISTIK TAMBAHAN ---
    const total = calendar.totalContributions;
    
    // Semua hari dalam satu array datar
    const allDays = calendar.weeks.flatMap((w: Week) => w.contributionDays);
    
    // Hari terbaik (terbanyak)
    const bestDay = Math.max(...allDays.map((d: ContributionDay) => d.contributionCount));
    
    // Rata-rata per hari
    const average = (total / allDays.length).toFixed(2);
    
    // Kontribusi minggu ini (mengambil minggu terakhir dari array)
    const thisWeek = calendar.weeks[calendar.weeks.length - 1].contributionDays.reduce(
      (sum: number, day: ContributionDay) => sum + day.contributionCount,
      0
    );

    return {
      total,
      thisWeek,
      bestDay,
      average,
      weeks: calendar.weeks,
    };
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return null;
  }
}