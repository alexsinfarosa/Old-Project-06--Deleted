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
class MoreInfo extends Component {
  @observable isVisible = false;
  @action setIsVisible = d => (this.isVisible = d);

  render() {
    return (
      <Flex my={2}>
        <Button
          size="large"
          type="default"
          icon="info-circle-o"
          onClick={() => this.setIsVisible(true)}
        >
          More Info
        </Button>
        <Modal
          title="More Info"
          wrapClassName="vertical-center-modal"
          visible={this.isVisible}
          onOk={() => this.setIsVisible(false)}
          onCancel={() => this.setIsVisible(false)}
        >
          <ul>
            <li>Content...</li>
            <li>Content...</li>
            <li>Content...</li>
            <li>Content...</li>
            <li>Content...</li>
            <li>Content...</li>
            <li>Content...</li>
            <li>Content...</li>
            <li>Content...</li>
          </ul>
        </Modal>
      </Flex>
    );
  }
}

export default MoreInfo;
