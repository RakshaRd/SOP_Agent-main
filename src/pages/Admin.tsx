import { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000';

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  totalPages: number;
  fileSize: number;
  chunkCount: number;
}

export default function Admin() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/documents`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadStatus({ type: "error", message: "Please upload a PDF file" });
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("pdf", file);

    try {

      const response = await fetch(`${API_URL}/api/admin/upload`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      setUploadStatus({
        type: "success",
        message: "Document uploaded successfully"
      });

      fetchDocuments();

    } catch (error) {

      setUploadStatus({
        type: "error",
        message: "Failed to upload document"
      });

    } finally {

      setUploading(false);

    }

  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/documents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      setUploadStatus({ type: 'success', message: 'Document deleted successfully' });
      fetchDocuments();
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Failed to delete document' });
      console.error('Delete error:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  return (
    <div className="min-h-screen bg-[#1C1C1C] py-12 text-[#EAEAEA]">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2 text-[#EAEAEA]">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Manage your SOP document library
          </p>
        </div>

        {/* UPLOAD CARD */}
        <div className="bg-[#262626] backdrop-blur-xl border border-[#333333] rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Upload className="w-6 h-6 mr-2 text-[#C08457]" />
            Upload New SOP Document
          </h2>

          <div className="border-2 border-dashed border-[#333333] rounded-xl p-10 text-center hover:border-[#C08457] transition">

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="file-upload"
            />

            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">

              {uploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-[#C08457] mb-4 animate-spin" />
                  <p className="text-gray-400">Processing document...</p>
                </>
              ) : (
                <>
                  <FileText className="w-12 h-12 text-gray-500 mb-4" />
                  <p className="text-gray-300 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF files only (Max 10MB)
                  </p>
                </>
              )}

            </label>
          </div>

          {uploadStatus.type && (
            <div
              className={`mt-5 p-4 rounded-lg flex items-center ${uploadStatus.type === "success"
                  ? "bg-green-900/30 text-green-400"
                  : "bg-red-900/30 text-red-400"
                }`}
            >
              {uploadStatus.type === "success" ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {uploadStatus.message}
            </div>
          )}

        </div>

        {/* DOCUMENT TABLE */}
        <div className="bg-[#262626] backdrop-blur-xl border border-[#333333] rounded-2xl shadow-lg overflow-hidden">

          <div className="px-6 py-4 border-b border-[#333333]">
            <h2 className="text-xl font-semibold">
              Uploaded Documents ({documents.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-[#C08457] mx-auto mb-4 animate-spin" />
              <p className="text-gray-400">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No documents uploaded yet</p>
            </div>
          ) : (

            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-[#202020] border-b border-[#333333]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">
                      Document Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">
                      Upload Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">
                      Pages
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">
                      Chunks
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#333333]">

                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#202020] transition">

                      <td className="px-6 py-4 flex items-center">
                        <FileText className="w-5 h-5 text-[#C08457] mr-2" />
                        <span className="text-sm">{doc.name}</span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(doc.uploadDate)}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-400">
                        {doc.totalPages}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-400">
                        {doc.chunkCount}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatFileSize(doc.fileSize)}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(doc.id, doc.name)}
                          className="flex items-center text-red-400 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            </div>

          )}

        </div>

      </div>
    </div>
  );

}
