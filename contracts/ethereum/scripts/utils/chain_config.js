const chainConfigs = {
    sepolia: {
        linkAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        routerAddress: "0xd0daae2231e9cb96b94c8512223533293c3693bf",
        chainSelector: "16015286601757825753",
        token: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
        feePercentage: "500",
        kyodoTreasuryFee: "500",
        communityDAOFee: "500",
        live: true,
        subgraphPathSchema: "../graphs/subgraphs/sepolia_kyodo_agreements/subgraph.yaml",
    },
    optimismGoerli: {
        linkAddress: "0xdc2CC710e42857672E7907CF474a69B63B93089f",
        routerAddress: "0xeb52e9ae4a9fb37172978642d4c141ef53876f26",
        chainSelector: "2664363617261496610",
        token: "0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16",
        feePercentage: "500",
        kyodoTreasuryFee: "500",
        communityDAOFee: "500",
        live: false,
    },
    polygonMumbai: {
        linkAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        routerAddress: "0x70499c328e1e2a3c41108bd3730f6670a44595d1",
        chainSelector: "12532609583862916517",
        token: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40",
        feePercentage: "500",
        kyodoTreasuryFee: "500",
        communityDAOFee: "500",
        live: true,
        
    },
    bnbTesnet: {
        linkAddress: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
        routerAddress: "0x9527e2d01a3064ef6b50c1da1c0cc523803bcff2",
        chainSelector: "13264668187771770619",
        token: "0xbfa2acd33ed6eec0ed3cc06bf1ac38d22b36b9e9",
        feePercentage: "500",
        kyodoTreasuryFee: "500",
        communityDAOFee: "500",
        live: false,
    },
    baseGoerli: {
        linkAddress: "0xd886e2286fd1073df82462ea1822119600af80b6",
        routerAddress: "0xa8c0c11bf64af62cdca6f93d3769b88bdd7cb93d",
        chainSelector: "5790810961207155433",
        token: "0xbf9036529123de264bfa0fc7362fe25b650d4b16",
        feePercentage: "500",
        kyodoTreasuryFee: "500",
        communityDAOFee: "500",
        live: false,
    },
    avalancheFuji: {
        linkAddress: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
        routerAddress: "0x554472a2720e5e7d5d3c817529aba05eed5f82d8",
        chainSelector: "14767482510784806043",
        token: "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4",
        feePercentage: "500",
        kyodoTreasuryFee: "500",
        communityDAOFee: "500",
        live: true,
    },
    hardhat: {
        linkAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        routerAddress: "0xd0daae2231e9cb96b94c8512223533293c3693bf",
        chainSelector: "0",
        token: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
        feePercentage: "500",
        kyodoTreasuryFee: "500",
        communityDAOFee: "500",
        live: false,
    },
    localhost: {
        linkAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        routerAddress: "0xd0daae2231e9cb96b94c8512223533293c3693bf",
        chainSelector: "0",
        token: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
        feePercentage: "500",
        kyodoTreasuryFee: "500",
        communityDAOFee: "500",
        live: false,
    }
}

const chainIdList = ["11155111", "420", "80001", "97", "84531", "43113", "31337"];
const chainSelectorList = ["16015286601757825753", "2664363617261496610", "12532609583862916517", "13264668187771770619", "5790810961207155433", "14767482510784806043", "0"];

module.exports = { chainConfigs, chainIdList, chainSelectorList }
