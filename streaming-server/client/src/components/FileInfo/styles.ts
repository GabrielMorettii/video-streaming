import { styled } from "styled-components";

export const Container = styled.div`
  width: 100%;

  display: flex;
  gap: 10px;
  

  > svg {
    height: 100%;
  }
`

export const FileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  div {
    display: flex;
    align-items: center;
    gap: 15px;

    span {
      font-size: 13px;
      color: #999;
    }

    button {
      font-size: 14px;

      &:hover {
        cursor: pointer;
      }
    }
  }

  button {
    all: unset;
    color: #AB222E;
  }
`