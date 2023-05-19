import { Bell, Check, CheckCircle, Info, X } from "phosphor-react";

import * as Dialog from "@radix-ui/react-dialog";
import * as S from "./styles";

import info from '../../../public/info.svg'

export function NotificationCounter() {
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
          <S.NotificationsList>
            <S.NotificationItem type="success">
              <S.IconWrapper>
                <Check size={20} />
              </S.IconWrapper>
              <S.NotificationText>
                <h3>Sucesso!</h3>
                <p>Seu vídeo foi enviado com sucesso.</p>
              </S.NotificationText>
              <X size={20} />
            </S.NotificationItem>
            <S.NotificationItem type="error">
              <S.IconWrapper>
                <X size={20} />
              </S.IconWrapper>
              <S.NotificationText>
                <h3>Erro!</h3>
                <p>Seu vídeo foi enviado com sucesso.</p>
              </S.NotificationText>
              <X size={20} />
            </S.NotificationItem>
            <S.NotificationItem type="info">
             <S.IconWrapper>
                <img src={info} alt="" />
              </S.IconWrapper>
              <S.NotificationText>
                <h3>Info!</h3>
                <p>Seu vídeo foi enviado com sucesso.</p>
              </S.NotificationText>
              <X size={20} />
            </S.NotificationItem>
          </S.NotificationsList>
        </S.ModalContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
