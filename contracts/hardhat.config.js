require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.5.3",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/xGFaw_LYv1Fg9dyHAiyVA4cUMOAApxZd"
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "2XEAQN2TAE7YABRYMR2HFEMCRXYUB9EDQC"
  }
};
