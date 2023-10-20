import Safe, { SafeFactory } from "@gnosis.pm/safe-core-sdk";

async function main() {
  const safeFactory = await SafeFactory.create({ ethAdapter });

  const owners = ["0x<address>", "0x<address>", "0x<address>"];
  const threshold = 3;
  const safeAccountConfig = {
    owners,
    threshold,
  };

  const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
