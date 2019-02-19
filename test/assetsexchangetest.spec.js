const path = require('path')
const assert = require('assert')
const Web3 = require('web3')
const ganache = require('ganache-cli') //local virtual env

const web3 = new Web3(ganache.provider()) //an web3 instance connecting the local virtual env
//import the json data of contracts
const AssetsList = require(path.resolve(__dirname,"../src/compiled/AssetsListnew.json"))
const ClaimHolder = require(path.resolve(__dirname,"../src/compiled/ClaimHolder.json"))
const KEY_PURPOSES = {
    "MANAGEMENT" : 1,
    "CLAIM" : 3,
  };
const KEY_TYPES = {
"ECDSA" : 1
  };
const CLAIM_SCHEMES = {
"ECDSA" : 1
  };
const CLAIM_TYPES = {
"KYC" : 7
  };

let accounts;
let assetsList;
let issuerClaimHolder;
let investorClaimHolder;
let platformAccount;
let investorAccount;
let issuerClaimAccount;
let issuerManagementAccount;

describe('Assetsexchange test',()=>{
    // before testing
    before(async ()=>{
        accounts = await web3.eth.getAccounts()
        issuerManagementAccount = accounts[0];
        issuerClaimAccount = accounts[1]
        investorAccount = accounts[2];
        platformAccount = accounts[3];
        // console.log(accounts)
        issuerClaimHolder = await new web3.eth.Contract(JSON.parse(ClaimHolder.interface)) 
        .deploy({data:ClaimHolder.bytecode})  
        //creator of the project
        .send({from:issuerManagementAccount,
            gas:'5000000'})                   //deploy virtually
        investorClaimHolder = await new web3.eth.Contract(JSON.parse(ClaimHolder.interface)) 
        .deploy({data:ClaimHolder.bytecode})  
        //creator of the project
        .send({from:investorAccount,
            gas:'5000000'})                   //deploy virtually
        assetsList = await new web3.eth.Contract(JSON.parse(AssetsList.interface))
        .deploy({data:AssetsList.bytecode,arguments:[issuerClaimHolder.options.address]})
        .send({
            from:platformAccount,
            gas:'5000000'
        })
    }) 
    it('whether the contract has been deployed',()=>{
        // console.log(claimHolder.options.address)
        assert.ok(issuerClaimHolder.options.address)
        assert.ok(investorClaimHolder.options.address)
    })
    it("issuer add claim key",async ()=>{
        let issuerClaimKey = web3.utils.keccak256(issuerClaimAccount);
        await issuerClaimHolder.methods.addKey(
            issuerClaimKey,
            KEY_PURPOSES.CLAIM,
            KEY_TYPES.ECDSA,
        ).send({
            from: issuerManagementAccount,
            gas: "5000000",
        });
        const key_hash =await issuerClaimHolder.methods.getKeysByPurpose(KEY_PURPOSES.CLAIM).call();
        const KEY = await issuerClaimHolder.methods.getKey(key_hash[0]).call()
        console.log(key_hash);
        console.log(KEY)
        assert.equal(key_hash.toString(),issuerClaimKey)
    })
    it("investor add a KYC claim with issuer's signature", async ()=>{
        var hexedData = web3.utils.asciiToHex("this investor is totes legit");
        var hashedDataToSign = web3.utils.soliditySha3(
            investorClaimHolder.options.address,
            CLAIM_TYPES.KYC,
            hexedData,
        );
        var signature = await web3.eth.sign(hashedDataToSign, issuerClaimAccount);
        var claimIssuer = issuerClaimHolder.options.address;
        await investorClaimHolder.methods.addClaim(
                CLAIM_TYPES.KYC,
                CLAIM_SCHEMES.ECDSA,
                claimIssuer,
                signature,
                hexedData,
                "https://www.cityu.edu.hk",)
                .send(
                    {
                        gas: "5000000",
                        from: investorAccount,
                    }
                )
        let claimID = await investorClaimHolder.methods.getClaimIdsByType(CLAIM_TYPES.KYC).call()
        console.log("The data of cliam:KYC issued by issuer",await investorClaimHolder.methods.claims(claimID[0]).call());
    })
    it("investor add asset with verification of KYC claim", async ()=>{
        await assetsList.methods.addAsset(
            "asset1",
            "asset1",
            1,
            "img",
            investorClaimHolder.options.address
        ).send({
            from:investorAccount,
            gas:'5000000'
        })
        console.log("new asset info:",await assetsList.methods.getAssetByID(0).call())
    })
    it("another investor buy that asset with verification of KYC claim", async ()=>{
        //this new investor deploy a claimholder contract
        let investorAccountNew = accounts[4]
        let investorClaimHolderNew = await new web3.eth.Contract(JSON.parse(ClaimHolder.interface)) 
        .deploy({data:ClaimHolder.bytecode})  
        //creator of the project
        .send({from:investorAccountNew,
            gas:'5000000'}) 
        //the new investor add a KYC claim with issuer's signature
        var hexedData = web3.utils.asciiToHex("this investor is totes legit");
        var hashedDataToSign = web3.utils.soliditySha3(
            investorClaimHolderNew.options.address,
            CLAIM_TYPES.KYC,
            hexedData,
        );
        var signature = await web3.eth.sign(hashedDataToSign, issuerClaimAccount);
        var claimIssuer = issuerClaimHolder.options.address;
        await investorClaimHolderNew.methods.addClaim(
                CLAIM_TYPES.KYC,
                CLAIM_SCHEMES.ECDSA,
                claimIssuer,
                signature,
                hexedData,
                "https://www.cityu.edu.hk",)
                .send(
                    {
                        gas: "5000000",
                        from: investorAccountNew,
                    }
                )
        //the new investor buy the asset added by the former investor
        await assetsList.methods.buyAssetById(0,investorClaimHolderNew.options.address).send({
            gas:'5000000',
            from:investorAccountNew,
            value: 1
        });
        let assetInfo = await assetsList.methods.getAssetByID(0).call()
        console.log(typeof(await assetsList.methods.getAssetByID(0).call()));
        //check whether the asset's owner has changed to new owner
        assert.equal(assetInfo[0],investorAccountNew)
    })
});