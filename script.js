// 🔑 SUPABASE CONFIG
const supabase = window.supabase.createClient(
  "https://vnbnilagdulhwfekcxkh.supabase.co",
  "sb_publishable_3skPZ2D5nVd49Utq1zlIJA_DuyaW7kX"
);

const container = document.getElementById("apps");

// LOAD APPS
async function loadApps() {
  container.innerHTML = "Loading...";

  const { data, error } = await supabase
    .from("apps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML = "Error: " + error.message;
    return;
  }

  container.innerHTML = "";

  data.forEach(app => {
    container.innerHTML += `
      <div class="card">
        <img src="${app.image_url}">
        <div class="card-body">
          <b>${app.name}</b>
          <p>⬇ ${app.downloads_count} | 👁 ${app.views_count}</p>
          <div class="btn" onclick="openDetail('${app.id}')">Detail</div>
        </div>
      </div>
    `;
  });
}

// DETAIL PAGE
async function openDetail(id) {
  const { data } = await supabase
    .from("apps")
    .select("*")
    .eq("id", id)
    .single();

  // tambah view
  await supabase
    .from("apps")
    .update({ views_count: data.views_count + 1 })
    .eq("id", id);

  document.body.innerHTML = `
    <div style="padding:15px">
      <h2>${data.name}</h2>
      <img src="${data.image_url}" style="width:100%;border-radius:10px">

      <p>${data.description}</p>

      <p><b>Versi:</b> ${data.version}</p>
      <p><b>Size:</b> ${data.size}</p>
      <p><b>Developer:</b> ${data.developer}</p>

      <p>👁 ${data.views_count + 1} | ⬇ ${data.downloads_count}</p>

      <button onclick="downloadApp('${data.id}','${data.download_link}',${data.downloads_count})">
        Download
      </button>

      <br><br>
      <button onclick="location.reload()">Kembali</button>
    </div>
  `;
}

// DOWNLOAD
async function downloadApp(id, link, count) {
  await supabase
    .from("apps")
    .update({ downloads_count: count + 1 })
    .eq("id", id);

  window.location.href = link;
}

// START
loadApps();
