import React from "react";
import {Modal} from "react-bootstrap";
import QRCode from "react-qr-code"

interface QRCodeState{
    intervalName: string
    token: string;
    oldToken: string;
    timeLeft: number;
    interval1: any;
    interval2: any;
    interval3: any;
    subjectName: string;
    displayModal: (status: boolean, token:string) => any
}


export default class QRCodeGenerate extends React.Component<any, QRCodeState>{
    constructor(props: any) {
        super(props);
        this.state = {
            intervalName: props.tokenInterval,
            token: "",
            oldToken: "",
            timeLeft: 30,
            interval1: {},
            interval2: {},
            interval3: {},
            subjectName: props.subjectName,
            displayModal: props.displayModal,
        }
        this.closeModal = this.closeModal.bind(this);
        this.timeDec = this.timeDec.bind(this);
        this.getToken = this.getToken.bind(this);
    }

    timeDec() {
        this.setState({...this.state, timeLeft: this.state.timeLeft - 1})
    }

    async getToken() {
        var url = '/getToken/'+ this.state.subjectName +
            '/' + this.state.intervalName;
        var token = await fetch(url)
            .then((response) => {return response})
            .then((data) => {return data.text()});

        this.setState({
            ...this.state,
            oldToken: this.state.token,
            token: token,
            timeLeft: 30})
    }

    async deleteOldToken() {
        if(this.state.oldToken) {
            var url = '/disableToken/' + this.state.oldToken;
            await fetch(url);
        }
    }

    closeModal() {
        this.deleteOldToken();
        this.setState({
            ...this.state,
            oldToken: this.state.token})
        this.deleteOldToken();
        this.state.displayModal(false, "");
    }

    componentDidMount() {

        this.getToken()
        var interval1 = setInterval(() => {this.getToken()}, 30000);
        var interval2 = setInterval(() => {this.timeDec()}, 1000);
        var interval3 = setInterval(() => {this.deleteOldToken()}, 30000);


        this.setState({
            ...this.state,
            interval1: interval1,
            interval2: interval2,
            interval3: interval3})
    }

    componentWillUnmount() {
        clearInterval(this.state.interval2);
        clearInterval(this.state.interval1);
        clearInterval(this.state.interval3);
    }

    render() {
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
                        {this.state.timeLeft} seconds till refresh
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{textAlign: "center"}}>
                    <QRCode value={this.state.token}></QRCode>
                </Modal.Body>
            </Modal>
        </>;
    }
}