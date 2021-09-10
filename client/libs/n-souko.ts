export const genre = [
  'broadcast',
  'pa',
  'venue',
  'pr',
  'transpotation',
  'oa',
  'other',
];
export type Genre = typeof genre[number];

export const deviceStatus = ['available', 'failure', 'reparing', 'remove'];
export type DeviceStatus = typeof deviceStatus[number];

export type AddProductResponse = {
  productId: string;
};

export type AddDeviceResponse = {
  error?: string;
  deviceId: string;
  code: string;
  productName: string;
};

export type ChangeDeviceResponse = {
  error?: string;
  status?: string;
  device: {
    _id: string;
    productId: string;
    containerId: string;
    status: string;
    serialNumber: string;
    remarks: string;
    code: string;
  };
  product: {
    _id: string;
    name: string;
    maker: {
      name: string;
    };
    genre: string;
  };
};

export class Souko {
  private _baseURL: string;
  private _fetchPOSTOption = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };

  constructor() {
    this._baseURL = 'http://192.168.38.140:53894';
    // this._baseURL = 'http://localhost:53894';
  }

  public async addProduct(o: {
    name: string;
    maker: { name: string };
    genre: Genre;
  }): Promise<AddProductResponse> {
    console.log('addSouko with souko');
    const res = await fetch(`${this._baseURL}/products`, {
      ...this._fetchPOSTOption,
      body: JSON.stringify(o),
    });
    const json = await res.json();
    return json as AddProductResponse;
  }

  public async addDevice(
    productId: string,
    o: {
      containerCode: string;
      status: DeviceStatus;
      serialNumber: string;
      remarks: string;
    }
  ): Promise<AddDeviceResponse> {
    console.log('addDevice with souko');
    const res = await fetch(
      `${this._baseURL}/products/id/${productId}/devices`,
      {
        ...this._fetchPOSTOption,
        body: JSON.stringify(o),
      }
    );
    const json = await res.json();
    return json as AddDeviceResponse;
  }

  public async changeDeviceWithCode(
    deviceCode: string,
    o: {
      status: DeviceStatus;
      containerCode: string;
    }
  ): Promise<ChangeDeviceResponse> {
    console.log('changeDeviceWithCode with souko');
    const res = await fetch(`${this._baseURL}/devices/code/${deviceCode}`, {
      ...this._fetchPOSTOption,
      body: JSON.stringify(o),
    });
    const json = await res.json();
    return json;
  }

  public async addContainer(o: {
    storageId: string;
    name: string;
  }): Promise<any> {
    console.log('addContainer with souko');
    const res = await fetch(`${this._baseURL}/containers`, {
      ...this._fetchPOSTOption,
      body: JSON.stringify(o),
    });
    const json = await res.json();
    return json;
  }

  public async getContainerWithCode(code: string): Promise<any> {
    const res = await fetch(`${this._baseURL}/containers/code/${code}`);
    if (res.status === 404) {
      return null;
    }

    const json = await res.json();
    return json;
  }
}
