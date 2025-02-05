import React, { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

const CustomTab = () => {
    useEffect(() => {
        microsoftTeams.initialize();
    }, []);

    return (
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
            <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="YouTube Video"
                style={{ width: "100%", height: "100%", border: "none" }} 
                allowFullScreen
            />
        </div>
    );
};

export default CustomTab;
