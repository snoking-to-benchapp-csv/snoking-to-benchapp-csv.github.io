import React from "react";

import "./App.css";

import { saveAs } from "file-saver";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { TeamInfo } from "../services/getTeams";
import Button from "react-bootstrap/Button";
import { getSnokingSeasonData } from "../services/SnokingSeason";
import { SnokingGame } from "../../typings/snokingData";
import { BenchAppGamesToCSV } from "../transformers/BenchappGameToCSV";
import { SnokingGameToBenchappGame } from "../transformers/SnokingGameToBenchappGame";
import Select, { ValueType } from "react-select";

enum CSV_GENERATION_STATE {
    NOT_READY,
    LOADING,
    READY
}

interface AppProps {
    teamInfo: TeamInfo;
}
interface AppState {
    csvGenerationState: CSV_GENERATION_STATE;
    errorString?: string;
}

export class DownloadPage extends React.Component<AppProps, AppState> {
    private blob: Blob | null = null;

    private setStatePromise(newState: Partial<AppState>) {
        return new Promise((resolve) => {
            this.setState(newState as any, () => {
                resolve();
            });
        });
    }

    public state = {
        csvGenerationState: CSV_GENERATION_STATE.NOT_READY,
        errorString: undefined
    };

    private onUrlChange = (e: ValueType<{ value: { snokingUrl: string; teamId: string }; label: string }>) => {
        if (e && !Array.isArray(e)) {
            const { snokingUrl, teamId } = (e as any).value;
            this.updateCSV(snokingUrl, teamId);
        } else {
            throw new Error("react-select did something unexpected");
        }
    };

    private updateCSV = async (url: string, teamId: string) => {
        await this.setStatePromise({
            csvGenerationState: CSV_GENERATION_STATE.LOADING
        });

        let snoKingSeasonData: SnokingGame[] = [];
        try {
            snoKingSeasonData = await getSnokingSeasonData(url);
        } catch (e) {
            console.error({ error: e });
            this.setState({
                csvGenerationState: CSV_GENERATION_STATE.NOT_READY,
                errorString: "There was an issue getting the season data. Please try again later"
            });
            return;
        }

        let csvData = "";

        try {
            csvData = BenchAppGamesToCSV(snoKingSeasonData.map((n) => SnokingGameToBenchappGame(n, teamId)));
        } catch (e) {
            console.error({ error: e });
            this.setState({
                csvGenerationState: CSV_GENERATION_STATE.NOT_READY,
                errorString: "There was an issue parsing the season data. Please try again later"
            });
            return;
        }

        this.setState({
            csvGenerationState: CSV_GENERATION_STATE.READY,
            errorString: undefined
        });

        this.blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    };

    private saveBlob = () => {
        if (this.blob === null) {
            throw new Error("Should have a blob by now");
        }
        saveAs(this.blob, "schedule.csv");
    };

    public render() {
        const options = this.props.teamInfo.map(({ name, snokingUrl, teamId }) => ({
            value: { snokingUrl, teamId },
            label: name
        }));
        return (
            <div className="centeringDiv">
                {this.state.errorString && <Alert variant="danger">{this.state.errorString}</Alert>}

                <div style={{ width: "100%", padding: "0 1em 1em", maxWidth: "600px" }}>
                    <Select options={options} onChange={this.onUrlChange} placeholder="Scroll or type..." />
                </div>
                {(this.state.csvGenerationState === CSV_GENERATION_STATE.NOT_READY ||
                    this.state.csvGenerationState === CSV_GENERATION_STATE.READY) && (
                    <div className="button">
                        <Button
                            block
                            variant="primary"
                            disabled={this.state.csvGenerationState === CSV_GENERATION_STATE.NOT_READY}
                            onClick={this.saveBlob}
                        >
                            Download CSV
                        </Button>
                    </div>
                )}

                {this.state.csvGenerationState === CSV_GENERATION_STATE.LOADING && <Spinner animation="border" />}
            </div>
        );
    }
}
