"use client";

import { useSupport, type SupportTopic } from "./SupportProvider";

type Props = {
  children: React.ReactNode;
  topic?: SupportTopic;
  className?: string;
  onClick?: () => void;
};

export default function SupportButton({ children, topic = "support", className = "", onClick }: Props) {
  const { open } = useSupport();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        open(topic);
      }}
    >
      {children}
    </button>
  );
}
