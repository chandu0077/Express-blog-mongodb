import React, { useState, useEffect } from "react";
import {
  Select,
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
} from "@chakra-ui/react";
import { blogForm } from "@/utils/forms/blogForm";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoLogOut } from "react-icons/io5";

interface Props {
  getUserBlogPosts: Function;
}

const Navbar: React.FC<Props> = ({ getUserBlogPosts }) => {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allTags, setAllTags] = useState<any>();

  const {
    register,
    handleSubmit,
    reset,
    formState: {},
  } = useForm({
    resolver: yupResolver(blogForm),
    criteriaMode: "firstError",
    mode: "onChange",
    reValidateMode: "onChange",
  });

  type IBlogForm = yup.InferType<typeof blogForm>;

  const onSubmit = (data: IBlogForm) => {
    const accessToken = localStorage.getItem("token");

    axios
      .post("http://localhost:5000/api/blog-posts/", data, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": accessToken,
        },
      })
      .then(function (response: any) {
        reset();
        getUserBlogPosts();
        onClose();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.replace("/");
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
    getAllTags();
  }, []);

  return (
    <>
      <Box className="glass" w="full" h="80px">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          w="80%"
          h="full"
          mx="auto"
        >
          <Text color="white" fontSize={"2xl"} fontWeight={"semibold"}>
            Blog'n
          </Text>
          <Flex alignItems={"center"} h="fit-content" gap="6">
            <Button onClick={onOpen}>Create Blog Post</Button>
            <Tooltip hasArrow label="Logout" bg="gray.300" color="black">
              <Button
                bgColor={"transparent"}
                _hover={{
                  bgColor: "transparent",
                }}
                cursor={"pointer"}
                onClick={logout}
              >
                <Icon as={IoLogOut} color="white" zIndex={50} boxSize="6" />
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
      </Box>
      <Modal onClose={onClose} size={"lg"} isOpen={isOpen}>
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
              Create Blog Post
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
                  {...register("title")}
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
                  {...register("body")}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Tags:</FormLabel>
                <Select placeholder="Select tag" {...register("tag")}>
                  {allTags &&
                    allTags.length > 0 &&
                    allTags.map((tag: any, key: string) => (
                      <option key={key} value={tag._id}>
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
                Add
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Navbar;
