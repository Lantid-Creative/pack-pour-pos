import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEMO_EMAIL = 'demo@lantid.store';
const DEMO_PASSWORD = 'Demo#login#to#$TORE';
const DEMO_STORE_NAME = 'Demo Wholesale Drinks';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    // Check if demo user already exists
    const { data: existingUsers } = await admin.auth.admin.listUsers();
    let demoUser = existingUsers?.users?.find(u => u.email === DEMO_EMAIL);

    if (demoUser) {
      // Demo already seeded, just return success
      return new Response(JSON.stringify({ success: true, message: 'Demo account ready' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 1. Create demo auth user
    const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: 'Demo Store Owner' }
    });

    if (createErr) throw new Error(`Create user: ${createErr.message}`);
    const userId = newUser.user.id;

    // 2. Update profile with lifetime access
    await admin.from('profiles').update({
      full_name: 'Demo Store Owner',
      lifetime_access: true,
    }).eq('user_id', userId);

    // 3. Create demo store
    const { data: store, error: storeErr } = await admin.from('stores').insert({
      name: DEMO_STORE_NAME,
      owner_id: userId,
      address: '45 Marina Road, Lagos Island, Lagos',
      phone: '08012345678',
      receipt_header: 'Demo Wholesale Drinks',
      receipt_footer: 'Thank you for shopping with us!',
    }).select().single();

    if (storeErr) throw new Error(`Create store: ${storeErr.message}`);
    const storeId = store.id;

    // Update profile store_id
    await admin.from('profiles').update({ store_id: storeId }).eq('user_id', userId);

    // 4. Assign owner role
    await admin.from('user_roles').insert({ user_id: userId, store_id: storeId, role: 'owner' });

    // 5. Seed role permissions
    await admin.rpc('seed_role_permissions', { p_store_id: storeId });

    // 6. Insert demo products
    const products = [
      { name: 'Coca-Cola 35cl', category: 'Soft Drink', pack_size: 'Crate (24 bottles)', price: 4200, cost_price: 3600, stock: 85, low_stock_threshold: 10 },
      { name: 'Coca-Cola 50cl', category: 'Soft Drink', pack_size: 'Pack (12 bottles)', price: 2800, cost_price: 2400, stock: 62, low_stock_threshold: 10 },
      { name: 'Fanta Orange 35cl', category: 'Soft Drink', pack_size: 'Crate (24 bottles)', price: 4200, cost_price: 3600, stock: 45, low_stock_threshold: 10 },
      { name: 'Sprite 35cl', category: 'Soft Drink', pack_size: 'Crate (24 bottles)', price: 4200, cost_price: 3600, stock: 38, low_stock_threshold: 10 },
      { name: 'Pepsi 50cl', category: 'Soft Drink', pack_size: 'Pack (12 bottles)', price: 2600, cost_price: 2200, stock: 54, low_stock_threshold: 10 },
      { name: 'Star Lager 60cl', category: 'Beer', pack_size: 'Crate (12 bottles)', price: 5400, cost_price: 4800, stock: 72, low_stock_threshold: 10 },
      { name: 'Gulder Lager 60cl', category: 'Beer', pack_size: 'Crate (12 bottles)', price: 5400, cost_price: 4800, stock: 30, low_stock_threshold: 10 },
      { name: 'Heineken 33cl', category: 'Beer', pack_size: 'Pack (24 bottles)', price: 9600, cost_price: 8400, stock: 25, low_stock_threshold: 5 },
      { name: 'Trophy Lager 60cl', category: 'Beer', pack_size: 'Crate (12 bottles)', price: 4800, cost_price: 4200, stock: 40, low_stock_threshold: 10 },
      { name: 'Maltina 33cl', category: 'Malt Drink', pack_size: 'Pack (24 bottles)', price: 4800, cost_price: 4200, stock: 55, low_stock_threshold: 10 },
      { name: 'Amstel Malta 33cl', category: 'Malt Drink', pack_size: 'Pack (24 bottles)', price: 5200, cost_price: 4600, stock: 42, low_stock_threshold: 10 },
      { name: 'Eva Water 75cl', category: 'Water', pack_size: 'Pack (12 bottles)', price: 1800, cost_price: 1400, stock: 100, low_stock_threshold: 15 },
      { name: '7Up 35cl', category: 'Soft Drink', pack_size: 'Crate (24 bottles)', price: 4000, cost_price: 3400, stock: 33, low_stock_threshold: 10 },
      { name: 'Fearless Energy 50cl', category: 'Energy Drink', pack_size: 'Pack (12 bottles)', price: 3600, cost_price: 3000, stock: 28, low_stock_threshold: 8 },
      { name: 'Climax Energy 33cl', category: 'Energy Drink', pack_size: 'Pack (24 cans)', price: 7200, cost_price: 6200, stock: 18, low_stock_threshold: 5 },
      { name: 'Chi Exotic 1L', category: 'Juice', pack_size: 'Pack (12 bottles)', price: 4800, cost_price: 4200, stock: 20, low_stock_threshold: 5 },
      { name: 'Five Alive Pulpy 1L', category: 'Juice', pack_size: 'Pack (12 bottles)', price: 5400, cost_price: 4700, stock: 22, low_stock_threshold: 5 },
      { name: 'Goldberg Lager 60cl', category: 'Beer', pack_size: 'Crate (12 bottles)', price: 4800, cost_price: 4200, stock: 35, low_stock_threshold: 10 },
    ];

    const { data: insertedProducts, error: prodErr } = await admin.from('products')
      .insert(products.map(p => ({ ...p, store_id: storeId })))
      .select();

    if (prodErr) throw new Error(`Insert products: ${prodErr.message}`);

    // 7. Create demo staff users
    const staffMembers = [
      { email: 'cashier1.demo@lantid.store', name: 'Amina Bello', role: 'cashier' },
      { email: 'cashier2.demo@lantid.store', name: 'Chidi Okonkwo', role: 'cashier' },
      { email: 'manager.demo@lantid.store', name: 'Funke Adeyemi', role: 'manager' },
    ];

    const staffUserIds: { id: string; name: string; role: string }[] = [];

    for (const staff of staffMembers) {
      const { data: sUser, error: sErr } = await admin.auth.admin.createUser({
        email: staff.email,
        password: 'DemoStaff123!',
        email_confirm: true,
        user_metadata: { full_name: staff.name }
      });
      if (sErr) continue;

      await admin.from('profiles').update({ full_name: staff.name, store_id: storeId }).eq('user_id', sUser.user.id);
      await admin.from('user_roles').insert({ user_id: sUser.user.id, store_id: storeId, role: staff.role });
      staffUserIds.push({ id: sUser.user.id, name: staff.name, role: staff.role });
    }

    // 8. Generate demo sales history (past 30 days)
    const allCashiers = [
      { id: userId, name: 'Demo Store Owner' },
      ...staffUserIds.filter(s => s.role === 'cashier').map(s => ({ id: s.id, name: s.name })),
    ];
    const paymentMethods = ['cash', 'pos', 'transfer'] as const;

    // Generate 60 sales across the last 30 days
    for (let i = 0; i < 60; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const hour = 8 + Math.floor(Math.random() * 10); // 8am - 6pm
      const minute = Math.floor(Math.random() * 60);
      const saleDate = new Date();
      saleDate.setDate(saleDate.getDate() - daysAgo);
      saleDate.setHours(hour, minute, 0, 0);

      const cashier = allCashiers[Math.floor(Math.random() * allCashiers.length)];
      const payMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      // Pick 1-4 random products for this sale
      const numItems = 1 + Math.floor(Math.random() * 4);
      const shuffled = [...insertedProducts!].sort(() => 0.5 - Math.random());
      const saleProducts = shuffled.slice(0, numItems);

      const items = saleProducts.map(p => {
        const qty = 1 + Math.floor(Math.random() * 5);
        return {
          product_id: p.id,
          product_name: p.name,
          pack_size: p.pack_size,
          quantity: qty,
          unit_price: p.price,
          cost_price: p.cost_price,
        };
      });

      const total = items.reduce((sum, it) => sum + it.unit_price * it.quantity, 0);

      // Insert sale
      const { data: sale, error: saleErr } = await admin.from('sales').insert({
        store_id: storeId,
        cashier_id: cashier.id,
        cashier_name: cashier.name,
        total,
        payment_method: payMethod,
        created_at: saleDate.toISOString(),
      }).select().single();

      if (saleErr || !sale) continue;

      // Insert sale items
      await admin.from('sale_items').insert(
        items.map(it => ({ ...it, sale_id: sale.id }))
      );
    }

    // 9. Add some inventory inflows
    for (let i = 0; i < 12; i++) {
      const product = insertedProducts![Math.floor(Math.random() * insertedProducts!.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      const inflowDate = new Date();
      inflowDate.setDate(inflowDate.getDate() - daysAgo);

      await admin.from('inventory_inflows').insert({
        store_id: storeId,
        product_id: product.id,
        quantity: 10 + Math.floor(Math.random() * 50),
        added_by: userId,
        added_by_name: 'Demo Store Owner',
        created_at: inflowDate.toISOString(),
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Demo account created and populated' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
