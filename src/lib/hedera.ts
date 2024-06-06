import {
  TAssociateCoin,
  TCashIn,
  TDeleteCoin,
  TFreeze,
  TNewCoin,
  TTransfer,
  TTreasuryData,
  TUnfreeze,
} from "@/schemas/coin";
import {
  Client,
  Hbar,
  PrivateKey,
  PublicKey,
  StatusError,
  ReceiptStatusError,
  BadKeyError,
  BadMnemonicError,
  PrecheckStatusError,
  TokenAssociateTransaction,
  TokenCreateTransaction,
  TokenDeleteTransaction,
  TokenFreezeTransaction,
  TokenInfoQuery,
  TokenMintTransaction,
  TokenUnfreezeTransaction,
  TransferTransaction,
  TokenWipeTransaction,
  TokenBurnTransaction,
  TokenPauseTransaction,
  TokenUnpauseTransaction,
  TokenUpdateTransaction,
} from "@hashgraph/sdk";
import {
  KYCRequest,
  LoggerTransports,
  type RequestAccount,
  type RequestPrivateKey,
  SDK,
  StableCoin,
} from "@hashgraph/stablecoin-npm-sdk";

SDK.log = {
  level: process.env.REACT_APP_LOG_LEVEL ?? "ERROR",
  transports: new LoggerTransports.Console(),
};

const privateKey: RequestPrivateKey = {
  // key:
  // "3030020100300706052b8104000a04220420343ad4938691fd2cdcb063796e88d12149ebee164e3b5b40540c25a5e943e0ea",
  key: "3030020100300706052b8104000a0422042091c9f0aaa4c3353fa40b4e1c4185839ce97f4bd4ccdb92084c242a8b2cd36158",
  type: "ECDSA",
};

const publicKey: PublicKey = PublicKey.fromString(
  // "302d300706052b8104000a0322000341c16a68cbd4e1d76ee39485d50be3a61e4f39ac321cec6cc7feb11059417e37"
  "302d300706052b8104000a032200039f7a137340e8d5d6e331d15749f3207ff861bd3f2630668845ba501eb3df5914"
);
const account: RequestAccount = {
  // accountId: "0.0.4384106",
  accountId: "0.0.4387498",
  privateKey: privateKey,
};

// const manusAccount = {
//   accountId: "0.0.4340817",
//   privateKey:
//     "0x343ad4938691fd2cdcb063796e88d12149ebee164e3b5b40540c25a5e943e0ea",
// };
//
// const CurrentCoin = {
//   id: "0.0.4394380",
// } as const;
//
// // TODO: get from sdk
// enum CNST {
//   FactoryAddressTestnet = "0.0.2167166",
//   HederaTokenManagerAddressTestnet = "0.0.2167020",
// }

export const pK = PrivateKey.fromStringDer(privateKey.key);
const client = Client.forTestnet();
client.setOperator(account.accountId, pK);

const createStableCoin = async ({
  name,
  symbol,
  initialSupply,
  maxTxFee,
}: TNewCoin) => {
  try {
    // Create the transaction and freeze for manual signing
    const signTx = await new TokenCreateTransaction()
      .setTokenName(name)
      .setTokenSymbol(symbol)
      .setTreasuryAccountId(account.accountId)
      .setInitialSupply(initialSupply)
      .setMaxTransactionFee(new Hbar(maxTxFee)) // Change the default max transaction fee
      .setAdminKey(publicKey)
      .setSupplyKey(publicKey)
      .setFreezeKey(publicKey)
      .freezeWith(client)
      .sign(pK);

    // Sign the transaction with the client operator private key and submit to a
    // Hedera network
    const txResponse = await signTx.execute(client);

    // Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    // Get the token ID from the receipt
    const tokenId = receipt.tokenId;

    console.log("The new token ID is " + tokenId);

    return receipt;
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

const cashIn = async ({ tokenId, amount }: TCashIn) => {
  try {
    const signTx = await new TokenMintTransaction()
      .setTokenId(tokenId)
      .setAmount(amount)
      // .setMaxTransactionFee(new Hbar(20)) //Use when HBAR is
      // under 10 cents
      .freezeWith(client)
      .sign(pK);

    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    return receipt;
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

const associate = async ({ account, tokenId }: TAssociateCoin) => {
  try {
    const accountPrivateKey = PrivateKey.fromStringECDSA(account.key);
    // TOKEN ASSOCIATION WITH ACCOUNT
    let associateTx = await new TokenAssociateTransaction()
      .setAccountId(account.id)
      .setTokenIds([tokenId])
      .freezeWith(client)
      .sign(PrivateKey.fromStringECDSA(account.key));

    let associateTxSubmit = await associateTx.execute(client);
    let associateRx = await associateTxSubmit.getReceipt(client);

    return associateRx;
  } catch (err) {
    if (
      err instanceof StatusError ||
      err instanceof ReceiptStatusError ||
      err instanceof BadKeyError ||
      err instanceof BadMnemonicError ||
      err instanceof PrecheckStatusError
    )
      throw new Error(err.message);
    else {
      throw new Error("Error Associating, recheck the account id and key");
      // console.error(err);
      // console.log("error caught ^");
    }
  }
};

const transferCoin = async ({ id, from, to, amount }: TTransfer) => {
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
    return tokenTransferRx;
  } catch (err) {
    console.error(err);
    console.log("caught error ^");
  }
};

const getCoinInfo = async ({ tokenId }: { tokenId: string }) => {
  const query = new TokenInfoQuery().setTokenId(tokenId);
  const coin = await query.execute(client);
  return coin;
};

/**
 *
 * get balance of `$accountId` for BaldevCoin only
 */
const getTreasury = async ({ accountId }: TTreasuryData) => {
  const res = await fetch(
    `https://testnet.mirrornode.hedera.com/api/v1/balances?account.id=${accountId}`,
    {
      method: "GET",
      headers: {},
    }
  );
  // DEPRICATED: https://hedera.com/blog/token-information-returned-by-getaccountinfo-and-getaccountbalance-to-be-deprecated
  // const balanceCheckTx = await new AccountBalanceQuery()
  //   .setAccountId(accountId)
  //   .execute(client);
  //
  // console.log(balanceCheckTx.toString());
  // const tokens = Object.fromEntries(
  //   balanceCheckTx.toJSON().tokens.map((token) => [token.tokenId, token])
  // );

  // console.log(tokens);

  // console.log(
  //   `- Treasury balance: ${tokens[CurrentCoin.id].balance} units of token ID
  //   ${
  //     tokens[CurrentCoin.id].tokenId
  //   }`
  // );
  return (await res.json()).balances[0].tokens;
};

const freezeStableCoin = async ({ addressId, tokenId }: TFreeze) => {
  // Freeze an account from transferring a token
  const signTx = await new TokenFreezeTransaction()
    .setAccountId(addressId)
    .setTokenId(tokenId)
    .freezeWith(client)
    .sign(pK);

  // Submit the transaction to a Hedera network
  const txResponse = await signTx.execute(client);

  // Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  // Get the transaction consensus status
  const transactionStatus = receipt.status;

  console.log(
    "The transaction consensus status " + transactionStatus.toString()
  );
  return receipt;
};

const unfreezeStableCoin = async ({ addressId, tokenId }: TUnfreeze) => {
  // Unfreeze an account and freeze the unsigned transaction for signing
  const signTx = await new TokenUnfreezeTransaction()
    .setAccountId(addressId)
    .setTokenId(tokenId)
    .freezeWith(client)
    .sign(pK);

  // Submit the transaction to a Hedera network
  const txResponse = await signTx.execute(client);

  // Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  // Obtain the transaction consensus status
  const transactionStatus = receipt.status;

  console.log(
    "The transaction consensus status is " + transactionStatus.toString()
  );
  return receipt;
};

const wipe = async ({
  privateKey,
  token,
  amount,
  accountId,
}: {
  privateKey: string;
  token: string;
  amount: number;
  accountId: string;
}) => {
  try {
    const tx = await new TokenWipeTransaction()
      .setAccountId(accountId)
      .setTokenId(token)
      .setAmount(amount)
      .freezeWith(client)
      .sign(PrivateKey.fromStringDer(privateKey));

    const signTx = await tx.sign(pK /* wipeKey */);
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Obtain the transaction consensus status
    const transactionStatus = receipt.status;

    return transactionStatus;
  } catch (err) {
    console.dir(err, { depth: null });
    if (err instanceof Error) console.log(err.message);

    throw new Error("failed to wipe amount");
  }
};

const burn = async ({
  supplyKey,
  token,
  amount,
}: {
  supplyKey: string;
  token: string;
  amount: number;
}) => {
  try {
    const signTx = await new TokenBurnTransaction()
      .setTokenId(token)
      .setAmount(amount)
      .freezeWith(client)
      .sign(PrivateKey.fromStringDer(supplyKey) /* supply key*/);

    //Submit the transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;
    return transactionStatus;

    //v2.0.7
  } catch (err) {
    console.dir(err, { depth: null });
    if (err instanceof Error) console.log(err.message);
    throw new Error("failed to burn amount");
  }
};

const pause = async ({
  pauseKey,
  token,
}: {
  pauseKey: string;
  token: string;
}) => {
  try {
    const signTx = await new TokenPauseTransaction()
      .setTokenId(token)
      .freezeWith(client)
      .sign(PrivateKey.fromStringDer(pauseKey));

    //Submit the transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    return transactionStatus;
  } catch (err) {
    console.dir(err, { depth: null });
  }
};

const unpause = async ({
  pauseKey,
  token,
}: {
  pauseKey: string;
  token: string;
}) => {
  try {
    const signTx = await new TokenUnpauseTransaction()
      .setTokenId(token)
      .freezeWith(client)
      .sign(PrivateKey.fromStringDer(pauseKey) /* pauseKey */);

    //Submit the transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    return transactionStatus;
  } catch (err) {
    console.dir(err, { depth: null });
    if (err instanceof Error) console.log(err.message);
    throw new Error("failed to unpause the token");
  }
};

const deleteStableCoin = async ({ tokenId }: TDeleteCoin) => {
  const transaction = new TokenDeleteTransaction()
    .setTokenId(tokenId)
    .freezeWith(client);
  const signTx = await transaction.sign(pK);
  const txResponse = await signTx.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const transactionStatus = receipt.status;
  return transactionStatus.toString();
};

// const getAccountDetails = async (account: string) => {
//   try {
//     const query = new AccountInfoQuery().setAccountId(account);
//
//     //Sign with client operator private key and submit the query to a Hedera network
//     const accountInfo = await query.execute(client);
//
//     //Print the account info to the console
//     console.log(accountInfo);
//     return accountInfo.tokenRelationships.toJSON();
//   } catch (err) {
//     console.dir(err, { depth: null });
//     if (err instanceof Error) console.log(err.message);
//
//     throw new Error("failed to get account details");
//   }
// };

export {
  client,
  createStableCoin,
  cashIn,
  grantKyc,
  associate,
  transferCoin,
  getTreasury, // get balance
  getCoinInfo,
  freezeStableCoin,
  unfreezeStableCoin,
  deleteStableCoin,
  wipe,
  burn,
  pause,
  unpause,
};
