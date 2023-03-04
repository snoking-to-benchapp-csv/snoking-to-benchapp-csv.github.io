import * as React from "react";

import Spinner from "react-bootstrap/Spinner";

import { DownloadPage } from "./DownloadPage";

import { getCurrentTeams, TeamInfo } from "../services/CurrentTeams";
import { useEffect, useState } from "react";

export const TeamGettingPage: React.FunctionComponent = () => {
    // This page's entire job is to sit, wait for a list of the teams to be downloaded from
    // SKAHL and then show the actual application.
    // This way, all of the more complicated code can just assume the team info is available.
    // TODO: This should have some sort of timeout that shows an error page so people aren't staring at it forever.
    const [teams, setTeams] = useState<null | TeamInfo>(null);
    const [errors, setErrors] = useState<null | string[]>();
    useEffect(() => {
        getCurrentTeams().then((data) => {
            setTeams(data.teams);
            setErrors(data.errors);
        });
    }, []);
    return (
        <>
            {teams && errors ? (
                <DownloadPage teamInfo={teams} errors={errors} />
            ) : (
                <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "1em" }}>
                    <Spinner animation="border" />
                </div>
            )}
        </>
    );
};
