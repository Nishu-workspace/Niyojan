import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import {ArrowLeft, CheckCircle, Loader, XCircle, XCircleIcon} from 'lucide-react'
import { Button } from '@/components/ui/button';
import { useVerifyEmailMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [isSuccess,setIsSuccess] = useState(false);
  const token = searchParams.get("token");
  const {mutate,isPending: isVerifying} = useVerifyEmailMutation();
  
  useEffect(()=>{
    if(token){
      mutate(
        {token},
        {
          onSuccess:()=>{
            setIsSuccess(true);
          },
          onError:(error: any)=>{
            setIsSuccess(false);
            const errorMessage = error.response?.data?.message || "An error occured"
            console.log(error)
            toast.error(errorMessage)
          }
        }
      )
    }
  },[searchParams])

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold'>Verify Email</h1>
      <p className='text-sm text-gray-500'>Verifying your email...</p>

      <Card className='w-full max-w-md'>
        {/* <CardHeader>
          <Link to={'/sign-in'} className='flex items-center'>
          <ArrowLeft className="w-4 h-4 mr-2"/>
          Back to sign in
          </Link>
        </CardHeader> */}

        <CardContent>
          <div className='flex flex-col items-center justify-center py-5'>
            {isVerifying ? (
              <>
                <Loader className='w-10 h-10 text-gray-500 animate-spin'/>
                <h3 className='text-lg font-semibold'>Verifying your email...</h3>
                <p className='text-sm text-gray-500'>Please wait while we verify your email</p>
              </>
            ): isSuccess ? (
              <>
                <CheckCircle className='w-10 h-10 text-green-500'/>
                <h3 className='text-lg font-semibold'>Email Verified</h3>
                <p className='text-sm text-gray-500'>Your email has been verified succesfully!!</p>
                <Link to="/sign-in" className="text-sm text-blue-500 mt-6">
                  <Button variant="outline">Back to Sign in</Button>
                </Link>
              </>
            ):(
              <>
                <XCircleIcon/>
                <h3 className='text-lg font-semibold'>Email Verification Failed</h3>
                <p className='text-sm text-gray-500'>Your email verification failed. Please try again.</p>
                <Link to={"/sign-in"} className='text-sm text-blue-500'>
                  <Button variant='outline'>Back to sign in</Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmail
