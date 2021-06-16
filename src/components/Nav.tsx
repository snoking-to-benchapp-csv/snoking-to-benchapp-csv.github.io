import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import BootstrapNav from "react-bootstrap/Nav";

export const Nav: React.FunctionComponent = () => {
    return (
        <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="#">
                <b>SnoKing to BenchApp CSV</b>
            </Navbar.Brand>
            <BootstrapNav variant="pills" fill className="justify-content-end" style={{ width: "100%" }}>
                <Button
                    href="https://github.com/snoking-to-benchapp-csv/snoking-to-benchapp-csv.github.io"
                    variant="success"
                >
                    GitHub
                </Button>
            </BootstrapNav>
        </Navbar>
    );
};
