"use client";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CopilotKit
      publicApiKey={`${process.env.NEXT_PUBLIC_COPILOT_CLOUD_PUBLIC_API_KEY}`}
    >
      {children}
      <CopilotPopup />
    </CopilotKit>
  );
}
