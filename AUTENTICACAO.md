# Sistema de Autenticação - Montink ERP

## ✅ Implementado

### 1. **Contexto de Autenticação**
- Criado `AuthContext.jsx` com gerenciamento de estado de usuário
- Funcções: `login()`, `logout()`, `isAuthenticated()`
- Persistência no localStorage
- Verificação automática de usuário logado

### 2. **Componente de Proteção de Rotas**
- `ProtectedRoute.jsx` - protege rotas administrativas
- Redireciona para login se não autenticado
- Loading state durante verificação

### 3. **Layout Administrativo**
- `AdminLayout.jsx` - layout para painel admin
- Sidebar com navegação
- Botão de logout integrado na área do usuário
- Link para visualizar a loja

### 4. **Página de Login**
- `Login.jsx` atualizada com integração ao contexto
- Credenciais de demonstração: `admin` / `admin123`
- Redirecionamento automático após login
- Link para a loja pública

### 5. **Página da Loja Pública**
- `Loja.jsx` - acesso público sem autenticação
- CSS próprio (`loja.css`) com design moderno
- Carrinho de compras funcional
- Sistema de cupons

### 6. **Roteamento Renovado**
- `/loja` - Página pública da loja
- `/login` - Página de login
- `/admin/*` - Rotas protegidas do painel administrativo
- Redirecionamentos automáticos das rotas antigas

## 🎯 Como Usar

### **Acesso Público (Loja)**
1. Visite: `http://localhost:3001` (página principal)
2. Navegue pelos produtos
3. Adicione ao carrinho
4. Use cupons de desconto
5. Acesse `/institucional` para informações da empresa

### **Acesso Administrativo**
1. Acesse: `http://localhost:3001/login`
2. Use credenciais: `admin` / `admin123`
3. Navegue pelo painel administrativo em `/admin`
4. Use os links na sidebar para ver a loja pública e página institucional

### **Logout**
- Clique no botão 🚪 na área do usuário (sidebar)
- Confirme a ação no popup
- Será redirecionado para o login

## 🗂️ Estrutura de Rotas

```
/                    → Loja pública (página principal)
/institucional       → Página institucional pública
/login              → Página de login
/admin              → Dashboard administrativo (protegido)
/admin/pedidos      → Gestão de pedidos (protegido)
/admin/produtos     → Gestão de produtos (protegido)
/admin/cupons       → Gestão de cupons (protegido)
/loja               → Redireciona para / (alias)
```

## 🎨 Recursos Visuais

- **Loading states** durante autenticação
- **Feedback visual** para login/logout
- **Design responsivo** em todas as páginas
- **Botão de logout** integrado ao sidebar
- **Link da loja** destacado no painel admin

## 🔧 Arquivos Criados/Modificados

### Novos Arquivos:
- `src/contexts/AuthContext.jsx`
- `src/components/ProtectedRoute.jsx`
- `src/components/AdminLayout.jsx`
- `src/css/loja.css`

### Arquivos Modificados:
- `src/App.jsx` - Sistema de roteamento completo
- `src/pages/Login.jsx` - Integração com contexto
- `src/App.css` - Estilos para logout e loading
- `package.json` - Adicionado prop-types

## 🚀 Próximos Passos

1. **Backend de Autenticação**: Implementar API real de login
2. **JWT Tokens**: Substituir localStorage por tokens seguros
3. **Permissões**: Sistema de roles/permissões
4. **Recuperação de Senha**: Funcionalidade de reset
5. **Session Timeout**: Logout automático por inatividade

## 📝 Credenciais de Teste

- **Usuário**: `admin`
- **Senha**: `admin123`

O sistema está funcionando com autenticação simulada, perfeito para desenvolvimento e demonstração!
