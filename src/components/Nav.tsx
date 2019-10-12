import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import BoostrapNav from "react-bootstrap/Nav";

export const Nav = () => {
    return (
        <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="#">
                <b>SnoKing to BenchApp CSV</b>
            </Navbar.Brand>
            <BoostrapNav variant="pills" fill className="justify-content-end" style={{ width: "100%" }}>
                <Button
                    href="https://github.com/snoking-to-benchapp-csv/snoking-to-benchapp-csv.github.io"
                    variant="info"
                >
                    GitHub
                </Button>
            </BoostrapNav>
        </Navbar>
    );
};
