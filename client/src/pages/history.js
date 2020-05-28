import React from "react";
import { List, ListItem, ListItemText, Modal, Fade, Backdrop } from "@material-ui/core";
import { Card, CardActionArea, CardContent, Typography } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Cookies from 'universal-cookie';

import Web3 from "web3";
import RecordContract from "../contracts/Record.json";
import PersonBoxContract from "../contracts/PersonBox.json";    
import truffleContract from "truffle-contract";

const styles = (theme) => ({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow:'scroll'
    },
    paper: {
        padding: theme.spacing(2, 4, 3),
        '&:focus':{
            outline: 'none'
        }
    }
});

const useCardStyles = makeStyles({
    cardSize:{
        width: '100%',
        height: 'auto'
    },
    imgSize:{
        width: '100%',
        height: 'auto'
    }
});

function CardInfomation(props){
    const classes = useCardStyles();
    const imgUrlRoot = "http://127.0.0.1:8890/ipfs/";
    const imgUrl = props.imgUrl;
    if (imgUrl === "" || imgUrl === undefined){
        return(
            <Card>
            <CardContent>
                <Typography>Loading...</Typography>
                <Typography>Loading...</Typography>
            </CardContent>
            </Card>
        );
    }
    let totalUrl = imgUrlRoot + imgUrl;
    return (
        <Card className={classes.cardSize}>
            <CardActionArea>
                <img alt="ipfsImage" className={classes.imgSize} src={totalUrl}/>
            </CardActionArea>
            <CardContent>
                <Typography>{props.gpslocation}</Typography>
                <Typography>UNIX Time:{props.datetime} </Typography>
            </CardContent>
        </Card>
    );
}

class App extends React.Component{
    constructor(props){
        super(props);
        const cookies = new Cookies();
        this.state = {
            web3: null,
            address: cookies.get('address'),
            boxAddress: cookies.get('boxAddress'),
            selectedRecord: "",
            contract:{
                Record: null, PersonBox: null
            },
            records: [],
            modalStatus:{
                open: false
            },
            modalContent:{
                title: "Loading...",
                imgUrl: "",
                datetime: [],
                gpslocation: ""
            }
        };
        this.getPersonBoxRecords = this.getPersonBoxRecords.bind(this);
        this.getSingleRecord = this.getSingleRecord.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
    }

    async componentDidMount(){
        const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        this.setState({web3: web3});
        const declare_RecordContract = truffleContract(RecordContract);
        const declare_PersonBoxContract = truffleContract(PersonBoxContract);
        declare_RecordContract.setProvider(web3.currentProvider);
        declare_PersonBoxContract.setProvider(web3.currentProvider);
        this.setState({contract:{Record: declare_RecordContract}});
        let listResult = await this.getPersonBoxRecords(declare_PersonBoxContract);
        this.setState({records: listResult});
    }

    getPersonBoxRecords = async function (declare_PersonBoxContract){
        const instance = await declare_PersonBoxContract.at(this.state.boxAddress);
        let event = instance.getRecords({from: this.state.address});
        let result = await event.then((res)=>{
            return res.logs[0].args.list; 
        });
        return result;
    }

    getSingleRecord = async function(recordAddr){
        console.log("recordAddr: ", recordAddr);
        const instance = await this.state.contract.Record.at(recordAddr);
        let event = instance.get({from: this.state.address});
        let result = await event.then((res)=>{
            return res.logs[0].args;
        })
        return result;
    }

    handleModalOpen = async (evt) =>{
        console.log("evt: ", evt.target);
        this.setState({modalStatus:{open: true}});
        const address = evt.target.dataset['address'];
        console.log(address);
        let result = await this.getSingleRecord(address);
        this.setState({modalContent:{title: address, imgUrl: result['1'], datetime: result['2'].words, gpslocation: result['3']}});
    }

    handleModalClose = () =>{
        this.setState({modalStatus:{open: false}});
    }


    render(){
        const { classes } = this.props;
        const ListRecord = this.state.records.map((address, key)=>
            <ListItem button alignItems="flex-start" data-address={address} key={key} onClick={this.handleModalOpen}>
                <ListItemText primary={address} style={{pointerEvents: 'none'}}/>
            </ListItem>
        );
        return (
            <React.Fragment>
            <List className={classes.root} component="nav" aria-label="secondary mailbox folders">
                {ListRecord}
            </List>
            <Modal
              className={classes.modal} open={this.state.modalStatus.open}
              onClose={this.handleModalClose} closeAfterTransition
              BackdropComponent={Backdrop} BackdropProps={{timeout: 500}}>
                  <Fade in={this.state.modalStatus.open}>
                      <div className={classes.paper}>
                        <CardInfomation
                          imgUrl={this.state.modalContent.imgUrl}
                          datetime={this.state.modalContent.datetime}
                          gpslocation={this.state.modalContent.gpslocation}/>
                      </div>
                  </Fade>
            </Modal>
            </React.Fragment>
        );
    }
}
export default withStyles(styles)(App);