import { FileVideo } from "phosphor-react";
import { Container, FileDetails } from "./styles";

export function FileInfo() {
  return (
    <Container>
      <FileVideo color="#1475cf" />
      <FileDetails>
        <p>01-primo-rico.mp4</p>
        <div>
          <span>543.32 KB</span>
          
          <button type="button">Excluir</button>
        </div>
      </FileDetails>
    </Container>
  );
}
