import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import { hasCompletedOnboarding } from "@/services/user.service";

const Index = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    hasCompletedOnboarding().then((done) => {
      setOnboarded(done);
      setReady(true);
    });
  }, []);

  const handleSplashComplete = () => {
    navigate(onboarded ? "/dashboard" : "/onboarding");
  };

  if (!ready) return null;

  return <SplashScreen onComplete={handleSplashComplete} />;
};

export default Index;
