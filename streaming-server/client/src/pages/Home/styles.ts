import { styled } from "styled-components";

export const Container = styled.div`
  height: 100%;
  overflow-y: hidden;
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors["base-text"]};

  margin-bottom: 40px;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.colors["base-text"]};
  font-size: 0.8rem;

  margin-top: 30px;
  text-align: center;
`;

export const ContentWrapper = styled.div`
  padding: 20px;

  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;
`;

export const VideoWrapper = styled.div`
  width: 100%;
  max-width: 1400px;

  border-radius: 8px;

  padding: 30px 40px;
  position: relative;

  @media screen and (max-width: 800px) {
    max-width: 100%;
  }
`;

export const IconsWrapper = styled.div`
  position: absolute;
  right: 40px;
  top: 2px;
  gap: 5px;

  display: flex;
  align-items: center;

  svg {
    background: #2a2d3b;
    border-radius: 50%;
    color: #ffff;
    padding: 3px;

    width: 23px;
    height: 23px;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
`;