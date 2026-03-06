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

    <div className="min-h-screen bg-gray-50 py-12">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ask Your SOP Question
          </h1>

          <p className="text-gray-600">
            Get answers only from uploaded SOP documents
          </p>

        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="mb-8">

          <div className="bg-white rounded-lg shadow-md p-6">

            <div className="flex items-start space-x-4">

              <Search className="w-6 h-6 text-gray-400 mt-3" />

              <div className="flex-1">

                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />

                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
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

          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>

        )}

        {/* Answer */}

        {result && (

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">

            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Answer
            </h2>

            <p className="text-gray-700 whitespace-pre-wrap">
              {result.answer}
            </p>

            {/* Sources */}

            {result.sources && result.sources.length > 0 && (

              <div className="mt-6 pt-6 border-t">

                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Source Citations
                </h3>

                <div className="space-y-2">

                  {result.sources.map((source, index) => (

                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                    >

                      <p className="font-medium text-gray-900">
                        {source.documentName}
                      </p>

                      <p className="text-sm text-gray-600">
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