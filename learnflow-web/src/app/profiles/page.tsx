"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Ancien sélecteur de profils de simulation — redirigé vers la vraie connexion. */
export default function ProfilesPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
