"use client";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

export default function Home() {
  const router = useRouter();
  const onClick = () => router.push("/sign-up");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 mt-10">
      <h1 className="text-4xl font-bold text-gray-900">
        GitSync: The Ultimate Project Knowledge Assistant
      </h1>

      <p className="text-base md:text-lg font-inter text-gray-800 leading-relaxed tracking-normal">
        <span className="block font-semibold text-gray-900 text-xl mb-3">
          GitSync makes your entire project knowledge instantly accessible.
        </span>
        It’s a smart development assistant that turns your codebase, team work, and commit history into a
        <span className="bg-purple-100 px-2 py-1 rounded-md text-purple-700 font-medium ml-1">searchable brain</span>.
        <br />
        No more 
        <span className="text-red-600 font-semibold mx-1">digging</span> 
        through folders—just 
        <span className="bg-purple-100 px-2 py-1 rounded-md text-purple-700 font-medium mx-1">ask questions</span> 
        and get instant answers.
        <br />
        It automatically 
        <span className="text-blue-600 font-semibold mx-1">backs up</span> 
        your code to a secure location with 
        <span className="text-yellow-600 font-semibold mx-1">full context</span>.
        <br />
        You can even upload 
        <span className="text-pink-600 font-medium mx-1">meeting recordings</span>—
        GitSync will summarize and surface all 
        <span className="text-pink-700 font-medium mx-1">issues raised</span> and 
        <span className="text-indigo-600 font-medium mx-1">timestamp</span> 
        the key decisions and action items.
        <br />
        It’s like 
        <span className="italic text-green-600 font-medium mx-1">your project got a memory</span>,
        and it actually 
        <span className="italic text-black font-semibold">remembers the stuff that matters</span>.
      </p>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Primary Focus: <span className="text-purple-700">Instant Knowledge Access</span>
        </h2>
        <p className="text-gray-700 leading-relaxed text-base md:text-lg">
          GitSync's most important feature is its
          <span className="text-indigo-600 font-medium ml-1">natural language interface</span>.
          <br className="hidden md:block" />
          <span className="text-gray-900 font-semibold">
            Instead of manually navigating
          </span> complex directories or searching through disorganized files, you can simply ask a question.
          <br />
          For example:
          <code className="bg-gray-100 px-2 py-1 rounded text-sm text-purple-600 mx-1">
            Show me how to initialize an AgentExecutor
          </code>
          , and it will immediately
          <span className="text-blue-700 font-medium mx-1">fetch the exact code snippets</span>
          and relevant documentation you need.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Integrated Intelligence and Project Management
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 text-base md:text-lg">
          <li>
            <strong>Robust Code Backup:</strong> Automatically or manually sync your source code to a secure, centralized location. Ensures work is never lost and gives GitSync full context of your codebase.
          </li>
          <li>
            <strong>Comprehensive Git Insights:</strong> Analyze your Git history to ask targeted questions like,
            <em> What was the code fix for the user authentication issue we worked on last week?</em> and get meaningful summaries of relevant commits.
          </li>
          <li>
            <strong>Intelligent Meeting Management:</strong> Upload audio recordings of meetings to get auto-processed, timestamped summaries. Keep a detailed, searchable record of decisions and action items.
          </li>
        </ul>
      </section>

      <div className="pt-4">
        <Button onClick={onClick}>Get Started</Button>
      </div>
    </div>
  );
}
