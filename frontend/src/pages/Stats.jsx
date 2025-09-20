import React, { useEffect, useState } from 'react';
import { getStats } from '../api/urlApi';
import { useParams } from 'react-router-dom';

export default function Stats() {
  const { code } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getStats(code).then((res) => {
      if (res.message) {
        setData({ error: res.message });
      } else {
        setData(res);
      }
    });
  }, [code]);

  if (!data) return <div className="p-6">Loading...</div>;
  if (data.error) return <div className="p-6 text-red-500">{data.error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Stats for {data.shortCode}</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">Short URL</p>
          <a href={data.shortUrl} target="_blank" rel="noreferrer" className="text-cyan-600">
            {data.shortUrl}
          </a>
        </div>

        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">Clicks</p>
          <p className="text-xl font-bold">{data.clicks}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Recent clicks</h3>
        <ul className="space-y-2">
          {data.clickHistory.length === 0 && <li className="text-sm text-gray-500">No clicks yet</li>}
          {data.clickHistory.map((c, i) => (
            <li key={i} className="p-3 border rounded">
              <div className="text-sm text-gray-600">{new Date(c.timestamp).toLocaleString()}</div>
              <div className="text-xs text-gray-500">Referrer: {c.referrer}</div>
              <div className="text-xs text-gray-500 truncate">UA: {c.userAgent}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
