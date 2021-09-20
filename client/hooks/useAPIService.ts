import useFetch from './useFetch';

const useAPIService = () => {
  const { get, post } = useFetch();

  const checkConnection = async (): Promise<{
    status?: string;
    error?: string;
  }> => {
    return await get(`/`)
      .then(async (res: Response) => {
        return { status: 'ok' };
      })
      .catch((err: Error) => {
        return { error: err.message };
      });
  };

  return { checkConnection };
};

export default useAPIService;
