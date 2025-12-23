/**
 * Detects if the page is opened within the Zhihu App
 * Based on tech specs: iOS App adds "osee2unifiedRelease", Android App adds "Futureve" to UserAgent
 * Matching is case-sensitive
 */
export function isZhihuApp(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent;
  
  // iOS App adds "osee2unifiedRelease" to UserAgent
  // Android App adds "Futureve" to UserAgent
  // HarmonyOS App adds "Harmony" to UserAgent
  // Matching is case-sensitive
  return userAgent.includes('osee2unifiedRelease') || userAgent.includes('Futureve') || userAgent.includes('ZhihuHmos');
}

export function isHarmonyOS(): boolean {
  const ua = navigator.userAgent;
  return ua.includes('HarmonyOS') || ua.includes('OpenHarmony') || ua.includes('ArkWeb');
}