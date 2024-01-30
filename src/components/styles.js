import { Button, Drawer } from "antd";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const ButtonAction = styled(Button)`
  width: 150px;
  margin-bottom: 5px;
  :disabled {
    background-color: #d9d9d9;
  }
`;

export const LinkStyled = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: white;
  font-size: 14px;
  :hover {
    text-decoration: none;
    color: #f58f98;
  }
`;

export const DrawerStyled = styled(Drawer)`
  .ant-drawer-wrapper-body {
    background-color: #2b2d33;
  }
  .ant-drawer-close {
    svg {
      fill: white;
    }
  }
  .ant-drawer-body {
    padding: 0;
  }
`;
