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
  deviceId: string;
  code: string;
  productName: string;
};

export class Souko {
  private _baseURL: string;
  private _fetchPOSTOption = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };

  constructor() {
    // this._baseURL = 'http://192.168.38.140:53894';
    this._baseURL = 'http://localhost:53894';
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

  public changeContainerWithDeviceId(): void {}
  public changeStatusWithDeviceId(): void {}

  public async getContainerWithCode(code: string): Promise<any> {
    const res = await fetch(`${this._baseURL}/containers/code/${code}`);
    const json = await res.json();
    return json;
  }
}
