#!/bin/bash

#!/bin/bash

# Check if an argument was provided
if [ -z "$1" ]; then
  echo "No environment specified. Usage: ./deploy.sh [env]"
  exit 1
fi

# Store the argument
env="$1"

# Perform actions based on the argument
if [ "$env" == "devnet" ]; then
  echo "Deploying to devnet..."
  # Add your deployment logic for devnet here
  # Get the directory of the script
    DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

    # Construct the path to the .env.development.local file
    ENV_FILE="$DIR/../../../.env.development.local"

    # Build the program
    echo "Building the program..."
    anchor build

    # Deploy the program and capture the Program ID
    echo "Deploying the program..."
    DEPLOY_OUTPUT=$(anchor deploy --provider.cluster devnet)
    echo "$DEPLOY_OUTPUT"

    # Extract the Program ID from the deploy output using awk
    PROGRAM_ID=$(echo "$DEPLOY_OUTPUT" | awk '/Program Id:/ {print $3}')

    # Check if the Program ID is already in the .env.development.local file and replace it if necessary
    if grep -q "NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS" "$ENV_FILE"; then
        sed -i.bak "s/NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS=.*/NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS=$PROGRAM_ID/" "$ENV_FILE"
        rm -f "$ENV_FILE.bak"
    else
        echo "NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS=$PROGRAM_ID" >> "$ENV_FILE"
    fi

    # Deploy the fake Stablecoin
    echo "Creating fake token..."
    DEPLOY_FAKE_STABLE_OUTPUT=$(ts-node $DIR/createFakeToken.ts)
    echo "$DEPLOY_FAKE_STABLE_OUTPUT"

elif [ "$env" == "testnet" ]; then
  echo "Deploying to testnet..."
    # Get the directory of the script
    DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

    # Construct the path to the .env.development.local file
    ENV_FILE="$DIR/../../../.env.development.local"

    # Build the program
    echo "Building the program..."
    anchor build

    # Check if the solana-test-validator is running
    if ! pgrep -x "solana-test-validator" > /dev/null
    then
        echo "Error: solana-test-validator is not running."
        echo "Please start solana-test-validator and try again."
        exit 1
    fi

    # Deploy the program and capture the Program ID
    echo "Deploying the program..."
    DEPLOY_OUTPUT=$(anchor deploy)
    echo "$DEPLOY_OUTPUT"

    # Extract the Program ID from the deploy output using awk
    PROGRAM_ID=$(echo "$DEPLOY_OUTPUT" | awk '/Program Id:/ {print $3}')

    # Check if the Program ID is already in the .env.development.local file and replace it if necessary
    if grep -q "NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS" "$ENV_FILE"; then
        sed -i.bak "s/NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS=.*/NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS=$PROGRAM_ID/" "$ENV_FILE"
        rm -f "$ENV_FILE.bak"
    else
        echo "NEXT_PUBLIC_SOLANA_AGREEMENT_CONTRACT_ADDRESS=$PROGRAM_ID" >> "$ENV_FILE"
    fi

elif [ "$env" == "mainnet" ]; then
  echo "Deploying to mainnet..."
  # Add your deployment logic for mainnet here
else
  echo "Unknown environment: $env"
  exit 1
fi