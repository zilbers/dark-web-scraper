import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useSearch(pageNumber, query, sorting) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [logs, setLogs] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLogs([]);
  }, [query, sorting]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: `/api/data/_bins/${pageNumber}`,
      params: { q: query },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        console.log(res);
        setLogs((prevLogs) => {
          return [...prevLogs, ...res.data];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber, sorting]);
  // }, [pageNumber]);

  return { loading, error, logs, hasMore };
}
