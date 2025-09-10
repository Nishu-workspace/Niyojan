import { useMutation } from "@tanstack/react-query"
import type { SignUpFormData } from "@/routes/auth/sign-up"
import { postData } from "@/lib/fetch-util"
import { da } from "zod/v4/locales"

export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: (data: SignUpFormData) => postData('/auth/register', data),
    })
}

export const useVerifyEmailMutation = ()=>{
    return useMutation({
        mutationFn:(data:{token:string})=>
            postData("/auth/verfiy-email",data)
    })
}