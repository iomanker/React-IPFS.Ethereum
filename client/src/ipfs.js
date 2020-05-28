const IPFS = require('ipfs-http-client');

const ipfs = IPFS('/ip4/127.0.0.1/tcp/5001');
// const ipfs = IPFS({host: '127.0.0.1', port: '5001', protocol: 'http'});

export default ipfs;