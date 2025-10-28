"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const footerLinks = {
    main: [
      { label: "Home", href: "/" },
      { label: "All Posts", href: "/posts" },
      { label: "Categories", href: "/dashboard/categories" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    categories: [
      { label: "Technology", href: "/posts?category=technology" },
      { label: "Design", href: "/posts?category=design" },
      { label: "Business", href: "/posts?category=business" },
      { label: "Lifestyle", href: "/posts?category=lifestyle" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="border-t border-border/50 bg-surface/50 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold text-foreground">
                Articler
              </h3>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Our mission is simple: to empower you with the strategies to create
              compelling content, optimize your writing habits, and make smart
              publishing decisions. Take charge of your creative future and watch
              your stories work wonders.
            </p>
          </div>

          {/* Main Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Main</h4>
            <ul className="space-y-2">
              {footerLinks.main.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-4 mb-8">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                aria-label={social.label}
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
              </a>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} All Rights Reserved</p>
            <p>
              Made with{" "}
              <Link
                href="https://nextjs.org"
                target="_blank"
                className="hover:text-foreground"
              >
                Next.js
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
