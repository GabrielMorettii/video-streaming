import { gql } from "@apollo/client";

export const UPLOAD_FILE_MUTATION = gql`
  mutation ($file: Upload!) {
    uploadFile(file: $file) {
      status
      message
      location
    }
  }
`;
