import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// components
import Map from "components/Map";
import BlueberryMaggot from "models/BlueberryMaggot";

// styled-components
import { Header, TextIcon, IconStyled, MainContent } from "./styles";

import { Flex } from "rebass";

@inject("store")
@observer
class RightContent extends Component {
  render() {
    const {
      ACISData,
      areRequiredFieldsSet,
      isMap,
      toggleSidebar,
      subject
    } = this.props.store.app;

    return (
      <Flex column>
        {this.props.mobile ? (
          <Header>
            <TextIcon>
              <IconStyled
                type="menu-unfold"
                onClick={toggleSidebar}
                style={{ marginRight: 10 }}
              />
              <div>{subject.name} Forecast Models</div>
            </TextIcon>
            <div>NEWA</div>
          </Header>
        ) : (
          <Header>
            <div>{subject.name} Forecast Models</div>
            <div>
              <div style={{ textAlign: "right" }}>NEWA</div>
              <div style={{ fontSize: ".7rem", letterSpacing: "1px" }}>
                Network for Environment and Weather Applications
              </div>
            </div>
          </Header>
        )}

        <MainContent>
          <Flex column w={["100%", "95%", "90%"]} style={{ margin: "0 auto" }}>
            {isMap && <Map {...this.props} />}
            {areRequiredFieldsSet &&
              ACISData.length !== 0 && <BlueberryMaggot {...this.props} />}
          </Flex>
        </MainContent>
      </Flex>
    );
  }
}

export default RightContent;
