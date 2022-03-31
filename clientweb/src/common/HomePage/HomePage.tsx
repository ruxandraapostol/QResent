import React from "react";
import {Col, Row} from "react-bootstrap";
import './HomePage.css'
import image1 from "./Poli.jpg"

export default class HomePage extends React.Component<any> {
    render() {
        return <>
            <Row>
                <Col>
                    <div className="title" style={{marginTop: "12rem"}}>QResent</div>
                    <div className="subTitle">~ The perfect application for student attendance statistics ~</div>
                </Col>
                <Col>
                    <div className="blackShadow">
                        <img src={image1} style={{
                            width: "20rem",
                            height: "30rem",
                            marginTop: "2rem",
                            marginLeft: "-5rem"
                        }}/>
                    </div>
                </Col>
            </Row>
        </>
    }
}