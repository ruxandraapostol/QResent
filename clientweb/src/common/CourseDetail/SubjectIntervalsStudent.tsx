import React from 'react';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import {withRouter} from "react-router-dom"
import {ImQrcode} from "react-icons/im";
import {AiFillFilePdf} from "react-icons/ai";
import {FcStatistics} from "react-icons/fc";
import Attendance from "./Attendance";
import Modal from "react-bootstrap/Modal";
import Plot from "react-plotly.js";
import {Button} from "react-bootstrap";

interface IntervalState{
    interval: any;
    attendance: boolean;
    ldap: string;
    statistic: boolean;
    statisticData: any;
}

class SubjectIntervalsStudent extends React.Component<any, IntervalState> {
    constructor(props: any) {
        super(props);
        this.state = {
            interval: props.interval,
            attendance: false,
            ldap: props.ldap,
            statistic: false,
            statisticData: {},
        }
        this.getStatistic = this.getStatistic.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.attendanceDisplay = this.attendanceDisplay.bind(this);
    }

    attendanceDisplay(status: boolean) {
        this.setState({
            ...this.state,
            attendance: status,
        })
    }


    closeModal() {
        this.setState({
            ...this.state,
            statistic: false,
            statisticData: []
        })
    }


    async getStatistic() {
        const serverResponse = await fetch('/QResent/getStats/'
            + this.state.interval.subjectName + '/' + this.state.interval.name);
        const json = await serverResponse.json();

        const labels = json.map((coordonate : any) => coordonate.x);
        const data = json.map((coordonate: any) => coordonate.y);

        this.setState({
            ...this.state,
            statistic: true,
            statisticData: {
                x: labels,
                y: data,
                type: "scatter"
            }
        })
    }

    render(){
        const ModalAttendance = () => {
            if(this.state.attendance) {
                return <Attendance
                    ldap={this.state.ldap}
                    interval={this.state.interval}
                    displayModal={this.attendanceDisplay}
                />
            }
            return <></>
        }

        const StatisticModal = () => {
            if(this.state.statistic) {
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
                                Statistics {this.state.interval.name}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Plot
                                data={[this.state.statisticData]}
                                layout={{width: 700, height: 500, title: "Attendance statistic"}}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="dark" onClick={this.closeModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            }
            return <></>
        }

        return <>
            <ModalAttendance/>
            <StatisticModal/>
            <Row>
                <Col>
                    <div className="lineFont">{this.state.interval.name}</div>
                </Col>
                <Col>
                    <div className="lineFont">{this.state.interval.date}</div>
                </Col>
                <Col>
                    <div className="lineFont">{this.state.interval.hours}</div>
                </Col>
                <Col style={{paddingTop: "1.2rem", textAlign: "right"}}>
                    <ImQrcode
                        size={30}
                        style={{cursor: "pointer"}}
                        onClick={() => this.attendanceDisplay(true)}
                    />
                    <FcStatistics
                        size={30}
                        style={{cursor: "pointer"}}
                        onClick={() => this.getStatistic()}
                    />
                </Col>
            </Row>
        </>
    }
}

export default withRouter(SubjectIntervalsStudent);