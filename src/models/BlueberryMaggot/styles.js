import styled from "styled-components";
import { Box } from "reflexbox";
import { CSVLink } from "react-csv";

export const Value = styled(Box)`
  font-size: .75rem;

  @media (max-width: 992px) {
    font-size: .65rem;
  }
  @media (max-width: 768px) {
    font-size: .60rem;
  }


`;
export const Info = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: .75rem;
  ${"" /* height: 20px; */}
  color: white;
  border-radius: 5px;
  letter-spacing: 1px;
  margin: 0 auto;
  padding-top: 1px;
  padding-bottom: 1px;

  @media (max-width: 992px) {
    font-size: .65rem;
  }
  @media (max-width: 768px) {
    font-size: .60rem;
  }


`;

export const CSVButton = styled(CSVLink)`
  color: #828282;
  margin-left: 5px;
  &:hover {
    color: #138FE9
  }
`;
