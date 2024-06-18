import { useForm, FormProvider } from "react-hook-form";
import { 
  Container, FormControl, FormLabel, Input, InputGroup,
  InputLeftAddon, Text, Textarea, VStack, Button
} from "@chakra-ui/react";
import { IRequestWriteForm, IWriteFormVariables } from "../../types";
import { useVerifiedToken } from "../../lib/useQuery/hooks";
import FileUpload from "../../lib/files";
import { useRequireLogin } from "../../lib/hooks";


interface IFiles {
  file1: File | null;
  file2: File | null;
}


export default function WriteForm({mutation, onSubmit, bo_table, wr_id, writeData}: IWriteFormVariables) {
  const access_token = useVerifiedToken().accessToken;
  useRequireLogin(access_token);
  const methods = useForm<IFiles>();
  const onSubmit2 = (data: IFiles) => {
    console.log(data);
    alert(data);
  }
  const { register, handleSubmit } = useForm<IRequestWriteForm>({
    defaultValues: {
      access_token: access_token ? access_token : "",
      bo_table: bo_table,
      wr_id: wr_id,
      variables: {
        wr_subject: writeData?.wr_subject,
        wr_content: writeData?.wr_content,
        wr_link1: writeData?.wr_link1,
        wr_link2: writeData?.wr_link2
      }
    }
  });

  return (
    <Container mt={10} px={{ base: 10, lg: 40 }}>
      <VStack as="form" onSubmit={() => {
        handleSubmit(onSubmit)();
        methods.handleSubmit(onSubmit2)();
      }}>
        <Input {...register("access_token")} required type="text" hidden/>
        <Input {...register("bo_table")} required type="text" hidden/>
        <Input {...register("wr_id")} type="text" hidden/>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input
           {...register("variables.wr_subject", { required: true })}
           required
           type="text"
          />
        </FormControl>
        <FormControl>
          <Textarea
           {...register("variables.wr_content", { required: true })}
           required
          />
        </FormControl>
        <FormControl>
          <InputGroup>
            <InputLeftAddon children="Link1" />
            <Input
              {...register("variables.wr_link1")}
              type="text"
            />
          </InputGroup>
        </FormControl>
        <FormControl>
          <InputGroup>
            <InputLeftAddon children="Link2" />
            <Input
              {...register("variables.wr_link2")}
              type="text"
            />
          </InputGroup>
        </FormControl>
        <FormProvider {...methods}>
          <FileUpload name="file1" />
          <FileUpload name="file2" />
        </FormProvider>
        {mutation.isError? <Text color={"red.500"}>에러 발생</Text> : null}
        <Button
          type="submit"
          isLoading={mutation.isPending}
          colorScheme={"blue"}
          size="lg"
          w="100%"
        >
          저장하기
        </Button>
      </VStack>
    </Container>
  );
}