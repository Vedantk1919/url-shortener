import React, { useState } from 'react'
import { Heading, Text, Flex, Button } from "@chakra-ui/react";
import { InputForm } from "./components/InputForm";
import { AuthModal } from "./components/AuthModal"; 
import { UserMenu } from "./components/UserMenu"; 
import { useAuth } from './context/AuthContext'; 

export default function Homepage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth(); 

  return (
    <>
      {/* ADD AUTH HEADER */}
      <Flex justify="flex-end" p={4}>
        {user ? (
          <UserMenu />
        ) : (
          <Button onClick={() => setIsAuthModalOpen(true)}>
            Login / Register
          </Button>
        )}
      </Flex>

      <Heading as="h3" size="xl" m={ '3% 0% 2% 0%' }>
        URL Shortener
      </Heading>
      <InputForm />
      

      {/* ADD AUTH MODAL */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  )
}