import * as React from "react";

import Button from "react-bootstrap/Button";

import downloaded from "./img/downloaded.png";
import sidebar from "./img/sidebar.png";
import importButton from "./img/importButton.png";
import selectFile from "./img/selectFile.png";

export const Instructions: React.FunctionComponent = () => {
    const [showHelp, setShowHelp] = React.useState(false);

    return (
        <>
            {!showHelp && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: ".5em" }}>
                    <Button variant="secondary" onClick={() => setShowHelp(true)}>
                        Need help?
                    </Button>
                </div>
            )}
            {showHelp && (
                <>
                    <h2> Instructions </h2>
                    <ol>
                        <li>Select your team from the list above</li>
                        <li>
                            When ready, click the download button. That will download a file called{" "}
                            <code>schedule.csv</code>
                        </li>
                        <img width="200" src={downloaded} alt="Picture of downloaded file" />
                        <li>
                            Go to <a href="https://benchapp.com">your team on BenchApp</a>
                        </li>
                        <li>
                            Select <i>Schedule</i> from the sidebar
                        </li>
                        <img height="300px" src={sidebar} alt="Picture of the sidebar" />
                        <li>
                            On that page, choose <i>Import Schedule</i>
                        </li>
                        <img width="300px" src={importButton} alt="The location of the import schedule button" />
                        <li>
                            Choose <i>Select file</i>
                        </li>
                        <img height="300px" src={selectFile} alt="The location of the select file button" />
                        <li>Select your file</li>
                        <li>Follow the instructions from BenchApp</li>
                        <li>Done!</li>
                    </ol>
                </>
            )}
        </>
    );
};
