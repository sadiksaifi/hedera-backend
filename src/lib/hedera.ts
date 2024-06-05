import {
  LoggerTransports,
  SDK,
  StableCoin,
  type RequestPrivateKey,
  type RequestAccount,
  KYCRequest,
} from "@hashgraph/stablecoin-npm-sdk";

import {
  AccountBalanceQuery,
  Client,
  Hbar,
  PrivateKey,
  PublicKey,
  TokenAssociateTransaction,
  TokenCreateTransaction,
  TokenFreezeTransaction,
  TokenMintTransaction,
  TokenUnfreezeTransaction,
  TransferTransaction,
} from "@hashgraph/sdk";

SDK.log = {
  level: process.env.REACT_APP_LOG_LEVEL ?? "ERROR",
  transports: new LoggerTransports.Console(),
};

const privateKey: RequestPrivateKey = {
  key: "3030020100300706052b8104000a04220420343ad4938691fd2cdcb063796e88d12149ebee164e3b5b40540c25a5e943e0ea",
  type: "ECDSA",
};

const publicKey: PublicKey = PublicKey.fromString(
  "302d300706052b8104000a0322000341c16a68cbd4e1d76ee39485d50be3a61e4f39ac321cec6cc7feb11059417e37"
);
const account: RequestAccount = {
  accountId: "0.0.4384106",
  privateKey: privateKey,
};

const manusAccount = {
  accountId: "0.0.4340817",
  privateKey:
    "0x343ad4938691fd2cdcb063796e88d12149ebee164e3b5b40540c25a5e943e0ea",
};

const CurrentCoin = {
  id: "0.0.4394380",
} as const;

// TODO: get from sdk
enum CNST {
  FactoryAddressTestnet = "0.0.2167166",
  HederaTokenManagerAddressTestnet = "0.0.2167020",
}

const pK = PrivateKey.fromStringDer(privateKey.key);
const client = Client.forTestnet();
client.setOperator(account.accountId, pK);

const createStableCoin = async () => {
  try {
    //Create the transaction and freeze for manual signing
    const signTx = await new TokenCreateTransaction()
      .setTokenName("My Token Name")
      .setTokenSymbol("MTN")
      .setTreasuryAccountId(account.accountId)
      .setInitialSupply(5000)
      .setMaxTransactionFee(new Hbar(30)) //Change the default max transaction fee
      .setAdminKey(publicKey)
      .setSupplyKey(publicKey)
      .setFreezeKey(publicKey)
      .freezeWith(client)
      .sign(pK);

    //Sign the transaction with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the token ID from the receipt
    const tokenId = receipt.tokenId;

    console.log("The new token ID is " + tokenId);
    //
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

const cashIn = async ({ tokenId }: { tokenId: string }) => {
  try {
    const signTx = await new TokenMintTransaction()
      .setTokenId(tokenId)
      .setAmount(1000)
      // .setMaxTransactionFee(new Hbar(20)) //Use when HBAR is under 10 cents
      .freezeWith(client)
      .sign(pK);

    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    console.log(
      `The transaction consensus status ${receipt.status.toString()}`
    );
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      console.log("error caught ^");
    }
  }
};

const grantKyc = async ({
  tokenId,
  targetId,
}: {
  tokenId: string;
  targetId: string;
}) => {
  const success = await StableCoin.grantKyc(
    new KYCRequest({
      tokenId: tokenId,
      targetId: targetId,
    })
  );

  if (success) {
    console.log(`pass - granted kyc to ${account.accountId}`);
  } else {
    console.log(`fail - not granted kyc to ${account.accountId}`);
  }
  return;
};

const associate = async ({
  account,
  tokenId,
}: {
  account: {
    key: string;
    id: string;
  };
  tokenId: string;
}) => {
  try {
    const accountPrivateKey = PrivateKey.fromStringECDSA(account.key);
    //TOKEN ASSOCIATION WITH ACCOUNT
    let associateTx = await new TokenAssociateTransaction()
      .setAccountId(account.id)
      .setTokenIds([tokenId])
      .freezeWith(client)
      .sign(pK);

    let associateTxSubmit = await associateTx.execute(client);
    let associateRx = await associateTxSubmit.getReceipt(client);

    console.log(`Token association with account: ${associateRx.status} \n`);
  } catch (err) {
    console.error(err);
    console.log("error caught ^");
  }
};

const transferCoin = async ({
  id,
  from,
  to,
  amount,
}: {
  id: string;
  from: string;
  to: string;
  amount: number;
}) => {
  try {
    const tokenTransferTx = await new TransferTransaction()
      .addTokenTransfer(id, from, -1 * amount)
      .addTokenTransfer(id, to, amount)
      .freezeWith(client)
      .sign(pK);

    const tokenTransferSubmit = await tokenTransferTx.execute(client);

    const tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

    console.log(tokenTransferSubmit.toJSON());
    console.log(tokenTransferRx.toJSON());
    console.log(
      `\n- Stablecoin transfer from Treasury to Alice: ${tokenTransferRx.status} \n`
    );
  } catch (err) {
    console.error(err);
    console.log("caught error ^");
  }
};

/**
 *
 * get balance of `$accountId` for BaldevCoin only
 */
const getTreasury = async ({ accountId: accountId }: { accountId: string }) => {
  const balanceCheckTx = await new AccountBalanceQuery()
    .setAccountId(accountId)
    .execute(client);

  const tokens = Object.fromEntries(
    balanceCheckTx.toJSON().tokens.map((token) => [token.tokenId, token])
  );

  console.log(tokens);

  console.log(
    `- Treasury balance: ${tokens[CurrentCoin.id].balance} units of token ID ${tokens[CurrentCoin.id].tokenId
    }`
  );
};

const freezeStableCoin = async ({
  addressId,
  tokenId,
}: {
  addressId: string;
  tokenId: string;
}) => {
  //Freeze an account from transferring a token
  const signTx = await new TokenFreezeTransaction()
    .setAccountId(addressId)
    .setTokenId(tokenId)
    .freezeWith(client)
    .sign(pK);

  //Submit the transaction to a Hedera network
  const txResponse = await signTx.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the transaction consensus status
  const transactionStatus = receipt.status;

  console.log(
    "The transaction consensus status " + transactionStatus.toString()
  );
};

const unfreezeStableCoin = async ({
  addressId,
  tokenId,
}: {
  addressId: string;
  tokenId: string;
}) => {
  //Unfreeze an account and freeze the unsigned transaction for signing
  const signTx = await new TokenUnfreezeTransaction()
    .setAccountId(addressId)
    .setTokenId(tokenId)
    .freezeWith(client)
    .sign(pK);

  //Submit the transaction to a Hedera network
  const txResponse = await signTx.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Obtain the transaction consensus status
  const transactionStatus = receipt.status;

  console.log(
    "The transaction consensus status is " + transactionStatus.toString()
  );
};

export {
  createStableCoin,
  cashIn,
  grantKyc,
  associate,
  transferCoin,
  getTreasury, // get balance
  freezeStableCoin,
  unfreezeStableCoin,
};
