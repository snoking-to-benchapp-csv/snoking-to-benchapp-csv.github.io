import React from "react";

import { Nav } from "./Nav";
import { TeamGettingPage } from "./TeamGettingPage";

export const App: React.FunctionComponent = () => {
    return (
        <>
            <Nav />
            <div>
                <TeamGettingPage />
            </div>
        </>
    );
};
