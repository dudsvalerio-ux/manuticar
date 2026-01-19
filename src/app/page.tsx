'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Car, AlertCircle, CheckCircle, Clock, Database, Plus, Settings } from 'lucide-react'
import { calculateMaintenanceStatus, getStatusColor, getStatusText, getSourceBadgeColor, getSourceBadgeText } from '@/lib/maintenance-utils'
import type { Database } from '@/lib/types'

type Vehicle = Database['public']['Tables']['vehicles']['Row']
type MaintenanceItem = Database['public']['Tables']['maintenance_items']['Row']

interface MaintenanceWithStatus extends MaintenanceItem {
  status: string
  proximo_km: number | null
  proxima_data: Date | null
  faltam_km: number | null
  faltam_dias: number | null
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Contadores de status
  const vencidos = maintenanceItems.filter(item => item.status === 'vencido' && item.ativo).length
  const vencendo = maintenanceItems.filter(item => item.status === 'vencendo' && item.ativo).length
  const ok = maintenanceItems.filter(item => item.status === 'ok' && item.ativo).length
  const semDados = maintenanceItems.filter(item => item.status === 'sem_dados' && item.ativo).length

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadVehicles()
    }
  }, [user])

  useEffect(() => {
    if (selectedVehicle) {
      loadMaintenanceItems()
    }
  }, [selectedVehicle])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
    } else {
      setUser(user)
    }
    setLoading(false)
  }

  const loadVehicles = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      setVehicles(data)
      setSelectedVehicle(data[0])
    }
  }

  const loadMaintenanceItems = async () => {
    if (!selectedVehicle) return

    const { data, error } = await supabase
      .from('maintenance_items')
      .select('*')
      .eq('vehicle_id', selectedVehicle.id)
      .order('nome')

    if (data) {
      const itemsWithStatus = data.map(item => {
        const calc = calculateMaintenanceStatus(item, selectedVehicle.odometro_atual)
        return {
          ...item,
          status: calc.status,
          proximo_km: calc.proximo_km,
          proxima_data: calc.proxima_data,
          faltam_km: calc.faltam_km,
          faltam_dias: calc.faltam_dias
        }
      })

      // Ordenar por prioridade: Vencidos > Vencendo > OK > Sem dados
      const sorted = itemsWithStatus.sort((a, b) => {
        const priority: any = { vencido: 0, vencendo: 1, ok: 2, sem_dados: 3 }
        return priority[a.status] - priority[b.status]
      })

      setMaintenanceItems(sorted)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    )
  }

  if (!selectedVehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">ManutCar</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>

          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>Nenhum veículo cadastrado</CardTitle>
              <CardDescription>
                Cadastre seu primeiro veículo para começar a controlar as manutenções
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push('/vehicles/new')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Veículo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ManutCar</h1>
              <p className="text-sm text-gray-600">
                {selectedVehicle.apelido || `${selectedVehicle.custom_make || ''} ${selectedVehicle.custom_model || ''}`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/vehicles')}>
              <Settings className="w-4 h-4 mr-2" />
              Veículos
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>

        {/* Odômetro */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Odômetro atual</p>
                <p className="text-3xl font-bold">{selectedVehicle.odometro_atual.toLocaleString()} km</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                Atualizar Odômetro
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-red-500">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Vencidos</CardDescription>
              <CardTitle className="text-3xl font-bold text-red-500">
                {vencidos}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-yellow-500">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Vencendo</CardDescription>
              <CardTitle className="text-3xl font-bold text-yellow-600">
                {vencendo}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-green-500">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">OK</CardDescription>
              <CardTitle className="text-3xl font-bold text-green-500">
                {ok}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-gray-400">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Sem dados</CardDescription>
              <CardTitle className="text-3xl font-bold text-gray-500">
                {semDados}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Lista de Manutenções */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Manutenções</CardTitle>
              <Button
                onClick={() => router.push(`/vehicles/${selectedVehicle.id}/maintenance`)}
                variant="outline"
                size="sm"
              >
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {maintenanceItems.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum item de manutenção cadastrado
              </p>
            ) : (
              <div className="space-y-3">
                {maintenanceItems.slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{item.nome}</h3>
                        <Badge className={getStatusColor(item.status as any)}>
                          {getStatusText(item.status as any)}
                        </Badge>
                        <Badge className={getSourceBadgeColor(item.source_type)}>
                          {getSourceBadgeText(item.source_type)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {item.proximo_km && (
                          <p>Próximo: {item.proximo_km.toLocaleString()} km {item.faltam_km !== null && `(faltam ${item.faltam_km.toLocaleString()} km)`}</p>
                        )}
                        {item.proxima_data && (
                          <p>Próximo: {new Date(item.proxima_data).toLocaleDateString()} {item.faltam_dias !== null && `(faltam ${item.faltam_dias} dias)`}</p>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Registrar Serviço
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
