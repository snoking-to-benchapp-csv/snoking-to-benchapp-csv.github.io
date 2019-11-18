import * as React from "react";

import Spinner from "react-bootstrap/Spinner";

import { DownloadPage } from "./DownloadPage";
import { Instructions } from "./Instructions";

import { getCurrentTeams, TeamInfo } from "../services/CurrentTeams";

export const TeamGettingPage = () => {
    const [teams, setTeams] = React.useState<null | TeamInfo>(null);
    React.useEffect(() => {
        getCurrentTeams().then((teams) => setTeams(teams));
    }, []);
    return (
        <>
            {teams ? (
                <>
                    <DownloadPage teamInfo={teams} />
                    <Instructions />
                </>
            ) : (
                <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "1em" }}>
                    <Spinner animation="border" />
                </div>
            )}
        </>
    );
};
