import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const postSignupQuery = async (userData) => {
    const response = await fetch(`http://localhost:5000/api/auth/createUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    return response.json();
};