import React, { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

const DevTab = () => {
    useEffect(() => {
        microsoftTeams.initialize();
    }, []);

    return (
        <div>
            <h1>Welcome to Dev-1 Tab 🚀</h1>
            <p>This is a new tab named Dev-1 inside Microsoft Teams.</p>
        </div>
    );
};

export default DevTab;
