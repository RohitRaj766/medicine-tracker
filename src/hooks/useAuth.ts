import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { RootState, AppDispatch } from '../store';
import { 
  login, 
  register, 
  getProfile, 
  updateProfile, 
  logout 
} from '../store/slices/authSlice';
import { authAPI } from '../services/apiService';
import { LoginRequest, RegisterRequest } from '../types/api';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authAPI.login(credentials),
    onSuccess: (data) => {
      dispatch(login.fulfilled(data.data, 'login'));
    },
    onError: (error: any) => {
      dispatch(login.rejected(error));
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => authAPI.register(userData),
    onSuccess: (data) => {
      dispatch(register.fulfilled(data.data, 'register'));
    },
    onError: (error: any) => {
      dispatch(register.rejected(error));
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (userData: Partial<RegisterRequest>) => authAPI.updateProfile(userData),
    onSuccess: (data) => {
      dispatch(updateProfile.fulfilled(data.data, 'updateProfile'));
    },
    onError: (error: any) => {
      dispatch(updateProfile.rejected(error));
    },
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile(),
    enabled: isAuthenticated,
    onSuccess: (data) => {
      dispatch(getProfile.fulfilled(data.data, 'getProfile'));
    },
    onError: (error: any) => {
      dispatch(getProfile.rejected(error));
    },
  });

  const handleLogin = (credentials: LoginRequest) => {
    loginMutation.mutate(credentials);
  };

  const handleRegister = (userData: RegisterRequest) => {
    registerMutation.mutate(userData);
  };

  const handleUpdateProfile = (userData: Partial<RegisterRequest>) => {
    updateProfileMutation.mutate(userData);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    error: error || loginMutation.error || registerMutation.error,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    updateProfile: handleUpdateProfile,
    logout: handleLogout,
    refetchProfile: profileQuery.refetch,
  };
};
