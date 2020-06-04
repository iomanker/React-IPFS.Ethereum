# Self Defending for shared mobility system

## Overview
![Demo](https://github.com/iomanker/React-IPFS.Ethereum/blob/master/public/demo.png)
* We aim to create a platform makes client to upload their picture after finishing rental.
* This platform is used by Truffle, Ganache-cli, React.js, Ethereum, and IPFS.
### Pages
* `root`: A place to input wallet address and create PersonalBox. (PersonalBox is like account to record your content.)
* `record`: Record your image in IPFS and blockchain network. (You need to click GPS `renew` button before uploading.)
* `history`: Show your PersonalBox information. You can see a detail while clicking one record.

## Install
### IPFS
* Follow this official tutorial: https://docs-beta.ipfs.io/how-to/command-line-quick-start/#install-ipfs
* (config is at `~/.ipfs/config`)
#### Public to self private network
* Install go
```
sudo apt install golang-go
mkdir $HOME/golang
export GOPATH=$HOME/golang
```
* Install (ipfs-swarm-key-gen)[https://github.com/Kubuxu/go-ipfs-swarm-key-gen]
* Delete outside peers node
```
ipfs bootstrap rm --all
```
* Create own peer list
```
ipfs swarm peers
```

### Ethereum
* Install node.js: https://nodejs.org/en/
* Install Truffle: `npm install truffle -g`
* Install Ganache-cli: `npm i ganache-cli`
* Setup `truffle-config.js` in project folder
```
networks: {
    develop: {
      host: "127.0.0.1",
      port: 8545,  // This port is for Ganache-cli
      network_id: "*"
    }
}
```
* truffle-config
* truffle compile
* truffle migrate
### React.js
* Create React.js project in Truffle: `truffle unbox react`
* react - npm start

## Run
### IPFS
```
ipfs daemon
```
### Ethereum
* Compile solidity contract (`<PROJECT>/contracts`) to client folder (React.js)
```
truffle compile
```
* Open test network in Ganache-cli
```
ganache-cli
```
* Migrate contract to Ganache-cli Test Network
```
truffle migrate --network develop
```
### React.js
* In `<PROJECT>/client` command: `npm start`

## Bug
1. Need to input your address and create PersonalBox in `root` at first. Otherwise, you would see an error at `history`.
2. Each page always creates web3 object every time if you click and enter to these pages. It *probably* creates conflict issue.

## Reference
* [Ethereum + IPFS + React DApp Tutorial](https://blog.goodaudience.com/ethereum-ipfs-react-dapp-tutorial-pt-1-a9dfd5079491)
* [Solidity CRUD- Epilogue](https://medium.com/robhitchens/solidity-crud-epilogue-e563e794fde)