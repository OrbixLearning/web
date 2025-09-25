
# Orbix Front-End — Relatório de Entrega (4 semanas)

> **Período:** 01–25/09/2025  
> **Stack:** Angular 20, Angular Material, PrimeNG, RxJS, Chart.js, date-fns  
> **Repositório:** `OrbixLearning/web`

Este README foi preparado para o cliente com o objetivo de **documentar o que foi feito** durante o ciclo de 4 semanas de desenvolvimento do _Front-End Orbix_.

---

## ✅ Resumo das Entregas

- **Atualização do Angular**
  - Upgrade inicial para **v20.2.2** e estabilização do ecossistema (Material/PrimeNG).
  - Nova rodada de atualização para **v20.3.1** (12/09/2025) para acompanhar _builders_ e corrigir _warnings_.
- **Correção de erros críticos de bibliotecas**
  - Ajustes de _builders_ no `angular.json` (migração para `@angular/build:*`).
  - _Deps_ atualizadas e sincronizadas entre Angular Material/PrimeNG/zone.js.
- **Tema Claro/Escuro**
  - Criação do botão de alternância no **Header**.
  - Implementação de _theming_ via **CSS variables**; _tokens_ base e persistência de preferência do usuário.
- **Ajustes de Lógica de Tema**
  - Padronização de carregamento/aplicação de tema ao entrar/sair de instituição e no _bootstrap_.
- **Projeto em White Board**
---

## 🧭 Telas Criadas / Atualizadas

### `views/main`
1. **Home**
2. **Institute**
3. **Classroom**
4. **Learning-Path**
5. **Profile**
6. **Report (Fale Conosco)**
7. **Syllabus**

### `components`
1. **Account-card** — simplificado para **exibir apenas `account.email`** (com _avatar_ opcional).
2. **Chat** — novo _header_, botão de limpar, _textarea_ + ações, _file input_ com `onFileSelected`.
3. **Classroom-card** — UI refeita (ícone, estatísticas, “última atividade” com `date-fns`).
4. **Discipline-card** — **novo** componente (progresso, média, barra de progresso).
5. **Header** — botão de **Tema** (light/dark), menu de perfil com **Perfil/Sair**, _profile picture_.
6. **Learning-path-card** — visual e semântica revisados; _status overlays_ (gerando/erro).
7. **Pop-ups** (diálogos) — ver lista abaixo.
8. **Sidebar** — revisões de layout e compatibilidade com tema claro.
9. **Syllabus** — melhorias estruturais, tags e navegação.
10. **Syllabus-tags** — etiquetas da ementa.

### **Pop-ups** (criados/atualizados)
- **Adicionar Membros**
- **Documentos**
- **Erro** (Error Pop-Up)
- **Sucesso**
- **Criação da Classroom**
- **Confirmação**
- **Edição do Syllabus**
- **Criação da Learning-Path**
- **Botão de Pop-up** / **Botão do Header**
- **Criação do Syllabus**
- **Edição do Syllabus**
- **Deleção do Syllabus**
- **Criação de usuário**

> Todos os pop-ups receberam padronização visual (header, rodapé de ações, _spacing_), acessibilidade mínima (rótulos/ARIA básicos) e adequação ao sistema de temas.

---

## 🔁 Rotas & Navegação

- Nova rota **`/syllabus`** (Syllabus Home).
- Estrutura de **Dashboard de Classroom**:
  - `/overview`, `/performance`, `/topics`, `/students`, `/syllabus/:syllabusId`, `/student/:studentId`.
- **Guards**:
  - `InstitutionGuard` restringindo rotas a **ADMIN/TEACHER**.
- **Back global**:
  - Botão de voltar reutilizável (`Location.back()`), presente no **Header** e em **Profile**.
  
---

## 🎨 Theming (Claro/Escuro)

- **CSS variables** centralizadas para cores, _tokens_ base e coerência visual.
- Botão no Header (`light_mode` / `dark_mode`) alterna tema e persiste escolha.
- Aplicação de tema por contexto de **instituição** ou uso do tema global salvo.

---

## 🧰 Dev & Build

- **`angular.json`**: migração de _builders_ para `@angular/build:*` (`application`, `dev-server`, `extract-i18n`, `karma`).
- **Dependências** (principais trechos do `package.json`):
  - Angular **20.3.x**
  - Material **20.2.2**
  - PrimeNG **20.1.2**, `@primeng/themes` **20.1.1**
  - `zone.js` **0.15.1**, `rxjs` **7.8.2**, `typescript` **5.9.2**
  - Inclusão de `date-fns` para exibição de tempos relativos.
- **Lockfile**: remoção do `package-lock.json` (adoção de fluxo limpo de dependências).

> **Requisitos sugeridos:** Node.js 20 LTS+, npm 10+.  
> **Executar localmente:**  
> ```bash
> npm ci
> npx ng serve    # http://localhost:4200
> ```
> **Build de produção:**  
> ```bash
> npx ng build --configuration=prod
> ```
> **Testes:**  
> ```bash
> npx ng test
> ```

---

## 🔎 Padrões de UI/UX aplicados

- Layouts consistentes (cards, headers, espaçamentos, responsividade básica).
- Melhor contraste/legibilidade, foco/estado ativo em campos (ex.: barras de busca, _textareas_ do chat).
- **Upload de arquivos** e _feedbacks_ de status em pop-ups de Documentos e Geração de Learning Path.
- **Acessibilidade** mínima: labels, `aria-label` em botões icônicos e hierarquia tipográfica.

---

## 🧩 Destaques Técnicos

- **Account Card**: ajuste para **exibir apenas `account.email`** — simplificação visual e semântica.
- **Profile**: botão flutuante `add_a_photo` + _input_ nativo; _go back_ via `Location.back()`.
- **Classroom Card**: contadores (módulos, alunos, professores) e “última atividade” (`formatDistanceToNow`).
- **Chat**: reestruturação do _template_, _textarea_ com _Enter_ para enviar, e suporte a anexos.
- **Syllabus & Pop-ups**: padronização de casca do diálogo (`pop-up-container`, _header/footer_), rolagem interna e responsividade.

---

## 📅 Linha do Tempo (resumo de commits relevantes)

- **03/09/2025**
  - `chore(deps):` atualização de dependências npm.
  - `chore:` ajustes e finalização da atualização Angular (base 20.2.2).
- **04/09/2025**
  - `style(theme):` tokens base claro/escuro.
  - `feat(guard):` **InstitutionGuard**.
  - `feat(header/home):` integração do Header e ações.
- **08/09/2025**
  - `build(deps):` **date-fns**.
  - `feat(style):` _theming_ com **CSS variables**.
  - `refactor(ui):` **ClassroomCard**, **Sidebar**, **Home**.
- **09/09/2025**
  - Correções visuais e de layout (Learning Path, Classroom, Chat).
- **12/09/2025**
  - **Upgrade Angular para 20.3.1** (por `@BrunoPB`).
  - Novas páginas de membros, configurações e documentos da Classroom.
- **17–19/09/2025**
  - Merges e fixes nos _dashboards_ (students/syllabus/performance).
  - Padronização de `@inputs` e estilos (Discipline Card, etc.).
- **24–25/09/2025**
  - Rotas (texto, áudio, vídeo, questões, flashcards) e **Syllabus Home**.
  - Padronização de Pop-ups (deletar _preset_, _success/error_, header/rodapé).
  - **feat(account-card):** mostrar **somente `account.email`**.
  - **feat(profile):** voltar com `Location.back()`.
  - Conclusão de componentes pendentes (Profile, Fale Conosco, Sidebar).

> _Observação:_ Houve diversos merges (`development`, `master`, `feat/create-homepage`) durante o período, com **65 commits** e **126 arquivos modificados** (≈ **7.246 adições** / **18.033 deleções**), refletindo a grande reestruturação do projeto.

---

## 📌 Observações & Quebras Conhecidas

- **Builders** do Angular migrados — necessário CLI compatível (já incluso nas _devDependencies_).
- **Lockfile** removido — recomenda-se padronizar gerenciador de pacotes (npm) no CI/CD.
- **Temas**: se a instituição não possui _style_ próprio, o app aplica o **tema global** salvo (claro/escuro).

---

## ▶️ Como Demonstrar ao Cliente

1. **Alternância de Tema**: clique no ícone **claro/escuro** no Header.
2. **Account Card**: conferir listas de contas vinculadas exibindo **apenas o e-mail**.
3. **Classroom Card**: ver contadores e “última atividade” atualizada.
4. **Chat**: enviar mensagem com **Enter**, anexar arquivo e limpar histórico.
5. **Pop-ups**: criar/editar/excluir itens de Syllabus e Documentos com _feedback_ visual.

---

## 👥 Equipe / Autores (Commits citados)

- **@asnorferreira** — coordenação de features, theming, cards, rotas, pop-ups, integrações.
- **@Ranmdom** — rotas (áudio/vídeo/questões/flashcards), Pop-ups de criação, Sidebar e telas finais.

---

## 📄 Licença
Projeto interno do cliente Orbix. Direitos reservados.

