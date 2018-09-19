import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

import {
  ENVIRONMENT,
  PROTOCOL,
  BASE,
  USERNAME,
  PASSWORD,
  BUCKET_NAME
} from './Environment'

const BASE_URL = `${PROTOCOL}://${BASE}/${BUCKET_NAME}/SailorFrameworkHTMLModule`;

class App extends Component {
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();
    this.setFileName = this.setFileName.bind(this);
    this.updateVersion = this.updateVersion.bind(this);
    this.updateAttachment = this.updateAttachment.bind(this);
  }
  updateAttachment(res, moduleId, moduleName) {
    let rev = res.data.rev;
    console.log(rev)
    const url = `${BASE_URL}::${moduleId}/${moduleName}?rev=${rev}`;
    const options = {
      headers: {
        'content-type': 'application/zip',
      },
      auth: {
        username: USERNAME,
        password: PASSWORD
      }
    };
    const data = this.fileUpload.current.files[0];
    console.log(data)
    axios.put(url, data, options)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  updateVersion(res, moduleId, version) {
    const _this = this;
    let data = res.data;
    data.moduleVersion = version;
    const moduleName = data.moduleName;
    const url = `${BASE_URL}::${moduleId}`;
    const options = {
      headers: {
        'content-type': 'application/json',
      },
      auth: {
        username: USERNAME,
        password: PASSWORD
      }
    };
    axios.put(url, data, options)
    .then(function (response) {
      _this.updateAttachment(response, moduleId, moduleName);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  setFileName(e) {
    const _this = this;
    const filePath = this.fileUpload.current.value;
    let fileName = filePath.split(/(\\|\/)/g).pop();
    let parts = fileName.split('.');
    parts.pop();
    fileName = parts.join('.');
    const moduleId = fileName.split('_')[0];
    const version = fileName.split('_')[1];
    const url = `${BASE_URL}::${moduleId}`;
    const options = {
      auth: {
        username: USERNAME,
        password: PASSWORD
      }
    };
    if(moduleId && version){
      axios.get(url, options)
      .then(function (response) {
        _this.updateVersion(response, moduleId, version);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Caelus</h1>
        </header>
        <div style={{padding : '20px'}}>
          <h1>Uploading to {ENVIRONMENT} environment</h1>
          <br/>
          <label htmlFor="fileUploader" className='upload-button'>
            <input type="file" id='fileUploader' ref={this.fileUpload} onChange={this.setFileName}/>
          </label>
        </div>
      </div>
    );
  }
}
export default App;