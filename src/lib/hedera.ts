import { TUnfreeze } from "@/schemas/coin/unfreeze";
import { TFreeze } from "@/schemas/coin/freeze";
import { TNewCoin } from "@/schemas/coin/create";
import { TCashIn } from "@/schemas/coin/cashin";
import { TTransfer } from "@/schemas/coin/transfer";
import { TAssociateCoin } from "@/schemas/coin/associate";
import { TDeleteCoin } from "@/schemas/coin/delete";
import {
  Client,
  Hbar,
  PrivateKey,
  PublicKey,
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
} from "@hashgraph/sdk";
import {
  KYCRequest,
  LoggerTransports,
  type RequestAccount,
  type RequestPrivateKey,
  SDK,
  StableCoin,
} from "@hashgraph/stablecoin-npm-sdk";
import { TCoinBurn } from "@/schemas/coin/burn";
import { TCoinInfo } from "@/schemas/coin/getInfo";
import { TPauseToken } from "@/schemas/coin/pause";
import { TWipe } from "@/schemas/coin/wipe";

SDK.log = {
  level: process.env.REACT_APP_LOG_LEVEL ?? "ERROR",
  transports: new LoggerTransports.Console(),
};

const privateKey: RequestPrivateKey = {
  key: process.env.TREASURY_PVT_KEY!,
  type: "ECDSA",
};

const publicKey: PublicKey = PublicKey.fromString(
  process.env.TREASURY_PUB_KEY!
);
const account: RequestAccount = {
  accountId: process.env.TREASURY_ID!,
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
    .setPauseKey(publicKey)
    .setWipeKey(publicKey)
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
};

const cashIn = async ({ tokenId, amount }: TCashIn) => {
  // try {
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
  // } catch (err) {
  //   console.error(err);
  //   if (err instanceof Error) {
  //     console.log("error caught ^");
  //   }
  // }
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
  let associateTx = await new TokenAssociateTransaction()
    .setAccountId(account.id)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(PrivateKey.fromStringECDSA(account.key));

  let associateTxSubmit = await associateTx.execute(client);
  let associateRx = await associateTxSubmit.getReceipt(client);

  return associateRx;
};

const transferCoin = async ({ id, from, to, amount }: TTransfer) => {
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
};

const getCoinInfo = async ({ tokenId }: TCoinInfo) => {
  const query = new TokenInfoQuery().setTokenId(tokenId);
  const coin = await query.execute(client);
  return coin;
};

/**
 *
 * get balance of `$accountId` for BaldevCoin only
 */
const getTreasury = async ({ accountId }: { accountId: string }) => {
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

const wipe = async ({ token, amount, accountId }: TWipe) => {
  const tx = await new TokenWipeTransaction()
    .setAccountId(accountId)
    .setTokenId(token)
    .setAmount(amount)
    .freezeWith(client)
    .sign(PrivateKey.fromStringDer(publicKey.toStringDer()));

  const signTx = await tx.sign(pK /* wipeKey */);
  const txResponse = await signTx.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Obtain the transaction consensus status
  const transactionStatus = receipt.status;

  return transactionStatus;
};

const burn = async ({
  // supplyKey,
  token,
  amount,
}: TCoinBurn) => {
  const signTx = await new TokenBurnTransaction()
    .setTokenId(token)
    .setAmount(Number(amount))
    .freezeWith(client)
    .sign(PrivateKey.fromStringDer(publicKey.toStringDer()));

  //Submit the transaction to a Hedera network
  const txResponse = await signTx.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the transaction consensus status
  return receipt;

  //v2.0.7
};

const pause = async ({ tokenId }: TPauseToken) => {
  const signTx = await new TokenPauseTransaction()
    .setTokenId(tokenId)
    .freezeWith(client)
    .sign(PrivateKey.fromStringDer(publicKey.toStringDer()));

  //Submit the transaction to a Hedera network
  const txResponse = await signTx.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the transaction consensus status
  const transactionStatus = receipt.status;

  return transactionStatus;
};

const unpause = async ({ tokenId }: TPauseToken) => {
  const signTx = await new TokenUnpauseTransaction()
    .setTokenId(tokenId)
    .freezeWith(client)
    .sign(PrivateKey.fromStringDer(publicKey.toStringDer()));

  //Submit the transaction to a Hedera network
  const txResponse = await signTx.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the transaction consensus status
  const transactionStatus = receipt.status;

  return transactionStatus;
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
