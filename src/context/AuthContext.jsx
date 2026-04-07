import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // In production: replace with real JWT / Firebase auth
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // TODO: call POST /api/auth/login
    // Simulate successful login
    setUser({ id: "1", name: "Rahul Sharma", email, role: "jobseeker", plan: "free", usesLeft: 2 });
  };

  const signup = async (name, email, password, role) => {
    // TODO: call POST /api/auth/signup
    setUser({ id: "1", name, email, role, plan: "free", usesLeft: 5 });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
