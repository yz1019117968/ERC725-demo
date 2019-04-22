const path = require('path')
const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider')
const fs = require('fs')

const contractPath = path.resolve(__dirname,'../src/compiled/ClaimHolder.json')

const {interface,bytecode} = require(contractPath)

const provider = new HDWalletProvider(
    "coach solar parent session oil virus hope surface actor rigid gas art",
    "https://ropsten.infura.io/v3/93dea988330248779c93b2082b9c31b2"
)

const web3 = new Web3(provider);

(
    async()=>{
        const accounts = await web3.eth.getAccounts()
        console.log("contract account;",accounts)
        const issuerClaimHolder = await new web3.eth.Contract(JSON.parse(interface)) 
        .deploy({data:bytecode})  
        //creator of the project
        .send({from:accounts[0],
            gas:'5000000'})   
        // console.log(issuerClaimHolder.options)
        const contractAddress = issuerClaimHolder.options.address
        console.log("contract deployed successfully",contractAddress)
        console.log("contract detail:",`https://ropsten.etherscan.io/address/${contractAddress}`)
        const addressFile = path.resolve(__dirname,'../src/address.js')
        fs.writeFileSync(addressFile,"export default"+JSON.stringify(contractAddress))
        console.log("address has been written successfully!")

    }
)()

