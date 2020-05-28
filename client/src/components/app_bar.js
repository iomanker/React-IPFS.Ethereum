import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";


function App(){
    return (
        <React.Fragment>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6">
                    Self defending for shared mobility system
                    </Typography>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

export default App;