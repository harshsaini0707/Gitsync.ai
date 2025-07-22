"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { Github, Brain, Search, Video, Rocket, Plus, CheckCircle } from "lucide-react";
import Logoo from "../../public/logo.png"
import Image from "next/image";
// Helper component for syntax-highlighted code blocks
const CodeBlock = ({ code }: { code: string }) => (
  <pre className="bg-[#1e1e1e] p-4 rounded-md text-sm overflow-x-auto">
    <code dangerouslySetInnerHTML={{ __html: code }} />
  </pre>
);

// Helper for form input mockups
const FormInputMock = ({ placeholder }: { placeholder: string }) => (
  <div className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-gray-400">
    {placeholder}
  </div>
);

export default function HomePage() {
  const router = useRouter();
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setNavSolid(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartModelCode = `
<span class="text-purple-400">const</span> mongoose = <span class="text-green-400">require</span>(<span class="text-yellow-300">'mongoose'</span>);

<span class="text-purple-400">const</span> cartSchema = <span class="text-purple-400">new</span> mongoose.Schema({
  <span class="text-blue-300">itemId</span>: {
    <span class="text-red-400">type</span>: mongoose.Schema.Types.ObjectId,
    <span class="text-red-400">ref</span>: <span class="text-yellow-300">'Seller'</span>,
    <span class="text-red-400">required</span>: <span class="text-cyan-400">true</span>
  },
  <span class="text-blue-300">sellerId</span>: { ... },
  <span class="text-blue-300">itemName</span>: { ... },
  <span class="text-blue-300">quantity</span>: {
    <span class="text-red-400">type</span>: Number,
    <span class="text-red-400">required</span>: <span class="text-cyan-400">true</span>,
    <span class="text-red-400">min</span>: [<span class="text-orange-400">1</span>, <span class="text-yellow-300">'Quantity must be at least 1'</span>]
  },
  <span class="text-blue-300">price</span>: { ... }
}, { <span class="text-red-400">timestamps</span>: <span class="text-cyan-400">true</span> });
  `.trim();

  return (
    <>
      {/* Styles for animations */}
      <style jsx>{`
        @keyframes animated-grid {
          from { background-position: 0 0; }
          to { background-position: -100px 100px; }
        }
        .animated-grid-background {
          animation: animated-grid 20s linear infinite;
          background-image: linear-gradient(to right, rgba(128, 90, 213, 0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(128, 90, 213, 0.15) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
      `}</style>

      <main className="bg-[#0a0a0a] text-white overflow-x-hidden">
        {/* Navbar */}
        <header
          className={cn(
            "fixed top-0 w-full z-50 transition-all duration-300",
            navSolid ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"
          )}
        >
          <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-2 text-xl font-bold text-white tracking-wide">
               <Image src={Logoo} alt="logo" width={40} height={40} className="rounded-full" />
              GitSync
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="text-white wavy-underline  hover:bg-gray-100" onClick={() => router.push("/sign-up")}>
                Login
              </Button>
              
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0 animated-grid-background"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
          <div className="relative z-20 max-w-4xl text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 fade-in-up" style={{ animationDelay: "0.2s" }}>
              Your Project's Memory, Instantly Searchable
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto fade-in-up" style={{ animationDelay: "0.4s" }}>
              GitSync is the AI teammate that has read every commit, attended every meeting, and understands your entire codebase. Stop digging for context and start building.
            </p>
            <div className="flex justify-center gap-4 fade-in-up" style={{ animationDelay: "0.6s" }}>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10" onClick={() => router.push("/sign-up")}>
                <Rocket className="w-5 h-5 mr-2" />
                Get Started
              </Button>
              <Button size="lg" variant="secondary" className="bg-gray-300/80 border border-gray-700" onClick={() => document.getElementById("how")?.scrollIntoView()}>
                See How It Works
              </Button>
            </div>
          </div>
        </section>

        {/* Features (Condensed) */}
        <section className="py-20 px-6 bg-[#0a0a0a]" id="features">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">The End of "Who Knows About This?"</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                { icon: <Search className="w-6 h-6 text-purple-400" />, title: "Instant Code Understanding", desc: "AI-generated summaries for commits and PRs. Ask questions in plain English, get answers with code references." },
                { icon: <Brain className="w-6 h-6 text-green-400" />, title: "A Shared Team Brain", desc: "Every answer saved becomes reusable knowledge, slashing onboarding time and ending repetitive questions." },
                { icon: <Video className="w-6 h-6 text-pink-400" />, title: "Actionable Meeting Insights", desc: "Upload recordings to get summaries, decisions, and action items. Catch up in minutes, not hours." },
              ].map(({ icon, title, desc }, i) => (
                <div key={i} className="bg-black p-6 rounded-xl border border-gray-800/50 hover:border-purple-500/50 hover:-translate-y-1 transition-all duration-300">
                  <div className="mb-4">{icon}</div>
                  <h3 className="font-semibold text-xl mb-2 text-white">{title}</h3>
                  <p className="text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works (Expanded with Screenshot examples) */}
       
            <div className="space-y-32 mx-20">
              {/* Step 1 - Connect Repo */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="text-left animate-on-scroll">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl">
                      01
                    </div>
                    <span className="text-purple-400 font-bold text-lg tracking-wide">STEP ONE</span>
                  </div>
                  <h3 className="text-4xl font-bold mb-6 text-white leading-tight">
                    Connect Your Sources
                  </h3>
                  <p className="text-gray-400 text-xl leading-relaxed mb-8">
                    Securely link your repositories from GitHub, GitLab, or Bitbucket. 
                    GitSync begins indexing commit history, pull requests, and code structure 
                    immediately with enterprise-grade security.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {['GitHub', 'GitLab', 'Bitbucket'].map((platform) => (
                      <div key={platform} className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">{platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="animate-on-scroll">
                  <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-800/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-400 text-sm ml-4">Connect Repository</span>
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">Link Your GitHub Repository</h4>
                    <p className="text-sm text-gray-400 mb-8">Enter the URL of your repository to link it to GitSync.</p>
                    <div className="space-y-4">
                      <FormInputMock placeholder="Project Name" />
                      <FormInputMock placeholder="GitHub URL" />
                      <FormInputMock placeholder="GitHub Token (optional)" />
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 group">
                        <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        Create Project
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              

              {/* Step 2 - Get Instant Answers */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="text-left animate-on-scroll">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl">
                      02
                    </div>
                    <span className="text-blue-400 font-bold text-lg tracking-wide">STEP TWO</span>
                  </div>
                  <h3 className="text-4xl font-bold mb-6 text-white leading-tight">
                    Get Instant Answers
                  </h3>
                  <p className="text-gray-400 text-xl leading-relaxed mb-8">
                    Query the knowledge base in plain English. Get precise answers with direct 
                    code references, saving you hours of manual searching and context switching.
                  </p>
                  <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                    <h5 className="text-white font-semibold mb-2">Example Questions:</h5>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• "Where is the user authentication logic?"</li>
                      <li>• "What changed in the last sprint?"</li>
                      <li>• "How does the payment flow work?"</li>
                    </ul>
                  </div>
                </div>
                <div className="animate-on-scroll">
                  <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-800/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl mb-6 hover:from-gray-700 hover:to-gray-600 transition-all duration-300">
                      <p className="text-white">where is code of cart model?</p>
                    </div>
                    <div className="bg-[#0d1117] rounded-xl border border-gray-800/50 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50">
                        <span className="text-gray-400 text-sm font-medium">Backend/src/models/cart.model.js</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-gray-500">Found</span>
                        </div>
                      </div>
                      <CodeBlock code={cartModelCode} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 - Feed the Brain */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="animate-on-scroll lg:order-2">
                  <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-800/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-500">
                   
                    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800/50 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-5 h-5 text-green-400" />
                        <p className="text-green-400 font-semibold">[Issues Raised In Meeting]</p>
                      </div>
                    <ul className="space-y-4">
  <li className="flex items-start gap-3">
    <span className="text-xs font-semibold text-purple-300 bg-purple-600/20 px-2 py-1 rounded-md">
      [5:32 - 10:55]
    </span>
    <p className="text-sm text-gray-200 leading-snug">
      <span className="font-medium text-white">Deprecate v1 API by end of Q4.</span> 
    </p>
  </li>
  <li className="flex items-start gap-3">
    <span className="text-xs font-semibold text-purple-300 bg-purple-600/20 px-2 py-1 rounded-md">
      [28:05 - 37:12]
    </span>
    <p className="text-sm text-gray-200 leading-snug">
      <span className="font-medium text-white"></span>{" "}
      <span className="text-white font-semibold">@devon to scope out new auth module.</span> 
    </p>
  </li>
  <li className="flex items-start gap-3">
    <span className="text-xs font-semibold text-purple-300 bg-purple-600/20 px-2 py-1 rounded-md">
      [45:10 - 50:02]
    </span>
    <p className="text-sm text-gray-200 leading-snug">
      <span className="font-medium text-white">Concern:</span> Raised about mobile performance.
    </p>
  </li>
</ul>

                    </div>
                  </div>
                </div>
                <div className="text-left animate-on-scroll lg:order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl">
                      03
                    </div>
                    <span className="text-green-400 font-bold text-lg tracking-wide">STEP THREE</span>
                  </div>
                  <h3 className="text-4xl font-bold mb-6 text-white leading-tight">
                    Feed the Brain
                  </h3>
                  <p className="text-gray-400 text-xl leading-relaxed mb-8">
                    As your team works, GitSync passively learns. It processes new commits, 
                    PR discussions, and even meeting recordings you upload to create a rich, 
                    contextual graph of your project's knowledge.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'Commit Analysis',
                      'Meeting Transcription',
                      'PR Discussions',
                      'Code Context'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

        {/* Final CTA */}
        <section className="py-24 px-6 bg-[#0a0a0a] text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Give Your Project a Memory</h2>
            <p className="text-gray-400 text-lg mb-8">Stop losing context. Start building faster. Try GitSync today and turn your project's history into your greatest asset.</p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10" onClick={() => router.push("/sign-up")}>
              Get Started for Free
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black py-10 px-6 text-sm text-gray-400 border-t border-gray-900">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-white font-bold text-lg mb-2">GitSync</div>
              <p>© {new Date().getFullYear()} All rights reserved.</p>
            </div>
          <div className="flex gap-6">
  <a
    href="https://github.com/harshsaini0707"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-white"
  >
    <Github className="w-5 h-5" />
  </a>
</div>

          </div>
        </footer>
      </main>
    </>
  );
}