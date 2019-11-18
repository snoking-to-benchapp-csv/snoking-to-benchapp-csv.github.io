import * as React from "react";
import { getCurrentTeams, TeamInfo } from "../services/getTeams";
import { DownloadPage } from "./DownloadPage";
import Spinner from "react-bootstrap/Spinner";

export const TeamGettingPage = () => {
    const [teams, setTeams] = React.useState<null | TeamInfo>(null);
    React.useEffect(() => {
        getCurrentTeams().then((teams) => setTeams(teams));
    }, []);
    return (
        <>
            {teams ? (
                <DownloadPage teamInfo={teams} />
            ) : (
                <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "1em" }}>
                    <Spinner animation="border" />
                </div>
            )}
        </>
    );
};
