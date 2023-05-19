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

  > svg {
    position: absolute;
    right: 8px;
    top: 8px;

    background: #2a2d3b;
    padding: 3px;
    border-radius: 50%;

    color: #ffff;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }

  @media screen and (max-width: 800px) {
    max-width: 100%;
  }
`;
