"use client";

import {
  Icon,
  Tooltip,
  Heading,
  Button,
  Text,
  Flex,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { MdEditDocument } from "react-icons/md";
import EditBlogPost from "@/components/EditBlogPost";
import TagsList from "@/components/TagsList";
import { MdDelete } from "react-icons/md";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<any>();

  const [editBlogPostData, setEditBlogPostData] = useState<any>();

  const [editingBlogPost, setEditingBlogPost] = useState<boolean>(false);

  const getUserBlogPosts = async () => {
    const accessToken = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/blog-posts/",
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
    getUserBlogPosts();
  }, []);

  const editABlogPost = (blogPostId: string) => {
    const blogPost = blogPosts.filter((el: any) => el._id === blogPostId);
    setEditBlogPostData(blogPost);
    setEditingBlogPost(true);
  };

  const deleteABlogPost = async (blogPostId: string) => {
    const accessToken = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/blog-posts/${blogPostId}`,
        {
          headers: {
            "auth-token": accessToken,
          },
        },
      );

      getUserBlogPosts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar getUserBlogPosts={getUserBlogPosts} />

      <TagsList setBlogPosts={setBlogPosts} />
      <Flex
        mt="6"
        mb="20"
        h="fit-content"
        justify={"center"}
        alignItems={"center"}
        direction={"column"}
      >
        <Text color="white" fontSize={"4xl"} fontWeight={"semibold"}>
          Blog'n
        </Text>

        {(!blogPosts || blogPosts.length === 0) && (
          <Text color="white" fontSize={"xl"} fontWeight={"semibold"}>
            No Posts...
          </Text>
        )}
        {blogPosts &&
          blogPosts.length > 0 &&
          blogPosts.map((blogPost: any, key:any) => (
            <Card key={key} maxW="lg" mt="4">
              <CardHeader>
                <Flex justifyContent={"space-between"}>
                  <Heading size="lg">{blogPost.title}</Heading>
                  <Flex gap="2">
                    <Tooltip hasArrow label="Edit" bg="gray.300" color="black">
                      <Button
                        bgColor={"transparent"}
                        _hover={{
                          bgColor: "transparent",
                        }}
                        p="0"
                        cursor={"pointer"}
                        onClick={() => editABlogPost(blogPost._id)}
                      >
                        <Icon
                          as={MdEditDocument}
                          color="black"
                          zIndex={50}
                          boxSize="6"
                        />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      hasArrow
                      label="Delete"
                      bg="gray.300"
                      color="black"
                    >
                      <Button
                        bgColor={"transparent"}
                        _hover={{
                          bgColor: "transparent",
                        }}
                        p="0"
                        cursor={"pointer"}
                        onClick={() => deleteABlogPost(blogPost._id)}
                      >
                        <Icon
                          as={MdDelete}
                          color="black"
                          zIndex={50}
                          boxSize="6"
                        />
                      </Button>
                    </Tooltip>
                  </Flex>
                </Flex>
              </CardHeader>
              <CardBody>
                <Text>{blogPost.body}</Text>
              </CardBody>
            </Card>
          ))}
      </Flex>
      {editBlogPostData && editBlogPostData.length > 0 && (
        <EditBlogPost
          editingBlogPost={editingBlogPost}
          getUserBlogPosts={getUserBlogPosts}
          editBlogPostData={editBlogPostData}
          setEditingBlogPost={setEditingBlogPost}
        />
      )}
    </>
  );
}
