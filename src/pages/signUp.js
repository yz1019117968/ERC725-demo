import React from 'react';
import {Form, Input, Upload,Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Layout} from 'antd'
import Header from './header'
import {saveFileToIpfs,ipfsPrefix} from '../config'
const {Footer, Content} = Layout
const { Option } = Select;
const FormItem = Form.Item
const AutoCompleteOption = AutoComplete.Option;
class signUp extends React.Component {
    constructor(props){
         super(props)
         this.state= {
             name:'',
             Email:'',
             Income:'',
             Phone:'',
             Experience:'',
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
            <FormItem label="Email">
              <Input name='Email' onChange={this.onChange} />
            </FormItem>
            <FormItem label="Anual Income">
              <Input name='Income' onChange={this.onChange} />
            </FormItem>
            <FormItem label="Phone Number">
              <Input name='Phone' onChange={this.onChange} />
            </FormItem>
            <FormItem label="Investment Experience">
            <Input.TextArea row={6} name='Experience' onChange={this.onChange} >
            
            </Input.TextArea>
            </FormItem>
            <FormItem label="Identity Card">

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


export default signUp