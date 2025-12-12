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

export function LoginForm({
  className,
  ...props
}) {
  const { setToken } = useToken()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(undefined)
  const validateLogin = async () => {
    try{
      const res = await api.post('/user',{email,password})
        if(res.status>=200 && res.status <=300){
            const data = res.data
            setToken(data["access_token"])
        } else{
          setError(e)
        }
    } catch(e){
      setError(e)
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
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input onChange={(e)=>{setEmail(e.value.target)}} id="email" type="email" placeholder="m@example.com" required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input onChange={(e)=>{setPassword(e.value.target)}} id="password" type="password" required />
              </Field>
              <Field>
                <p className="text-red-500">{error}</p>
                <Button type="submit" >Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
