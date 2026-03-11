import { useState } from "react";
import { Search, FileText, Loader2 } from "lucide-react";

const API_URL = "http://localhost:5000";

interface Source {
  documentName: string;
  pageNumber: number;
}

interface QueryResult {
  answer: string;
  sources: Source[];
  found: boolean;
}

export default function Query() {

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {

      const response = await fetch(`${API_URL}/api/chat/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      const data = await response.json();

      setResult(data);

    } catch (err) {

      setError("Connection lost. Please try again.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#1C1C1C] py-12 text-[#EAEAEA]">

      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}

        <div className="text-center mb-10">

          <h1 className="text-3xl font-bold mb-2 text-[#EAEAEA]">
            Ask Your SOP Question
          </h1>

          <p className="text-gray-400">
            Get answers only from uploaded SOP documents
          </p>

        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="mb-10">

          <div className="bg-[#262626] backdrop-blur-xl border border-[#333333] rounded-2xl shadow-lg p-8">

            <div className="flex items-start space-x-4">

              <Search className="w-6 h-6 text-gray-400 mt-3" />

              <div className="flex-1">

                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full px-4 py-3 bg-[#202020] border border-[#333333] rounded-lg focus:ring-2 focus:ring-[#C08457] focus:border-[#C08457] resize-none text-gray-200"
                  rows={4}
                />

                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="mt-4 w-full bg-[#C08457] hover:opacity-90 px-6 py-3 rounded-lg font-medium text-black flex items-center justify-center transition transform hover:scale-[1.02] disabled:bg-gray-600"
                >

                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating answer...
                    </>
                  ) : (
                    "Get Answer"
                  )}

                </button>

              </div>

            </div>

          </div>

        </form>

        {/* Error */}

        {error && (

          <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>

        )}

        {/* Answer */}

        {result && (

          <div className="bg-[#262626] backdrop-blur-xl border border-[#333333] rounded-2xl shadow-lg p-8 mb-6">

            <h2 className="text-xl font-semibold mb-4">
              Answer
            </h2>

            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {result.answer}
            </p>

            {/* Sources */}

            {result.sources && result.sources.length > 0 && (

              <div className="mt-6 pt-6 border-t border-[#333333]">

                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#C08457]" />
                  Source Citations
                </h3>

                <div className="space-y-3">

                  {result.sources.map((source, index) => (

                    <div
                      key={index}
                      className="bg-[#202020] border border-[#333333] rounded-xl p-4 hover:border-[#C08457] transition"
                    >

                      <p className="font-medium text-gray-200">
                        {source.documentName}
                      </p>

                      <p className="text-sm text-gray-400">
                        Page {source.pageNumber}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );
}