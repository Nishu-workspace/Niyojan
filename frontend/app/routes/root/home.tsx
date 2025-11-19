import React from 'react'
import type { Route } from '../../+types/root';
import { Link } from "react-router";
import { ChevronRight, ArrowRight, Zap, Users, BarChart3, Lock, Github, Linkedin, Mail } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "NIYOJAN" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-xl font-bold text-foreground">Niyojan</span>
          </div>

          {/* CTA Buttons - Only Log In and Sign Up */}
          <div className="flex items-center gap-3">
            <Link to="/sign-in">
              <button className="px-6 py-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-smooth">
                Log In
              </button>
            </Link>
            <Link to="/sign-up">
              <button className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth shadow-lg hover:shadow-xl">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              
              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-balance">
                  Master your{' '}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    workflow
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed">
                  Simplify team collaboration with enterprise-ready project management. Organize workspaces, track tasks, and streamline productivity—all in one intuitive platform.
                </p>
              </div>

              {/* CTA Buttons - Hero Section */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/sign-up">
                  <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-smooth shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                    Sign Up Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                  </button>
                </Link>
                <Link to="/sign-in">
                  <button className="px-8 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-secondary/30 transition-smooth flex items-center justify-center gap-2">
                    Log In
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Column - Dashboard Mockup */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl" />
                
                {/* Dashboard card */}
                <div className="relative bg-gradient-to-br from-card to-secondary/20 border border-border/50 rounded-2xl p-6 shadow-2xl overflow-hidden">
                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />

                  {/* Dashboard content */}
                  <div className="relative space-y-4">
                    {/* Header bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">workspace.niyojan.app</div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border/50" />

                    {/* Mock Interface */}
                    <div className="space-y-4">
                      {/* Sidebar Section */}
                      <div className="flex gap-4">
                        {/* Left sidebar */}
                        <div className="w-32 space-y-2">
                          <div className="h-2 bg-primary/20 rounded w-20" />
                          <div className="h-2 bg-border/50 rounded w-24" />
                          <div className="h-2 bg-border/50 rounded w-28" />
                          <div className="pt-2 space-y-2">
                            <div className="h-2 bg-accent/20 rounded w-20" />
                            <div className="h-2 bg-border/50 rounded w-24" />
                            <div className="h-2 bg-border/50 rounded w-16" />
                          </div>
                        </div>

                        {/* Main content */}
                        <div className="flex-1 space-y-3">
                          {/* Cards grid */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-primary/10 rounded p-2 space-y-1">
                              <div className="h-1.5 bg-primary/40 rounded w-12" />
                              <div className="h-1.5 bg-primary/20 rounded w-8" />
                            </div>
                            <div className="bg-accent/10 rounded p-2 space-y-1">
                              <div className="h-1.5 bg-accent/40 rounded w-12" />
                              <div className="h-1.5 bg-accent/20 rounded w-8" />
                            </div>
                            <div className="bg-green-500/10 rounded p-2 space-y-1">
                              <div className="h-1.5 bg-green-500/40 rounded w-12" />
                              <div className="h-1.5 bg-green-500/20 rounded w-8" />
                            </div>
                            <div className="bg-blue-500/10 rounded p-2 space-y-1">
                              <div className="h-1.5 bg-blue-500/40 rounded w-12" />
                              <div className="h-1.5 bg-blue-500/20 rounded w-8" />
                            </div>
                          </div>

                          {/* Task list */}
                          <div className="space-y-2 pt-2">
                            <div className="flex gap-2 items-center">
                              <input type="checkbox" checked readOnly className="w-4 h-4 cursor-not-allowed" />
                              <div className="h-2 bg-border/50 rounded flex-1 max-w-[100px]" />
                            </div>
                            <div className="flex gap-2 items-center">
                              <input type="checkbox" readOnly className="w-4 h-4 cursor-not-allowed" />
                              <div className="h-2 bg-border/50 rounded flex-1 max-w-[120px]" />
                            </div>
                            <div className="flex gap-2 items-center">
                              <input type="checkbox" readOnly className="w-4 h-4 cursor-not-allowed" />
                              <div className="h-2 bg-border/50 rounded flex-1 max-w-[110px]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating accent dots */}
                  <div className="absolute top-8 right-8 w-20 h-20 bg-accent/10 rounded-full blur-xl" />
                  <div className="absolute bottom-8 left-8 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">Real-time collaboration and instant sync across all devices.</p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Team First</h3>
              <p className="text-sm text-muted-foreground">Built for seamless teamwork with powerful permission controls.</p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground">Deep Insights</h3>
              <p className="text-sm text-muted-foreground">Advanced analytics to track progress and boost productivity.</p>
            </div>

            {/* Feature 4 */}
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground">Secure by Default</h3>
              <p className="text-sm text-muted-foreground">Enterprise security with encryption and compliance certifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Ready to simplify your workflow?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join teams using Niyojan to collaborate smarter and ship faster.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up">
              <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-smooth shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          {/* Developers Section - Two Equal Columns */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Developer 1: Nishu-workspace */}
            <div className="flex flex-col items-center md:items-start gap-4 p-6 rounded-2xl bg-card/50 border border-border/50 hover:bg-card/80 transition-smooth">
              <div className="flex flex-col items-center md:items-start gap-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Developer</span>
                <span className="text-lg font-bold text-foreground">Nishu-workspace</span>
              </div>
              
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/Nishu-workspace" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all hover:scale-110"
                  title="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com/in/priyanshu-rami-271824312" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-background border border-border text-muted-foreground hover:text-blue-600 hover:border-blue-600/50 transition-all hover:scale-110"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:nishu.workspace@gmail.com" 
                  className="p-2 rounded-full bg-background border border-border text-muted-foreground hover:text-red-500 hover:border-red-500/50 transition-all hover:scale-110"
                  title="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Developer 2: RPM247 */}
            <div className="flex flex-col items-center md:items-end gap-4 p-6 rounded-2xl bg-card/50 border border-border/50 hover:bg-card/80 transition-smooth">
              <div className="flex flex-col items-center md:items-end gap-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Developer</span>
                <span className="text-lg font-bold text-foreground">RPM247</span>
              </div>
              
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/RPM247" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all hover:scale-110"
                  title="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com/in/priyanshu-rami-271824312" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-background border border-border text-muted-foreground hover:text-blue-600 hover:border-blue-600/50 transition-all hover:scale-110"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:ramipm0724@gmail.com" 
                  className="p-2 rounded-full bg-background border border-border text-muted-foreground hover:text-red-500 hover:border-red-500/50 transition-all hover:scale-110"
                  title="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Brand and Copyright Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-primary-foreground">N</span>
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">Niyojan</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Niyojan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}