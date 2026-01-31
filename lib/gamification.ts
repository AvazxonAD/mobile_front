export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: "streak" | "challenges" | "learning" | "social" | "achievement"
  rarity: "common" | "rare" | "epic" | "legendary"
  requirements: {
    type: "streak" | "challenges_completed" | "points_earned" | "assessments_taken" | "articles_read" | "days_active"
    value: number
    timeframe?: "daily" | "weekly" | "monthly" | "all_time"
  }
  points: number
  unlockedAt?: Date
}

export interface Achievement {
  id: string
  userId: string
  badgeId: string
  unlockedAt: Date
  progress: number
  maxProgress: number
  isCompleted: boolean
}

export interface Leaderboard {
  id: string
  name: string
  description: string
  type: "points" | "streak" | "challenges" | "level"
  timeframe: "daily" | "weekly" | "monthly" | "all_time"
  isAnonymous: boolean
}

export interface LeaderboardEntry {
  userId: string
  username: string
  avatar?: string
  score: number
  rank: number
  change: number // +/- from previous period
  isCurrentUser: boolean
}

export interface UserStats {
  userId: string
  totalPoints: number
  currentStreak: number
  longestStreak: number
  challengesCompleted: number
  assessmentsTaken: number
  articlesRead: number
  daysActive: number
  level: number
  badgesEarned: string[]
  joinedAt: Date
  lastActiveAt: Date
}

// Mock badges data
export const availableBadges: Badge[] = [
  // Streak Badges
  {
    id: "first-step",
    name: "First Step",
    description: "Complete your first daily challenge",
    icon: "👶",
    category: "challenges",
    rarity: "common",
    requirements: { type: "challenges_completed", value: 1 },
    points: 50,
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Maintain a 7-day streak",
    icon: "🌅",
    category: "streak",
    rarity: "common",
    requirements: { type: "streak", value: 7 },
    points: 100,
  },
  {
    id: "consistent",
    name: "Consistent",
    description: "Maintain a 30-day streak",
    icon: "🔥",
    category: "streak",
    rarity: "rare",
    requirements: { type: "streak", value: 30 },
    points: 500,
  },
  {
    id: "unstoppable",
    name: "Unstoppable",
    description: "Maintain a 100-day streak",
    icon: "⚡",
    category: "streak",
    rarity: "epic",
    requirements: { type: "streak", value: 100 },
    points: 2000,
  },
  {
    id: "legend",
    name: "Legend",
    description: "Maintain a 365-day streak",
    icon: "👑",
    category: "streak",
    rarity: "legendary",
    requirements: { type: "streak", value: 365 },
    points: 10000,
  },

  // Challenge Badges
  {
    id: "challenger",
    name: "Challenger",
    description: "Complete 10 daily challenges",
    icon: "🎯",
    category: "challenges",
    rarity: "common",
    requirements: { type: "challenges_completed", value: 10 },
    points: 200,
  },
  {
    id: "dedicated",
    name: "Dedicated",
    description: "Complete 50 daily challenges",
    icon: "💪",
    category: "challenges",
    rarity: "rare",
    requirements: { type: "challenges_completed", value: 50 },
    points: 1000,
  },
  {
    id: "master",
    name: "Master",
    description: "Complete 100 daily challenges",
    icon: "🏆",
    category: "challenges",
    rarity: "epic",
    requirements: { type: "challenges_completed", value: 100 },
    points: 3000,
  },

  // Learning Badges
  {
    id: "curious",
    name: "Curious",
    description: "Read 5 articles in the Knowledge Hub",
    icon: "🤔",
    category: "learning",
    rarity: "common",
    requirements: { type: "articles_read", value: 5 },
    points: 150,
  },
  {
    id: "scholar",
    name: "Scholar",
    description: "Read 25 articles in the Knowledge Hub",
    icon: "📚",
    category: "learning",
    rarity: "rare",
    requirements: { type: "articles_read", value: 25 },
    points: 750,
  },
  {
    id: "wisdom-seeker",
    name: "Wisdom Seeker",
    description: "Read 100 articles in the Knowledge Hub",
    icon: "🧠",
    category: "learning",
    rarity: "epic",
    requirements: { type: "articles_read", value: 100 },
    points: 2500,
  },

  // Assessment Badges
  {
    id: "self-aware",
    name: "Self-Aware",
    description: "Complete your first assessment",
    icon: "🪞",
    category: "achievement",
    rarity: "common",
    requirements: { type: "assessments_taken", value: 1 },
    points: 100,
  },
  {
    id: "introspective",
    name: "Introspective",
    description: "Complete 5 assessments",
    icon: "🔍",
    category: "achievement",
    rarity: "rare",
    requirements: { type: "assessments_taken", value: 5 },
    points: 500,
  },

  // Points Badges
  {
    id: "rising-star",
    name: "Rising Star",
    description: "Earn 1,000 points",
    icon: "⭐",
    category: "achievement",
    rarity: "common",
    requirements: { type: "points_earned", value: 1000 },
    points: 100,
  },
  {
    id: "high-achiever",
    name: "High Achiever",
    description: "Earn 5,000 points",
    icon: "🌟",
    category: "achievement",
    rarity: "rare",
    requirements: { type: "points_earned", value: 5000 },
    points: 500,
  },
  {
    id: "elite",
    name: "Elite",
    description: "Earn 10,000 points",
    icon: "💎",
    category: "achievement",
    rarity: "epic",
    requirements: { type: "points_earned", value: 10000 },
    points: 1000,
  },
]

// Mock user achievements
export const mockUserAchievements: Achievement[] = [
  {
    id: "1",
    userId: "1",
    badgeId: "first-step",
    unlockedAt: new Date("2024-01-01"),
    progress: 1,
    maxProgress: 1,
    isCompleted: true,
  },
  {
    id: "2",
    userId: "1",
    badgeId: "early-bird",
    unlockedAt: new Date("2024-01-07"),
    progress: 7,
    maxProgress: 7,
    isCompleted: true,
  },
  {
    id: "3",
    userId: "1",
    badgeId: "challenger",
    unlockedAt: new Date("2024-01-10"),
    progress: 10,
    maxProgress: 10,
    isCompleted: true,
  },
  {
    id: "4",
    userId: "1",
    badgeId: "consistent",
    unlockedAt: new Date(),
    progress: 25,
    maxProgress: 30,
    isCompleted: false,
  },
]

// Mock leaderboard data
export const mockLeaderboardEntries: LeaderboardEntry[] = [
  {
    userId: "2",
    username: "GrowthMaster",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 15420,
    rank: 1,
    change: 2,
    isCurrentUser: false,
  },
  {
    userId: "3",
    username: "MindfulJourney",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 12850,
    rank: 2,
    change: -1,
    isCurrentUser: false,
  },
  {
    userId: "4",
    username: "WisdomSeeker",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 11200,
    rank: 3,
    change: 1,
    isCurrentUser: false,
  },
  {
    userId: "1",
    username: "Demo User",
    avatar: "/diverse-user-avatars.png",
    score: 1250,
    rank: 47,
    change: 5,
    isCurrentUser: true,
  },
]

export const getUserStats = (userId: string): UserStats | null => {
  // Mock implementation - in real app, fetch from database
  if (userId === "1") {
    return {
      userId: "1",
      totalPoints: 1250,
      currentStreak: 7,
      longestStreak: 12,
      challengesCompleted: 15,
      assessmentsTaken: 2,
      articlesRead: 8,
      daysActive: 25,
      level: 3,
      badgesEarned: ["first-step", "early-bird", "challenger"],
      joinedAt: new Date("2024-01-01"),
      lastActiveAt: new Date(),
    }
  }
  return null
}

export const getUserAchievements = (userId: string): Achievement[] => {
  return mockUserAchievements.filter((achievement) => achievement.userId === userId)
}

export const checkForNewBadges = (userStats: UserStats): Badge[] => {
  const userAchievements = getUserAchievements(userStats.userId)
  const earnedBadgeIds = userAchievements.filter((a) => a.isCompleted).map((a) => a.badgeId)
  const newBadges: Badge[] = []

  availableBadges.forEach((badge) => {
    if (earnedBadgeIds.includes(badge.id)) return

    let qualifies = false
    const req = badge.requirements

    switch (req.type) {
      case "streak":
        qualifies = userStats.currentStreak >= req.value
        break
      case "challenges_completed":
        qualifies = userStats.challengesCompleted >= req.value
        break
      case "points_earned":
        qualifies = userStats.totalPoints >= req.value
        break
      case "assessments_taken":
        qualifies = userStats.assessmentsTaken >= req.value
        break
      case "articles_read":
        qualifies = userStats.articlesRead >= req.value
        break
      case "days_active":
        qualifies = userStats.daysActive >= req.value
        break
    }

    if (qualifies) {
      newBadges.push(badge)
    }
  })

  return newBadges
}

export const getLeaderboard = (type: Leaderboard["type"], timeframe: Leaderboard["timeframe"]): LeaderboardEntry[] => {
  // Mock implementation - in real app, fetch and calculate from database
  return [...mockLeaderboardEntries].sort((a, b) => b.score - a.score)
}

export const getRarityColor = (rarity: Badge["rarity"]) => {
  switch (rarity) {
    case "common":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    case "rare":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "epic":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "legendary":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  }
}

export const getCategoryColor = (category: Badge["category"]) => {
  switch (category) {
    case "streak":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    case "challenges":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "learning":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "social":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
    case "achievement":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
  }
}
