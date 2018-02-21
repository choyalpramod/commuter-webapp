import React, { Component } from 'react';
import Header from '../../section/components/Header';
//import { browserHistory } from 'react-router';
import { getLocationStorage } from '../../section/constants/constants'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { updateUser, updateActiveUser } from './action.js';
import {urls} from '../../section/constants/urlConstants';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      active: 'loginField',
      loginField: {
        username: {
          label: 'Username',
          placeholder: '10-digit mobile number or email ID',
          type: 'text',
          validation: {
            verify: ['not-empty', 'any-mobile-email'],
            msg: ''
          },
          value: ''
        },
        password: {
          label: 'Password',
          placeholder: 'Enter your password',
          type: 'password',
          validation: {
            verify: ['not-empty'],
            msg: ''
          },
          value: ''
        },
      },
      registerField: {
        fullName: {
          label: 'Full Name',
          placeholder: 'Enter your first name and last name',
          validation: {
            verify: ['not-empty'],
            msg: ''
          },
          value: ''
        },
        email: {
          label: 'Emaild ID',
          type: 'email',
          placeholder: 'Enter your email ID',
          validation: {
            verify: ['email', 'not-empty'],
            msg: ''
          },
          value: ''
        },
        mobile: {
          label: 'Mobile Number',
          type: 'number',
          placeholder: 'Enter your 10-digit mobile number',
          validation: {
            verify: ['length', 'not-empty'],
            length: 10,
            msg: ''
          },
          value: ''
        },
        password: {
          label: 'Password',
          label_info: '(min 6 characters)',
          type: 'password',
          placeholder: 'Set your password',
          validation: {
            verify: ['min-length', 'not-empty'],
            minLength: 6,
            msg: ''
          },
          value: ''
        },
        cpassword: {
          label: 'Re-enter Password',
          placeholder: 'Re-enter the password',
          type: 'password',
          validation: {
            verify: ['not-empty', 'cpassword'],
            msg: ''
          },
          value: ''
        },
        userType: {
          label: 'Do you want to ',
          type: 'select',
          option: [
            {
              label: 'Commute',
              value: 'commuter'
            },
            {
              label: 'Pool your car',
              value: 'driver'
            }
          ],
          validation: {
            verify: [],
            msg: null
          },
          value: 'commuter'
        }
      }
    });

    this.car = {
      label: 'Your Car Model',
      placeholder: 'Car model',
      type: 'text',
      validation: {
        verify: ['not-empty'],
        msg: ''
      },
      value: ''
    };
  }

  componentWillMount(){
    let { activeUser } = this.props;
    this.props.updateUser(getLocationStorage('user'));
    this.props.updateActiveUser(getLocationStorage('activeUser'));
  }

  onHandleChange(key, event) {
    if(key == 'userType'){
      if(event.target.value == 'driver')
        this.state[this.state.active].car = Object.assign({}, this.car);  
      else
        delete this.state[this.state.active].car;
    }

    this.state[this.state.active][key].value = event.target.value;
    this.forceUpdate();
  }

  handleSubmit(event){
    event.preventDefault();
    this.showAllErrorMessages();
    if (this.checkValidationValid() == false) {
      return;
    }

    if(this.state.active == 'registerField'){
      this.handleRegisterSubmit();
    }
    else{
      this.handleLoginSubmit();
    }
  }

  handleLoginSubmit(){
    let { user } = this.props,
      { username, password } = this.state[this.state.active];

    if(!user.accounts[username.value]){
        this.showErrorMessages('username', 'Please provide valid emaild ID/Mobile number');
        return;
    }

    let userDetails = user.details[user.accounts[username.value]];
    if(userDetails.password != password.value){
        this.showErrorMessages('password', 'Please provide valid password');
        return;
    }
    this.props.updateActiveUser(userDetails);
    //browserHistory.push('/' + urls.carpool.path);
  }

  handleRegisterSubmit() {
    let { user } = this.props,
      { email, mobile } = this.state[this.state.active];

    if(user.accounts){      
      if (user.accounts[email]) {
        this.showErrorMessages('email', 'Please provide valid email ID');
        return;
      }
  
      if (user.accounts[mobile]) {
        this.showErrorMessages('mobile', 'Please provide valid mobile number');
        return;
      }
    }

    let field = this.state[this.state.active];
    let userDetails = {
      email: field.email.value,
      mobile: field.mobile.value,
      fullName: field.fullName.value,
      password: field.password.value,
      userType: field.userType.value,
      trip: '',
      car: field.car ? field.car.value : ''
    };

    if(!user.accounts) user.accounts = {};
    if(!user.details) user.details = {};

    user.accounts[userDetails.email] = userDetails.email;
    user.accounts[userDetails.mobile] = userDetails.email;
    user.details[userDetails.email] = userDetails;

    this.props.updateUser(user);
    this.props.updateActiveUser(userDetails);
    //browserHistory.push('/' + urls.carpool.path);
  }

  showErrorMessages(key, msg) {
    if (msg) {
      this.state[this.state.active][key].validation.msg = msg;
      this.forceUpdate();
      return;
    }

    let details = this.state[this.state.active][key];
    let arr = details.validation.verify;

    for (let i = 0; i < arr.length; i++) {
      let setMsg = null;
      switch (arr[i]) {
        case 'not-empty':
          if (!details.value)
            setMsg = 'Please fill the field';
          break;

        case 'cpassword':
          if (!(details.value === this.state[this.state.active].password.value))
            setMsg = 'Password and confirm password are not the same';
          break;

        case 'min-length':
          if (!(details.value && details.value.length >= details.validation['minLength']))
            setMsg = details.label + ' should be atleast ' + details.validation['minLength'] + ' character length';
          break;

        case 'length':
          if (!(details.value && details.value.length == details.validation['length']))
            setMsg = details.label + ' should be ' + details.validation['length'] + ' digit length';
          break;

        case 'email':
          if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(details.value))){
            setMsg = 'Please provide valid email-ID';
          }
          break;

        case 'any-mobile-email':
          if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(details.value) || /^\d{10,10}$/.test(details.value)))
            setMsg = 'Please provide valid email-ID or mobile number';
          break;
      }
      this.state[this.state.active][key].validation.msg = setMsg;
      this.forceUpdate();

      if(this.state[this.state.active][key].validation.msg){ break; }
    }
  }

  showAllErrorMessages() {
    Object.keys(this.state[this.state.active]).map(field => {
      this.showErrorMessages(field);
    })
  }

  checkValidationValid() {
    let valid = true;
    let list = this.state[this.state.active];
    Object.keys(list).map(field => {
      if (valid && !(list[field].validation.msg == null || list[field].validation.msg == '')) {
        valid = false;
      }
    })
    return valid;
  }

  changeTab(url){
    this.setState({ 
      active: (this.state.active == 'registerField') ? 'loginField' : 'registerField' 
    });
  }

  renderRedirectionUrl(){
    let firstLabel = "Don't have an account?",
      urlLabel = 'REGISTER NOW'; 
      
    if(this.state.active == 'registerField'){
      firstLabel = "You have an account?";
      urlLabel = 'LOGIN NOW'; 
    }

    return (
      <div className="text-align-center">
        {firstLabel} <span
          className="nav-link" 
          onClick={this.changeTab.bind(this)}>{urlLabel}</span>
      </div>
    )
  }

  renderField(field, key){
    switch(field.type){
      case 'select': 
        return(
          <select value={field.value} onChange={this.onHandleChange.bind(this, key)}>
            {field.option.map((option)=>
              <option key={option.value} value={option.value}>{option.label}</option>
            )}
          </select>
        )
        break;

      default: 
        return(
          <input
          type={field.type}
          onChange={this.onHandleChange.bind(this, key)}
          className="" />
        )
        break;
    }
  }

  render() {
    let { activeUser } = this.props;
    if (activeUser && Object.keys(activeUser).length > 0) {
      window.location.href = window.location.origin + urls.carpool.path;
    }

    return (
      <div className="">
        <Header label={this.state.active == 'loginField' ? 'LOGIN TO APP' : 'REGISTER TO APP'}/>
        <div className="">  
          <div className="nav">
            <div className={this.state.active == 'loginField' ? 'nav1-2' : 'nav2-2'}></div>
          </div>
          <form onSubmit={this.handleSubmit.bind(this)}>
            {Object.keys(this.state[this.state.active]).map((field, key) => {
              let details = this.state[this.state.active][field];
              return (
                <div className="" key={key}>
                  <label>
                    {details.label} {details['label_info'] &&
                      <span className="label-info">{details['label_info']}</span>
                    }
                  </label>
                  {this.renderField(details, field)}
                  {(details.validation && details.validation.msg) &&
                    <div className="validation-error">
                      {details.validation.msg}
                    </div>
                  }
                </div>
              )
            })}
            <div>
              <button
                type="submit"
                className="">
                {this.state.active == 'registerField' ? 'REGISTER' : 'LOGIN'}
              </button>
            </div>
          </form>
        </div>

        {this.renderRedirectionUrl()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      activeUser: state.activeUser,
      user: state.user
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    updateUser: updateUser,
    updateActiveUser: updateActiveUser,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Home);
