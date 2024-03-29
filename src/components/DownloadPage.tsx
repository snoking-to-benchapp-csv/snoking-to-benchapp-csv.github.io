import { TeamInfo } from "../services/CurrentTeams";
import { PickTeam, SelectedTeamInfo } from "./PickTeam";
import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { ReactElement, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import { downloadCSV, EMIT_TYPES } from "../action/downloadCSV";
import { Alert } from "react-bootstrap";

const Step = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 0.5em 0;
`;

export const DownloadPage: React.FunctionComponent<{ teamInfo: TeamInfo; errors: ReactElement[] }> = ({
    teamInfo,
    errors,
}) => {
    const [selectedInfo, setSelectedInfo] = useState<null | SelectedTeamInfo>(null);
    const canDownload = useMemo(() => selectedInfo !== null, [selectedInfo]);

    const executeDownload = (type: EMIT_TYPES) => {
        downloadCSV({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            url: selectedInfo!.snokingUrl,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            teamId: selectedInfo!.teamId,
            emit: type,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            name: selectedInfo!.name,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            isSnoking: selectedInfo!.isSnoking,
        });
    };

    return (
        <div
            className={css`
                width: 100vw;
                display: flex;
                flex-direction: column;
                align-items: center;
            `}
        >
            {errors.length > 0 &&
                errors.map((error, i) => (
                    <Alert
                        key={i}
                        className={css`
                            margin: 1em;
                            width: 100%;
                            max-width: 600px;
                            text-align: center;
                        `}
                        variant="danger"
                    >
                        {error}
                    </Alert>
                ))}
            <Step>
                <PickTeam
                    className={css`
                        width: 100%;
                        max-width: 600px;
                    `}
                    teamInfo={teamInfo}
                    onTeamSelected={setSelectedInfo}
                />
            </Step>
            <Step>
                <div
                    className={css`
                        display: flex;
                        gap: 1em;
                    `}
                >
                    <Button
                        variant="primary"
                        disabled={!canDownload}
                        onClick={() => executeDownload(EMIT_TYPES.BENCH_APP)}
                    >
                        Download BenchApp CSV
                    </Button>
                    <Button
                        variant="primary"
                        disabled={!canDownload}
                        onClick={() => executeDownload(EMIT_TYPES.TEAM_COWBOY)}
                    >
                        Download Team Cowboy CSV
                    </Button>
                </div>
            </Step>
            <Step>
                <Button
                    variant="secondary"
                    href="https://github.com/snoking-to-benchapp-csv/snoking-to-benchapp-csv.github.io/wiki"
                >
                    Help & Support
                </Button>
            </Step>
        </div>
    );
};
