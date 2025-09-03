import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Text,
  Box
} from "@chakra-ui/react";
import { useAuth } from '../context/AuthContext';

export const UserMenu = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Menu>
      <MenuButton as={Button} variant="ghost">
        <Box display="flex" alignItems="center">
          <Avatar size="sm" name={user.username} mr={2} />
          <Text>{user.username}</Text>
        </Box>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};