import React from 'react';
import {Form, Input, Upload,Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Layout} from 'antd'
import Header from './platformHeader'
import {saveFileToIpfs,ipfsPrefix} from '../config'
const {Footer, Content} = Layout
const { Option } = Select;
const FormItem = Form.Item
const AutoCompleteOption = AutoComplete.Option;


class addAsset extends React.Component {
    constructor(props){
         super(props)
         this.state= {
             name:'',
             content:'',
             price:'',
             file:''
         }
    }
handleSubmit = ()=>{

}
handleUpload = async (file)=>{
    const hash = await saveFileToIpfs(file)
    console.log(hash)
    this.setState({
        file:hash
    })
    return false
}
onChange = (e) =>{
    this.setState({
        [e.target.name]:e.target.value
    })
}
    render(){
        return (
            <Layout>
                <Header></Header>
                <Content>
                <Row
      type='flex'
      justify='center'
      style={{marginTop:'30px'}}
    >
      <Col span={20}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="Name">
              <Input name='name' onChange={this.onChange} />
            </FormItem>
            <FormItem label="Price">
              <Input name='price' onChange={this.onChange} />
            </FormItem>
            <FormItem label="Image">

              <Upload
                beforeUpload={this.handleUpload}
                showUploadList ={false}
              >
               {
                this.state.file? <img height='100px' src={`${ipfsPrefix}${this.state.file}`} alt=""/>
                              :(<Button type='primary'>Upload</Button>)
              } 
                
              </Upload>
            </FormItem>
            <FormItem label="Description">
            <Input.TextArea row={6} name='Description' onChange={this.onChange} >
            
            </Input.TextArea>
            </FormItem>
            <FormItem>
              <Button type='primary' htmlType="submit">Apply</Button>
            </FormItem>
          </Form>
      </Col>
    </Row>
                </Content>
                <Footer>bottom</Footer>
            </Layout>
        );
    }
}


export default addAsset