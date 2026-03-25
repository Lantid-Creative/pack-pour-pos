export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      crate_deposits: {
        Row: {
          crates_brought: number
          crates_owed: number
          crates_required: number
          created_at: string
          deposit_amount: number
          id: string
          product_id: string
          returned_at: string | null
          returned_by: string | null
          returned_by_name: string | null
          sale_id: string
          status: string
          store_id: string
        }
        Insert: {
          crates_brought?: number
          crates_owed?: number
          crates_required?: number
          created_at?: string
          deposit_amount?: number
          id?: string
          product_id: string
          returned_at?: string | null
          returned_by?: string | null
          returned_by_name?: string | null
          sale_id: string
          status?: string
          store_id: string
        }
        Update: {
          crates_brought?: number
          crates_owed?: number
          crates_required?: number
          created_at?: string
          deposit_amount?: number
          id?: string
          product_id?: string
          returned_at?: string | null
          returned_by?: string | null
          returned_by_name?: string | null
          sale_id?: string
          status?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crate_deposits_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crate_deposits_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crate_deposits_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      crate_tracking: {
        Row: {
          empty_crates: number
          filled_crates: number
          id: string
          product_id: string
          store_id: string
          total_crates: number
          updated_at: string
        }
        Insert: {
          empty_crates?: number
          filled_crates?: number
          id?: string
          product_id: string
          store_id: string
          total_crates?: number
          updated_at?: string
        }
        Update: {
          empty_crates?: number
          filled_crates?: number
          id?: string
          product_id?: string
          store_id?: string
          total_crates?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crate_tracking_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crate_tracking_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          payment_method: string
          recorded_by: string
          recorded_by_name: string
          sale_id: string
          store_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string
          recorded_by: string
          recorded_by_name: string
          sale_id: string
          store_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string
          recorded_by?: string
          recorded_by_name?: string
          sale_id?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_payments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_payments_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          store_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          store_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_inflows: {
        Row: {
          added_by: string
          added_by_name: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          reason: string
          store_id: string
        }
        Insert: {
          added_by: string
          added_by_name: string
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          reason?: string
          store_id: string
        }
        Update: {
          added_by?: string
          added_by_name?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          reason?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_inflows_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_inflows_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_outflows: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          reason: string
          removed_by: string
          removed_by_name: string
          store_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          reason?: string
          removed_by: string
          removed_by_name: string
          store_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          reason?: string
          removed_by?: string
          removed_by_name?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_outflows_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_outflows_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      product_price_tiers: {
        Row: {
          created_at: string
          id: string
          max_quantity: number | null
          min_quantity: number
          price: number
          product_id: string
          store_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_quantity?: number | null
          min_quantity: number
          price: number
          product_id: string
          store_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_quantity?: number | null
          min_quantity?: number
          price?: number
          product_id?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_price_tiers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_price_tiers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          bulk_min_quantity: number | null
          bulk_price: number | null
          category: string
          cost_price: number
          crate_deposit_amount: number
          created_at: string
          id: string
          is_crate_product: boolean
          low_stock_threshold: number
          name: string
          pack_size: string
          price: number
          stock: number
          store_id: string
        }
        Insert: {
          bulk_min_quantity?: number | null
          bulk_price?: number | null
          category: string
          cost_price?: number
          crate_deposit_amount?: number
          created_at?: string
          id?: string
          is_crate_product?: boolean
          low_stock_threshold?: number
          name: string
          pack_size: string
          price?: number
          stock?: number
          store_id: string
        }
        Update: {
          bulk_min_quantity?: number | null
          bulk_price?: number | null
          category?: string
          cost_price?: number
          crate_deposit_amount?: number
          created_at?: string
          id?: string
          is_crate_product?: boolean
          low_stock_threshold?: number
          name?: string
          pack_size?: string
          price?: number
          stock?: number
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          lifetime_access: boolean
          phone: string | null
          store_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          lifetime_access?: boolean
          phone?: string | null
          store_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          lifetime_access?: boolean
          phone?: string | null
          store_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          permission: string
          role: Database["public"]["Enums"]["app_role"]
          store_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          permission: string
          role: Database["public"]["Enums"]["app_role"]
          store_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          permission?: string
          role?: Database["public"]["Enums"]["app_role"]
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          cost_price: number
          id: string
          pack_size: string
          product_id: string
          product_name: string
          quantity: number
          sale_id: string
          unit_price: number
        }
        Insert: {
          cost_price?: number
          id?: string
          pack_size: string
          product_id: string
          product_name: string
          quantity: number
          sale_id: string
          unit_price: number
        }
        Update: {
          cost_price?: number
          id?: string
          pack_size?: string
          product_id?: string
          product_name?: string
          quantity?: number
          sale_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_method: string
          sale_id: string
          store_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          payment_method: string
          sale_id: string
          store_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_method?: string
          sale_id?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_payments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_payments_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          cashier_id: string
          cashier_name: string
          created_at: string
          credit_status: string | null
          customer_id: string | null
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          store_id: string
          total: number
        }
        Insert: {
          cashier_id: string
          cashier_name: string
          created_at?: string
          credit_status?: string | null
          customer_id?: string | null
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          store_id: string
          total?: number
        }
        Update: {
          cashier_id?: string
          cashier_name?: string
          created_at?: string
          credit_status?: string | null
          customer_id?: string | null
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          store_id?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string
          owner_id: string
          phone: string | null
          printer_type: string
          receipt_footer: string
          receipt_header: string
          receipt_show_address: boolean
          receipt_show_phone: boolean
          surcharges_enabled: boolean
          trial_ends_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name: string
          owner_id: string
          phone?: string | null
          printer_type?: string
          receipt_footer?: string
          receipt_header?: string
          receipt_show_address?: boolean
          receipt_show_phone?: boolean
          surcharges_enabled?: boolean
          trial_ends_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          phone?: string | null
          printer_type?: string
          receipt_footer?: string
          receipt_header?: string
          receipt_show_address?: boolean
          receipt_show_phone?: boolean
          surcharges_enabled?: boolean
          trial_ends_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          paystack_reference: string | null
          paystack_subscription_code: string | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          started_at: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          store_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          paystack_reference?: string | null
          paystack_subscription_code?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          store_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          paystack_reference?: string | null
          paystack_subscription_code?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      surcharges: {
        Row: {
          charge_amount: number
          created_at: string
          enabled: boolean
          id: string
          label: string
          max_amount: number
          min_amount: number
          store_id: string
        }
        Insert: {
          charge_amount?: number
          created_at?: string
          enabled?: boolean
          id?: string
          label?: string
          max_amount?: number
          min_amount?: number
          store_id: string
        }
        Update: {
          charge_amount?: number
          created_at?: string
          enabled?: boolean
          id?: string
          label?: string
          max_amount?: number
          min_amount?: number
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "surcharges_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          store_id: string
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          store_id: string
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_inventory_inflow:
        | {
            Args: {
              p_added_by: string
              p_added_by_name: string
              p_product_id: string
              p_quantity: number
              p_store_id: string
            }
            Returns: string
          }
        | {
            Args: {
              p_added_by: string
              p_added_by_name: string
              p_product_id: string
              p_quantity: number
              p_reason?: string
              p_store_id: string
            }
            Returns: string
          }
      complete_sale: {
        Args: {
          p_cashier_id: string
          p_cashier_name: string
          p_items: Json
          p_payment_method: Database["public"]["Enums"]["payment_method"]
          p_store_id: string
          p_total: number
        }
        Returns: string
      }
      get_user_role: {
        Args: { _store_id: string; _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_store_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _store_id: string
          _user_id: string
        }
        Returns: boolean
      }
      reduce_inventory: {
        Args: {
          p_product_id: string
          p_quantity: number
          p_reason?: string
          p_removed_by: string
          p_removed_by_name: string
          p_store_id: string
        }
        Returns: string
      }
      seed_role_permissions: {
        Args: { p_store_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "owner" | "manager" | "cashier"
      payment_method: "cash" | "pos" | "transfer" | "credit" | "split"
      subscription_plan: "starter" | "business" | "enterprise"
      subscription_status: "active" | "expired" | "cancelled" | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "manager", "cashier"],
      payment_method: ["cash", "pos", "transfer", "credit", "split"],
      subscription_plan: ["starter", "business", "enterprise"],
      subscription_status: ["active", "expired", "cancelled", "pending"],
    },
  },
} as const
