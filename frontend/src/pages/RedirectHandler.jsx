import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function RedirectHandler() {
  const { code } = useParams();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const res = await fetch(`http://localhost:5000/${code}`);
        if (res.redirected) {
          window.location.href = res.url;
        } else {
          const data = await res.json();
          alert(data.message || 'Error: Unable to redirect');
        }
      } catch (err) {
        console.error(err);
        alert('Error: Unable to redirect');
      }
    };

    fetchAndRedirect();
  }, [code]);

  return <div>Redirecting...</div>;
}