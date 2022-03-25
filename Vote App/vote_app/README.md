# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

##-----------------------ETHEREUM PART--------------------------------------------------------------------------

## Links
https://blog.karatos.in/a?ID=00650-84dbdbaa-ec48-45cb-9944-cd41139fd3b2

https://www.quicknode.com/guides/web3-sdks/how-to-connect-to-ethereum-network-with-web3-js

https://www.youtube.com/watch?v=49KK8MbMggQ

https://medium.com/@rktkek456/build-private-ethereum-network-and-test-step-by-step-ff50a2c88eca

https://github.com/fridays/next-routes

https://medium.com/@martinparmar.ce/part-1-blockchain-network-go-ethereum-70b5d15181d2

https://geth.ethereum.org/docs/interface/javascript-console

## Dependencies
>  npm i --save @truffle/hdwallet-provider @truffle/hdwallet-provider fs-extra ganache-cli mocha solc@0.4.25 web3

> npm install mocha-steps --save-dev

> npm i next react react-dom

> npm i --save semantic-ui-react

>  npm install --save semantic-ui-css

> npm install next-routes --legacy-peer-deps

>  npm run dev

##To attach to a running geth instance
> geth attach
## OR
> geth attach ipc:/Users/Elimane/Library/Ethereum/geth.ipc
## To create an account in geth
> personal.newAccount()
## List all accounts into the local network
> eth.accounts  
> personal.listAccounts
## Convert balance from wei to ether
> web3.fromWei(eth.getBalance(eth.accounts[0]),"ether")

## Check crypto balance
>  web3.eth.getBalance(eth.accounts[0])

## Mine ether on my private network
> miner  
> miner.setEtherbase(eth.accounts[0])  
> miner.start(1) <- 1 is one thread
> miner.stop() <- 1 is one thread




## Create new local network with geth, we need to be into directory containing genesis.json file and execute cmd
> geth init ./genesis.json --datadir mychaindata

## Create Nodes 1 and 2
> geth init ./genesis.json --datadir mychaindata/node1  
> geth init ./genesis.json --datadir mychaindata/node2  
> geth init ./genesis.json --datadir mychaindata/node3

## Get info on nodes
> admin.nodeInfo

## Launch nodes by specifying ports
> geth --datadir nodes/node1/ --port 30303 --nodiscover  --networkid 1234  
> geth --datadir nodes/node2/ --port 30304 --nodiscover  --networkid 1234  
> geth --datadir nodes/node3/ --port 30304 --nodiscover  --networkid 1234

## Launch nodes in http mode
> geth --datadir mychaindata/node1/  --syncmode full --nodiscover --port 30304  --http.addr 0.0.0.0   --networkid 1234
>
> geth --datadir mychaindata/node2/  --syncmode full --nodiscover --port 30305  --http.addr 0.0.0.0  --networkid 1234
>
> geth --datadir mychaindata/node3/  --syncmode full --nodiscover --port 30306  --http.addr 0.0.0.0   --networkid 1234
>
## OR via HTTP we can launch nodes
>
> geth --datadir mychaindata/node1/ --syncmode full --port 30304 --http --http.addr localhost --http.port 8546 --http.api admin,personal,eth,net,web3,txpool,miner --networkid 99 --identity node1 console --ipcdisable --allow-insecure-unlock
>
> geth --datadir mychaindata/node2/ --syncmode full --port 30305 --http --http.addr localhost --http.port 8547 --http.api admin,personal,eth,net,web3,txpool,miner --networkid 99 --identity node2 console --ipcdisable --allow-insecure-unlock
>
> geth --datadir mychaindata/node1/ --syncmode full --port 30306 --http --http.addr “localhost” --http.port 8548 --http.api personal,eth,net,web3,txpool,miner --networkid 99 --identity node3 console --ipcdisable --allow-insecure-unlock

## OR via Websocket we can launch nodes
>
> geth --datadir mychaindata/node1/ --syncmode full --port 30304 --ws --ws.addr localhost --ws.port 8546 --ws.api admin,personal,eth,net,web3,txpool,miner --ws.origins "*" --networkid 99 --identity node1 console --ipcdisable --allow-insecure-unlock
>
> geth --datadir mychaindata/node2/ --syncmode full --port 30305 --ws --ws.addr localhost --ws.port 8547 --ws.api admin,personal,eth,net,web3,txpool,miner --networkid 99 --identity node2 console --ipcdisable --allow-insecure-unlock
>
> geth --datadir mychaindata/node1/ --syncmode full --port 30306 --http --http.addr “localhost” --http.port 8548 --http.api personal,eth,net,web3,txpool,miner --networkid 99 --identity node3 console --ipcdisable --allow-insecure-unlock


## URLS for attachment
> "/Users/Elimane/SUPINFO2022/Blockchain/Practice/My Projects/5BLOC/network/mychaindata/node1/geth.ipc"
>
> "/Users/Elimane/SUPINFO2022/Blockchain/Practice/My Projects/5BLOC/network/mychaindata/node2/geth.ipc"

## GETH Attachment
> geth attach ipc:"/Users/Elimane/SUPINFO2022/Blockchain/Practice/My Projects/5BLOC/network/mychaindata/node1/geth.ipc"
>
> geth attach ipc:"/Users/Elimane/SUPINFO2022/Blockchain/Practice/My Projects/5BLOC/network/mychaindata/node2/geth.ipc"
>
> geth attach ipc:"/Users/Elimane/SUPINFO2022/Blockchain/Practice/My Projects/5BLOC/network/mychaindata/node3/geth.ipc"
>
## OR via HTTP attachment
>
>  geth attach http://127.0.0.1:8546
>
>  geth attach http://127.0.0.1:8547
>
>  geth attach http://127.0.0.1:8548

## OR via webSocket attachment
>
>  geth attach ws://127.0.0.1:8546
>
>  geth attach ws://127.0.0.1:8547
>
>  geth attach ws://127.0.0.1:8548

## Check if there is peers in the network meaning if nodes are tied to each other
> admin.peers

## Add Peer in node 1 with enode of node 2 , will make a peer relationship between 1 and node 2
>	admin.addPeer("enode://6c922cb3d9fba3a6e3c8327e122cd4d06f3ee533ab5a8277d83b8dd66cd3a91d37b3905c859c976d31f0f4fe23ac01ba83a9badc2c7371d4de23c02bcd2ec9ac@90.39.252.243:30304?discport=0")

## NO DISCOVER because sometimes Geth will discover other nodes with The same ID
> geth --datadir ./mychaindata/ --nodiscover
##OR
> geth --datadir ./mychaindata/ --nodiscover --unlock 0 --mine --miner.threads 1

## Key commands from the javascript console
> Personal.newAccount()  
(add password)
>
##  start mining
> miner.start(1)
>
##  ADD Ethers to an account
> miner.setEtherbase(eth.accounts[0])
>
> miner.getHashrate()
>
##  - current block height
> eth.blockNumber
>
##- miner of block at that number
> eth.getBlock(number).miner
>
## - current balance of that account
> eth.getBalance(account address)
>
##- Unlock account
>
> personal.unlockAccount(personal.listAccounts[0],"", 15000)  
> personal.unlockAccount(personal.listAccounts[1],"", 15000)  
> personal.unlockAccount(personal.listAccounts[2],"", 15000)  
> personal.unlockAccount(personal.listAccounts[3],"", 15000)  
> personal.unlockAccount(personal.listAccounts[4],"", 15000)
>
##- Get an account from local ethereum network
> eth.getBalance(personal.listAccounts[0])

## Start Front end server
> npm run dev

## Removes an account from the wallet.
> web3.eth.accounts.wallet.remove(account);
