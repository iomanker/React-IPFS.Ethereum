import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {Card, TextField, Button} from '@material-ui/core';
// import CardAction from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Cookies from 'universal-cookie';

import PersonBoxContract from "../contracts/PersonBox.json";    
import truffleContract from "truffle-contract";
import Web3 from "web3";

const useStyles = makeStyles({
    root: {
        minWidth: 275
    },
    title: {
        fontSize: 21
    },
    ether: {
        "&::after":{
            display: 'inline-block',
            content: '"ETH"',
            'padding-left': '5px'
        }
    },
    field: {
        width: "100%",
        "margin-bottom": "10px"
    }
});

function App(){
    const cookies = new Cookies();
    const [Address, setAddress] = useState(cookies.get('address'));
    const [Ether, setEther] = useState(0);
    const [BoxAddress, setBoxAddress] = useState(cookies.get('boxAddress'));
    const classes = useStyles();
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));;
    const declare_PersonBoxContract = truffleContract(PersonBoxContract);
    const handleWallet = ()=>{
        if (web3 !== undefined && (Address !== "" && Address !== undefined )){
            web3.eth.getBalance(Address).then((val)=>{
                setEther(val / 1e18);
            });
        }
    }
    handleWallet();
    return (
    <React.Fragment>
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    個人資訊
                </Typography>
                <Typography className={classes.ether}>
                    {Ether}
                </Typography>
                <TextField id="address" label="錢包位址" onChange={
                    (evt) => {
                        setAddress(evt.target.value); 
                        cookies.set('address',evt.target.value,{path: '/'})
                    }} value={Address} className={classes.field}/>

                <TextField id="box-address" label="資訊盒位址" onChange={
                    (evt) => {
                        setBoxAddress(evt.target.value); 
                        cookies.set('boxAddress',evt.target.value,{path: '/'})
                    }} value={BoxAddress || ''} className={classes.field}/>
                <Button color="primary" type="button" onClick={async () =>{
                    console.log("Clicked");
                    declare_PersonBoxContract.setProvider(web3.currentProvider);
                    const instance = await declare_PersonBoxContract.deployed();
                    console.log(instance.address);
                    setBoxAddress(instance.address);
                    cookies.set('boxAddress',instance.address,{path: '/'})
                }}>建立資訊盒</Button>
            </CardContent>
        </Card>
    </React.Fragment>);
}

export default App;