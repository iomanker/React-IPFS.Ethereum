import React from "react";
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import HistoryRoundedIcon from '@material-ui/icons/HistoryRounded';

const useStyles = makeStyles({
    root: {
      width: '100%',
      position: 'fixed',
      bottom: 0,
    },
});

export default function BottomNav(){
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    return (
        <BottomNavigation
          value={value}
          onChange={(evt, newVal) => { setValue(newVal)}}
          showLabels
          className={classes.root}
        >
            <BottomNavigationAction component={Link} to="/" label="Home" value="main" icon={<HomeRoundedIcon/>} />
            <BottomNavigationAction component={Link} to="/record" label="Record" value="write_record" icon={<CreateRoundedIcon/>} />
            <BottomNavigationAction component={Link} to="/history" label="History" value="history" icon={<HistoryRoundedIcon/>} />
        </BottomNavigation>
    );
}