export {};

// Requiere que el dev server esté corriendo (npm run dev)
// Uso: npx tsx scripts/create-admin.ts

const BASE_URL = "http://localhost:3000";
const email = "admin@cataplan.co";
const password = "Admin2025!";

(async () => {
  console.log(`Creando admin en ${BASE_URL}...`);

  const res = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": BASE_URL,
    },
    body: JSON.stringify({ email, password, name: "Admin" }),
  });

  const data = await res.json();

  if (res.ok) {
    console.log("✅ Usuario admin creado:");
    console.log("   Email:    ", email);
    console.log("   Password: ", password);
    console.log("   Ahora ve a: http://localhost:3000/admin");
  } else {
    const msg = data?.message ?? data?.error ?? JSON.stringify(data);
    if (res.status === 422 || String(msg).toLowerCase().includes("exist")) {
      console.log("⚠️  El usuario ya existe. Inicia sesión con:");
      console.log("   Email:    ", email);
      console.log("   Password: ", password);
    } else {
      console.error("❌ Error:", msg);
    }
  }
})();
