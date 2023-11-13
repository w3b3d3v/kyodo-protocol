module.exports = async ({getNamedAccounts, deployments}) => {
	const {deploy} = deployments;
	const {deployer} = await getNamedAccounts();
	console.log(`Deployer: ${deployer}`);
  
	const salt = '0x'
  
	await deploy('KyodoRegistry', {
	  from: deployer,
	  args: [deployer],
	  log: true,
	  deterministicDeployment: salt
	});
  };
  
module.exports.tags = ['KyodoRegistry'];