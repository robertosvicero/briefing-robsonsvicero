(function () {
    "use strict";
  
    const form = document.getElementById("briefingForm");
    if (!form) return;
  
    const steps = Array.from(document.querySelectorAll(".step"));
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    const btnSubmit = document.getElementById("btnSubmit");
    const progressBar = document.getElementById("progressBar");
    const progressLabel = document.getElementById("progressLabel");
    const statusEl = document.getElementById("formStatus");
    const successBox = document.getElementById("successBox");
    const btnNew = document.getElementById("btnNew");
    const lgpd = document.getElementById("lgpd");
    const lgpdError = document.getElementById("lgpdError");
    const STORAGE_KEY = form.dataset.storage || "briefing_draft";
    const ENDPOINT = form.getAttribute("action");
    const IGNORED = ["_gotcha", "_subject", "tipo_briefing"];
  
    let current = 0;
  
    document.getElementById("year").textContent = new Date().getFullYear();
  
    /* ---------- Navegação ---------- */
    function showStep(index, scroll) {
      steps.forEach((s, i) => s.classList.toggle("is-active", i === index));
      current = index;
  
      const total = steps.length;
      progressBar.style.width = ((index + 1) / total) * 100 + "%";
      progressLabel.textContent = "Etapa " + (index + 1) + " de " + total;
  
      btnPrev.hidden = index === 0;
      btnNext.hidden = index === total - 1;
      btnSubmit.hidden = index !== total - 1;
  
      statusEl.textContent = "";
      statusEl.classList.remove("is-error");
  
      if (scroll !== false) {
        const top = document.getElementById("briefing").getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    }
  
    /* ---------- Validação ---------- */
    function validateField(el) {
      const field = el.closest(".field");
      if (!field) return true;
      let valid = true;
  
      if (el.hasAttribute("required") && !el.value.trim()) valid = false;
  
      if (valid && el.type === "email" && el.value.trim()) {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
      }
      if (valid && el.type === "tel" && el.value.trim()) {
        valid = el.value.replace(/\D/g, "").length >= 10;
      }
  
      field.classList.toggle("has-error", !valid);
      return valid;
    }
  
    function validateStep(index) {
      const stepEl = steps[index];
      const fields = stepEl.querySelectorAll("input[required]:not([type=checkbox]), textarea[required], select[required]");
      let firstInvalid = null;
      let ok = true;
  
      fields.forEach((el) => {
        if (!validateField(el)) {
          ok = false;
          if (!firstInvalid) firstInvalid = el;
        }
      });
  
      if (index === steps.length - 1) {
        const accepted = lgpd.checked;
        lgpdError.classList.toggle("is-visible", !accepted);
        if (!accepted) { ok = false; if (!firstInvalid) firstInvalid = lgpd; }
      }
  
      if (firstInvalid) firstInvalid.focus();
      return ok;
    }
  
    form.addEventListener("input", (e) => {
      const field = e.target.closest(".field");
      if (field && field.classList.contains("has-error")) validateField(e.target);
      saveDraft();
    });
    form.addEventListener("change", saveDraft);
    lgpd.addEventListener("change", () => {
      if (lgpd.checked) lgpdError.classList.remove("is-visible");
    });
  
    btnNext.addEventListener("click", () => {
      if (validateStep(current)) showStep(current + 1);
    });
    btnPrev.addEventListener("click", () => showStep(current - 1));
  
    /* ---------- Máscara de telefone ---------- */
    const tel = document.getElementById("telefone");
    if (tel) {
      tel.addEventListener("input", () => {
        let v = tel.value.replace(/\D/g, "").slice(0, 11);
        if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
        else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
        else if (v.length > 0) v = "(" + v;
        tel.value = v;
      });
    }
  
    /* ---------- Rascunho (localStorage) ---------- */
    function saveDraft() {
      try {
        const data = {};
        Array.from(form.elements).forEach((el) => {
          if (!el.name || IGNORED.includes(el.name)) return;
          if (el.type === "checkbox" || el.type === "radio") {
            if (el.checked) {
              data[el.name] = data[el.name] || [];
              data[el.name].push(el.value);
            }
          } else {
            data[el.name] = el.value;
          }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: data, step: current }));
      } catch (_) { /* storage indisponível */ }
    }
  
    function loadDraft() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw);
        const data = saved.data || {};
  
        Array.from(form.elements).forEach((el) => {
          if (!el.name || IGNORED.includes(el.name) || !(el.name in data)) return;
          if (el.type === "checkbox" || el.type === "radio") {
            el.checked = Array.isArray(data[el.name]) && data[el.name].includes(el.value);
          } else if (typeof data[el.name] === "string") {
            el.value = data[el.name];
          }
        });
        if (typeof saved.step === "number" && saved.step < steps.length) current = saved.step;
      } catch (_) { /* ignora */ }
    }
  
    function clearDraft() {
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    }
  
    /* ---------- Envio (Formspree) ---------- */
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validateStep(current)) return;
  
      for (let i = 0; i < steps.length - 1; i++) {
        if (!validateStep(i)) { showStep(i); return; }
      }
  
      btnSubmit.disabled = true;
      btnSubmit.classList.add("is-loading");
      btnSubmit.querySelector(".btn_label").textContent = "Enviando…";
      statusEl.textContent = "";
      statusEl.classList.remove("is-error");
  
      try {
        const response = await fetch(ENDPOINT, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
  
        if (response.ok) {
          clearDraft();
          form.hidden = true;
          document.querySelector(".progress").hidden = true;
          progressLabel.hidden = true;
          successBox.hidden = false;
          window.scrollTo({ top: successBox.offsetTop - 80, behavior: "smooth" });
        } else {
          const result = await response.json().catch(() => ({}));
          const msg = result.errors
            ? result.errors.map((err) => err.message).join(", ")
            : "Não foi possível enviar. Tente novamente.";
          throw new Error(msg);
        }
      } catch (err) {
        statusEl.textContent = err.message || "Erro de conexão. Verifique sua internet e tente novamente.";
        statusEl.classList.add("is-error");
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("is-loading");
        btnSubmit.querySelector(".btn_label").textContent = "Enviar briefing";
      }
    });
  
    /* ---------- Novo briefing ---------- */
    btnNew.addEventListener("click", () => {
      form.reset();
      clearDraft();
      form.hidden = false;
      document.querySelector(".progress").hidden = false;
      progressLabel.hidden = false;
      successBox.hidden = true;
      showStep(0);
    });
  
    /* ---------- Init ---------- */
    loadDraft();
    showStep(current, false);
  })();