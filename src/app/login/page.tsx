"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Welcome back!");
        router.push(redirectTo);
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign in";
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
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 font-sans tracking-tight" style={{ color: '#071f36' }}>
              Welcome Back
            </h1>
            <p className="text-gray-600 font-sans">
              Sign in to your Articler account
            </p>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 font-sans" style={{ color: '#071f36' }}>
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 px-4 bg-white border-gray-300 placeholder:text-gray-400 rounded-lg font-sans"
                style={{ color: '#071f36', borderColor: '#e5e7eb' }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 font-sans" style={{ color: '#071f36' }}>
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 bg-white border-gray-300 placeholder:text-gray-400 rounded-lg font-sans"
                style={{ color: '#071f36', borderColor: '#e5e7eb' }}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-white rounded-lg font-sans font-medium text-base transition-colors mt-6 hover:opacity-90"
              style={{ backgroundColor: '#071f36' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600 font-sans">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="hover:underline font-semibold"
                style={{ color: '#071f36' }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-sans"
          >
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

