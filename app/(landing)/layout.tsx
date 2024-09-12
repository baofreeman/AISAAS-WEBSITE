import React from "react";

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = React.memo(
  ({ children }) => {
    return (
      <main className="h-full bg-[#111827] overflow-auto">
        <div className="mx-auto max-w-screen-xl h-full w-full">{children}</div>
      </main>
    );
  }
);

LandingLayout.displayName = "LandingLayout";

export default LandingLayout;
