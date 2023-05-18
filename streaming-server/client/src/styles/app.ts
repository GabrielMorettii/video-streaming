import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  height: 100%;
  margin: 0 30px;
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  color: #2e3e46;

  margin-bottom: 40px;
`;

export const Description = styled.p`
  color: #a5abae;
  font-size: 0.8rem;

  margin-top: 30px;
  text-align: center;
`;

export const ContentWrapper = styled.div`
  padding: 20px;
  
  width: 100%;
  max-width: 1000px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;

  #video-player {
    width: 1200px;
  }
`;
