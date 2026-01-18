import { create } from "zustand";
import { signIn, signUp, signOut } from "@/lib/auth-client";
import type { SignInInput, SignUpInput } from "@/lib/validators/auth";
import { mapAuthError, type AuthFormError } from "@/lib/auth/error-contract";

type AuthResult =
  | { ok: true }
  | { ok: false; error: AuthFormError };

type AuthState = {
  isLoading: boolean;

  // ❌ không dùng string nữa
  // ✅ UI chỉ nhận error contract sạch
  uiError: AuthFormError | null;

  signIn: (input: SignInInput) => Promise<AuthResult>;
  signUp: (input: SignUpInput) => Promise<AuthResult>;
  signOut: () => Promise<void>;

  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  uiError: null,

  clearError: () => set({ uiError: null }),

  // ====================
  // SIGN IN
  // ====================
  signIn: async ({ email, password }) => {
    try {
      set({ isLoading: true, uiError: null });

      const res = await signIn.email({
        email,
        password,
      });

      // BetterAuth error → map sang contract sạch
      if (res?.error) {
        const error = mapAuthError(res);
        set({ uiError: error, isLoading: false });
        return { ok: false, error };
      }

      set({ isLoading: false });
      return { ok: true };
    } catch (err: unknown) {
      const error = mapAuthError(err);
      set({ uiError: error, isLoading: false });
      return { ok: false, error };
    }
  },

  // ====================
  // SIGN UP (REQUIRES NAME)
  // ====================
  signUp: async ({ name, email, password }) => {
    try {
      set({ isLoading: true, uiError: null });

      const res = await signUp.email({
        name,     // ✅ required by BetterAuth
        email,
        password,
      });

      if (res?.error) {
        const error = mapAuthError(res);
        set({ uiError: error, isLoading: false });
        return { ok: false, error };
      }

      set({ isLoading: false });
      return { ok: true };
    } catch (err: unknown) {
      const error = mapAuthError(err);
      set({ uiError: error, isLoading: false });
      return { ok: false, error };
    }
  },

  // ====================
  // SIGN OUT
  // ====================
  signOut: async () => {
    set({ isLoading: true, uiError: null });
    try {
      await signOut();
    } finally {
      set({ isLoading: false });
    }
  },
}));
