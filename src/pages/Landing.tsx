import { Brain, FileText, Search, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Brain className="w-20 h-20 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            OpsMind AI
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Your Enterprise SOP Knowledge Brain
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
            Context-aware corporate knowledge system that provides accurate answers
            from your Standard Operating Procedures with exact source citations.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/query"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Ask a Question
            </Link>
            <Link
              to="/admin"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FileText className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upload SOPs</h3>
            <p className="text-gray-600">
              Administrators can easily upload PDF documents containing Standard Operating Procedures.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Search className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Retrieval</h3>
            <p className="text-gray-600">
              Advanced RAG pipeline retrieves the most relevant information from your knowledge base.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Shield className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Hallucinations</h3>
            <p className="text-gray-600">
              Answers are generated strictly from uploaded documents with exact source citations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
