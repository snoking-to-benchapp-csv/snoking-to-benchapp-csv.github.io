import React from "react";

import "./App.css";

import Form from "react-bootstrap/Form";
import { FormControlProps } from "react-bootstrap/FormControl";
import { saveAs } from "file-saver";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import Button from "react-bootstrap/Button";
import { debounce } from "lodash";
import { BenchAppUIUrlToDataUrl } from "../transformers/BenchAppUIUrlToDataUrl";
import { getSnokingSeasonData } from "../services/SnokingSeason";
import { SnokingGame } from "../../typings/snokingData";
import { BenchAppGamesToCSV } from "../transformers/BenchappGameToCSV";
import { SnokingGameToBenchappGame } from "../transformers/SnokingGameToBenchappGame";

const VALID_SNOKING_URLS = [
    "https://snokingpondhockey.com",
    "http://snokingpondhockey.com",
    "https://snokinghockeyleague.com",
    "http://snokinghockeyleague.com"
];

enum CSV_GENERATION_STATE {
    NOT_READY,
    LOADING,
    READY
}

interface AppState {
    csvGenerationState: CSV_GENERATION_STATE;
    errorString?: string;
}

export class DownloadPage extends React.Component<{}, AppState> {
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

    private onUrlChange = (e: React.FormEvent<FormControlProps>) => {
        this.updateCSV(e.currentTarget.value || "");
    };

    private updateCSV = debounce(async (url: string) => {
        await this.setStatePromise({
            csvGenerationState: CSV_GENERATION_STATE.LOADING
        });

        if (VALID_SNOKING_URLS.findIndex((x) => url.startsWith(x)) < 0) {
            // Not a valid url prefix
            this.setState({
                csvGenerationState: CSV_GENERATION_STATE.NOT_READY,
                errorString: "Please enter a valid Snoking URL"
            });
            return;
        }

        const dataUrl = BenchAppUIUrlToDataUrl(url);
        if (!dataUrl) {
            this.setState({
                csvGenerationState: CSV_GENERATION_STATE.NOT_READY,
                errorString: "Please enter a valid Snoking URL for a specific team"
            });
            return;
        }

        let snoKingSeasonData: SnokingGame[] = [];
        try {
            snoKingSeasonData = await getSnokingSeasonData(dataUrl);
        } catch {
            this.setState({
                csvGenerationState: CSV_GENERATION_STATE.NOT_READY,
                errorString: "There was an issue getting the season data. Please try again later"
            });
            return;
        }

        let csvData = "";

        try {
            csvData = BenchAppGamesToCSV(snoKingSeasonData.map(SnokingGameToBenchappGame));
        } catch {
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
    }, 500);

    private saveBlob = () => {
        if (this.blob === null) {
            throw new Error("Should have a blob by now");
        }
        saveAs(this.blob, "schedule.csv");
    };

    public render() {
        return (
            <div className="centeringDiv">
                {this.state.errorString && <Alert variant="danger">{this.state.errorString}</Alert>}
                <Form.Group controlId="teamID">
                    <Form.Control className="urlInput" placeholder="Team URL" onChange={this.onUrlChange} />
                </Form.Group>
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
