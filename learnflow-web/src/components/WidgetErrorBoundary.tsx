"use client";

import { Component, type ReactNode } from "react";

/** Un widget (tuteur, tuto, toast) ne doit jamais faire tomber toute l’app. */
export default class WidgetErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
