'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import api from '@/lib/axios'
import { useToken } from "@/app/context/TokenContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useId } from '@/app/context/IdContext'

export function LoginForm({
  className,
  ...props
}) {
  const { setToken, token } = useToken()
  const { setId, Id } = useId();
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(undefined)
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    if (token) {
      router.push('/home/');
    }
  }, [token, router]);
  
  const validateLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(undefined)
    try{
      const res = await api.post('/user/login', { email, password })
      if(res.status >= 200 && res.status <= 300){
        const data = res.data
        const accessToken = data["access_token"]
        const id = data['id']
        // Save token to context and localStorage
        setId(Number(id))
        setToken(accessToken)
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('token', accessToken)
        localStorage.setItem('user', JSON.stringify(data))
        localStorage.setItem('id',Number(id))
        
        router.push('/home/');
      }
    } catch(e){
      setError(e.response?.data?.detail || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={validateLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input onChange={(e)=>{ setEmail(e.target.value) }} id="email" type="email" placeholder="m@example.com" required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input onChange={(e)=>{ setPassword(e.target.value) }} id="password" type="password" required />
              </Field>
              <Field>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

