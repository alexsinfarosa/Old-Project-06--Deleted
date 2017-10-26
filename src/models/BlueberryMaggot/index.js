import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";
import format from "date-fns/format";
import isAfter from "date-fns/is_after";
import isBefore from "date-fns/is_before";
import isThisYear from "date-fns/is_this_year";
import isWithinRange from "date-fns/is_within_range";
import IconNewa from "components/newa_logo.svg";
//  reflexbox
import { Flex, Box, Heading } from "rebass";

// styles
import "styles/shared.styl";

// styled components
import { Value, Info, A } from "./styles";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";

import Graph from "./Graph";

@inject("store")
@observer
export default class BlueberryMaggot extends Component {
  constructor(props) {
    super(props);
    this.props.store.app.setCSVData();
  }

  rowColor = idx => {
    const { endDate } = this.props.store.app;
    if (isThisYear(endDate)) {
      if (idx > 2) {
        return "forecast";
      } else {
        return "past";
      }
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
      state,
      endDate,
      currentYear,
      startDateYear,
      bmModel
    } = this.props.store.app;
    const { mobile } = this.props;

    const isSeason =
      isAfter(endDate, `${startDateYear}-03-01`) &&
      isBefore(endDate, `${startDateYear}-09-30`);

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

    const stage = () => {
      const { endDate, startDateYear } = this.props.store.app;
      // const yearPlusOne = parseInt(startDateYear, 10) + 1;
      const sDate = `${startDateYear}-03-01`;
      const eDate = `${startDateYear}-09-30`;
      if (isWithinRange(endDate, sDate, eDate)) {
        if (todayCDD() <= 613) return [bmModel[1]];
        if (todayCDD() > 613 && todayCDD() <= 863) return [bmModel[2]];
        if (todayCDD() > 863 && todayCDD() <= 963) return [bmModel[3]];
        if (todayCDD() > 964) return [bmModel[4]];
      } else {
        return [bmModel[0]];
      }
    };

    // To display the 'Forecast' text and style the cell
    const forecastText = date => {
      return (
        <Flex justify="center" align="center" column>
          <Value>{format(date, "MMM D")}</Value>
          {startDateYear === currentYear &&
            isAfter(date, endDate) && (
              <Info style={{ color: "#595959" }}>Forecast</Info>
            )}
        </Flex>
      );
    };

    const emergence = (text, record, i) => {
      let ddColor = "";
      if (text < 613) ddColor = "#00A854";
      if (text >= 613 && text <= 863) ddColor = "#FFBF00";
      if (text > 863) ddColor = "#F04134";

      if (record.missingDay === 1)
        return (
          <Flex justify="center" align="center">
            <Value>NA</Value>
          </Flex>
        );

      return (
        <Flex
          justify="center"
          align="center"
          style={{
            background: `${ddColor}`,
            borderRadius: "5px",
            color: "white",
            padding: "1px 0"
          }}
        >
          <Value>{record.cdd}</Value>
        </Flex>
      );
    };

    // const emergence2 = (text, record, i) => {
    //   let ddColor = "";
    //   if (text < 613) ddColor = "low";
    //   if (text >= 613 && text <= 863) ddColor = "moderate";
    //   if (text > 863) ddColor = "high";
    //   return {
    //     props: {
    //       className: `table ${ddColor}`
    //     },
    //     children: text
    //   };
    // };

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
        className: "table stage1",
        dataIndex: "status",
        key: "status"
      },
      {
        title: "Pest Management",
        className: "table stage2",
        dataIndex: "management",
        key: "management"
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
      <Flex column w={"80%"} style={{ margin: "auto" }}>
        <Box w={[1]}>
          <Heading fontSize={[3, 3, 4]}>
            <i>Blueberry Maggot</i> results for{" "}
            <span style={{ color: "#4c4177" }}>
              {station.name}, {state.postalCode}
            </span>
          </Heading>

          <Flex column>
            {!mobile ? (
              <Box my={2} w={[1]}>
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
            ) : (
              <Box my={2} w={[1]}>
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
              </Box>
            )}
          </Flex>

          <Flex column>
            {isSeason && (
              <div>
                <Flex mt={2} mb={2}>
                  <Box my={1} fontSize={1} w={[1]}>
                    <span style={{ color: "black" }}>
                      Accumulated degree days (base 50°F) from 1/1/{startDateYear}{" "}
                      through {format(endDate, "M/D/YYYY")}: {todayCDD()}
                    </span>
                    {missingDays() !== 0 && (
                      <div>
                        <small>
                          {` (+${missingDays()})`}{" "}
                          {missingDays() === 1 ? "day" : "days"} missing:
                          {ACISData.filter(
                            d => d.missingDay === 1
                          ).map((d, i) => {
                            if (i === missingDays() - 1)
                              return <span key={i}> {d.dateText}. </span>;
                            return <span key={i}> {d.dateText},</span>;
                          })}
                        </small>
                      </div>
                    )}
                  </Box>
                </Flex>
                <Flex>
                  <Box mt={1} w={[1]}>
                    <Table
                      rowClassName={(rec, idx) => this.rowColor(idx)}
                      bordered
                      size="middle"
                      columns={mobile ? columnsMobile : columns}
                      rowKey={record => record.dateTable}
                      loading={ACISData.length === 0}
                      pagination={false}
                      dataSource={
                        areRequiredFieldsSet ? takeRight(ACISData, 8) : null
                      }
                    />
                  </Box>
                </Flex>
                <Flex my={2} justify="space-between" align="baseline" w={[1]}>
                  <Box>NA - not available</Box>

                  <Box>
                    <Box>
                      <A
                        target="_blank"
                        href={`http://forecast.weather.gov/MapClick.php?textField1=${station.lat}&textField2=${station.lon}`}
                      >
                        {" "}
                        Forecast Details
                      </A>
                    </Box>
                  </Box>
                </Flex>
              </div>
            )}

            {isSeason && (
              <Flex>
                <Box my={2} fontSize={[0, 1, 1]} w={[1]}>
                  <i>
                    Blueberry maggot emergence is predicted to occur when
                    approximately <span style={{ color: "black" }}>
                      913
                    </span>{" "}
                    degree days, base 50 ˚F, have accumulated from January 1st.
                    The blueberry maggot degree day model uses the Baskerville
                    Emin formula.
                  </i>
                </Box>
              </Flex>
            )}

            <Flex my={1} column>
              <Box w={[1]} fontSize={[0, 1, 1]}>
                <i>
                  <em style={{ color: "black" }}>
                    Disclaimer: These are theoretical predictions and forecasts.
                  </em>
                  The theoretical models predicting pest development or disease
                  risk use the weather data collected (or forecasted) from the
                  weather station location. These results should not be
                  substituted for actual observations of plant growth stage,
                  pest presence, and disease occurrence determined through
                  scouting or insect pheromone traps.
                </i>
              </Box>
              <Box w={[1]} style={{ margin: "0 auto" }}>
                <img
                  src={IconNewa}
                  alt="Newa Logo"
                  style={{
                    width: "65px",
                    height: "65px",
                    margin: "0 auto"
                  }}
                />
              </Box>
            </Flex>
          </Flex>
        </Box>

        <Box w={[1]}>{isGraph && <Graph />}</Box>
      </Flex>
    );
  }
}
