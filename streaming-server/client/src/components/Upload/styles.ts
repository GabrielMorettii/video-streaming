import { css, styled } from "styled-components";
interface DropContainerProps{
  $isDragActive?: boolean;
  $isDragReject?: boolean;
}

interface UploadMessageProps {
  type?: 'error' | 'success';
}

export const DropContainer = styled.div<DropContainerProps>`
  border: 2px dashed ${({theme}) => theme.colors['base-border']};
  border-radius: 6px;

  width: 100%;
  max-width: 1000px;
  min-height: 500px;

  transition: all 0.2s ease;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  svg {
    color: #9DA1C9;
  }

  &:hover {
    cursor: pointer;

    transform: scale(1.02);
  }


  ${(props) => props.$isDragActive && css`
    border-color: ${props.theme.colors.success};

    svg {
      color: ${props.theme.colors.success};
    }
  `}
  
  ${(props) => props.$isDragReject && css`
    border-color: ${props.theme.colors.error};

    svg {
      color: ${props.theme.colors.error};
    }
  `}
`;

export const UploadMessage = styled.p<UploadMessageProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 15px 0;

  color: ${(props) => props.theme.colors[props.type || 'default']};
`;