export { initDatabase, getDatabase, isDatabaseReady } from "./client";
export {
  loadProfiles,
  listProfiles,
  getProfileById,
  upsertProfile,
  addXpToProfile,
  setProfileXp,
  markProfilesClean,
  listDirtyProfiles,
  updateProfileName as updateLocalProfileName,
  updateProfileAvatar as updateLocalProfileAvatar,
  validateLocalPin,
  updateLocalPin,
  LOCAL_PARENT_ID,
} from "./profiles";
export {
  insertStudySession,
  listPendingSessions,
  listSessionsForStudent,
  markSessionsSynced,
  groupPendingXpByStudent,
} from "./sessions";
export { replaceLeagueCache, getCachedLeaderboard, setSyncMeta, getSyncMeta } from "./league";
export {
  localProfileToEleve,
  leagueCacheToPlayer,
  seedDemoProfilesIfEmpty,
  importEleveProfiles,
  pruneExtraLocalProfiles,
  ensureDemoPins,
  ensureDemoClasses,
  DEMO_PIN,
} from "./mappers";
