(function () {
    "use strict";
  
    const select = document.getElementById("tipoProjeto");
    const btn = document.getElementById("btnContinuar");
    document.getElementById("year").textContent = new Date().getFullYear();
  
    const map = { app: "app.html", site: "site.html" };
  
    // Permite link direto: seudominio.com/?tipo=site ou ?tipo=app
    const param = new URLSearchParams(window.location.search).get("tipo");
    if (param && map[param.toLowerCase()]) {
      select.value = map[param.toLowerCase()];
      btn.disabled = false;
    }
  
    select.addEventListener("change", () => {
      btn.disabled = !select.value;
    });
  
    function go() {
      if (select.value) window.location.href = select.value;
    }
  
    btn.addEventListener("click", go);
    select.addEventListener("keydown", (e) => {
      if (e.key === "Enter") go();
    });
  })();