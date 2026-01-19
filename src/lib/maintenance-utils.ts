import { addMonths, differenceInDays, isPast, isAfter } from 'date-fns'

export type MaintenanceStatus = 'vencido' | 'vencendo' | 'ok' | 'sem_dados'

export interface MaintenanceItem {
  id: string
  nome: string
  intervalo_km: number | null
  intervalo_meses: number | null
  km_ultimo_servico: number | null
  data_ultimo_servico: string | null
  ativo: boolean
  source_type: 'manual' | 'generic' | 'custom'
}

export interface StatusCalculation {
  status: MaintenanceStatus
  proximo_km: number | null
  proxima_data: Date | null
  faltam_km: number | null
  faltam_dias: number | null
}

/**
 * Calcula o status de um item de manutenção baseado em KM e tempo
 */
export function calculateMaintenanceStatus(
  item: MaintenanceItem,
  odometroAtual: number
): StatusCalculation {
  const hoje = new Date()
  
  let statusKm: MaintenanceStatus = 'sem_dados'
  let statusTempo: MaintenanceStatus = 'sem_dados'
  let proximo_km: number | null = null
  let proxima_data: Date | null = null
  let faltam_km: number | null = null
  let faltam_dias: number | null = null

  // Cálculo por KM
  if (item.intervalo_km && item.km_ultimo_servico !== null) {
    proximo_km = item.km_ultimo_servico + item.intervalo_km
    faltam_km = proximo_km - odometroAtual

    if (odometroAtual > proximo_km) {
      statusKm = 'vencido'
    } else if (odometroAtual >= proximo_km - (0.10 * item.intervalo_km)) {
      statusKm = 'vencendo'
    } else {
      statusKm = 'ok'
    }
  }

  // Cálculo por tempo
  if (item.intervalo_meses && item.data_ultimo_servico) {
    const dataUltimoServico = new Date(item.data_ultimo_servico)
    proxima_data = addMonths(dataUltimoServico, item.intervalo_meses)
    faltam_dias = differenceInDays(proxima_data, hoje)

    if (isPast(proxima_data) && !isAfter(hoje, proxima_data)) {
      statusTempo = 'ok'
    } else if (isAfter(hoje, proxima_data)) {
      statusTempo = 'vencido'
    } else if (faltam_dias <= 30) {
      statusTempo = 'vencendo'
    } else {
      statusTempo = 'ok'
    }
  }

  // Status final: pior entre KM e tempo
  let statusFinal: MaintenanceStatus = 'sem_dados'
  
  const statuses = [statusKm, statusTempo].filter(s => s !== 'sem_dados')
  
  if (statuses.length === 0) {
    statusFinal = 'sem_dados'
  } else if (statuses.includes('vencido')) {
    statusFinal = 'vencido'
  } else if (statuses.includes('vencendo')) {
    statusFinal = 'vencendo'
  } else {
    statusFinal = 'ok'
  }

  return {
    status: statusFinal,
    proximo_km,
    proxima_data,
    faltam_km,
    faltam_dias
  }
}

/**
 * Retorna a cor do badge baseado no status
 */
export function getStatusColor(status: MaintenanceStatus): string {
  switch (status) {
    case 'vencido':
      return 'bg-red-500 text-white'
    case 'vencendo':
      return 'bg-yellow-500 text-black'
    case 'ok':
      return 'bg-green-500 text-white'
    case 'sem_dados':
      return 'bg-gray-400 text-white'
  }
}

/**
 * Retorna o texto do status
 */
export function getStatusText(status: MaintenanceStatus): string {
  switch (status) {
    case 'vencido':
      return 'Vencido'
    case 'vencendo':
      return 'Vencendo'
    case 'ok':
      return 'OK'
    case 'sem_dados':
      return 'Sem dados'
  }
}

/**
 * Retorna a cor do badge de fonte
 */
export function getSourceBadgeColor(sourceType: 'manual' | 'generic' | 'custom'): string {
  switch (sourceType) {
    case 'manual':
      return 'bg-blue-500 text-white'
    case 'generic':
      return 'bg-purple-500 text-white'
    case 'custom':
      return 'bg-orange-500 text-white'
  }
}

/**
 * Retorna o texto do badge de fonte
 */
export function getSourceBadgeText(sourceType: 'manual' | 'generic' | 'custom'): string {
  switch (sourceType) {
    case 'manual':
      return 'Manual'
    case 'generic':
      return 'Genérico'
    case 'custom':
      return 'Personalizado'
  }
}
