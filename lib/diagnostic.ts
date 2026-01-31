export interface DiagnosticQuestion {
    id: string
    text: string
    category: "emotional" | "social" | "career" | "health" | "mindfulness" | "relationships"
    type: "scale" | "multiple_choice" | "boolean"
    options?: string[]
    scaleMin?: number
    scaleMax?: number
    scaleLabels?: { min: string; max: string }
  }
  
  export interface DiagnosticAnswer {
    questionId: string
    value: number | string | boolean
    timestamp: Date
  }
  
  export interface DiagnosticResult {
    id: string
    userId: string
    testId: string
    answers: DiagnosticAnswer[]
    scores: {
      [category: string]: {
        score: number
        maxScore: number
        percentage: number
        level: "low" | "moderate" | "high"
      }
    }
    overallScore: number
    recommendations: AIRecommendation[]
    completedAt: Date
  }
  
  export interface AIRecommendation {
    id: string
    category: string
    title: string
    description: string
    actionItems: string[]
    priority: "high" | "medium" | "low"
    estimatedImpact: string
    resources: {
      title: string
      type: "article" | "video" | "book" | "exercise"
      url?: string
    }[]
  }
  
  export interface DiagnosticTest {
    id: string
    title: string
    description: string
    estimatedTime: string
    questions: DiagnosticQuestion[]
    categories: string[]
  }
  
  // Mock diagnostic test data
  export const personalGrowthTest: DiagnosticTest = {
    id: "personal-growth-assessment",
    title: "Personal Growth Assessment",
    description:
      "A comprehensive evaluation of your current state across key life areas to provide personalized growth recommendations.",
    estimatedTime: "10-15 minutes",
    categories: ["emotional", "social", "career", "health", "mindfulness", "relationships"],
    questions: [
      // Emotional Intelligence
      {
        id: "eq1",
        text: "I am aware of my emotions as they occur",
        category: "emotional",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "eq2",
        text: "I can manage my emotions effectively during stressful situations",
        category: "emotional",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "eq3",
        text: "I understand how my emotions affect others",
        category: "emotional",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "eq4",
        text: "I can bounce back quickly from setbacks",
        category: "emotional",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
  
      // Social Skills
      {
        id: "social1",
        text: "I feel comfortable in social situations",
        category: "social",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "social2",
        text: "I can effectively communicate my ideas to others",
        category: "social",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "social3",
        text: "I actively listen when others are speaking",
        category: "social",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "social4",
        text: "I can resolve conflicts constructively",
        category: "social",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
  
      // Career Development
      {
        id: "career1",
        text: "I have clear goals for my career development",
        category: "career",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
      },
      {
        id: "career2",
        text: "I actively seek opportunities to learn new skills",
        category: "career",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "career3",
        text: "I feel satisfied with my current work-life balance",
        category: "career",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "career4",
        text: "I take initiative in my professional responsibilities",
        category: "career",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
  
      // Health & Wellness
      {
        id: "health1",
        text: "I maintain a regular exercise routine",
        category: "health",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "health2",
        text: "I get adequate sleep most nights",
        category: "health",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "health3",
        text: "I eat a balanced and nutritious diet",
        category: "health",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "health4",
        text: "I effectively manage stress in my daily life",
        category: "health",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
  
      // Mindfulness & Self-Awareness
      {
        id: "mindful1",
        text: "I practice mindfulness or meditation regularly",
        category: "mindfulness",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "mindful2",
        text: "I am present and focused during daily activities",
        category: "mindfulness",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "mindful3",
        text: "I regularly reflect on my personal growth",
        category: "mindfulness",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "mindful4",
        text: "I am aware of my personal values and live by them",
        category: "mindfulness",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
  
      // Relationships
      {
        id: "rel1",
        text: "I maintain meaningful relationships with family and friends",
        category: "relationships",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "rel2",
        text: "I can express my needs and boundaries clearly",
        category: "relationships",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "rel3",
        text: "I show empathy and understanding toward others",
        category: "relationships",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
      {
        id: "rel4",
        text: "I invest time and energy in building relationships",
        category: "relationships",
        type: "scale",
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: { min: "Never", max: "Always" },
      },
    ],
  }
  
  // Mock AI recommendation engine
  export const generateRecommendations = async (
    result: Omit<DiagnosticResult, "recommendations">,
  ): Promise<AIRecommendation[]> => {
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))
  
    const recommendations: AIRecommendation[] = []
  
    // Generate recommendations based on scores
    Object.entries(result.scores).forEach(([category, score]) => {
      if (score.percentage < 60) {
        // Low score - high priority recommendations
        switch (category) {
          case "emotional":
            recommendations.push({
              id: `rec-${category}-${Date.now()}`,
              category,
              title: "Develop Emotional Intelligence",
              description:
                "Your emotional awareness and regulation could benefit from focused development. Building these skills will improve your overall well-being and relationships.",
              actionItems: [
                "Practice daily emotion journaling for 5 minutes",
                "Try the 'STOP' technique when feeling overwhelmed",
                "Learn to identify emotional triggers",
                "Practice deep breathing exercises",
              ],
              priority: "high",
              estimatedImpact: "Significant improvement in stress management and relationships within 4-6 weeks",
              resources: [
                {
                  title: "Emotional Intelligence 2.0",
                  type: "book",
                  url: "https://example.com/ei-book",
                },
                {
                  title: "5-Minute Mindfulness Meditation",
                  type: "exercise",
                },
              ],
            })
            break
          case "social":
            recommendations.push({
              id: `rec-${category}-${Date.now()}`,
              category,
              title: "Enhance Social Communication Skills",
              description:
                "Improving your social skills will help you build stronger relationships and feel more confident in social situations.",
              actionItems: [
                "Practice active listening in conversations",
                "Join a social group or club aligned with your interests",
                "Set a goal to have one meaningful conversation daily",
                "Learn about non-verbal communication cues",
              ],
              priority: "high",
              estimatedImpact: "Noticeable improvement in social confidence within 3-4 weeks",
              resources: [
                {
                  title: "How to Win Friends and Influence People",
                  type: "book",
                },
                {
                  title: "Active Listening Techniques",
                  type: "article",
                },
              ],
            })
            break
          case "health":
            recommendations.push({
              id: `rec-${category}-${Date.now()}`,
              category,
              title: "Build Healthy Lifestyle Habits",
              description:
                "Your physical health foundation needs attention. Small, consistent changes can lead to significant improvements in energy and well-being.",
              actionItems: [
                "Start with 10 minutes of daily movement",
                "Establish a consistent sleep schedule",
                "Plan and prep healthy meals weekly",
                "Create a stress management routine",
              ],
              priority: "high",
              estimatedImpact: "Increased energy and better mood within 2-3 weeks",
              resources: [
                {
                  title: "Atomic Habits",
                  type: "book",
                },
                {
                  title: "7-Minute Workout",
                  type: "exercise",
                },
              ],
            })
            break
        }
      } else if (score.percentage < 80) {
        // Moderate score - medium priority recommendations
        switch (category) {
          case "career":
            recommendations.push({
              id: `rec-${category}-${Date.now()}`,
              category,
              title: "Accelerate Career Development",
              description:
                "You have a solid foundation but can benefit from more strategic career planning and skill development.",
              actionItems: [
                "Set specific, measurable career goals for the next year",
                "Identify 2-3 key skills to develop",
                "Seek feedback from mentors or supervisors",
                "Network with professionals in your field",
              ],
              priority: "medium",
              estimatedImpact: "Clear career direction and new opportunities within 2-3 months",
              resources: [
                {
                  title: "What Color Is Your Parachute?",
                  type: "book",
                },
                {
                  title: "LinkedIn Learning Courses",
                  type: "article",
                },
              ],
            })
            break
          case "mindfulness":
            recommendations.push({
              id: `rec-${category}-${Date.now()}`,
              category,
              title: "Deepen Mindfulness Practice",
              description: "You show good self-awareness but could benefit from more consistent mindfulness practices.",
              actionItems: [
                "Establish a daily 10-minute meditation routine",
                "Practice mindful eating during one meal per day",
                "Use mindfulness apps for guided sessions",
                "Schedule weekly self-reflection time",
              ],
              priority: "medium",
              estimatedImpact: "Enhanced focus and emotional balance within 3-4 weeks",
              resources: [
                {
                  title: "Headspace App",
                  type: "article",
                },
                {
                  title: "The Power of Now",
                  type: "book",
                },
              ],
            })
            break
        }
      }
    })
  
    // Always include at least one general recommendation
    if (recommendations.length === 0) {
      recommendations.push({
        id: `rec-general-${Date.now()}`,
        category: "general",
        title: "Continue Your Growth Journey",
        description:
          "You're doing well across most areas! Focus on maintaining your current practices while exploring new growth opportunities.",
        actionItems: [
          "Set new challenging but achievable goals",
          "Explore areas outside your comfort zone",
          "Share your knowledge and mentor others",
          "Celebrate your progress and achievements",
        ],
        priority: "low",
        estimatedImpact: "Sustained growth and increased fulfillment",
        resources: [
          {
            title: "The 7 Habits of Highly Effective People",
            type: "book",
          },
        ],
      })
    }
  
    return recommendations
  }
  
  export const calculateDiagnosticResult = async (
    userId: string,
    testId: string,
    answers: DiagnosticAnswer[],
  ): Promise<DiagnosticResult> => {
    const test = personalGrowthTest
    const scores: DiagnosticResult["scores"] = {}
  
    // Calculate scores by category
    test.categories.forEach((category) => {
      const categoryQuestions = test.questions.filter((q) => q.category === category)
      const categoryAnswers = answers.filter((a) => categoryQuestions.some((q) => q.id === a.questionId))
  
      const totalScore = categoryAnswers.reduce((sum, answer) => {
        return sum + (typeof answer.value === "number" ? answer.value : 0)
      }, 0)
  
      const maxScore = categoryQuestions.length * 5 // Assuming 5-point scale
      const percentage = (totalScore / maxScore) * 100
  
      let level: "low" | "moderate" | "high"
      if (percentage < 60) level = "low"
      else if (percentage < 80) level = "moderate"
      else level = "high"
  
      scores[category] = {
        score: totalScore,
        maxScore,
        percentage: Math.round(percentage),
        level,
      }
    })
  
    // Calculate overall score
    const totalPossibleScore = Object.values(scores).reduce((sum, score) => sum + score.maxScore, 0)
    const totalActualScore = Object.values(scores).reduce((sum, score) => sum + score.score, 0)
    const overallScore = Math.round((totalActualScore / totalPossibleScore) * 100)
  
    const result: Omit<DiagnosticResult, "recommendations"> = {
      id: Date.now().toString(),
      userId,
      testId,
      answers,
      scores,
      overallScore,
      completedAt: new Date(),
    }
  
    // Generate AI recommendations
    const recommendations = await generateRecommendations(result)
  
    return {
      ...result,
      recommendations,
    }
  }
  
  // Mock storage for results
  export const mockDiagnosticResults: DiagnosticResult[] = []
  
  export const saveDiagnosticResult = async (result: DiagnosticResult): Promise<void> => {
    mockDiagnosticResults.push(result)
  }
  
  export const getUserDiagnosticResults = (userId: string): DiagnosticResult[] => {
    return mockDiagnosticResults.filter((result) => result.userId === userId)
  }