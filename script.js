function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();

  const weekday = now
    .toLocaleDateString("es-ES", { weekday: "short" })
    .replace(".", "")
    .toUpperCase();

  const time = now
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();

  if (clock) {
    clock.textContent = `${weekday} ${time}`;
  }
}

function updateYear() {
  const y = document.getElementById("year");
  if (y) {
    y.textContent = new Date().getFullYear();
  }
}

function setupWindowSystem() {
  const windows = document.querySelectorAll(".app-window");
  const openProjectBtns = document.querySelectorAll(".open-project-window");
  const aboutBtn = document.querySelector(".menu-about-btn");

  // 🔹 Contenidos de tus proyectos
  const PROJECTS = {
    p1: {
      title: "",
      body: `
        <p><strong>2022 – Full Stack Developer | Tribunal Administrativo</strong></p>
        <p>
          Desarrollo de múltiples sistemas internos:
<br>
          * Oficialía de Partes,
<br>
          * Estrados Electrónicos,
<br>
          * Control de Incidentes,
<br>
          * Sitio web oficial centrado en accesibilidad y transparencia.
<br>
        Apoyo en infraestructura TI: configuración de servidores, cableado RJ45, soporte de red.
        </p>
       
      `,
    },
    p2: {
      title: "",
      body: `
        <p><strong>2023 – Full Stack Developer | Aplicación Web Móvil (Instituto Médico Deportivo)</strong></p>
        <p>
        * Diseño y desarrollo de aplicación web móvil para registro de rutinas y seguimiento de progreso.
<br>
        * Implementación de ajustes automáticos de repeticiones según rendimiento del usuario.
<br>
        * Creación de interfaz responsive para mejorar experiencia y retención de usuarios.
        </p>
      `,
    },
    p3: {
      title: "",
      body: `
        <p><strong>2024 – Full Stack Developer | Modernización de Sistema Escolar</strong></p>
        <p>
          Actualización y rediseño de módulos heredados para mejorar rendimiento y usabilidad.
<br>
          Desarrollo de nuevas funcionalidades clave:
<br>
          * Módulo de Entrega de Uniformes Escolares.
<br>
          * Seguimiento de entregas por institución.
<br>
          * Control de incidencias para uniformes no entregados.
<br>
          * Reemplazo de componentes obsoletos con versiones modernas, optimizando flujos y estabilidad.
        </p>

      `,
    },
  };

  function setActiveWindow(win) {
    windows.forEach((w) => w.classList.remove("active"));
    if (win) {
      win.classList.add("active");
    }
  }

  function openWindow(win) {
    if (!win) return;
    win.classList.remove("hidden", "minimized", "anim-minimize");
    setActiveWindow(win);
  }

  // 🔹 Abrir ventana de proyecto (P1, P2, P3)
  openProjectBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const projectId = btn.dataset.projectId; // p1, p2, p3
      const projectWindow = document.getElementById("app-window-project");
      if (!projectWindow) return;

      const titleEl = projectWindow.querySelector(".app-window-title");
      const bodyEl = projectWindow.querySelector(".app-window-body");

      const project = PROJECTS[projectId];

      if (project) {
        if (titleEl) titleEl.textContent = project.title;
        if (bodyEl) bodyEl.innerHTML = project.body;
      } else {
        if (titleEl) titleEl.textContent = "Proyecto";
        if (bodyEl) bodyEl.innerHTML =
          "<p>Contenido no disponible para este proyecto.</p>";
      }

      openWindow(projectWindow);
    });
  });

  // 🔹 Abrir ventana "Sobre mí"
  if (aboutBtn) {
    aboutBtn.addEventListener("click", () => {
      const win = document.getElementById("app-window-about");
      openWindow(win);
    });
  }

  // 🔹 Foco al hacer click en la ventana
  windows.forEach((win) => {
    win.addEventListener("mousedown", () => {
      setActiveWindow(win);
    });
  });

  // 🔹 Controles de cada ventana + arrastre
  windows.forEach((win) => {
    const btnClose = win.querySelector(".app-window-btn-close");
    const btnMin = win.querySelector(".app-window-btn-min");
    const btnMax = win.querySelector(".app-window-btn-max");
    const header = win.querySelector(".app-window-header");

    let isMaximized = false;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // Cerrar
    if (btnClose) {
      btnClose.addEventListener("click", () => {
        win.classList.add("hidden");
        win.classList.remove("minimized", "maximized", "anim-minimize");
        isMaximized = false;
      });
    }

    // Minimizar
    if (btnMin) {
      btnMin.addEventListener("click", () => {
        win.classList.remove("maximized");
        isMaximized = false;
        win.classList.add("anim-minimize");
        setTimeout(() => {
          win.classList.remove("anim-minimize");
          win.classList.add("minimized");
        }, 180);
      });
    }

    // Maximizar / restaurar
    if (btnMax) {
      btnMax.addEventListener("click", () => {
        if (isMaximized) {
          win.classList.remove("maximized");
          isMaximized = false;
        } else {
          win.classList.add("maximized");
          isMaximized = true;
        }
      });
    }

    // Arrastrar
    if (header) {
      header.addEventListener("mousedown", (e) => {
        const isButton =
          e.target.classList.contains("traffic-btn") ||
          e.target.closest(".traffic-lights");
        if (isButton) return;
        if (isMaximized) return;

        isDragging = true;
        win.classList.add("dragging");
        setActiveWindow(win);

        const rect = win.getBoundingClientRect();

        if (getComputedStyle(win).transform !== "none") {
          win.style.left = rect.left + "px";
          win.style.top = rect.top + "px";
          win.style.transform = "none";
        }

        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      const newLeft = e.clientX - dragOffsetX;
      const newTop = e.clientY - dragOffsetY;
      win.style.left = newLeft + "px";
      win.style.top = newTop + "px";
    }

    function onMouseUp() {
      if (!isDragging) return;
      isDragging = false;
      win.classList.remove("dragging");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    // ESC para cerrar la ventana
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !win.classList.contains("hidden")) {
        win.classList.add("hidden");
        win.classList.remove("minimized", "maximized", "anim-minimize");
        isMaximized = false;
      }
    });
  });
}

updateClock();
updateYear();
setupWindowSystem();
setInterval(updateClock, 30 * 1000);
