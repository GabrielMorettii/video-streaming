import { css, styled } from "styled-components";

interface DropContainerProps{
  $isDragActive?: boolean;
  $isDragReject?: boolean;
}

interface UploadMessageProps {
  type?: 'error' | 'success';
}

enum MessageColors {
  error = '#e57878',
  success = '#78e5d5',
  default = '#999'
}

export const DropContainer = styled.div<DropContainerProps>`
  border: 2px dashed #a8aeb1;
  border-radius: 6px;

  width: 100%;
  min-height: 500px;

  transition: all 0.2s ease;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  svg {
    color: #34495E;
  }

  &:hover {
    cursor: pointer;

    transform: scale(1.02);
  }


  ${(props) => props.$isDragActive && css`
    border-color: ${MessageColors.success};

    svg {
      color: ${MessageColors.success};
    }
  `}
  
  ${(props) => props.$isDragReject && css`
    border-color: ${MessageColors.error};

    svg {
      color: ${MessageColors.error};
    }
  `}
`;

export const UploadMessage = styled.p<UploadMessageProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 15px 0;

  color: ${props => MessageColors[props.type || 'default']};
`;