export function getTodayWisdomKey(): string {
    const dayOfWeek = new Date().getDay()
    return `day${dayOfWeek}`
  }
  
  export function getWisdomQuote(translations: any, language = "en"): { quote: string; author: string } {
    const wisdomKey = getTodayWisdomKey()
    const wisdomData = translations?.wisdom?.[wisdomKey]
  
    return {
      quote: wisdomData?.quote || "Every day is a new opportunity to learn and grow.",
      author: wisdomData?.author || "Unknown",
    }
  }
  