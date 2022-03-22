import React, {Component} from 'react';
import classes from './header.module.css'
import {BrowserRouter as Router, Routes, Route, Link, NavLink} from 'react-router-dom';
import Responsable from "../pages/manager/responsable";
import Electeurs from "../pages/voter/electeurs";


class Header extends Component{

  constructor(props) {
    super(props);
    this.onGetElectionStatus = this.onGetElectionStatus.bind(this);
    this.state = {
      isEnded: false
    }
  }

  onGetElectionStatus(event){
    console.log('IN HEADER ',event);
    this.setState({isEnded: event});
  }



  render() {
    return (
      <div className="container">
        <Router>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <span className="navbar-brand"><h2>Vote Dapp</h2></span>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                  <NavLink
                    className={`nav-link`}
                    aria-current="page"
                    style={({ isActive }) => ({
                    color: isActive ? '#fff' : '#545e6f',
                    background: isActive ? 'darkgray' : '#f0f0f0',
                    fontWeight: 'bold',
                    borderRadius: '12px'
                    })}
                    to="/responsable">
                      Responsable
                  </NavLink>
                  </li>
                  <li className="nav-item">
                  <NavLink
                    className={`nav-link`}
                    style={({ isActive }) => ({
                    color: isActive ? '#fff' : '#545e6f',
                    background: isActive ? 'darkgray' : '#f0f0f0',
                    marginLeft: '12px',
                    fontWeight: 'bold',
                    borderRadius: '12px'
                    })}
                    to={`/electeurs/${this.state.isEnded}`}>
                      Électeurs
                  </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <Routes>
            <Route path="/responsable" element={<Responsable onGetElectionStatus={this.onGetElectionStatus} />}/>
            <Route path="/electeurs/:isEnd" element={<Electeurs />}/>
            {/*<Route path="/profile/:username" element={<Profile/>}/>*/}
            {/*<Route path="*" element={<ErrorPage/>}/>*/}
          </Routes>
        </Router>
      </div>
    );
  }

}

export default Header;
