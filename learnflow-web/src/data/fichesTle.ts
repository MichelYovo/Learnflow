import type { FicheCoursData } from "../types/learnflow";
import { FICHES_TLE_HG } from "./fichesTleHg";
import { FICHES_TLE_MATHS } from "./fichesTleMaths";
import { FICHES_TLE_PC } from "./fichesTlePc";
import { FICHES_TLE_SVT } from "./fichesTleSvt";

/** Catalogue Tle D : un résumé par chapitre, collé à Données_LF / TERMINAL. */
export const FICHES_TLE: Record<string, FicheCoursData> = {
  ...FICHES_TLE_MATHS,
  ...FICHES_TLE_SVT,
  ...FICHES_TLE_PC,
  ...FICHES_TLE_HG,
};
