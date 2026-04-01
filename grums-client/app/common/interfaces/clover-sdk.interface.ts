export interface ICloverSDK {
    elements: () => { create: (type: string) => { mount: (selector: string) => void } };
    createToken: () => Promise<{ token?: string; errors?: Record<string, string> }>;
}
      

      