const getExplorerLink = (selectedChain) => {
    switch (selectedChain) {
      case 'ethereum':
        return `https://etherscan.io/tx/`
      case 'solana':
        return `https://explorer.solana.com/tx/`
      case 'polygon':
        return `https://polygonscan.com/tx/`

      default:
        return '' 
    }
}

export default getExplorerLink;
