const chainConfigs = {
    sepolia: { linkAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789", routerAddress: "0xd0daae2231e9cb96b94c8512223533293c3693bf", chainSelector: "16015286601757825753" },
    optimismGoerli: { linkAddress: "0xdc2CC710e42857672E7907CF474a69B63B93089f", routerAddress: "0xeb52e9ae4a9fb37172978642d4c141ef53876f26", chainSelector: "2664363617261496610" },
    polygonMumbai: { linkAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB", routerAddress: "0x70499c328e1e2a3c41108bd3730f6670a44595d1", chainSelector: "12532609583862916517" },
    bnbTesnet: { linkAddress: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06", routerAddress: "0x9527e2d01a3064ef6b50c1da1c0cc523803bcff2", chainSelector: "13264668187771770619" },
    baseGoerli: { linkAddress: "0xd886e2286fd1073df82462ea1822119600af80b6", routerAddress: "0xa8c0c11bf64af62cdca6f93d3769b88bdd7cb93d", chainSelector: "5790810961207155433" },
    avalancheFuji: { linkAddress: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846", routerAddress: "0x554472a2720e5e7d5d3c817529aba05eed5f82d8", chainSelector: "14767482510784806043" },
    hardhat: { linkAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789", routerAddress: "0xd0daae2231e9cb96b94c8512223533293c3693bf", chainSelector: "16015286601757825753" },
}

const chainIdList = [11155111, 420, 80001, 97, 84531, 43113];
const chainSelectorList = ["16015286601757825753", "2664363617261496610", "12532609583862916517", "13264668187771770619", "5790810961207155433", "14767482510784806043"];

module.exports = {chainConfigs, chainIdList, chainSelectorList}
    