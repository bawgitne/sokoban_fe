import { LogIn } from "lucide-react";

export function AuthUI() {
  return (
    <div className="auth-strip">
      <span>Guest runner</span>
      <button title="Sign in">
        <LogIn size={16} />
        <span>Sign in</span>
      </button>
    </div>
  );
}
