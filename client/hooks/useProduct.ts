import useAuth0Service from './useAuth0Service';
import useFetch from './useFetch';

const genre = [
  'broadcast',
  'pa',
  'venue',
  'pr',
  'transpotation',
  'oa',
  'other',
];
type Genre = typeof genre[number];

const useProduct = () => {
  const { getToken } = useAuth0Service();
  const { get, post } = useFetch();

  const addProduct = async (o: {
    name: string;
    maker: { name: string };
    genre: Genre;
  }) => {
    const token = await getToken();

    const res = await post(`/products`, o, token);
    const json = await res.json();
    return json;
  };

  return { addProduct };
};

export default useProduct;
