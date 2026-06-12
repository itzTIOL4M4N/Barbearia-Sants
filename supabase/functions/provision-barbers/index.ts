// One-shot: cria contas dos barbeiros com role 'barbeiro'.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BARBERS = [
  { name: "Lipão",  email: "lipao@barbeariasants.com",   password: "Lipao@Sants2026" },
  { name: "Arthur", email: "arthur@barbeariasants.com",  password: "Arthur@Sants2026" },
  { name: "Gabriel",email: "gabriel@barbeariasants.com", password: "Gabriel@Sants2026" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const results: any[] = [];

  // remove barbeiros obsoletos
  const OBSOLETE = ["felipe@barbeariasants.com"];
  const { data: allUsers } = await admin.auth.admin.listUsers();
  for (const email of OBSOLETE) {
    const u = allUsers?.users.find((x) => x.email === email);
    if (u) {
      await admin.from("user_roles").delete().eq("user_id", u.id);
      await admin.from("profiles").delete().eq("user_id", u.id);
      await admin.auth.admin.deleteUser(u.id);
      results.push({ removed: email });
    }
  }

  for (const b of BARBERS) {
    // tenta criar
    const { data: created, error } = await admin.auth.admin.createUser({
      email: b.email,
      password: b.password,
      email_confirm: true,
      user_metadata: { full_name: b.name, role: "barbeiro" },
    });

    let userId = created?.user?.id;

    if (error && !userId) {
      // já existe -> busca pelo email
      const { data: list } = await admin.auth.admin.listUsers();
      const found = list?.users.find((u) => u.email === b.email);
      userId = found?.id;
      if (userId) {
        await admin.auth.admin.updateUserById(userId, {
          password: b.password,
          email_confirm: true,
          user_metadata: { full_name: b.name, role: "barbeiro" },
        });
      }
    }

    if (userId) {
      // garante role barbeiro
      await admin.from("user_roles").delete().eq("user_id", userId);
      await admin.from("user_roles").insert({ user_id: userId, role: "barbeiro" });
      await admin.from("profiles").upsert(
        { user_id: userId, full_name: b.name, phone: "" },
        { onConflict: "user_id" },
      );
    }

    results.push({ name: b.name, email: b.email, ok: !!userId, error: error?.message });
  }

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
