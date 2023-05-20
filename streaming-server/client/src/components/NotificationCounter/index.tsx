import { useContext } from "react";

import { Bell, Check, X, MaskSad } from "phosphor-react";

import { AiOutlineExclamation } from "react-icons/ai";

import * as Dialog from "@radix-ui/react-dialog";

import * as S from "./styles";

import { NotificationContext } from "../../contexts/NotificationContext";
import { EnumNotificationType } from "../../interfaces/EnumNotificationType";

export function NotificationCounter() {
  const { notifications, handleRemoveNotification } =
    useContext(NotificationContext);

  const hasNotifications = notifications.length !== 0;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <S.NotificationContainer>
          <S.BellContainer>
            <Bell size={20} />
            <S.ItemCounter>0</S.ItemCounter>
          </S.BellContainer>
        </S.NotificationContainer>
      </Dialog.Trigger>
      <Dialog.Portal>
        <S.ModalOverlay />
        <S.ModalContent>
          <S.ModalClose asChild>
            <X size={20} />
          </S.ModalClose>
          <S.ModalTitle>Notificações</S.ModalTitle>
          {!hasNotifications && (
            <S.WithoutNotifications>
              <Bell size={32}/>
              <p>Parece que você não tem notificações.</p>
              <p>Faça upload de um vídeo para começar a receber</p>
            </S.WithoutNotifications>
          )}

          {hasNotifications && (
            <S.NotificationsList>
              {notifications.map((notification) => (
                <S.NotificationItem
                  type={notification.type}
                  key={notification.id}
                >
                  <S.IconWrapper>
                    {notification.type === "success" && <Check />}
                    {notification.type === "error" && <X />}
                    {notification.type === "info" && <AiOutlineExclamation />}
                  </S.IconWrapper>
                  <S.NotificationText>
                    <h3>{EnumNotificationType[notification.type]}</h3>
                    <p>{notification.description}</p>
                  </S.NotificationText>
                  <X
                    size={20}
                    onClick={() => handleRemoveNotification(notification.id)}
                  />
                </S.NotificationItem>
              ))}
            </S.NotificationsList>
          )}
        </S.ModalContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
