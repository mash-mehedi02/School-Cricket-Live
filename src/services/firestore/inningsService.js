/**
 * Innings Firestore Service
 * Adapter for backward compatibility - redirects to matchEngine
 */

import { recalculateInnings as engineRecalculate } from '../matchEngine/recalculateInnings'

/**
 * Re-export recalculateInnings from matchEngine for backward compatibility
 * This preserves the signature expected by legacy consumers
 */
export async function recalculateInningsStats(matchId, inningId) {
  // Use the new engine with transaction support by default
  return engineRecalculate(matchId, inningId, { useTransaction: true })
}

/**
 * Get innings document
 * Legacy wrapper
 */
export async function getInnings(matchId, inningId) {
  const { getInnings: get } = await import('../matchEngine/recalculateInnings')
  return get(matchId, inningId)
}

/**
 * Subscribe to innings document (real-time updates)
 * Legacy wrapper
 */
export function subscribeToInnings(matchId, inningId, callback) {
  const { subscribeToInnings: sub } = require('../matchEngine/recalculateInnings')
  return sub(matchId, inningId, callback)
}
