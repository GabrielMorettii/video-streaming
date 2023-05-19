import { css, styled } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";

interface NotificationItemProps {
  type: "success" | "error" | "info";
}

export const NotificationContainer = styled.div`
  width: 95%;
  margin: 20px auto;
`;

export const BellContainer = styled.div`
  position: relative;

  background: #212332;
  padding: 15px;
  border-radius: 6px;

  width: fit-content;
  margin-left: auto;

  transition: all 0.2s ease-in-out;

  display: flex;
  align-items: center;

  svg {
    color: ${({ theme }) => theme.colors["base-text"]};
  }

  &:hover {
    cursor: pointer;
    transform: scale(1.05);
  }
`;

export const ItemCounter = styled.span`
  position: absolute;

  top: -5px;
  right: -5px;

  height: 22px;
  width: 22px;

  color: ${({ theme }) => theme.colors["base-text"]};
  background: ${({ theme }) => theme.colors["base-border"]};

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9999px;

  font-size: 14px;
  font-weight: bold;
`;

export const ModalOverlay = styled(Dialog.Overlay)`
  position: fixed;

  width: fit-content;
  height: 100vh;

  top: 0;
  left: 0;

  background: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled(Dialog.Content)`
  position: fixed;
  right: 0;
  top: 0;

  width: 500px;
  height: 100%;

  padding: 20px;

  background: #202024;

  display: flex;
  flex-direction: column;
`;

export const ModalClose = styled(Dialog.Close)`
  order: -1;

  display: block;
  margin-left: auto;

  width: 25px;
  height: 25px;

  border-radius: 50%;

  padding: 5px;
  background: ${({ theme }) => theme.colors["base-background"]};

  color: ${({ theme }) => theme.colors["base-text"]};

  &:hover {
    cursor: pointer;
  }
`;

export const ModalTitle = styled(Dialog.Title)`
  color: ${({ theme }) => theme.colors["base-text"]};

  margin: 30px 0;
`;

export const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const NotificationItem = styled.div<NotificationItemProps>`
  display: flex;
  align-items: center;

  border-radius: 5px;
  padding: 5px;

  color: #ffffff;

  background: ${({ theme, type }) => theme.colors[type]};

  svg:first-child {
    color: ${({ theme, type }) => theme.colors[type]};
  }

  div + svg {
    margin-right: 10px;
    margin-left: auto;
    cursor: pointer;
  }
`;

export const NotificationText = styled.div`
  display: flex;
  flex-direction: column;

  gap: 5px;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 20px;

  border-radius: 50%;
  padding: 5px;

  background: ${({ theme }) => theme.colors["base-text"]};
`;
