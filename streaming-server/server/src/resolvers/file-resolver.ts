import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { uploadFileToS3 } from "../services/file-service";
import { FileUploaded } from "../dtos/responses/file-uploaded";

@Resolver()
export class FilesResolver {
  @Query(() => String)
  async health() {
    return "ok";
  }

  @Mutation(() => FileUploaded)
  async uploadFile(@Arg("file", () => GraphQLUpload) file: FileUpload) {
    const result = await uploadFileToS3(file);

    return {
      status: "success",
      message: "Uploaded successfully!",
      location: result.Location,
    };
  }
}
