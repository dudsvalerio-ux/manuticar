export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      makes: {
        Row: {
          id: string
          name: string
          logo_path: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          logo_path?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_path?: string | null
          created_at?: string
        }
      }
      models: {
        Row: {
          id: string
          make_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          make_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          make_id?: string
          name?: string
          created_at?: string
        }
      }
      vehicle_variants: {
        Row: {
          id: string
          model_id: string
          year: number
          engine: string
          trim: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          model_id: string
          year: number
          engine: string
          trim?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          model_id?: string
          year?: number
          engine?: string
          trim?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      plan_sources: {
        Row: {
          id: string
          source_type: 'manual_pdf' | 'manual_web'
          title: string
          year: number | null
          pages_or_section: string | null
          file_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source_type: 'manual_pdf' | 'manual_web'
          title: string
          year?: number | null
          pages_or_section?: string | null
          file_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          source_type?: 'manual_pdf' | 'manual_web'
          title?: string
          year?: number | null
          pages_or_section?: string | null
          file_url?: string | null
          created_at?: string
        }
      }
      maintenance_plans: {
        Row: {
          id: string
          variant_id: string | null
          plan_type: 'official' | 'generic'
          title: string
          source_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          variant_id?: string | null
          plan_type: 'official' | 'generic'
          title: string
          source_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          variant_id?: string | null
          plan_type?: 'official' | 'generic'
          title?: string
          source_id?: string | null
          created_at?: string
        }
      }
      maintenance_plan_items: {
        Row: {
          id: string
          plan_id: string
          item_key: string
          item_name_ptbr: string
          intervalo_km: number | null
          intervalo_meses: number | null
          action: 'trocar' | 'inspecionar' | 'trocar/inspecionar'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          item_key: string
          item_name_ptbr: string
          intervalo_km?: number | null
          intervalo_meses?: number | null
          action: 'trocar' | 'inspecionar' | 'trocar/inspecionar'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          item_key?: string
          item_name_ptbr?: string
          intervalo_km?: number | null
          intervalo_meses?: number | null
          action?: 'trocar' | 'inspecionar' | 'trocar/inspecionar'
          notes?: string | null
          created_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          user_id: string
          variant_id: string | null
          custom_make: string | null
          custom_model: string | null
          custom_year: number | null
          custom_engine: string | null
          apelido: string | null
          odometro_atual: number
          data_atualizacao_odometro: string
          observacoes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          variant_id?: string | null
          custom_make?: string | null
          custom_model?: string | null
          custom_year?: number | null
          custom_engine?: string | null
          apelido?: string | null
          odometro_atual: number
          data_atualizacao_odometro?: string
          observacoes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          variant_id?: string | null
          custom_make?: string | null
          custom_model?: string | null
          custom_year?: number | null
          custom_engine?: string | null
          apelido?: string | null
          odometro_atual?: number
          data_atualizacao_odometro?: string
          observacoes?: string | null
          created_at?: string
        }
      }
      maintenance_items: {
        Row: {
          id: string
          vehicle_id: string
          item_key: string | null
          nome: string
          intervalo_km: number | null
          intervalo_meses: number | null
          km_ultimo_servico: number | null
          data_ultimo_servico: string | null
          ativo: boolean
          source_plan_item_id: string | null
          source_type: 'manual' | 'generic' | 'custom'
          override: boolean
          notas: string | null
          created_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          item_key?: string | null
          nome: string
          intervalo_km?: number | null
          intervalo_meses?: number | null
          km_ultimo_servico?: number | null
          data_ultimo_servico?: string | null
          ativo?: boolean
          source_plan_item_id?: string | null
          source_type: 'manual' | 'generic' | 'custom'
          override?: boolean
          notas?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          item_key?: string | null
          nome?: string
          intervalo_km?: number | null
          intervalo_meses?: number | null
          km_ultimo_servico?: number | null
          data_ultimo_servico?: string | null
          ativo?: boolean
          source_plan_item_id?: string | null
          source_type?: 'manual' | 'generic' | 'custom'
          override?: boolean
          notas?: string | null
          created_at?: string
        }
      }
      service_records: {
        Row: {
          id: string
          vehicle_id: string
          maintenance_item_id: string
          data_servico: string
          km_no_dia: number
          custo: number | null
          local: string | null
          notas: string | null
          tipo: 'troca' | 'rodízio' | 'inspeção' | null
          created_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          maintenance_item_id: string
          data_servico: string
          km_no_dia: number
          custo?: number | null
          local?: string | null
          notas?: string | null
          tipo?: 'troca' | 'rodízio' | 'inspeção' | null
          created_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          maintenance_item_id?: string
          data_servico?: string
          km_no_dia?: number
          custo?: number | null
          local?: string | null
          notas?: string | null
          tipo?: 'troca' | 'rodízio' | 'inspeção' | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
