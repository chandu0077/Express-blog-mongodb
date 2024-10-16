import React, { useState, useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";
import axios from "axios";

interface Props {
  setBlogPosts: Function;
}
const TagsList: React.FC<Props> = ({ setBlogPosts }) => {
  const [allTags, setAllTags] = useState<any>();

  const getAllTags = async () => {
    const accessToken = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:5000/api/tag/", {
        headers: {
          "auth-token": accessToken,
        },
      });
      setAllTags(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // We can do 2 things
  // 1. When user clicks on a tag, we can take the tagId and compare it with available blogPosts & filter them
  // This will save one api request to backend
  // 2. We can make a request to backend and get the related posts from backend.
  // We are going with 2nd for demonstration purposes.

  const getBlogPostsByTagId = async (tagId: any) => {
    const accessToken = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/blog-posts/tag/${tagId}`,
        {
          headers: {
            "auth-token": accessToken,
          },
        },
      );

      setBlogPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllTags();
  }, []);

  return (
    <>
      <Flex
        justifyContent="start"
        alignItems="center"
        w="80%"
        h="80px"
        mx="auto"
        gap="4"
        overflowX="auto"
        id="style-8"
      >
        {allTags &&
          allTags.length > 0 &&
          allTags.map((tag: any, key = "string") => (
            <Text
              key={key}
              cursor="pointer"
              fontSize={"sm"}
              px="4"
              py="2"
              borderRadius={"full"}
              bgColor="white"
              color="black"
              fontWeight={"semibold"}
              onClick={() => getBlogPostsByTagId(tag._id)}
            >
              {tag.name}
            </Text>
          ))}
      </Flex>
    </>
  );
};

export default TagsList;
