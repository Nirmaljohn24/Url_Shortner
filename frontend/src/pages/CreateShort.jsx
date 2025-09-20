import React, { useState } from 'react';
import { createShortUrl } from '../api/urlApi';

export default function CreateShort() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await createShortUrl(url);
      if (data.message) {
        alert(data.message);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      alert('Error creating short URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">URL Shortener</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 rounded border"
          required
        />
        <button className="px-4 py-2 bg-cyan-500 text-white rounded font-bold" disabled={loading}>
          {loading ? 'Creating...' : 'Create Short URL'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded bg-white shadow">
          <p className="text-sm">Original:</p>
          <p className="truncate">{result.originalUrl}</p>

          <p className="text-sm mt-3">Short URL:</p>
          <div className="flex items-center gap-2">
            <a href={result.shortUrl} target="_blank" rel="noreferrer" className="text-cyan-600 underline">
              {result.shortUrl}
            </a>
            <button
              className="px-2 py-1 border rounded text-sm"
              onClick={() => navigator.clipboard.writeText(result.shortUrl)}
            >
              Copy
            </button>
            <a
              href={`/` + result.shortCode + '/stats'}
              className="text-sm ml-auto text-gray-600"
            >
              View stats
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
