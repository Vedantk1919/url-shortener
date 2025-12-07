import React, { useState } from "react";
import axios from 'axios'; 
import {
    Box,
    FormControl,
    Input,
    FormHelperText,
    FormErrorMessage,
    FormLabel,
    Button,
    Flex,
    useClipboard,
    InputGroup,
    InputLeftAddon,
    Image,
    useToast,
    Text
} from "@chakra-ui/react";
import styles from './InputForm.module.css';
import { useAuth } from '../context/AuthContext';

// 👇 THIS IS THE FIX: Define your Backend URL here
const BACKEND_URL = "https://url-shortener-ymc2.onrender.com";

export const InputForm = () => {
    const [input, setInput] = useState({ longUrl: "", urlCode: "" });
    const [url, setUrl] = useState("");
    const [shortUrlData, setShortUrlData] = useState(null);
    const [isLoading, setIsloading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { hasCopied, onCopy } = useClipboard(url);
    const clientBaseUrl = window.location.href;
    const { user } = useAuth();
    const toast = useToast();

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setInput({ ...input, [id]: value });
        setIsError(false);
    };

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!user) {
            toast({
                title: "Authentication required",
                description: "Please login to shorten URLs",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!input.longUrl) {
            setIsError(true);
            setUrl("Please add a URL");
            return;
        }

        setIsloading(true);
        try {
            // 👇 FIX: Use the full Backend URL here
            const res = await axios.post(`${BACKEND_URL}/api/url/shorten`, input);

            if (res.status) {
                let data = res.data;
                let createUrl =  data.shortUrl;
                
                setUrl(createUrl);
                setShortUrlData(data);
            }
        } catch (error) {
            let errorMsg = error.response?.data?.error || 'An error occurred';
            setUrl(errorMsg);
            toast({
                title: "Error",
                description: errorMsg,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsloading(false);
        }
    };

    return (
        <Box
            width={"40%"}
            margin={"auto"}
            boxShadow="dark-lg"
            p="6"
            rounded="2xl"
            bg="dark"
            className={styles.mainContainer}
        >
            {!user && (
                <Text color="orange.300" mb={4} fontSize="sm">
                    🔐 Login required to shorten URLs
                </Text>
            )}

            <FormControl isInvalid={isError}>
                <FormLabel>Convert long URLs into shortened versions with a single click.</FormLabel>
                <Input
                    id="longUrl"
                    type="url"
                    value={input.longUrl}
                    placeholder="Paste here your long URL"
                    onChange={handleInputChange}
                    onKeyDown={handleEnter}
                    isDisabled={!user}
                />
                {!isError ? (
                    <FormHelperText>Enter your Long Url</FormHelperText>
                ) : (
                    <FormErrorMessage>URL is required.</FormErrorMessage>
                )}
            </FormControl>

            <FormLabel mt={7} fontSize='md'>Create personalized and memorable links (Optional)</FormLabel>
            <InputGroup size='md' className={styles.InputGroup}>
                <InputLeftAddon children={`${clientBaseUrl}`} className={styles.BaseUrlAddon} w='50%' />
                <Input
                    placeholder='your personalized code '
                    id="urlCode"
                    type="text"
                    value={input.urlCode}
                    onChange={handleInputChange}
                    w='50%'
                    onKeyDown={handleEnter}
                    isDisabled={!user}
                />
            </InputGroup>

            <Button
                type="submit"
                colorScheme="blue"
                m={5}
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText='Submitting'
                isDisabled={!user}
            >
                {user ? 'Submit' : 'Please Login'}
            </Button>

            {url && (
                <Flex direction="column" gap={3}>
                    <Flex mb={2}>
                        <Input value={url} isReadOnly placeholder="Short Url" />
                        <Button onClick={onCopy} ml={2}>
                            {hasCopied ? "Copied" : "Copy"}
                        </Button>
                    </Flex>

                    {/* ✅ QR Code */}
                    {shortUrlData?.qrCode && (
                        <Flex direction="column" align="center">
                            <Text mb={2}>QR Code:</Text>
                            <Image
                                src={shortUrlData.qrCode}
                                alt="QR Code"
                                boxSize="150px"
                                border="1px solid"
                                borderColor="gray.200"
                                p={2}
                                bg="white"
                            />
                            <Button
                                size="sm"
                                mt={2}
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = shortUrlData.qrCode;
                                    link.download = `qr-${shortUrlData.urlCode}.png`;
                                    link.click();
                                }}
                            >
                                Download QR Code
                            </Button>
                        </Flex>
                    )}
                </Flex>
            )}
        </Box>
    );
};
