import useAuth0Service from './useAuth0Service';
import useFetch from './useFetch';

const useContainer = () => {
  const { getToken } = useAuth0Service();
  const { get, post } = useFetch();

  const addContainer = async (o: { storageId: string; name: string }) => {
    const token = await getToken();

    const res = await post(`/containers`, o, token);
    const json = await res.json();
    return json;
  };

  const getContainer = async (code: string) => {
    const token = await getToken();

    const res = await get(`/containers/code/${code}`, token);
    if (res.status === 404) {
      return null;
    }

    const json = await res.json();
    return json;
  };

  return { addContainer, getContainer };
};

export default useContainer;
