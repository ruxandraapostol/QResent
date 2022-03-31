import React from 'react';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import {AiFillDelete} from 'react-icons/ai';
import {AiFillEdit} from 'react-icons/ai';
import {AiFillFilePdf} from 'react-icons/ai';
import {FcStatistics} from 'react-icons/fc';
import {ImQrcode} from 'react-icons/im'
import {withRouter} from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import {CSVLink} from 'react-csv'
import {Button} from "react-bootstrap";
import Plot from 'react-plotly.js';

interface IntervalState{
    interval: any;
    parentName: string;
    tokenDisplay: (status: boolean, intervalName: string) => any;
    parentCallBack: () => void;
    editInterval: (interval: any, edit: boolean) => any;
    csvReport: any;
    csv: boolean;
    statistic: boolean;
    statisticData: any;
}

class SubjectIntervals extends React.Component<any, IntervalState> {
    constructor(props: any) {
        super(props);
        this.state = {
            parentName: props.subjectName,
            interval: props.interval,
            editInterval: props.editInterval,
            parentCallBack: props.deleteInterval,
            tokenDisplay: props.tokenDisplay,
            csvReport:  {
                data: "",
            },
            csv: false,
            statistic: false,
            statisticData: {},
        }

        this.getStatistic = this.getStatistic.bind(this);
        this.deleteThisInterval = this.deleteThisInterval.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.downloadAttendance = this.downloadAttendance.bind(this);
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            interval: {
                ...this.state.interval,
                "subjectName": this.state.parentName
            }
        })
    }

    async deleteThisInterval(event : any) {
        event.preventDefault();
        const interval = {
            "id": this.state.interval.id,
            "name": this.state.interval.name,
            "date": this.state.interval.date,
            "hours": this.state.interval.hours,
            "subjectName": this.state.interval.subjectName,
        }
        const body = JSON.stringify(interval);

        await fetch("/QResent/deleteInterval/" + this.state.interval.subjectName, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: body
        });

        this.state.parentCallBack()
    }

    async downloadAttendance() {
        const serverResponse = await fetch('/QResent/getAttendanceList/'
            + this.state.interval.subjectName + '/' + this.state.interval.name);
        const json = await serverResponse.json()

        const data = [
            ["Ldap", "First Name", "Last Name", "Class", "Status"],
            ...json.map((row: any) => [
                row.ldap,
                row.firstName,
                row.lastName,
                row.clazz,
                row.active ? "Activ" : "Prezent"
            ])
        ].map(e => e.join(","))
            .join("\n");

        this.setState({
            ...this.state,
            csv: true,csvReport: {
                filename: "Attendance" + this.state.interval.date + this.state.interval.hours+ ".csv",
                data: data,
            }
        })
    }

    closeModal() {
        this.setState({
            ...this.state,
            csv: false,
            statistic: false,
            statisticData: [],
            csvReport: {
                filename: "Attendance" + this.state.interval.date + this.state.interval.hours+ ".csv",
                data: "",
            }
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
        const CsvModal = () => {
            if(this.state.csv) {
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
                                Do you want to download the attendance list?
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <CSVLink {...this.state.csvReport}>Download</CSVLink>
                            <Button variant="dark" onClick={this.closeModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </>
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
            <CsvModal/>
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
                        onClick={() => this.state.tokenDisplay(true, this.state.interval.name)}
                    />


                    <AiFillFilePdf
                            size={30}
                            style={{cursor: "pointer"}}
                            onClick={() => this.downloadAttendance()}
                    />

                    <FcStatistics
                        size={30}
                        style={{cursor: "pointer"}}
                        onClick={() => this.getStatistic()}
                    />
                    <AiFillEdit
                        size={30}
                        style={{cursor: "pointer"}}
                        onClick={() => this.state.editInterval(this.state.interval, true)}
                    />
                    <AiFillDelete
                        size={30}
                        style={{cursor: "pointer"}}
                        onClick={(event) => {
                            this.deleteThisInterval(event)
                        }}
                    />
                </Col>
            </Row>
        </>
    }
}

export default withRouter(SubjectIntervals);