const _baseURL = 'https://api.dev.0x267.nectarition.jp';
// const _baseURL = 'http://localhost:53894';

const useFetch = () => {
  const get = (endpoint: string, accessToken?: string) => {
    return fetch(`${_baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
  };

  const post = (endpoint: string, data: any, accessToken?: string) => {
    return fetch(`${_baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(data),
    });
  };

  return { get, post };
};

export default useFetch;
