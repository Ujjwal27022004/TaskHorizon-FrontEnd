import React, { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

const CustomTab = () => {
    useEffect(() => {
        microsoftTeams.initialize();
    }, []);

    return (
        <div>
            <h1>Welcome to My Custom Tab 🎉</h1>
            <p>This is a custom tab inside Microsoft Teams.</p>
        </div>
    );
};

export default CustomTab;
