# Decision log

> Registro de decisiones de proyecto. Formato por entrada: fecha + decisión + razón + cuándo reabrir.

<!-- ## YYYY-MM-DD - <título de la decisión>
Decisión: ...
Razón: ...
Reabrir si: ... -->

## 2026-06-07 - Distribución: solo GitHub template. CLI init diferido.
Decisión: el template se distribuye con "Use this template" de GitHub. El script de init/CLI de scaffolding NO se construye ahora.
Razón: el init es el embrión de un CLI; construirlo sin uso real que lo pida es over-engineering. El arranque por checklist (SETUP.md) alcanza.
Reabrir si: el template se usa en varios proyectos y el SETUP manual se vuelve fricción repetida.
