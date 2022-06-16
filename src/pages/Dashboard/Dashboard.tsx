import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "../../components/common/Grid";
import { Card, CardTitle } from "../../components/common/Card";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { AdminStore } from "../../store/types";
import { DashboardProps, CountData } from "./Dashboard.types";
import { setIsLoading } from "../../store/actions";
import api from "../../api";
import "./Dashboard.scss";
import { AdminNavBar } from "../../components/AdminNavBar/AdminNavBar";

export const Dashboard: React.FunctionComponent<DashboardProps> = (
  props: DashboardProps
) => {
  document.title = "Etienne Thompson - Admin Center - Dashboard";
  document.documentElement.className = "theme-light";

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
    <div className="dashboard-container">
      <AdminNavBar />
      <Container>
        <Col>
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
        </Col>
      </Container>
    </div>
  );
};
