import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, action } from "mobx";
import { Flex } from "rebass";

import "styles/shared.styl";

import Modal from "antd/lib/modal";
import "antd/lib/modal/style/css";

import Button from "antd/lib/button";
import "antd/lib/button/style/css";

@inject("store")
@observer
class Acknowledgements extends Component {
  @observable isVisible = false;
  @action setIsVisible = d => (this.isVisible = d);

  render() {
    return (
      <Flex mt={4}>
        <Button
          size="large"
          type="default"
          icon="info-circle-o"
          onClick={() => this.setIsVisible(true)}
        >
          Acknowledgments
        </Button>
        <Modal
          title="Acknowledgments"
          wrapClassName="vertical-center-modal"
          visible={this.isVisible}
          onOk={() => this.setIsVisible(false)}
          onCancel={() => this.setIsVisible(false)}
        >
          <ul>
            <li>
              New York State Integrated Pest Management -{" "}
              <a
                style={{ color: "black" }}
                onClick={() => this.setIsVisible(false)}
                href="https://nysipm.cornell.edu/"
                target="_blank"
              >
                NYSIPM
              </a>
            </li>
            <li>
              Northeast Regional Climate Center -{" "}
              <a
                style={{ color: "black" }}
                onClick={() => this.setIsVisible(false)}
                href="http://www.nrcc.cornell.edu/"
                target="_blank"
              >
                NRCC
              </a>
            </li>
          </ul>
        </Modal>
      </Flex>
    );
  }
}

export default Acknowledgements;
