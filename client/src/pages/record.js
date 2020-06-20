import React from "react";
import PropTypes from 'prop-types';
import { Button, Card, CardContent, TextField, Grid, Backdrop, CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { geolocated } from "react-geolocated";
import Cookies from 'universal-cookie';

import ipfs from "../ipfs";
import RecordContract from "../contracts/Record.json";
import PersonBoxContract from "../contracts/PersonBox.json";    
import truffleContract from "truffle-contract";
import Web3 from "web3";

const styles = (theme) => ({
    field: {
        width: "100%",
        "margin-bottom": "10px"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',  
    },
    cardBottom: {
        "margin-bottom": "50px"
    }
});

class App extends React.Component{
    constructor(props){
        super(props);
        const cookies = new Cookies();
        this.state = {
            address: cookies.get('address'),
            boxAddress: cookies.get('boxAddress'),
            backdropOpen: false, 
            coords:{
                latitude: -1.0, longitude: -1.0, text: "-1,-1"
            },
            selectedFile: null,
            selectedFileBuffer: null,
            contract:{
                Record: null, PersonBox: null
            },
            result:{
                ipfsHashValue: "",
                recordHashValue: ""
            },
            web3: null
        };
        this.geolocationRenew = this.geolocationRenew.bind(this);
    }

    async componentDidMount(){
        const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        this.setState({web3: web3});
        const declare_RecordContract = truffleContract(RecordContract);
        const declare_PersonBoxContract = truffleContract(PersonBoxContract);
        declare_RecordContract.setProvider(web3.currentProvider);
        declare_PersonBoxContract.setProvider(web3.currentProvider);
        this.setState({contract:{Record: declare_RecordContract, PersonBox: declare_PersonBoxContract}});
    }

    handleSubmit = async (evt) =>{
        evt.preventDefault();
        this.setState({backdropOpen: true});
        console.log("Start Upload");
        let ipfsAddress = "";
        for await (const result of ipfs.add(this.state.selectedFileBuffer)){
            console.log(result.path);
            ipfsAddress = result.path;
            this.setState({result: {ipfsHashValue: ipfsAddress}});
        }
        if (ipfsAddress !== undefined && ipfsAddress !== ""){
            const recordInstance = await this.state.contract.Record.new({from: this.state.address});
            var now_timestamp = String(Date.now());
            console.log("Record Time:" + now_timestamp);
            await recordInstance.set(ipfsAddress, now_timestamp, this.state.coords.text, {from: this.state.address});
            this.setState({result:{recordHashValue: recordInstance.address}});
            const personBoxInstance = await this.state.contract.PersonBox.at(this.state.boxAddress);
            personBoxInstance.append(recordInstance.address, {from: this.state.address})
        }else{
            console.log("無 ipfs 位址");
        }
        this.setState({backdropOpen: false});
    }

    closeBackdrop = () =>{
        this.setState({backdropOpen: false});
    }

    geolocationRenew = function(evt){
        evt.preventDefault();
        // ERROR(1): User denied geolocation prompt
        // ERROR(2): Unknown error acquiring position
        if (this.props.isGeolocationAvailable){
            if (this.props.isGeolocationEnabled){
                this.setState({coords: {
                    latitude: this.props.coords.latitude,
                    longitude: this.props.coords.longitude,
                    text: this.props.coords.latitude + "," + this.props.coords.longitude
                }});
            }
        }
    }

    ipfsCaptureFile = (evt)=>{
        evt.stopPropagation();
        evt.preventDefault();
        const file = evt.target.files[0];
        console.log(file);
        this.setState({selectedFile: file});
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => this.ipfsConvertBuffer(reader);
    }

    ipfsConvertBuffer = async (reader) =>{
        const buffer = await Buffer.from(reader.result);
        this.setState({selectedFileBuffer: buffer});
    }


    render(){
        const { classes } = this.props;
        return (
        <React.Fragment>
            <Card className={classes.cardBottom }>
                <CardContent>
                    <form onSubmit={this.handleSubmit}>
                        <Grid container direction="row" justify="flex-start" spacing={1}>
                            <Grid item xs={12}> 
                                <TextField disabled id="eth-address" label="錢包位址" value={this.state.address} className={classes.field}/>
                            </Grid>
                            <Grid item xs={12}> 
                                <TextField disabled id="personBox-address" label="資訊盒位址" value={this.state.boxAddress} className={classes.field}/>
                            </Grid>
                            <Grid container direction="row" justify="flex-start" spacing={1}>
                                <Grid item xs={10}>
                                    <TextField InputProps={{readOnly: true}} id="gps-location" label="GPS位置" value={this.state.coords.text} className={classes.field}/>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button type="button" color="primary" onClick={this.geolocationRenew}>更新</Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" component="label" color="primary" className={classes.field}>
                                    <input type="file" onChange={this.ipfsCaptureFile}/>
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                            <Button type="submit" color="primary">
                                送出
                            </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Grid item xs={12}>
                        <TextField InputProps={{readOnly: true}} id="ipfs-address" label="IPFS位址" value={this.state.result.ipfsHashValue} className={classes.field}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField InputProps={{readOnly: true}} id="record-address" label="記錄位址" value={this.state.result.recordHashValue} className={classes.field}/>
                    </Grid>
                </CardContent>
            </Card>
            <Backdrop 
              className={classes.backdrop}
              open={this.state.backdropOpen}
              onClick={this.closeBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </React.Fragment>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(geolocated({
    positionOptions: {
        enableHighAccuracy: false
    },
    userDecisionTimeout: 5000
})(App));