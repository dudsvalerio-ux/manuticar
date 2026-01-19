'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Car, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorType, setErrorType] = useState<'success' | 'error' | 'info'>('info')
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setErrorType('info')

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) {
          console.error('Erro de login:', error)
          
          // Mensagens de erro mais amigáveis
          if (error.message.includes('Invalid login credentials')) {
            setMessage('Email ou senha incorretos. Verifique suas credenciais.')
          } else if (error.message.includes('Email not confirmed')) {
            setMessage('Email não confirmado. Verifique sua caixa de entrada.')
          } else {
            setMessage(`Erro ao fazer login: ${error.message}`)
          }
          setErrorType('error')
          return
        }
        
        if (data.user) {
          setMessage('Login realizado com sucesso!')
          setErrorType('success')
          setTimeout(() => router.push('/'), 500)
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) {
          console.error('Erro de cadastro:', error)
          setMessage(`Erro ao criar conta: ${error.message}`)
          setErrorType('error')
          return
        }
        
        if (data.user) {
          setMessage('Conta criada com sucesso! Verifique seu email para confirmar.')
          setErrorType('success')
          setEmail('')
          setPassword('')
        }
      }
    } catch (error: any) {
      console.error('Erro geral:', error)
      setMessage(error.message || 'Erro ao autenticar. Tente novamente.')
      setErrorType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl">
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">ManutCar</CardTitle>
          <CardDescription>
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500">Mínimo de 6 caracteres</p>
            </div>
            
            {message && (
              <Alert className={
                errorType === 'error' ? 'border-red-500 bg-red-50' : 
                errorType === 'success' ? 'border-green-500 bg-green-50' : 
                'border-blue-500 bg-blue-50'
              }>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className={
                  errorType === 'error' ? 'text-red-700' : 
                  errorType === 'success' ? 'text-green-700' : 
                  'text-blue-700'
                }>
                  {message}
                </AlertDescription>
              </Alert>
            )}
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              disabled={loading}
            >
              {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setMessage('')
                setEmail('')
                setPassword('')
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-semibold mb-2">
              ⚠️ Configuração necessária no Supabase:
            </p>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
              <li>Acesse o Dashboard do Supabase</li>
              <li>Vá em Authentication → URL Configuration</li>
              <li>Adicione esta URL em "Site URL" e "Redirect URLs":</li>
              <li className="font-mono bg-white p-1 rounded mt-1 break-all">
                {typeof window !== 'undefined' ? window.location.origin : 'https://seu-dominio.com'}
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
