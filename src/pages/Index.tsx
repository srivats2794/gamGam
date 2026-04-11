import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-8 max-w-md">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
          mygrammie
        </h1>
        <p className="text-lg text-muted-foreground font-body">
          Good health is a precious thing!
        </p>
      </div>
    </div>
  );
};

export default Index;
