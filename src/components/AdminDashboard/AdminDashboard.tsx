import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "../common/Card";
import { Row, Col } from "../common/Grid";
import { CountData } from "./AdminDashboard.types";
import api from "../../api";
import "./AdminDashboard.scss";
import { setIsLoading } from "../../store/actions";
import { AdminStore } from "../../store/types";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { CardTitle } from "../common/Card/Title";

export const AdminDashboard: React.FunctionComponent<{}> = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector((state: AdminStore) => state.isLoading);

  const [counts, setCounts] = React.useState({
    total: 0,
    tables: [],
  } as CountData);

  React.useEffect(() => {
    dispatch(setIsLoading(true));
    api
      .get("/admin/dashboard/count")
      .then((response) => {
        setCounts(response.data);
        dispatch(setIsLoading(false));
      })
      .catch((error) => {
        console.log(error);
        dispatch(setIsLoading(false));
      });
  }, [dispatch]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && counts.tables.length !== 0 && (
        <Card className="dashboard-card">
          <Col>
            <CardTitle>Table Counts</CardTitle>
            <Row>
              <Col cols="1" align="start">
                <div>Total:</div>
              </Col>
              <Col cols="4" align="end">
                <div>{counts.total}</div>
              </Col>
            </Row>
            {counts.tables.map((count, index) => {
              return (
                <Row key={`table-count-${index}`}>
                  <Col cols="1" align="start">
                    <div>{count.name}:</div>
                  </Col>
                  <Col cols="4" align="end">
                    <div>{count.count}</div>
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Card>
      )}
    </>
  );
};
