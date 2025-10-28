"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Account created! Check your email to verify.");
        router.push("/login");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create account";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white border border-gray-200 rounded-xl p-10 shadow-sm">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 font-sans tracking-tight" style={{ color: "#071f36" }}>
              Create Account
            </h1>
            <p className="text-gray-600 font-sans">
              Join Articler and start writing
            </p>
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 font-sans" style={{ color: "#071f36" }}>
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 px-4 bg-white border-gray-300 placeholder:text-gray-400 rounded-lg font-sans"
                style={{ color: "#071f36" }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 font-sans" style={{ color: "#071f36" }}>
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                className="w-full h-12 px-4 bg-white border-gray-300 placeholder:text-gray-400 rounded-lg font-sans"
                style={{ color: "#071f36" }}
                minLength={6}
                required
              />
              <p className="text-xs text-gray-500 mt-1 font-sans">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 font-sans" style={{ color: "#071f36" }}>
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=""
                className="w-full h-12 px-4 bg-white border-gray-300 placeholder:text-gray-400 rounded-lg font-sans"
                style={{ color: "#071f36" }}
                minLength={6}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-white rounded-lg font-sans font-medium text-base transition-colors mt-6 hover:opacity-90"
              style={{ backgroundColor: "#071f36" }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600 font-sans">
              Already have an account?{" "}
              <Link
                href="/login"
                className="hover:underline font-semibold"
                style={{ color: "#071f36" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-sans"
          >
             Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
