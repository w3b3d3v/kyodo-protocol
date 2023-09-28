#!/bin/bash

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
