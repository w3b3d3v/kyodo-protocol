module.exports = async ({getNamedAccounts, deployments}) => {
	const {deploy} = deployments;
	const {deployer} = await getNamedAccounts();
	await deploy('KyodoRegistry', {
	  from: deployer,
	  args: [deployer],
	  log: true,
	});
  };
  module.exports.tags = ['KyodoRegistry'];