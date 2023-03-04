import { useMemo } from "react";
import { TeamInfo } from "../services/CurrentTeams";
import Select from "react-select";
export interface SelectedTeamInfo {
    snokingUrl: string;
    teamId: string;
    name: string;
    isSnoking: boolean;
}

export const PickTeam: React.FC<{
    teamInfo: TeamInfo;
    className?: string;
    onTeamSelected: (info: SelectedTeamInfo) => void;
}> = ({ teamInfo, className, onTeamSelected }) => {
    const options = useMemo(
        () =>
            teamInfo.map(({ name, snokingUrl, teamId, isSnoking }) => ({
                value: { snokingUrl, teamId, isSnoking },
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
                      isSnoking: boolean;
                  };
                  label: string;
              }
            | undefined
            | null
    ) => {
        if (e && !Array.isArray(e)) {
            const { snokingUrl, teamId, isSnoking } = e.value;
            const name = e.label;
            onTeamSelected({ snokingUrl, teamId, name, isSnoking });
            // this.updateCSV(snokingUrl, teamId, e.label);
        } else {
            throw new Error("react-select did something unexpected");
        }
    };
    return <Select className={className} options={options} onChange={onUrlChange} placeholder="Scroll or type..." />;
};
