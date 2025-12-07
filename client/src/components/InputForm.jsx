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
    Text,
    VStack // Added VStack for better spacing
} from "@chakra-ui/react";
import styles from './InputForm.module.css';
import { useAuth } from '../context/AuthContext';

// Your Backend URL
const BACKEND_URL = "https://url-shortener-ymc2.onrender.com";

export const InputForm = () => {
    const [input, setInput] = useState({ longUrl: "", urlCode: "" });
    const [url, setUrl] = useState("");
    const [shortUrlData, setShortUrlData] = useState(null);
    const [isLoading, setIsloading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { hasCopied, onCopy } = useClipboard(url);
    const { user } = useAuth();
    const toast = useToast();

    // Cleaned up: We don't need the full window location in the UI anymore
    // const clientBaseUrl = window.location.href; 

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
            width={["90%", "80%", "50%"]} // Better responsiveness (mobile vs desktop)
            margin={"auto"}
            boxShadow="xl" // Nicer shadow
            p="8"
            rounded="2xl"
            bg="gray.800" // Hardcoded dark theme for cleaner look
            color="white"
        >
            {!user && (
                <Flex justify="center" mb={4}>
                    <Text color="orange.300" fontSize="sm" fontWeight="bold">
                        🔒 Login required to shorten URLs
                    </Text>
                </Flex>
            )}

            <VStack spacing={6}> {/* Adds consistent spacing between items */}
                
                <FormControl isInvalid={isError}>
                    <FormLabel fontWeight="bold">Paste your long URL</FormLabel>
                    <Input
                        id="longUrl"
                        type="url"
                        size="lg" // Larger, easier to click
                        value={input.longUrl}
                        placeholder="https://example.com/very-long-link..."
                        onChange={handleInputChange}
                        onKeyDown={handleEnter}
                        isDisabled={!user}
                        bg="gray.700"
                        border="none"
                        _focus={{ border: "2px solid #3182ce" }}
                    />
                    {isError && <FormErrorMessage>URL is required.</FormErrorMessage>}
                </FormControl>

                <FormControl>
                    <FormLabel fontWeight="bold">Custom Alias (Optional)</FormLabel>
                    <InputGroup size='lg'>
                        {/* 👇 CLEANER: Just show a slash, not the whole ugly URL */}
                        <InputLeftAddon children="/" bg="gray.600" color="gray.300" />
                        <Input
                            placeholder='my-brand-name'
                            id="urlCode"
                            type="text"
                            value={input.urlCode}
                            onChange={handleInputChange}
                            onKeyDown={handleEnter}
                            isDisabled={!user}
                            bg="gray.700"
                            border="none"
                            _focus={{ border: "2px solid #3182ce" }}
                        />
                    </InputGroup>
                    <FormHelperText color="gray.400">
                        Leave empty for a random code.
                    </FormHelperText>
                </FormControl>

                <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    width="full" // Full width button looks better
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    loadingText='Shortening...'
                    isDisabled={!user}
                    mt={2}
                >
                    {user ? 'Shorten URL' : 'Please Login'}
                </Button>

                {url && (
                    <Box w="full" bg="gray.900" p={4} rounded="md" border="1px solid" borderColor="gray.700">
                        <Flex gap={2} mb={4}>
                            <Input value={url} isReadOnly bg="gray.800" border="none" textOverflow="ellipsis" />
                            <Button onClick={onCopy} colorScheme={hasCopied ? "green" : "gray"}>
                                {hasCopied ? "Copied!" : "Copy"}
                            </Button>
                        </Flex>

                        {shortUrlData?.qrCode && (
                            <Flex direction="column" align="center" bg="white" p={4} rounded="lg">
                                <Image
                                    src={shortUrlData.qrCode}
                                    alt="QR Code"
                                    boxSize="150px"
                                />
                                <Button
                                    size="sm"
                                    colorScheme="gray"
                                    mt={3}
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = shortUrlData.qrCode;
                                        link.download = `qr-${shortUrlData.urlCode}.png`;
                                        link.click();
                                    }}
                                >
                                    Download QR
                                </Button>
                            </Flex>
                        )}
                    </Box>
                )}
            </VStack>
        </Box>
    );
};
