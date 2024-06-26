import { Grid, Box, Skeleton, SkeletonText, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getNewWrites } from "../api";
import { INewWrites } from "../types";
import WriteList from "../components/Write/WriteList";


export default function Home() {
  const { isLoading, data } = useQuery<INewWrites>({
    queryKey: ["writes"],
    queryFn: getNewWrites,
  });

  return (
    <VStack>
      <Grid
        mt={10}
        px={{
          base: 10,  // base: mobile
          lg: 40
        }}
        columnGap={4}
        rowGap={8}
        templateColumns={{
          sm: "1fr",
          md: "1fr 1fr",
          lg: "repeat(2, 1fr)",
          xl: "repeat(4, 1fr)",
          "2xl": "repeat(4, 1fr)",
        }}
      >
        {
          isLoading ? (
            <Box>
              <Skeleton rounded="2xl" height={280} mb={6} />
              <SkeletonText noOfLines={3} />
            </Box>
          ) : null
        }
        <WriteList bo_table="free" writes={data?.free} />
        <WriteList bo_table="gallery" writes={data?.gallery} />
        <WriteList bo_table="notice" writes={data?.notice} />
        <WriteList bo_table="qa" writes={data?.qa} />
      </Grid>
    </VStack>
  );
}