import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  showBack?: boolean;
  showLogo?: boolean;
  onBack?: () => void;
}

const PageHeader = ({ showBack = false, showLogo = false, onBack }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      {showBack ? (
        <button
          onClick={onBack ?? (() => navigate(-1))}
          className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>
      ) : <div />}

      {showLogo && (
        <p className="font-display text-base font-semibold text-primary tracking-tight">
          mygrammie
        </p>
      )}

      <div />
    </div>
  );
};

export default PageHeader;
