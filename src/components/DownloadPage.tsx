import React from "react";

import "./App.css";

import { saveAs } from "file-saver";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { TeamInfo } from "../services/CurrentTeams";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { getSnokingSeasonData } from "../services/SnokingSeason";
import { SnokingGame } from "../../typings/snokingData";
// eslint-disable-next-line
import { BenchAppGamesToCSV } from "../transformers/BenchAppGameToCSV";
import { DBLGamesToCSV } from "../transformers/DBLGameToCSV";
// eslint-disable-next-line
import { SnokingGameToBenchappGame } from "../transformers/SnokingGameToBenchappGame";
import { DBLGameToTeamCowboyGame } from "../transformers/DBLGameToTeamCowboyGame";
import Select from "react-select";

import moment from "moment";

enum CSV_GENERATION_STATE {
    NOT_READY,
    LOADING,
    READY,
}

interface AppProps {
    teamInfo: TeamInfo;
}

interface AppState {
    csvGenerationState: CSV_GENERATION_STATE;
    errorString?: string;
    newGamesOnly: boolean;
    benchApp: boolean;
}

export class DownloadPage extends React.Component<AppProps, AppState> {
    private blob: Blob | null = null;
    private setStatePromise(newState: Partial<AppState>) {
        return new Promise<void>((resolve) => {
            this.setState({ ...this.state, ...newState }, () => {
                resolve();
            });
        });
    }
    public state = {
        csvGenerationState: CSV_GENERATION_STATE.NOT_READY,
        errorString: undefined,
        newGamesOnly: true,
        benchApp: true,
    };
    private onUrlChange = (
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
            this.updateCSV(snokingUrl, teamId, e.label);
        } else {
            throw new Error("react-select did something unexpected");
        }
    };
    private updateCSV = async (url: string, teamId: string, label: string) => {
        await this.setStatePromise({
            csvGenerationState: CSV_GENERATION_STATE.LOADING,
        });
        let snoKingSeasonData: SnokingGame[] = [];
        try {
            snoKingSeasonData = await getSnokingSeasonData(url);
        } catch (e) {
            console.error({ error: e });
            this.setState({
                csvGenerationState: CSV_GENERATION_STATE.NOT_READY,
                errorString: "There was an issue getting the season data. Please try again later",
            });
            return;
        }
        let csvData = "";
        try {
            const dataByDates = snoKingSeasonData.filter(
                (n) =>
                    !this.state.newGamesOnly ||
                    moment(n.dateTime) > moment().subtract(1, "days") /* only games in the future with some fudge*/
            );
            if (!label.includes("DBHL")) {
                csvData = BenchAppGamesToCSV(dataByDates.map((n) => SnokingGameToBenchappGame(n, teamId)));
            } else {
                csvData = DBLGamesToCSV(dataByDates.map((n) => DBLGameToTeamCowboyGame(n, teamId)));
            }
        } catch (e) {
            console.error({ error: e });
            this.setState({
                csvGenerationState: CSV_GENERATION_STATE.NOT_READY,
                errorString: "There was an issue parsing the season data. Please try again later",
            });
            return;
        }
        this.setState({
            csvGenerationState: CSV_GENERATION_STATE.READY,
            errorString: undefined,
        });
        this.blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    };
    private saveBlob = () => {
        if (this.blob === null) {
            throw new Error("Should have a blob by now");
        }
        saveAs(this.blob, "schedule.csv");
    };

    public render(): React.ReactNode {
        const options = this.props.teamInfo.map(({ name, snokingUrl, teamId }) => ({
            value: { snokingUrl, teamId },
            label: name,
        }));
        return (
            <div className="centeringDiv">
                {this.state.errorString && <Alert variant="danger">{this.state.errorString}</Alert>}
                <div style={{ width: "100%", padding: "0 1em 1em", maxWidth: "600px" }}>
                    <Select options={options} onChange={this.onUrlChange} placeholder="Scroll or type..." />
                </div>
                {(this.state.csvGenerationState === CSV_GENERATION_STATE.NOT_READY ||
                    this.state.csvGenerationState === CSV_GENERATION_STATE.READY) && (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div className="button" style={{ paddingRight: "1em" }}>
                            <Button
                                block
                                variant="primary"
                                disabled={this.state.csvGenerationState === CSV_GENERATION_STATE.NOT_READY}
                                onClick={this.saveBlob}
                            >
                                Download CSV
                            </Button>
                        </div>
                        <Form.Check
                            style={{ paddingTop: ".3em" }}
                            type="checkbox"
                            label="Include old games?"
                            onChange={() => this.setState({ newGamesOnly: !this.state.newGamesOnly })}
                        />
                    </div>
                )}
                {this.state.csvGenerationState === CSV_GENERATION_STATE.LOADING && <Spinner animation="border" />}
            </div>
        );
    }
}
