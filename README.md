# Backend Routes: Get access to full postman api

Visit Postman:https://orange-satellite-182487.postman.co/workspace/BLINKER-SHARED~eeb4a9ce-b391-4cfe-92d8-881064b83a97/collection/35189656-5d7c5500-abdd-4aa1-bfb9-5e4be14ac537?action=share&creator=35189656

Don't forget to create a .env and add the keys generated from the [Hedera Portal](https://portal.hedera.com/dashboard)

### ENV variables

    - To create a stable coin as you provide data, the treasury keys stored in the .env file will be used to create the stable coin
    - Those same keys are used for signing other operations related to the token such as transfer coin and Getting Coin Info

- For account speific operations like getting the treasury balance of a user, you should provide the accountId from the frontend, that is supposed to be provided through .env in the frontend

# TESTING

for testing purpose you can log into the hedera portal and use the account details provided there

- email(mail generated from tempmail): padivi3729@cnurbano.com
- password:M5V2Z0M3

### Login

Anyone can login with a username and password (open publically)

```
Note: All the creation and deletion tasks performed on the token are based on the treasury id, private key and public key in the .env file
```

### Creating Coin

Only authenticated users are allowed to create a coin

```
Note: Public key of the treasury is being used as the AdminKey, SupplyKey and the FreezeKey of any new token created
```

- Testing CI
