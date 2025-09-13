import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {signUpSchema} from '@/lib/schema'
import {z} from 'zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'
import { useSignUpMutation } from '@/hooks/use-auth'
import { toast } from 'sonner'

export type SignUpFormData = z.infer<typeof signUpSchema>

const SignUp = () => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  })

  const {mutate, isPending} = useSignUpMutation()

  const handleOnSubmit = (values: SignUpFormData) => {
    mutate(values, {
      onSuccess: (data:any) => {
      
        toast.success(data.message)
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.'
        console.log(error)
        toast.error(errorMessage)
      }
    })
  }

  return <div className='min-h-screen flex items-center justify-center bg-muted/40 p-4'>
    <Card className='max-w-md w-full shadow-xl'>
      <CardHeader className='text-center mb-5'>
        <CardTitle className='text-2xl font-bold'>Create an account</CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>Create an account to continue...</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder='email@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder='********' {...field} autoComplete="new-password"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder='Samuel Witty' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder='********' {...field} autoComplete="new-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
        <CardFooter className="flex items-center justify-center mt-6">
            <div className="flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Already have an account? <Link to="/sign-in">Sign In</Link>
              </p>
            </div>
        </CardFooter>
      </CardContent>
    </Card>
  </div>
}

export default SignUp
