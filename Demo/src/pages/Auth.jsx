import {
  useState
} from "react";

import { supabase } from "../services/supabase";

function Auth() {
  const [isLogin, setIsLogin] =
    useState(true);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const { error } =
          await supabase.auth.signInWithPassword({
            email,
            password
          });

        if (error) throw error;

      } else {
        const { error } =
          await supabase.auth.signUp({
            email,
            password
          });

        if (error) throw error;

        setMessage(
          "Account created successfully. Check your email if confirmation is enabled."
        );
      }

    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>☁️ NoteCloud</h1>

        <p>
          {isLogin
            ? "Login to access your notes everywhere."
            : "Create your personal cloud workspace."}
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            minLength="6"
          />

          <button
            className="auth-btn"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <button
          className="switch-auth"
          onClick={() =>
            setIsLogin(!isLogin)
          }
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </button>

      </div>

    </div>
  );
}

export default Auth;