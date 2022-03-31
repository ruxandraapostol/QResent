import React from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";

interface AttendanceState{
    token: string;
    studentLdap: string;
    interval: any;
    alert: string;
    displayModal: (status: boolean) => any
}


export default class AttendanceGenerate extends React.Component<any, AttendanceState>{
    constructor(props: any) {
        super(props);
        this.state = {
            token: "",
            alert: "",
            interval: props.interval,
            studentLdap: props.ldap,
            displayModal: props.displayModal,
        }
        this.closeModal = this.closeModal.bind(this);
        this.changeToken = this.changeToken.bind(this);
        this.attend = this.attend.bind(this);
    }

    changeToken(event: any){
        this.setState({
            ...this.state,
            token: event.target.value
        })
    }

    async attend(event: any) {
        event.preventDefault();

        const response = await fetch(
            "/scannedQR/" + this.state.token,
            {
                method: "POST",
                headers: {
                    'Accept': 'text/plain',
                    'Content-Type': 'text/plain'
                },
                body: this.state.studentLdap
            })
            .then(response => {return response;})
            .then(data => {return data.text()});

        this.setState({
            ...this.state,
            alert: response
        })
    }

    closeModal() {
        this.state.displayModal(false);
    }

    render() {
        const  AlertMessage = () => {
            if(this.state.alert) {
                return <>
                    <Alert show={true} variant="dark">
                        <Alert.Heading>{this.state.alert}</Alert.Heading>
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => this.setState({...this.state, alert: ""})} variant="outline-dark">
                                Close
                            </Button>
                        </div>
                    </Alert>
                </>
            }
            return <></>
        }



        return <>
            <Modal
                show={true}
                onHide={() => this.closeModal()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Attend to {this.state.interval.subjectName} course
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{textAlign: "center"}}>
                    <h5>{this.state.interval.name} - {this.state.interval.date} {this.state.interval.hours} </h5>
                    <br/>
                    <Form.Group className="mb-3">
                        <Form.Control
                            onChange={this.changeToken}
                            value={this.state.token}
                            as="textarea"
                            type="text"
                            placeholder="Enter the token" />
                    </Form.Group>
                    <AlertMessage/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={this.attend}>Attend</Button>
                </Modal.Footer>
            </Modal>
        </>;
    }
}