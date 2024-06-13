import { Link, useNavigate } from "react-router-dom";
import { IHtmlContent, IRootState } from "../types";
import {
  Box, Grid, Image, GridItem, Skeleton, Heading,
  Avatar, HStack, Text, VStack, Container, Button
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { get_img_url } from "../lib/files";
import { useGetWritesParams, useQueryGetWrite } from "../lib/useQuery/hooks";
import { useSelector } from "react-redux";
import { deleteWrite } from "../api";


const HtmlContent = ({ html }: IHtmlContent) =>
  <Box dangerouslySetInnerHTML={{ __html: html }} marginTop={"10px"} />;


export default function WriteDetail() {
  const loginUser  = useSelector((state: IRootState) => state.loginUser);
  const access_token = useSelector((state: IRootState) => state.token.access_token);
  const navigate = useNavigate();
  const { bo_table, wr_id } = useGetWritesParams();
  const { isLoading, data } = useQueryGetWrite(bo_table, wr_id);

  const mutation = useMutation({
    mutationFn: deleteWrite,
    onSuccess: () => {alert("삭제 되었습니다."); navigate("/")},
    onError: () => {},
  });

  const onSubmit = () => {
    mutation.mutate({access_token, wr_id});
  }

  return (
    <Box
      mt={10}
      px={{ base: 10, lg: 40 }}
    >
      <Heading fontSize={"x-large"} marginBottom={"10px"}>{ data?.wr_subject }</Heading>
      <HStack justifyContent={"space-between"}>
        <HStack>
          <Avatar name={data?.wr_name} size={"md"} src={data ? get_img_url(data.mb_image_path) : ""} />
          <VStack align={"flex-start"}>
            <Heading fontSize={"medium"}>{data?.wr_name}({data?.wr_ip})</Heading>
            <HStack>
              <Text>조회수 {data?.wr_hit}</Text>
              <Text>/</Text>
              <Text>
                댓글 {data?.wr_comment}
              </Text>
              <Text>/</Text>
              <Text>
                {data?.wr_datetime}
              </Text>
            </HStack>
          </VStack>
        </HStack>
        {
          loginUser.mb_id === data?.mb_id &&
          <Box>
            <Link to={`/writes/${bo_table}/${wr_id}/update`}>
              <Button margin={"3px"}>수정</Button>
            </Link>
            <Button onClick={onSubmit} margin={"3px"}>삭제</Button>
          </Box>
        }
      </HStack>
      <Grid
        mt={8}
        rounded="xl"
        overflow={"hidden"}
        gap={2}
        templateRows={"1fr 1fr"}
        templateColumns={"repeat(4, 1fr)"}
      >
        {data?.images.map((img, index) => (
          <GridItem
            colSpan={index === 0 ? 2 : 1}
            rowSpan={index === 0 ? 2 : 1}
            overflow={"hidden"}
            key={img.bf_source}
            gridColumn={"span 4"}
          >
            <Skeleton isLoaded={!isLoading} h="100%" w="100%">
              <Image w="100%" h="100%" objectFit={"cover"} src={get_img_url(img.bf_file)}/>
            </Skeleton>
          </GridItem>
        ))}
      </Grid>
      <HtmlContent html={data ? data.wr_content : ""} />
      <Container mt={16} maxW="container.lg" marginX="none">
        <Heading fontSize={"large"} marginBottom={"50px"}>댓글</Heading>
        <Grid gap={10}>
          {data?.comments.map((comment, index) => (
            <HStack alignItems={"flex-start"} key={index}>
              <Avatar
                name={comment.wr_name}
                src={get_img_url(comment.mb_image_path)}
                size="md"
              />
              <VStack align={"flex-start"}>
                <HStack>
                  <Avatar name={data?.wr_name} size={"2xs"} src={data ? get_img_url(data.mb_icon_path) : ""} />
                  <Heading fontSize={"md"}>{comment.wr_name}</Heading>
                  <Text>{comment.wr_datetime}</Text>
                </HStack>
                <Text>{comment.save_content}</Text>
              </VStack>
            </HStack>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}