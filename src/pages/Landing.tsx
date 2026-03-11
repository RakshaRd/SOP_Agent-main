import { Brain, FileText, Search, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#1C1C1C] text-[#EAEAEA] relative overflow-hidden">

      {/* subtle gradient glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 blur-3xl bg-gradient-to-r from-[#262626] via-[#1C1C1C] to-[#262626]"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-24">

        {/* HEADER */}
        <div className="text-center mb-20">

          <div className="flex justify-center mb-6">
            <Brain className="w-20 h-20 text-[#C08457]" />
          </div>

          <h1 className="text-5xl font-bold mb-4 text-[#EAEAEA]">
            OpsMind AI
          </h1>

          <p className="text-2xl text-gray-300 mb-6">
            Your Enterprise SOP Knowledge Brain
          </p>

          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            Context-aware corporate knowledge system that provides accurate answers
            from your Standard Operating Procedures with exact source citations.
          </p>

          {/* AI typing animation */}
          <div className="flex justify-center mb-10">
            <div className="flex space-x-2 bg-[#262626] px-6 py-3 rounded-xl border border-[#333333]">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>

          <div className="flex justify-center space-x-6">

            <Link
              to="/query"
              className="bg-[#C08457] px-8 py-3 rounded-lg text-lg font-medium text-black hover:opacity-90 transition transform hover:scale-105 shadow-lg"
            >
              Ask a Question
            </Link>

            <Link
              to="/admin"
              className="border border-[#444444] px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#262626] transition transform hover:scale-105"
            >
              Admin
            </Link>

          </div>
        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-[#262626] backdrop-blur-xl p-8 rounded-2xl border border-[#333333] hover:border-[#C08457] transition shadow-lg hover:scale-105">
            <FileText className="w-12 h-12 text-[#C08457] mb-4" />
            <h3 className="text-xl font-semibold mb-3">Upload SOPs</h3>
            <p className="text-gray-400">
              Administrators can easily upload PDF documents containing
              Standard Operating Procedures.
            </p>
          </div>

          <div className="bg-[#262626] backdrop-blur-xl p-8 rounded-2xl border border-[#333333] hover:border-[#C08457] transition shadow-lg hover:scale-105">
            <Search className="w-12 h-12 text-[#C08457] mb-4" />
            <h3 className="text-xl font-semibold mb-3">Smart Retrieval</h3>
            <p className="text-gray-400">
              Advanced RAG pipeline retrieves the most relevant information
              from your knowledge base.
            </p>
          </div>

          <div className="bg-[#262626] backdrop-blur-xl p-8 rounded-2xl border border-[#333333] hover:border-[#C08457] transition shadow-lg hover:scale-105">
            <Shield className="w-12 h-12 text-[#C08457] mb-4" />
            <h3 className="text-xl font-semibold mb-3">No Hallucinations</h3>
            <p className="text-gray-400">
              Answers are generated strictly from uploaded documents with
              exact source citations.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}