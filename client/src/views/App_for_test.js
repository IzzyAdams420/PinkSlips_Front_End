import React, { Component } from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import getWeb3 from "../components/getWeb3";


import {Container, Row, Col} from 'react-bootstrap';

import Button from 'react-bootstrap/Button';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import Web3Prompt from "../components/Web3Prompt";

import AddressManager from "../contracts/AddressManager.json";
import GoldStars from "../contracts/GoldStars.json";
import PinkSlips from "../contracts/PinkSlips.json";
import RedPens from "../contracts/RedPens.json";
import VendingMachine from "../contracts/VendingMachine.json";
import JuryPool from "../contracts/JuryPool.json";
import Minion from "../contracts/Minion.json";
import CourtClerk from "../contracts/_outside/CourtClerk.json";

import routes from "../routes.js";

import NavigationBar from "../pages/Navigation";
import Sidebar from "./Sidebar.js";
import Footer from "./Footer.js";

import 'bootstrap/dist/css/bootstrap.min.css';


import "../css/App.css";
import "../css/styles.css"

let coloredLogo = "../rsrc/imgs/ColoredLogo.png";

class App extends Component {
  state = { web3: null, accounts: null, drawerIsOpen: true, isAlert: true, isErrorAlert: null, isOverride: null};
  appBorderRadius = "1em"


  toggleAlert = (event) => { 
    let isAlert = this.state.isAlert;
    this.setState({isAlert: (!isAlert)});

  }

  toggleErrorAlert = () => { 

    let errorAlert = this.state.isErrorAlert;
    this.setState({isErrorAlert: (!errorAlert)});
    
    
  }


  componentDidMount = async () => {
      // Get network provider and web3 instance.
      try {
        await this.connectWallet();
  
      } catch (error) {
        // Catch any errors for any of the above operations.
        this.setState({isErrorAlert: true});
        console.error(error);
      }
    };
  
  connectOverride = () => {
    this.setState({isOverride: true});
  }

  connectWallet2 = async() => {
     //refresh page
     window.location.reload();
    }

  connectWallet = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();      

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = await [GoldStars.networks[networkId],
                                      RedPens.networks[networkId],
                                      PinkSlips.networks[networkId],
                                      JuryPool.networks[networkId],
                                      VendingMachine.networks[networkId],
                                      AddressManager.networks[networkId],
                                      //Minion.networks[networkId],
                                      //CourtClerk.networks[networkId]
                                    ];

      //set the contract addresses

      const goldStars = new web3.eth.Contract(
        GoldStars.abi,
        deployedNetwork[0] && deployedNetwork[0].address,
      );

      const redPens = new web3.eth.Contract(
        RedPens.abi,
        deployedNetwork[1] && deployedNetwork[1].address,
      );

      const pinkSlips= new web3.eth.Contract(
        PinkSlips.abi,
        deployedNetwork[2] && deployedNetwork[2].address,
      );

      const juryPool = new web3.eth.Contract(
        JuryPool.abi,
        deployedNetwork[3] && deployedNetwork[3].address
      );

      const vendingMachine = new web3.eth.Contract(
        VendingMachine.abi,
        deployedNetwork[4] && deployedNetwork[4].address
      );
      
      const addressManager = new web3.eth.Contract(
        AddressManager.abi,
        deployedNetwork[5] && deployedNetwork[5].address
      );

      /*
      const juryBailiff = new web3.eth.Contract(
        Minion.abi,
        deployedNetwork[6] && deployedNetwork[6].address
      );
      */

      

      /*
      const courtClerk = new web3.eth.Contract(
        CourtClerk.abi,
        deployedNetwork[7] && deployedNetwork[7].address
      );
      */

      //const juryDAOAddress = await addressManager.methods.JuryDAOAddress().call();
      const activeContracts = {goldStars, redPens, pinkSlips, juryPool, vendingMachine, /* juryBailiff, */ addressManager, /* courtClerk */ };


      const goldStarsAddress = deployedNetwork[0].address;
      const pinkSlipsAddress = deployedNetwork[2].address;
      const juryPoolAddress = deployedNetwork[3].address;
      const vendingMachineAddress = deployedNetwork[4].address;
      // const juryBailiffAddress = deployedNetwork[6].address;
      

      this.setState({ web3, accounts, networkId, goldStars, redPens, pinkSlips, juryPool, /*juryBailiff, */ vendingMachine,  /*courtClerk, */ 
                      goldStarsAddress, pinkSlipsAddress, juryPoolAddress, /* juryDAOAddress, */ vendingMachineAddress,  /*juryBailiffAddress, */
                      addressManager, activeContracts});

    } catch (error) {
      // Catch any errors for any of the above operations.
      this.setState({isErrorAlert: true});
      console.error(error);
    }

  }

  mapRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/") {
        return (
          <Route
          
              path={prop.layout + prop.path}
              component={() => <prop.component toggleDrawer={this.toggleDrawer} {...this.state} />}
              key={key}
          />
        );
      } else {
        return null;
      }
    });
  };


  toggleDrawer = (event) => {
    const isOpen = this.state.drawerIsOpen;
    this.setState({drawerIsOpen: !isOpen});
  }

  ConnectionPrompt = () => {
    return <>
      {
        this.state.isErrorAlert
        ?
        (<Row >
          <Alert onClick={this.toggleErrorAlert} id="AlphaAlert" xs={0} m={6} severity="success" style={{ justifyContent: "center", zIndex: "20" , position: "fixed", top: "3vh",
                                                                      width:"40%", marginLeft:"30%", marginTop: "1vh", marginBotton: "5vh"}}>
          Please connect to Rinkby <strong> and refresh the page </strong>
          <br /><Button style={{color: "rgb(34, 26, 12)", fontWeight: "600", fontSize: "10px" , borderWidth: "1px", borderColor: "rgb(34, 26, 12)",
                                                                        backgroundColor: "transparent"}} onClick={this.toggleErrorAlert} >Cool Beans</Button>
         </Alert>
        </Row>)
        :
        ("")
      }
      <div className="App" style={{ height: "100vh", justifyContent: "center"}} >
      <Web3Prompt style={{positionTop: "30vh !important",}} connectOverride={this.connectOverride}
        connectWallet2={this.connectWallet2}/>
      <br /><br />
      <Button variant="warning" onClick={() => {this.connectOverride()}}>
        Skip Connecting <br />
        <span style={{ fontSize: "80%" }} > (some features will not work) </span>
      </Button>
    </div>
    </>
  }

  



  render() {

    const menuScroll = window.innerHeight >= 710 ? 'none' : 'scroll';
    {/*if (!this.state.web3) {
     // return this.ConnectionPrompt();
    }*/}
    return (
      <>
      

      <div className="App" style={{height: "100vh" ,  margin: 0, padding: "2vh", justifyContent: "center"}}>
        <Container fluid style={{overflowY: 'scroll', overflowX: 'hidden', borderRadius: this.appBorderRadius, height: "97vh",
                                  backgroundColor: "#536267", position: "fixed", positionTop:"0px", positionRight: "0px", padding: 0}} >    
          <Row style={{ boxShadow:2}} >
            <div className="navigation-drawer" id={this.state.drawerIsOpen ? "drawerShadow" : ""}
            style={{ overflowY: menuScroll, scrollbarWidth: "none",  overflowX: 'hidden', borderRadius: this.appBorderRadius, position: "fixed",
                      height: "97vh", padding: 0, margin: 0 }}>
              <Col style={{overflowY: menuScroll, overflowX: 'hidden', scrollbarWidth: "none", position: "fixed", width: "250px", height:  "97vh"}}>
                <Sidebar
                  {...this.state}
                  routes={routes}
                  logo={{
                    innerLink: "/MintingDesk",
                    imgSrc: coloredLogo,
                    imgAlt: "...",
                  }}
                  style={{ overflowY: 'scroll',}}
                />
              </Col>
              
            </div>
        {/**/
            <div className="App content-window" id={this.state.drawerIsOpen ? "contentWindowBorder2" : ""}
            style={{overflowY: 'scroll', overflowX: 'hidden', borderRadius: this.appBorderRadius, position: "fixed", alignContent: "center",
                    justifyContent: 'center', height: "97vh", padding: 0, margin: 0, marginLeft: (this.state.drawerIsOpen ? "250px" : 0),
                    paddingRight: ( this.state.drawerIsOpen ? "250px" : null)  }}>            
      
         <NavigationBar class="white" borderRadius={this.appBorderRadius} toggleDrawer={this.toggleDrawer}/>


            {
              (!this.state.web3  && !this.state.isOverride)
              ?
              (this.ConnectionPrompt())
              :
              (
                this.state.isAlert
                ?
                (<Row>
                  <Alert onClick={this.toggleAlert} id="AlphaAlert" xs={0} m={6} severity="warning" style={{ zIndex: "20" , position: "fixed", top: ( this.state.isErrorAlert ? "20px" : "2vh"),
                                                                              width:"40%", marginLeft:"30%", marginTop: "1vh", marginBotton: "5vh"}}>
                  This is an alpha release! Please use at your own risk. <strong>Contracts are unaudited</strong>
                  <br /><Button style={{color: "rgb(34, 26, 12)", fontWeight: "600", fontSize: "10px" , borderWidth: "1px", borderColor: "rgb(34, 26, 12)",
                                                                                backgroundColor: "transparent"}} onClick={this.toggleAlert} >Cool Beans</Button>
                  </Alert>
                </Row>)
                :
                (null)
                
              )
            }

            {
              (this.state.web3  || this.state.isOverride)
              ?
              (
                <Switch>
                {this.mapRoutes(routes)}
                <Redirect from="*" to="/MintingDesk" />
                </Switch>
              )
              :
              (null)
            }
            <Footer />   
        </div> /**/}
          </Row>
        </Container>
      </div> 
      </>
    );
  }
}

export default App;
