import useAuth0Service from './useAuth0Service';
import useFetch from './useFetch';

const deviceStatus = ['available', 'failure', 'reparing', 'remove'];
type DeviceStatus = typeof deviceStatus[number];

const useDevice = () => {
  const { getToken } = useAuth0Service();
  const { get, post } = useFetch();

  const addDeviceWithProductId = async (
    productId: string,
    o: {
      containerCode: string;
      status: DeviceStatus;
      serialNumber: string;
      remarks: string;
    }
  ) => {
    const token = await getToken();

    const res = await post(`/products/id/${productId}/devices`, o, token);
    const json = await res.json();
    return json;
  };

  const changeDeviceWithCode = async (
    deviceCode: string,
    o: {
      status: DeviceStatus;
      containerCode: string;
    }
  ) => {
    const token = await getToken();

    const res = await post(`/devices/code/${deviceCode}`, o, token);
    const json = await res.json();
    return json;
  };

  return { addDeviceWithProductId, changeDeviceWithCode };
};

export default useDevice;
