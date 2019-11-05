module.exports = {
  networks: {
      development: {
          host: "127.0.0.1",
          port: 8545,
          network_id: "1001"
      }
  },
  compilers: {
      solc: {
          version: "0.5.12", // Fetch exact version from solc-bin (default: truffle's version)
      }
  }
};