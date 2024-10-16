import React from "react";
import {
  Flex,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Icon,
  Tooltip,
  Select,
} from "@chakra-ui/react";
import { blogForm } from "@/utils/forms/blogForm";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoLogOut } from "react-icons/io5";
import { useEffect, useState, useMemo } from "react";

interface Props {
  getUserBlogPosts: Function;
  editBlogPostData: any;
  editingBlogPost: boolean;
  setEditingBlogPost: Function;
}

const EditBlogPost: React.FC<Props> = ({
  getUserBlogPosts,
  editBlogPostData,
  editingBlogPost,
  setEditingBlogPost,
}) => {
  const values = editBlogPostData[0];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allTags, setAllTags] = useState<any>();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    unregister,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(blogForm),
    criteriaMode: "firstError",
    values: values,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  type IBlogForm = yup.InferType<typeof blogForm>;

  const onSubmit = (data: IBlogForm) => {
    const accessToken = localStorage.getItem("token");

    const dataToPost = {
      title: data.title,
      body: data.body,
      tag: data.tag,
    };
    axios
      .patch(`http://localhost:5000/api/blog-posts/${data._id}`, dataToPost, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": accessToken,
        },
      })
      .then(function (response: any) {
        setEditingBlogPost(false);
        getUserBlogPosts();
        onClose();
      })
      .catch(function (error) {
        setEditingBlogPost(false);
        console.log(error);
      });
  };

  const handleOnClose = () => {
    setEditingBlogPost(false);
    onClose();
  };

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

  useEffect(() => {
    if (editingBlogPost) {
      getAllTags();
      onOpen();
    }
  }, [editingBlogPost]);

  return (
    <>
      <Modal onClose={handleOnClose} size={"lg"} isOpen={isOpen}>
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        <ModalContent
          p="8"
          mx="auto"
          mt="10%"
          backgroundColor={"white"}
          borderRadius={"20px"}
          width="50%"
        >
          <Box display={"flex"} justifyContent={"space-between"} w="100%">
            <Text
              width="300px"
              display={"block"}
              fontSize={"24px"}
              fontWeight={700}
            >
              Edit Blog Post
            </Text>
            <ModalCloseButton />
          </Box>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  border="1px solid lightgrey"
                  borderRadius="14px"
                  p="6"
                  placeholder="Title...."
                  value={getValues(`title`)}
                  onChange={(e) => {
                    setValue("title", e.target.value, {
                      shouldValidate: true,
                    });
                  }}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Post</FormLabel>
                <Textarea
                  border="1px solid lightgrey"
                  borderRadius="14px"
                  p="6"
                  placeholder="Post....."
                  resize="none"
                  value={getValues(`body`)}
                  onChange={(e) => {
                    setValue("body", e.target.value, {
                      shouldValidate: true,
                    });
                  }}
                  // {...register("body")}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Tags:</FormLabel>
                <Select
                  placeholder="Select tag"
                  value={getValues(`tag`)}
                  onChange={(e) => {
                    setValue("tag", e.target.value, {
                      shouldValidate: true,
                    });
                  }}
                >
                  {allTags &&
                    allTags.length > 0 &&
                    allTags.map((tag: any, key: string) => (
                      <option
                        key={key}
                        value={tag._id}
                        selected={tag._id === getValues("tag") ? true : false}
                      >
                        {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                      </option>
                    ))}
                </Select>
              </FormControl>

              <Button
                mt="4"
                backgroundColor="black"
                color="white"
                px="12"
                py="6"
                borderRadius="14px"
                type="submit"
              >
                Update
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditBlogPost;
