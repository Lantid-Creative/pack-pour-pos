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
      inventory_inflows: {
        Row: {
          added_by: string
          added_by_name: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          store_id: string
        }
        Insert: {
          added_by: string
          added_by_name: string
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          store_id: string
        }
        Update: {
          added_by?: string
          added_by_name?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
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
      products: {
        Row: {
          category: string
          created_at: string
          id: string
          low_stock_threshold: number
          name: string
          pack_size: string
          price: number
          stock: number
          store_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          low_stock_threshold?: number
          name: string
          pack_size: string
          price?: number
          stock?: number
          store_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
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
          store_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          store_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
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
          id: string
          pack_size: string
          product_id: string
          product_name: string
          quantity: number
          sale_id: string
          unit_price: number
        }
        Insert: {
          id?: string
          pack_size: string
          product_id: string
          product_name: string
          quantity: number
          sale_id: string
          unit_price: number
        }
        Update: {
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
      sales: {
        Row: {
          cashier_id: string
          cashier_name: string
          created_at: string
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          store_id: string
          total: number
        }
        Insert: {
          cashier_id: string
          cashier_name: string
          created_at?: string
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          store_id: string
          total?: number
        }
        Update: {
          cashier_id?: string
          cashier_name?: string
          created_at?: string
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          store_id?: string
          total?: number
        }
        Relationships: [
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
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name: string
          owner_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
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
      add_inventory_inflow: {
        Args: {
          p_added_by: string
          p_added_by_name: string
          p_product_id: string
          p_quantity: number
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
      seed_role_permissions: {
        Args: { p_store_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "owner" | "manager" | "cashier"
      payment_method: "cash" | "pos" | "transfer"
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
      payment_method: ["cash", "pos", "transfer"],
      subscription_plan: ["starter", "business", "enterprise"],
      subscription_status: ["active", "expired", "cancelled", "pending"],
    },
  },
} as const
