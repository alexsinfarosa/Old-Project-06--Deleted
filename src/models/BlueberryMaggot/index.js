import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";
import format from "date-fns/format";
import isAfter from "date-fns/is_after";
import isWithinRange from "date-fns/is_within_range";

//  reflexbox
import { Flex, Box, Heading } from "rebass";

// styles
import "styles/shared.styl";

// styled components
import { Value, Info, CSVButton } from "./styles";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";
import Button from "antd/lib/button";
import "antd/lib/button/style/css";
import Spin from "antd/lib/spin";
import "antd/lib/spin/style/css";

import Graph from "./Graph";

@inject("store")
@observer
export default class BlueberryMaggot extends Component {
  constructor(props) {
    super(props);
    this.props.store.app.setCSVData();
  }

  rowColor = idx => {
    if (idx > 2) {
      return "forecast";
    } else {
      return "past";
    }
  };

  render() {
    const {
      ACISData,
      station,
      areRequiredFieldsSet,
      isGraph,
      displayPlusButton,
      state,
      isLoading,
      CSVData,
      endDate,
      currentYear,
      startDateYear,
      bmModel
    } = this.props.store.app;
    const { mobile } = this.props;

    const missingDays = () => {
      const idx = ACISData.findIndex(o => o.date === endDate);
      const today = ACISData[idx];
      if (today) return today.missingDays.length;
    };

    const todayCDD = () => {
      const idx = ACISData.findIndex(o => o.date === endDate);
      const today = ACISData[idx];
      if (today) return today.cdd;
    };

    let displayDDTable = true;

    const stage = () => {
      const { endDate, startDateYear } = this.props.store.app;
      const yearPlusOne = parseInt(startDateYear, 10) + 1;
      const sDate = `${startDateYear}-10-01`;
      const eDate = `${yearPlusOne}-02-28`;
      if (isWithinRange(endDate, sDate, eDate)) {
        displayDDTable = false;
        return [bmModel[0]];
      } else {
        if (todayCDD() <= 613) return [bmModel[1]];
        if (todayCDD() > 613 && todayCDD() <= 863) return [bmModel[2]];
        if (todayCDD() > 863 && todayCDD() <= 963) return [bmModel[3]];
        if (todayCDD() > 964) return [bmModel[4]];
      }
    };

    // To display the 'forecast text' and style the cell
    const forecastText = date => {
      return (
        <Flex justify="center" align="center" column>
          <Value>
            {format(date, "MMM D")}
          </Value>
          {startDateYear === currentYear &&
            isAfter(date, endDate) &&
            <Info style={{ color: "#4D3919" }}>Forecast</Info>}
        </Flex>
      );
    };

    const emergence = (text, record, i) => {
      let ddColor = "";
      if (text < 613) ddColor = "green";
      if (text > 613 && text <= 864) ddColor = "orange";
      if (text > 864) ddColor = "red";
      if (record.missingDay === 1)
        return (
          <Flex justify="center" align="center">
            <Value>No data</Value>
          </Flex>
        );
      if (text > 913) {
        return (
          <Flex
            justify="center"
            align="center"
            column
            color={ddColor}
            style={{ background: "white", borderRadius: "5px" }}
          >
            <Value>
              {record.cdd}
              <span style={{ color: "red", marginLeft: "5px" }}>
                {record.cumulativeMissingDays > 0
                  ? `(+${record.cumulativeMissingDays})`
                  : null}
              </span>
            </Value>

            <Box style={{ fontSize: "12px" }}>emergence &#8773; 913</Box>
          </Flex>
        );
      }
      return (
        <Flex
          justify="center"
          align="center"
          column
          color={ddColor}
          style={{ background: "white", borderRadius: "5px" }}
        >
          <Value>
            {record.cdd}
            <span style={{ color: "red", marginLeft: "10px" }}>
              {record.cumulativeMissingDays > 0
                ? `(+${record.cumulativeMissingDays})`
                : null}
            </span>
          </Value>
        </Flex>
      );
    };

    const description = record => {
      if (record.missingDays.length > 0) {
        return (
          <Flex style={{ fontSize: ".6rem" }} column>
            <Box col={12} lg={6} md={6} sm={12}>
              <Box col={12} lg={12} md={12} sm={12}>
                {record.missingDays.length > 1
                  ? <div>
                      No data available for the following{" "}
                      {record.cumulativeMissingDays} dates:{" "}
                    </div>
                  : <div>No data available for the following date:</div>}
              </Box>
            </Box>
            <br />
            <Box col={12} lg={6} md={6} sm={12}>
              {record.missingDays.map((date, i) =>
                <div key={i}>
                  - {date}
                </div>
              )}
            </Box>
          </Flex>
        );
      }
      return null;
    };

    const columns = [
      {
        title: "Date",
        className: "table",
        dataIndex: "date",
        key: "date",
        width: 150,
        render: date => forecastText(date)
      },
      {
        title: "Degree Days (base 50˚F BE)",
        children: [
          {
            title: "Daily",
            className: "table",
            dataIndex: "dd",
            key: "dd"
          },
          {
            title: "Accumulation from January 1st",
            className: "table",
            dataIndex: "cdd",
            key: "cdd",
            render: (text, record, i) => emergence(text, record, i)
          }
        ]
      },
      {
        title: "Temperature (˚F)",
        children: [
          {
            title: "Min",
            className: "table",
            dataIndex: "Tmin",
            key: "Tmin"
          },
          {
            title: "Max",
            className: "table",
            dataIndex: "Tmax",
            key: "Tmax"
          },
          {
            title: "Avg",
            className: "table",
            dataIndex: "Tavg",
            key: "Tavg"
          }
        ]
      }
    ];

    const columnsMobile = [
      {
        title: "Date",
        className: "table",
        dataIndex: "date",
        key: "date",
        width: 70,
        render: date => forecastText(date)
      },
      {
        title: "Degree Days (base 50˚F BE)",
        children: [
          {
            title: "Daily",
            className: "table",
            dataIndex: "dd",
            key: "dd"
          },
          {
            title: "Accumulation from January 1st",
            className: "table",
            dataIndex: "cdd",
            key: "cdd",
            render: (text, record, i) => emergence(text, record, i)
          }
        ]
      }
    ];

    const pest = [
      {
        title: "Pest Status",
        className: "table",
        dataIndex: "status",
        key: "status",
        className: "stage"
      },
      {
        title: "Pest Management",
        className: "table",
        dataIndex: "management",
        key: "management",
        className: "stage"
      }
    ];

    const statusMobile = [
      {
        title: "Pest Status",
        dataIndex: "status",
        key: "status",
        className: "stageMobile"
      }
    ];

    const managementMobile = [
      {
        title: "Pest Management",
        dataIndex: "management",
        key: "management",
        className: "stageMobile"
      }
    ];

    return (
      <Flex column align="center">
        <Box w={["100%", "90%", "90%"]}>
          <Heading fontSize={[3, 3, 4]}>
            <i>Blueberry Maggot</i> results for {" "}
            <span style={{ color: "#4c4177" }}>
              {station.name}, {state.postalCode}
            </span>
          </Heading>

          <Flex column>
            {!mobile
              ? <Box my={2} w={["100%", "90%", "90%"]}>
                  <Table
                    bordered
                    size="middle"
                    columns={pest}
                    rowKey={record => record}
                    loading={ACISData.length === 0}
                    pagination={false}
                    dataSource={areRequiredFieldsSet ? stage() : null}
                  />
                </Box>
              : <Box my={2} w={["100%", "90%", "90%"]}>
                  <Table
                    bordered
                    size="middle"
                    columns={statusMobile}
                    rowKey={record => record}
                    loading={ACISData.length === 0}
                    pagination={false}
                    dataSource={areRequiredFieldsSet ? stage() : null}
                  />
                  <br />
                  <Table
                    bordered
                    size="middle"
                    columns={managementMobile}
                    rowKey={record => record}
                    loading={ACISData.length === 0}
                    pagination={false}
                    dataSource={areRequiredFieldsSet ? stage() : null}
                  />
                </Box>}
          </Flex>

          <Flex>
            <Box my={2} fontSize={1} w={["100%", "90%", "90%"]}>
              <i>
                Blueberry maggot emergence is predicted to occur when
                approximately <span style={{ color: "black" }}>913</span> degree
                days, base 50 ˚F, have accumulated from January 1st.
              </i>
            </Box>
          </Flex>

          {displayDDTable &&
            <Flex column>
              <Flex>
                <Box my={1} fontSize={1} w={["100%", "90", "90%"]}>
                  Accumulated degree days (base 50°F) from 01/01/{startDateYear}{" "}
                  through {format(endDate, "MM/DD/YYYY")}:{" "}
                  <span style={{ color: "black" }}>{todayCDD()}</span>
                  <small> ({` ${missingDays()}`} days missing )</small>
                </Box>
              </Flex>

              <Flex>
                {!mobile
                  ? <Box mt={1} w={["100%", "90%", "90%"]}>
                      {displayPlusButton
                        ? <Table
                            bordered
                            size="small"
                            columns={columns}
                            rowKey={record => record.dateTable}
                            loading={ACISData.length === 0}
                            pagination={false}
                            dataSource={
                              areRequiredFieldsSet
                                ? takeRight(ACISData, 8)
                                : null
                            }
                            expandedRowRender={record => description(record)}
                          />
                        : <Table
                            rowClassName={(rec, idx) => this.rowColor(idx)}
                            bordered
                            size="middle"
                            columns={columns}
                            rowKey={record => record.dateTable}
                            loading={ACISData.length === 0}
                            pagination={false}
                            dataSource={
                              areRequiredFieldsSet
                                ? takeRight(ACISData, 8)
                                : null
                            }
                          />}
                    </Box>
                  : <Box mt={1} w={["100%", "90%", "90%"]}>
                      {displayPlusButton
                        ? <Table
                            bordered
                            size="small"
                            columns={columnsMobile}
                            rowKey={record => record.dateTable}
                            loading={ACISData.length === 0}
                            pagination={false}
                            dataSource={
                              areRequiredFieldsSet
                                ? takeRight(ACISData, 8)
                                : null
                            }
                            expandedRowRender={record => description(record)}
                          />
                        : <Table
                            rowClassName={(rec, idx) => this.rowColor(idx)}
                            bordered
                            size="small"
                            columns={columnsMobile}
                            rowKey={record => record.dateTable}
                            loading={ACISData.length === 0}
                            pagination={false}
                            dataSource={
                              areRequiredFieldsSet
                                ? takeRight(ACISData, 8)
                                : null
                            }
                          />}
                    </Box>}
              </Flex>

              <Flex
                my={2}
                justify="space-around"
                align="baseline"
                w={["100%", "90%", "90%"]}
              >
                <Box>
                  <a
                    target="_blank"
                    href={`http://forecast.weather.gov/MapClick.php?textField1=${station.lat}&textField2=${station.lon}`}
                    type="secondary"
                  >
                    Forecast Details
                  </a>
                </Box>

                <Box>
                  <Button type="secondary" icon="download">
                    <CSVButton
                      data={CSVData.slice()}
                      filename={"blueberryMaggotModel.csv"}
                      target="_blank"
                    >
                      Download CSV
                    </CSVButton>
                  </Button>
                </Box>
              </Flex>

              <Flex my={1}>
                <Box w={["100%", "90%", "90%"]}>
                  <i>
                    <em style={{ color: "black" }}>
                      Disclaimer: These are theoretical predictions and
                      forecasts.
                    </em>
                    The theoretical models predicting pest development or
                    disease risk use the weather data collected (or forecasted)
                    from the weather station location. These results should not
                    be substituted for actual observations of plant growth
                    stage, pest presence, and disease occurrence determined
                    through scouting or insect pheromone traps.
                  </i>
                </Box>
              </Flex>
            </Flex>}
        </Box>

        <Box w={["100%", "90%", "90%"]}>
          {isGraph && <Graph />}
        </Box>
      </Flex>
    );
  }
}
