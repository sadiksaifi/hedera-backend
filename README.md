Backend Routes:

Visit Postman:https://orange-satellite-182487.postman.co/workspace/BLINKER-SHARED~eeb4a9ce-b391-4cfe-92d8-881064b83a97/collection/35189656-5d7c5500-abdd-4aa1-bfb9-5e4be14ac537?action=share&creator=35189656

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
