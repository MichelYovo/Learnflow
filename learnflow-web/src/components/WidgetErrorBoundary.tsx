"use client";

import { Component, type ReactNode } from "react";

/** Un widget ou une page ne doit jamais faire tomber toute l’app. */
export default class WidgetErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
