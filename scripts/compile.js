const fs = require('fs')
const path = require('path')
const solc = require('solc')

// const contractPath = path.resolve(__dirname,'../contracts/Imooc.sol')

// const source = fs.readFileSync(contractPath,'utf-8')

// // console.log(source)

// //compile
// const ret = solc.compile(source)

// if(Array.isArray(ret.errors) && ret.errors.length>0){
//     console.log(ret.errors[0])
// }
// else{
//     Object.keys(ret.contracts).forEach(name=>{
//     const contractName = name.slice(1) //filter the 1st ":"
//     outputFilePath = path.resolve(__dirname,`../src/compiled/${contractName}.json`)//string template
//     fs.writeFileSync(outputFilePath,JSON.stringify(ret.contracts[name]))
//     console.log(outputFilePath)
// })
// }

const solList = [
"assetsexchangenew.sol",];
for(let i = 0; i < solList.length;i++){

    let contractPath = path.resolve(__dirname,`../contracts/${solList[i]}`)

    let source = fs.readFileSync(contractPath,'utf-8')

    console.log(source)

    //compile
    let ret = solc.compile(source)

    if(Array.isArray(ret.errors) && ret.errors.length>0){
        console.log(ret.errors[0])
    }
    else{
        Object.keys(ret.contracts).forEach(name=>{
        const contractName = name.slice(1) //filter the 1st ":"
        outputFilePath = path.resolve(__dirname,`../src/compiled/${contractName}.json`)//string template
        fs.writeFileSync(outputFilePath,JSON.stringify(ret.contracts[name]))
        console.log(outputFilePath)
    })
    }
}