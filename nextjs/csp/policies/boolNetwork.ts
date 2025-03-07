import type CspDev from 'csp-dev';

export function boolNetwork(): CspDev.DirectiveDescriptor {
  // we use Inter and Poppins in the app
  return {
    'connect-src': [
      '*.boolscan.com',
      'dev-api.boolscan.com',
      'alpha-api.boolscan.com',
      'test-api.boolscan.com',
      'https://dev-rpc-node-http.bool.network/',
      'https://beta-mainnet-api.deepsafe.network',
      'https://betamainnet-rpc-node-http.deepsafe.network',
    ],
  };
}
