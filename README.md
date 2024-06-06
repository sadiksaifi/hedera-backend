Backend Routes:

Create A coin: /api/coin/create

```
body: {
    "name": "Coin Name",
    "symbol": "Coin Symbol",
    "initialSupply": 1,
    "maxTxFee": 1
}
```

Mint A coin: /api/coin/create

```
body: {
    "tokenId": "0.0.4421599",
    "amount": 1
}
```

Burn A coin: /api/coin/burn

```
body: {
    "token":"0.0.4421599",
    "amount": 1
}
```
