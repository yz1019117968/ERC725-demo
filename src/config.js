import ipfsApi from 'ipfs-api'
import {notification,message} from 'antd'
import Web3 from 'web3';
import address  from './address.js'
import ClaimHolder from './compiled/issuerClaimHolder.json'
let ipfs = ipfsApi("ipfs.infura.io","5001",{"protocol":"https"})

let ipfsPrefix = "https://ipfs.infura.io:5001/api/v0/cat?arg="

let web3
if(window.web3){
  web3 = new Web3(window.web3.currentProvider)
}else{
  notification.error({
    message:"There's may not have a Ethereum plugin.",
    description:'Please install metamask and activate it.'
  })
}
let issuerClaimHolder = new web3.eth.Contract(JSON.parse(issuerClaimHolder.interface),address)

function saveFileToIpfs(file){
    const hide = message.loading('Uploading')
    return new Promise(function(resolve, reject){
      let reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = async ()=>{
        const buffer = Buffer.from(reader.result)
        const res = await ipfs.add(buffer)
        console.log(res)
        hide()
        resolve(res[0].hash)
      }
    })
  }

export {ipfs,ipfsPrefix,saveFileToIpfs,web3,issuerClaimHolder}