import { useMemo } from "react";
import { TeamInfo } from "../services/CurrentKHLTeams";
import Select from "react-select";
export interface SelectedTeamInfo {
    snokingUrl: string;
    teamId: string;
    name: string;
}

export const PickTeam: React.FC<{
    teamInfo: TeamInfo;
    className?: string;
    onTeamSelected: (info: SelectedTeamInfo) => void;
}> = ({ teamInfo, className, onTeamSelected }) => {
    const options = useMemo(
        () =>
            teamInfo.map(({ name, snokingUrl, teamId }) => ({
                value: { snokingUrl, teamId },
                label: name,
            })),
        [teamInfo]
    );

    const onUrlChange = (
        e:
            | {
                  value: {
                      snokingUrl: string;
                      teamId: string;
                  };
                  label: string;
              }
            | undefined
            | null
    ) => {
        if (e && !Array.isArray(e)) {
            const { snokingUrl, teamId } = e.value;
            const name = e.label;
            onTeamSelected({ snokingUrl, teamId, name });
            // this.updateCSV(snokingUrl, teamId, e.label);
        } else {
            throw new Error("react-select did something unexpected");
        }
    };
    return <Select className={className} options={options} onChange={onUrlChange} placeholder="Scroll or type..." />;
};
