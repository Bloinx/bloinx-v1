import { Flex, Steps } from "antd";
import styled from "@emotion/styled";

export const FlexPageContainer = styled(Flex)`
  flex-direction: column;
  color: white;
`;

export const StepStyle = styled(Steps)`
  .ant-steps-item-title {
    color: white;
  }
  .ant-steps-item > .ant-steps-item-container > .ant-steps-item-tail {
    height: 10px;
    margin-top: 32px;
  }
`;

export const FlexPaymentContainer = styled(Flex)`
  flex-direction: column;
  color: white;

  .ant-steps .ant-steps-item-wait .ant-steps-item-icon {
    background: #fff !important;
    border-color: #fff !important;
  }
  .ant-steps .ant-steps-item .ant-steps-item-title {
    color: white !important;
  }
  .ant-steps .ant-steps-item .ant-steps-item-tail {
    background: #f58f98 !important;
  }

  @media (min-width: 768px) {
    width: 50%;
    margin: 0 auto;
  }
`;

export const FlexCardInfoStyle = styled(Flex)`
  background: #2b2d33;
  border-radius: 5px;
  padding: 10px;
  align-items: center;
  color: white;
  margin-top: 16px;
  margin-bottom: 16px;
`;

export const FlexMessageStyle = styled(Flex)`
  margin-top: 16px;
`;
