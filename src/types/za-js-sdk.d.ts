declare module 'za-js-sdk' {
  interface ZAConfig {
    useProto3?: boolean;
    debug?: boolean;
  }

  interface ZA {
    config: (config: ZAConfig) => void;
    trackPageShow: () => void;
    trackEvent: (event: any, extra?: any) => void;
    trackShow: (location: any, extra?: any) => void;
  }

  const za: ZA;
  export default za;
}


