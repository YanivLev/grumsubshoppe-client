export interface ICloverStyles {
    body?: Record<string, string>;
    input?: Record<string, string>;
    'input:focus'?: Record<string, string>;
    [selector: string]: Record<string, string> | undefined;
}

export interface ICloverSDK {
    elements: () => { create: (type: string, options?: ICloverStyles) => { mount: (selector: string) => void } };
    createToken: () => Promise<{ token?: string; errors?: Record<string, string> }>;
}
      

      